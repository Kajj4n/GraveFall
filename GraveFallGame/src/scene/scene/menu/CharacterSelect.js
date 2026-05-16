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
        { id: "P1", label: "PLAYER 1", gamepadIndex: 0, controls: { left: "a", right: "d", confirm: "space" }, moveControls: { left: "a", right: "d", up: "w", down: "s" }, themeIndex: 0 },
        { id: "P2", label: "PLAYER 2", gamepadIndex: 1, controls: { left: "left", right: "right", confirm: "enter" }, moveControls: { left: "left", right: "right", up: "up", down: "down" }, themeIndex: 1 },
        { id: "P3", label: "PLAYER 3", gamepadIndex: 2, controls: { left: "j", right: "l", confirm: "m" }, moveControls: { left: "j", right: "l", up: "i", down: "k" }, themeIndex: 2 },
        { id: "P4", label: "PLAYER 4", gamepadIndex: 3, controls: { left: "v", right: "n", confirm: "b" }, moveControls: { left: "f", right: "h", up: "t", down: "g" }, themeIndex: 3 }
    ];

    this.players = [];
    this.countdownTimer = undefined;
    this.classNodes = [];
    this.layoutSlots = [];
    this.layoutTweenDuration = 420;
    this.enterTransition = null;
    this.enterSlideDuration = 560;
    this.enterFadeDuration = 460;
    this.runPaletteKey = null;
    this.runPalette = null;
    this.backgroundSkin = GraveFallGame.scene.Game.UI_SKINS.outsideCampfireBrown || GraveFallGame.scene.Game.UI_SKINS.dullBrown;
    this.selectionSkin = GraveFallGame.scene.Game.UI_SKINS.dullBrown;
    
    // Default Phase
    this.phase = "select"; 
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
GraveFallGame.scene.CharacterSelect.prototype.isDevConsoleInputActive = GraveFallGame.scene.Game.prototype.isDevConsoleInputActive;

// --- UNIVERSAL INPUT HELPERS FOR SELECT SCENE ---
GraveFallGame.scene.CharacterSelect.prototype.getGamepadForInput = function (inputOwner) {
    var index = inputOwner && inputOwner.gamepadIndex !== undefined ? inputOwner.gamepadIndex : 0;
    var gp = null;

    if (!this.gamepads || typeof this.gamepads.get !== "function") {
        return null;
    }

    try {
        gp = this.gamepads.get(index);
    } catch (error) {
        return null;
    }

    return gp && gp.connected ? gp : null;
};

GraveFallGame.scene.CharacterSelect.prototype.justPressedConfirm = function (ctrl) {
    if (this.isDevConsoleInputActive && this.isDevConsoleInputActive()) return false;
    if (this.keyboard.justPressed(ctrl.controls.confirm)) return true;
    var gp = this.getGamepadForInput(ctrl);
    return gp && gp.justPressed(0);
};

GraveFallGame.scene.CharacterSelect.prototype.justPressedBack = function (ctrl) {
    if (this.isDevConsoleInputActive && this.isDevConsoleInputActive()) return false;
    if (this.keyboard.justPressed("backspace")) return true;
    var gp = this.getGamepadForInput(ctrl);
    return gp && (gp.justPressed(1) || gp.justPressed(2)); // Button B or X
};

GraveFallGame.scene.CharacterSelect.prototype.justPressedLeft = function (ctrl) {
    if (this.isDevConsoleInputActive && this.isDevConsoleInputActive()) return false;
    if (this.keyboard.justPressed(ctrl.controls.left)) return true;
    var gp = this.getGamepadForInput(ctrl);
    return gp && (gp.justPressed(14) || gp.stickLeftJustLeft);
};

GraveFallGame.scene.CharacterSelect.prototype.justPressedRight = function (ctrl) {
    if (this.isDevConsoleInputActive && this.isDevConsoleInputActive()) return false;
    if (this.keyboard.justPressed(ctrl.controls.right)) return true;
    var gp = this.getGamepadForInput(ctrl);
    return gp && (gp.justPressed(15) || gp.stickLeftJustRight);
};

GraveFallGame.scene.CharacterSelect.prototype.justPressedUp = function (ctrl) {
    if (this.isDevConsoleInputActive && this.isDevConsoleInputActive()) return false;
    if (this.keyboard.justPressed(ctrl.moveControls.up)) return true;
    var gp = this.getGamepadForInput(ctrl);
    return gp && (gp.justPressed(12) || gp.stickLeftJustUp);
};

