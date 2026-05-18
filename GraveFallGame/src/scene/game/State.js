//------------------------------------------------------------------------------
// Constructor scope
//------------------------------------------------------------------------------

/**
 * Creates a new object.
 *
 * @constructor
 * @extends rune.scene.Scene
 *
 * @class
 * @classdesc
 * * Game scene.
 */
GraveFallGame.scene.Game = function (partyMembers, runPaletteKey) {

    //--------------------------------------------------------------------------
    // Super call
    //--------------------------------------------------------------------------

    /**
     * Calls the constructor method of the super class.
     */
    rune.scene.Scene.call(this);

    /**
     * Party data passed from the CharacterSelect scene.
     *
     * @type {Array}
     */
    this.partyMembers = partyMembers || GraveFallGame.scene.Game.PARTY_MEMBERS || [];

    /**
     * Palette chosen for this started run. It remains stable while the same
     * Game scene runs so the outside campfire and dungeon always match.
     *
     * @type {string}
     */
    this.runPaletteKey = GraveFallGame.scene.Game.resolveRunPaletteKey(runPaletteKey);
    this.runPalette = GraveFallGame.scene.Game.getRunPalette(this.runPaletteKey);
    GraveFallGame.scene.Game.ACTIVE_RUN_PALETTE_KEY = this.runPaletteKey;
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

GraveFallGame.scene.Game.prototype = Object.create(rune.scene.Scene.prototype);
GraveFallGame.scene.Game.prototype.constructor = GraveFallGame.scene.Game;

//------------------------------------------------------------------------------
// Static data
//------------------------------------------------------------------------------

GraveFallGame.scene.Game.PHASE_COMMAND = "command";
GraveFallGame.scene.Game.PHASE_MINIGAME = "minigame";
GraveFallGame.scene.Game.PHASE_ACTION = "action";
GraveFallGame.scene.Game.PHASE_ACTION_PREVIEW = "actionPreview";
GraveFallGame.scene.Game.PHASE_GAME_OVER = "gameOver";
GraveFallGame.scene.Game.PHASE_ENEMY_DEFEATED = "enemyDefeated";

GraveFallGame.scene.Game.LEADERBOARD_PARTY_SIZE_MIN = 1;
GraveFallGame.scene.Game.LEADERBOARD_PARTY_SIZE_MAX = 4;
GraveFallGame.scene.Game.LEADERBOARD_MAX_ENTRIES = 10;
GraveFallGame.scene.Game.HIGHSCORES = GraveFallGame.scene.Game.HIGHSCORES || {};

GraveFallGame.scene.Game.prototype.normalizeLeaderboardPartySize = function (partySize) {
    var parsed = parseInt(partySize, 10);

    if (isNaN(parsed)) {
        parsed = 1;
    }

    parsed = Math.max(
        GraveFallGame.scene.Game.LEADERBOARD_PARTY_SIZE_MIN,
        Math.min(GraveFallGame.scene.Game.LEADERBOARD_PARTY_SIZE_MAX, parsed)
    );

    return parsed;
};

GraveFallGame.scene.Game.getLeaderboardStorageKey = function (partySize) {
    return "gravefall_highscores_" + GraveFallGame.scene.Game.prototype.normalizeLeaderboardPartySize(partySize);
};

GraveFallGame.scene.Game.prototype.getLeaderboardStorageKey = function (partySize) {
    return GraveFallGame.scene.Game.getLeaderboardStorageKey(partySize);
};

GraveFallGame.scene.Game.prototype.normalizeLeaderboardEntry = function (entry, partySize) {
    var score;
    var name;
    var parsedPartySize;

    if (!entry) {
        return null;
    }

    score = parseInt(entry.score, 10);
    if (isNaN(score)) {
        return null;
    }

    name = entry.name !== undefined && entry.name !== null ? String(entry.name).trim() : "";
    if (name.length <= 0) {
        name = "THE FALLEN";
    }

    parsedPartySize = this.normalizeLeaderboardPartySize(
        entry.partySize !== undefined && entry.partySize !== null ? entry.partySize : partySize
    );

    return {
        name: name,
        score: score,
        partySize: parsedPartySize,
        savedAt: entry.savedAt || new Date().toISOString()
    };
};

GraveFallGame.scene.Game.getHighscores = function (partySize) {
    var normalizedPartySize = GraveFallGame.scene.Game.prototype.normalizeLeaderboardPartySize(partySize);
    var key = GraveFallGame.scene.Game.getLeaderboardStorageKey(normalizedPartySize);
    var scores = [];
    var raw = null;
    var parsed;
    var i;
    var entry;

    try {
        if (typeof window !== "undefined" && window.localStorage) {
            raw = window.localStorage.getItem(key);
        }
    } catch (e) {
        raw = null;
    }

    if (raw) {
        try {
            parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                for (i = 0; i < parsed.length; i++) {
                    entry = GraveFallGame.scene.Game.prototype.normalizeLeaderboardEntry(parsed[i], normalizedPartySize);
                    if (entry) {
                        scores.push(entry);
                    }
                }
            }
        } catch (e2) {
            scores = [];
        }
    }

    if (scores.length <= 0 && GraveFallGame.scene.Game.HIGHSCORES && Array.isArray(GraveFallGame.scene.Game.HIGHSCORES[normalizedPartySize])) {
        scores = GraveFallGame.scene.Game.HIGHSCORES[normalizedPartySize].slice();
    }

    scores = scores
        .filter(function (item) {
            return item && typeof item.score === "number";
        })
        .sort(function (a, b) {
            return b.score - a.score;
        })
        .slice(0, GraveFallGame.scene.Game.LEADERBOARD_MAX_ENTRIES);

    return scores;
};

GraveFallGame.scene.Game.saveHighscore = function (name, score, partySize) {
    var normalizedPartySize = GraveFallGame.scene.Game.prototype.normalizeLeaderboardPartySize(partySize);
    var key = GraveFallGame.scene.Game.getLeaderboardStorageKey(normalizedPartySize);
    var scores = GraveFallGame.scene.Game.getHighscores(normalizedPartySize);
    var entry = GraveFallGame.scene.Game.prototype.normalizeLeaderboardEntry({
        name: name,
        score: score,
        partySize: normalizedPartySize
    }, normalizedPartySize);
    var serialized;

    if (!entry) {
        return scores;
    }

    scores.push(entry);
    scores.sort(function (a, b) {
        return b.score - a.score;
    });
    scores = scores.slice(0, GraveFallGame.scene.Game.LEADERBOARD_MAX_ENTRIES);

    if (!GraveFallGame.scene.Game.HIGHSCORES) {
        GraveFallGame.scene.Game.HIGHSCORES = {};
    }
    GraveFallGame.scene.Game.HIGHSCORES[normalizedPartySize] = scores.slice();

    try {
        serialized = JSON.stringify(scores);
        if (typeof window !== "undefined" && window.localStorage) {
            window.localStorage.setItem(key, serialized);
        }
    } catch (e) {
    }

    return scores;
};

GraveFallGame.scene.Game.clearHighscores = function (partySize) {
    var normalizedPartySize = GraveFallGame.scene.Game.prototype.normalizeLeaderboardPartySize(partySize);
    var key = GraveFallGame.scene.Game.getLeaderboardStorageKey(normalizedPartySize);

    if (!GraveFallGame.scene.Game.HIGHSCORES) {
        GraveFallGame.scene.Game.HIGHSCORES = {};
    }

    GraveFallGame.scene.Game.HIGHSCORES[normalizedPartySize] = [];

    try {
        if (typeof window !== "undefined" && window.localStorage) {
            window.localStorage.removeItem(key);
        }
    } catch (e) {
    }

    return [];
};


//------------------------------------------------------------------------------
// Rune debug console input guard
//------------------------------------------------------------------------------

GraveFallGame.scene.Game.isDevConsoleInputActive = function (application) {
    var app = application || (typeof rune !== "undefined" && rune.system && rune.system.Application ? rune.system.Application.instance : null);
    var consoleManager;
    var consoleInstance = null;

    if (!app || !app.screen || !app.screen.console) {
        return false;
    }

    consoleManager = app.screen.console;

    try {
        consoleInstance = consoleManager.instance || consoleManager.m_console || null;
    } catch (error) {
        consoleInstance = consoleManager.m_console || null;
    }

    return !!(consoleInstance && consoleInstance.parent);
};

