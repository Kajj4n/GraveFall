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
 * Main menu scene.
 */
GraveFallGame.scene.Menu = function () {
    this.index = 0;
    this.optionCards = null;
    this.pointer = null;
    this.animTime = 0;
    this.backgroundSkin = null;
    this.menuSkin = null;

    rune.scene.Scene.call(this);
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

GraveFallGame.scene.Menu.prototype = Object.create(rune.scene.Scene.prototype);
GraveFallGame.scene.Menu.prototype.constructor = GraveFallGame.scene.Menu;

//------------------------------------------------------------------------------
// Shared helpers from the game scene
//------------------------------------------------------------------------------

GraveFallGame.scene.Menu.prototype.applyPaletteSwaps = GraveFallGame.scene.Game.prototype.applyPaletteSwaps;
GraveFallGame.scene.Menu.prototype.getFramePaletteSwaps = GraveFallGame.scene.Game.prototype.getFramePaletteSwaps;
GraveFallGame.scene.Menu.prototype.getBackgroundPaletteSwaps = GraveFallGame.scene.Game.prototype.getBackgroundPaletteSwaps;
GraveFallGame.scene.Menu.prototype.applyMonochromeIconColor = GraveFallGame.scene.Game.prototype.applyMonochromeIconColor;
GraveFallGame.scene.Menu.prototype.createFramePiece = GraveFallGame.scene.Game.prototype.createFramePiece;
GraveFallGame.scene.Menu.prototype.createBoxFrame = GraveFallGame.scene.Game.prototype.createBoxFrame;
GraveFallGame.scene.Menu.prototype.createSeparator = GraveFallGame.scene.Game.prototype.createSeparator;
GraveFallGame.scene.Menu.prototype.tintBitmapFieldText = GraveFallGame.scene.Game.prototype.tintBitmapFieldText;
GraveFallGame.scene.Menu.prototype.isDevConsoleInputActive = GraveFallGame.scene.Game.prototype.isDevConsoleInputActive;

//------------------------------------------------------------------------------
// Override public prototype methods (ENGINE)
//------------------------------------------------------------------------------

/**
 * Initializes the scene and creates its display objects.
 *
 * @return {undefined}
 */
GraveFallGame.scene.Menu.prototype.init = function () {
    GraveFallGame.useBitmapFont();

    var screen;
    var paletteKey;
    var palette;
    var framePaletteSwaps;
    var background;
    var panel;
    var title;
    var titleAccent;

    rune.scene.Scene.prototype.init.call(this);
    GraveFallGame.startMenuMusic(this.application, GraveFallGame.menuMusicFadeInMs || 2200);

    screen = this.application.screen;
    paletteKey = GraveFallGame.scene.Game.resolveRunPaletteKey(GraveFallGame.scene.Game.ACTIVE_RUN_PALETTE_KEY);
    palette = GraveFallGame.scene.Game.getRunPalette(paletteKey);

    this.backgroundSkin = palette.outside;
    this.menuSkin = palette.inside;
    framePaletteSwaps = this.getFramePaletteSwaps(this.menuSkin);

    background = new rune.display.Sprite(0, 0, screen.width, screen.height, "MainMenu_Background");
    this.applyPaletteSwaps(background, this.getBackgroundPaletteSwaps(this.backgroundSkin));
    this.stage.addChild(background);
    this.background = background;

    panel = this.createMenuPanel(264, 24, 752, 628, this.menuSkin, framePaletteSwaps);
    this.stage.addChild(panel);
    this.panel = panel;

    title = this.createText("GRAVEFALL", 0, 66, 3.65, 540);
    this.centerText(title, screen.centerX, 3.65);
    this.stage.addChild(title);
    this.title = title;

    titleAccent = new rune.display.Graphic(448, 118, 384, 4);
    titleAccent.backgroundColor = this.menuSkin.frame.mid;
    this.stage.addChild(titleAccent);

    this.optionCards = [];
    this.optionCards.push(this.createOptionCard({
        x: 378,
        y: 148,
        width: 524,
        height: 84,
        title: "START GAME",
        description: "BUILD A LOCAL 1-4 PLAYER PARTY",
        icon: "Start_Menu_Button_T",
        iconScale: 0.72,
        iconInactiveScale: 0.66,
        iconX: 20,
        iconY: 15,
        accent: GraveFallGame.scene.Game.PLAYER_THEMES[0].accent,
        accentLight: GraveFallGame.scene.Game.PLAYER_THEMES[0].accentLight
    }));
    this.optionCards.push(this.createOptionCard({
        x: 378,
        y: 246,
        width: 524,
        height: 84,
        title: "HOW TO PLAY",
        description: "CONTROLS, RULES, MINIGAMES",
        icon: "Help_Menu_Button_T",
        iconScale: 0.72,
        iconInactiveScale: 0.66,
        iconX: 20,
        iconY: 15,
        accent: GraveFallGame.scene.Game.PLAYER_THEMES[1].accent,
        accentLight: GraveFallGame.scene.Game.PLAYER_THEMES[1].accentLight
    }));
    this.optionCards.push(this.createOptionCard({
        x: 378,
        y: 344,
        width: 524,
        height: 84,
        title: "LEADERBOARDS",
        description: "VIEW TOP 10 PARTIES",
        icon: "Score_Menu_Button_T",
        iconScale: 0.72,
        iconInactiveScale: 0.66,
        iconX: 20,
        iconY: 15,
        accent: GraveFallGame.scene.Game.PLAYER_THEMES[2].accent,
        accentLight: GraveFallGame.scene.Game.PLAYER_THEMES[2].accentLight
    }));
    this.optionCards.push(this.createOptionCard({
        x: 378,
        y: 450,
        width: 250,
        height: 62,
        title: "CREDITS",
        description: "MEET THE DEVS",
        icon: "Help_Menu_Button_T",
        iconScale: 0.43,
        iconInactiveScale: 0.39,
        iconX: 18,
        iconY: 12,
        titleX: 76,
        titleY: 12,
        titleScale: 1.62,
        descriptionX: 78,
        descriptionY: 38,
        descriptionScale: 1.0,
        accent: "#2ECC71",
        accentLight: "#A7F3C1"
    }));
    this.optionCards.push(this.createOptionCard({
        x: 652,
        y: 450,
        width: 250,
        height: 62,
        title: "QUIT",
        description: "EXIT GAME",
        icon: "Start_Menu_Button_T",
        iconScale: 0.43,
        iconInactiveScale: 0.39,
        iconX: 18,
        iconY: 12,
        titleX: 76,
        titleY: 12,
        titleScale: 1.62,
        descriptionX: 78,
        descriptionY: 38,
        descriptionScale: 1.0,
        accent: this.menuSkin.frame.mid,
        accentLight: this.menuSkin.frame.light
    }));

    this.createQuickControls();

    this.createScreenFooter("CONTROLLER PREFERRED GAME METHOD    VERSION 1.0", framePaletteSwaps);

    this.updateVisuals();
};

/**
 * Updates the scene once per engine tick.
 *
 * @param {number} step Fixed time step supplied by the Rune engine.
 *
 * @return {undefined}
 */
GraveFallGame.scene.Menu.prototype.update = function (step) {
    var pressDown;
    var pressUp;
    var pressLeft;
    var pressRight;
    var pressBack;
    var pressConfirm;
    var pressRules;
    var i;
    var gp;

    rune.scene.Scene.prototype.update.call(this, step);
    GraveFallGame.updateMenuMusicFades(step);

    if (this.isDevConsoleInputActive && this.isDevConsoleInputActive()) {
        return;
    }

    this.animTime += step;
    this.updateAnimatedVisuals();

    pressDown = this.keyboard.justPressed("down") || this.keyboard.justPressed("s");
    pressUp = this.keyboard.justPressed("up") || this.keyboard.justPressed("w");
    pressLeft = this.keyboard.justPressed("left") || this.keyboard.justPressed("a");
    pressRight = this.keyboard.justPressed("right") || this.keyboard.justPressed("d");
    pressBack = this.keyboard.justPressed("escape") || this.keyboard.justPressed("backspace");
    pressConfirm = this.keyboard.justPressed("space") || this.keyboard.justPressed("enter");
    pressRules = this.keyboard.justPressed("h") || this.keyboard.justPressed("r");

    for (i = 0; i < 4; i++) {
        gp = this.gamepads.get(i);
        if (gp) {
            if (gp.justPressed(13) || gp.stickLeftJustDown) pressDown = true;
            if (gp.justPressed(12) || gp.stickLeftJustUp) pressUp = true;
            if (gp.justPressed(14) || gp.stickLeftJustLeft) pressLeft = true;
            if (gp.justPressed(15) || gp.stickLeftJustRight) pressRight = true;
            if (gp.justPressed(1) || gp.justPressed(2)) pressBack = true;
            if (gp.justPressed(0)) pressConfirm = true;
            if (gp.justPressed(3)) pressRules = true;
        }
    }

    if (pressRules) {
        this.index = 1;
        this.updateVisuals();
        pressConfirm = true;
    }

    if (pressBack) {
        this.index = 4;
        GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_MOVE, 0.45);
        this.updateVisuals();
    }

    if (pressRight && this.index === 3) {
        this.index = 4;
        GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_MOVE, 0.45);
        this.updateVisuals();
    }

    if (pressLeft && this.index === 4) {
        this.index = 3;
        GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_MOVE, 0.45);
        this.updateVisuals();
    }

    if (pressDown) {
        i = this.index;

        if (this.index === 0) {
            this.index = 1;
        } else if (this.index === 1) {
            this.index = 2;
        } else if (this.index === 2) {
            this.index = 3;
        } else if (this.index === 3) {
            this.index = 4;
        }

        if (this.index !== i) {
            GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_MOVE, 0.45);
            this.updateVisuals();
        }
    }

    if (pressUp) {
        i = this.index;

        if (this.index === 4) {
            this.index = 2;
        } else if (this.index === 3) {
            this.index = 2;
        } else if (this.index === 2) {
            this.index = 1;
        } else if (this.index === 1) {
            this.index = 0;
        }

        if (this.index !== i) {
            GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_MOVE, 0.45);
            this.updateVisuals();
        }
    }

    if (pressConfirm) {
        GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_CONFIRM, 0.6);

        if (this.index === 0) {
            this.application.scenes.load([
                new GraveFallGame.scene.CharacterSelect()
            ]);
        } else if (this.index === 1) {
            this.application.scenes.load([
                new GraveFallGame.scene.Rule()
            ]);
        } else if (this.index === 2) {
            this.application.scenes.load([
                new GraveFallGame.scene.Leaderboard(1)
            ]);
        } else if (this.index === 3) {
            this.application.scenes.load([
                new GraveFallGame.scene.Credits()
            ]);
        } else if (this.index === 4) {
            GraveFallGame.quitGame(this.application);
        }
    }
};

