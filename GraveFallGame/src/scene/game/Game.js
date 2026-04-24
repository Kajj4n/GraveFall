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
        { from: GraveFallGame.scene.Game.MONO_ICON_SOURCE, to: targetColor },
        { from: GraveFallGame.scene.Game.PLAYER_DOWNED_PALETTE.mid, to: targetColor },
        { from: "#E53935", to: targetColor },
        { from: "#1E88E5", to: targetColor },
        { from: "#FDD835", to: targetColor },
        { from: "#43A047", to: targetColor }
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

    this.arenaProjectileLayer = new rune.display.DisplayObjectContainer(0, 0, screenWidth, this.application.screen.height);
    this.arenaProjectileLayer.visible = false;
    this.stage.addChild(this.arenaProjectileLayer);

    this.arenaAvatarLayer = new rune.display.DisplayObjectContainer(0, 0, screenWidth, this.application.screen.height);
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

GraveFallGame.scene.Game.prototype.startActionPhase = function () {
    var enemy = this.getCurrentEnemyConfig();
    var i;

    this.resolveCommandPhaseActions();
    this.clearArenaItem();
    this.itemSpawnTimer = Math.floor(this.randomRange(90, 240));
    this.turnTimerText.alpha = 0;
    this.phase = GraveFallGame.scene.Game.PHASE_ACTION;
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
    this.actionPhaseTimer = 0;
    this.nextPatternIn = 0;
    this.clearProjectiles();
    this.setBattleArenaVisible(false);
    this.clearArenaItem();

    this.turnTimerMs = 10000;
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
};

GraveFallGame.scene.Game.prototype.spawnEnemyPattern = function () {
    var enemy = this.getCurrentEnemyConfig();
    var patternId = enemy.patterns[Math.floor(Math.random() * enemy.patterns.length)];
    this.spawnEnemyPatternById(patternId);
};

