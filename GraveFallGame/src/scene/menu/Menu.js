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
 * Game state.
 */
GraveFallGame.scene.Menu = function () {

    /**
     * Index of the currently selected menu option.
     *
     * @type {number}
     */
    this.index = 0;

    /**
     * Array containing the menu text fields.
     *
     * @type {Array}
     */
    this.options = null;

    /**
     * Pointer graphic.
     *
     * @type {?rune.ui.VTMenuPointer}
     */
    this.pointer = null;

    /**
     * Gap between pointer and text.
     *
     * @type {number}
     */
    this.pointerGap = 20;

    /**
     * Gap between menu rows.
     *
     * @type {number}
     */
    this.optionGap = 24;

    /**
     * Menu scale.
     *
     * @type {number}
     */
    this.menuScale = 4;

    rune.scene.Scene.call(this);
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

GraveFallGame.scene.Menu.prototype = Object.create(rune.scene.Scene.prototype);
GraveFallGame.scene.Menu.prototype.constructor = GraveFallGame.scene.Menu;

//------------------------------------------------------------------------------
// Override public prototype methods (ENGINE)
//------------------------------------------------------------------------------

/**
 * @inheritDoc
 */
GraveFallGame.scene.Menu.prototype.init = function (step) {
    rune.scene.Scene.prototype.init.call(this);

    var screen = this.application.screen;

    this.options = [
        new rune.text.BitmapField("Start Game"),
        new rune.text.BitmapField("Rules")
    ];

    this.pointer = new rune.ui.VTMenuPointer();
    this.pointer.scaleX = this.menuScale;
    this.pointer.scaleY = this.menuScale;
    this.stage.addChild(this.pointer);

    var i;
    var opt;
    var maxWidth = 0;
    var totalHeight = 0;
    var charWidth = 6; // Standard Rune text char width

    for (i = 0; i < this.options.length; i++) {
        opt = this.options[i];
        opt.scaleX = this.menuScale;
        opt.scaleY = this.menuScale;

        var optWidth = opt.text.length * charWidth * this.menuScale;
        if (optWidth > maxWidth) {
            maxWidth = optWidth;
        }

        totalHeight += 9 * this.menuScale; 
    }

    totalHeight += this.optionGap * (this.options.length - 1);

    var blockWidth = this.pointer.width + this.pointerGap + maxWidth;
    var menuLeft = Math.round(screen.centerX - (blockWidth / 2));
    var textX = menuLeft + this.pointer.width + this.pointerGap;
    var currentY = Math.round(screen.centerY - (totalHeight / 2));

    for (i = 0; i < this.options.length; i++) {
        opt = this.options[i];
        opt.x = textX;
        opt.y = currentY;

        this.stage.addChild(opt);

        currentY += (9 * this.menuScale) + this.optionGap;
    }

    this.updateVisuals();
};

/**
 * @inheritDoc
 */
GraveFallGame.scene.Menu.prototype.update = function (step) {
    rune.scene.Scene.prototype.update.call(this, step);

    if (this.keyboard.justPressed("down") && this.index < this.options.length - 1) {
        this.index++;
        GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_MOVE, 0.45);
        this.updateVisuals();
    }

    if (this.keyboard.justPressed("up") && this.index > 0) {
        this.index--;
        GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_MOVE, 0.45);
        this.updateVisuals();
    }

    if (this.keyboard.justPressed("space")) {
        GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_CONFIRM, 0.6);

        if (this.index === 0) {
            this.application.scenes.load([
                new GraveFallGame.scene.CharacterSelect()
            ]);
        } else if (this.index === 1) {
            this.application.scenes.load([
                new GraveFallGame.scene.Rule()
            ]);
        }
    }
};

GraveFallGame.scene.Menu.prototype.updateVisuals = function () {
    var selectedOption = this.options[this.index];
    var optionHeight = 9 * this.menuScale;

    this.pointer.x = Math.round(selectedOption.x - this.pointer.width - this.pointerGap);
    this.pointer.y = Math.round(selectedOption.y + (optionHeight / 2) - (this.pointer.height / 2));
};

//------------------------------------------------------------------------------
// CHARACTER SELECT SCENE
//------------------------------------------------------------------------------

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
};

GraveFallGame.scene.CharacterSelect.prototype = Object.create(rune.scene.Scene.prototype);
GraveFallGame.scene.CharacterSelect.prototype.constructor = GraveFallGame.scene.CharacterSelect;

// Link utility methods from Game scene to avoid duplicating large swaths of palette logic
GraveFallGame.scene.CharacterSelect.prototype.applyPaletteSwaps = GraveFallGame.scene.Game.prototype.applyPaletteSwaps;
GraveFallGame.scene.CharacterSelect.prototype.getFramePaletteSwaps = GraveFallGame.scene.Game.prototype.getFramePaletteSwaps;
GraveFallGame.scene.CharacterSelect.prototype.getClothingPaletteSwaps = GraveFallGame.scene.Game.prototype.getClothingPaletteSwaps;
GraveFallGame.scene.CharacterSelect.prototype.applyMonochromeIconColor = GraveFallGame.scene.Game.prototype.applyMonochromeIconColor;
GraveFallGame.scene.CharacterSelect.prototype.resourceExists = GraveFallGame.scene.Game.prototype.resourceExists;
GraveFallGame.scene.CharacterSelect.prototype.resolveExistingResource = GraveFallGame.scene.Game.prototype.resolveExistingResource;