//------------------------------------------------------------------------------
// Private visual helpers
//------------------------------------------------------------------------------

/**
 * Creates a bitmap text field using the GraveFall font rules.
 *
 * @param {string} text Text to render or sanitize.
 * @param {number} x Horizontal position.
 * @param {number} y Vertical position.
 * @param {number} scale Display scale.
 * @param {number} width Width in pixels.
 *
 * @return {string} Resolved string value.
 */
GraveFallGame.scene.Menu.prototype.createText = function (text, x, y, scale, width) {
    var field = new rune.text.BitmapField(text);

    scale = scale || 1;

    if (scale < 1.05) {
        scale = 1.05;
    }

    field.width = width || 1000;
    field.height = 32;
    field.scaleX = scale;
    field.scaleY = scale;
    field.x = x || 0;
    field.y = y || 0;

    return field;
};

/**
 * Centers a bitmap text field around an x coordinate.
 *
 * @param {Object} field Bitmap field to update.
 * @param {number} centerX Horizontal center position.
 * @param {number} scale Display scale.
 *
 * @return {undefined}
 */
GraveFallGame.scene.Menu.prototype.centerText = function (field, centerX, scale) {
    if (!field) {
        return;
    }

    scale = scale || field.scaleX || 1;
    field.x = Math.round(centerX - ((String(field.text).length * 6 * scale) / 2));
};

