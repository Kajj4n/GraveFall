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
        { id: "P1", label: "PLAYER 1", controls: { left: "a", right: "d", confirm: "space" }, moveControls: { left: "a", right: "d", up: "w", down: "s" }, themeIndex: 0 },
        { id: "P2", label: "PLAYER 2", controls: { left: "left", right: "right", confirm: "enter" }, moveControls: { left: "left", right: "right", up: "up", down: "down" }, themeIndex: 1 },
        { id: "P3", label: "PLAYER 3", controls: { left: "j", right: "l", confirm: "k" }, moveControls: { left: "j", right: "l", up: "i", down: "k" }, themeIndex: 2 },
        { id: "P4", label: "PLAYER 4", controls: { left: "v", right: "n", confirm: "b" }, moveControls: { left: "f", right: "h", up: "t", down: "g" }, themeIndex: 3 }
    ];

    this.players = [];
    this.countdownTimer = undefined;
    this.classNodes = [];
    this.runPaletteKey = null;
    this.runPalette = null;
    this.backgroundSkin = GraveFallGame.scene.Game.UI_SKINS.outsideCampfireBrown || GraveFallGame.scene.Game.UI_SKINS.dullBrown;
    this.selectionSkin = GraveFallGame.scene.Game.UI_SKINS.dullBrown;
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
GraveFallGame.scene.CharacterSelect.prototype.createDamageStateGroup = GraveFallGame.scene.Game.prototype.createDamageStateGroup;
GraveFallGame.scene.CharacterSelect.prototype.setDamageStateGroupState = GraveFallGame.scene.Game.prototype.setDamageStateGroupState;
GraveFallGame.scene.CharacterSelect.prototype.setDamageStateGroupFlippedX = GraveFallGame.scene.Game.prototype.setDamageStateGroupFlippedX;
GraveFallGame.scene.CharacterSelect.prototype.applyPaletteSwapsToDamageStateGroup = GraveFallGame.scene.Game.prototype.applyPaletteSwapsToDamageStateGroup;
GraveFallGame.scene.CharacterSelect.prototype.getPlayerStandDamageStates = GraveFallGame.scene.Game.prototype.getPlayerStandDamageStates;
GraveFallGame.scene.CharacterSelect.prototype.getPortraitDamageStates = GraveFallGame.scene.Game.prototype.getPortraitDamageStates;

//------------------------------------------------------------------------------
// Public prototype methods
//------------------------------------------------------------------------------