GraveFallGame.scene.Game.prototype.isDevConsoleInputActive = function () {
    return GraveFallGame.scene.Game.isDevConsoleInputActive(this.application);
};

//------------------------------------------------------------------------------
// Dev-tunable timing defaults
//------------------------------------------------------------------------------

GraveFallGame.scene.Game.DEFAULT_TURN_TIMER_MS = 25000;
GraveFallGame.scene.Game.DEFAULT_MINIGAME_TIMER_MS = 10000;
GraveFallGame.scene.Game.DEV_TURN_TIMER_MS = null;
GraveFallGame.scene.Game.DEV_MINIGAME_TIMER_MS = null;
GraveFallGame.scene.Game.DEV_ACTION_PHASE_FRAMES = null;

GraveFallGame.scene.Game.prototype.getTurnTimerDurationMs = function () {
    var override = GraveFallGame.scene.Game.DEV_TURN_TIMER_MS;

    if (typeof override === "number" && isFinite(override) && override > 0) {
        return override;
    }

    return GraveFallGame.scene.Game.DEFAULT_TURN_TIMER_MS;
};

GraveFallGame.scene.Game.prototype.getTurnTimerLabel = function (ms) {
    var duration = typeof ms === "number" ? ms : this.getTurnTimerDurationMs();
    return String(Math.max(0, Math.ceil(duration / 1000)));
};

GraveFallGame.scene.Game.prototype.resetCommandTurnTimer = function (visible, alpha) {
    this.turnTimerMs = this.getTurnTimerDurationMs();
    this.lastTurnWarningSecond = null;

    if (this.turnTimerText) {
        this.turnTimerText.visible = visible !== false;
        this.turnTimerText.alpha = typeof alpha === "number" ? alpha : (visible === false ? 0 : 1);
        this.turnTimerText.text = this.getTurnTimerLabel(this.turnTimerMs);
    }
};

GraveFallGame.scene.Game.prototype.getMinigameDurationMs = function () {
    var override = GraveFallGame.scene.Game.DEV_MINIGAME_TIMER_MS;

    if (typeof override === "number" && isFinite(override) && override > 0) {
        return override;
    }

    return GraveFallGame.scene.Game.DEFAULT_MINIGAME_TIMER_MS;
};

GraveFallGame.scene.Game.prototype.getActionPhaseDurationFrames = function (enemyConfig) {
    var override = GraveFallGame.scene.Game.DEV_ACTION_PHASE_FRAMES;

    if (typeof override === "number" && isFinite(override) && override > 0) {
        return Math.max(1, Math.floor(override));
    }

    return enemyConfig && enemyConfig.actionPhaseDuration ? enemyConfig.actionPhaseDuration : 230;
};

GraveFallGame.scene.Game.PLAYER_THEMES = [
    {
        accent: "#E53935",
        accentDark: "#3B1010",
        accentLight: "#FF8A80",
        clothing: {
            light: "#FF8A80",
            mid: "#E53935",
            dark: "#8E1B1B"
        }
    },
    {
        accent: "#1E88E5",
        accentDark: "#10263B",
        accentLight: "#82B1FF",
        clothing: {
            light: "#82B1FF",
            mid: "#1E88E5",
            dark: "#0D47A1"
        }
    },
    {
        accent: "#FDD835",
        accentDark: "#3B340F",
        accentLight: "#FFF59D",
        clothing: {
            light: "#FFF59D",
            mid: "#FDD835",
            dark: "#C6A700"
        }
    },
    {
        accent: "#43A047",
        accentDark: "#112F14",
        accentLight: "#A5D6A7",
        clothing: {
            light: "#A5D6A7",
            mid: "#43A047",
            dark: "#1B5E20"
        }
    }
];

GraveFallGame.scene.Game.MONO_ICON_SOURCE = "#c5c5c5";


GraveFallGame.scene.Game.PLAYER_DOWNED_PALETTE = {
    light: "#BDBDBD",
    mid: "#777777",
    dark: "#2F2F2F"
};

GraveFallGame.scene.Game.PLAYER_DAMAGE_STATE_KEYS = [
    "hp100",
    "hp75",
    "hp50",
    "hp25",
    "knockedOut",
    "dead"
];

GraveFallGame.scene.Game.ENEMY_DAMAGE_STATE_KEYS = [
    "hp100",
    "hp75",
    "hp50",
    "hp25",
    "killed"
];



GraveFallGame.scene.Game.CLOTHING_SOURCE = {
    mid: "#b654b7",
    dark: "#942f97",
    light: "#ca75ca"
};

GraveFallGame.scene.Game.PROJECTILE_SOURCE = {
    light: "#ca75ca",
    mid: "#b654b7",
    dark: "#942f97"
};

GraveFallGame.scene.Game.PROJECTILE_NEUTRAL = {
    light: "#ffffff",
    mid: "#b8b8b8",
    dark: "#1f1f1f"
};

GraveFallGame.scene.Game.FRAME_SOURCE = {
    light: "#ca75ca",
    mid: "#b654b7",
    dark: "#942f97"
};

GraveFallGame.scene.Game.UI_SKINS = {
    dungeonGrey: {
        panelTop: "#141312",
        panelBottom: "#100F0E",
        frame: {
            light: "#8F8B85",
            mid: "#5D5953",
            dark: "#2F2C29"
        }
    },
    dullBrown: {
        panelTop: "#211A14",
        panelBottom: "#18120D",
        frame: {
            light: "#B08C68",
            mid: "#7A5B3B",
            dark: "#463322"
        }
    },
    outsideCampfireBrown: {
        panelTop: "#15110D",
        panelBottom: "#0E0A07",
        frame: {
            light: "#765D45",
            mid: "#4E3926",
            dark: "#23180F"
        }
    },
    outsideCampfireGrey: {
        panelTop: "#111111",
        panelBottom: "#0A0A0A",
        frame: {
            light: "#66635F",
            mid: "#3F3C39",
            dark: "#1C1A18"
        }
    },
    outsideCampfireDark: {
        panelTop: "#15110D",
        panelBottom: "#0E0A07",
        frame: {
            light: "#765D45",
            mid: "#4E3926",
            dark: "#23180F"
        }
    }
};


GraveFallGame.scene.Game.RUN_PALETTES = [
    {
        key: "dullBrown",
        name: "Dull Brown",
        insideSkin: "dullBrown",
        outsideSkin: "outsideCampfireBrown"
    },
    {
        key: "dungeonGrey",
        name: "Dungeon Grey",
        insideSkin: "dungeonGrey",
        outsideSkin: "outsideCampfireGrey"
    }
];