/**
 * Creates a framed menu panel.
 *
 * @param {number} x Horizontal position.
 * @param {number} y Vertical position.
 * @param {number} width Width in pixels.
 * @param {number} height Height in pixels.
 * @param {Object} skin Skin.
 * @param {Array} framePaletteSwaps Frame palette swap list.
 *
 * @return {Object} Created display object or data object.
 */
GraveFallGame.scene.Menu.prototype.createMenuPanel = function (x, y, width, height, skin, framePaletteSwaps) {
    var panel = new rune.display.DisplayObjectContainer(x, y, width, height);
    var top = new rune.display.Graphic(0, 0, width, Math.round(height * 0.44));
    var bottom = new rune.display.Graphic(0, Math.round(height * 0.44), width, height - Math.round(height * 0.44));
    var accent = new rune.display.Graphic(16, 16, width - 32, 4);

    top.backgroundColor = skin.panelTop;
    bottom.backgroundColor = skin.panelBottom;
    accent.backgroundColor = skin.frame.mid;

    panel.addChild(top);
    panel.addChild(bottom);
    panel.addChild(accent);
    panel.addChild(this.createBoxFrame(0, 0, width, height, framePaletteSwaps));

    return panel;
};

/**
 * Creates the shared screen footer.
 *
 * @param {string} text Text to render or sanitize.
 * @param {Array} framePaletteSwaps Frame palette swap list.
 *
 * @return {Object} Created display object or data object.
 */
