//------------------------------------------------------------------------------
// CHARACTER SELECT SCENE
//------------------------------------------------------------------------------

/**
 * Creates a character selection scene.
 *
 * @constructor
 * @extends rune.scene.Scene
 */
GraveFallGame.scene.CharacterSelect = function () {
    rune.scene.Scene.call(this);

    this.controllers = [
        { id: "P1", controls: { left: "a", right: "d", confirm: "space" }, moveControls: { left: "a", right: "d", up: "w", down: "s" }, themeIndex: 0 },
        { id: "P2", controls: { left: "left", right: "right", confirm: "enter" }, moveControls: { left: "left", right: "right", up: "up", down: "down" }, themeIndex: 1 },
        { id: "P3", controls: { left: "j", right: "l", confirm: "k" }, moveControls: { left: "j", right: "l", up: "i", down: "k" }, themeIndex: 2 },
        { id: "P4", controls: { left: "v", right: "n", confirm: "b" }, moveControls: { left: "f", right: "h", up: "t", down: "g" }, themeIndex: 3 }
    ];

    this.players = [];
    this.countdownTimer = undefined;
    this.classNodes = [];
    this.runPaletteKey = null;
    this.runPalette = null;
    this.selectionSkin = GraveFallGame.scene.Game.UI_SKINS.outsideCampfireBrown || GraveFallGame.scene.Game.UI_SKINS.dullBrown;
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

GraveFallGame.scene.CharacterSelect.prototype = Object.create(rune.scene.Scene.prototype);
GraveFallGame.scene.CharacterSelect.prototype.constructor = GraveFallGame.scene.CharacterSelect;

//------------------------------------------------------------------------------
// Shared helpers from the game scene
//------------------------------------------------------------------------------

GraveFallGame.scene.CharacterSelect.prototype.applyPaletteSwaps = GraveFallGame.scene.Game.prototype.applyPaletteSwaps;
GraveFallGame.scene.CharacterSelect.prototype.getFramePaletteSwaps = GraveFallGame.scene.Game.prototype.getFramePaletteSwaps;
GraveFallGame.scene.CharacterSelect.prototype.getClothingPaletteSwaps = GraveFallGame.scene.Game.prototype.getClothingPaletteSwaps;
GraveFallGame.scene.CharacterSelect.prototype.applyMonochromeIconColor = GraveFallGame.scene.Game.prototype.applyMonochromeIconColor;
GraveFallGame.scene.CharacterSelect.prototype.resourceExists = GraveFallGame.scene.Game.prototype.resourceExists;
GraveFallGame.scene.CharacterSelect.prototype.resolveExistingResource = GraveFallGame.scene.Game.prototype.resolveExistingResource;
GraveFallGame.scene.CharacterSelect.prototype.createFramePiece = GraveFallGame.scene.Game.prototype.createFramePiece;
GraveFallGame.scene.CharacterSelect.prototype.createBoxFrame = GraveFallGame.scene.Game.prototype.createBoxFrame;
GraveFallGame.scene.CharacterSelect.prototype.createSeparator = GraveFallGame.scene.Game.prototype.createSeparator;

//------------------------------------------------------------------------------
// Public prototype methods
//------------------------------------------------------------------------------

GraveFallGame.scene.CharacterSelect.prototype.init = function () {
    rune.scene.Scene.prototype.init.call(this);

    var screenWidth = this.application.screen.width;
    var screenHeight = this.application.screen.height;
    var i;
    var templates;
    var cardWidth;
    var cardHeight;
    var cardGap;
    var totalWidth;
    var startX;
    var cardY;

    // Character select still has no music. This is also where a new run locks in
    // its palette so the campfire and dungeon stay consistent for that run.
    this.runPalette = GraveFallGame.scene.Game.startNewRunPalette();
    this.runPaletteKey = this.runPalette.key;
    this.selectionSkin = this.runPalette.outside;

    this.background = new rune.display.Sprite(0, 0, screenWidth, screenHeight, "Outside_Campfire");
    this.applyPaletteSwaps(this.background, this.getFramePaletteSwaps(this.selectionSkin));
    this.stage.addChild(this.background);

    this.titleText = new rune.text.BitmapField("SELECT CHARACTER");
    this.titleText.width = 800;
    this.titleText.scaleX = 3;
    this.titleText.scaleY = 3;
    this.titleText.y = 36;
    this.centerText(this.titleText, screenWidth / 2, 3);
    this.stage.addChild(this.titleText);

    this.instructionText = new rune.text.BitmapField("");
    this.instructionText.width = 1200;
    this.instructionText.scaleX = 2;
    this.instructionText.scaleY = 2;
    this.instructionText.y = 92;
    this.stage.addChild(this.instructionText);

    this.classNodes = [];
    templates = GraveFallGame.scene.Game.CLASS_TEMPLATES;
    cardWidth = 284;
    cardHeight = 384;
    cardGap = 24;
    totalWidth = (templates.length * cardWidth) + ((templates.length - 1) * cardGap);
    startX = Math.round((screenWidth - totalWidth) / 2);
    cardY = 150;

    for (i = 0; i < templates.length; i++) {
        this.createClassCard(templates[i], startX + (i * (cardWidth + cardGap)), cardY, cardWidth, cardHeight);
    }

    this.updateInstructionText(false, false);
};

GraveFallGame.scene.CharacterSelect.prototype.update = function (step) {
    rune.scene.Scene.prototype.update.call(this, step);

    var allJoinedConfirmed = true;
    var anyJoined = this.players.length > 0;
    var c;
    var p;
    var ctrl;
    var player;
    var alreadyJoined;
    var nextLeft;
    var nextRight;
    var node;
    var secs;

    for (c = 0; c < this.controllers.length; c++) {
        ctrl = this.controllers[c];
        alreadyJoined = false;

        for (p = 0; p < this.players.length; p++) {
            if (this.players[p].controller.id === ctrl.id) {
                alreadyJoined = true;
                break;
            }
        }

        if (!alreadyJoined && this.keyboard.justPressed(ctrl.controls.confirm)) {
            this.joinPlayer(ctrl);
            GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_CONFIRM, 0.6);
        }
    }

    for (p = 0; p < this.players.length; p++) {
        player = this.players[p];
        ctrl = player.controller;

        if (player.joinDelay > 0) {
            player.joinDelay--;
        }

        if (!player.confirmed) {
            allJoinedConfirmed = false;

            if (this.keyboard.justPressed(ctrl.controls.left)) {
                nextLeft = this.findAvailableClassIndex(player.classIndex - 1, -1, player);

                if (nextLeft !== player.classIndex) {
                    this.releasePlayerSelection(player);
                    this.claimPlayerSelection(player, nextLeft);
                    this.updatePlayerCursor(player);
                    GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_MOVE, 0.4);
                } else {
                    GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_BACK, 0.4);
                }
            }

            if (this.keyboard.justPressed(ctrl.controls.right)) {
                nextRight = this.findAvailableClassIndex(player.classIndex + 1, 1, player);

                if (nextRight !== player.classIndex) {
                    this.releasePlayerSelection(player);
                    this.claimPlayerSelection(player, nextRight);
                    this.updatePlayerCursor(player);
                    GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_MOVE, 0.4);
                } else {
                    GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_BACK, 0.4);
                }
            }

            if (this.keyboard.justPressed(ctrl.controls.confirm) && player.joinDelay <= 0) {
                node = this.classNodes[player.classIndex];

                if (node && (!node.lockedBy || node.lockedBy === player)) {
                    player.confirmed = true;
                    node.lockedBy = player;
                    this.updatePlayerCursor(player);
                    GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_CONFIRM, 0.6);
                } else {
                    GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_BACK, 0.4);
                }
            }
        }
    }

    if (anyJoined && allJoinedConfirmed) {
        if (this.players.length === 4) {
            this.countdownTimer = 0;
        } else if (this.countdownTimer === undefined) {
            this.countdownTimer = 10000;
        }

        this.countdownTimer -= step;
        secs = Math.max(0, Math.ceil(this.countdownTimer / 1000));
        this.instructionText.text = "ENTERING DUNGEON IN " + secs;
        this.centerText(this.instructionText, this.application.screen.width / 2, 2);

        if (this.countdownTimer <= 0) {
            this.startGame();
        }
    } else {
        this.countdownTimer = undefined;
        this.updateInstructionText(anyJoined, allJoinedConfirmed);
    }

    if (this.keyboard.justPressed("escape")) {
        this.application.scenes.load([new GraveFallGame.scene.Menu()]);
    }
};

