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
 * @inheritDoc
 */
GraveFallGame.scene.Menu.prototype.init = function () {
    var screen;
    var paletteKey;
    var palette;
    var framePaletteSwaps;
    var background;
    var panel;
    var title;
    var titleAccent;
    var footer;
    var footerText;

    rune.scene.Scene.prototype.init.call(this);

    screen = this.application.screen;
    paletteKey = GraveFallGame.scene.Game.resolveRunPaletteKey(GraveFallGame.scene.Game.ACTIVE_RUN_PALETTE_KEY);
    palette = GraveFallGame.scene.Game.getRunPalette(paletteKey);

    this.backgroundSkin = palette.outside;
    this.menuSkin = palette.inside;
    framePaletteSwaps = this.getFramePaletteSwaps(this.menuSkin);

    background = new rune.display.Sprite(0, 0, screen.width, screen.height, "Outside_Campfire");
    this.applyPaletteSwaps(background, this.getFramePaletteSwaps(this.backgroundSkin));
    this.stage.addChild(background);
    this.background = background;

    panel = this.createMenuPanel(250, 70, 780, 500, this.menuSkin, framePaletteSwaps);
    this.stage.addChild(panel);
    this.panel = panel;

    title = this.createText("GRAVEFALL", 0, 114, 4.1, 540);
    this.centerText(title, screen.centerX, 4.1);
    this.stage.addChild(title);
    this.title = title;

    titleAccent = new rune.display.Graphic(430, 166, 420, 4);
    titleAccent.backgroundColor = this.menuSkin.frame.mid;
    this.stage.addChild(titleAccent);

    this.optionCards = [];
    this.optionCards.push(this.createOptionCard({
        x: 378,
        y: 200,
        width: 524,
        height: 88,
        title: "START GAME",
        description: "BUILD A LOCAL 1-4 PLAYER PARTY",
        icon: "Fight_Icon_T",
        accent: GraveFallGame.scene.Game.PLAYER_THEMES[0].accent
    }));
    this.optionCards.push(this.createOptionCard({
        x: 378,
        y: 306,
        width: 524,
        height: 88,
        title: "HOW TO PLAY",
        description: "CONTROLS, RULES, MINIGAMES",
        icon: "Item_Icon_T",
        accent: GraveFallGame.scene.Game.PLAYER_THEMES[1].accent
    }));
    this.optionCards.push(this.createOptionCard({
        x: 378,
        y: 412,
        width: 524,
        height: 88,
        title: "LEADERBOARDS",
        description: "VIEW TOP 10 PARTIES",
        icon: "Skull_Attack_T",
        accent: GraveFallGame.scene.Game.PLAYER_THEMES[2].accent
    }));

    this.pointer = new rune.ui.VTMenuPointer();
    this.pointer.scaleX = 4;
    this.pointer.scaleY = 4;
    this.stage.addChild(this.pointer);

    this.createQuickControls();

    footer = new rune.display.DisplayObjectContainer(0, screen.height - 60, screen.width, 60);
    footer.backgroundColor = this.menuSkin.panelBottom;
    footer.addChild(this.createSeparator(0, 0, screen.width, framePaletteSwaps));
    this.stage.addChild(footer);

    footerText = this.createText("CONTROLLER PREFERRED GAME METHOD    PLAYTEST, STILL WIP", 0, 24, 1.2, 1200);
    this.centerText(footerText, screen.centerX, 1.2);
    footer.addChild(footerText);
    this.tintBitmapFieldText(footerText, this.menuSkin.frame.light, true);

    this.updateVisuals();
};