GraveFallGame.scene.Menu.prototype.createScreenFooter = function (text, framePaletteSwaps) {
    var screen = this.application.screen;
    var footerHeight = 62;
    var separatorWidth = 708;
    var footer = new rune.display.DisplayObjectContainer(0, screen.height - footerHeight, screen.width, footerHeight);
    var footerText;

    footer.backgroundColor = this.menuSkin.panelBottom;
    footer.addChild(this.createSeparator(Math.round(screen.centerX - (separatorWidth / 2)), 0, separatorWidth, framePaletteSwaps));
    this.stage.addChild(footer);

    footerText = this.createText(text, 0, 24, 1.2, 1200);
    this.centerText(footerText, screen.centerX, 1.2);
    footer.addChild(footerText);
    this.tintBitmapFieldText(footerText, this.menuSkin.frame.light, true);

    return footer;
};

/**
 * Creates a main menu option card.
 *
 * @param {Object} options Options object.
 *
 * @return {Object} Created display object or data object.
 */
GraveFallGame.scene.Menu.prototype.createOptionCard = function (options) {
    var framePaletteSwaps = this.getFramePaletteSwaps(this.menuSkin);
    var card = new rune.display.DisplayObjectContainer(options.x, options.y, options.width, options.height);
    var backgroundTop = new rune.display.Graphic(0, 0, options.width, Math.round(options.height / 2));
    var backgroundBottom = new rune.display.Graphic(0, Math.round(options.height / 2), options.width, Math.round(options.height / 2));
    var accent = new rune.display.Graphic(0, 0, 6, options.height);
    var selectGlow = new rune.display.Graphic(12, options.height - 9, options.width - 24, 4);
    var icon = new rune.display.Sprite(options.iconX || 20, options.iconY || 14, options.iconSize || 80, options.iconSize || 80, options.icon);
    var title = this.createText(options.title, options.titleX || 104, options.titleY || 20, options.titleScale || 2.35, options.titleWidth || 360);
    var description = this.createText(options.description, options.descriptionX || 106, options.descriptionY || 56, options.descriptionScale || 1.15, options.descriptionWidth || 380);
    var iconScale = options.iconScale || 0.54;
    var iconInactiveScale = options.iconInactiveScale || Math.max(0.1, iconScale - 0.04);

    backgroundTop.backgroundColor = this.menuSkin.panelTop;
    backgroundBottom.backgroundColor = this.menuSkin.panelBottom;
    accent.backgroundColor = options.accent;
    selectGlow.backgroundColor = options.accent;
    selectGlow.alpha = 0.32;

    icon.scaleX = iconScale;
    icon.scaleY = iconScale;
    icon.baseScale = iconScale;
    icon.inactiveScale = iconInactiveScale;
    this.applyMonochromeIconColor(icon, options.accentLight || options.accent);

    card.addChild(backgroundTop);
    card.addChild(backgroundBottom);
    card.addChild(accent);
    card.addChild(selectGlow);
    card.addChild(icon);
    card.addChild(title);
    card.addChild(description);
    card.addChild(this.createBoxFrame(0, 0, options.width, options.height, framePaletteSwaps));

    this.stage.addChild(card);
    this.tintBitmapFieldText(description, this.menuSkin.frame.light, true);

    return {
        container: card,
        accent: accent,
        glow: selectGlow,
        icon: icon,
        title: title,
        description: description,
        x: options.x,
        y: options.y,
        width: options.width,
        height: options.height,
        color: options.accent
    };
};