GraveFallGame.scene.CharacterSelect.prototype.dispose = function () {
    rune.scene.Scene.prototype.dispose.call(this);
};

//------------------------------------------------------------------------------
// Character card visuals
//------------------------------------------------------------------------------

GraveFallGame.scene.CharacterSelect.prototype.centerText = function (field, centerX, scale) {
    if (!field) {
        return;
    }

    field.x = Math.round(centerX - ((field.text.length * 6 * scale) / 2));
};

GraveFallGame.scene.CharacterSelect.prototype.getNeutralCharacterTheme = function () {
    return {
        accent: this.selectionSkin.frame.mid,
        accentDark: this.selectionSkin.frame.dark,
        accentLight: this.selectionSkin.frame.light,
        clothing: {
            light: this.selectionSkin.frame.light,
            mid: this.selectionSkin.frame.mid,
            dark: this.selectionSkin.frame.dark
        }
    };
};

GraveFallGame.scene.CharacterSelect.prototype.createClassCard = function (template, x, y, width, height) {
    var framePaletteSwaps = this.getFramePaletteSwaps(this.selectionSkin);
    var topPanelHeight = 82;
    var footerHeight = 72;
    var panelTop;
    var panelBody;
    var frame;
    var separatorTop;
    var separatorBottom;
    var menuAccent;
    var actionAccent;
    var healthBg;
    var healthFill;
    var nameText;
    var hpText;
    var minigameText;
    var node;

    panelTop = new rune.display.Graphic(x, y, width, topPanelHeight);
    panelTop.backgroundColor = this.selectionSkin.panelTop;
    panelTop.alpha = 0.86;
    this.stage.addChild(panelTop);

    panelBody = new rune.display.Graphic(x, y + topPanelHeight, width, height - topPanelHeight);
    panelBody.backgroundColor = this.selectionSkin.panelBottom;
    panelBody.alpha = 0.82;
    this.stage.addChild(panelBody);

    menuAccent = new rune.display.Graphic(x, y, width, 4);
    menuAccent.backgroundColor = this.selectionSkin.frame.mid;
    this.stage.addChild(menuAccent);

    actionAccent = new rune.display.Graphic(x, y + height - footerHeight, width, 2);
    actionAccent.backgroundColor = this.selectionSkin.frame.dark;
    this.stage.addChild(actionAccent);

    separatorTop = this.createSeparator(x, y + topPanelHeight - 4, width, framePaletteSwaps);
    this.stage.addChild(separatorTop);

    separatorBottom = this.createSeparator(x, y + height - footerHeight - 4, width, framePaletteSwaps);
    this.stage.addChild(separatorBottom);

    frame = this.createBoxFrame(x, y, width, height, framePaletteSwaps);
    this.stage.addChild(frame);

    nameText = new rune.text.BitmapField(template.name.toUpperCase());
    nameText.width = 200;
    nameText.scaleX = 1.65;
    nameText.scaleY = 1.65;
    nameText.y = y + 16;
    this.centerText(nameText, x + (width / 2) + 20, 1.65);
    this.stage.addChild(nameText);

    hpText = new rune.text.BitmapField("HP " + template.hpMax);
    hpText.width = 160;
    hpText.scaleX = 1.35;
    hpText.scaleY = 1.35;
    hpText.x = x + 110;
    hpText.y = y + 50;
    this.stage.addChild(hpText);

    healthBg = new rune.display.Graphic(x + 164, y + 55, 86, 10);
    healthBg.backgroundColor = "#101010";
    this.stage.addChild(healthBg);

    healthFill = new rune.display.Graphic(x + 166, y + 57, 82, 6);
    healthFill.backgroundColor = this.selectionSkin.frame.mid;
    this.stage.addChild(healthFill);

    minigameText = new rune.text.BitmapField(this.getMinigameLabel(template.attackMinigame));
    minigameText.width = width - 32;
    minigameText.scaleX = 1.2;
    minigameText.scaleY = 1.2;
    minigameText.y = y + height - footerHeight - 28;
    this.centerText(minigameText, x + (width / 2), 1.2);
    this.stage.addChild(minigameText);

    node = {
        cardX: x,
        cardY: y,
        cardWidth: width,
        cardHeight: height,
        centerX: x + (width / 2),
        portraitX: x + 16,
        portraitY: y + 13,
        portraitScale: 0.62,
        iconX: x + width - 78,
        iconY: y + 13,
        iconScale: 0.48,
        spriteX: x + Math.round((width - (100 * 1.55)) / 2),
        spriteY: y + 116,
        statusY: y + height - 36,
        width: 150,
        standScale: 1.55,
        actionIconY: y + height - 58,
        template: template,
        panelTop: panelTop,
        panelBody: panelBody,
        menuAccent: menuAccent,
        actionAccent: actionAccent,
        healthFill: healthFill,
        portrait: null,
        sprite: null,
        icon: null,
        actionIcons: [],
        lockedBy: null
    };

    this.classNodes.push(node);
    this.restoreClassNodeVisual(node);
};

