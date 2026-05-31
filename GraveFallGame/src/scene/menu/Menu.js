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

    panel = this.createMenuPanel(264, 42, 752, 606, this.menuSkin, framePaletteSwaps);
    this.stage.addChild(panel);
    this.panel = panel;

    title = this.createText("GRAVEFALL", 0, 84, 3.65, 540);
    this.centerText(title, screen.centerX, 3.65);
    this.stage.addChild(title);
    this.title = title;

    titleAccent = new rune.display.Graphic(448, 136, 384, 4);
    titleAccent.backgroundColor = this.menuSkin.frame.mid;
    this.stage.addChild(titleAccent);

    this.optionCards = [];
    this.optionCards.push(this.createOptionCard({
        x: 378,
        y: 168,
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
        y: 272,
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
        y: 376,
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
    var pressConfirm;
    var pressRules;
    var i;
    var gp;

    rune.scene.Scene.prototype.update.call(this, step);

    if (this.isDevConsoleInputActive && this.isDevConsoleInputActive()) {
        return;
    }

    this.animTime += step;
    this.updateAnimatedVisuals();

    pressDown = this.keyboard.justPressed("down") || this.keyboard.justPressed("s");
    pressUp = this.keyboard.justPressed("up") || this.keyboard.justPressed("w");
    pressConfirm = this.keyboard.justPressed("space") || this.keyboard.justPressed("enter");
    pressRules = this.keyboard.justPressed("h") || this.keyboard.justPressed("r");

    for (i = 0; i < 4; i++) {
        gp = this.gamepads.get(i);
        if (gp) {
            if (gp.justPressed(13) || gp.stickLeftJustDown) pressDown = true;
            if (gp.justPressed(12) || gp.stickLeftJustUp) pressUp = true;
            if (gp.justPressed(0)) pressConfirm = true;
            if (gp.justPressed(3)) pressRules = true;
        }
    }

    if (pressRules) {
        this.index = 1;
        this.updateVisuals();
        pressConfirm = true;
    }

    if (pressDown && this.index < this.optionCards.length - 1) {
        this.index++;
        GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_MOVE, 0.45);
        this.updateVisuals();
    }

    if (pressUp && this.index > 0) {
        this.index--;
        GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_MOVE, 0.45);
        this.updateVisuals();
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
    var title = this.createText(options.title, 104, 20, 2.35, 360);
    var description = this.createText(options.description, 106, 56, 1.15, 380);
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
    var y = 504;
    var width = 668;
    var height = 108;

    panel = new rune.display.DisplayObjectContainer(x, y, width, height);
    panel.backgroundColor = this.menuSkin.panelBottom;
    panel.addChild(this.createBoxFrame(0, 0, width, height, framePaletteSwaps));
    this.stage.addChild(panel);

    heading = this.createText("QUICK CONTROLS", 20, 13, 1.35, 220);
    panel.addChild(heading);
    this.tintBitmapFieldText(heading, this.menuSkin.frame.light, true);

    this.createControlHint(panel, 20, 42, ["Gamepad_Button_Up_T", "Gamepad_Button_Down_T"], "MOVE", "W/S OR D-PAD", GraveFallGame.scene.Game.PLAYER_THEMES[2].accentLight);
    this.createControlHint(panel, 236, 42, "A_Button_Icon_T", "SELECT", "ENTER/SPACE OR A", GraveFallGame.scene.Game.PLAYER_THEMES[3].accentLight);
    this.createControlHint(panel, 456, 42, "Y_Button_Icon_T", "HELP", "H/R OR Y", GraveFallGame.scene.Game.PLAYER_THEMES[1].accentLight);

 
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
    var pulse;

    if (!this.optionCards || !this.optionCards[this.index]) {
        return;
    }

    pulse = (Math.sin(this.animTime / 180) + 1) / 2;
    card = this.optionCards[this.index];
    card.glow.alpha = 0.28 + (pulse * 0.18);
};