/**
 * Creates one control hint block.
 *
 * @param {Object} parent Display container that receives the created objects.
 * @param {number} x Horizontal position.
 * @param {number} y Vertical position.
 * @param {string} iconResource Icon resource name to render.
 * @param {string} title Title text to render.
 * @param {string} detail Detail text to render.
 * @param {string} color Color to apply.
 *
 * @return {Object} Created display object or data object.
 */
GraveFallGame.scene.Menu.prototype.createControlHint = function (parent, x, y, iconResource, title, detail, color) {
    var group = new rune.display.DisplayObjectContainer(x, y, 210, 54);
    var icons = iconResource instanceof Array ? iconResource : [iconResource];
    var icon;
    var iconScale;
    var iconYOffset;
    var i;
    var textOffsetX = iconResource instanceof Array ? 54 : 44;
    var titleText = this.createText(title, textOffsetX, 5, 1.15, 158);
    var detailText = this.createText(detail, textOffsetX, 27, 1.05, 164);

    for (i = 0; i < icons.length; i++) {
        iconScale = icons.length > 1 ? 0.27 : 0.32;
        iconYOffset = icons.length > 1 ? (0 + (i * 25)) : 6;
        icon = new rune.display.Sprite(icons.length > 1 ? 7 : 5, iconYOffset, 100, 100, icons[i]);
        icon.scaleX = iconScale;
        icon.scaleY = iconScale;
        this.applyMonochromeIconColor(icon, color || this.menuSkin.frame.light);
        group.addChild(icon);
    }

    group.addChild(titleText);
    group.addChild(detailText);
    this.tintBitmapFieldText(titleText, color || this.menuSkin.frame.light, true);
    this.tintBitmapFieldText(detailText, this.menuSkin.frame.light, true);
    parent.addChild(group);

    return group;
};

/**
 * Creates the quick controls section of the main menu.
 *
 * @return {undefined}
 */
GraveFallGame.scene.Menu.prototype.createQuickControls = function () {
    var panel;
    var heading;
    var keyboardText;
    var framePaletteSwaps = this.getFramePaletteSwaps(this.menuSkin);
    var x = 306;
    var y = 538;
    var width = 668;
    var height = 96;

    panel = new rune.display.DisplayObjectContainer(x, y, width, height);
    panel.backgroundColor = this.menuSkin.panelBottom;
    panel.addChild(this.createBoxFrame(0, 0, width, height, framePaletteSwaps));
    this.stage.addChild(panel);

    heading = this.createText("QUICK CONTROLS", 20, 10, 1.28, 220);
    panel.addChild(heading);
    this.tintBitmapFieldText(heading, this.menuSkin.frame.light, true);

    this.createControlHint(panel, 20, 36, ["Gamepad_Button_Up_T", "Gamepad_Button_Down_T"], "MOVE", "W/S OR D-PAD", GraveFallGame.scene.Game.PLAYER_THEMES[2].accentLight);
    this.createControlHint(panel, 236, 36, "A_Button_Icon_T", "SELECT", "ENTER/SPACE OR A", GraveFallGame.scene.Game.PLAYER_THEMES[3].accentLight);
    this.createControlHint(panel, 456, 36, "Y_Button_Icon_T", "HELP", "H/R OR Y", GraveFallGame.scene.Game.PLAYER_THEMES[1].accentLight);

 
};

/**
 * Updates main menu selection visuals.
 *
 * @return {undefined}
 */
GraveFallGame.scene.Menu.prototype.updateVisuals = function () {
    var i;
    var card;

    for (i = 0; i < this.optionCards.length; i++) {
        card = this.optionCards[i];
        card.container.alpha = i === this.index ? 1 : 0.78;
        card.glow.visible = i === this.index;
        card.glow.alpha = i === this.index ? 0.42 : 0.18;
        card.accent.width = i === this.index ? 10 : 6;
        card.icon.scaleX = i === this.index ? card.icon.baseScale : card.icon.inactiveScale;
        card.icon.scaleY = i === this.index ? card.icon.baseScale : card.icon.inactiveScale;
    }

    if (this.pointer && this.optionCards[this.index]) {
        card = this.optionCards[this.index];
        this.pointer.x = Math.round(card.x - this.pointer.width - 22);
        this.pointer.y = Math.round(card.y + (card.height / 2) - (this.pointer.height / 2));
    }
};

