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
GraveFallGame.scene.Game = function () {

    //--------------------------------------------------------------------------
    // Super call
    //--------------------------------------------------------------------------

    /**
     * Calls the constructor method of the super class.
     */
    rune.scene.Scene.call(this);
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
GraveFallGame.scene.Game.PHASE_GAME_OVER = "gameOver";
GraveFallGame.scene.Game.PHASE_ENEMY_DEFEATED = "enemyDefeated";

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

GraveFallGame.scene.Game.MONO_ICON_SOURCE = "#C4C4C3";


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
    }
};

/**
 * Enemy / phase prototype data.
 *
 * Add more enemies by creating a new entry and mapping its pattern ids in
 * spawnEnemyPatternById().
 */
GraveFallGame.scene.Game.ENEMIES = {
    ghoul: {
        name: "Ghoul",
        isBoss: false,
        resource: "Ghoul_Idle_T",
        damageStateResources: {
            hp100: "Ghoul_Idle_T",
            hp75: "Ghoul_Bruised_T",
            hp50: "Ghoul_Hurt_T",
            hp25: "Ghoul_Dying_T",
            killed: "Ghoul_Killed_T"
        },
        hpMax: 90,
        actionPhaseDuration: 220,
        patternInterval: 48,
        patterns: [
            "ghoul_orb_crawl",
            "ghoul_dart_ambush",
            "ghoul_stomp_pulse"
        ]
    },
    goblinHorde: {
        name: "Goblin Horde",
        isBoss: true,
        resource: "Goblin_Idle_T",
        damageStateResources: {
            hp100: "Goblin_Idle_T",
            hp75: "Goblin_Bruised_T",
            hp50: "Goblin_Hurt_T",
            hp25: "Goblin_Dying_T",
            killed: "Goblin_Killed_T"
        },
        hpMax: 220,
        actionPhaseDuration: 300,
        patternInterval: 55,
        patterns: [
            "boss_sword_rain",
            "boss_vertical_sweep",
            "boss_orb_burst",
            "boss_diagonal_drop"
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
        hpMax: 270,
        actionPhaseDuration: 330,
        patternInterval: 50,
        patterns: [
            "hydragon_orb_breath",
            "hydragon_sword_storm",
            "hydragon_cross_sweep",
            "hydragon_fang_fan"
        ]
    }
};


//------------------------------------------------------------------------------
// Audio IDs and helpers
//------------------------------------------------------------------------------

// Keep these IDs identical to the names in src/data/resource/Requests.js.
// To replace the placeholder sounds, export WAVs from ChipTone, bake/convert them
// into data:audio/wav;base64 strings, then paste them into the matching this.add()
// lines in Requests.js.
GraveFallGame.MUSIC = {
    DUNGEON_LOOP: "BGM_Dungeon_Loop"
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

        sound = application.sounds.sound.get(soundName, unique !== false);

        if (sound) {
            sound.volume = typeof volume === "number" ? volume : 1;
            sound.pan = typeof pan === "number" ? pan : 0;
            sound.play(true);
        }

        return sound;
    } catch (e) {
        // This keeps development safe while sound resources are still being
        // replaced. Missing or badly pasted audio data should not crash gameplay.
        return null;
    }
};

GraveFallGame.playMusic = function (application, musicName, volume, pan) {
    var music;

    try {
        if (!application || !application.sounds || !application.sounds.music) {
            return null;
        }

        // Rune has a dedicated music channel. Use a shared object here so this
        // looping placeholder is treated as one background track, not as stacked SFX.
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
        // Audio teardown should never block scene cleanup.
    }
};

