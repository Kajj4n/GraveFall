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
 * Rule scene.
 */
GraveFallGame.scene.Rule = function () {
    this.pageIndex = 0;
    this.pages = null;
    this.pageContainer = null;
    this.pageDots = null;
    this.animTime = 0;
    this.backgroundSkin = null;
    this.menuSkin = null;
    this.uiSkin = null;
    this.tabs = null;

    rune.scene.Scene.call(this);
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

GraveFallGame.scene.Rule.prototype = Object.create(rune.scene.Scene.prototype);
GraveFallGame.scene.Rule.prototype.constructor = GraveFallGame.scene.Rule;

//------------------------------------------------------------------------------
// Shared helpers from the game scene
//------------------------------------------------------------------------------

GraveFallGame.scene.Rule.prototype.applyPaletteSwaps = GraveFallGame.scene.Game.prototype.applyPaletteSwaps;
GraveFallGame.scene.Rule.prototype.getFramePaletteSwaps = GraveFallGame.scene.Game.prototype.getFramePaletteSwaps;
GraveFallGame.scene.Rule.prototype.getProjectilePaletteSwaps = GraveFallGame.scene.Game.prototype.getProjectilePaletteSwaps;
GraveFallGame.scene.Rule.prototype.applyMonochromeIconColor = GraveFallGame.scene.Game.prototype.applyMonochromeIconColor;
GraveFallGame.scene.Rule.prototype.createFramePiece = GraveFallGame.scene.Game.prototype.createFramePiece;
GraveFallGame.scene.Rule.prototype.createBoxFrame = GraveFallGame.scene.Game.prototype.createBoxFrame;
GraveFallGame.scene.Rule.prototype.createSeparator = GraveFallGame.scene.Game.prototype.createSeparator;
GraveFallGame.scene.Rule.prototype.tintBitmapFieldText = GraveFallGame.scene.Game.prototype.tintBitmapFieldText;
GraveFallGame.scene.Rule.prototype.isDevConsoleInputActive = GraveFallGame.scene.Game.prototype.isDevConsoleInputActive;
GraveFallGame.scene.Rule.prototype.resourceExists = GraveFallGame.scene.Game.prototype.resourceExists;

//------------------------------------------------------------------------------
// Override public prototype methods (ENGINE)
//------------------------------------------------------------------------------

/**
 * This method is automatically executed once after the scene is instantiated.
 *
 * @returns {undefined}
 */
GraveFallGame.scene.Rule.prototype.init = function () {
    var screen;
    var palette;
    var framePaletteSwaps;
    var background;
    var shell;
    var title;
    var subtitle;
    var footer;
    var footerText;

    rune.scene.Scene.prototype.init.call(this);

    screen = this.application.screen;
    palette = GraveFallGame.scene.Game.getRunPalette(
        GraveFallGame.scene.Game.resolveRunPaletteKey(GraveFallGame.scene.Game.ACTIVE_RUN_PALETTE_KEY)
    );

    this.backgroundSkin = palette.outside;
    this.menuSkin = palette.inside;
    this.uiSkin = this.menuSkin;
    framePaletteSwaps = this.getFramePaletteSwaps(this.menuSkin);

    this.pages = [
        { title: "BASICS", renderer: this.renderOverviewPage },
        { title: "CONTROLS", renderer: this.renderControlsPage },
        { title: "COMMANDS", renderer: this.renderCommandsPage },
        { title: "MINIGAMES", renderer: this.renderMinigamesPage }
    ];

    background = new rune.display.Sprite(0, 0, screen.width, screen.height, "Outside_Campfire");
    this.applyPaletteSwaps(background, this.getFramePaletteSwaps(this.backgroundSkin));
    this.stage.addChild(background);

    shell = this.createPanel(42, 26, screen.width - 84, screen.height - 94, this.menuSkin, framePaletteSwaps);
    this.stage.addChild(shell);
    this.shell = shell;

    title = this.createText("HOW TO PLAY", 0, 40, 3.3, 520);
    this.centerText(title, screen.centerX, 3.3);
    this.stage.addChild(title);

    subtitle = this.createText("A LOCAL 1-4 PLAYER PLAYTEST GUIDE", 0, 88, 1.45, 620);
    this.centerText(subtitle, screen.centerX, 1.45);
    this.stage.addChild(subtitle);
    this.tintBitmapFieldText(subtitle, this.menuSkin.frame.light, true);

    this.createPageTabs();
    this.createPageDots();

    footer = new rune.display.DisplayObjectContainer(0, screen.height - 62, screen.width, 62);
    footer.backgroundColor = this.menuSkin.panelBottom;
    footer.addChild(this.createSeparator(0, 0, screen.width, framePaletteSwaps));
    this.stage.addChild(footer);

    footerText = this.createText("LEFT/RIGHT OR D-PAD CHANGE PAGE    A/SPACE NEXT PAGE    B/BACKSPACE/ESC RETURN", 0, 24, 1.2, 1200);
    this.centerText(footerText, screen.centerX, 1.2);
    footer.addChild(footerText);
    this.tintBitmapFieldText(footerText, this.menuSkin.frame.light, true);

    this.renderPage();
};

/**
 * This method is automatically executed once per tick.
 *
 * @param {number} step Fixed time step.
 *
 * @returns {undefined}
 */
GraveFallGame.scene.Rule.prototype.update = function (step) {
    var pressLeft;
    var pressRight;
    var pressNext;
    var pressBack;
    var i;
    var gp;

    rune.scene.Scene.prototype.update.call(this, step);

    if (this.isDevConsoleInputActive && this.isDevConsoleInputActive()) {
        return;
    }

    this.animTime += step;

    pressLeft = this.keyboard.justPressed("left") || this.keyboard.justPressed("a");
    pressRight = this.keyboard.justPressed("right") || this.keyboard.justPressed("d");
    pressNext = this.keyboard.justPressed("space") || this.keyboard.justPressed("enter");
    pressBack = this.keyboard.justPressed("escape") || this.keyboard.justPressed("backspace");

    for (i = 0; i < 4; i++) {
        gp = this.gamepads.get(i);
        if (gp) {
            if (gp.justPressed(14) || gp.stickLeftJustLeft) pressLeft = true;
            if (gp.justPressed(15) || gp.stickLeftJustRight) pressRight = true;
            if (gp.justPressed(0)) pressNext = true;
            if (gp.justPressed(1) || gp.justPressed(2)) pressBack = true;
        }
    }

    if (pressBack) {
        GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_BACK, 0.55);
        this.application.scenes.load([
            new GraveFallGame.scene.Menu()
        ]);
        return;
    }

    if (pressRight || pressNext) {
        this.changePage(1);
        return;
    }

    if (pressLeft) {
        this.changePage(-1);
        return;
    }
};