/**
 * Updates animated main menu visual effects.
 *
 * @return {undefined}
 */
GraveFallGame.scene.Menu.prototype.updateAnimatedVisuals = function () {
    var card;

    if (!this.optionCards || !this.optionCards[this.index]) {
        return;
    }

    pulse = (Math.sin(this.animTime / 180) + 1) / 2;
    card = this.optionCards[this.index];
    card.glow.alpha = 0.28 + (pulse * 0.18);
};

//------------------------------------------------------------------------------
// Credits scene
//------------------------------------------------------------------------------

/**
 * Creates the credits screen.
 *
 * @constructor
 * @extends rune.scene.Scene
 */
GraveFallGame.scene.Credits = function () {
    this.backgroundSkin = null;
    this.menuSkin = null;
    this.animTime = 0;
    this.backButton = null;
    this.developerCards = [];

    rune.scene.Scene.call(this);
};

GraveFallGame.scene.Credits.prototype = Object.create(rune.scene.Scene.prototype);
GraveFallGame.scene.Credits.prototype.constructor = GraveFallGame.scene.Credits;

GraveFallGame.scene.Credits.prototype.applyPaletteSwaps = GraveFallGame.scene.Game.prototype.applyPaletteSwaps;
GraveFallGame.scene.Credits.prototype.getFramePaletteSwaps = GraveFallGame.scene.Game.prototype.getFramePaletteSwaps;
GraveFallGame.scene.Credits.prototype.getBackgroundPaletteSwaps = GraveFallGame.scene.Game.prototype.getBackgroundPaletteSwaps;
GraveFallGame.scene.Credits.prototype.applyMonochromeIconColor = GraveFallGame.scene.Game.prototype.applyMonochromeIconColor;
GraveFallGame.scene.Credits.prototype.createFramePiece = GraveFallGame.scene.Game.prototype.createFramePiece;
GraveFallGame.scene.Credits.prototype.createBoxFrame = GraveFallGame.scene.Game.prototype.createBoxFrame;
GraveFallGame.scene.Credits.prototype.createSeparator = GraveFallGame.scene.Game.prototype.createSeparator;
GraveFallGame.scene.Credits.prototype.tintBitmapFieldText = GraveFallGame.scene.Game.prototype.tintBitmapFieldText;
GraveFallGame.scene.Credits.prototype.isDevConsoleInputActive = GraveFallGame.scene.Game.prototype.isDevConsoleInputActive;
GraveFallGame.scene.Credits.prototype.createText = GraveFallGame.scene.Menu.prototype.createText;
GraveFallGame.scene.Credits.prototype.centerText = GraveFallGame.scene.Menu.prototype.centerText;
GraveFallGame.scene.Credits.prototype.createMenuPanel = GraveFallGame.scene.Menu.prototype.createMenuPanel;
GraveFallGame.scene.Credits.prototype.createScreenFooter = GraveFallGame.scene.Menu.prototype.createScreenFooter;

/**
 * Initializes the credits screen.
 *
 * @return {undefined}
 */