GraveFallGame.scene.CharacterSelect.prototype.init = function () {
    rune.scene.Scene.prototype.init.call(this);

    var screenWidth = this.application.screen.width;
    var screenHeight = this.application.screen.height;
    var templates;
    var menuWidth;
    var menuHeight;
    var startX;
    var menuY;
    var i;

    // Character select has no music. A new run locks its random palette here so
    // the outside campfire and dungeon keep the same palette until that run ends.
    this.runPalette = GraveFallGame.scene.Game.startNewRunPalette();
    this.runPaletteKey = this.runPalette.key;
    this.backgroundSkin = this.runPalette.outside;
    this.selectionSkin = this.runPalette.inside;

    this.background = new rune.display.Sprite(0, 0, screenWidth, screenHeight, "Outside_Campfire");
    this.applyPaletteSwaps(this.background, this.getFramePaletteSwaps(this.backgroundSkin));
    this.stage.addChild(this.background);

    this.titleText = new rune.text.BitmapField("SELECT CHARACTER");
    this.titleText.width = 800;
    this.titleText.scaleX = 3;
    this.titleText.scaleY = 3;
    this.titleText.y = 34;
    this.centerText(this.titleText, screenWidth / 2, 3);
    this.stage.addChild(this.titleText);

    this.instructionText = new rune.text.BitmapField("");
    this.instructionText.width = 1200;
    this.instructionText.scaleX = 2;
    this.instructionText.scaleY = 2;
    this.instructionText.y = 88;
    this.stage.addChild(this.instructionText);

    this.classNodes = [];
    templates = GraveFallGame.scene.Game.CLASS_TEMPLATES;
    menuWidth = 320;
    menuHeight = 70;
    startX = Math.round((screenWidth - (templates.length * menuWidth)) / 2);
    menuY = screenHeight - menuHeight;

    for (i = 0; i < templates.length; i++) {
        this.createClassCard(templates[i], startX + (i * menuWidth), menuY, menuWidth, menuHeight, i);
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
// Character select visuals
//------------------------------------------------------------------------------

GraveFallGame.scene.CharacterSelect.prototype.centerText = function (field, centerX, scale) {
    if (!field) {
        return;
    }

    field.x = Math.round(centerX - ((field.text.length * 6 * scale) / 2));
};

GraveFallGame.scene.CharacterSelect.prototype.getDownedCharacterTheme = function () {
    return {
        accent: GraveFallGame.scene.Game.PLAYER_DOWNED_PALETTE.mid,
        accentDark: GraveFallGame.scene.Game.PLAYER_DOWNED_PALETTE.dark,
        accentLight: GraveFallGame.scene.Game.PLAYER_DOWNED_PALETTE.light,
        clothing: {
            light: GraveFallGame.scene.Game.PLAYER_DOWNED_PALETTE.light,
            mid: GraveFallGame.scene.Game.PLAYER_DOWNED_PALETTE.mid,
            dark: GraveFallGame.scene.Game.PLAYER_DOWNED_PALETTE.dark
        }
    };
};

GraveFallGame.scene.CharacterSelect.prototype.createClassCard = function (template, x, y, width, height, index) {
    var framePaletteSwaps = this.getFramePaletteSwaps(this.selectionSkin);
    var panel;
    var menuAccent;
    var frame;
    var nameText;
    var hpLabelText;
    var hpValueText;
    var statusText;
    var node;
    var spriteScale = 2.05;
    var textScale = 1.55;
    var nameY = 12;
    var hpY = 36;

    panel = new rune.display.DisplayObjectContainer(x, y, width, height);
    panel.backgroundColor = this.selectionSkin.panelTop;
    this.stage.addChild(panel);

    menuAccent = new rune.display.Graphic(0, 0, width, 4);
    menuAccent.backgroundColor = this.selectionSkin.frame.mid;
    panel.addChild(menuAccent);

    nameText = new rune.text.BitmapField(template.name.toUpperCase());
    nameText.width = 92;
    nameText.scaleX = textScale;
    nameText.scaleY = textScale;
    nameText.x = 102;
    nameText.y = nameY;
    panel.addChild(nameText);

    hpLabelText = new rune.text.BitmapField("HP");
    hpLabelText.width = 30;
    hpLabelText.scaleX = textScale;
    hpLabelText.scaleY = textScale;
    hpLabelText.x = 102;
    hpLabelText.y = hpY;
    panel.addChild(hpLabelText);

    hpValueText = new rune.text.BitmapField(String(template.hpMax));
    hpValueText.width = 54;
    hpValueText.scaleX = textScale;
    hpValueText.scaleY = textScale;
    hpValueText.x = 132;
    hpValueText.y = hpY;
    panel.addChild(hpValueText);

    statusText = new rune.text.BitmapField("");
    statusText.width = 108;
    statusText.scaleX = textScale;
    statusText.scaleY = textScale;
    statusText.x = 202;
    statusText.y = nameY;
    statusText.visible = false;
    panel.addChild(statusText);

    frame = this.createBoxFrame(0, 0, width, height, framePaletteSwaps);
    panel.addChild(frame);

    node = {
        cardX: x,
        cardY: y,
        cardWidth: width,
        cardHeight: height,
        centerX: x + (width / 2),
        portraitX: 10,
        portraitY: 3,
        portraitSize: 74,
        iconX: 55,
        iconY: 30,
        spriteX: Math.round(x + (width / 2) - ((100 * spriteScale) / 2)),
        spriteY: y - 196,
        spriteScale: spriteScale,
        template: template,
        panel: panel,
        menuAccent: menuAccent,
        frame: frame,
        statusText: statusText,
        statusBaseX: 202,
        statusY: nameY,
        statusScale: textScale,
        portrait: null,
        sprite: null,
        icon: null,
        lockedBy: null,
        index: index || 0
    };

    this.classNodes.push(node);
    this.restoreClassNodeVisual(node);
};

GraveFallGame.scene.CharacterSelect.prototype.createClassNodePortrait = function (node, theme, downed) {
    var portrait;
    var paletteTheme = theme || this.getDownedCharacterTheme();
    var swaps = this.getClothingPaletteSwaps(paletteTheme);

    if (!node || !node.template || !node.template.portrait) {
        return null;
    }

    portrait = this.createDamageStateGroup(node.portraitX, node.portraitY, node.portraitSize || 74, node.portraitSize || 74, this.getPortraitDamageStates(node.template.portrait));
    this.applyPaletteSwapsToDamageStateGroup(portrait, swaps, swaps);
    this.setDamageStateGroupState(portrait, downed === true ? "dead" : "hp100");

    return portrait;
};

GraveFallGame.scene.CharacterSelect.prototype.createClassNodeIcon = function (node, theme) {
    var icon;
    var resource;
    var tintTheme = theme || this.getDownedCharacterTheme();

    resource = node && node.template ? node.template.classIcon : null;
    if (!resource) {
        return null;
    }

    icon = new rune.display.Sprite(node.iconX, node.iconY, 100, 100, resource);
    icon.scaleX = 0.35;
    icon.scaleY = 0.35;
    this.applyMonochromeIconColor(icon, tintTheme.accent);

    return icon;
};

GraveFallGame.scene.CharacterSelect.prototype.createClassNodeSprite = function (node, theme, downed) {
    var sprite;
    var paletteTheme = theme || this.getDownedCharacterTheme();
    var swaps = this.getClothingPaletteSwaps(paletteTheme);
    var flipped;

    if (!node || !node.template || !node.template.stand) {
        return null;
    }

    flipped = node.template.flipStandX === true;
    sprite = this.createDamageStateGroup(
        node.spriteX,
        node.spriteY,
        100,
        100,
        this.getPlayerStandDamageStates(node.template.stand),
        { flippedX: flipped }
    );
    sprite.scaleX = node.spriteScale;
    sprite.scaleY = node.spriteScale;
    this.setDamageStateGroupFlippedX(sprite, flipped);
    this.applyPaletteSwapsToDamageStateGroup(sprite, swaps, swaps);
    this.setDamageStateGroupState(sprite, downed === true ? "dead" : "hp100");

    return sprite;
};

GraveFallGame.scene.CharacterSelect.prototype.removeNodeDynamicVisuals = function (node) {
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

    node.portrait = null;
    node.icon = null;
    node.sprite = null;
};

GraveFallGame.scene.CharacterSelect.prototype.applyClassNodeChrome = function (node, theme) {
    var tintTheme = theme || this.getDownedCharacterTheme();

    if (node.panel) {
        node.panel.backgroundColor = this.selectionSkin.panelTop;
        node.panel.alpha = theme ? 0.97 : 0.88;
    }

    if (node.menuAccent) {
        node.menuAccent.backgroundColor = tintTheme.accent;
    }

    if (node.statusText && !theme) {
        node.statusText.visible = false;
    }
};

GraveFallGame.scene.CharacterSelect.prototype.setClassNodeVisual = function (node, theme, lockedBy) {
    var icon;
    var sprite;
    var portrait;
    var downed = false;

    if (!node) {
        return;
    }

    this.removeNodeDynamicVisuals(node);
    this.applyClassNodeChrome(node, theme);

    portrait = this.createClassNodePortrait(node, theme, downed);
    icon = this.createClassNodeIcon(node, theme);
    sprite = this.createClassNodeSprite(node, theme, downed);

    if (portrait) {
        node.panel.addChild(portrait);
    }

    if (icon) {
        node.panel.addChild(icon);
    }

    if (node.frame) {
        node.panel.addChild(node.frame);
    }

    if (sprite) {
        this.stage.addChild(sprite);
    }

    node.portrait = portrait;
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

    if (node.statusText) {
        node.statusText.text = player.confirmed ? "READY" : (player.controller.label || player.controller.id);
        node.statusText.visible = true;
        node.statusText.x = node.statusBaseX || 202;
        node.statusText.y = node.statusY || 38;
        node.statusText.scaleX = node.statusScale || 1.35;
        node.statusText.scaleY = node.statusScale || 1.35;
    }
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