(function () {
    var themeNames = [
        "Midnight Rose",
        "Ash Violet",
        "Charcoal Teal",
        "Faded Indigo",
        "Obsidian Amber",
        "Slate Moss",
        "Smoky Sapphire",
        "Dust Plum",
        "Night Orchid",
        "Pale Ember",
        "Storm Brass",
        "Dusk Fern",
        "Moonstone Blue",
        "Tarnished Coral",
        "Hollow Jade",
        "Cinder Lilac",
        "Fog Citrine",
        "Worn Garnet",
        "Silver Thistle",
        "Quiet Umber",
        "Bleak Cyan",
        "Muted Honey",
        "Dark Quartz",
        "Soft Rust",
        "Winter Pine",
        "Pale Onyx",
        "Deep Mauve",
        "Drift Sand"
    ];
    var i;
    var baseHue;
    var insideKey;
    var outsideKey;
    var paletteKey;
    var paletteName;

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function hslToHex(h, s, l) {
        var hue = ((h % 360) + 360) % 360;
        var sat = clamp(s, 0, 100) / 100;
        var light = clamp(l, 0, 100) / 100;
        var c = (1 - Math.abs((2 * light) - 1)) * sat;
        var x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
        var m = light - (c / 2);
        var r = 0;
        var g = 0;
        var b = 0;
        var r255;
        var g255;
        var b255;

        if (hue < 60) {
            r = c; g = x; b = 0;
        } else if (hue < 120) {
            r = x; g = c; b = 0;
        } else if (hue < 180) {
            r = 0; g = c; b = x;
        } else if (hue < 240) {
            r = 0; g = x; b = c;
        } else if (hue < 300) {
            r = x; g = 0; b = c;
        } else {
            r = c; g = 0; b = x;
        }

        r255 = Math.round((r + m) * 255);
        g255 = Math.round((g + m) * 255);
        b255 = Math.round((b + m) * 255);

        return (
            "#" +
            ("0" + r255.toString(16)).slice(-2) +
            ("0" + g255.toString(16)).slice(-2) +
            ("0" + b255.toString(16)).slice(-2)
        ).toUpperCase();
    }

    for (i = 0; i < themeNames.length; i++) {
        baseHue = (18 + (i * 12)) % 360;
        paletteKey = "nocturne" + String(i + 1);
        paletteName = themeNames[i];
        insideKey = paletteKey + "Inside";
        outsideKey = paletteKey + "Outside";

        GraveFallGame.scene.Game.UI_SKINS[insideKey] = {
            panelTop: hslToHex(baseHue, 16, 13),
            panelBottom: hslToHex(baseHue, 14, 9),
            frame: {
                light: hslToHex(baseHue, 14, 58),
                mid: hslToHex(baseHue, 16, 34),
                dark: hslToHex(baseHue, 18, 18)
            }
        };

        GraveFallGame.scene.Game.UI_SKINS[outsideKey] = {
            panelTop: hslToHex(baseHue, 10, 10),
            panelBottom: hslToHex(baseHue, 9, 7),
            frame: {
                light: hslToHex(baseHue, 10, 52),
                mid: hslToHex(baseHue, 12, 28),
                dark: hslToHex(baseHue, 14, 14)
            }
        };

        GraveFallGame.scene.Game.RUN_PALETTES.push({
            key: paletteKey,
            name: paletteName,
            insideSkin: insideKey,
            outsideSkin: outsideKey
        });
    }
})();
GraveFallGame.scene.Game.ACTIVE_RUN_PALETTE_KEY = null;

GraveFallGame.scene.Game.resolveRunPaletteKey = function (key) {
    var palettes = GraveFallGame.scene.Game.RUN_PALETTES;
    var i;

    for (i = 0; i < palettes.length; i++) {
        if (palettes[i].key === key) {
            return key;
        }
    }

    if (GraveFallGame.scene.Game.ACTIVE_RUN_PALETTE_KEY) {
        return GraveFallGame.scene.Game.ACTIVE_RUN_PALETTE_KEY;
    }

    key = GraveFallGame.scene.Game.chooseRunPaletteKey();
    GraveFallGame.scene.Game.ACTIVE_RUN_PALETTE_KEY = key;

    return key;
};

GraveFallGame.scene.Game.chooseRunPaletteKey = function () {
    var palettes = GraveFallGame.scene.Game.RUN_PALETTES;
    var index = Math.floor(Math.random() * palettes.length);

    return palettes[Math.max(0, Math.min(palettes.length - 1, index))].key;
};

GraveFallGame.scene.Game.startNewRunPalette = function () {
    var key = GraveFallGame.scene.Game.chooseRunPaletteKey();

    GraveFallGame.scene.Game.ACTIVE_RUN_PALETTE_KEY = key;

    return GraveFallGame.scene.Game.getRunPalette(key);
};

GraveFallGame.scene.Game.getRunPalette = function (key) {
    var palettes = GraveFallGame.scene.Game.RUN_PALETTES;
    var skins = GraveFallGame.scene.Game.UI_SKINS;
    var palette = palettes[0];
    var i;

    for (i = 0; i < palettes.length; i++) {
        if (palettes[i].key === key) {
            palette = palettes[i];
            break;
        }
    }

    return {
        key: palette.key,
        name: palette.name,
        inside: skins[palette.insideSkin] || skins.dullBrown,
        outside: skins[palette.outsideSkin] || skins.outsideCampfireBrown || skins.dullBrown,
        insideSkin: palette.insideSkin,
        outsideSkin: palette.outsideSkin
    };
};

//------------------------------------------------------------------------------
// Attack minigame data
//------------------------------------------------------------------------------

GraveFallGame.scene.Game.DEFAULT_ATTACK_MINIGAME = "buttonSequence";

GraveFallGame.scene.Game.MINIGAME_DEFINITIONS = {
    buttonMash: {
        id: "buttonMash",
        title: "WARRIOR: MASH",
        setup: "setupButtonMashMinigame",
        update: "updateButtonMashMinigame",
        damagePerCycle: 8,
        maxUsefulPresses: 18
    },
    buttonSequence: {
        id: "buttonSequence",
        title: "WIZARD: SEQUENCE",
        setup: "setupButtonSequenceMinigame",
        update: "updateButtonSequenceMinigame",
        sequenceLength: 5,
        damagePerInput: 1,
        damagePerSequence: 3,
        wrongPenalty: 1
    },
    targetReticle: {
        id: "targetReticle",
        title: "RANGER: AIM",
        setup: "setupTargetReticleMinigame",
        update: "updateTargetReticleMinigame",
        perfectDamage: 5,
        goodDamage: 3,
        okDamage: 1,
        shotCooldownMs: 280,
        settleDurationMs: 850,
        resetDistance: 62
    },
    timingBar: {
        id: "timingBar",
        title: "ROGUE: BACKSTAB",
        setup: "setupTimingBarMinigame",
        update: "updateTimingBarMinigame",
        perfectDamage: 5,
        goodDamage: 3,
        okDamage: 1,
        baseSpeed: 0.22,
        speedVariance: 0.12
    }
};

GraveFallGame.scene.Game.MINIGAME_SPRITE_TODO = [
    { name: "MG_Ranger_Bullseye", size: "16x16", purpose: "Center scoring mark / bullseye for the ranger target" },
    { name: "MG_Ranger_Reticle", size: "16x16", purpose: "Moving ranger reticle / crosshair" },
    { name: "MG_Rogue_Bar_Back", size: "196x20", purpose: "Rogue horizontal timing bar background" },
    { name: "MG_Rogue_HitZone", size: "20x28", purpose: "Rogue center hit-zone marker" },
    { name: "MG_Rogue_Timing_Block", size: "14x24", purpose: "Rogue moving timing rectangle" },
    { name: "MG_Sequence_Slot", size: "42x42", purpose: "Optional wizard sequence slot frame" }
];

GraveFallGame.scene.Game.CLASS_TEMPLATES = [
    {
        id: "fighter",
        name: "Warrior",
        portrait: "Fighter_Portrait",
        classIcon: "Fighter_Icon_T",
        stand: "Fighter_Idle_Stance",
        hpMax: 160,
        flipStandX: false,
        attackMinigame: "buttonMash",
        attackDamage: 5
    },
    {
        id: "assassin",
        name: "Rogue",
        portrait: "Assassin_Portrait",
        classIcon: "Assassin_Icon_T",
        stand: "Assassin_Idle_Stance",
        hpMax: 120,
        flipStandX: false,
        attackMinigame: "timingBar",
        attackDamage: 5
    },
    {
        id: "wizard",
        name: "Wizard",
        portrait: "Wizard_Portrait",
        classIcon: "Wizard_Icon_T",
        stand: "Wizard_Idle_Stance",
        hpMax: 100,
        flipStandX: true,
        attackMinigame: "buttonSequence",
        attackDamage: 5
    },
    {
        id: "ranger",
        name: "Ranger",
        portrait: "Ranger_Portrait",
        classIcon: "Ranger_Icon_T",
        stand: "Ranger_Idle_Stance",
        hpMax: 112,
        flipStandX: true,
        attackMinigame: "targetReticle",
        attackDamage: 5
    }
];

GraveFallGame.scene.Game.PARTY_MEMBERS = [];
GraveFallGame.scene.Game.PARTY_NAME = "THE FALLEN";

GraveFallGame.scene.Game.getPartyMemberFlippedX = function (renderIndex, partySize) {
    if (partySize === 2) {
        return renderIndex === 1;
    }

    if (partySize === 3) {
        return renderIndex === 2;
    }

    if (partySize >= 4) {
        return renderIndex >= 2;
    }

    return false;
};