GraveFallGame.scene.CharacterSelect.prototype.justPressedDown = function (ctrl) {
    if (this.isDevConsoleInputActive && this.isDevConsoleInputActive()) return false;
    if (this.keyboard.justPressed(ctrl.moveControls.down)) return true;
    var gp = this.getGamepadForInput(ctrl);
    return gp && (gp.justPressed(13) || gp.stickLeftJustDown);
};

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

    this.runPaletteKey = GraveFallGame.scene.Game.resolveRunPaletteKey(GraveFallGame.scene.Game.ACTIVE_RUN_PALETTE_KEY);
    this.runPalette = GraveFallGame.scene.Game.getRunPalette(this.runPaletteKey);
    GraveFallGame.scene.Game.ACTIVE_RUN_PALETTE_KEY = this.runPaletteKey;
    this.backgroundSkin = this.runPalette.outside;
    this.selectionSkin = this.runPalette.inside;

    this.background = new rune.display.Sprite(0, 0, screenWidth, screenHeight, "Outside_Campfire");
    this.applyPaletteSwaps(this.background, this.getFramePaletteSwaps(this.backgroundSkin));
    this.stage.addChild(this.background);

    this.titleText = new rune.text.BitmapField("SELECT CHARACTER");
    this.titleText.width = 1200; // Hardcoded width to prevent clipping
    this.titleText.scaleX = 3;
    this.titleText.scaleY = 3;
    this.titleText.y = 34;
    this.titleText.x = Math.round((screenWidth / 2) - ((this.titleText.text.length * 6 * 3) / 2));
    this.stage.addChild(this.titleText);

    this.instructionText = new rune.text.BitmapField("");
    this.instructionText.width = 1400; // Hardcoded width
    this.instructionText.scaleX = 2;
    this.instructionText.scaleY = 2;
    this.instructionText.y = 88;
    this.stage.addChild(this.instructionText);

    this.classNodes = [];
    this.layoutSlots = [];
    templates = GraveFallGame.scene.Game.CLASS_TEMPLATES;
    menuWidth = 320;
    menuHeight = 70;
    startX = Math.round((screenWidth - (templates.length * menuWidth)) / 2);
    menuY = screenHeight - menuHeight;

    for (i = 0; i < templates.length; i++) {
        this.layoutSlots.push(startX + (i * menuWidth));
        this.createClassCard(templates[i], startX + (i * menuWidth), menuY, menuWidth, menuHeight, i);
    }

    this.updateInstructionText(false, false);

    if (typeof this.registerCharacterSelectDevConsoleCommands === "function") {
        this.registerCharacterSelectDevConsoleCommands();
    }
};