GraveFallGame.scene.Game.prototype.spawnEnemyPatternById = function (patternId) {
    switch (patternId) {
        case "boss_sword_rain":
            this.spawnBossSwordRain();
            break;

        case "boss_vertical_sweep":
            this.spawnBossVerticalSweep();
            break;

        case "boss_orb_burst":
            this.spawnBossOrbBurst();
            break;

        case "boss_diagonal_drop":
            this.spawnBossDiagonalDrop();
            break;

        case "goblin_pebble_rain":
            this.spawnGoblinPebbleRain();
            break;

        case "goblin_dart_fan":
            this.spawnGoblinDartFan();
            break;

        case "goblin_stomp_wave":
            this.spawnGoblinStompWave();
            break;
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

GraveFallGame.scene.Game.prototype.removeProjectileAt = function (index) {
    var projectile = this.projectiles[index];

    if (!projectile) {
        return;
    }

    if (projectile.parent) {
        projectile.parent.removeChild(projectile, true);
    }

    this.projectiles.splice(index, 1);
};

GraveFallGame.scene.Game.prototype.rectsOverlap = function (a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
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

        if (otherMenu === playerMenu || otherMenu.healthCurrent <= 0) {
            continue;
        }

        if (this.rectsOverlap(testAvatar, otherMenu.battleAvatar)) {
            return true;
        }
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
    // Placeholder hook.
    // Add a sound resource named Projectile_Hit_SFX in Requests.js and the
    // call below will start working immediately.
    try {
        var hitSound = this.application.sounds.sound.get("Projectile_Hit_SFX");

        if (hitSound) {
            hitSound.play(true);
        }
    } catch (e) {
        // No placeholder sound resource added yet.
    }
};

GraveFallGame.scene.Game.prototype.applyDamageToPlayer = function (playerMenu, amount) {
    playerMenu.healthCurrent = Math.max(0, playerMenu.healthCurrent - amount);
    playerMenu.healthBarFill.scaleX = Math.max(0, Math.min(1, playerMenu.healthCurrent / playerMenu.healthMax));
    playerMenu.healthCurrentText.text = String(playerMenu.healthCurrent);
    playerMenu.hitCooldown = 12;

    if (this.phase !== GraveFallGame.scene.Game.PHASE_ACTION) {
        this.updateAllPlayerDamageStates();
    }

    if (playerMenu.healthCurrent <= 0) {
        playerMenu.battleAvatar.visible = false;
        playerMenu.battleAvatar.alpha = 1;
        playerMenu.confirmed = true;
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
                this.playPlaceholderHitSound();
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
};

GraveFallGame.scene.Game.prototype.updateArenaItem = function () {
    if (this.arenaItem) {
        return;
    }

    if (this.itemSpawnTimer > 0) {
        this.itemSpawnTimer--;
        return;
    }

    this.spawnArenaItem();
};

GraveFallGame.scene.Game.prototype.checkItemCollisions = function () {
    var i;
    var playerMenu;

    if (!this.arenaItem) {
        return;
    }

    for (i = 0; i < this.playerMenus.length; i++) {
        playerMenu = this.playerMenus[i];

        if (playerMenu.healthCurrent <= 0) {
            continue;
        }

        if (this.rectsOverlap(playerMenu.battleAvatar, this.arenaItem)) {
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
// Override public prototype methods (ENGINE)
//------------------------------------------------------------------------------

GraveFallGame.scene.Game.prototype.init = function () {
    rune.scene.Scene.prototype.init.call(this);

    this.phase = GraveFallGame.scene.Game.PHASE_COMMAND;
    this.currentEnemyType = "boss";
    this.actionPhaseTimer = 0;
    this.nextPatternIn = 0;
    this.projectiles = [];
    this.playerMenus = [];

    this.arenaItem = null;
    this.itemSpawnTimer = 0;
    this.gameOverText = null;
    this.gameOverTimer = 0;

    // NEW: turn timer (10 seconds ≈ 600 frames)
    this.turnTimer = 600;

    this.turnTimerMs = 10000;

    this.turnTimerText = new rune.text.BitmapField("10");
    this.turnTimerText.scaleX = 2;
    this.turnTimerText.scaleY = 2;
    this.turnTimerText.x = this.application.screen.width - 28;
    this.turnTimerText.y = 8;


    this.backgroundBackdrop = new rune.display.Sprite(0, 0, this.application.screen.width, this.application.screen.height, "Background_Test");
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

//------------------------------------------------------------------------------
// Menu creation / command phase
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
        healthCurrent: options.hpCurrent,
        healthMax: options.hpMax,
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
        hitCooldown: 0
    };

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
    this.enemyHealthCurrent = Math.max(0, this.enemyHealthCurrent - amount);
    this.updateEnemyDamageState();
};

GraveFallGame.scene.Game.prototype.resolveCommandPhaseActions = function () {
    var i;
    var playerMenu;

    if (this.enemyHealthCurrent <= 0) {
        return;
    }

    for (i = 0; i < this.playerMenus.length; i++) {
        playerMenu = this.playerMenus[i];

        if (playerMenu.healthCurrent <= 0) {
            continue;
        }

        // Action index 0 is the fight action. This gives the enemy real HP and
        // immediately lets its five visual damage states react to player attacks.
        if (playerMenu.selectedAction === 0) {
            this.applyDamageToEnemy(playerMenu.attackDamage || 20);
        }
    }
};

GraveFallGame.scene.Game.prototype.updateCharacterMenuVisuals = function (playerMenu) {
    var i;

    playerMenu.selectionBar.x = playerMenu.actionPositions[playerMenu.selectedIndex];
    playerMenu.selectionBar.visible = playerMenu.healthCurrent > 0;

    //keep same for now, maybe useful later
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
    }

    if (this.keyboard.justPressed(playerMenu.controls.right)) {
        playerMenu.selectedIndex++;

        if (playerMenu.selectedIndex >= playerMenu.actions.length) {
            playerMenu.selectedIndex = 0;
        }
    }

    if (this.keyboard.justPressed(playerMenu.controls.confirm)) {
        playerMenu.selectedAction = playerMenu.selectedIndex;
        playerMenu.confirmed = true;
        playerMenu.container.y = playerMenu.confirmedY;
    }

    this.updateCharacterMenuVisuals(playerMenu);
};

//------------------------------------------------------------------------------
// Update / dispose
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// update
//------------------------------------------------------------------------------

GraveFallGame.scene.Game.prototype.update = function (step) {
    var i;
    var secondsLeft;

    rune.scene.Scene.prototype.update.call(this, step);

    if (this.phase === GraveFallGame.scene.Game.PHASE_GAME_OVER) {
        this.updateGameOver();
        return;
    }

    if (this.phase === GraveFallGame.scene.Game.PHASE_COMMAND) {
        this.turnTimerMs -= step;

        if (this.turnTimerMs < 0) {
            this.turnTimerMs = 0;
        }

        secondsLeft = Math.ceil(this.turnTimerMs / 1000);
        this.turnTimerText.text = String(secondsLeft);

        for (i = 0; i < this.playerMenus.length; i++) {
            this.updateCharacterMenuInput(this.playerMenus[i]);
        }

        if (this.turnTimerMs <= 0) {
            for (i = 0; i < this.playerMenus.length; i++) {
                if (!this.playerMenus[i].confirmed && this.playerMenus[i].healthCurrent > 0) {
                    this.playerMenus[i].selectedIndex = 0;
                    this.playerMenus[i].selectedAction = 0;
                    this.playerMenus[i].confirmed = true;
                    this.playerMenus[i].container.y = this.playerMenus[i].confirmedY;
                }
            }

            this.startActionPhase();
            return;
        }

        if (this.areAllPlayersConfirmed()) {
            this.startActionPhase();
        }
    } else if (this.phase === GraveFallGame.scene.Game.PHASE_ACTION) {
        this.updateActionPhase();
    }

    if (this.keyboard.justPressed("escape")) {
        this.application.scenes.load([
            new GraveFallGame.scene.Menu()
        ]);
    }
};

GraveFallGame.scene.Game.prototype.dispose = function () {
    this.clearProjectiles();
    this.clearArenaItem();
    this.projectiles = null;
    this.playerMenus = null;
    this.backgroundBackdrop = null;
    this.bossPlaceholder = null;
    this.enemySprite = null;
    this.enemyHealthCurrent = null;
    this.enemyHealthMax = null;
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
    rune.scene.Scene.prototype.dispose.call(this);
};