GraveFallGame.scene.Game.getPartyMenuX = function (renderIndex, partySize, menuWidth, screenWidth) {
    menuWidth = menuWidth || 320;
    screenWidth = screenWidth || 1280;
    partySize = Math.max(1, Math.min(4, partySize || 1));
    renderIndex = Math.max(0, Math.min(partySize - 1, renderIndex || 0));

    if (partySize >= 4) {
        return renderIndex * menuWidth;
    }

    return Math.round(((screenWidth / partySize) * renderIndex) + ((screenWidth / partySize) / 2) - (menuWidth / 2));
};

GraveFallGame.scene.Game.GHOUL_PLACEHOLDER_DAMAGE_STATE_RESOURCES = {
    hp100: "Ghoul_Idle_T",
    hp75: "Ghoul_Bruised_T",
    hp50: "Ghoul_Hurt_T",
    hp25: "Ghoul_Dying_T",
    killed: "Ghoul_Killed_T"
};

GraveFallGame.scene.Game.GOBLIN_PLACEHOLDER_DAMAGE_STATE_RESOURCES = {
    hp100: "Goblin_Idle_T",
    hp75: "Goblin_Bruised_T",
    hp50: "Goblin_Hurt_T",
    hp25: "Goblin_Dying_T",
    killed: "Goblin_Killed_T"
};

// --- DYNAMIC ENEMY SCALING ---
GraveFallGame.scene.Game.ENEMY_DIFFICULTY_HP_BONUS_PER_REPEAT = 10;
GraveFallGame.scene.Game.ENEMY_DIFFICULTY_DAMAGE_BONUS_PER_REPEAT = 0.03;
GraveFallGame.scene.Game.ENEMY_DIFFICULTY_SPEED_BONUS_PER_REPEAT = 0.02;
GraveFallGame.scene.Game.ENEMY_DIFFICULTY_PATTERN_INTERVAL_REDUCTION_PER_REPEAT = 0.02;
GraveFallGame.scene.Game.ENEMY_DIFFICULTY_ACTION_DURATION_REDUCTION_PER_REPEAT = 0.015;
GraveFallGame.scene.Game.ENEMY_DIFFICULTY_MAX_SPEED_MULTIPLIER = 1.75;
GraveFallGame.scene.Game.ENEMY_DIFFICULTY_MIN_PATTERN_INTERVAL_SCALE = 0.65;
GraveFallGame.scene.Game.ENEMY_DIFFICULTY_MIN_ACTION_DURATION_SCALE = 0.75;

GraveFallGame.scene.Game.prototype.getEnemyDifficultyProfile = function (enemyType) {
    var counts = this.enemyDifficultyCounts || {};
    var floor = Math.max(1, this.floorNumber || 1);
    var floorIndex = Math.max(0, floor - 1);
    var resolvedEnemyType = enemyType || this.currentEnemyType || "ghoul";
    var encounterCount = counts[resolvedEnemyType] || 0;
    var repeatCount = Math.max(0, encounterCount - 1);
    var hpBonus = (repeatCount * GraveFallGame.scene.Game.ENEMY_DIFFICULTY_HP_BONUS_PER_REPEAT) + (floorIndex * 4);

    return {
        enemyType: resolvedEnemyType,
        encounterCount: encounterCount,
        repeatCount: repeatCount,
        hpBonus: hpBonus,
        damageMultiplier: 1.0 + (floorIndex * 0.02) + (repeatCount * GraveFallGame.scene.Game.ENEMY_DIFFICULTY_DAMAGE_BONUS_PER_REPEAT),
        speedMultiplier: Math.min(
            GraveFallGame.scene.Game.ENEMY_DIFFICULTY_MAX_SPEED_MULTIPLIER,
            1.0 + (floorIndex * 0.01) + (repeatCount * GraveFallGame.scene.Game.ENEMY_DIFFICULTY_SPEED_BONUS_PER_REPEAT)
        ),
        patternIntervalScale: Math.max(
            GraveFallGame.scene.Game.ENEMY_DIFFICULTY_MIN_PATTERN_INTERVAL_SCALE,
            1.0 - (floorIndex * 0.01) - (repeatCount * GraveFallGame.scene.Game.ENEMY_DIFFICULTY_PATTERN_INTERVAL_REDUCTION_PER_REPEAT)
        ),
        actionDurationScale: Math.max(
            GraveFallGame.scene.Game.ENEMY_DIFFICULTY_MIN_ACTION_DURATION_SCALE,
            1.0 - (floorIndex * 0.005) - (repeatCount * GraveFallGame.scene.Game.ENEMY_DIFFICULTY_ACTION_DURATION_REDUCTION_PER_REPEAT)
        )
    };
};

GraveFallGame.scene.Game.prototype.registerEnemyEncounter = function (enemyType) {
    var key;
    var profile;

    if (!this.enemyDifficultyCounts) {
        this.enemyDifficultyCounts = {};
    }

    key = enemyType || this.currentEnemyType || "ghoul";
    this.enemyDifficultyCounts[key] = (this.enemyDifficultyCounts[key] || 0) + 1;
    profile = this.getEnemyDifficultyProfile(key);
    this.currentEnemyDifficulty = profile;

    return profile;
};

GraveFallGame.scene.Game.prototype.getDifficultyMultiplier = function () {
    var profile = this.getEnemyDifficultyProfile(this.currentEnemyType);
    return profile.damageMultiplier;
};

GraveFallGame.scene.Game.prototype.getDifficultySpeedMultiplier = function () {
    var profile = this.getEnemyDifficultyProfile(this.currentEnemyType);
    return profile.speedMultiplier;
};

GraveFallGame.scene.Game.ENEMIES = {
    ghoul: {
        name: "Ghoul",
        isBoss: false,
        resource: "Ghoul_Idle_T",
        damageStateResources: GraveFallGame.scene.Game.GHOUL_PLACEHOLDER_DAMAGE_STATE_RESOURCES,
        hpMax: 95,
        actionPhaseDuration: 260,
        patternInterval: 44,
        patterns: [
            "ghoul_orb_crawl",
            "ghoul_dart_ambush",
            "ghoul_stomp_pulse",
            "ghoul_bone_shard_spread",
            "ghoul_skull_drift"
        ]
    },
    cryptImpaler: {
        name: "Crypt Impaler",
        isBoss: false,
        resource: "Ghoul_Idle_T",
        damageStateResources: GraveFallGame.scene.Game.GHOUL_PLACEHOLDER_DAMAGE_STATE_RESOURCES,
        hpMax: 120,
        actionPhaseDuration: 270,
        patternInterval: 42,
        patterns: [
            "placeholder_spear_corridor",
            "ghoul_impaled_sword_drop",
            "placeholder_arrow_crossfire"
        ]
    },
    boneCaller: {
        name: "Bone Caller",
        isBoss: false,
        resource: "Ghoul_Idle_T",
        damageStateResources: GraveFallGame.scene.Game.GHOUL_PLACEHOLDER_DAMAGE_STATE_RESOURCES,
        hpMax: 105,
        actionPhaseDuration: 280,
        patternInterval: 38,
        patterns: [
            "placeholder_skull_ring",
            "placeholder_bone_shard_arc",
            "placeholder_skull_ring",
            "ghoul_bone_shard_spread"
        ]
    },
    crystalHusk: {
        name: "Crystal Husk",
        isBoss: false,
        resource: "Ghoul_Idle_T",
        damageStateResources: GraveFallGame.scene.Game.GHOUL_PLACEHOLDER_DAMAGE_STATE_RESOURCES,
        hpMax: 135,
        actionPhaseDuration: 300,
        patternInterval: 36,
        patterns: [
            "placeholder_crystal_wall",
            "placeholder_crystal_rain",
            "placeholder_crystal_wall",
            "placeholder_orb_split",
            "placeholder_crystal_wall"
        ]
    },
    goblinHorde: {
        name: "Goblin Horde",
        isBoss: true,
        resource: "Goblin_Idle_T",
        damageStateResources: GraveFallGame.scene.Game.GOBLIN_PLACEHOLDER_DAMAGE_STATE_RESOURCES,
        hpMax: 225,
        actionPhaseDuration: 345,
        patternInterval: 44,
        patterns: [
            "goblin_boss_mace_quake",
            "goblin_boss_sword_pincer",
            "goblin_boss_head_toss",
            "goblin_boss_mob_charge",
            "goblin_boss_blade_trap",
            "goblin_boss_fuse_bombs"
        ]
    },
    hyDragon: {
        name: "HyDragon",
        isBoss: true,
        resource: "HyDragon_Idle_T",
        damageStateResources: {
            hp100: "HyDragon_Idle_T",
            hp75: "HyDragon_Bruised_T",
            hp50: "HyDragon_Hurt_T",
            hp25: "HyDragon_Dying_T",
            killed: "HyDragon_Killed_T"
        },
        hpMax: 275,
        actionPhaseDuration: 375,
        patternInterval: 42,
        patterns: [
            "hydragon_fireball_breath",
            "hydragon_fire_wave",
            "hydragon_sword_hunt",
            "hydragon_sword_storm",
            "hydragon_cross_sweep",
            "hydragon_fang_fan",
            "hydragon_roar_quake"
        ]
    }
};