/**
 * @inheritDoc
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

GraveFallGame.scene.Menu.prototype.centerText = function (field, centerX, scale) {
    if (!field) {
        return;
    }

    scale = scale || field.scaleX || 1;
    field.x = Math.round(centerX - ((String(field.text).length * 6 * scale) / 2));
};

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

GraveFallGame.scene.Menu.prototype.createOptionCard = function (options) {
    var framePaletteSwaps = this.getFramePaletteSwaps(this.menuSkin);
    var card = new rune.display.DisplayObjectContainer(options.x, options.y, options.width, options.height);
    var backgroundTop = new rune.display.Graphic(0, 0, options.width, Math.round(options.height / 2));
    var backgroundBottom = new rune.display.Graphic(0, Math.round(options.height / 2), options.width, Math.round(options.height / 2));
    var accent = new rune.display.Graphic(0, 0, 6, options.height);
    var selectGlow = new rune.display.Graphic(12, options.height - 9, options.width - 24, 4);
    var icon = new rune.display.Sprite(20, 14, 100, 100, options.icon);
    var title = this.createText(options.title, 92, 20, 2.35, 360);
    var description = this.createText(options.description, 94, 56, 1.15, 380);

    backgroundTop.backgroundColor = this.menuSkin.panelTop;
    backgroundBottom.backgroundColor = this.menuSkin.panelBottom;
    accent.backgroundColor = options.accent;
    selectGlow.backgroundColor = options.accent;
    selectGlow.alpha = 0.32;

    icon.scaleX = 0.54;
    icon.scaleY = 0.54;
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

GraveFallGame.scene.Menu.prototype.createControlHint = function (parent, x, y, iconResource, title, detail, color) {
    var group = new rune.display.DisplayObjectContainer(x, y, 210, 44);
    var icon = new rune.display.Sprite(0, 2, 100, 100, iconResource);
    var titleText = this.createText(title, 44, 2, 1.15, 158);
    var detailText = this.createText(detail, 44, 22, 1.05, 164);

    icon.scaleX = 0.32;
    icon.scaleY = 0.32;
    this.applyMonochromeIconColor(icon, color || this.menuSkin.frame.light);

    group.addChild(icon);
    group.addChild(titleText);
    group.addChild(detailText);
    this.tintBitmapFieldText(titleText, color || this.menuSkin.frame.light, true);
    this.tintBitmapFieldText(detailText, this.menuSkin.frame.light, true);
    parent.addChild(group);

    return group;
};

GraveFallGame.scene.Menu.prototype.createQuickControls = function () {
    var panel;
    var heading;
    var keyboardText;
    var framePaletteSwaps = this.getFramePaletteSwaps(this.menuSkin);
    var x = 286;
    var y = 586;

    panel = new rune.display.DisplayObjectContainer(x, y, 708, 98);
    panel.backgroundColor = this.menuSkin.panelBottom;
    panel.addChild(this.createBoxFrame(0, 0, 708, 98, framePaletteSwaps));
    this.stage.addChild(panel);

    heading = this.createText("QUICK CONTROLS", 20, 14, 1.35, 220);
    panel.addChild(heading);
    this.tintBitmapFieldText(heading, this.menuSkin.frame.light, true);

    this.createControlHint(panel, 20, 38, "Gamepad_Button_Up_T", "MOVE", "W/S OR D-PAD", GraveFallGame.scene.Game.PLAYER_THEMES[2].accentLight);
    this.createControlHint(panel, 246, 38, "A_Button_Icon_T", "SELECT", "ENTER/SPACE OR A", GraveFallGame.scene.Game.PLAYER_THEMES[3].accentLight);
    this.createControlHint(panel, 476, 38, "Y_Button_Icon_T", "HELP", "H/R OR Y", GraveFallGame.scene.Game.PLAYER_THEMES[1].accentLight);

    keyboardText = this.createText("UP/DOWN CHANGES MENU SELECTIONS", 390, 16, 1.05, 300);
    panel.addChild(keyboardText);
    this.tintBitmapFieldText(keyboardText, this.menuSkin.frame.light, true);
};

GraveFallGame.scene.Menu.prototype.updateVisuals = function () {
    var i;
    var card;

    for (i = 0; i < this.optionCards.length; i++) {
        card = this.optionCards[i];
        card.container.alpha = i === this.index ? 1 : 0.78;
        card.glow.visible = i === this.index;
        card.glow.alpha = i === this.index ? 0.42 : 0.18;
        card.accent.width = i === this.index ? 10 : 6;
        card.icon.scaleX = i === this.index ? 0.54 : 0.5;
        card.icon.scaleY = i === this.index ? 0.54 : 0.5;
    }

    if (this.pointer && this.optionCards[this.index]) {
        card = this.optionCards[this.index];
        this.pointer.x = Math.round(card.x - this.pointer.width - 22);
        this.pointer.y = Math.round(card.y + (card.height / 2) - (this.pointer.height / 2));
    }
};

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