GraveFallGame.scene.Credits.prototype.init = function () {
    GraveFallGame.useBitmapFont();

    var screen;
    var palette;
    var framePaletteSwaps;
    var background;
    var shell;
    var title;
    var subtitle;
    var note;
    var colors;

    rune.scene.Scene.prototype.init.call(this);
    GraveFallGame.startMenuMusic(this.application, GraveFallGame.menuMusicFadeInMs || 2200);

    screen = this.application.screen;
    palette = GraveFallGame.scene.Game.getRunPalette(
        GraveFallGame.scene.Game.resolveRunPaletteKey(GraveFallGame.scene.Game.ACTIVE_RUN_PALETTE_KEY)
    );
    this.backgroundSkin = palette.outside;
    this.menuSkin = palette.inside;
    framePaletteSwaps = this.getFramePaletteSwaps(this.menuSkin);
    colors = GraveFallGame.scene.Game.PLAYER_THEMES;
    this.developerCards = [];

    background = new rune.display.Sprite(0, 0, screen.width, screen.height, "MainMenu_Background");
    this.applyPaletteSwaps(background, this.getBackgroundPaletteSwaps(this.backgroundSkin));
    this.stage.addChild(background);

    shell = this.createMenuPanel(94, 30, screen.width - 188, screen.height - 102, this.menuSkin, framePaletteSwaps);
    this.stage.addChild(shell);

    title = this.createText("CREDITS", 0, 58, 3.45, 520);
    this.centerText(title, screen.centerX, 3.45);
    this.stage.addChild(title);

    subtitle = this.createText("DEVELOPED BY RASMUS AND KAJUS", 0, 106, 1.45, 760);
    this.centerText(subtitle, screen.centerX, 1.45);
    this.stage.addChild(subtitle);
    this.tintBitmapFieldText(subtitle, this.menuSkin.frame.light, true);

    this.developerCards.push(this.createDeveloperCard(206, 166, 392, 378, "RASMUS JILDHOLT", "ART  AUDIO  DESIGN  CODE", "Rasmus_Portrait", colors[0].accentLight, colors[1].accentLight, { frameWidth: 152, frameHeight: 152, frames: 16, framerate: 8 }));
    this.developerCards.push(this.createDeveloperCard(682, 166, 392, 378, "KAJUS TRINKUNAS", "GAMEPLAY  DESIGN  CODE", "Wizard_Portrait", colors[3].accentLight, colors[2].accentLight));

    this.createScreenFooter("B/BACKSPACE/ESC RETURN TO MAIN MENU", framePaletteSwaps);
};

/**
 * Updates the credits screen once per engine tick.
 *
 * @param {number} step Fixed time step supplied by the Rune engine.
 *
 * @return {undefined}
 */
GraveFallGame.scene.Credits.prototype.update = function (step) {
    var pressBack;
    var i;
    var gp;

    rune.scene.Scene.prototype.update.call(this, step);
    GraveFallGame.updateMenuMusicFades(step);

    if (this.isDevConsoleInputActive && this.isDevConsoleInputActive()) {
        return;
    }

    this.animTime += step;

    pressBack = this.keyboard.justPressed("escape") || this.keyboard.justPressed("backspace");
    for (i = 0; i < 4; i++) {
        gp = this.gamepads.get(i);
        if (gp) {
            if (gp.justPressed(1) || gp.justPressed(2)) pressBack = true;
        }
    }

    if (pressBack) {
        GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_BACK, 0.55);
        this.application.scenes.load([
            new GraveFallGame.scene.Menu()
        ]);
    }
};

/**
 * Creates one developer card for the credits screen.
 *
 * @param {number} x Horizontal position.
 * @param {number} y Vertical position.
 * @param {number} width Width in pixels.
 * @param {number} height Height in pixels.
 * @param {string} name Developer name.
 * @param {string} role Developer role text.
 * @param {string} portraitResource Resource name for the portrait.
 * @param {string} nameColor Name text color.
 * @param {string} roleColor Role text color.
 * @param {Object} animationOptions Optional sprite-sheet animation options.
 *
 * @return {Object} Created display object.
 */