GraveFallGame.scene.Game.prototype.getCurrentEnemyConfig = function () {
    var baseConfig = GraveFallGame.scene.Game.ENEMIES[this.currentEnemyType] || GraveFallGame.scene.Game.ENEMIES.ghoul;
    var profile = this.getEnemyDifficultyProfile ? this.getEnemyDifficultyProfile(this.currentEnemyType) : null;
    var scaledConfig = {};
    var key;
    var repeatCount;
    var actionScale;

    for (key in baseConfig) {
        if (baseConfig.hasOwnProperty(key)) {
            scaledConfig[key] = baseConfig[key];
        }
    }

    repeatCount = profile ? profile.repeatCount : 0;
    actionScale = profile ? profile.actionDurationScale : 1.0;

    playerCount = this.partyMembers ? this.partyMembers.length : (this.getAllPlayerMenus ? this.getAllPlayerMenus().length : (this.playerMenus ? this.playerMenus.length : 1));
    playerCount = Math.max(1, playerCount || 1);

    scaledConfig.hpMax = Math.max(1, Math.floor(((baseConfig.hpMax || 1) + (profile ? profile.hpBonus : 0)) * playerCount));
    scaledConfig.actionPhaseDuration = Math.max(1, Math.floor((baseConfig.actionPhaseDuration || 230) * actionScale));
    scaledConfig.patternInterval = Math.max(
        1,
        Math.floor((baseConfig.patternInterval || 1) * (profile ? profile.patternIntervalScale : 1.0))
    );
    scaledConfig.damageMultiplier = profile ? profile.damageMultiplier : 1.0;
    scaledConfig.speedMultiplier = profile ? profile.speedMultiplier : 1.0;
    scaledConfig.repeatCount = repeatCount;
    scaledConfig.difficultyProfile = profile;

    return scaledConfig;
};

//------------------------------------------------------------------------------
// Audio IDs and helpers
//------------------------------------------------------------------------------

GraveFallGame.MUSIC = {
    DUNGEON_LOOP: "GraveFall_Dungeon_Loop"
};

GraveFallGame.SOUNDS = {
    UI_MOVE: "SFX_UI_Move",
    UI_CONFIRM: "SFX_UI_Confirm",
    UI_BACK: "SFX_UI_Back",
    TURN_WARNING: "SFX_Turn_Warning",
    TURN_TIMEOUT: "SFX_Turn_Timeout",
    PHASE_START: "SFX_Phase_Start",
    PHASE_END: "SFX_Phase_End",
    PLAYER_ATTACK: "SFX_Player_Attack",
    ENEMY_HIT: "SFX_Enemy_Hit",
    ENEMY_DEFEATED: "SFX_Enemy_Defeated",
    PASSAGE_STEPS: "SFX_Passage_Steps",
    PLAYER_HIT: "SFX_Player_Hit",
    PLAYER_DOWNED: "SFX_Player_Downed",
    ITEM_SPAWN: "SFX_Item_Spawn",
    ITEM_PICKUP: "SFX_Item_Pickup",
    ATTACK_SWORD_RAIN: "SFX_Attack_Sword_Rain",
    ATTACK_SWEEP: "SFX_Attack_Sweep",
    ATTACK_ORB: "SFX_Attack_Orb",
    ATTACK_DAGGER: "SFX_Attack_Dagger",
    ATTACK_PEBBLE: "SFX_Attack_Pebble",
    ATTACK_DART: "SFX_Attack_Dart",
    ATTACK_STOMP: "SFX_Attack_Stomp",
    GAME_OVER: "SFX_Game_Over"
};

GraveFallGame.playSound = function (application, soundName, volume, pan, unique) {
    var sound;

    try {
        if (!application || !application.sounds || !application.sounds.sound) {
            return null;
        }

        sound = application.sounds.sound.get(soundName, unique === true);

        if (sound) {
            sound.volume = typeof volume === "number" ? volume : 1;
            sound.pan = typeof pan === "number" ? pan : 0;
            sound.play(true);
        }

        return sound;
    } catch (e) {
        return null;
    }
};

GraveFallGame.playMusic = function (application, musicName, volume, pan) {
    var music;

    try {
        if (!application || !application.sounds || !application.sounds.music) {
            return null;
        }

        music = application.sounds.music.get(musicName, false);

        if (music) {
            music.loop = true;
            music.volume = typeof volume === "number" ? volume : 0.35;
            music.pan = typeof pan === "number" ? pan : 0;
            music.play(true);
        }

        return music;
    } catch (e) {
        return null;
    }
};

GraveFallGame.stopMusic = function (music) {
    try {
        if (music && typeof music.stop === "function") {
            music.stop();
        }
    } catch (e) {
    }
};

GraveFallGame.scene.Game.prototype.playSfx = function (soundName, volume, pan, unique) {
    return GraveFallGame.playSound(this.application, soundName, volume, pan, unique);
};

GraveFallGame.scene.Game.prototype.tintBitmapFieldText = function (field, targetColor, recursive) {
    var i;
    var sourceColors;

    if (!field || !targetColor) {
        return;
    }

    sourceColors = [
        "#ffffff",
        "#fefefe",
        "#f0f0f0",
        "#d0d0d0",
        "#c5c5c5",
        "#000000"
    ];

    if (field.texture && typeof field.texture.replaceColor === "function") {
        for (i = 0; i < sourceColors.length; i++) {
            try {
                field.texture.replaceColor(
                    rune.color.Color24.fromHex(sourceColors[i]),
                    rune.color.Color24.fromHex(targetColor)
                );
            } catch (e) {
            }
        }
    }

    if (recursive !== false && field.children && field.children.length > 0) {
        for (i = 0; i < field.children.length; i++) {
            this.tintBitmapFieldText(field.children[i], targetColor, true);
        }
    }
};

GraveFallGame.scene.Game.prototype.queueSfx = function (delayMs, soundName, volume, pan, unique) {
    if (!this.delayedSfxQueue) {
        this.delayedSfxQueue = [];
    }

    this.delayedSfxQueue.push({
        delayMs: Math.max(0, delayMs || 0),
        soundName: soundName,
        volume: volume,
        pan: pan,
        unique: unique === true
    });
};

GraveFallGame.scene.Game.prototype.startDungeonMusic = function () {
    if (!this.dungeonMusic) {
        this.dungeonMusic = GraveFallGame.playMusic(this.application, GraveFallGame.MUSIC.DUNGEON_LOOP, 0.32);
    }

    return this.dungeonMusic;
};

GraveFallGame.scene.Game.prototype.stopDungeonMusic = function () {
    GraveFallGame.stopMusic(this.dungeonMusic);
    this.dungeonMusic = null;
};