GraveFallGame.scene.CharacterSelect.prototype.getMinigameLabel = function (attackMinigame) {
    switch (attackMinigame) {
        case "buttonMash":
            return "MASH ATTACK";
        case "timingBar":
            return "TIMING ATTACK";
        case "targetReticle":
            return "AIM ATTACK";
        case "buttonSequence":
            return "RUNE SEQUENCE";
    }

    return "ATTACK READY";
};

GraveFallGame.scene.CharacterSelect.prototype.createClassNodePortrait = function (node, theme) {
    var portrait;
    var paletteTheme = theme || this.getNeutralCharacterTheme();

    if (!node || !node.template || !node.template.portrait) {
        return null;
    }

    portrait = new rune.display.Sprite(node.portraitX, node.portraitY, 100, 100, node.template.portrait);
    portrait.scaleX = node.portraitScale;
    portrait.scaleY = node.portraitScale;
    this.applyPaletteSwaps(portrait, this.getClothingPaletteSwaps(paletteTheme));

    return portrait;
};

GraveFallGame.scene.CharacterSelect.prototype.createClassNodeIcon = function (node, theme) {
    var icon;
    var resource;
    var tintTheme = theme || this.getNeutralCharacterTheme();

    resource = node && node.template ? node.template.classIcon : null;
    if (!resource) {
        return null;
    }

    icon = new rune.display.Sprite(node.iconX, node.iconY, 100, 100, resource);
    icon.scaleX = node.iconScale;
    icon.scaleY = node.iconScale;
    this.applyMonochromeIconColor(icon, tintTheme.accentLight);

    return icon;
};