GraveFallGame.scene.CharacterSelect.prototype.createClassNodeSprite = function (node, theme) {
    var sprite;
    var resource;
    var paletteSwaps;

    resource = node && node.template && node.template.stand ? node.template.stand : null;
    if (!resource) {
        return null;
    }

    sprite = new rune.display.Sprite(node.x, node.y, 100, 100, resource);
    sprite.scaleX = 1.5;
    sprite.scaleY = 1.5;

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
    var sprite;

    if (!node) {
        return;
    }

    sprite = this.createClassNodeSprite(node, theme);

    if (!sprite) {
        return;
    }

    if (node.sprite && node.sprite.parent) {
        node.sprite.parent.removeChild(node.sprite, true);
    }

    this.stage.addChild(sprite);

    node.sprite = sprite;
    node.lockedBy = lockedBy || null;
};

GraveFallGame.scene.CharacterSelect.prototype.restoreClassNodeVisual = function (node) {
    if (!node) {
        return;
    }

    this.setClassNodeVisual(node, null, null);
};

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

GraveFallGame.scene.CharacterSelect.prototype.init = function () {
    rune.scene.Scene.prototype.init.call(this);

    var screenWidth = this.application.screen.width;
    var screenHeight = this.application.screen.height;

    this.background = new rune.display.Sprite(0, 0, screenWidth, screenHeight, "Background_Test");
    this.applyPaletteSwaps(this.background, this.getFramePaletteSwaps(GraveFallGame.scene.Game.UI_SKINS.dullBrown));
    this.stage.addChild(this.background);

    this.titleText = new rune.text.BitmapField("SELECT CHARACTER");
    this.titleText.width = 800; // Hardcode width to prevent clipping without autoSize
    this.titleText.scaleX = 3;
    this.titleText.scaleY = 3;
    this.titleText.x = (screenWidth / 2) - ((this.titleText.text.length * 6 * 3) / 2);
    this.titleText.y = 80;
    this.stage.addChild(this.titleText);

    this.instructionText = new rune.text.BitmapField("");
    this.instructionText.width = 1200; // Hardcode large width to prevent clipping without autoSize
    this.instructionText.scaleX = 2;
    this.instructionText.scaleY = 2;
    // Scale multiplier is 2, ensuring exact centering
    this.instructionText.x = (screenWidth / 2) - ((this.instructionText.text.length * 6 * 2) / 2);
    this.instructionText.y = 150;
    this.stage.addChild(this.instructionText);

    this.classNodes = [];

    var templates = GraveFallGame.scene.Game.CLASS_TEMPLATES;
    var startX = (screenWidth / 2) - ((templates.length * 200) / 2) + 50;

    for (var i = 0; i < templates.length; i++) {
        var tmpl = templates[i];
        var cx = startX + (i * 200);

        var standSprite = new rune.display.Sprite(cx, 280, 100, 100, tmpl.stand);
        standSprite.scaleX = 1.5;
        standSprite.scaleY = 1.5;

        if (tmpl.flipStandX) {
            standSprite.flippedX = true;
        }

        this.applyPaletteSwaps(standSprite, this.getClothingPaletteSwaps({
            clothing: GraveFallGame.scene.Game.PLAYER_DOWNED_PALETTE
        }));

        this.stage.addChild(standSprite);

        var nameText = new rune.text.BitmapField(tmpl.name.toUpperCase());
        nameText.width = 200; // Hardcode width to prevent clipping
        nameText.scaleX = 1.5;
        nameText.scaleY = 1.5;
        nameText.x = cx + 75 - ((nameText.text.length * 6 * 1.5) / 2);
        nameText.y = 480;
        this.stage.addChild(nameText);

        this.classNodes.push({
            x: cx,
            y: 280,
            width: 150,
            template: tmpl,
            sprite: standSprite,
            lockedBy: null
        });
    }
};

