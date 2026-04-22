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
// Static palette data
//------------------------------------------------------------------------------

/**
 * Player accent colors used by the current proof-of-concept UI.
 *
 * The monochrome icons in the project are authored with the color C4C4C3, so
 * they can be recolored safely per player already. Character portraits / stand
 * sprites are not yet authored with a neutral palette, so dedicated palette
 * swap arrays can be supplied later via options.standPaletteSwaps and
 * options.portraitPaletteSwaps.
 *
 * @type {Array<Object>}
 */
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

/**
 * Shared source color used by the monochrome transparent icon set.
 *
 * @type {string}
 */
GraveFallGame.scene.Game.MONO_ICON_SOURCE = "#C4C4C3";

GraveFallGame.scene.Game.CLOTHING_SOURCE = {
    mid: "#b654b7",
    dark: "#942f97",
    light: "#ca75ca"
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

//------------------------------------------------------------------------------
// Helper
//------------------------------------------------------------------------------

/**
 * Returns the theme for a specific player slot.
 *
 * @param {number} index
 * @returns {Object}
 */
GraveFallGame.scene.Game.prototype.getPlayerTheme = function (index) {
    return GraveFallGame.scene.Game.PLAYER_THEMES[index % GraveFallGame.scene.Game.PLAYER_THEMES.length];
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

GraveFallGame.scene.Game.prototype.createFramePiece = function (x, y, resource, paletteSwaps) {
    var piece = new rune.display.Sprite(x, y, 16, 16, resource);
    this.applyPaletteSwaps(piece, paletteSwaps);
    return piece;
};

/**
 * Applies a list of exact palette swaps to a sprite / graphic texture.
 *
 * @param {?rune.display.Graphic} graphic
 * @param {?Array<Object>} paletteSwaps
 * @returns {undefined}
 */
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

/**
 * Recolors one of the monochrome transparent icons to the provided accent.
 *
 * @param {?rune.display.Graphic} graphic
 * @param {string} targetColor
 * @returns {undefined}
 */
GraveFallGame.scene.Game.prototype.applyMonochromeIconColor = function (graphic, targetColor) {
    this.applyPaletteSwaps(graphic, [
        {
            from: GraveFallGame.scene.Game.MONO_ICON_SOURCE,
            to: targetColor
        }
    ]);
};

/**
 * Applies the player color theme to the menu art that can already be recolored
 * safely in the current asset set.
 *
 * @param {Object} theme
 * @param {Object} parts
 * @param {Object} options
 * @returns {undefined}
 */
GraveFallGame.scene.Game.prototype.applyPlayerTheme = function (theme, parts, options) {
    var i;

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

    for (i = 0; i < parts.actions.length; i++) {
        this.applyMonochromeIconColor(parts.actions[i], theme.accentLight);
    }

    var defaultClothingPalette = this.getClothingPaletteSwaps(theme);

    this.applyPaletteSwaps(
        parts.stand,
        options.standPaletteSwaps || defaultClothingPalette
    );

    this.applyPaletteSwaps(
        parts.portrait,
        options.portraitPaletteSwaps || defaultClothingPalette
    );
};

GraveFallGame.scene.Game.prototype.areAllPlayersConfirmed = function () {
    var i;

    if (!this.playerMenus || this.playerMenus.length === 0) {
        return false;
    }

    for (i = 0; i < this.playerMenus.length; i++) {
        if (this.playerMenus[i].confirmed !== true) {
            return false;
        }
    }

    return true;
};

GraveFallGame.scene.Game.prototype.updateBattleAvatarMovement = function (playerMenu) {
    var speed = playerMenu.moveSpeed || 3;
    var avatar = playerMenu.battleAvatar;
    var screenWidth = this.application.screen.width;
    var screenHeight = this.application.screen.height;
    var maxX = screenWidth - avatar.width;
    var maxY = screenHeight - avatar.height;

    if (this.keyboard.pressed(playerMenu.moveControls.left)) {
        avatar.x -= speed;
    }

    if (this.keyboard.pressed(playerMenu.moveControls.right)) {
        avatar.x += speed;
    }

    if (this.keyboard.pressed(playerMenu.moveControls.up)) {
        avatar.y -= speed;
    }

    if (this.keyboard.pressed(playerMenu.moveControls.down)) {
        avatar.y += speed;
    }

    if (avatar.x < 0) {
        avatar.x = 0;
    }

    if (avatar.y < 0) {
        avatar.y = 0;
    }

    if (avatar.x > maxX) {
        avatar.x = maxX;
    }

    if (avatar.y > maxY) {
        avatar.y = maxY;
    }
};

/**
 * Shows the larger class icon used after a player confirms their action.
 *
 * @param {Object} playerMenu
 * @returns {undefined}
 */
GraveFallGame.scene.Game.prototype.activateBattleAvatar = function (playerMenu) {
    playerMenu.stand.alpha = 0;
    playerMenu.battleAvatar.alpha = 1;
    playerMenu.battleAvatar.x = playerMenu.stand.x + 100;
    playerMenu.battleAvatar.y = playerMenu.stand.y + 100;
};

//------------------------------------------------------------------------------
// Override public prototype methods (ENGINE)
//------------------------------------------------------------------------------

/**
 * This method is automatically executed once after the scene is instantiated. 
 * The method is used to create objects to be used within the scene.
 *
 * @returns {undefined}
 */
GraveFallGame.scene.Game.prototype.init = function () {
    rune.scene.Scene.prototype.init.call(this);

    this.playerMenus = [];

    this.bossPlaceholder = new rune.display.Graphic(0, 0, 260, 260, "Nikita_Boss");
    this.bossPlaceholder.x = (this.application.screen.width / 2) - 130;
    this.bossPlaceholder.y = 140;
    this.stage.addChild(this.bossPlaceholder);

    // Player 1
    this.playerMenus.push(this.createCharacterMenu({
        x: 0,
        y: 592,
        portrait: "Fighter_Portrait",
        classIcon: "Fighter_Icon_T",
        stand: "Fighter_Idle_Stance",
        hpCurrent: 75,
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

    // Player 2
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

    // Player 3
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

    // Player 4
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
};

//------------------------------------------------------------------------------
// Helper
//------------------------------------------------------------------------------

/**
 * Creates one character menu panel.
 *
 * @param {Object} options
 * @returns {Object}
 */
GraveFallGame.scene.Game.prototype.createCharacterMenu = function (options) {
    var menuWidth = 320;
    var menuHeight = 128;
    var topPanelHeight = 64;
    var bottomPanelHeight = 64;
    var actionPositions = [10, 95, 180, 255];
    var standScale = 2.3;
    var standWidth = 100 * standScale;
    var battleAvatarScale = 0.7;
    var battleAvatarWidth = 100 * battleAvatarScale;
    var standX = options.x + (menuWidth / 2) - (standWidth / 2);
    var battleAvatarX = standX;
    var battleAvatarY = 400;

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
    characterMenuCharacter.backgroundColor = uiSkin.panelTop;
    characterMenuActions.backgroundColor = uiSkin.panelBottom;

    var outerFrame = this.createBoxFrame(0, 0, menuWidth, menuHeight, framePaletteSwaps);
    var separator = this.createSeparator(0, topPanelHeight - 4, menuWidth, framePaletteSwaps);

    var menuAccent = new rune.display.Graphic(0, 0, menuWidth, 4);
    var actionAccent = new rune.display.Graphic(0, 0, menuWidth, 2);
    var actionSelectionBar = new rune.display.Graphic(actionPositions[0], 56, 60, 4);

    var characterStand = new rune.display.Sprite(standX, 400, 100, 100, options.stand);
    var battleAvatar = new rune.display.Sprite(battleAvatarX, battleAvatarY, 100, 100, options.classIcon);

    var characterIcon = new rune.display.Sprite(10, 5, 50, 50, options.portrait);
    var characterClassIcon = new rune.display.Sprite(55, 30, 100, 100, options.classIcon);

    var fightIcon = new rune.display.Sprite(15, 10, 100, 100, "Fight_Icon_T");
    var defendIcon = new rune.display.Sprite(100, 10, 100, 100, "Defend_Icon_T");
    var buffIcon = new rune.display.Sprite(185, 10, 100, 100, "Buff_Icon_T");
    var itemIcon = new rune.display.Sprite(260, 10, 100, 100, "Item_Icon_T");

    var characterHealthBarBackground = new rune.display.Graphic(100, 38, 200, 17);
    var characterHealthBar = new rune.display.Graphic(100, 38, 200, 17);
    var characterHealthMax = new rune.text.BitmapField("/" + options.hpMax);
    var characterHealthCurrent = new rune.text.BitmapField(String(options.hpCurrent));
    var HpText = new rune.text.BitmapField("HP");

    // HP bar sizing
    characterHealthBar.scaleX = Math.max(0, Math.min(1, options.hpCurrent / options.hpMax));

    // HP text styling
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

    // Icon scaling
    fightIcon.scaleX = 0.2;
    fightIcon.scaleY = 0.2;

    defendIcon.scaleX = 0.4;
    defendIcon.scaleY = 0.4;

    buffIcon.scaleX = 0.4;
    buffIcon.scaleY = 0.4;

    itemIcon.scaleX = 0.4;
    itemIcon.scaleY = 0.4;

    characterClassIcon.scaleX = 0.35;
    characterClassIcon.scaleY = 0.35;

    battleAvatar.scaleX = battleAvatarScale;
    battleAvatar.scaleY = battleAvatarScale;

    characterStand.scaleX = standScale;
    characterStand.scaleY = standScale;

    if (options.flipStandX === true) {
        characterStand.flippedX = true;
        battleAvatar.flippedX = true;
    }

    characterStand.alpha = 1;
    battleAvatar.alpha = 0;

    // Build hierarchy
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
    this.stage.addChild(battleAvatar);
    this.stage.addChild(characterMenu);

    return {
        container: characterMenu,
        stand: characterStand,
        battleAvatar: battleAvatar,
        actions: [fightIcon, defendIcon, buffIcon, itemIcon],
        actionPositions: actionPositions,
        selectionBar: actionSelectionBar,
        healthBarBackground: characterHealthBarBackground,
        healthBarFill: characterHealthBar,
        healthCurrent: options.hpCurrent,
        healthMax: options.hpMax,
        selectedIndex: 0,
        selectedAction: null,
        confirmed: false,
        baseY: options.y,
        confirmedY: options.y + 58,
        controls: options.controls,
        moveControls: options.moveControls,
        moveSpeed: 3
    };
};

/**
 * Updates the scaling of the action icons for one player.
 *
 * @param {Object} playerMenu
 * @returns {undefined}
 */
GraveFallGame.scene.Game.prototype.updateCharacterMenuVisuals = function (playerMenu) {
    var i;

    playerMenu.selectionBar.x = playerMenu.actionPositions[playerMenu.selectedIndex];

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

/**
 * Handles input for one player menu.
 *
 * @param {Object} playerMenu
 * @returns {undefined}
 */
GraveFallGame.scene.Game.prototype.updateCharacterMenuInput = function (playerMenu) {
    if (playerMenu.confirmed) {
        playerMenu.container.y = playerMenu.confirmedY;
        this.activateBattleAvatar(playerMenu);
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
        this.activateBattleAvatar(playerMenu);
    }

    this.updateCharacterMenuVisuals(playerMenu);
};

/**
 * This method is automatically executed once per "tick". The method is used for 
 * calculations such as application logic.
 *
 * @param {number} step Fixed time step.
 *
 * @returns {undefined}
 */
GraveFallGame.scene.Game.prototype.update = function (step) {
    rune.scene.Scene.prototype.update.call(this, step);

    if (this.areAllPlayersConfirmed()) {
        for (var i = 0; i < this.playerMenus.length; i++) {
            this.updateBattleAvatarMovement(this.playerMenus[i]);
        }
    } else {
        for (var j = 0; j < this.playerMenus.length; j++) {
            this.updateCharacterMenuInput(this.playerMenus[j]);
        }
    }

    if (this.keyboard.justPressed("escape")) {
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
GraveFallGame.scene.Game.prototype.dispose = function () {
    this.playerMenus = null;
    this.bossPlaceholder = null;
    rune.scene.Scene.prototype.dispose.call(this);
};