/**
 * This method is automatically called once just before the scene ends.
 *
 * @returns {undefined}
 */
GraveFallGame.scene.Rule.prototype.dispose = function () {
    this.pageContainer = null;
    this.pageDots = null;
    this.pages = null;
    this.tabs = null;
    rune.scene.Scene.prototype.dispose.call(this);
};

//------------------------------------------------------------------------------
// General helpers
//------------------------------------------------------------------------------

GraveFallGame.scene.Rule.prototype.createText = function (text, x, y, scale, width) {
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

GraveFallGame.scene.Rule.prototype.centerText = function (field, centerX, scale) {
    if (!field) {
        return;
    }

    scale = scale || field.scaleX || 1;
    field.x = Math.round(centerX - ((String(field.text).length * 6 * scale) / 2));
};

GraveFallGame.scene.Rule.prototype.createPanel = function (x, y, width, height, skin, framePaletteSwaps) {
    var panel = new rune.display.DisplayObjectContainer(x, y, width, height);
    var top = new rune.display.Graphic(0, 0, width, Math.round(height * 0.45));
    var bottom = new rune.display.Graphic(0, Math.round(height * 0.45), width, height - Math.round(height * 0.45));
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

GraveFallGame.scene.Rule.prototype.createRuleCard = function (parent, x, y, width, height, title, accentColor) {
    var framePaletteSwaps = this.getFramePaletteSwaps(this.menuSkin);
    var card = new rune.display.DisplayObjectContainer(x, y, width, height);
    var top = new rune.display.Graphic(0, 0, width, Math.round(height / 2));
    var bottom = new rune.display.Graphic(0, Math.round(height / 2), width, height - Math.round(height / 2));
    var stripe = new rune.display.Graphic(0, 0, 7, height);
    var titleText;

    top.backgroundColor = this.menuSkin.panelTop;
    bottom.backgroundColor = this.menuSkin.panelBottom;
    stripe.backgroundColor = accentColor || this.menuSkin.frame.mid;

    card.addChild(top);
    card.addChild(bottom);
    card.addChild(stripe);
    card.addChild(this.createBoxFrame(0, 0, width, height, framePaletteSwaps));

    titleText = this.createText(title, 18, 14, 1.55, width - 36);
    card.addChild(titleText);
    this.tintBitmapFieldText(titleText, accentColor || this.menuSkin.frame.light, true);

    parent.addChild(card);
    return card;
};

GraveFallGame.scene.Rule.prototype.addCardLine = function (card, text, x, y, scale, color) {
    var field = this.createText(text, x, y, scale || 1, 1000);
    card.addChild(field);

    if (color) {
        this.tintBitmapFieldText(field, color, true);
    }

    return field;
};

GraveFallGame.scene.Rule.prototype.createSmallIcon = function (parent, x, y, resource, scale, color) {
    var icon = new rune.display.Sprite(x, y, 100, 100, resource);

    icon.scaleX = scale || 0.36;
    icon.scaleY = scale || 0.36;

    if (color) {
        this.applyMonochromeIconColor(icon, color);
    }

    parent.addChild(icon);
    return icon;
};

GraveFallGame.scene.Rule.prototype.createPageTabs = function () {
    var i;
    var tab;
    var text;
    var x = 186;
    var y = 126;
    var w = 214;
    var h = 38;
    var color;

    this.tabs = [];

    for (i = 0; i < this.pages.length; i++) {
        color = GraveFallGame.scene.Game.PLAYER_THEMES[i].accent;
        tab = new rune.display.DisplayObjectContainer(x + (i * (w + 12)), y, w, h);
        tab.backgroundColor = this.menuSkin.panelBottom;
        tab.tabStripe = new rune.display.Graphic(0, 0, w, 4);
        tab.tabStripe.backgroundColor = color;
        tab.addChild(tab.tabStripe);
        tab.addChild(this.createBoxFrame(0, 0, w, h, this.getFramePaletteSwaps(this.menuSkin)));
        text = this.createText((i + 1) + "  " + this.pages[i].title, 22, 13, 1.15, w - 28);
        tab.addChild(text);
        this.stage.addChild(tab);
        this.tabs.push(tab);
    }
};

GraveFallGame.scene.Rule.prototype.createPageDots = function () {
    var i;
    var dot;
    var screen = this.application.screen;
    var startX = Math.round(screen.centerX - ((this.pages.length * 28) / 2));

    this.pageDots = [];

    for (i = 0; i < this.pages.length; i++) {
        dot = new rune.display.Graphic(startX + (i * 28), 618, 14, 14);
        dot.backgroundColor = GraveFallGame.scene.Game.PLAYER_THEMES[i].accent;
        this.stage.addChild(dot);
        this.pageDots.push(dot);
    }
};

GraveFallGame.scene.Rule.prototype.changePage = function (direction) {
    this.pageIndex += direction;

    if (this.pageIndex < 0) {
        this.pageIndex = this.pages.length - 1;
    }

    if (this.pageIndex >= this.pages.length) {
        this.pageIndex = 0;
    }

    GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_MOVE, 0.45);
    this.renderPage();
};

GraveFallGame.scene.Rule.prototype.renderPage = function () {
    var renderer;
    var i;

    if (this.pageContainer && this.pageContainer.parent) {
        this.pageContainer.parent.removeChild(this.pageContainer, true);
    }

    this.pageContainer = new rune.display.DisplayObjectContainer(74, 182, 1132, 430);
    this.stage.addChild(this.pageContainer);

    renderer = this.pages[this.pageIndex].renderer;
    renderer.call(this, this.pageContainer);

    if (this.pageDots) {
        for (i = 0; i < this.pageDots.length; i++) {
            this.pageDots[i].alpha = i === this.pageIndex ? 1 : 0.3;
        }
    }

    if (this.tabs) {
        for (i = 0; i < this.tabs.length; i++) {
            this.tabs[i].alpha = i === this.pageIndex ? 1 : 0.55;
        }
    }
};

//------------------------------------------------------------------------------
// Page renderers
//------------------------------------------------------------------------------

GraveFallGame.scene.Rule.prototype.renderOverviewPage = function (root) {
    var colors = GraveFallGame.scene.Game.PLAYER_THEMES;
    var card;
    var enemyCard;

    card = this.createRuleCard(root, 18, 0, 530, 306, "BASIC RULES", colors[0].accent);
    this.addCardLine(card, "1-4 LOCAL PLAYERS CAN JOIN THE RUN.", 28, 54, 1.18);
    this.addCardLine(card, "CONTROLLER IS THE PREFERRED PLAY METHOD.", 28, 82, 1.18, this.menuSkin.frame.light);
    this.addCardLine(card, "KEYBOARD ALSO WORKS BUT MIGHT BE CONFUSING.", 28, 110, 1.18);
    this.addCardLine(card, "EACH PLAYER PICKS A CLASS TO PLAY AS.", 28, 138, 1.18);
    this.addCardLine(card, "COMMAND PHASE: CHOOSE FIGHT, DEFEND, BUFF, OR ITEM.", 28, 166, 1.18);
    this.addCardLine(card, "ACTION PHASE: MOVE IN THE ARENA, DODGE HAZARDS AND PICKUP ITEMS.", 28, 194, 1.18);
    this.addCardLine(card, "IF EVERYONE IS DOWN, THE RUN ENDS.", 28, 222, 1.18, colors[0].accentLight);

    enemyCard = this.createRuleCard(root, 582, 0, 530, 306, "ENEMY LOOP AND HP", colors[2].accent);
    this.addCardLine(enemyCard, "YOU FIGHT TWO NORMAL ENEMIES, THEN ONE BOSS.", 28, 54, 1.18);
    this.addCardLine(enemyCard, "THE CURRENT ENEMY ART USES PLACEHOLDER SPRITES.", 28, 82, 1.18, this.menuSkin.frame.light);
    this.addCardLine(enemyCard, "KILLING AN ENEMY RESTORES A SMALL AMOUNT OF HP.", 28, 110, 1.18);
    this.addCardLine(enemyCard, "ANY HP GAIN CAN BRING DOWNED PLAYERS BACK UP.", 28, 138, 1.18);
    this.addCardLine(enemyCard, "BOSS FIGHTS USE THE SAME GAMEPLAYLOOP, BUT ARE HARDER.", 28, 166, 1.18);

    this.createEnemyStep(enemyCard, 38, 206, "ENEMY 1", "Ghoul_Idle_T", colors[0].accent);
    this.createEnemyStep(enemyCard, 204, 206, "ENEMY 2", "Goblin_Idle_T", colors[1].accent);
    this.createEnemyStep(enemyCard, 370, 206, "BOSS", "HyDragon_Idle_T", colors[2].accent);
};

GraveFallGame.scene.Rule.prototype.renderControlsPage = function (root) {
    var colors = GraveFallGame.scene.Game.PLAYER_THEMES;
    var card;
    var keyCard;
    var header;

    card = this.createRuleCard(root, 18, 0, 530, 410, "CONTROLLER LAYOUT", colors[1].accent);
    this.addCardLine(card, "ONE CONTROLLER PER PLAYER.", 28, 54, 1.18, this.menuSkin.frame.light);

    this.createSmallIcon(card, 54, 100, "Gamepad_Button_Up_T", 0.44, colors[2].accentLight);
    this.createSmallIcon(card, 22, 132, "Gamepad_Button_Left_T", 0.44, colors[1].accentLight);
    this.createSmallIcon(card, 86, 132, "Gamepad_Button_Right_T", 0.44, colors[0].accentLight);
    this.createSmallIcon(card, 54, 164, "Gamepad_Button_Down_T", 0.44, colors[3].accentLight);
    this.addCardLine(card, "D-PAD / LEFT STICK", 156, 120, 1.35, colors[2].accentLight);
    this.addCardLine(card, "MOVE, DODGE, SELECT, AIM, AND NAVIGATE.", 156, 150, 1.1);

    this.createSmallIcon(card, 54, 234, "Y_Button_Icon_T", 0.44, colors[2].accentLight);
    this.createSmallIcon(card, 22, 266, "X_Button_Icon_T", 0.44, colors[1].accentLight);
    this.createSmallIcon(card, 86, 266, "B_Button_Icon_T", 0.44, colors[0].accentLight);
    this.createSmallIcon(card, 54, 298, "A_Button_Icon_T", 0.44, colors[3].accentLight);
    this.addCardLine(card, "FACE BUTTONS", 156, 246, 1.35, colors[3].accentLight);
    this.addCardLine(card, "A = CONFIRM / ATTACK / ACCEPT.", 156, 276, 1.1);
    this.addCardLine(card, "B = BACK / CANCEL / RETURN TO PREVIOUS MENU.", 156, 302, 1.1, colors[0].accentLight);
    this.addCardLine(card, "X / Y / A / B ARE ALSO USED IN MINIGAMES.", 156, 328, 1.1);
    this.addCardLine(card, "SHOWN BUTTON PROMTS MAY DIFFER FROM YOUR GAMING CONTROLLER.", 28, 372, 1.0, this.menuSkin.frame.light);

    keyCard = this.createRuleCard(root, 582, 0, 530, 410, "KEYBOARD MAP", colors[0].accent);
    this.addCardLine(keyCard, "ESC = OPEN / LEAVE MENUS      BACKSPACE = BACK", 24, 48, 1.06, this.menuSkin.frame.light);

    header = this.createPlayerHeaderRow(keyCard, 24, 84, 482);
    header.alpha = 0.9;

    this.createPlayerControlRow(keyCard, 24, 120, "P1", "MOVE: W A S D", "MENU: A / D", "OK: SPACE", colors[0].accent);
    this.createPlayerControlRow(keyCard, 24, 180, "P2", "MOVE: ARROWS", "MENU: LEFT / RIGHT", "OK: ENTER", colors[1].accent);
    this.createPlayerControlRow(keyCard, 24, 240, "P3", "MOVE: I J K L", "MENU: J / L", "OK: M", colors[2].accent);
    this.createPlayerControlRow(keyCard, 24, 300, "P4", "MOVE: T F G H", "MENU: V / N", "OK: B", colors[3].accent);

    this.addCardLine(keyCard, "MINIGAMES USE EACH PLAYER'S MOVEMENT KEYS ON KEYBOARD.", 24, 370, 1.0, this.menuSkin.frame.light);
};

GraveFallGame.scene.Rule.prototype.renderCommandsPage = function (root) {
    var colors = GraveFallGame.scene.Game.PLAYER_THEMES;
    var commandCard;
    var arenaCard;
    var arena;
    var icon;

    commandCard = this.createRuleCard(root, 18, 0, 530, 410, "COMMAND PHASE", colors[2].accent);
    this.addCardLine(commandCard, "MOVE LEFT / RIGHT BETWEEN COMMANDS, THEN CONFIRM.", 26, 54, 1.08, this.menuSkin.frame.light);
    this.createCommandIconCard(commandCard, 28, 96, "FIGHT", "Fight_Icon_T", colors[0].accent, "START ATTACK MINIGAME");
    this.createCommandIconCard(commandCard, 280, 96, "DEFEND", "Defend_Icon_T", colors[1].accent, "PROTECT SELF OR ALLY");
    this.createCommandIconCard(commandCard, 28, 224, "BUFF", "Buff_Icon_T", colors[2].accent, "USE CLASS SUPPORT");
    this.createCommandIconCard(commandCard, 280, 224, "ITEM", "Item_Icon_T", colors[3].accent, "HEAL OR PERMANENT BUFF");

    arenaCard = this.createRuleCard(root, 582, 0, 530, 410, "ACTION PHASE", colors[3].accent);
    this.addCardLine(arenaCard, "AFTER COMMANDS RESOLVE, THE ENEMY ATTACK PATTERN STARTS.", 26, 54, 1.02, this.menuSkin.frame.light);
    this.addCardLine(arenaCard, "MOVE AROUND THE ARENA AND AVOID ENEMY PROJECTILES.", 26, 78, 1.06);
    this.addCardLine(arenaCard, "SURVIVE THE TIMER TO REACH THE NEXT COMMAND TURN.", 26, 102, 1.06);

    arena = new rune.display.DisplayObjectContainer(46, 136, 434, 166);
    arena.backgroundColor = "#090807";
    arena.addChild(this.createBoxFrame(0, 0, 434, 166, this.getFramePaletteSwaps(this.menuSkin)));
    arenaCard.addChild(arena);

    this.createArenaProjectile(arena, 78, 22, 20, 58, "Falling_Sword_Attack_T", 0, false, GraveFallGame.scene.Game.PROJECTILE_NEUTRAL);
    this.createArenaProjectile(arena, 112, 52, 48, 24, "Knife_Attack_T", 0, false, GraveFallGame.scene.Game.PROJECTILE_NEUTRAL);
    this.createArenaProjectile(arena, 286, 30, 28, 28, "Orb_Attack_T", 0, false, GraveFallGame.scene.Game.PROJECTILE_NEUTRAL);
    this.createArenaProjectile(arena, 348, 106, 32, 32, "StompWave_Attack_T", 0, false, GraveFallGame.scene.Game.PROJECTILE_NEUTRAL);
    this.createArenaProjectile(arena, 176, 116, 36, 36, "Fireball_Attack_T", 0, false, GraveFallGame.scene.Game.PROJECTILE_NEUTRAL);
    this.createArenaProjectile(arena, 358, 52, 52, 26, "Fire_wave_Attack_T", 0, false, GraveFallGame.scene.Game.PROJECTILE_NEUTRAL);

    icon = this.createSmallIcon(arena, 70, 70, "Fighter_Icon_T", 0.34, colors[0].accent);
    icon = this.createSmallIcon(arena, 154, 92, "Wizard_Icon_T", 0.34, colors[1].accent);
    icon = this.createSmallIcon(arena, 244, 54, "Ranger_Icon_T", 0.34, colors[2].accent);
    icon = this.createSmallIcon(arena, 324, 86, "Assassin_Icon_T", 0.34, colors[3].accent);

    this.addCardLine(arenaCard, "PLAYER COLORS AND CLASS ICONS ARE USED THROUGHOUT THE UI.", 36, 316, 1.0, this.menuSkin.frame.light);
    this.createPlayerColorLegend(arenaCard, 40, 340, "P1", "Fighter_Icon_T", colors[0].accent, "RED");
    this.createPlayerColorLegend(arenaCard, 156, 340, "P2", "Wizard_Icon_T", colors[1].accent, "BLUE");
    this.createPlayerColorLegend(arenaCard, 272, 340, "P3", "Ranger_Icon_T", colors[2].accent, "YELLOW");
    this.createPlayerColorLegend(arenaCard, 388, 340, "P4", "Assassin_Icon_T", colors[3].accent, "GREEN");
};

GraveFallGame.scene.Rule.prototype.renderMinigamesPage = function (root) {
    var colors = GraveFallGame.scene.Game.PLAYER_THEMES;
    var colorCard;

    this.createMinigamePreviewCard(root, 4, 0, 270, 222, "WARRIOR", "Fighter_Icon_T", colors[0].accent, "buttonMash");
    this.createMinigamePreviewCard(root, 286, 0, 270, 222, "WIZARD", "Wizard_Icon_T", colors[1].accent, "sequence");
    this.createMinigamePreviewCard(root, 568, 0, 270, 222, "RANGER", "Ranger_Icon_T", colors[2].accent, "aim");
    this.createMinigamePreviewCard(root, 850, 0, 270, 222, "ROGUE", "Assassin_Icon_T", colors[3].accent, "timing");
};

//------------------------------------------------------------------------------
// Reusable page widgets
//------------------------------------------------------------------------------

GraveFallGame.scene.Rule.prototype.createFlowNode = function (parent, x, y, number, label, color) {
    var node = new rune.display.DisplayObjectContainer(x, y, 156, 64);
    var bg = new rune.display.Graphic(0, 0, 156, 64);
    var stripe = new rune.display.Graphic(0, 0, 156, 5);
    var numText;
    var labelText;

    bg.backgroundColor = this.menuSkin.panelBottom;
    stripe.backgroundColor = color;
    node.addChild(bg);
    node.addChild(stripe);
    node.addChild(this.createBoxFrame(0, 0, 156, 64, this.getFramePaletteSwaps(this.menuSkin)));

    numText = this.createText(number, 12, 18, 2, 32);
    labelText = this.createText(label, 40, 23, 1.05, 112);
    node.addChild(numText);
    node.addChild(labelText);
    this.tintBitmapFieldText(numText, color, true);
    parent.addChild(node);

    return node;
};

GraveFallGame.scene.Rule.prototype.createFlowArrow = function (parent, x, y) {
    var arrow = this.createText(">", x, y, 2, 30);
    parent.addChild(arrow);
    this.tintBitmapFieldText(arrow, this.menuSkin.frame.light, true);
};

GraveFallGame.scene.Rule.prototype.createEnemyStep = function (parent, x, y, label, resource, color) {
    var step = new rune.display.DisplayObjectContainer(x, y, 126, 82);
    var bg = new rune.display.Graphic(0, 0, 126, 82);
    var icon = new rune.display.Sprite(24, 4, 100, 100, resource);
    var text = this.createText(label, 0, 62, 1, 126);

    bg.backgroundColor = this.menuSkin.panelTop;
    icon.scaleX = 0.52;
    icon.scaleY = 0.52;
    text.x = Math.round(63 - ((label.length * 6) / 2));

    step.addChild(bg);
    step.addChild(icon);
    step.addChild(text);
    step.addChild(this.createBoxFrame(0, 0, 126, 82, this.getFramePaletteSwaps(this.menuSkin)));
    parent.addChild(step);
    this.tintBitmapFieldText(text, color, true);

    return step;
};

GraveFallGame.scene.Rule.prototype.createPlayerHeaderRow = function (parent, x, y, width) {
    var row = new rune.display.DisplayObjectContainer(x, y, width, 28);
    var bg = new rune.display.Graphic(0, 0, width, 28);

    bg.backgroundColor = this.menuSkin.panelBottom;
    row.addChild(bg);
    row.addChild(this.createBoxFrame(0, 0, width, 28, this.getFramePaletteSwaps(this.menuSkin)));
    row.addChild(this.createText("PLAYER", 16, 7, 1.05, 68));
    row.addChild(this.createText("MOVE", 100, 7, 1.05, 130));
    row.addChild(this.createText("MENU", 248, 7, 1.05, 130));
    row.addChild(this.createText("OK", 408, 7, 1.05, 58));
    parent.addChild(row);
    this.tintBitmapFieldText(row.getChildAt(2), this.menuSkin.frame.light, true);
    this.tintBitmapFieldText(row.getChildAt(3), this.menuSkin.frame.light, true);
    this.tintBitmapFieldText(row.getChildAt(4), this.menuSkin.frame.light, true);
    this.tintBitmapFieldText(row.getChildAt(5), this.menuSkin.frame.light, true);

    return row;
};

GraveFallGame.scene.Rule.prototype.createPlayerControlRow = function (parent, x, y, player, move, menu, ok, color) {
    var row = new rune.display.DisplayObjectContainer(x, y, 482, 52);
    var bg = new rune.display.Graphic(0, 0, 482, 52);
    var stripe = new rune.display.Graphic(0, 0, 8, 52);
    var pText = this.createText(player, 18, 18, 1.15, 48);
    var moveText = this.createText(move, 74, 18, 1.02, 144);
    var menuText = this.createText(menu, 226, 18, 1.02, 152);
    var okText = this.createText(ok, 398, 18, 1.02, 74);

    bg.backgroundColor = this.menuSkin.panelTop;
    stripe.backgroundColor = color;

    row.addChild(bg);
    row.addChild(stripe);
    row.addChild(pText);
    row.addChild(moveText);
    row.addChild(menuText);
    row.addChild(okText);
    row.addChild(this.createBoxFrame(0, 0, 482, 52, this.getFramePaletteSwaps(this.menuSkin)));
    parent.addChild(row);
    this.tintBitmapFieldText(pText, color, true);

    return row;
};

GraveFallGame.scene.Rule.prototype.createCommandIconCard = function (parent, x, y, title, resource, color, description) {
    var mini = new rune.display.DisplayObjectContainer(x, y, 218, 102);
    var bg = new rune.display.Graphic(0, 0, 218, 102);
    var stripe = new rune.display.Graphic(0, 0, 5, 102);
    var icon = new rune.display.Sprite(14, 18, 100, 100, resource);
    var titleText = this.createText(title, 72, 20, 1.3, 120);
    var desc = this.createText(description, 72, 54, 1.05, 140);

    bg.backgroundColor = this.menuSkin.panelTop;
    stripe.backgroundColor = color;
    icon.scaleX = 0.60;
    icon.scaleY = 0.60;
    this.applyMonochromeIconColor(icon, color);

    mini.addChild(bg);
    mini.addChild(stripe);
    mini.addChild(icon);
    mini.addChild(titleText);
    mini.addChild(desc);
    mini.addChild(this.createBoxFrame(0, 0, 218, 102, this.getFramePaletteSwaps(this.menuSkin)));
    parent.addChild(mini);

    this.tintBitmapFieldText(titleText, color, true);
    return mini;
};

GraveFallGame.scene.Rule.prototype.createArenaHazard = function (parent, x, y, width, height, alpha) {
    var hazard = new rune.display.Graphic(x, y, width, height);
    hazard.backgroundColor = "#F5F5F5";
    hazard.alpha = alpha || 0.5;
    parent.addChild(hazard);
    return hazard;
};

GraveFallGame.scene.Rule.prototype.createPlayerColorLegend = function (parent, x, y, label, resource, color, colorName) {
    var chip = new rune.display.DisplayObjectContainer(x, y, 102, 44);
    var bg = new rune.display.Graphic(0, 0, 102, 44);
    var icon = new rune.display.Sprite(6, 5, 100, 100, resource);
    var pText = this.createText(label, 40, 9, 1.05, 30);
    var colorText = this.createText(colorName, 40, 24, 1.05, 58);

    bg.backgroundColor = this.menuSkin.panelTop;
    icon.scaleX = 0.40;
    icon.scaleY = 0.40;
    this.applyMonochromeIconColor(icon, color);

    chip.addChild(bg);
    chip.addChild(icon);
    chip.addChild(pText);
    chip.addChild(colorText);
    chip.addChild(this.createBoxFrame(0, 0, 102, 44, this.getFramePaletteSwaps(this.menuSkin)));
    parent.addChild(chip);
    this.tintBitmapFieldText(pText, color, true);
};

GraveFallGame.scene.Rule.prototype.createMinigamePreviewCard = function (parent, x, y, width, height, title, classIcon, color, type) {
    var card = this.createRuleCard(parent, x, y, width, height, title, color);
    var panel = this.createStaticMinigamePanel(card, 7, 48, 256, 128, color, type);
    var instructionText = "";

    this.createSmallIcon(card, width - 42, 8, classIcon, 0.40, color);

    if (type === "buttonMash") instructionText = "PRESS SHOWN BUTTON REPEATEDLY.";
    if (type === "sequence") instructionText = "INPUT THE SEQUENCE LEFT TO RIGHT.";
    if (type === "aim") instructionText = "CONFIRM WHEN RETICLE IS CENTERED.";
    if (type === "timing") instructionText = "CONFIRM AS RETICLE CROSSES CENTER.";

    this.addCardLine(card, instructionText, 12, 188, 1.05, this.menuSkin.frame.light);

    return panel;
};

GraveFallGame.scene.Rule.prototype.createStaticMinigamePanel = function (parent, x, y, width, height, color, type) {
    var group = new rune.display.DisplayObjectContainer(x, y, width, height);
    var bg = new rune.display.Graphic(0, 0, width, height);
    var innerBg = new rune.display.Graphic(4, 4, width - 8, height - 8);
    var accent = new rune.display.Graphic(16, 16, width - 32, 2);
    var timerBack = new rune.display.Graphic(16, height - 16, width - 32, 4);
    var timerFill = new rune.display.Graphic(16, height - 16, Math.round((width - 32) * 0.72), 4);
    var scoreText = this.createText("DMG +12", width - 74, 6, 1.05, 68);
    var prompt;
    var barBack;
    var barFill;
    var directions;
    var centers;
    var i;
    var direction;
    var isActive;
    var directionIcon;
    var buttonIcon;
    var directionScale;
    var buttonScale;
    var target;
    var bullseye;
    var centerDot;
    var reticle;
    var bar;
    var hitZone;
    var centerLine;
    var block;

    bg.backgroundColor = this.menuSkin.panelBottom;
    innerBg.backgroundColor = this.menuSkin.panelTop;
    accent.backgroundColor = color;
    timerBack.backgroundColor = "#1A1A1A";
    timerFill.backgroundColor = color;

    group.addChild(bg);
    group.addChild(innerBg);
    group.addChild(accent);
    group.addChild(timerBack);
    group.addChild(timerFill);
    group.addChild(this.createBoxFrame(0, 0, width, height, this.getFramePaletteSwaps(this.menuSkin)));
    group.addChild(scoreText);

    if (type === "buttonMash") {
        prompt = this.createText("MASH SHOWN", 0, 24, 1.5, width);
        this.centerText(prompt, Math.round(width / 2), 1.5);
        group.addChild(prompt);

        directions = ["up", "left", "right", "down"];
        centers = {
            up: { x: 128, y: 54 },
            left: { x: 109, y: 70 },
            right: { x: 147, y: 70 },
            down: { x: 128, y: 86 }
        };

        for (i = 0; i < directions.length; i++) {
            direction = directions[i];
            isActive = direction === "down";
            buttonIcon = this.createCenteredIcon(this.getButtonIconForDirection(direction), centers[direction].x, centers[direction].y, isActive ? 0.33 : 0.27);
            this.applyMonochromeIconColor(buttonIcon, isActive ? color : "#DADADA");
            buttonIcon.alpha = isActive ? 1 : 0.48;
            group.addChild(buttonIcon);
        }

        barBack = new rune.display.Graphic(36, 98, 184, 8);
        barFill = new rune.display.Graphic(36, 98, 116, 8);
        barBack.backgroundColor = "#171717";
        barFill.backgroundColor = color;
        group.addChild(barBack);
        group.addChild(barFill);
    }

    if (type === "sequence") {
        prompt = this.createText("CAST THE SEQUENCE", 0, 24, 1.35, width);
        this.centerText(prompt, Math.round(width / 2), 1.35);
        group.addChild(prompt);

        directions = ["up", "left", "right", "down", "left"];
        directionScale = 0.34;
        buttonScale = 0.28;

        for (i = 0; i < directions.length; i++) {
            direction = directions[i];
            directionIcon = this.createCenteredIcon(this.getMovementIconForDirection(direction), 56 + (i * 36), 61, i === 2 ? 0.38 : directionScale);
            buttonIcon = this.createCenteredIcon(this.getButtonIconForDirection(direction), 56 + (i * 36), 96, i === 2 ? 0.31 : buttonScale);

            if (i < 2) {
                this.applyMonochromeIconColor(directionIcon, "#BBBBBB");
                this.applyMonochromeIconColor(buttonIcon, "#BBBBBB");
                directionIcon.alpha = 0.45;
                buttonIcon.alpha = 0.45;
            } else if (i === 2) {
                this.applyMonochromeIconColor(directionIcon, color);
                this.applyMonochromeIconColor(buttonIcon, color);
            } else {
                this.applyMonochromeIconColor(directionIcon, "#E8E8E8");
                this.applyMonochromeIconColor(buttonIcon, "#E8E8E8");
                directionIcon.alpha = 0.95;
                buttonIcon.alpha = 0.95;
            }

            group.addChild(directionIcon);
            group.addChild(buttonIcon);
        }
    }

    if (type === "aim") {
        prompt = this.createText("HIT THE TARGET", 0, 26, 2, width);
        this.centerText(prompt, Math.round(width / 2), 2);
        group.addChild(prompt);

        target = new rune.display.Graphic(72, 46, 112, 40);
        target.backgroundColor = "#191919";
        group.addChild(target);

        bullseye = this.createOptionalSprite(120, 58, 16, 16, "MG_Ranger_Bullseye_T", color);
        if (bullseye instanceof rune.display.Sprite) {
            this.applyMonochromeIconColor(bullseye, color);
        }
        group.addChild(bullseye);

        centerDot = new rune.display.Graphic(126, 64, 4, 4);
        centerDot.backgroundColor = color;
        group.addChild(centerDot);

        reticle = this.createOptionalSprite(142, 60, 16, 16, "MG_Ranger_Reticle_T", color);
        if (reticle instanceof rune.display.Sprite) {
            this.applyMonochromeIconColor(reticle, color);
        }
        reticle.alpha = 0.95;
        group.addChild(reticle);
    }

    if (type === "timing") {
        prompt = this.createText("TIME THE STRIKE", 0, 26, 2, width);
        this.centerText(prompt, Math.round(width / 2), 2);
        group.addChild(prompt);

        bar = this.createOptionalSprite(30, 58, 196, 20, "MG_Rogue_Bar_Back", "#191919");
        group.addChild(bar);

        hitZone = this.createOptionalSprite(118, 54, 20, 28, "MG_Rogue_HitZone_T", color);
        if (hitZone instanceof rune.display.Sprite) {
            this.applyMonochromeIconColor(hitZone, color);
        }
        group.addChild(hitZone);

        centerLine = new rune.display.Graphic(127, 52, 2, 32);
        centerLine.backgroundColor = color;
        group.addChild(centerLine);

        block = this.createOptionalSprite(92, 56, 14, 24, "MG_Rogue_Timing_Block_T", color);
        if (block instanceof rune.display.Sprite) {
            this.applyMonochromeIconColor(block, color);
        }
        block.alpha = 0.9;
        group.addChild(block);
    }

    parent.addChild(group);
    return group;
};

GraveFallGame.scene.Rule.prototype.createOptionalSprite = function (x, y, width, height, resourceName, fallbackColor) {
    var display;

    if (this.resourceExists && this.resourceExists(resourceName)) {
        display = new rune.display.Sprite(x, y, width, height, resourceName);
    } else {
        display = new rune.display.Graphic(x, y, width, height);
        display.backgroundColor = fallbackColor || "#FFFFFF";
    }

    return display;
};

GraveFallGame.scene.Rule.prototype.createPickupToken = function (parent, x, y, resourceName, color) {
    var token = this.createOptionalSprite(x, y, 16, 16, resourceName, "#6E6E6E");
    if (token instanceof rune.display.Sprite) {
        this.applyMonochromeIconColor(token, color || "#FFFFFF");
    }
    parent.addChild(token);
    return token;
};

GraveFallGame.scene.Rule.prototype.createArenaProjectile = function (parent, x, y, width, height, resourceName, rotation, flippedX, palette) {
    var shot = this.createOptionalSprite(x, y, width, height, resourceName, "#FFFFFF");

    if (shot instanceof rune.display.Sprite) {
        this.applyPaletteSwaps(shot, this.getProjectilePaletteSwaps(palette || GraveFallGame.scene.Game.PROJECTILE_NEUTRAL));
    }

    if (rotation) {
        shot.rotation = rotation;
    }

    if (flippedX === true) {
        shot.flippedX = true;
    }

    parent.addChild(shot);
    return shot;
};

GraveFallGame.scene.Rule.prototype.createColorChip = function (parent, x, y, label, resource, color, description) {
    var chip = new rune.display.DisplayObjectContainer(x, y, 248, 42);
    var bg = new rune.display.Graphic(0, 0, 248, 42);
    var icon = new rune.display.Sprite(6, 5, 100, 100, resource);
    var labelText = this.createText(label, 40, 8, 1.05, 36);
    var descText = this.createText(description, 74, 10, 1.05, 166);

    bg.backgroundColor = this.menuSkin.panelTop;
    icon.scaleX = 0.24;
    icon.scaleY = 0.24;
    this.applyMonochromeIconColor(icon, color);

    chip.addChild(bg);
    chip.addChild(icon);
    chip.addChild(labelText);
    chip.addChild(descText);
    chip.addChild(this.createBoxFrame(0, 0, 248, 42, this.getFramePaletteSwaps(this.menuSkin)));
    parent.addChild(chip);
    this.tintBitmapFieldText(labelText, color, true);
};

GraveFallGame.scene.Rule.prototype.createCenteredIcon = function (resource, centerX, centerY, scale) {
    var size = Math.round(100 * (scale || 0.42));
    var icon = new rune.display.Sprite(Math.round(centerX - (size / 2)), Math.round(centerY - (size / 2)), 100, 100, resource);

    icon.scaleX = scale || 0.42;
    icon.scaleY = scale || 0.42;

    return icon;
};

GraveFallGame.scene.Rule.prototype.getButtonIconForDirection = function (direction) {
    if (direction === "up") {
        return "Y_Button_Icon_T";
    }

    if (direction === "left") {
        return "X_Button_Icon_T";
    }

    if (direction === "right") {
        return "B_Button_Icon_T";
    }

    return "A_Button_Icon_T";
};

GraveFallGame.scene.Rule.prototype.getMovementIconForDirection = function (direction) {
    if (direction === "up") {
        return "Gamepad_Button_Up_T";
    }

    if (direction === "left") {
        return "Gamepad_Button_Left_T";
    }

    if (direction === "right") {
        return "Gamepad_Button_Right_T";
    }

    return "Gamepad_Button_Down_T";
};