GraveFallGame.scene.Credits.prototype.createDeveloperCard = function (x, y, width, height, name, role, portraitResource, nameColor, roleColor, animationOptions) {
    var framePaletteSwaps = this.getFramePaletteSwaps(this.menuSkin);
    var card = new rune.display.DisplayObjectContainer(x, y, width, height);
    var top = new rune.display.Graphic(0, 0, width, Math.round(height * 0.5));
    var bottom = new rune.display.Graphic(0, Math.round(height * 0.5), width, height - Math.round(height * 0.5));
    var frameWidth = 220;
    var frameHeight = 220;
    var frameX = Math.round((width - frameWidth) / 2);
    var frameY = 38;
    var portraitFrameWidth = animationOptions && animationOptions.frameWidth ? animationOptions.frameWidth : 100;
    var portraitFrameHeight = animationOptions && animationOptions.frameHeight ? animationOptions.frameHeight : 100;
    var imageBack = new rune.display.Graphic(frameX, frameY, frameWidth, frameHeight);
    var portrait = new rune.display.Sprite(0, 0, portraitFrameWidth, portraitFrameHeight, portraitResource);
    var nameText;
    var roleText;
    var portraitBaseWidth;
    var portraitBaseHeight;
    var scale;
    var scaledWidth;
    var scaledHeight;
    var frames;
    var i;

    top.backgroundColor = this.menuSkin.panelTop;
    bottom.backgroundColor = this.menuSkin.panelBottom;
    imageBack.backgroundColor = this.menuSkin.panelBottom;

    card.addChild(top);
    card.addChild(bottom);
    card.addChild(imageBack);

    portraitBaseWidth = portrait.width || 100;
    portraitBaseHeight = portrait.height || 100;
    scale = Math.min((frameWidth - 46) / portraitBaseWidth, (frameHeight - 46) / portraitBaseHeight);
    scaledWidth = portraitBaseWidth * scale;
    scaledHeight = portraitBaseHeight * scale;
    portrait.scaleX = scale;
    portrait.scaleY = scale;
    portrait.x = Math.round(frameX + ((frameWidth - scaledWidth) / 2));
    portrait.y = Math.round(frameY + ((frameHeight - scaledHeight) / 2));

    if (animationOptions && portrait.animation && typeof portrait.animation.create === "function") {
        frames = [];
        for (i = 0; i < (animationOptions.frames || 1); i++) {
            frames.push(i);
        }
        portrait.animation.create(
            "idle",
            frames,
            3,
            true
        );
        portrait.animation.gotoAndPlay("idle", 0);
    }

    card.addChild(portrait);

    card.addChild(this.createBoxFrame(frameX, frameY, frameWidth, frameHeight, framePaletteSwaps));

    nameText = this.createText(name, 0, 284, 2.4, width);
    this.centerText(nameText, Math.round(width / 2), 2.4);
    card.addChild(nameText);
    this.tintBitmapFieldText(nameText, nameColor || this.menuSkin.frame.light, true);

    roleText = this.createText(role, 0, 328, 1.08, width);
    this.centerText(roleText, Math.round(width / 2), 1.08);
    card.addChild(roleText);
    this.tintBitmapFieldText(roleText, roleColor || this.menuSkin.frame.light, true);

    card.addChild(this.createBoxFrame(0, 0, width, height, framePaletteSwaps));
    this.stage.addChild(card);

    return card;
};

/**
 * Creates the credits back button.
 *
 * @param {number} x Horizontal position.
 * @param {number} y Vertical position.
 * @param {number} width Width in pixels.
 * @param {number} height Height in pixels.
 * @param {string} accent Accent color.
 * @param {string} accentLight Light accent color.
 *
 * @return {Object} Created display object.
 */
GraveFallGame.scene.Credits.prototype.createBackButton = function (x, y, width, height, accent, accentLight) {
    var framePaletteSwaps = this.getFramePaletteSwaps(this.menuSkin);
    var button = new rune.display.DisplayObjectContainer(x, y, width, height);
    var topHeight = Math.round(height * 0.48);
    var top = new rune.display.Graphic(0, 0, width, topHeight);
    var bottom = new rune.display.Graphic(0, topHeight, width, height - topHeight);
    var glow = new rune.display.Graphic(16, height - 8, width - 32, 4);
    var icon = new rune.display.Sprite(58, 10, 100, 100, "Back_Arrow_Icon_T");
    var text = this.createText("BACK", 94, 12, 1.5, width - 108);

    top.backgroundColor = this.menuSkin.panelTop;
    bottom.backgroundColor = this.menuSkin.panelBottom;
    glow.backgroundColor = accent;
    glow.alpha = 0.32;
    button.glow = glow;

    icon.scaleX = 0.24;
    icon.scaleY = 0.24;
    this.applyMonochromeIconColor(icon, accentLight || accent);

    button.addChild(top);
    button.addChild(bottom);
    button.addChild(glow);
    button.addChild(icon);
    button.addChild(text);
    button.addChild(this.createBoxFrame(0, 0, width, height, framePaletteSwaps));
    this.tintBitmapFieldText(text, accentLight || accent, true);
    this.stage.addChild(button);

    return button;
};

/**
 * Disposes the credits screen resources.
 *
 * @return {undefined}
 */
GraveFallGame.scene.Credits.prototype.dispose = function () {
    this.backButton = null;
    this.developerCards = null;
    rune.scene.Scene.prototype.dispose.call(this);
};