GraveFallGame.scene.CharacterSelect.prototype.update = function (step) {
    rune.scene.Scene.prototype.update.call(this, step);

    if (this.isDevConsoleInputActive && this.isDevConsoleInputActive()) {
        return;
    }

    // --- PHASE ROUTING ---
    if (this.phase === "name") {
        this.updateNamePhase(step);
        return;
    }

    if (this.enterTransition || this.phase === "transition") {
        this.updateEnterTransition(step);
        return;
    }

    // --- PHASE: SELECT ---
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

        if (!alreadyJoined && this.justPressedConfirm(ctrl)) {
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

            if (this.justPressedLeft(ctrl)) {
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

            if (this.justPressedRight(ctrl)) {
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

            if (this.justPressedConfirm(ctrl) && player.joinDelay <= 0) {
                node = this.classNodes[player.classIndex];

                if (node && (!node.lockedBy || node.lockedBy === player)) {
                    player.confirmed = true;
                    node.lockedBy = player;
                    this.updatePlayerCursor(player);
                    this.rebuildClassLayout(true);
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
        this.instructionText.text = "PROCEEDING TO PARTY CREATION IN " + secs;
        this.centerText(this.instructionText, this.application.screen.width / 2, 2);

        if (this.countdownTimer <= 0) {
            this.startNameInputPhase();
        }
    } else {
        this.countdownTimer = undefined;
        this.updateInstructionText(anyJoined, allJoinedConfirmed);
    }

    this.updateClassLayoutAnimations(step);

    if (this.keyboard.justPressed("escape")) {
        this.application.scenes.load([new GraveFallGame.scene.Menu()]);
    }
};

GraveFallGame.scene.CharacterSelect.prototype.dispose = function () {
    if (typeof this.unregisterCharacterSelectDevConsoleCommands === "function") {
        this.unregisterCharacterSelectDevConsoleCommands();
    }

    rune.scene.Scene.prototype.dispose.call(this);
};

//------------------------------------------------------------------------------
// PARTY NAME PHASE
//------------------------------------------------------------------------------

GraveFallGame.scene.CharacterSelect.prototype.startNameInputPhase = function () {
    this.phase = "name";

    this.titleText.visible = false;
    this.instructionText.text = "CREATE A PARTY NAME. EVERYONE PRESS 'OK' TO START!";
    this.centerText(this.instructionText, this.application.screen.width / 2, 2);
    this.instructionText.y = 40;

    for (var i = 0; i < this.classNodes.length; i++) {
        if (!this.classNodes[i].lockedBy) {
            if (this.classNodes[i].panel) this.classNodes[i].panel.visible = false;
            if (this.classNodes[i].sprite) this.classNodes[i].sprite.visible = false;
            if (this.classNodes[i].statusText) this.classNodes[i].statusText.visible = false;
            if (this.classNodes[i].buffText) this.classNodes[i].buffText.visible = false;
        }
    }

    this.kbContainer = new rune.display.DisplayObjectContainer(0, 0, this.application.screen.width, this.application.screen.height);
    this.stage.addChild(this.kbContainer);

    this.partyName = "";
    this.partyNameText = new rune.text.BitmapField("");
    this.partyNameText.width = 1200; // Fix clipping
    this.partyNameText.height = 80;
    this.partyNameText.scaleX = 4;
    this.partyNameText.scaleY = 4;
    this.partyNameText.y = 120;
    this.kbContainer.addChild(this.partyNameText);

    this.kbRows = [
        ['A','B','C','D','E','F','G','H','I','J'],
        ['K','L','M','N','O','P','Q','R','S','T'],
        ['U','V','W','X','Y','Z','-','.','!','?'],
        ['0','1','2','3','4','5','6','7','8','9'],
        ['DEL', 'SPACE', 'OK']
    ];

    this.kbVisuals = [];
    var startY = 240;
    var spacingY = 56;

    for (var r = 0; r < this.kbRows.length; r++) {
        this.kbVisuals[r] = [];
        var isLastRow = (r === this.kbRows.length - 1);
        var spacingX = isLastRow ? 180 : 56;
        
        // Exact centering math prevents invisible right-side ghost keys
        var rowContentWidth = (this.kbRows[r].length - 1) * spacingX;
        var startX = (this.application.screen.width / 2) - (rowContentWidth / 2);

        for (var c = 0; c < this.kbRows[r].length; c++) {
            var keyStr = this.kbRows[r][c];
            var keyText = new rune.text.BitmapField(keyStr);
            keyText.width = 64; // Fix clipping
            keyText.height = 32;
            keyText.scaleX = 2.5;
            keyText.scaleY = 2.5;
            keyText.x = startX + (c * spacingX) - ((keyStr.length * 6 * 2.5) / 2);
            keyText.y = startY + (r * spacingY);
            this.kbContainer.addChild(keyText);

            this.kbVisuals[r].push({
                text: keyStr,
                x: startX + (c * spacingX),
                y: startY + (r * spacingY)
            });
        }
    }

    this.kbdCursors = [];
    for (var p = 0; p < this.players.length; p++) {
        var player = this.players[p];
        player.kbdX = 0;
        player.kbdY = 0;
        player.nameReady = false;

        var theme = GraveFallGame.scene.Game.PLAYER_THEMES[player.controller.themeIndex];
        var cursor = new rune.display.Graphic(0, 0, 44, 44);
        cursor.backgroundColor = theme.accent;
        cursor.alpha = 0.4;
        this.kbContainer.addChildAt(cursor, 0);
        this.kbdCursors.push(cursor);

        this.updatePlayerKbdCursor(player, p);
    }

    this.refreshPartyNameDisplay();
};

GraveFallGame.scene.CharacterSelect.prototype.updateNamePhase = function (step) {
    var allReady = true;

    for (var p = 0; p < this.players.length; p++) {
        var player = this.players[p];
        var ctrl = player.controller;

        if (!player.nameReady) {
            allReady = false;
        }

        var moved = false;
        if (this.justPressedLeft(ctrl)) { player.kbdX--; moved = true; player.nameReady = false; }
        if (this.justPressedRight(ctrl)) { player.kbdX++; moved = true; player.nameReady = false; }
        if (this.justPressedUp(ctrl)) { player.kbdY--; moved = true; player.nameReady = false; }
        if (this.justPressedDown(ctrl)) { player.kbdY++; moved = true; player.nameReady = false; }

        if (moved) {
            if (player.kbdY < 0) player.kbdY = this.kbRows.length - 1;
            if (player.kbdY >= this.kbRows.length) player.kbdY = 0;

            if (player.kbdX < 0) player.kbdX = this.kbRows[player.kbdY].length - 1;
            if (player.kbdX >= this.kbRows[player.kbdY].length) player.kbdX = this.kbRows[player.kbdY].length - 1;

            GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_MOVE, 0.4);
            this.updatePlayerKbdCursor(player, p);
        }

        if (this.justPressedBack(ctrl)) {
            if (this.partyName.length > 0) {
                this.partyName = this.partyName.slice(0, -1);
                GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_BACK, 0.4);
                this.refreshPartyNameDisplay();
            }
        } else if (this.justPressedConfirm(ctrl)) {
            var keyStr = this.kbRows[player.kbdY][player.kbdX];
            if (keyStr === "OK") {
                player.nameReady = !player.nameReady;
                GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_CONFIRM, 0.6);
                this.updatePlayerKbdCursor(player, p);
            } else if (keyStr === "DEL") {
                if (this.partyName.length > 0) {
                    this.partyName = this.partyName.slice(0, -1);
                    GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_BACK, 0.4);
                }
            } else if (keyStr === "SPACE") {
                if (this.partyName.length < 12) {
                    this.partyName += " ";
                    GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_CONFIRM, 0.4);
                }
            } else {
                if (this.partyName.length < 12) {
                    this.partyName += keyStr;
                    GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_CONFIRM, 0.4);
                }
            }
            this.refreshPartyNameDisplay();
        }
    }

    if (allReady && this.players.length > 0) {
        GraveFallGame.scene.Game.PARTY_NAME = this.partyName.trim() || "THE FALLEN";
        this.kbContainer.visible = false;
        this.instructionText.visible = false;
        
        // FIX: Update phase state so the transition actually begins in the update loop!
        this.phase = "transition"; 
        this.beginEnterTransition();
    }
};