GraveFallGame.scene.CharacterSelect.prototype.createClassNodeSprite = function (node, theme) {
    var sprite;
    var resource;
    var paletteTheme = theme || this.getNeutralCharacterTheme();

    resource = node && node.template && node.template.stand ? node.template.stand : null;
    if (!resource) {
        return null;
    }

    sprite = new rune.display.Sprite(node.spriteX, node.spriteY, 100, 100, resource);
    sprite.scaleX = node.standScale;
    sprite.scaleY = node.standScale;

    if (node.template.flipStandX) {
        sprite.flippedX = true;
    }

    this.applyPaletteSwaps(sprite, this.getClothingPaletteSwaps(paletteTheme));

    return sprite;
};

GraveFallGame.scene.CharacterSelect.prototype.createClassNodeActionIcons = function (node, theme) {
    var resources = ["Fight_Icon_T", "Defend_Icon_T", "Buff_Icon_T", "Item_Icon_T"];
    var icons = [];
    var tintTheme = theme || this.getNeutralCharacterTheme();
    var gap = 65;
    var startX = node.cardX + Math.round((node.cardWidth - ((resources.length - 1) * gap) - 48) / 2);
    var i;
    var icon;

    for (i = 0; i < resources.length; i++) {
        icon = new rune.display.Sprite(startX + (i * gap), node.actionIconY, 100, 100, resources[i]);
        icon.scaleX = 0.48;
        icon.scaleY = 0.48;
        this.applyMonochromeIconColor(icon, tintTheme.accentLight);
        icons.push(icon);
    }

    return icons;
};

