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
 * 
 * Game scene.
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
GraveFallGame.scene.Game.PHASE_ACTION = "action";
GraveFallGame.scene.Game.PHASE_GAME_OVER = "gameOver";

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
    boss: {
        name: "Boss",
        resource: "Goblin_Idle_T",
        // Replace these resources later with Boss_Bruised_T, Boss_Hurt_T,
        // Boss_Dying_T, Boss_Killed_T, etc. when those sprites exist.
        // The last visible damage state is reused as the killed placeholder.
        damageStateResources: {
            hp100: "Goblin_Idle_T",
            hp75: "Goblin_Idle_T",
            hp50: "Goblin_Idle_T",
            hp25: "Goblin_Idle_T",
            killed: "Goblin_Idle_T"
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
    goblin: {
        name: "Goblin",
        resource: "Goblin_Idle_T",
        // Swap these placeholders for Goblin_Bruised_T, Goblin_Hurt_T,
        // Goblin_Dying_T, Goblin_Killed_T, etc. after adding those resources.
        damageStateResources: {
            hp100: "Goblin_Idle_T",
            hp75: "Goblin_Idle_T",
            hp50: "Goblin_Idle_T",
            hp25: "Goblin_Idle_T",
            killed: "Goblin_Idle_T"
        },
        hpMax: 100,
        actionPhaseDuration: 240,
        patternInterval: 45,
        patterns: [
            "goblin_pebble_rain",
            "goblin_dart_fan",
            "goblin_stomp_wave"
        ]
    }
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
    return GraveFallGame.scene.Game.ENEMIES[this.currentEnemyType] || GraveFallGame.scene.Game.ENEMIES.boss;
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

    return {
        x: this.arena.x + borderPadding,
        y: this.arena.y + borderPadding,
        width: this.arena.width - (borderPadding * 2),
        height: this.arena.height - (borderPadding * 2)
    };
};