GraveFallGame.scene.Game.prototype.playSfx = function (soundName, volume, pan, unique) {
    return GraveFallGame.playSound(this.application, soundName, volume, pan, unique);
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
            this.playSfx(GraveFallGame.SOUNDS.ATTACK_SWORD_RAIN, 0.65);
            break;
        case "boss_vertical_sweep":
        case "hydragon_cross_sweep":
            this.playSfx(GraveFallGame.SOUNDS.ATTACK_SWEEP, 0.65);
            break;
        case "boss_orb_burst":
        case "ghoul_orb_crawl":
        case "hydragon_orb_breath":
            this.playSfx(GraveFallGame.SOUNDS.ATTACK_ORB, 0.65);
            break;
        case "boss_diagonal_drop":
        case "ghoul_dart_ambush":
        case "hydragon_fang_fan":
            this.playSfx(GraveFallGame.SOUNDS.ATTACK_DAGGER, 0.65);
            break;
        case "goblin_pebble_rain":
            this.playSfx(GraveFallGame.SOUNDS.ATTACK_PEBBLE, 0.55);
            break;
        case "goblin_dart_fan":
            this.playSfx(GraveFallGame.SOUNDS.ATTACK_DART, 0.6);
            break;
        case "goblin_stomp_wave":
        case "ghoul_stomp_pulse":
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
        // Camera shake is juice only; gameplay should continue if the camera
        // subsystem is missing during early boot or tests.
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

    for (i = 0; i < stateConfigs.length; i++) {
        sprite = new rune.display.Sprite(0, 0, width, height, this.resolveExistingResource([stateConfigs[i].resource], stateConfigs[0].resource));
        sprite.damageState = stateConfigs[i].state;
        sprite.visible = false;

        if (options.flippedX === true) {
            sprite.flippedX = true;
        }

        group.addChild(sprite);
        group.stateSprites.push(sprite);
    }

    return group;
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

GraveFallGame.scene.Game.prototype.getCurrentEnemyConfig = function () {
    return GraveFallGame.scene.Game.ENEMIES[this.currentEnemyType] || GraveFallGame.scene.Game.ENEMIES.ghoul;
};

GraveFallGame.scene.Game.prototype.getEnemyTypesByBossFlag = function (isBoss) {
    var enemies = GraveFallGame.scene.Game.ENEMIES;
    var enemyTypes = [];
    var enemyType;

    for (enemyType in enemies) {
        if (enemies.hasOwnProperty(enemyType) && enemies[enemyType].isBoss === isBoss) {
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
    var defaultClothingPalette = this.getClothingPaletteSwaps(theme);

    parts.menuRoot.backgroundColor = "#090909";
    parts.menuCharacter.backgroundColor = "#141414";
    parts.menuActions.backgroundColor = "#101010";
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

    // Standing sprites and portraits always keep their player-assigned palette,
    // including knocked-out/dead damage states. Only the class icons grey out.
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

    // Anchor the full "current/max" string to the right side of this player's
    // own menu. This lets 3+ digit health values shift only that player's text
    // left, and lets it shift back automatically when the value drops below 100.
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

GraveFallGame.scene.Game.prototype.randomRange = function (min, max) {
    return min + Math.random() * (max - min);
};

GraveFallGame.scene.Game.prototype.getArenaInnerBounds = function () {
    var borderPadding = 20;

    // CHANGED: This now returns local coordinates relative to the arena itself.
    // So inner.y starts at 20. If you spawn a projectile at inner.y - 100, 
    // it will be at -80 (above the arena's local space) and will be cleanly masked out!
    return {
        x: borderPadding,
        y: borderPadding,
        width: this.arena.width - (borderPadding * 2),
        height: this.arena.height - (borderPadding * 2)
    };
};//------------------------------------------------------------------------------
// Arena / battle state
//------------------------------------------------------------------------------

GraveFallGame.scene.Game.prototype.createBattleArena = function () {
    var uiSkin = GraveFallGame.scene.Game.UI_SKINS.dullBrown;
    var framePaletteSwaps = this.getFramePaletteSwaps(uiSkin);
    var screenWidth = this.application.screen.width;
    var arenaX = 16;
    var arenaY = 188;
    var arenaWidth = screenWidth - 32;
    var arenaHeight = 392;

    this.arena = {
        x: arenaX,
        y: arenaY,
        width: arenaWidth,
        height: arenaHeight
    };

    this.arenaBackground = new rune.display.Graphic(arenaX, arenaY, arenaWidth, arenaHeight);
    this.arenaBackground.backgroundColor = "#000000";
    this.arenaBackground.visible = false;
    this.stage.addChild(this.arenaBackground);

    // CHANGED: The projectile layer is now physically bound to the arena's dimensions.
    // This allows negative coordinates to be clipped/hidden!
    this.arenaProjectileLayer = new rune.display.DisplayObjectContainer(arenaX, arenaY, arenaWidth, arenaHeight);
    this.arenaProjectileLayer.visible = false;
    this.stage.addChild(this.arenaProjectileLayer);

    // CHANGED: Same for the avatar layer
    this.arenaAvatarLayer = new rune.display.DisplayObjectContainer(arenaX, arenaY, arenaWidth, arenaHeight);
    this.arenaAvatarLayer.visible = false;
    this.stage.addChild(this.arenaAvatarLayer);

    this.arenaFrame = this.createBoxFrame(arenaX, arenaY, arenaWidth, arenaHeight, framePaletteSwaps);
    this.arenaFrame.visible = false;
    this.stage.addChild(this.arenaFrame);
};

GraveFallGame.scene.Game.prototype.setBattleArenaVisible = function (visible) {
    this.arenaBackground.visible = visible;
    this.arenaProjectileLayer.visible = visible;
    this.arenaAvatarLayer.visible = visible;
    this.arenaFrame.visible = visible;
};

GraveFallGame.scene.Game.prototype.layoutBattleAvatarsInArena = function () {
    var inner = this.getArenaInnerBounds();
    var livingCount = 0;
    var i;
    var slotIndex = 0;
    var avatar;
    var spacing;
    var targetX;
    var targetY;

    for (i = 0; i < this.playerMenus.length; i++) {
        if (this.playerMenus[i].healthCurrent > 0) {
            livingCount++;
        }
    }

    if (livingCount <= 0) {
        livingCount = this.playerMenus.length;
    }

    spacing = inner.width / (livingCount + 1);
    targetY = inner.y + inner.height - 90;

    for (i = 0; i < this.playerMenus.length; i++) {
        if (this.playerMenus[i].healthCurrent <= 0) {
            this.playerMenus[i].battleAvatar.visible = false;
            continue;
        }

        avatar = this.playerMenus[i].battleAvatar;
        avatar.visible = true;
        avatar.alpha = 1;

        targetX = inner.x + (spacing * (slotIndex + 1)) - (avatar.width / 2);
        avatar.x = targetX;
        avatar.y = targetY;
        slotIndex++;
    }
};

GraveFallGame.scene.Game.prototype.activateBattleAvatar = function (playerMenu) {
    playerMenu.stand.visible = false;
    playerMenu.battleAvatar.visible = playerMenu.healthCurrent > 0;
    playerMenu.battleAvatar.alpha = 1;
};

GraveFallGame.scene.Game.prototype.deactivateBattleAvatar = function (playerMenu) {
    playerMenu.stand.visible = true;
    playerMenu.stand.alpha = 1;
    playerMenu.battleAvatar.visible = false;
    playerMenu.battleAvatar.alpha = 1;
};

GraveFallGame.scene.Game.prototype.showGameOverAndReturnToMenu = function () {
    if (this.phase === GraveFallGame.scene.Game.PHASE_GAME_OVER) {
        return;
    }

    this.phase = GraveFallGame.scene.Game.PHASE_GAME_OVER;
    this.gameOverTimer = 180;
    this.playSfx(GraveFallGame.SOUNDS.GAME_OVER, 0.85);
    this.clearProjectiles();
    this.clearArenaItem();
    this.setBattleArenaVisible(false);
    this.turnTimerText.alpha = 0;
    this.updateAllPlayerDamageStates();

    if (!this.gameOverText) {
        this.gameOverText = new rune.text.BitmapField("GAME OVER");
        this.gameOverText.scaleX = 3;
        this.gameOverText.scaleY = 3;
        this.gameOverText.x = Math.floor((this.application.screen.width - (9 * 16 * this.gameOverText.scaleX)) / 2);
        this.gameOverText.y = 24;
        this.stage.addChild(this.gameOverText);
    }

    this.gameOverText.visible = true;
    this.gameOverText.alpha = 1;
};

GraveFallGame.scene.Game.prototype.updateGameOver = function () {
    if (this.gameOverTimer > 0) {
        this.gameOverTimer--;
    }

    if (this.gameOverText) {
        this.gameOverText.alpha = this.gameOverTimer % 20 < 12 ? 1 : 0.35;
    }

    if (this.gameOverTimer <= 0) {
        this.application.scenes.load([
            new GraveFallGame.scene.Menu()
        ]);
    }
};

GraveFallGame.scene.Game.prototype.setEnemyUiAlpha = function (alpha) {
    if (this.enemySprite) this.enemySprite.alpha = alpha;
    if (this.enemyHealthBg) this.enemyHealthBg.alpha = alpha;
    if (this.enemyHealthFill) this.enemyHealthFill.alpha = alpha;
    if (this.enemyHealthFrame) this.enemyHealthFrame.alpha = alpha;
    if (this.enemyHealthText) this.enemyHealthText.alpha = alpha;
};

GraveFallGame.scene.Game.prototype.updateEnemyHealthBarUi = function () {
    var eBarWidth = this.enemyHealthBarWidth || 300;
    var eBarX = typeof this.enemyHealthBarX === "number" ? this.enemyHealthBarX : (this.application.screen.width / 2) - (eBarWidth / 2);

    if (this.enemyHealthFill && this.enemyHealthMax > 0) {
        this.enemyHealthFill.scaleX = Math.max(0, Math.min(1, this.enemyHealthCurrent / this.enemyHealthMax));
    }

    if (this.enemyHealthText) {
        this.enemyHealthText.text = Math.ceil(this.enemyHealthCurrent) + "/" + this.enemyHealthMax;
        this.enemyHealthText.x = eBarX + (eBarWidth / 2) - ((this.enemyHealthText.text.length * 6 * 2) / 2);
    }
};

GraveFallGame.scene.Game.prototype.rebuildEnemySprite = function (fadeIn) {
    var enemyConfig = this.getCurrentEnemyConfig();

    if (this.enemySprite && this.enemySprite.parent) {
        this.enemySprite.parent.removeChild(this.enemySprite, true);
    }

    this.enemySprite = this.createDamageStateGroup(
        0,
        0,
        100,
        100,
        this.getEnemyDamageStates(enemyConfig)
    );
    this.enemySprite.scaleX = 3.2;
    this.enemySprite.scaleY = 3.2;
    this.enemySprite.x = (this.application.screen.width / 1) - ((this.enemySprite.width * this.enemySprite.scaleX) / 1.28);
    this.enemySprite.y = 180;
    this.setDamageStateGroupState(this.enemySprite, "hp100");
    this.enemySprite.alpha = fadeIn === true ? 0 : 1;
    this.stage.addChild(this.enemySprite);
    this.bossPlaceholder = this.enemySprite;
};

GraveFallGame.scene.Game.prototype.loadEnemyEncounter = function (enemyType, fadeIn) {
    var enemyConfig;
    var alpha = fadeIn === true ? 0 : 1;

    this.currentEnemyType = enemyType;
    enemyConfig = this.getCurrentEnemyConfig();
    this.enemyHealthMax = enemyConfig.hpMax;
    this.enemyHealthCurrent = this.enemyHealthMax;
    this.enemyDefeatedSoundPlayed = false;

    this.rebuildEnemySprite(fadeIn);
    this.updateEnemyHealthBarUi();
    this.updateEnemyDamageState();
    this.setEnemyUiAlpha(alpha);

    this.enemyFadeTimerMs = fadeIn === true ? 0 : this.enemyFadeDurationMs;
};

GraveFallGame.scene.Game.prototype.resetPlayersForNewEncounter = function () {
    var i;

    for (i = 0; i < this.playerMenus.length; i++) {
        this.playerMenus[i].confirmed = false;
        this.playerMenus[i].selectedAction = null;
        this.playerMenus[i].container.y = this.playerMenus[i].baseY;
        this.playerMenus[i].hitCooldown = 0;
        this.deactivateBattleAvatar(this.playerMenus[i]);
    }

    this.updateAllPlayerDamageStates();
};

GraveFallGame.scene.Game.prototype.startEnemyDefeatedSequence = function () {
    if (this.phase === GraveFallGame.scene.Game.PHASE_ENEMY_DEFEATED) {
        return;
    }

    this.phase = GraveFallGame.scene.Game.PHASE_ENEMY_DEFEATED;
    this.enemyDefeatedTimerMs = 2200;
    this.enemyFadeTimerMs = this.enemyFadeDurationMs;
    this.clearProjectiles();
    this.clearArenaItem();
    this.setBattleArenaVisible(false);
    this.turnTimerText.alpha = 0;
    this.updateEnemyDamageState();
    this.setEnemyUiAlpha(1);
};

GraveFallGame.scene.Game.prototype.startNextEnemyEncounter = function () {
    this.encounterIndex++;
    this.loadEnemyEncounter(this.getEnemyTypeForEncounter(this.encounterIndex), true);
    this.phase = GraveFallGame.scene.Game.PHASE_COMMAND;
    this.turnTimerMs = 10000;
    this.lastTurnWarningSecond = null;
    this.turnTimerText.visible = true;
    this.turnTimerText.alpha = 1;
    this.turnTimerText.text = "10";
    this.resetPlayersForNewEncounter();
};

GraveFallGame.scene.Game.prototype.updateEnemyDefeatedSequence = function (step) {
    this.enemyDefeatedTimerMs -= step;

    if (this.enemyDefeatedTimerMs <= 0) {
        this.startNextEnemyEncounter();
    }
};

GraveFallGame.scene.Game.prototype.startActionPhase = function () {
    var enemy = this.getCurrentEnemyConfig();
    var i;

    this.resolveCommandPhaseActions();

    if (this.enemyHealthCurrent <= 0) {
        this.startEnemyDefeatedSequence();
        return;
    }

    this.clearArenaItem();
    this.itemSpawnTimer = Math.floor(this.randomRange(90, 240));
    this.turnTimerText.alpha = 0;
    this.phase = GraveFallGame.scene.Game.PHASE_ACTION;
    this.playSfx(GraveFallGame.SOUNDS.PHASE_START, 0.65);
    this.actionPhaseTimer = enemy.actionPhaseDuration;
    this.nextPatternIn = 0;
    this.clearProjectiles();
    this.setBattleArenaVisible(true);
    this.layoutBattleAvatarsInArena();

    for (i = 0; i < this.playerMenus.length; i++) {
        this.playerMenus[i].container.y = this.playerMenus[i].confirmedY;
        this.playerMenus[i].hitCooldown = 0;
        this.activateBattleAvatar(this.playerMenus[i]);
    }
};

GraveFallGame.scene.Game.prototype.endActionPhase = function () {
    var i;

    this.phase = GraveFallGame.scene.Game.PHASE_COMMAND;
    this.playSfx(GraveFallGame.SOUNDS.PHASE_END, 0.5);
    this.actionPhaseTimer = 0;
    this.nextPatternIn = 0;
    this.clearProjectiles();
    this.setBattleArenaVisible(false);
    this.clearArenaItem();

    this.turnTimerMs = 10000;
    this.lastTurnWarningSecond = null;
    this.turnTimerText.visible = true;
    this.turnTimerText.alpha = 1;
    this.turnTimerText.text = "10";

    for (i = 0; i < this.playerMenus.length; i++) {
        this.playerMenus[i].confirmed = false;
        this.playerMenus[i].selectedAction = null;
        this.playerMenus[i].container.y = this.playerMenus[i].baseY;
        this.playerMenus[i].hitCooldown = 0;
        this.deactivateBattleAvatar(this.playerMenus[i]);
    }

    this.updateAllPlayerDamageStates();

    if (this.areAllPlayersDown()) {
        this.showGameOverAndReturnToMenu();
    }
};

GraveFallGame.scene.Game.prototype.clearProjectiles = function () {
    var i;

    if (!this.projectiles) {
        this.projectiles = [];
        return;
    }

    for (i = this.projectiles.length - 1; i >= 0; i--) {
        if (this.projectiles[i].parent) {
            this.projectiles[i].parent.removeChild(this.projectiles[i], true);
        }
        this.projectiles[i] = null;
    }

    this.projectiles = [];
};

GraveFallGame.scene.Game.prototype.createProjectileDisplay = function (options) {
    var display;

    // Projectile art should use the transparent *_T files and the three-color
    // pink source ramp. Those colors are palette-swapped here into a neutral
    // white / grey / dark palette at runtime.
    if (options.resource) {
        display = new rune.display.Sprite(options.x, options.y, options.width, options.height, options.resource);
        this.applyPaletteSwaps(
            display,
            this.getProjectilePaletteSwaps(options.projectilePalette)
        );
    } else {
        display = new rune.display.Graphic(options.x, options.y, options.width, options.height);
        display.backgroundColor = options.color || "#FFFFFF";
    }

    if (options.rotation) {
        display.rotation = options.rotation;
    }

    if (options.flippedX === true) {
        display.flippedX = true;
    }

    display.vx = options.vx || 0;
    display.vy = options.vy || 0;
    display.damage = options.damage || 8;
    display.life = options.life || 180;
    display.type = options.type || "generic";
    display.hitFlashFrames = 0;
    display.hit = false;

    return display;
};

GraveFallGame.scene.Game.prototype.spawnProjectile = function (options) {
    var projectile = this.createProjectileDisplay(options);
    this.arenaProjectileLayer.addChild(projectile);
    this.projectiles.push(projectile);
    return projectile;
};

GraveFallGame.scene.Game.prototype.spawnVerticalSweepProjectile = function (options) {
    var hitbox = new rune.display.DisplayObjectContainer(
        options.x,
        options.y,
        options.collisionWidth || 16,
        options.collisionHeight || 160
    );
    var sweepSprite = new rune.display.Sprite(
        -((options.spriteWidth || 160) - hitbox.width) / 2,
        -((options.spriteHeight || 12) - hitbox.height) / 2,
        options.spriteWidth || 160,
        options.spriteHeight || 12,
        options.resource || "Horizontal_Sweep_Attack_T"
    );

    this.applyPaletteSwaps(
        sweepSprite,
        this.getProjectilePaletteSwaps(options.projectilePalette)
    );

    if (options.rotation) {
        sweepSprite.rotation = options.rotation;
    }

    if (options.flippedX === true) {
        sweepSprite.flippedX = true;
    }

    hitbox.addChild(sweepSprite);
    hitbox.vx = options.vx || 0;
    hitbox.vy = options.vy || 0;
    hitbox.damage = options.damage || 8;
    hitbox.life = options.life || 180;
    hitbox.type = options.type || "generic";
    hitbox.hitFlashFrames = 0;
    hitbox.hit = false;

    this.arenaProjectileLayer.addChild(hitbox);
    this.projectiles.push(hitbox);
    return hitbox;
};//------------------------------------------------------------------------------
// Combat, collisions, projectiles, items
//------------------------------------------------------------------------------

GraveFallGame.scene.Game.prototype.spawnEnemyPattern = function () {
    var enemy = this.getCurrentEnemyConfig();
    var patternId = enemy.patterns[Math.floor(Math.random() * enemy.patterns.length)];
    this.spawnEnemyPatternById(patternId);
};

GraveFallGame.scene.Game.prototype.spawnEnemyPatternById = function (patternId) {
    this.playEnemyPatternSfx(patternId);

    switch (patternId) {
        case "boss_sword_rain": this.spawnBossSwordRain(); break;
        case "boss_vertical_sweep": this.spawnBossVerticalSweep(); break;
        case "boss_orb_burst": this.spawnBossOrbBurst(); break;
        case "boss_diagonal_drop": this.spawnBossDiagonalDrop(); break;
        case "goblin_pebble_rain": this.spawnGoblinPebbleRain(); break;
        case "goblin_dart_fan": this.spawnGoblinDartFan(); break;
        case "goblin_stomp_wave": this.spawnGoblinStompWave(); break;
        case "ghoul_orb_crawl": this.spawnGhoulOrbCrawl(); break;
        case "ghoul_dart_ambush": this.spawnGhoulDartAmbush(); break;
        case "ghoul_stomp_pulse": this.spawnGhoulStompPulse(); break;
        case "hydragon_orb_breath": this.spawnHyDragonOrbBreath(); break;
        case "hydragon_sword_storm": this.spawnHyDragonSwordStorm(); break;
        case "hydragon_cross_sweep": this.spawnHyDragonCrossSweep(); break;
        case "hydragon_fang_fan": this.spawnHyDragonFangFan(); break;
    }
};

GraveFallGame.scene.Game.prototype.spawnBossSwordRain = function () {
    var inner = this.getArenaInnerBounds();
    var count = 5 + Math.floor(Math.random() * 3);
    var i;

    for (i = 0; i < count; i++) {
        this.spawnProjectile({
            x: this.randomRange(inner.x, inner.x + inner.width - 16),
            y: inner.y - this.randomRange(20, 160),
            width: 16,
            height: 48,
            resource: "Falling_Sword_Attack_T",
            vx: this.randomRange(-0.5, 0.5),
            vy: this.randomRange(6.5, 9.0),
            damage: 10,
            life: 160,
            type: "falling_blade"
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnBossVerticalSweep = function () {
    var inner = this.getArenaInnerBounds();
    var fromTop = Math.random() > 0.5;
    var count = 1 + Math.floor(Math.random() * 2);
    var i;
    var x;

    for (i = 0; i < count; i++) {
        x = inner.x + this.randomRange(48, inner.width - 60);
        this.spawnVerticalSweepProjectile({
            x: x,
            y: fromTop ? inner.y - 170 : inner.y + inner.height + 10,
            collisionWidth: 16,
            collisionHeight: 160,
            spriteWidth: 160,
            spriteHeight: 12,
            resource: "Horizontal_Sweep_Attack_T",
            rotation: fromTop ? 90 : -90,
            vx: 0,
            vy: fromTop ? this.randomRange(3.0, 4.3) : this.randomRange(-4.3, -3.0),
            damage: 12,
            life: 110,
            type: "vertical_sweep"
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnBossOrbBurst = function () {
    var inner = this.getArenaInnerBounds();
    var originX = inner.x + (inner.width / 2);
    var originY = inner.y + 30;
    var count = 8 + Math.floor(Math.random() * 4);
    var i;
    var angle;
    var speed;

    for (i = 0; i < count; i++) {
        angle = this.randomRange(0.6, 2.5);
        speed = this.randomRange(3.0, 5.5);

        this.spawnProjectile({
            x: originX,
            y: originY,
            width: 16,
            height: 16,
            resource: "Orb_Attack_T",
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            damage: 7,
            life: 120,
            type: "orb"
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnBossDiagonalDrop = function () {
    var inner = this.getArenaInnerBounds();
    var fromLeft = Math.random() > 0.5;
    var count = 4 + Math.floor(Math.random() * 3);
    var i;

    for (i = 0; i < count; i++) {
        this.spawnProjectile({
            x: fromLeft ? inner.x - this.randomRange(20, 80) : inner.x + inner.width + this.randomRange(20, 80),
            y: inner.y - this.randomRange(20, 120),
            width: 32,
            height: 16,
            resource: "Knife_Attack_T",
            flippedX: fromLeft ? false : true,
            vx: fromLeft ? this.randomRange(2.5, 4.2) : this.randomRange(-4.2, -2.5),
            vy: this.randomRange(5.0, 7.0),
            rotation: fromLeft ? 22 : -22,
            damage: 9,
            life: 120,
            type: "diagonal_blade"
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnGoblinPebbleRain = function () {
    var inner = this.getArenaInnerBounds();
    var count = 10 + Math.floor(Math.random() * 6);
    var i;

    for (i = 0; i < count; i++) {
        this.spawnProjectile({
            x: this.randomRange(inner.x, inner.x + inner.width - 16),
            y: inner.y - this.randomRange(10, 140),
            width: 16,
            height: 16,
            resource: "Orb_Attack_T",
            vx: this.randomRange(-1.2, 1.2),
            vy: this.randomRange(5.5, 8.0),
            damage: 6,
            life: 110,
            type: "pebble"
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnGoblinDartFan = function () {
    var inner = this.getArenaInnerBounds();
    var side = Math.random() > 0.5 ? -1 : 1;
    var originX = side < 0 ? inner.x - 30 : inner.x + inner.width + 30;
    var originY = inner.y + this.randomRange(50, inner.height - 80);
    var i;
    var vy;

    for (i = -2; i <= 2; i++) {
        vy = i * 1.5;
        this.spawnProjectile({
            x: originX,
            y: originY,
            width: 32,
            height: 16,
            resource: "Knife_Attack_T",
            flippedX: side < 0 ? false : true,
            vx: side < 0 ? this.randomRange(7.0, 9.0) : this.randomRange(-9.0, -7.0),
            vy: vy,
            damage: 8,
            life: 100,
            type: "dart"
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnGoblinStompWave = function () {
    var inner = this.getArenaInnerBounds();
    var i;

    for (i = 0; i < 7; i++) {
        this.spawnProjectile({
            x: inner.x + 50 + (i * ((inner.width - 100) / 6)),
            y: inner.y + inner.height - 16,
            width: 16,
            height: 16,
            resource: "StompWave_Attack_T",
            vx: this.randomRange(-0.8, 0.8),
            vy: this.randomRange(-6.5, -4.0),
            damage: 7,
            life: 70,
            type: "stomp_wave"
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnGhoulOrbCrawl = function () {
    var inner = this.getArenaInnerBounds();
    var count = 6 + Math.floor(Math.random() * 3);
    var i;
    var fromLeft;

    for (i = 0; i < count; i++) {
        fromLeft = i % 2 === 0;
        this.spawnProjectile({
            x: fromLeft ? inner.x - 24 : inner.x + inner.width + 24,
            y: inner.y + this.randomRange(40, inner.height - 56),
            width: 16,
            height: 16,
            resource: "Orb_Attack_T",
            vx: fromLeft ? this.randomRange(2.4, 3.7) : this.randomRange(-3.7, -2.4),
            vy: this.randomRange(-0.9, 0.9),
            damage: 5,
            life: 180,
            type: "ghoul_orb"
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnGhoulDartAmbush = function () {
    var inner = this.getArenaInnerBounds();
    var side = Math.random() > 0.5 ? -1 : 1;
    var originX = side < 0 ? inner.x - 36 : inner.x + inner.width + 36;
    var i;

    for (i = 0; i < 4; i++) {
        this.spawnProjectile({
            x: originX,
            y: inner.y + 42 + (i * ((inner.height - 84) / 3)),
            width: 32,
            height: 16,
            resource: "Knife_Attack_T",
            flippedX: side < 0 ? false : true,
            vx: side < 0 ? this.randomRange(5.3, 6.7) : this.randomRange(-6.7, -5.3),
            vy: this.randomRange(-0.35, 0.35),
            damage: 6,
            life: 125,
            type: "ghoul_dart"
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnGhoulStompPulse = function () {
    var inner = this.getArenaInnerBounds();
    var count = 5;
    var startX = inner.x + this.randomRange(35, 90);
    var i;

    for (i = 0; i < count; i++) {
        this.spawnProjectile({
            x: startX + (i * ((inner.width - 180) / (count - 1))),
            y: inner.y + inner.height - 16,
            width: 16,
            height: 16,
            resource: "StompWave_Attack_T",
            vx: this.randomRange(-0.5, 0.5),
            vy: this.randomRange(-5.5, -3.8),
            damage: 6,
            life: 72,
            type: "ghoul_stomp"
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnHyDragonOrbBreath = function () {
    var inner = this.getArenaInnerBounds();
    var fromLeft = Math.random() > 0.5;
    var originX = fromLeft ? inner.x - 26 : inner.x + inner.width + 26;
    var originY = inner.y + this.randomRange(44, 100);
    var count = 9;
    var i;
    var angle;
    var speed;

    for (i = 0; i < count; i++) {
        angle = fromLeft ? this.randomRange(-0.45, 0.85) : this.randomRange(2.3, 3.6);
        speed = this.randomRange(3.5, 5.2);
        this.spawnProjectile({
            x: originX,
            y: originY,
            width: 16,
            height: 16,
            resource: "Orb_Attack_T",
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            damage: 9,
            life: 150,
            type: "hydragon_orb"
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnHyDragonSwordStorm = function () {
    var inner = this.getArenaInnerBounds();
    var count = 7 + Math.floor(Math.random() * 4);
    var i;

    for (i = 0; i < count; i++) {
        this.spawnProjectile({
            x: this.randomRange(inner.x, inner.x + inner.width - 16),
            y: inner.y - this.randomRange(30, 190),
            width: 16,
            height: 48,
            resource: "Falling_Sword_Attack_T",
            vx: this.randomRange(-1.1, 1.1),
            vy: this.randomRange(7.3, 10.2),
            damage: 13,
            life: 160,
            type: "hydragon_sword"
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnHyDragonCrossSweep = function () {
    var inner = this.getArenaInnerBounds();
    var horizontalY = inner.y + this.randomRange(62, inner.height - 80);
    var verticalX = inner.x + this.randomRange(90, inner.width - 110);

    this.spawnProjectile({
        x: inner.x - 170,
        y: horizontalY,
        width: 160,
        height: 12,
        resource: "Horizontal_Sweep_Attack_T",
        vx: this.randomRange(6.0, 7.2),
        vy: 0,
        damage: 12,
        life: 150,
        type: "hydragon_horizontal_sweep"
    });

    this.spawnVerticalSweepProjectile({
        x: verticalX,
        y: inner.y - 180,
        collisionWidth: 16,
        collisionHeight: 160,
        spriteWidth: 160,
        spriteHeight: 12,
        resource: "Horizontal_Sweep_Attack_T",
        rotation: 90,
        vx: 0,
        vy: this.randomRange(4.4, 5.4),
        damage: 12,
        life: 130,
        type: "hydragon_vertical_sweep"
    });
};

GraveFallGame.scene.Game.prototype.spawnHyDragonFangFan = function () {
    var inner = this.getArenaInnerBounds();
    var originX = inner.x + (inner.width / 2);
    var originY = inner.y - 24;
    var count = 7;
    var i;
    var spread;

    for (i = 0; i < count; i++) {
        spread = i - Math.floor(count / 2);
        this.spawnProjectile({
            x: originX,
            y: originY,
            width: 32,
            height: 16,
            resource: "Knife_Attack_T",
            vx: spread * 1.15,
            vy: this.randomRange(5.3, 7.1),
            rotation: spread * 9,
            damage: 10,
            life: 120,
            type: "hydragon_fang"
        });
    }
};

GraveFallGame.scene.Game.prototype.removeProjectileAt = function (index) {
    var projectile = this.projectiles[index];
    if (!projectile) return;
    if (projectile.parent) projectile.parent.removeChild(projectile, true);
    this.projectiles.splice(index, 1);
};

GraveFallGame.scene.Game.prototype.rectsOverlap = function (a, b) {
    return (a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y);
};

GraveFallGame.scene.Game.prototype.isBattleAvatarColliding = function (playerMenu, testX, testY) {
    var i;
    var otherMenu;
    var testAvatar = {
        x: testX,
        y: testY,
        width: playerMenu.battleAvatar.width,
        height: playerMenu.battleAvatar.height
    };

    for (i = 0; i < this.playerMenus.length; i++) {
        otherMenu = this.playerMenus[i];
        if (otherMenu === playerMenu || otherMenu.healthCurrent <= 0) continue;
        if (this.rectsOverlap(testAvatar, otherMenu.battleAvatar)) return true;
    }

    return false;
};

GraveFallGame.scene.Game.prototype.updatePlayerHitFlicker = function (playerMenu) {
    var flashAlpha = 1;

    if (playerMenu.hitCooldown > 0) {
        flashAlpha = playerMenu.hitCooldown % 2 === 0 ? 0.15 : 1;
        playerMenu.hitCooldown--;
    }

    if (playerMenu.healthCurrent > 0) {
        playerMenu.battleAvatar.visible = true;
        playerMenu.battleAvatar.alpha = flashAlpha;
    } else {
        playerMenu.battleAvatar.visible = false;
        playerMenu.battleAvatar.alpha = 1;
    }

    playerMenu.classIcon.alpha = flashAlpha;
};

GraveFallGame.scene.Game.prototype.playPlaceholderHitSound = function () {
    this.playSfx(GraveFallGame.SOUNDS.PLAYER_HIT, 0.55);
};

GraveFallGame.scene.Game.prototype.applyDamageToPlayer = function (playerMenu, amount) {
    var wasAlive = playerMenu.healthCurrent > 0;

    playerMenu.healthCurrent = Math.max(0, playerMenu.healthCurrent - amount);
    this.updatePlayerHealthUi(playerMenu);
    playerMenu.hitCooldown = 12;

    this.shakeOnPlayerDamage(amount);

    if (this.phase !== GraveFallGame.scene.Game.PHASE_ACTION) {
        this.updateAllPlayerDamageStates();
    }

    if (playerMenu.healthCurrent <= 0) {
        if (wasAlive) {
            this.playSfx(GraveFallGame.SOUNDS.PLAYER_DOWNED, 0.8);
        }

        playerMenu.battleAvatar.visible = false;
        playerMenu.battleAvatar.alpha = 1;
        playerMenu.confirmed = true;
    } else if (wasAlive) {
        this.playSfx(GraveFallGame.SOUNDS.PLAYER_HIT, 0.6);
    }
};

GraveFallGame.scene.Game.prototype.checkProjectileCollisions = function () {
    var i;
    var j;
    var projectile;
    var playerMenu;

    for (i = this.projectiles.length - 1; i >= 0; i--) {
        projectile = this.projectiles[i];

        if (!projectile || projectile.hit) {
            continue;
        }

        for (j = 0; j < this.playerMenus.length; j++) {
            playerMenu = this.playerMenus[j];

            if (playerMenu.healthCurrent <= 0 || playerMenu.hitCooldown > 0) {
                continue;
            }

            if (this.rectsOverlap(projectile, playerMenu.battleAvatar)) {
                this.applyDamageToPlayer(playerMenu, projectile.damage);
                projectile.hit = true;
                projectile.hitFlashFrames = 6;
                projectile.vx = 0;
                projectile.vy = 0;
                break;
            }
        }
    }
};

GraveFallGame.scene.Game.prototype.updateProjectiles = function () {
    var inner = this.getArenaInnerBounds();
    var i;
    var projectile;

    for (i = this.projectiles.length - 1; i >= 0; i--) {
        projectile = this.projectiles[i];

        if (!projectile) {
            continue;
        }

        if (projectile.hit) {
            projectile.hitFlashFrames--;
            projectile.alpha = projectile.hitFlashFrames % 2 === 0 ? 0.15 : 1;

            if (projectile.hitFlashFrames <= 0) {
                this.removeProjectileAt(i);
            }

            continue;
        }

        projectile.x += projectile.vx;
        projectile.y += projectile.vy;
        projectile.life--;

        if (
            projectile.life <= 0 ||
            projectile.x < inner.x - 220 ||
            projectile.x > inner.x + inner.width + 220 ||
            projectile.y < inner.y - 220 ||
            projectile.y > inner.y + inner.height + 220
        ) {
            this.removeProjectileAt(i);
        }
    }
};

GraveFallGame.scene.Game.prototype.updateBattleAvatarMovement = function (playerMenu) {
    var speed = playerMenu.moveSpeed || 3;
    var avatar = playerMenu.battleAvatar;
    var inner = this.getArenaInnerBounds();
    var maxX = inner.x + inner.width - avatar.width;
    var maxY = inner.y + inner.height - avatar.height;
    var oldX = avatar.x;
    var oldY = avatar.y;
    var nextX = avatar.x;
    var nextY = avatar.y;

    if (playerMenu.healthCurrent <= 0) {
        return;
    }

    if (this.keyboard.pressed(playerMenu.moveControls.left)) {
        nextX -= speed;
    }

    if (this.keyboard.pressed(playerMenu.moveControls.right)) {
        nextX += speed;
    }

    if (this.keyboard.pressed(playerMenu.moveControls.up)) {
        nextY -= speed;
    }

    if (this.keyboard.pressed(playerMenu.moveControls.down)) {
        nextY += speed;
    }

    nextX = this.clampValue(nextX, inner.x, maxX);
    nextY = this.clampValue(nextY, inner.y, maxY);

    if (this.isBattleAvatarColliding(playerMenu, nextX, nextY)) {
        avatar.x = oldX;
        avatar.y = oldY;
        return;
    }

    avatar.x = nextX;
    avatar.y = nextY;
};

GraveFallGame.scene.Game.prototype.clearArenaItem = function () {
    if (this.arenaItem && this.arenaItem.parent) {
        this.arenaItem.parent.removeChild(this.arenaItem, true);
    }

    this.arenaItem = null;
};

GraveFallGame.scene.Game.prototype.spawnArenaItem = function () {
    var inner = this.getArenaInnerBounds();
    var itemScale = 0.45;
    var item = new rune.display.Sprite(0, 0, 100, 100, "Item_Icon_T");
    var maxX;
    var maxY;

    item.scaleX = itemScale;
    item.scaleY = itemScale;
    this.applyMonochromeIconColor(item, "#FFFFFF");

    maxX = inner.x + inner.width - (item.width * item.scaleX);
    maxY = inner.y + inner.height - (item.height * item.scaleY);

    item.x = this.randomRange(inner.x, maxX);
    item.y = this.randomRange(inner.y, maxY);

    this.arenaAvatarLayer.addChild(item);
    this.arenaItem = item;
    this.playSfx(GraveFallGame.SOUNDS.ITEM_SPAWN, 0.45);
};

GraveFallGame.scene.Game.prototype.updateArenaItem = function () {
    if (this.arenaItem) return;
    if (this.itemSpawnTimer > 0) {
        this.itemSpawnTimer--;
        return;
    }
    this.spawnArenaItem();
};

GraveFallGame.scene.Game.prototype.checkItemCollisions = function () {
    var i;
    var playerMenu;

    if (!this.arenaItem) return;

    for (i = 0; i < this.playerMenus.length; i++) {
        playerMenu = this.playerMenus[i];

        if (playerMenu.healthCurrent <= 0) {
            continue;
        }

        if (this.rectsOverlap(playerMenu.battleAvatar, this.arenaItem)) {
            this.playSfx(GraveFallGame.SOUNDS.ITEM_PICKUP, 0.65);
            this.clearArenaItem();

            // 🔥 ADD THIS: reset random spawn delay
            this.itemSpawnTimer = Math.floor(this.randomRange(90, 240));

            break;
        }
    }
};
GraveFallGame.scene.Game.prototype.updateActionPhase = function () {
    var enemy = this.getCurrentEnemyConfig();
    var i;

    this.actionPhaseTimer--;
    this.nextPatternIn--;

    this.updateArenaItem();
    this.checkItemCollisions();

    if (this.nextPatternIn <= 0) {
        this.spawnEnemyPattern();
        this.nextPatternIn = enemy.patternInterval;
    }

    for (i = 0; i < this.playerMenus.length; i++) {
        this.updateBattleAvatarMovement(this.playerMenus[i]);
        this.updatePlayerHitFlicker(this.playerMenus[i]);
    }

    this.updateProjectiles();
    this.checkProjectileCollisions();

    if (this.areAllPlayersDown()) {
        this.endActionPhase();
        return;
    }

    if (this.actionPhaseTimer <= 0) {
        this.endActionPhase();
    }
};
//------------------------------------------------------------------------------
// Menu / command phase UI
//------------------------------------------------------------------------------

GraveFallGame.scene.Game.prototype.createCharacterMenu = function (options) {
    var menuWidth = 320;
    var menuHeight = 128;
    var topPanelHeight = 64;
    var bottomPanelHeight = 64;
    var actionPositions = [10, 95, 180, 255];
    var standScale = 2.3;
    var standWidth = 100 * standScale;
    var battleAvatarScale = 0.7;
    var standX = options.x + (menuWidth / 2) - (standWidth / 2);

    var characterMenu = new rune.display.DisplayObjectContainer(
        options.x,
        options.y,
        menuWidth,
        menuHeight
    );

    var characterMenuCharacter = new rune.display.DisplayObjectContainer(
        0,
        0,
        menuWidth,
        topPanelHeight
    );

    var characterMenuActions = new rune.display.DisplayObjectContainer(
        0,
        topPanelHeight,
        menuWidth,
        bottomPanelHeight
    );

    var uiSkin = options.uiSkin || GraveFallGame.scene.Game.UI_SKINS.dullBrown;
    var framePaletteSwaps = this.getFramePaletteSwaps(uiSkin);
    var outerFrame = this.createBoxFrame(0, 0, menuWidth, menuHeight, framePaletteSwaps);
    var separator = this.createSeparator(0, topPanelHeight - 4, menuWidth, framePaletteSwaps);

    var menuAccent = new rune.display.Graphic(0, 0, menuWidth, 4);
    var actionAccent = new rune.display.Graphic(0, 0, menuWidth, 2);
    var actionSelectionBar = new rune.display.Graphic(actionPositions[0], 57, 60, 3);

    var characterStand = this.createDamageStateGroup(standX, 400, 100, 100, this.getPlayerStandDamageStates(options.stand), { flippedX: options.flipStandX });
    var battleAvatar = new rune.display.Sprite(0, 0, 100, 100, options.classIcon);

    var characterIcon = this.createDamageStateGroup(10, 5, 80, 80, this.getPortraitDamageStates(options.portrait));
    var characterClassIcon = new rune.display.Sprite(55, 30, 100, 100, options.classIcon);

    var fightIcon = new rune.display.Sprite(10, 10, 100, 100, "Fight_Icon_T");
    var defendIcon = new rune.display.Sprite(95, 10, 100, 100, "Defend_Icon_T");
    var buffIcon = new rune.display.Sprite(180, 10, 100, 100, "Buff_Icon_T");
    var itemIcon = new rune.display.Sprite(255, 10, 100, 100, "Item_Icon_T");

    var characterHealthBarBackground = new rune.display.Graphic(100, 38, 200, 17);
    var characterHealthBar = new rune.display.Graphic(100, 38, 200, 17);
    var characterHealthMax = new rune.text.BitmapField("/" + options.hpMax);
    var characterHealthCurrent = new rune.text.BitmapField(String(options.hpCurrent));
    var HpText = new rune.text.BitmapField("HP");

    characterHealthBar.scaleX = Math.max(0, Math.min(1, options.hpCurrent / options.hpMax));

    characterHealthMax.scaleX = 2;
    characterHealthMax.scaleY = 2;
    characterHealthMax.x = 255;
    characterHealthMax.y = 13;

    characterHealthCurrent.scaleX = 2;
    characterHealthCurrent.scaleY = 2;
    characterHealthCurrent.x = 230;
    characterHealthCurrent.y = 13;

    HpText.scaleX = 2;
    HpText.scaleY = 2;
    HpText.x = 100;
    HpText.y = 15;

    fightIcon.scaleX = 0.6;
    fightIcon.scaleY = 0.6;
    defendIcon.scaleX = 0.6;
    defendIcon.scaleY = 0.6;
    buffIcon.scaleX = 0.6;
    buffIcon.scaleY = 0.6;
    itemIcon.scaleX = 0.6;
    itemIcon.scaleY = 0.6;

    characterClassIcon.scaleX = 0.35;
    characterClassIcon.scaleY = 0.35;

    battleAvatar.scaleX = battleAvatarScale;
    battleAvatar.scaleY = battleAvatarScale;
    battleAvatar.visible = false;
    battleAvatar.alpha = 0;

    characterStand.scaleX = standScale;
    characterStand.scaleY = standScale;

    if (options.flipStandX === true) {
        characterStand.flippedX = false;
        battleAvatar.flippedX = false;
    }

    characterMenu.addChild(characterMenuCharacter);
    characterMenu.addChild(characterMenuActions);
    characterMenu.addChild(outerFrame);
    characterMenu.addChild(separator);

    characterMenuCharacter.addChild(menuAccent);
    characterMenuActions.addChild(actionAccent);
    characterMenuActions.addChild(actionSelectionBar);
    characterMenuCharacter.addChild(characterIcon);
    characterMenuCharacter.addChild(characterClassIcon);
    characterMenuCharacter.addChild(characterHealthBarBackground);
    characterMenuCharacter.addChild(characterHealthBar);
    characterMenuCharacter.addChild(characterHealthMax);
    characterMenuCharacter.addChild(characterHealthCurrent);
    characterMenuCharacter.addChild(HpText);

    characterMenuActions.addChild(fightIcon);
    characterMenuActions.addChild(defendIcon);
    characterMenuActions.addChild(buffIcon);
    characterMenuActions.addChild(itemIcon);

    this.applyPlayerTheme(options.playerTheme, {
        menuRoot: characterMenu,
        menuCharacter: characterMenuCharacter,
        menuActions: characterMenuActions,
        menuAccent: menuAccent,
        actionAccent: actionAccent,
        selectionBar: actionSelectionBar,
        portrait: characterIcon,
        classIcon: characterClassIcon,
        battleAvatar: battleAvatar,
        stand: characterStand,
        healthBarBackground: characterHealthBarBackground,
        healthBarFill: characterHealthBar,
        actions: [fightIcon, defendIcon, buffIcon, itemIcon]
    }, options);

    this.stage.addChild(characterStand);
    this.arenaAvatarLayer.addChild(battleAvatar);
    this.stage.addChild(characterMenu);

    var playerMenu = {
        container: characterMenu,
        stand: characterStand,
        portrait: characterIcon,
        classIcon: characterClassIcon,
        battleAvatar: battleAvatar,
        actions: [fightIcon, defendIcon, buffIcon, itemIcon],
        actionPositions: actionPositions,
        selectionBar: actionSelectionBar,
        healthBarBackground: characterHealthBarBackground,
        healthBarFill: characterHealthBar,
        healthCurrentText: characterHealthCurrent,
        healthMaxText: characterHealthMax,
        healthCurrent: options.hpCurrent,
        healthMax: options.hpMax,
        healthTextRightX: 300,
        healthTextGap: 4,
        healthTextCharacterWidth: 6,
        healthTextY: 13,
        theme: options.playerTheme,
        selectedIndex: 0,
        selectedAction: null,
        confirmed: false,
        baseY: options.y,
        confirmedY: options.y + 58,
        controls: options.controls,
        moveControls: options.moveControls,
        moveSpeed: 4,
        attackDamage: options.attackDamage || 20,
        attackDamageBonus: 0,
        hitCooldown: 0
    };

    this.updatePlayerHealthUi(playerMenu);
    this.updateCharacterMenuVisuals(playerMenu);

    return playerMenu;
};


GraveFallGame.scene.Game.prototype.updatePlayerDamageState = function (playerMenu, allPlayersDead) {
    var state = this.getHealthDamageState(playerMenu.healthCurrent, playerMenu.healthMax, true, allPlayersDead);
    var downed = state === "knockedOut" || state === "dead";
    var iconColor = downed ? GraveFallGame.scene.Game.PLAYER_DOWNED_PALETTE.mid : playerMenu.theme.accent;

    this.setDamageStateGroupState(playerMenu.stand, state);
    this.setDamageStateGroupState(playerMenu.portrait, state);

    this.applyMonochromeIconColor(playerMenu.classIcon, iconColor);
    this.applyMonochromeIconColor(playerMenu.battleAvatar, iconColor);

    playerMenu.stand.alpha = 1;
    playerMenu.classIcon.alpha = 1;
    playerMenu.container.alpha = 1;
    playerMenu.selectionBar.visible = !downed;

    for (var i = 0; i < playerMenu.actions.length; i++) {
        playerMenu.actions[i].alpha = downed ? 0.45 : 1;
    }
};

GraveFallGame.scene.Game.prototype.updateAllPlayerDamageStates = function () {
    var allPlayersDead = this.areAllPlayersDown();
    var i;

    for (i = 0; i < this.playerMenus.length; i++) {
        this.updateCharacterMenuInput(this.playerMenus[i]);
        this.updatePlayerDamageState(this.playerMenus[i], allPlayersDead);
    }
};

GraveFallGame.scene.Game.prototype.updateEnemyDamageState = function () {
    this.setDamageStateGroupState(
        this.enemySprite,
        this.getHealthDamageState(this.enemyHealthCurrent, this.enemyHealthMax, false, false)
    );
};

GraveFallGame.scene.Game.prototype.applyDamageToEnemy = function (amount) {
    var wasAlive = this.enemyHealthCurrent > 0;

    this.enemyHealthCurrent = Math.max(0, this.enemyHealthCurrent - amount);
    this.updateEnemyDamageState();

    this.updateEnemyHealthBarUi();

    if (amount > 0 && wasAlive) {
        this.playSfx(GraveFallGame.SOUNDS.PLAYER_ATTACK, 0.65);
        this.playSfx(GraveFallGame.SOUNDS.ENEMY_HIT, 0.55);
    }

    if (wasAlive && this.enemyHealthCurrent <= 0 && this.enemyDefeatedSoundPlayed !== true) {
        this.enemyDefeatedSoundPlayed = true;
        this.playSfx(GraveFallGame.SOUNDS.ENEMY_DEFEATED, 0.8);
    }
};

GraveFallGame.scene.Game.prototype.resolveCommandPhaseActions = function () {
    var i;
    var playerMenu;
    var baseDmg;
    var bonusDmg;

    if (this.enemyHealthCurrent <= 0) {
        return;
    }

    for (i = 0; i < this.playerMenus.length; i++) {
        playerMenu = this.playerMenus[i];

        if (playerMenu.healthCurrent <= 0) {
            continue;
        }

        // Action index 0 is the fight action.
        if (playerMenu.selectedAction === 0) {
            
            baseDmg = 5;
            
            // --- NEW: Multiplied by 5 for bigger minigame impact! ---
            bonusDmg = (playerMenu.attackDamageBonus || 0) * 1; 
            
            this.applyDamageToEnemy(baseDmg + bonusDmg);

            // Important: Clear the bonus so it doesn't accidentally carry over to the next round
            playerMenu.attackDamageBonus = 0; 
        }
    }
};

GraveFallGame.scene.Game.prototype.updateCharacterMenuVisuals = function (playerMenu) {
    var i;

    playerMenu.selectionBar.x = playerMenu.actionPositions[playerMenu.selectedIndex];
    playerMenu.selectionBar.visible = playerMenu.healthCurrent > 0;

    for (i = 0; i < playerMenu.actions.length; i++) {
        if (i === playerMenu.selectedIndex) {
            playerMenu.actions[i].scaleX = 0.6;
            playerMenu.actions[i].scaleY = 0.6;
        } else {
            playerMenu.actions[i].scaleX = 0.6;
            playerMenu.actions[i].scaleY = 0.6;
        }
    }
};

GraveFallGame.scene.Game.prototype.updateCharacterMenuInput = function (playerMenu) {
    if (playerMenu.healthCurrent <= 0) {
        playerMenu.confirmed = true;
        playerMenu.selectedAction = null;
        playerMenu.container.y = playerMenu.confirmedY;
        this.updateCharacterMenuVisuals(playerMenu);
        return;
    }

    if (playerMenu.confirmed) {
        playerMenu.container.y = playerMenu.confirmedY;
        this.updateCharacterMenuVisuals(playerMenu);
        return;
    }

    if (this.keyboard.justPressed(playerMenu.controls.left)) {
        playerMenu.selectedIndex--;

        if (playerMenu.selectedIndex < 0) {
            playerMenu.selectedIndex = playerMenu.actions.length - 1;
        }

        this.playSfx(GraveFallGame.SOUNDS.UI_MOVE, 0.4);
    }

    if (this.keyboard.justPressed(playerMenu.controls.right)) {
        playerMenu.selectedIndex++;

        if (playerMenu.selectedIndex >= playerMenu.actions.length) {
            playerMenu.selectedIndex = 0;
        }

        this.playSfx(GraveFallGame.SOUNDS.UI_MOVE, 0.4);
    }

    if (this.keyboard.justPressed(playerMenu.controls.confirm)) {
        playerMenu.selectedAction = playerMenu.selectedIndex;
        playerMenu.confirmed = true;
        playerMenu.container.y = playerMenu.confirmedY;
        this.playSfx(GraveFallGame.SOUNDS.UI_CONFIRM, 0.55);
    }

    this.updateCharacterMenuVisuals(playerMenu);
};//------------------------------------------------------------------------------
// Scene lifecycle
//------------------------------------------------------------------------------

GraveFallGame.scene.Game.prototype.init = function () {
    rune.scene.Scene.prototype.init.call(this);

    this.phase = GraveFallGame.scene.Game.PHASE_COMMAND;
    this.encounterIndex = 0;
    this.currentEnemyType = this.getEnemyTypeForEncounter(this.encounterIndex);
    this.actionPhaseTimer = 0;
    this.nextPatternIn = 0;
    this.minigameTimer = 0;
    this.projectiles = [];
    this.playerMenus = [];

    this.arenaItem = null;
    this.itemSpawnTimer = 0;
    this.gameOverText = null;
    this.gameOverTimer = 0;
    this.lastTurnWarningSecond = null;
    this.enemyDefeatedSoundPlayed = false;
    this.dungeonMusic = null;
    
    // Fade-in timer for every new enemy and its healthbar.
    this.enemyFadeTimerMs = 0;
    this.enemyFadeDurationMs = 1500;
    this.enemyDefeatedTimerMs = 0;

    this.startDungeonMusic();

    // turn timer (10 seconds ≈ 600 frames)
    this.turnTimer = 600;
    this.turnTimerMs = 10000;

    this.turnTimerText = new rune.text.BitmapField("10");
    this.turnTimerText.scaleX = 2;
    this.turnTimerText.scaleY = 2;
    this.turnTimerText.x = this.application.screen.width - 28;
    this.turnTimerText.y = 8;

    this.backgroundBackdrop = new rune.display.Sprite(
        0,
        0,
        this.application.screen.width,
        this.application.screen.height,
        "Background_Test"
    );
    this.applyPaletteSwaps(
        this.backgroundBackdrop,
        this.getFramePaletteSwaps(GraveFallGame.scene.Game.UI_SKINS.dullBrown)
    );
    this.stage.addChild(this.backgroundBackdrop);

    this.enemyHealthMax = this.getCurrentEnemyConfig().hpMax;
    this.enemyHealthCurrent = this.enemyHealthMax;
    this.enemySprite = this.createDamageStateGroup(
        0,
        0,
        100,
        100,
        this.getEnemyDamageStates(this.getCurrentEnemyConfig())
    );
    this.enemySprite.scaleX = 3.2;
    this.enemySprite.scaleY = 3.2;
    this.enemySprite.x = (this.application.screen.width / 1) - ((this.enemySprite.width * this.enemySprite.scaleX) / 1.28);
    this.enemySprite.y = 180;
    this.setDamageStateGroupState(this.enemySprite, "hp100");
    this.stage.addChild(this.enemySprite);
    this.bossPlaceholder = this.enemySprite;

    // --- ENEMY HEALTH BAR UI ---
    var eBarWidth = 300;
    var eBarHeight = 32;
    var eBarX = (this.application.screen.width / 2) - (eBarWidth / 2);
    var eBarY = 200;
    this.enemyHealthBarWidth = eBarWidth;
    this.enemyHealthBarX = eBarX; 

    this.enemyHealthBg = new rune.display.Graphic(eBarX, eBarY, eBarWidth, eBarHeight);
    this.enemyHealthBg.backgroundColor = "#111111";
    this.stage.addChild(this.enemyHealthBg);

    this.enemyHealthFill = new rune.display.Graphic(eBarX + 4, eBarY + 4, eBarWidth - 8, eBarHeight - 8);
    this.enemyHealthFill.backgroundColor = "#E53935"; 
    this.stage.addChild(this.enemyHealthFill);

    this.enemyHealthFrame = this.createBoxFrame(eBarX, eBarY, eBarWidth, eBarHeight, this.getFramePaletteSwaps(GraveFallGame.scene.Game.UI_SKINS.dullBrown));
    this.stage.addChild(this.enemyHealthFrame);

    this.enemyHealthText = new rune.text.BitmapField(this.enemyHealthCurrent + "/" + this.enemyHealthMax);
    this.enemyHealthText.scaleX = 2;
    this.enemyHealthText.scaleY = 2;
    this.enemyHealthText.x = eBarX + (eBarWidth / 2) - ((this.enemyHealthText.text.length * 6 * 2) / 2);
    this.enemyHealthText.y = eBarY + 8;
    this.stage.addChild(this.enemyHealthText);

    // Initial opacity set to 0 to prepare for the fade-in
    this.enemySprite.alpha = 0;
    this.enemyHealthBg.alpha = 0;
    this.enemyHealthFill.alpha = 0;
    this.enemyHealthFrame.alpha = 0;
    this.enemyHealthText.alpha = 0;
    // --------------------------------

    this.createBattleArena();
    this.stage.addChild(this.turnTimerText);

    this.playerMenus.push(this.createCharacterMenu({
        x: 0,
        y: 592,
        portrait: "Fighter_Portrait",
        classIcon: "Fighter_Icon_T",
        stand: "Fighter_Idle_Stance",
        hpCurrent: 100,
        hpMax: 160,
        playerTheme: this.getPlayerTheme(0),
        controls: {
            left: "a",
            right: "d",
            confirm: "space"
        },
        moveControls: {
            left: "a",
            right: "d",
            up: "w",
            down: "s"
        }
    }));

    this.playerMenus.push(this.createCharacterMenu({
        x: 320,
        y: 592,
        portrait: "Assassin_Portrait",
        classIcon: "Assassin_Icon_T",
        stand: "Assassin_Idle_Stance",
        hpCurrent: 95,
        hpMax: 120,
        playerTheme: this.getPlayerTheme(1),
        controls: {
            left: "left",
            right: "right",
            confirm: "enter"
        },
        moveControls: {
            left: "left",
            right: "right",
            up: "up",
            down: "down"
        }
    }));

    this.playerMenus.push(this.createCharacterMenu({
        x: 640,
        y: 592,
        portrait: "Wizard_Portrait",
        classIcon: "Wizard_Icon_T",
        stand: "Wizard_Idle_Stance",
        hpCurrent: 34,
        hpMax: 100,
        playerTheme: this.getPlayerTheme(2),
        flipStandX: true,
        controls: {
            left: "j",
            right: "l",
            confirm: "k"
        },
        moveControls: {
            left: "j",
            right: "l",
            up: "i",
            down: "k"
        }
    }));

    this.playerMenus.push(this.createCharacterMenu({
        x: 960,
        y: 592,
        portrait: "Ranger_Portrait",
        classIcon: "Ranger_Icon_T",
        stand: "Ranger_Idle_Stance",
        hpCurrent: 34,
        hpMax: 112,
        playerTheme: this.getPlayerTheme(3),
        flipStandX: true,
        controls: {
            left: "v",
            right: "n",
            confirm: "b"
        },
        moveControls: {
            left: "f",
            right: "h",
            up: "t",
            down: "g"
        }
    }));

    this.updateAllPlayerDamageStates();
    this.updateEnemyDamageState();
};

GraveFallGame.scene.Game.prototype.update = function (step) {
    var i;
    var secondsLeft;
    var autoSelected;
    var requiresMinigame;

    rune.scene.Scene.prototype.update.call(this, step);

    // Enemy and health bar fade-in logic.
    if (this.enemyFadeTimerMs < this.enemyFadeDurationMs) {
        this.enemyFadeTimerMs += step;
        
        var fadeAlpha = Math.min(1, this.enemyFadeTimerMs / this.enemyFadeDurationMs);
        this.setEnemyUiAlpha(fadeAlpha);
    }

    if (this.phase === GraveFallGame.scene.Game.PHASE_GAME_OVER) {
        this.updateGameOver();
        return;
    }

    if (this.phase === GraveFallGame.scene.Game.PHASE_ENEMY_DEFEATED) {
        this.updateEnemyDefeatedSequence(step);
        return;
    }

    if (this.phase === GraveFallGame.scene.Game.PHASE_COMMAND) {
        this.turnTimerMs -= step;

        if (this.turnTimerMs < 0) {
            this.turnTimerMs = 0;
        }

        secondsLeft = Math.ceil(this.turnTimerMs / 1000);
        this.turnTimerText.text = String(secondsLeft);

        if (secondsLeft > 0 && secondsLeft <= 3 && this.lastTurnWarningSecond !== secondsLeft) {
            this.lastTurnWarningSecond = secondsLeft;
            this.playSfx(GraveFallGame.SOUNDS.TURN_WARNING, 0.45);
        }

        for (i = 0; i < this.playerMenus.length; i++) {
            this.updateCharacterMenuInput(this.playerMenus[i]);
        }

        if (this.turnTimerMs <= 0 || this.areAllPlayersConfirmed()) {
            if (this.turnTimerMs <= 0) {
                autoSelected = false;

                for (i = 0; i < this.playerMenus.length; i++) {
                    if (!this.playerMenus[i].confirmed && this.playerMenus[i].healthCurrent > 0) {
                        this.playerMenus[i].selectedIndex = 0;
                        this.playerMenus[i].selectedAction = 0;
                        this.playerMenus[i].confirmed = true;
                        this.playerMenus[i].container.y = this.playerMenus[i].confirmedY;
                        autoSelected = true;
                    }
                }

                if (autoSelected) {
                    this.playSfx(GraveFallGame.SOUNDS.TURN_TIMEOUT, 0.7);
                }
            }

            requiresMinigame = false;

            for (i = 0; i < this.playerMenus.length; i++) {
                if (this.playerMenus[i].healthCurrent > 0 && this.playerMenus[i].selectedAction === 0) {
                    requiresMinigame = true;
                    break;
                }
            }

            if (requiresMinigame && typeof this.startMinigamePhase === "function") {
                this.startMinigamePhase();
            } else {
                this.startActionPhase();
            }

            return;
        }
    } else if (this.phase === GraveFallGame.scene.Game.PHASE_MINIGAME) {
        this.updateMinigamePhase(step);
    } else if (this.phase === GraveFallGame.scene.Game.PHASE_ACTION) {
        this.updateActionPhase();
    }

    if (this.keyboard.justPressed("escape")) {
        this.playSfx(GraveFallGame.SOUNDS.UI_BACK, 0.55);
        this.application.scenes.load([
            new GraveFallGame.scene.Menu()
        ]);
    }
};

GraveFallGame.scene.Game.prototype.dispose = function () {
    this.stopDungeonMusic();
    this.clearProjectiles();
    this.clearArenaItem();

    this.projectiles = null;
    this.playerMenus = null;
    this.backgroundBackdrop = null;
    this.bossPlaceholder = null;
    this.enemySprite = null;
    this.enemyHealthCurrent = null;
    this.enemyHealthMax = null;
    
    // Cleanup new UI
    this.enemyHealthBg = null;
    this.enemyHealthFill = null;
    this.enemyHealthFrame = null;
    this.enemyHealthText = null;
    this.enemyHealthBarWidth = null;
    this.enemyHealthBarX = null;
    this.enemyFadeTimerMs = null;
    this.enemyFadeDurationMs = null;
    this.enemyDefeatedTimerMs = null;
    this.encounterIndex = null;

    this.arenaBackground = null;
    this.arenaProjectileLayer = null;
    this.arenaAvatarLayer = null;
    this.arenaFrame = null;
    this.arena = null;
    this.turnTimerText = null;
    this.turnTimerMs = null;
    this.arenaItem = null;
    this.itemSpawnTimer = null;
    this.gameOverText = null;
    this.gameOverTimer = null;
    this.dungeonMusic = null;

    rune.scene.Scene.prototype.dispose.call(this);
};//------------------------------------------------------------------------------
// Minigame phase logic
//------------------------------------------------------------------------------

GraveFallGame.scene.Game.prototype.startMinigamePhase = function () {
    var i;
    var menu;

    this.phase = GraveFallGame.scene.Game.PHASE_MINIGAME;
    this.minigameTimer = 10000; // 10 seconds in ms

    if (this.turnTimerText) {
        this.turnTimerText.visible = false;
    }

    for (i = 0; i < this.playerMenus.length; i++) {
        menu = this.playerMenus[i];

        if (menu.healthCurrent > 0 && menu.selectedAction === 0) {
            this.setupPlayerMinigame(menu);
            menu.stand.visible = false;
            menu.stand.alpha = 0;
        }
    }
};

GraveFallGame.scene.Game.prototype.createMinigameIcon = function (resource, x, y) {
    var icon = new rune.display.Sprite(x, y, 100, 100, resource);

    icon.scaleX = 0.42;
    icon.scaleY = 0.42;

    return icon;
};

GraveFallGame.scene.Game.prototype.layoutPlayerMinigame = function (menu) {
    var group;
    var gap;

    if (!menu || !menu.minigame || !menu.minigame.group) {
        return;
    }

    group = menu.minigame.group;
    gap = 10;

    group.x = menu.container.x + (menu.container.width / 2) - (group.width / 2);
    group.y = menu.container.y - group.height - gap;

    group.visible = true;
    group.alpha = 1;
};

GraveFallGame.scene.Game.prototype.clearMinigameButtons = function (menu) {
    var i;
    var sprite;

    if (!menu || !menu.minigame || !menu.minigame.group) {
        return;
    }

    if (menu.minigame.buttonSprites && menu.minigame.buttonSprites.length > 0) {
        for (i = menu.minigame.buttonSprites.length - 1; i >= 0; i--) {
            sprite = menu.minigame.buttonSprites[i];

            if (sprite && sprite.parent) {
                sprite.parent.removeChild(sprite, true);
            }
        }
    }

    menu.minigame.buttonSprites = [];
};

GraveFallGame.scene.Game.prototype.buildMinigameButtons = function (menu) {
    var i;
    var btn;
    var sprite;
    var group;
    var buttons;

    if (!menu || !menu.minigame) {
        return;
    }

    group = menu.minigame.group;
    buttons = menu.minigame.buttons;

    this.clearMinigameButtons(menu);

    for (i = 0; i < buttons.length; i++) {
        btn = buttons[i];
        sprite = this.createMinigameIcon(btn.resource, btn.x, btn.y);
        group.addChild(sprite);
        menu.minigame.buttonSprites.push(sprite);
    }
};

GraveFallGame.scene.Game.prototype.setupPlayerMinigame = function (menu) {
    var group;
    var theme;

    theme = menu.theme || this.getPlayerTheme(0);

    // 104x104 so the 4 button icons can sit in a cross shape.
    group = new rune.display.DisplayObjectContainer(0, 0, 104, 104);

    menu.minigame = {
        active: true,
        storedDamage: 0,
        currentTarget: 0,
        // Cross layout to match the image you showed.
        buttons: [
            { key: "up", resource: "Y_Button_Icon_T", x: 32, y: 0 },
            { key: "left", resource: "X_Button_Icon_T", x: 0, y: 32 },
            { key: "right", resource: "B_Button_Icon_T", x: 64, y: 32 },
            { key: "down", resource: "A_Button_Icon_T", x: 32, y: 64 }
        ],
        buttonSprites: [],
        group: group,
        theme: theme
    };

    this.stage.addChild(group);

    this.buildMinigameButtons(menu);
    this.scramblePlayerButton(menu);
    this.layoutPlayerMinigame(menu);
};

GraveFallGame.scene.Game.prototype.scramblePlayerButton = function (menu) {
    var i;
    var theme;
    var targetIndex;

    if (!menu || !menu.minigame) {
        return;
    }

    theme = menu.theme || this.getPlayerTheme(0);
    targetIndex = Math.floor(Math.random() * menu.minigame.buttons.length);
    menu.minigame.currentTarget = targetIndex;

    // Rebuild the sprites from scratch each time so the highlight always works.
    // Palette-swapping is destructive, so rebuilding avoids the "first press only"
    // problem.
    this.buildMinigameButtons(menu);

    for (i = 0; i < menu.minigame.buttonSprites.length; i++) {
        if (i === targetIndex) {
            this.applyMonochromeIconColor(menu.minigame.buttonSprites[i], theme.accent);
            menu.minigame.buttonSprites[i].alpha = 1;
            menu.minigame.buttonSprites[i].scaleX = 0.48;
            menu.minigame.buttonSprites[i].scaleY = 0.48;
        } else {
            this.applyMonochromeIconColor(menu.minigame.buttonSprites[i], "#E8E8E8");
            menu.minigame.buttonSprites[i].alpha = 0.95;
            menu.minigame.buttonSprites[i].scaleX = 0.42;
            menu.minigame.buttonSprites[i].scaleY = 0.42;
        }
    }

    this.layoutPlayerMinigame(menu);
};

GraveFallGame.scene.Game.prototype.updatePlayerMinigame = function (menu) {
    var target;
    var inputKey;

    if (!menu || !menu.minigame || menu.minigame.active !== true) {
        return;
    }

    this.layoutPlayerMinigame(menu);

    target = menu.minigame.buttons[menu.minigame.currentTarget];
    inputKey = menu.moveControls[target.key];

    if (inputKey && this.keyboard.justPressed(inputKey)) {
        menu.minigame.storedDamage += 1;
        this.playSfx(GraveFallGame.SOUNDS.UI_MOVE, 0.45);
        this.scramblePlayerButton(menu);
    }
};

GraveFallGame.scene.Game.prototype.updateMinigamePhase = function (step) {
    var i;
    var menu;

    this.minigameTimer -= step;

    if (this.minigameTimer < 0) {
        this.minigameTimer = 0;
    }

    for (i = 0; i < this.playerMenus.length; i++) {
        menu = this.playerMenus[i];

        if (menu.minigame && menu.minigame.active) {
            this.updatePlayerMinigame(menu);
        }
    }

    if (this.minigameTimer <= 0) {
        this.endMinigamePhase();
    }
};

GraveFallGame.scene.Game.prototype.endMinigamePhase = function () {
    var i;
    var menu;

    for (i = 0; i < this.playerMenus.length; i++) {
        menu = this.playerMenus[i];

        if (!menu.minigame) {
            continue;
        }

        // Store bonus damage for the upcoming action phase.
        menu.attackDamageBonus = menu.minigame.storedDamage || 0;

        if (menu.minigame.group && menu.minigame.group.parent) {
            menu.minigame.group.parent.removeChild(menu.minigame.group, true);
        }

        menu.minigame.active = false;
        menu.minigame = null;

        if (menu.stand) {
            menu.stand.visible = true;
            menu.stand.alpha = 1;
        }
    }

    if (this.turnTimerText) {
        this.turnTimerText.visible = false;
    }

    this.startActionPhase();
};//------------------------------------------------------------------------------
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
 * Game state.
 */
GraveFallGame.scene.Menu = function () {

    /**
     * Index of the currently selected menu option.
     *
     * @type {number}
     */
    this.index = 0;

    /**
     * Array containing the menu text fields.
     *
     * @type {Array}
     */
    this.options = null;

    /**
     * Pointer graphic.
     *
     * @type {?rune.ui.VTMenuPointer}
     */
    this.pointer = null;

    /**
     * Gap between pointer and text.
     *
     * @type {number}
     */
    this.pointerGap = 20;

    /**
     * Gap between menu rows.
     *
     * @type {number}
     */
    this.optionGap = 24;

    /**
     * Menu scale.
     *
     * @type {number}
     */
    this.menuScale = 4;

    rune.scene.Scene.call(this);
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

GraveFallGame.scene.Menu.prototype = Object.create(rune.scene.Scene.prototype);
GraveFallGame.scene.Menu.prototype.constructor = GraveFallGame.scene.Menu;

//------------------------------------------------------------------------------
// Override public prototype methods (ENGINE)
//------------------------------------------------------------------------------

/**
 * @inheritDoc
 */
GraveFallGame.scene.Menu.prototype.init = function (step) {
    rune.scene.Scene.prototype.init.call(this);

    var screen = this.application.screen;

    this.options = [
        new rune.text.BitmapField("Start Game"),
        new rune.text.BitmapField("Rules")
    ];

    // Create the pointer first so we can use its scaled width
    this.pointer = new rune.ui.VTMenuPointer();
    this.pointer.scaleX = this.menuScale;
    this.pointer.scaleY = this.menuScale;
    this.stage.addChild(this.pointer);

    var i;
    var opt;
    var maxWidth = 0;
    var totalHeight = 0;

    // Scale menu text up and measure final size
    for (i = 0; i < this.options.length; i++) {
        opt = this.options[i];
        opt.autoSize = true;
        opt.scaleX = this.menuScale;
        opt.scaleY = this.menuScale;

        if (opt.width > maxWidth) {
            maxWidth = opt.width;
        }

        totalHeight += opt.height;
    }

    totalHeight += this.optionGap * (this.options.length - 1);

    // Center the whole menu block on screen
    var blockWidth = this.pointer.width + this.pointerGap + maxWidth;
    var menuLeft = Math.round(screen.centerX - (blockWidth / 2));
    var textX = menuLeft + this.pointer.width + this.pointerGap;
    var currentY = Math.round(screen.centerY - (totalHeight / 2));

    // Position options using their real scaled height
    for (i = 0; i < this.options.length; i++) {
        opt = this.options[i];
        opt.x = textX;
        opt.y = currentY;

        this.stage.addChild(opt);

        currentY += opt.height + this.optionGap;
    }

    this.updateVisuals();
};

/**
 * @inheritDoc
 */
GraveFallGame.scene.Menu.prototype.update = function (step) {
    rune.scene.Scene.prototype.update.call(this, step);

    if (this.keyboard.justPressed("down") && this.index < this.options.length - 1) {
        this.index++;
        GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_MOVE, 0.45);
        this.updateVisuals();
    }

    if (this.keyboard.justPressed("up") && this.index > 0) {
        this.index--;
        GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_MOVE, 0.45);
        this.updateVisuals();
    }

    if (this.keyboard.justPressed("space")) {
        GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_CONFIRM, 0.6);

        if (this.index === 0) {
            this.application.scenes.load([
                new GraveFallGame.scene.Game()
            ]);
        } else if (this.index === 1) {
            this.application.scenes.load([
                new GraveFallGame.scene.Rule()
            ]);
        }
    }
};

//------------------------------------------------------------------------------
// Internal prototype methods
//------------------------------------------------------------------------------

/**
 * Updates the visual state of the menu options.
 *
 * @returns {undefined}
 */
GraveFallGame.scene.Menu.prototype.updateVisuals = function () {
    var selectedOption = this.options[this.index];

    // Keep the pointer aligned to the selected option's actual scaled bounds
    this.pointer.x = Math.round(selectedOption.x - this.pointer.width - this.pointerGap);
    this.pointer.centerY = selectedOption.centerY;
};//------------------------------------------------------------------------------
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
 * 
 * Rule scene.
 */
GraveFallGame.scene.Rule = function () {

    //--------------------------------------------------------------------------
    // Super call
    //--------------------------------------------------------------------------

    /**
     * Calls the constructor method of the super class.
     */
    rune.scene.Scene.call(this);
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

GraveFallGame.scene.Rule.prototype = Object.create(rune.scene.Scene.prototype);
GraveFallGame.scene.Rule.prototype.constructor = GraveFallGame.scene.Rule;

//------------------------------------------------------------------------------
// Override public prototype methods (ENGINE)
//------------------------------------------------------------------------------

/**
 * This method is automatically executed once after the scene is instantiated. 
 * The method is used to create objects to be used within the scene.
 *
 * @returns {undefined}
 */
GraveFallGame.scene.Rule.prototype.init = function() {
    rune.scene.Scene.prototype.init.call(this);

    var ruleText = new rune.text.BitmapField(
        "HOW TO PLAY\n\n" +
        "MOVE WITH ARROW KEYS\n" +
        "AVOID THE PROJECTILES\n" +
        "SURVIVE AS LONG AS YOU CAN\n\n" +
        "PRESS ESCAPE TO GO BACK"
    );

    ruleText.autoSize = true;
    ruleText.scaleX = 3;
    ruleText.scaleY = 3;

    ruleText.x = Math.round(this.application.screen.centerX - (ruleText.width / 2));
    ruleText.y = Math.round(this.application.screen.centerY - (ruleText.height / 2));

    this.stage.addChild(ruleText);
};

/**
 * This method is automatically executed once per "tick". The method is used for 
 * calculations such as application logic.
 *
 * @param {number} step Fixed time step.
 *
 * @returns {undefined}
 */
GraveFallGame.scene.Rule.prototype.update = function(step) {
    rune.scene.Scene.prototype.update.call(this, step);

    if (this.keyboard.justPressed("escape")) {
        GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_BACK, 0.55);
        this.application.scenes.load([
            new GraveFallGame.scene.Menu()
        ]);
    }
};

/**
 * This method is automatically called once just before the scene ends. Use 
 * the method to reset references and remove objects that no longer need to 
 * exist when the scene is destroyed. The process is performed in order to 
 * avoid memory leaks.
 *
 * @returns {undefined}
 */
GraveFallGame.scene.Rule.prototype.dispose = function () {
    rune.scene.Scene.prototype.dispose.call(this);
};