GraveFallGame.scene.CharacterSelect.prototype.update = function (step) {
    rune.scene.Scene.prototype.update.call(this, step);

    var allJoinedConfirmed = true;
    var anyJoined = this.players.length > 0;

    for (var c = 0; c < this.controllers.length; c++) {
        var ctrl = this.controllers[c];
        var alreadyJoined = false;

        for (var p = 0; p < this.players.length; p++) {
            if (this.players[p].controller.id === ctrl.id) {
                alreadyJoined = true;
                break;
            }
        }

        if (!alreadyJoined) {
            if (this.keyboard.justPressed(ctrl.controls.confirm)) {
                this.joinPlayer(ctrl);
                GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_CONFIRM, 0.6);
            }
        }
    }

    for (var p = 0; p < this.players.length; p++) {
        var player = this.players[p];
        var ctrl = player.controller;

        if (player.joinDelay > 0) {
            player.joinDelay--;
        }

        if (!player.confirmed) {
            allJoinedConfirmed = false;

            if (this.keyboard.justPressed(ctrl.controls.left)) {
                var nextLeft = this.findAvailableClassIndex(player.classIndex - 1, -1, player);

                if (nextLeft !== player.classIndex) {
                    this.releasePlayerSelection(player);
                    this.claimPlayerSelection(player, nextLeft);
                    this.updatePlayerCursor(player); // FIXED: Force visual update on text
                    GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_MOVE, 0.4);
                } else {
                    GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_BACK, 0.4);
                }
            }

            if (this.keyboard.justPressed(ctrl.controls.right)) {
                var nextRight = this.findAvailableClassIndex(player.classIndex + 1, 1, player);

                if (nextRight !== player.classIndex) {
                    this.releasePlayerSelection(player);
                    this.claimPlayerSelection(player, nextRight);
                    this.updatePlayerCursor(player); // FIXED: Force visual update on text
                    GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_MOVE, 0.4);
                } else {
                    GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_BACK, 0.4);
                }
            }

            if (this.keyboard.justPressed(ctrl.controls.confirm) && player.joinDelay <= 0) {
                var node = this.classNodes[player.classIndex];

                if (node && (!node.lockedBy || node.lockedBy === player)) {
                    player.confirmed = true;
                    node.lockedBy = player;

                    player.statusText.text = "READY";
                    // Using scale 1.5 in calculation below
                    player.statusText.x = node.x + 75 - ((player.statusText.text.length * 6 * 1.5) / 2);

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

        var secs = Math.max(0, Math.ceil(this.countdownTimer / 1000));
        this.instructionText.text = "STARTING BATTLE IN " + secs;
        // Calculation uses a scale multiplier of 2!
        this.instructionText.x = (this.application.screen.width / 2) - ((this.instructionText.text.length * 6 * 2) / 2);

        if (this.countdownTimer <= 0) {
            this.startGame();
        }
    } else {
        this.countdownTimer = undefined;

        if (anyJoined) {
            this.instructionText.text = "SELECT YOUR CHARACTER";
        } else {
            // FIXED: Typo from SPcACE to SPACE
            this.instructionText.text = "PRESS [SPACE], [ENTER], [K], or [B] TO JOIN";
        }

        // Calculation uses a scale multiplier of 2!
        this.instructionText.x = (this.application.screen.width / 2) - ((this.instructionText.text.length * 6 * 2) / 2);
    }

    if (this.keyboard.justPressed("escape")) {
        this.application.scenes.load([new GraveFallGame.scene.Menu()]);
    }
};

GraveFallGame.scene.CharacterSelect.prototype.joinPlayer = function (ctrl) {
    var player = {
        controller: ctrl,
        classIndex: 0,
        confirmed: false,
        joinDelay: 2,
        hoveredClassIndex: -1
    };

    this.players.push(player);

    // Start on the first available class instead of the cursor-square style.
    player.classIndex = this.findAvailableClassIndex(0, 1, player);
    this.claimPlayerSelection(player, player.classIndex);

    var status = new rune.text.BitmapField(ctrl.id);
    status.width = 150; // Hardcode width to prevent clipping
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

    // Keep the selected class colored with the player's palette.
    if (node.lockedBy !== player) {
        this.claimPlayerSelection(player, player.classIndex);
    } else {
        this.setClassNodeVisual(node, theme, player);
    }

    player.statusText.text = player.controller.id;

    var stackOffset = 0;
    for (var p = 0; p < this.players.length; p++) {
        if (this.players[p] === player) {
            break;
        }

        if (this.players[p].classIndex === player.classIndex) {
            stackOffset += 20;
        }
    }

    player.statusText.x = node.x + 75 - ((player.statusText.text.length * 6 * 1.5) / 2);
    player.statusText.y = node.y + 170 + stackOffset;
};

GraveFallGame.scene.CharacterSelect.prototype.startGame = function () {
    var activeParty = [];

    for (var i = 0; i < this.players.length; i++) {
        var p = this.players[i];
        var tmpl = this.classNodes[p.classIndex].template;

        var member = {
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

    var numPlayers = activeParty.length;
    var menuWidth = 320;

    // Dynamic alignment logic
    var startX = 0;
    if (numPlayers === 1 || numPlayers === 2) {
        startX = (this.application.screen.width / 2) - ((menuWidth * numPlayers) / 2);
    }

    for (var i = 0; i < numPlayers; i++) {
        activeParty[i].x = startX + (i * menuWidth);
        activeParty[i].partyRenderIndex = i;
        activeParty[i].partySize = numPlayers;
        activeParty[i].flipStandX = GraveFallGame.scene.Game.getPartyMemberFlippedX(i, numPlayers);
    }

    GraveFallGame.scene.Game.PARTY_MEMBERS = activeParty;

    this.application.scenes.load([new GraveFallGame.scene.Game()]);
};