GraveFallGame.scene.CharacterSelect.prototype.removeNodeDynamicVisuals = function (node) {
    var i;

    if (!node) {
        return;
    }

    if (node.portrait && node.portrait.parent) {
        node.portrait.parent.removeChild(node.portrait, true);
    }

    if (node.icon && node.icon.parent) {
        node.icon.parent.removeChild(node.icon, true);
    }

    if (node.sprite && node.sprite.parent) {
        node.sprite.parent.removeChild(node.sprite, true);
    }

    if (node.actionIcons) {
        for (i = 0; i < node.actionIcons.length; i++) {
            if (node.actionIcons[i] && node.actionIcons[i].parent) {
                node.actionIcons[i].parent.removeChild(node.actionIcons[i], true);
            }
        }
    }

    node.portrait = null;
    node.icon = null;
    node.sprite = null;
    node.actionIcons = [];
};

GraveFallGame.scene.CharacterSelect.prototype.applyClassNodeChrome = function (node, theme) {
    var tintTheme = theme || this.getNeutralCharacterTheme();

    if (node.panelTop) {
        node.panelTop.backgroundColor = this.selectionSkin.panelTop;
        node.panelTop.alpha = theme ? 0.94 : 0.86;
    }

    if (node.panelBody) {
        node.panelBody.backgroundColor = this.selectionSkin.panelBottom;
        node.panelBody.alpha = theme ? 0.90 : 0.82;
    }

    if (node.menuAccent) {
        node.menuAccent.backgroundColor = tintTheme.accent;
    }

    if (node.actionAccent) {
        node.actionAccent.backgroundColor = tintTheme.accentDark;
    }

    if (node.healthFill) {
        node.healthFill.backgroundColor = tintTheme.accent;
    }
};

GraveFallGame.scene.CharacterSelect.prototype.setClassNodeVisual = function (node, theme, lockedBy) {
    var icon;
    var sprite;
    var portrait;
    var actionIcons;
    var i;

    if (!node) {
        return;
    }

    this.removeNodeDynamicVisuals(node);
    this.applyClassNodeChrome(node, theme);

    portrait = this.createClassNodePortrait(node, theme);
    icon = this.createClassNodeIcon(node, theme);
    sprite = this.createClassNodeSprite(node, theme);
    actionIcons = this.createClassNodeActionIcons(node, theme);

    if (portrait) {
        this.stage.addChild(portrait);
    }

    if (icon) {
        this.stage.addChild(icon);
    }

    if (sprite) {
        this.stage.addChild(sprite);
    }

    for (i = 0; i < actionIcons.length; i++) {
        this.stage.addChild(actionIcons[i]);
    }

    node.portrait = portrait;
    node.icon = icon;
    node.sprite = sprite;
    node.actionIcons = actionIcons;
    node.lockedBy = lockedBy || null;
};

GraveFallGame.scene.CharacterSelect.prototype.restoreClassNodeVisual = function (node) {
    if (!node) {
        return;
    }

    this.setClassNodeVisual(node, null, null);
};

//------------------------------------------------------------------------------
// Selection logic
//------------------------------------------------------------------------------

GraveFallGame.scene.CharacterSelect.prototype.findAvailableClassIndex = function (startIndex, step, player) {
    var total;
    var i;
    var idx;
    var node;

    if (!this.classNodes || this.classNodes.length === 0) {
        return 0;
    }

    total = this.classNodes.length;
    step = step || 1;

    for (i = 0; i < total; i++) {
        idx = startIndex + (i * step);

        while (idx < 0) {
            idx += total;
        }

        idx = idx % total;
        node = this.classNodes[idx];

        if (!node.lockedBy || node.lockedBy === player) {
            return idx;
        }
    }

    return startIndex;
};

GraveFallGame.scene.CharacterSelect.prototype.releasePlayerSelection = function (player) {
    var node;

    if (!player || typeof player.hoveredClassIndex !== "number" || player.hoveredClassIndex < 0) {
        return;
    }

    node = this.classNodes[player.hoveredClassIndex];

    if (node && node.lockedBy === player && player.confirmed !== true) {
        this.restoreClassNodeVisual(node);
    }

    player.hoveredClassIndex = -1;
};

GraveFallGame.scene.CharacterSelect.prototype.claimPlayerSelection = function (player, classIndex) {
    var node;
    var theme;

    if (!player || !this.classNodes || this.classNodes.length === 0) {
        return false;
    }

    node = this.classNodes[classIndex];

    if (!node) {
        return false;
    }

    if (node.lockedBy && node.lockedBy !== player) {
        return false;
    }

    theme = GraveFallGame.scene.Game.PLAYER_THEMES[player.controller.themeIndex];

    this.setClassNodeVisual(node, theme, player);
    player.classIndex = classIndex;
    player.hoveredClassIndex = classIndex;

    return true;
};