GraveFallGame.scene.Game.prototype.playEnemyPatternSfx = function (patternId) {
    switch (patternId) {
        case "boss_sword_rain":
        case "hydragon_sword_storm":
        case "hydragon_sword_hunt":
        case "ghoul_impaled_sword_drop":
        case "goblin_boss_blade_trap":
        case "boss_vertical_sweep":
        case "hydragon_cross_sweep":
        case "hydragon_fire_wave":
        case "goblin_boss_sword_pincer":
        case "goblin_boss_mob_charge":
        case "attack_lab_fire_spray":
        case "hydragon_fireball_breath":
            this.playSfx(GraveFallGame.SOUNDS.ATTACK_SWEEP, 0.65);
            break;
        case "boss_orb_burst":
        case "ghoul_orb_crawl":
        case "ghoul_skull_drift":
        case "placeholder_skull_ring":
        case "placeholder_orb_split":
        case "experimental_orb_split_chain":
        case "experimental_bouncing_skulls":
        case "attack_lab_homing_wisps":
        case "attack_lab_pulse_orbs":
        case "boss_diagonal_drop":
        case "ghoul_dart_ambush":
        case "ghoul_bone_shard_spread":
        case "placeholder_spear_corridor":
        case "placeholder_arrow_crossfire":
        case "placeholder_bone_shard_arc":
        case "placeholder_crystal_rain":
        case "placeholder_crystal_wall":
        case "hydragon_fang_fan":
            this.playSfx(GraveFallGame.SOUNDS.ATTACK_DAGGER, 0.65);
            break;
        case "goblin_pebble_rain":
        case "goblin_boss_head_toss":
            this.playSfx(GraveFallGame.SOUNDS.ATTACK_PEBBLE, 0.55);
            break;
        case "goblin_dart_fan":
        case "experimental_animated_walkers":
        case "attack_lab_hunter_pack":
            this.playSfx(GraveFallGame.SOUNDS.ATTACK_DART, 0.6);
            break;
        case "goblin_stomp_wave":
        case "goblin_boss_mace_quake":
        case "hydragon_roar_quake":
        case "ghoul_stomp_pulse":
        case "experimental_bomb_cluster":
        case "goblin_boss_fuse_bombs":
        case "attack_lab_fuse_minefield":
            this.playSfx(GraveFallGame.SOUNDS.ATTACK_STOMP, 0.75);
            break;
    }
};

GraveFallGame.scene.Game.prototype.shakeCamera = function (duration, amountX, amountY, easing) {
    var camera;

    try {
        if (!this.cameras || typeof this.cameras.getCameraAt !== "function") {
            return;
        }

        camera = this.cameras.getCameraAt(0);

        if (camera && camera.shake && typeof camera.shake.start === "function") {
            camera.shake.start(
                duration || 180,
                amountX || 6,
                amountY || 6,
                easing !== false
            );
        }
    } catch (e) {
    }
};

GraveFallGame.scene.Game.prototype.shakeOnPlayerDamage = function (damageAmount) {
    var strength = Math.min(14, Math.max(6, Math.round((damageAmount || 0) * 0.65)));
    this.shakeCamera(220, strength, Math.max(5, Math.round(strength * 0.75)), true);
};

//------------------------------------------------------------------------------
// Helper
//------------------------------------------------------------------------------

GraveFallGame.scene.Game.prototype.resourceExists = function (resourceName) {
    return !!(resourceName && this.application && this.application.resources && this.application.resources.get(resourceName));
};

GraveFallGame.scene.Game.prototype.resolveExistingResource = function (candidates, fallbackResource) {
    var i;

    for (i = 0; i < candidates.length; i++) {
        if (this.resourceExists(candidates[i])) {
            return candidates[i];
        }
    }

    return fallbackResource;
};

GraveFallGame.scene.Game.prototype.createDamageStateGroup = function (x, y, width, height, stateConfigs, options) {
    var group = new rune.display.DisplayObjectContainer(x, y, width, height);
    var i;
    var sprite;

    options = options || {};
    group.stateSprites = [];
    group.currentDamageState = null;
    group.damageStateFlippedX = options.flippedX === true;
    group.flippedX = false;

    for (i = 0; i < stateConfigs.length; i++) {
        sprite = new rune.display.Sprite(0, 0, width, height, this.resolveExistingResource([stateConfigs[i].resource], stateConfigs[0].resource));
        sprite.damageState = stateConfigs[i].state;
        sprite.visible = false;
        sprite.flippedX = group.damageStateFlippedX === true;

        group.addChild(sprite);
        group.stateSprites.push(sprite);
    }

    return group;
};

GraveFallGame.scene.Game.prototype.setDamageStateGroupFlippedX = function (group, flippedX) {
    var i;

    if (!group) {
        return;
    }

    group.damageStateFlippedX = flippedX === true;
    group.flippedX = false;

    if (!group.stateSprites) {
        return;
    }

    for (i = 0; i < group.stateSprites.length; i++) {
        group.stateSprites[i].flippedX = group.damageStateFlippedX === true;
    }
};

GraveFallGame.scene.Game.prototype.setDamageStateGroupState = function (group, state) {
    var i;
    var fallbackIndex = 0;

    if (!group || !group.stateSprites) {
        return;
    }

    group.currentDamageState = state;

    for (i = 0; i < group.stateSprites.length; i++) {
        if (group.stateSprites[i].damageState === state) {
            fallbackIndex = i;
            break;
        }
    }

    for (i = 0; i < group.stateSprites.length; i++) {
        group.stateSprites[i].flippedX = group.damageStateFlippedX === true;
        group.stateSprites[i].visible = i === fallbackIndex;
    }
};

GraveFallGame.scene.Game.prototype.applyPaletteSwapsToDamageStateGroup = function (group, normalPaletteSwaps, downedPaletteSwaps) {
    var i;
    var sprite;
    var paletteSwaps;

    if (!group || !group.stateSprites) {
        this.applyPaletteSwaps(group, normalPaletteSwaps);
        return;
    }

    for (i = 0; i < group.stateSprites.length; i++) {
        sprite = group.stateSprites[i];
        paletteSwaps = normalPaletteSwaps;

        if (sprite.damageState === "knockedOut" || sprite.damageState === "dead" || sprite.damageState === "killed") {
            paletteSwaps = downedPaletteSwaps || normalPaletteSwaps;
        }

        this.applyPaletteSwaps(sprite, paletteSwaps);
    }
};

GraveFallGame.scene.Game.prototype.getPlayerStandDamageStates = function (baseResource) {
    var prefix = baseResource.replace("_Idle_Stance", "");
    var downedPrefix = prefix === "Assassin" ? "Assasin" : prefix;

    return [
        { state: "hp100", resource: this.resolveExistingResource([prefix + "_Idle_Stance", baseResource], baseResource) },
        { state: "hp75", resource: this.resolveExistingResource([prefix + "_Bruised_Stance", prefix + "_Idle_Stance"], baseResource) },
        { state: "hp50", resource: this.resolveExistingResource([prefix + "_Hurt_Stance", prefix + "_Bruised_Stance", prefix + "_Idle_Stance"], baseResource) },
        { state: "hp25", resource: this.resolveExistingResource([prefix + "_Dying_Stance", prefix + "_Hurt_Stance", prefix + "_Bruised_Stance", prefix + "_Idle_Stance"], baseResource) },

        { state: "itemAttack", resource: this.resolveExistingResource([prefix + "_Item_Attack", prefix + "_Idle_Stance"], baseResource) },
        { state: "itemDefend", resource: this.resolveExistingResource([prefix + "_Item_Defend", prefix + "_Idle_Stance"], baseResource) },
        { state: "itemPotion", resource: this.resolveExistingResource([prefix + "_Item_Potion", prefix + "_Idle_Stance"], baseResource) },
        { state: "itemSpeedPotion", resource: this.resolveExistingResource([prefix + "_Item_Speed_Potion", downedPrefix + "_Item_Speed_Potion", prefix + "_Item_Potion", prefix + "_Idle_Stance"], baseResource) },
        { state: "buff", resource: this.resolveExistingResource([prefix + "_Buff_Stance", prefix + "_Item_Defend", prefix + "_Idle_Stance"], baseResource) },

        { state: "knockedOut", resource: this.resolveExistingResource([prefix + "_Downed_Stance", downedPrefix + "_Downed_Stance", prefix + "_Dying_Stance", prefix + "_Hurt_Stance", prefix + "_Idle_Stance"], baseResource) },
        { state: "dead", resource: this.resolveExistingResource([prefix + "_Downed_Stance", downedPrefix + "_Downed_Stance", prefix + "_Dying_Stance", prefix + "_Hurt_Stance", prefix + "_Idle_Stance"], baseResource) }
    ];
};

GraveFallGame.scene.Game.prototype.getPortraitDamageStates = function (portraitResource) {
    return [
        { state: "hp100", resource: portraitResource },
        { state: "hp75", resource: portraitResource },
        { state: "hp50", resource: portraitResource },
        { state: "hp25", resource: portraitResource },
        { state: "knockedOut", resource: portraitResource },
        { state: "dead", resource: portraitResource }
    ];
};

