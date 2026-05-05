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
    this.selectionSkin = GraveFallGame.scene.Game.UI_SKINS.outsideCampfireDark || GraveFallGame.scene.Game.UI_SKINS.dullBrown;
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

    // This scene intentionally does not start any music yet.
    this.selectionSkin = GraveFallGame.scene.Game.UI_SKINS.outsideCampfireDark || GraveFallGame.scene.Game.UI_SKINS.dullBrown;

    this.background = new rune.display.Sprite(0, 0, screenWidth, screenHeight, "Outside_Campfire");
    this.applyPaletteSwaps(this.background, this.getFramePaletteSwaps(this.selectionSkin));
    this.stage.addChild(this.background);

    this.titleText = new rune.text.BitmapField("SELECT CHARACTER");
    this.titleText.width = 800;
    this.titleText.scaleX = 3;
    this.titleText.scaleY = 3;
    this.titleText.y = 42;
    this.centerText(this.titleText, screenWidth / 2, 3);
    this.stage.addChild(this.titleText);

    this.instructionText = new rune.text.BitmapField("");
    this.instructionText.width = 1200;
    this.instructionText.scaleX = 2;
    this.instructionText.scaleY = 2;
    this.instructionText.y = 100;
    this.stage.addChild(this.instructionText);

    this.classNodes = [];
    templates = GraveFallGame.scene.Game.CLASS_TEMPLATES;
    cardWidth = 232;
    cardHeight = 348;
    cardGap = 48;
    totalWidth = (templates.length * cardWidth) + ((templates.length - 1) * cardGap);
    startX = Math.round((screenWidth - totalWidth) / 2);
    cardY = 178;

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
        this.instructionText.text = "STARTING BATTLE IN " + secs;
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

GraveFallGame.scene.CharacterSelect.prototype.createClassCard = function (template, x, y, width, height) {
    var framePaletteSwaps = this.getFramePaletteSwaps(this.selectionSkin);
    var panel;
    var frame;
    var portrait;
    var nameText;
    var node;

    panel = new rune.display.Graphic(x, y, width, height);
    panel.backgroundColor = this.selectionSkin.panelBottom;
    panel.alpha = 0.74;
    this.stage.addChild(panel);

    frame = this.createBoxFrame(x, y, width, height, framePaletteSwaps);
    this.stage.addChild(frame);

    portrait = new rune.display.Sprite(x + 18, y + 18, 100, 100, template.portrait);
    portrait.scaleX = 0.78;
    portrait.scaleY = 0.78;
    this.applyPaletteSwaps(portrait, this.getClothingPaletteSwaps({
        clothing: GraveFallGame.scene.Game.PLAYER_DOWNED_PALETTE
    }));
    this.stage.addChild(portrait);

    nameText = new rune.text.BitmapField(template.name.toUpperCase());
    nameText.width = 180;
    nameText.scaleX = 1.6;
    nameText.scaleY = 1.6;
    nameText.y = y + 44;
    this.centerText(nameText, x + 148, 1.6);
    this.stage.addChild(nameText);

    node = {
        cardX: x,
        cardY: y,
        cardWidth: width,
        cardHeight: height,
        centerX: x + (width / 2),
        spriteX: x + 66,
        spriteY: y + 140,
        statusY: y + height - 42,
        width: 150,
        standScale: 1.62,
        template: template,
        sprite: null,
        icon: null,
        lockedBy: null
    };

    this.classNodes.push(node);
    this.restoreClassNodeVisual(node);
};

GraveFallGame.scene.CharacterSelect.prototype.createClassNodeIcon = function (node, theme) {
    var icon;
    var resource;
    var tint;

    resource = node && node.template ? node.template.classIcon : null;
    if (!resource) {
        return null;
    }

    icon = new rune.display.Sprite(node.cardX + node.cardWidth - 88, node.cardY + 22, 100, 100, resource);
    icon.scaleX = 0.56;
    icon.scaleY = 0.56;

    tint = theme ? theme.accentLight : this.selectionSkin.frame.light;
    this.applyMonochromeIconColor(icon, tint);

    return icon;
};

GraveFallGame.scene.CharacterSelect.prototype.createClassNodeSprite = function (node, theme) {
    var sprite;
    var resource;
    var paletteSwaps;

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

    paletteSwaps = theme ? this.getClothingPaletteSwaps(theme) : this.getClothingPaletteSwaps({
        clothing: GraveFallGame.scene.Game.PLAYER_DOWNED_PALETTE
    });

    this.applyPaletteSwaps(sprite, paletteSwaps);

    return sprite;
};

GraveFallGame.scene.CharacterSelect.prototype.setClassNodeVisual = function (node, theme, lockedBy) {
    var icon;
    var sprite;

    if (!node) {
        return;
    }

    icon = this.createClassNodeIcon(node, theme);
    sprite = this.createClassNodeSprite(node, theme);

    if (node.icon && node.icon.parent) {
        node.icon.parent.removeChild(node.icon, true);
    }

    if (node.sprite && node.sprite.parent) {
        node.sprite.parent.removeChild(node.sprite, true);
    }

    if (icon) {
        this.stage.addChild(icon);
    }

    if (sprite) {
        this.stage.addChild(sprite);
    }

    node.icon = icon;
    node.sprite = sprite;
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
    this.application.scenes.load([new GraveFallGame.scene.Game(activeParty)]);
};