GraveFallGame.scene.CharacterSelect.prototype.joinPlayer = function (ctrl) {
    var player;
    var status;

    player = {
        controller: ctrl,
        classIndex: 0,
        confirmed: false,
        joinDelay: 2,
        hoveredClassIndex: -1
    };

    this.players.push(player);

    player.classIndex = this.findAvailableClassIndex(0, 1, player);
    this.claimPlayerSelection(player, player.classIndex);

    status = new rune.text.BitmapField(ctrl.id);
    status.width = 150;
    status.scaleX = 1.5;
    status.scaleY = 1.5;
    this.stage.addChild(status);
    player.statusText = status;

    this.updatePlayerCursor(player);
};

GraveFallGame.scene.CharacterSelect.prototype.updatePlayerCursor = function (player) {
    var node = this.classNodes[player.classIndex];
    var theme = GraveFallGame.scene.Game.PLAYER_THEMES[player.controller.themeIndex];

    if (!node) {
        return;
    }

    if (node.lockedBy !== player) {
        this.claimPlayerSelection(player, player.classIndex);
    } else {
        this.setClassNodeVisual(node, theme, player);
    }

    player.statusText.text = player.confirmed ? "READY" : player.controller.id;
    this.positionStatusText(player, node);
};

GraveFallGame.scene.CharacterSelect.prototype.positionStatusText = function (player, node) {
    if (!player || !player.statusText || !node) {
        return;
    }

    player.statusText.x = Math.round(node.centerX - ((player.statusText.text.length * 6 * 1.5) / 2));
    player.statusText.y = node.statusY;

    if (player.statusText.parent === this.stage && typeof this.stage.removeChild === "function") {
        this.stage.removeChild(player.statusText, false);
    }

    this.stage.addChild(player.statusText);
};

GraveFallGame.scene.CharacterSelect.prototype.updateInstructionText = function (anyJoined, allJoinedConfirmed) {
    if (anyJoined && allJoinedConfirmed) {
        return;
    }

    if (anyJoined) {
        this.instructionText.text = "SELECT YOUR CHARACTER";
    } else {
        this.instructionText.text = "PRESS [SPACE], [ENTER], [K], or [B] TO JOIN";
    }

    this.centerText(this.instructionText, this.application.screen.width / 2, 2);
};

GraveFallGame.scene.CharacterSelect.prototype.startGame = function () {
    var activeParty = [];
    var numPlayers;
    var menuWidth;
    var startX;
    var i;
    var p;
    var tmpl;
    var member;

    for (i = 0; i < this.players.length; i++) {
        p = this.players[i];
        tmpl = this.classNodes[p.classIndex].template;

        member = {
            id: tmpl.id + "_" + i,
            name: tmpl.name,
            portrait: tmpl.portrait,
            classIcon: tmpl.classIcon,
            stand: tmpl.stand,
            hpCurrent: tmpl.hpMax,
            hpMax: tmpl.hpMax,
            themeIndex: p.controller.themeIndex,
            attackMinigame: tmpl.attackMinigame,
            controls: p.controller.controls,
            moveControls: p.controller.moveControls,
            flipStandX: false,
            attackDamage: tmpl.attackDamage,
            runPaletteKey: this.runPaletteKey,
            y: 592
        };

        activeParty.push(member);
    }

    numPlayers = activeParty.length;
    menuWidth = 320;
    startX = 0;

    if (numPlayers === 1 || numPlayers === 2) {
        startX = (this.application.screen.width / 2) - ((menuWidth * numPlayers) / 2);
    }

    for (i = 0; i < numPlayers; i++) {
        activeParty[i].x = startX + (i * menuWidth);
        activeParty[i].partyRenderIndex = i;
        activeParty[i].partySize = numPlayers;
        activeParty[i].flipStandX = GraveFallGame.scene.Game.getPartyMemberFlippedX(i, numPlayers);
    }

    GraveFallGame.scene.Game.PARTY_MEMBERS = activeParty;
    this.application.scenes.load([new GraveFallGame.scene.Game(activeParty, this.runPaletteKey)]);
};