GraveFallGame.scene.CharacterSelect.prototype.updatePlayerKbdCursor = function (player, playerIndex) {
    var vis = this.kbVisuals[player.kbdY][player.kbdX];
    var cursor = this.kbdCursors[playerIndex];
    var baseW = (player.kbdY === 4) ? 120 : 44; 
    
    cursor.width = baseW;
    cursor.x = vis.x - (baseW / 2) + (playerIndex * 4);
    cursor.y = vis.y - 12 + (playerIndex * 4);

    if (player.nameReady) {
        cursor.alpha = 0.8;
    } else {
        cursor.alpha = 0.4;
    }
};

GraveFallGame.scene.CharacterSelect.prototype.refreshPartyNameDisplay = function () {
    var str = this.partyName + (this.partyName.length < 12 ? "_" : "");
    this.partyNameText.text = str;
    
    // FIX: Removed autoSize = true and manually centered the string
    this.partyNameText.x = Math.floor((this.application.screen.width / 2) - ((str.length * 6 * 4) / 2));
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

GraveFallGame.scene.CharacterSelect.prototype.getCharacterSelectBuffDescription = function (template) {
    var id = template && template.id ? String(template.id).toLowerCase() : "";
    var name = template && template.name ? String(template.name).toLowerCase() : "";

    if (id === "fighter" || name === "fighter" || name === "warrior") {
        return "BUFF: TEMP DEFENCE";
    }

    if (id === "assassin" || id === "rogue" || name === "rogue" || name === "assassin") {
        return "BUFF: TEMP SPEED";
    }

    if (id === "wizard" || name === "wizard") {
        return "BUFF: HEALS [REVIVES IF DOWNED]";
    }

    if (id === "ranger" || name === "ranger") {
        return "BUFF: TEMP DAMAGE";
    }

    return "BUFF: TEMP DAMAGE";
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
    var statusNumberText;
    var buffText;
    var node;
    var spriteScale = 2.05;
    var textScale = 1.55;
    var nameY = 12;
    var hpY = 36;
    var numberYAdjust = -2;

    panel = new rune.display.DisplayObjectContainer(x, y, width, height);
    panel.backgroundColor = this.selectionSkin.panelTop;
    this.stage.addChild(panel);

    menuAccent = new rune.display.Graphic(0, 0, width, 4);
    menuAccent.backgroundColor = this.selectionSkin.frame.mid;
    panel.addChild(menuAccent);

    nameText = new rune.text.BitmapField(template.name.toUpperCase());
    nameText.width = 120; // Fix clipping
    nameText.scaleX = textScale;
    nameText.scaleY = textScale;
    nameText.x = 102;
    nameText.y = nameY;
    panel.addChild(nameText);

    hpLabelText = new rune.text.BitmapField("HP");
    hpLabelText.width = 40; // Fix clipping
    hpLabelText.scaleX = textScale;
    hpLabelText.scaleY = textScale;
    hpLabelText.x = 102;
    hpLabelText.y = hpY;
    panel.addChild(hpLabelText);

    hpValueText = new rune.text.BitmapField(String(template.hpMax));
    hpValueText.width = 64; // Fix clipping
    hpValueText.scaleX = textScale;
    hpValueText.scaleY = textScale;
    hpValueText.x = 132;
    hpValueText.y = hpY + numberYAdjust;
    panel.addChild(hpValueText);

    buffText = new rune.text.BitmapField(this.getCharacterSelectBuffDescription(template));
    buffText.width = 240; // Fix clipping
    buffText.scaleX = 1;
    buffText.scaleY = 1;
    buffText.x = 102;
    buffText.y = 55;
    panel.addChild(buffText);

    statusText = new rune.text.BitmapField("");
    statusText.width = 80; // Fix clipping
    statusText.scaleX = textScale;
    statusText.scaleY = textScale;
    statusText.x = 202;
    statusText.y = nameY;
    statusText.visible = false;
    panel.addChild(statusText);

    statusNumberText = new rune.text.BitmapField("");
    statusNumberText.width = 30; // Fix clipping
    statusNumberText.scaleX = textScale;
    statusNumberText.scaleY = textScale;
    statusNumberText.x = 267;
    statusNumberText.y = nameY + numberYAdjust;
    statusNumberText.visible = false;
    panel.addChild(statusNumberText);

    frame = this.createBoxFrame(0, 0, width, height, framePaletteSwaps);
    panel.addChild(frame);

    node = {
        cardX: x,
        cardY: y,
        cardWidth: width,
        cardHeight: height,
        centerX: x + (width / 2),
        visualX: x,
        targetX: x,
        layoutStartX: x,
        layoutElapsed: 0,
        layoutDuration: 0,
        layoutAnimating: false,
        layoutSlotIndex: index || 0,
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
        statusNumberText: statusNumberText,
        buffText: buffText,
        statusBaseX: 202,
        statusNumberBaseX: 267,
        statusY: nameY,
        statusNumberY: nameY + numberYAdjust,
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
        this.getSpriteXForCardX(node, (typeof node.visualX === "number") ? node.visualX : node.cardX),
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

    if (!theme) {
        if (node.statusText) {
            node.statusText.visible = false;
        }

        if (node.statusNumberText) {
            node.statusNumberText.visible = false;
        }
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
        if (lockedBy && lockedBy.confirmed === true) {
            this.setDamageStateGroupState(sprite, "itemAttack");
        }
    }

    node.portrait = portrait;
    node.icon = icon;
    node.sprite = sprite;
    this.applyNodeVisualX(node, (typeof node.visualX === "number") ? node.visualX : node.cardX);
    node.lockedBy = lockedBy || null;
};

GraveFallGame.scene.CharacterSelect.prototype.restoreClassNodeVisual = function (node) {
    if (!node) {
        return;
    }

    this.setClassNodeVisual(node, null, null);
};

//------------------------------------------------------------------------------
// Layout and transition helpers
//------------------------------------------------------------------------------

GraveFallGame.scene.CharacterSelect.prototype.getControllerOrderIndex = function (ctrl) {
    var i;

    if (!ctrl) {
        return 0;
    }

    for (i = 0; i < this.controllers.length; i++) {
        if (this.controllers[i].id === ctrl.id) {
            return i;
        }
    }

    return 0;
};

GraveFallGame.scene.CharacterSelect.prototype.getSpriteXForCardX = function (node, cardX) {
    if (!node) {
        return 0;
    }

    return Math.round(cardX + (node.cardWidth / 2) - ((100 * node.spriteScale) / 2));
};

GraveFallGame.scene.CharacterSelect.prototype.applyNodeVisualX = function (node, visualX) {
    if (!node) {
        return;
    }

    node.visualX = visualX;

    if (node.panel) {
        node.panel.x = Math.round(visualX);
    }

    if (node.sprite) {
        node.sprite.x = this.getSpriteXForCardX(node, visualX);
    }
};

GraveFallGame.scene.CharacterSelect.prototype.setNodeTargetSlot = function (node, slotIndex, animate) {
    var targetX;

    if (!node || !this.layoutSlots || this.layoutSlots.length === 0) {
        return;
    }

    slotIndex = Math.max(0, Math.min(this.layoutSlots.length - 1, slotIndex));
    targetX = this.layoutSlots[slotIndex];

    node.layoutSlotIndex = slotIndex;
    node.cardX = targetX;
    node.centerX = targetX + (node.cardWidth / 2);
    node.spriteX = this.getSpriteXForCardX(node, targetX);
    node.targetX = targetX;

    if (!animate || Math.abs((node.visualX || 0) - targetX) < 1) {
        node.layoutAnimating = false;
        node.layoutElapsed = 0;
        node.layoutDuration = 0;
        node.layoutStartX = targetX;
        this.applyNodeVisualX(node, targetX);
        return;
    }

    node.layoutAnimating = true;
    node.layoutElapsed = 0;
    node.layoutDuration = this.layoutTweenDuration || 420;
    node.layoutStartX = (typeof node.visualX === "number") ? node.visualX : (node.panel ? node.panel.x : targetX);
};

GraveFallGame.scene.CharacterSelect.prototype.updateClassLayoutAnimations = function (step) {
    var i;
    var node;
    var progress;
    var eased;
    var nextX;

    if (!this.classNodes) {
        return;
    }

    for (i = 0; i < this.classNodes.length; i++) {
        node = this.classNodes[i];

        if (!node || node.layoutAnimating !== true) {
            continue;
        }

        node.layoutElapsed += step;
        progress = Math.min(1, node.layoutElapsed / Math.max(1, node.layoutDuration));

        if (rune.tween && rune.tween.Cubic && rune.tween.Cubic.easeInOut) {
            eased = rune.tween.Cubic.easeInOut(progress, 0, 1, 1);
        } else {
            eased = progress * progress * (3 - (2 * progress));
        }

        nextX = node.layoutStartX + ((node.targetX - node.layoutStartX) * eased);
        this.applyNodeVisualX(node, nextX);

        if (progress >= 1) {
            node.layoutAnimating = false;
            this.applyNodeVisualX(node, node.targetX);
        }
    }
};

GraveFallGame.scene.CharacterSelect.prototype.rebuildClassLayout = function (animate) {
    var slotByClassIndex = {};
    var usedSlots = [];
    var confirmedPlayers = [];
    var openSlots = [];
    var i;
    var p;
    var player;
    var playerSlot;
    var node;
    var classIndex;

    if (!this.classNodes || this.classNodes.length === 0) {
        return;
    }

    for (i = 0; i < this.players.length; i++) {
        player = this.players[i];

        if (player && player.confirmed === true) {
            confirmedPlayers.push(player);
        }
    }

    confirmedPlayers.sort(function (a, b) {
        return this.getControllerOrderIndex(a.controller) - this.getControllerOrderIndex(b.controller);
    }.bind(this));

    for (i = 0; i < confirmedPlayers.length; i++) {
        player = confirmedPlayers[i];
        playerSlot = this.getControllerOrderIndex(player.controller);
        playerSlot = Math.max(0, Math.min(this.classNodes.length - 1, playerSlot));

        slotByClassIndex[player.classIndex] = playerSlot;
        usedSlots[playerSlot] = true;
    }

    for (i = 0; i < this.classNodes.length; i++) {
        if (usedSlots[i] !== true) {
            openSlots.push(i);
        }
    }

    p = 0;

    for (classIndex = 0; classIndex < this.classNodes.length; classIndex++) {
        if (typeof slotByClassIndex[classIndex] !== "number") {
            slotByClassIndex[classIndex] = openSlots[p];
            p++;
        }
    }

    for (i = 0; i < this.classNodes.length; i++) {
        node = this.classNodes[i];
        this.setNodeTargetSlot(node, slotByClassIndex[i], animate === true);
    }
};


GraveFallGame.scene.CharacterSelect.prototype.easeTransition = function (progress) {
    progress = Math.max(0, Math.min(1, progress || 0));

    if (rune.tween && rune.tween.Cubic && rune.tween.Cubic.easeInOut) {
        return rune.tween.Cubic.easeInOut(progress, 0, 1, 1);
    }

    return progress * progress * (3 - (2 * progress));
};

GraveFallGame.scene.CharacterSelect.prototype.getSelectedPlayersInRenderOrder = function () {
    var selectedPlayers = [];
    var controllerIndex;
    var p;
    var player;

    for (controllerIndex = 0; controllerIndex < this.controllers.length; controllerIndex++) {
        player = null;

        for (p = 0; p < this.players.length; p++) {
            if (this.players[p].controller.id === this.controllers[controllerIndex].id) {
                player = this.players[p];
                break;
            }
        }

        if (player && player.confirmed === true) {
            selectedPlayers.push({
                player: player,
                controllerIndex: controllerIndex
            });
        }
    }

    return selectedPlayers;
};

GraveFallGame.scene.CharacterSelect.prototype.beginEnterTransition = function () {
    var selectedPlayers;
    var partySize;
    var screenWidth;
    var menuWidth = 320;
    var members = [];
    var fadeNodes = [];
    var selectedNodeIndices = {};
    var i;
    var selection;
    var player;
    var node;
    var targetX;
    var targetFlip;
    var renderIndex;

    if (this.enterTransition) {
        return;
    }

    selectedPlayers = this.getSelectedPlayersInRenderOrder();
    partySize = selectedPlayers.length;

    if (partySize <= 0) {
        this.startGame();
        return;
    }

    screenWidth = this.application && this.application.screen ? this.application.screen.width : 1280;

    if (this.instructionText) {
        this.instructionText.text = "ENTERING DUNGEON";
        this.centerText(this.instructionText, screenWidth / 2, 2);
    }

    for (i = 0; i < selectedPlayers.length; i++) {
        selection = selectedPlayers[i];
        player = selection.player;
        node = this.classNodes[player.classIndex];

        if (!node) {
            continue;
        }

        selectedNodeIndices[player.classIndex] = true;
        renderIndex = i;
        targetX = GraveFallGame.scene.Game.getPartyMenuX(renderIndex, partySize, menuWidth, screenWidth);
        targetFlip = GraveFallGame.scene.Game.getPartyMemberFlippedX(renderIndex, partySize);

        node.layoutAnimating = false;
        node.targetX = targetX;
        node.cardX = targetX;
        node.centerX = targetX + (node.cardWidth / 2);
        node.spriteX = this.getSpriteXForCardX(node, targetX);

        if (node.sprite) {
            this.setDamageStateGroupFlippedX(node.sprite, targetFlip);
        }

        members.push({
            node: node,
            startX: (typeof node.visualX === "number") ? node.visualX : (node.panel ? node.panel.x : targetX),
            targetX: targetX
        });
    }

    for (i = 0; i < this.classNodes.length; i++) {
        node = this.classNodes[i];

        if (!node) {
            continue;
        }

        node.layoutAnimating = false;
        fadeNodes.push({
            node: node,
            selected: selectedNodeIndices[i] === true,
            panelAlpha: node.panel ? node.panel.alpha : 1,
            spriteAlpha: node.sprite ? node.sprite.alpha : 1
        });
    }

    this.enterTransition = {
        phase: "slide",
        elapsed: 0,
        slideDuration: this.enterSlideDuration || 560,
        fadeDuration: this.enterFadeDuration || 460,
        members: members,
        fadeNodes: fadeNodes
    };
};

GraveFallGame.scene.CharacterSelect.prototype.updateEnterTransition = function (step) {
    var transition = this.enterTransition;
    var progress;
    var eased;
    var i;
    var item;
    var node;
    var nextX;
    var alpha;
    var fadeAlpha;

    if (!transition) {
        return;
    }

    transition.elapsed += step;

    if (transition.phase === "slide") {
        progress = Math.min(1, transition.elapsed / Math.max(1, transition.slideDuration));
        eased = this.easeTransition(progress);

        for (i = 0; i < transition.members.length; i++) {
            item = transition.members[i];
            node = item.node;
            nextX = item.startX + ((item.targetX - item.startX) * eased);
            this.applyNodeVisualX(node, nextX);
        }

        for (i = 0; i < transition.fadeNodes.length; i++) {
            item = transition.fadeNodes[i];

            if (item.selected === true) {
                continue;
            }

            fadeAlpha = 1 - eased;
            node = item.node;

            if (node.panel) {
                node.panel.alpha = item.panelAlpha * fadeAlpha;
            }

            if (node.sprite) {
                node.sprite.alpha = item.spriteAlpha * fadeAlpha;
            }
        }

        if (progress >= 1) {
            for (i = 0; i < transition.members.length; i++) {
                item = transition.members[i];
                this.applyNodeVisualX(item.node, item.targetX);
            }

            transition.phase = "fade";
            transition.elapsed = 0;
        }

        return;
    }

    if (transition.phase === "fade") {
        progress = Math.min(1, transition.elapsed / Math.max(1, transition.fadeDuration));
        eased = this.easeTransition(progress);
        alpha = 1 - eased;

        for (i = 0; i < transition.fadeNodes.length; i++) {
            item = transition.fadeNodes[i];
            node = item.node;
            fadeAlpha = item.selected === true ? alpha : 0;

            if (node.panel) {
                node.panel.alpha = item.panelAlpha * fadeAlpha;
            }

            if (node.sprite) {
                node.sprite.alpha = item.spriteAlpha * fadeAlpha;
            }
        }

        if (this.titleText) {
            this.titleText.alpha = alpha;
        }

        if (this.instructionText) {
            this.instructionText.alpha = alpha;
        }

        if (progress >= 1) {
            for (i = 0; i < transition.fadeNodes.length; i++) {
                item = transition.fadeNodes[i];
                node = item.node;

                if (node.panel) {
                    node.panel.alpha = 0;
                }

                if (node.sprite) {
                    node.sprite.alpha = 0;
                }
            }

            if (this.titleText) {
                this.titleText.alpha = 0;
            }

            if (this.instructionText) {
                this.instructionText.alpha = 0;
            }

            this.startGame();
        }

        return;
    }
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

    var status = new rune.text.BitmapField(ctrl.id);
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
    var status;
    var statusParts;

    if (!node) {
        return;
    }

    if (node.lockedBy !== player) {
        this.claimPlayerSelection(player, player.classIndex);
    } else {
        this.setClassNodeVisual(node, theme, player);
    }

    if (node.statusText) {
        status = player.confirmed ? "READY" : (player.controller.label || player.controller.id);

        if (!player.confirmed && node.statusNumberText && status.indexOf(" ") >= 0) {
            statusParts = status.split(" ");
            node.statusText.text = statusParts[0];
            node.statusNumberText.text = statusParts[1] || "";
            node.statusNumberText.visible = node.statusNumberText.text.length > 0;
            node.statusNumberText.x = node.statusNumberBaseX || 267;
            node.statusNumberText.y = node.statusNumberY || 10;
            node.statusNumberText.scaleX = node.statusScale || 1.35;
            node.statusNumberText.scaleY = node.statusScale || 1.35;
        } else {
            node.statusText.text = status;

            if (node.statusNumberText) {
                node.statusNumberText.visible = false;
            }
        }

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
        this.instructionText.text = "SELECT YOUR CHARACTER USING A/D OR D-PAD THEN CONFIRM BUTTON";
    } else {
        this.instructionText.text = "PRESS [SPACE/ENTER/K/B] OR GAMEPAD [A] TO JOIN";
    }

    this.centerText(this.instructionText, this.application.screen.width / 2, 2);
};

GraveFallGame.scene.CharacterSelect.prototype.startGame = function () {
    var activeParty = [];
    var selectedPlayers = [];
    var menuWidth = 320;
    var screenWidth = this.application && this.application.screen ? this.application.screen.width : 1280;
    var controllerIndex;
    var i;
    var p;
    var player;
    var tmpl;
    var member;
    var partySize;
    var renderIndex;
    var selection;

    for (controllerIndex = 0; controllerIndex < this.controllers.length; controllerIndex++) {
        player = null;

        for (p = 0; p < this.players.length; p++) {
            if (this.players[p].controller.id === this.controllers[controllerIndex].id) {
                player = this.players[p];
                break;
            }
        }

        if (player) {
            selectedPlayers.push({
                player: player,
                controllerIndex: controllerIndex
            });
        }
    }

    partySize = selectedPlayers.length;

    for (i = 0; i < selectedPlayers.length; i++) {
        selection = selectedPlayers[i];
        player = selection.player;
        controllerIndex = selection.controllerIndex;
        renderIndex = i;
        tmpl = this.classNodes[player.classIndex].template;

        member = {
            id: tmpl.id + "_" + controllerIndex,
            name: tmpl.name,
            portrait: tmpl.portrait,
            classIcon: tmpl.classIcon,
            stand: tmpl.stand,
            hpCurrent: tmpl.hpMax,
            hpMax: tmpl.hpMax,
            themeIndex: player.controller.themeIndex,
            attackMinigame: tmpl.attackMinigame,
            gamepadIndex: player.controller.gamepadIndex, // Map to correct gamepad
            controls: player.controller.controls,
            moveControls: player.controller.moveControls,
            flipStandX: GraveFallGame.scene.Game.getPartyMemberFlippedX(renderIndex, partySize),
            attackDamage: tmpl.attackDamage,
            runPaletteKey: this.runPaletteKey,
            x: GraveFallGame.scene.Game.getPartyMenuX(renderIndex, partySize, menuWidth, screenWidth),
            y: 592,
            partyRenderIndex: renderIndex,
            partySize: partySize
        };

        activeParty.push(member);
    }

    for (i = 0; i < activeParty.length; i++) {
        activeParty[i].activePartyIndex = i;
    }

    GraveFallGame.scene.Game.PARTY_MEMBERS = activeParty;
    this.application.scenes.load([new GraveFallGame.scene.Game(activeParty, this.runPaletteKey)]);
};