GraveFallGame.scene.Game.prototype.getEnemyDamageStates = function (enemyConfig) {
    var resources = enemyConfig.damageStateResources || {};
    var idleResource = enemyConfig.resource;

    return [
        { state: "hp100", resource: resources.hp100 || idleResource },
        { state: "hp75", resource: resources.hp75 || resources.hp100 || idleResource },
        { state: "hp50", resource: resources.hp50 || resources.hp75 || resources.hp100 || idleResource },
        { state: "hp25", resource: resources.hp25 || resources.hp50 || resources.hp75 || resources.hp100 || idleResource },
        { state: "killed", resource: resources.killed || resources.hp25 || resources.hp50 || resources.hp75 || resources.hp100 || idleResource }
    ];
};

GraveFallGame.scene.Game.prototype.getHealthDamageState = function (currentHealth, maxHealth, isPlayer, allPlayersDead) {
    var healthRatio = maxHealth > 0 ? currentHealth / maxHealth : 0;

    if (isPlayer === true && currentHealth <= 0) {
        return allPlayersDead === true ? "dead" : "knockedOut";
    }

    if (isPlayer !== true && currentHealth <= 0) {
        return "killed";
    }

    if (healthRatio > 0.75) {
        return "hp100";
    }

    if (healthRatio > 0.5) {
        return "hp75";
    }

    if (healthRatio > 0.25) {
        return "hp50";
    }

    return "hp25";
};

GraveFallGame.scene.Game.prototype.areAllPlayersDown = function () {
    var i;

    for (i = 0; i < this.playerMenus.length; i++) {
        if (this.playerMenus[i].healthCurrent > 0) {
            return false;
        }
    }

    return this.playerMenus.length > 0;
};

GraveFallGame.scene.Game.prototype.getPlayerTheme = function (index) {
    return GraveFallGame.scene.Game.PLAYER_THEMES[index % GraveFallGame.scene.Game.PLAYER_THEMES.length];
};

GraveFallGame.scene.Game.prototype.getEnemyTypesByBossFlag = function (isBoss) {
    var enemies = GraveFallGame.scene.Game.ENEMIES;
    var enemyTypes = [];
    var enemyType;

    for (enemyType in enemies) {
        if (
            enemies.hasOwnProperty(enemyType) &&
            enemies[enemyType].isBoss === isBoss &&
            enemies[enemyType].debugOnly !== true
        ) {
            enemyTypes.push(enemyType);
        }
    }

    return enemyTypes;
};

GraveFallGame.scene.Game.prototype.getRandomEnemyType = function (enemyTypes) {
    if (!enemyTypes || enemyTypes.length <= 0) {
        return "ghoul";
    }

    return enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
};

GraveFallGame.scene.Game.prototype.getEnemyTypeForEncounter = function (encounterIndex) {
    var isBossEncounter = (encounterIndex + 1) % 3 === 0;
    var enemyTypes = this.getEnemyTypesByBossFlag(isBossEncounter);

    if (enemyTypes.length <= 0) {
        enemyTypes = this.getEnemyTypesByBossFlag(!isBossEncounter);
    }

    return this.getRandomEnemyType(enemyTypes);
};

GraveFallGame.scene.Game.prototype.getClothingPaletteSwaps = function (theme) {
    return [
        {
            from: GraveFallGame.scene.Game.CLOTHING_SOURCE.light,
            to: theme.clothing.light
        },
        {
            from: GraveFallGame.scene.Game.CLOTHING_SOURCE.mid,
            to: theme.clothing.mid
        },
        {
            from: GraveFallGame.scene.Game.CLOTHING_SOURCE.dark,
            to: theme.clothing.dark
        }
    ];
};

GraveFallGame.scene.Game.prototype.getProjectilePaletteSwaps = function (targetPalette) {
    var palette = targetPalette || GraveFallGame.scene.Game.PROJECTILE_NEUTRAL;

    return [
        {
            from: GraveFallGame.scene.Game.PROJECTILE_SOURCE.light,
            to: palette.light
        },
        {
            from: GraveFallGame.scene.Game.PROJECTILE_SOURCE.mid,
            to: palette.mid
        },
        {
            from: GraveFallGame.scene.Game.PROJECTILE_SOURCE.dark,
            to: palette.dark
        }
    ];
};

GraveFallGame.scene.Game.prototype.getFramePaletteSwaps = function (uiSkin) {
    uiSkin = uiSkin || GraveFallGame.scene.Game.UI_SKINS.dullBrown;

    return [
        {
            from: GraveFallGame.scene.Game.FRAME_SOURCE.light,
            to: uiSkin.frame.light
        },
        {
            from: GraveFallGame.scene.Game.FRAME_SOURCE.mid,
            to: uiSkin.frame.mid
        },
        {
            from: GraveFallGame.scene.Game.FRAME_SOURCE.dark,
            to: uiSkin.frame.dark
        }
    ];
};

GraveFallGame.scene.Game.prototype.applyPaletteSwaps = function (graphic, paletteSwaps) {
    var i;
    var swap;

    if (!graphic || !graphic.texture || !paletteSwaps || paletteSwaps.length === 0) {
        return;
    }

    for (i = 0; i < paletteSwaps.length; i++) {
        swap = paletteSwaps[i];

        graphic.texture.replaceColor(
            rune.color.Color24.fromHex(swap.from),
            rune.color.Color24.fromHex(swap.to)
        );
    }
};

GraveFallGame.scene.Game.prototype.applyMonochromeIconColor = function (graphic, targetColor) {
    this.applyPaletteSwaps(graphic, [
        {
            from: GraveFallGame.scene.Game.MONO_ICON_SOURCE,
            to: targetColor
        },
        {
            from: GraveFallGame.scene.Game.PLAYER_DOWNED_PALETTE.mid,
            to: targetColor
        },
        {
            from: "#E53935",
            to: targetColor
        },
        {
            from: "#1E88E5",
            to: targetColor
        },
        {
            from: "#FDD835",
            to: targetColor
        },
        {
            from: "#43A047",
            to: targetColor
        }
    ]);
};

GraveFallGame.scene.Game.prototype.createFramePiece = function (x, y, resource, paletteSwaps) {
    var piece = new rune.display.Sprite(x, y, 16, 16, resource);
    this.applyPaletteSwaps(piece, paletteSwaps);
    return piece;
};

GraveFallGame.scene.Game.prototype.createBoxFrame = function (x, y, width, height, paletteSwaps) {
    var tile = 16;
    var frame = new rune.display.DisplayObjectContainer(x, y, width, height);
    var px;
    var py;

    frame.addChild(this.createFramePiece(0, 0, "UI_Frame_TL_T", paletteSwaps));
    frame.addChild(this.createFramePiece(width - tile, 0, "UI_Frame_TR_T", paletteSwaps));
    frame.addChild(this.createFramePiece(0, height - tile, "UI_Frame_BL_T", paletteSwaps));
    frame.addChild(this.createFramePiece(width - tile, height - tile, "UI_Frame_BR_T", paletteSwaps));

    for (px = tile; px < width - tile; px += tile) {
        frame.addChild(this.createFramePiece(px, 0, "UI_Frame_T_T", paletteSwaps));
        frame.addChild(this.createFramePiece(px, height - tile, "UI_Frame_B_T", paletteSwaps));
    }

    for (py = tile; py < height - tile; py += tile) {
        frame.addChild(this.createFramePiece(0, py, "UI_Frame_L_T", paletteSwaps));
        frame.addChild(this.createFramePiece(width - tile, py, "UI_Frame_R_T", paletteSwaps));
    }

    return frame;
};

GraveFallGame.scene.Game.prototype.createSeparator = function (x, y, width, paletteSwaps) {
    var tile = 16;
    var sep = new rune.display.DisplayObjectContainer(x, y, width, tile);
    var px;

    sep.addChild(this.createFramePiece(0, 0, "UI_Separator_L_T", paletteSwaps));

    for (px = tile; px < width - tile; px += tile) {
        sep.addChild(this.createFramePiece(px, 0, "UI_Separator_M_T", paletteSwaps));
    }

    sep.addChild(this.createFramePiece(width - tile, 0, "UI_Separator_R_T", paletteSwaps));

    return sep;
};

GraveFallGame.scene.Game.prototype.applyPlayerTheme = function (theme, parts, options) {
    var i;
    var uiSkin = (options && options.uiSkin) || this.uiSkin || GraveFallGame.scene.Game.UI_SKINS.dullBrown;
    var defaultClothingPalette = this.getClothingPaletteSwaps(theme);

    parts.menuRoot.backgroundColor = uiSkin.panelBottom;
    parts.menuCharacter.backgroundColor = uiSkin.panelTop;
    parts.menuActions.backgroundColor = uiSkin.panelBottom;
    parts.menuAccent.backgroundColor = theme.accent;
    parts.actionAccent.backgroundColor = theme.accentDark;
    parts.selectionBar.backgroundColor = theme.accent;

    parts.healthBarBackground.backgroundColor = "#ffffff";
    parts.healthBarFill.backgroundColor = theme.accent;

    this.applyMonochromeIconColor(parts.classIcon, theme.accent);
    this.applyMonochromeIconColor(parts.battleAvatar, theme.accent);
    parts.battleAvatar.normalColor = theme.accent;
    parts.battleAvatar.downedColor = GraveFallGame.scene.Game.PLAYER_DOWNED_PALETTE.mid;

    for (i = 0; i < parts.actions.length; i++) {
        this.applyMonochromeIconColor(parts.actions[i], theme.accentLight);
    }

    this.applyPaletteSwapsToDamageStateGroup(
        parts.stand,
        options.standPaletteSwaps || defaultClothingPalette,
        options.standPaletteSwaps || defaultClothingPalette
    );

    this.applyPaletteSwapsToDamageStateGroup(
        parts.portrait,
        options.portraitPaletteSwaps || defaultClothingPalette,
        options.portraitPaletteSwaps || defaultClothingPalette
    );
};

GraveFallGame.scene.Game.prototype.getBitmapTextWidth = function (field, fallbackCharacterWidth) {
    var text = field && field.text !== undefined && field.text !== null ? String(field.text) : "";
    var scaleX = field && typeof field.scaleX === "number" ? field.scaleX : 1;

    fallbackCharacterWidth = fallbackCharacterWidth || 6;

    return text.length * fallbackCharacterWidth * scaleX;
};

GraveFallGame.scene.Game.prototype.layoutPlayerHealthText = function (playerMenu) {
    var currentWidth;
    var maxWidth;
    var rightX;
    var gap;
    var characterWidth;
    var y;

    if (!playerMenu || !playerMenu.healthCurrentText || !playerMenu.healthMaxText) {
        return;
    }

    rightX = typeof playerMenu.healthTextRightX === "number" ? playerMenu.healthTextRightX : 300;
    gap = typeof playerMenu.healthTextGap === "number" ? playerMenu.healthTextGap : 4;
    characterWidth = typeof playerMenu.healthTextCharacterWidth === "number" ? playerMenu.healthTextCharacterWidth : 6;
    y = typeof playerMenu.healthTextY === "number" ? playerMenu.healthTextY : 13;

    currentWidth = this.getBitmapTextWidth(playerMenu.healthCurrentText, characterWidth);
    maxWidth = this.getBitmapTextWidth(playerMenu.healthMaxText, characterWidth);

    playerMenu.healthMaxText.x = rightX - maxWidth;
    playerMenu.healthCurrentText.x = playerMenu.healthMaxText.x - gap - currentWidth;
    playerMenu.healthMaxText.y = y;
    playerMenu.healthCurrentText.y = y;
};

GraveFallGame.scene.Game.prototype.updatePlayerHealthUi = function (playerMenu) {
    var maxHealth;

    if (!playerMenu) {
        return;
    }

    maxHealth = Math.max(1, playerMenu.healthMax || 1);
    playerMenu.healthMax = maxHealth;
    playerMenu.healthCurrent = Math.max(0, playerMenu.healthCurrent || 0);

    if (playerMenu.healthBarFill) {
        playerMenu.healthBarFill.scaleX = Math.max(0, Math.min(1, playerMenu.healthCurrent / maxHealth));
    }

    if (playerMenu.healthCurrentText) {
        playerMenu.healthCurrentText.text = String(playerMenu.healthCurrent);
    }

    if (playerMenu.healthMaxText) {
        playerMenu.healthMaxText.text = "/" + String(playerMenu.healthMax);
    }

    this.layoutPlayerHealthText(playerMenu);
};

GraveFallGame.scene.Game.prototype.areAllPlayersConfirmed = function () {
    var i;

    if (!this.playerMenus || this.playerMenus.length === 0) {
        return false;
    }

    for (i = 0; i < this.playerMenus.length; i++) {
        if (this.playerMenus[i].healthCurrent > 0 && this.playerMenus[i].confirmed !== true) {
            return false;
        }
    }

    return true;
};


GraveFallGame.scene.Game.prototype.clampValue = function (value, min, max) {
    if (value < min) {
        return min;
    }

    if (value > max) {
        return max;
    }

    return value;
};

GraveFallGame.scene.Game.prototype.setObjectHitboxInset = function (object, insetX, insetY, insetRight, insetBottom) {
    var scaleX;
    var scaleY;
    var absScaleX;
    var absScaleY;
    var scaledWidth;
    var scaledHeight;
    var insetLeft;
    var insetTop;
    var localX;
    var localY;
    var localWidth;
    var localHeight;

    if (!object || !object.hitbox || typeof object.hitbox.set !== "function") {
        return;
    }

    scaleX = object.scaleX || 1;
    scaleY = object.scaleY || 1;

    if (scaleX === 0) {
        scaleX = 1;
    }

    if (scaleY === 0) {
        scaleY = 1;
    }

    absScaleX = Math.abs(scaleX);
    absScaleY = Math.abs(scaleY);
    scaledWidth = Math.abs((object.width || 0) * scaleX);
    scaledHeight = Math.abs((object.height || 0) * scaleY);

    insetLeft = Math.max(0, insetX || 0);
    insetTop = Math.max(0, insetY || 0);
    insetRight = Math.max(0, typeof insetRight === "number" ? insetRight : insetLeft);
    insetBottom = Math.max(0, typeof insetBottom === "number" ? insetBottom : insetTop);

    insetLeft = Math.min(insetLeft, scaledWidth / 2);
    insetRight = Math.min(insetRight, Math.max(0, scaledWidth - insetLeft));
    insetTop = Math.min(insetTop, scaledHeight / 2);
    insetBottom = Math.min(insetBottom, Math.max(0, scaledHeight - insetTop));

    localX = insetLeft / scaleX;
    localY = insetTop / scaleY;
    localWidth = Math.max(0, (scaledWidth - insetLeft - insetRight) / absScaleX);
    localHeight = Math.max(0, (scaledHeight - insetTop - insetBottom) / absScaleY);

    object.hitboxInsetX = insetLeft;
    object.hitboxInsetY = insetTop;
    object.hitboxInsetLeft = insetLeft;
    object.hitboxInsetTop = insetTop;
    object.hitboxInsetRight = insetRight;
    object.hitboxInsetBottom = insetBottom;
    object.hitbox.set(localX, localY, localWidth, localHeight);
};

GraveFallGame.scene.Game.prototype.setObjectClampInset = function (object, insetLeft, insetTop, insetRight, insetBottom) {
    if (!object) {
        return;
    }

    object.hitboxClampInsetLeft = Math.max(0, insetLeft || 0);
    object.hitboxClampInsetTop = Math.max(0, insetTop || 0);
    object.hitboxClampInsetRight = Math.max(0, typeof insetRight === "number" ? insetRight : object.hitboxClampInsetLeft);
    object.hitboxClampInsetBottom = Math.max(0, typeof insetBottom === "number" ? insetBottom : object.hitboxClampInsetTop);
};

GraveFallGame.scene.Game.prototype.randomRange = function (min, max) {
    return min + Math.random() * (max - min);
};

GraveFallGame.scene.Game.prototype.getArenaInnerBounds = function () {
    var borderPadding = 20;

    return {
        x: borderPadding,
        y: borderPadding,
        width: this.arena.width - (borderPadding * 2),
        height: this.arena.height - (borderPadding * 2)
    };
};
