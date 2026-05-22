//------------------------------------------------------------------------------
// Minigame phase logic
//------------------------------------------------------------------------------

GraveFallGame.scene.Game.prototype.startMinigamePhase = function () {
    var i;
    var menu;

    if (typeof this.hideAllCharacterMenuTooltips === "function") {
        this.hideAllCharacterMenuTooltips();
    }

    this.phase = GraveFallGame.scene.Game.PHASE_MINIGAME;
    this.minigameTimer = this.getMinigameDurationMs();
    this.minigameDurationMs = this.minigameTimer;

    if (typeof this.clearAllHealingStandAnimations === "function") {
        this.clearAllHealingStandAnimations(true);
    }

    if (this.turnTimerText) {
        this.turnTimerText.visible = false;
    }

    for (i = 0; i < this.playerMenus.length; i++) {
        menu = this.playerMenus[i];

        if (menu.healthCurrent > 0 && menu.selectedAction === 0) {
            this.setupPlayerMinigame(menu);
            menu.stand.visible = false;
            menu.stand.alpha = 0;
        }
    }
};

GraveFallGame.scene.Game.prototype.getMinigameDefinition = function (minigameId) {
    var definitions = GraveFallGame.scene.Game.MINIGAME_DEFINITIONS || {};
    var fallback = GraveFallGame.scene.Game.DEFAULT_ATTACK_MINIGAME || "buttonSequence";

    if (definitions[minigameId]) {
        return definitions[minigameId];
    }

    return definitions[fallback] || null;
};

GraveFallGame.scene.Game.prototype.createMinigamePanel = function (menu, title, width, height) {
    var theme = menu.theme || this.getPlayerTheme(0);
    var uiSkin = this.uiSkin || GraveFallGame.scene.Game.UI_SKINS.dullBrown;
    var framePaletteSwaps = this.getFramePaletteSwaps(uiSkin);
    var group = new rune.display.DisplayObjectContainer(0, 0, width, height);
    var bg = new rune.display.Graphic(0, 0, width, height);
    var innerBg = new rune.display.Graphic(4, 4, width - 8, height - 8);
    var accent = new rune.display.Graphic(16, 16, width - 32, 2);
    var timerBack = new rune.display.Graphic(16, height - 16, width - 32, 4);
    var timerFill = new rune.display.Graphic(16, height - 16, width - 32, 4);
    var frame = this.createBoxFrame(0, 0, width, height, framePaletteSwaps);
    var scoreText = new rune.text.BitmapField("DMG +0");

    bg.backgroundColor = uiSkin.panelBottom;
    innerBg.backgroundColor = uiSkin.panelTop;
    accent.backgroundColor = theme.accentDark;
    timerBack.backgroundColor = "#1A1A1A";
    timerFill.backgroundColor = theme.accent;

    scoreText.autoSize = true;
    scoreText.scaleX = 1;
    scoreText.scaleY = 1;
    scoreText.y = 6;

    group.addChild(bg);
    group.addChild(innerBg);
    group.addChild(accent);
    group.addChild(timerBack);
    group.addChild(timerFill);
    group.addChild(frame);
    group.addChild(scoreText);

    group.minigameTimerFill = timerFill;
    group.minigameScoreText = scoreText;

    this.positionMinigameScoreText(group);

    return group;
};

GraveFallGame.scene.Game.prototype.setMinigameFeedback = function (menu, text) {
    if (!menu || !menu.minigame || !menu.minigame.feedbackText) {
        return;
    }

    if (!text) {
        menu.minigame.feedbackText.visible = false;
        return;
    }

    // Rune BitmapField should not be rendered while it contains an empty string;
    // an empty BitmapField can produce a 0x0 internal canvas and crash drawImage.
    menu.minigame.feedbackText.text = String(text);
    menu.minigame.feedbackText.visible = true;
    this.centerMinigameText(menu.minigame.feedbackText, menu.minigame.group.width, menu.minigame.feedbackText.y);
};

GraveFallGame.scene.Game.prototype.createHiddenMinigameFeedbackText = function (y) {
    var feedback = new rune.text.BitmapField("READY");

    feedback.autoSize = true;
    feedback.scaleX = 1;
    feedback.scaleY = 1;
    feedback.y = y || 102;
    feedback.visible = false;

    return feedback;
};

GraveFallGame.scene.Game.prototype.centerMinigameText = function (textField, width, y) {
    if (!textField) {
        return;
    }

    textField.autoSize = true;
    textField.x = Math.round((width / 2) - (textField.width / 2));
    textField.y = y;
};

GraveFallGame.scene.Game.prototype.positionMinigameScoreText = function (group) {
    var scoreText;

    if (!group || !group.minigameScoreText) {
        return;
    }

    scoreText = group.minigameScoreText;
    scoreText.autoSize = true;
    scoreText.x = group.width - scoreText.width - 12;
    scoreText.y = 6;
};

GraveFallGame.scene.Game.prototype.updateMinigameHud = function (menu) {
    var damage;
    var timerScale;

    if (!menu || !menu.minigame || !menu.minigame.group) {
        return;
    }

    damage = Math.floor(menu.minigame.storedDamage || 0);

    if (menu.minigame.group.minigameScoreText) {
        menu.minigame.group.minigameScoreText.text = "DMG +" + damage;
        this.positionMinigameScoreText(menu.minigame.group);
    }

    if (menu.minigame.group.minigameTimerFill) {
        timerScale = this.minigameDurationMs > 0 ? this.minigameTimer / this.minigameDurationMs : 0;
        menu.minigame.group.minigameTimerFill.scaleX = Math.max(0, Math.min(1, timerScale));
    }
};

GraveFallGame.scene.Game.prototype.createOptionalMinigameSprite = function (resourceName, x, y, width, height, fallbackColor) {
    var display;

    if (this.resourceExists(resourceName)) {
        display = new rune.display.Sprite(x, y, width, height, resourceName);
    } else {
        display = new rune.display.Graphic(x, y, width, height);
        display.backgroundColor = fallbackColor || "#FFFFFF";
    }

    return display;
};

GraveFallGame.scene.Game.prototype.createThemedMinigameSprite = function (resourceNames, x, y, width, height, fallbackColor, targetColor) {
    var i;
    var resourceName = null;
    var display;

    if (typeof resourceNames === "string") {
        resourceNames = [resourceNames];
    }

    for (i = 0; i < resourceNames.length; i++) {
        if (this.resourceExists(resourceNames[i])) {
            resourceName = resourceNames[i];
            break;
        }
    }

    display = this.createOptionalMinigameSprite(resourceName || resourceNames[0], x, y, width, height, fallbackColor);

    if (resourceName && targetColor) {
        this.applyMonochromeIconColor(display, targetColor);
    }

    return display;
};

GraveFallGame.scene.Game.prototype.getButtonIconForDirection = function (direction) {
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

GraveFallGame.scene.Game.prototype.getButtonLabelForDirection = function (direction) {
    if (direction === "up") {
        return "Y";
    }

    if (direction === "left") {
        return "X";
    }

    if (direction === "right") {
        return "B";
    }

    return "A";
};

GraveFallGame.scene.Game.prototype.getButtonPositionLabelForDirection = function (direction) {
    if (direction === "up") {
        return "TOP";
    }

    if (direction === "left") {
        return "LEFT";
    }

    if (direction === "right") {
        return "RIGHT";
    }

    return "BOTTOM";
};

GraveFallGame.scene.Game.prototype.getGamepadMovementIconForDirection = function (direction) {
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

GraveFallGame.scene.Game.prototype.getMovementLabelForDirection = function (direction) {
    if (direction === "up") {
        return "UP";
    }

    if (direction === "left") {
        return "LEFT";
    }

    if (direction === "right") {
        return "RIGHT";
    }

    return "DOWN";
};

GraveFallGame.scene.Game.prototype.getSequenceIconForDirection = function (direction) {
    var resource = this.getGamepadMovementIconForDirection(direction);

    if (this.resourceExists(resource)) {
        return resource;
    }

    return this.getButtonIconForDirection(direction);
};

GraveFallGame.scene.Game.prototype.createMinigameIcon = function (resource, x, y, scale) {
    var icon = new rune.display.Sprite(x, y, 100, 100, resource);

    icon.scaleX = scale || 0.42;
    icon.scaleY = scale || 0.42;

    return icon;
};

GraveFallGame.scene.Game.prototype.layoutPlayerMinigame = function (menu) {
    var group;
    var gap;

    if (!menu || !menu.minigame || !menu.minigame.group) {
        return;
    }

    group = menu.minigame.group;
    gap = 8;

    group.x = Math.round(menu.container.x + (menu.container.width / 2) - (group.width / 2));
    group.y = Math.round(menu.container.y - group.height - gap);

    group.visible = true;
    group.alpha = 1;
};

GraveFallGame.scene.Game.prototype.setupPlayerMinigame = function (menu) {
    var definition;
    var setupName;

    definition = this.getMinigameDefinition(menu.attackMinigame);

    if (!definition) {
        return;
    }

    setupName = definition.setup;

    if (typeof this[setupName] !== "function") {
        return;
    }

    this[setupName](menu, definition);
    this.layoutPlayerMinigame(menu);
};

GraveFallGame.scene.Game.prototype.setButtonMashPromptIcon = function (menu, resource, x, y, scale) {
    var minigame = menu.minigame;
    var icon;

    if (!minigame || !minigame.group) {
        return null;
    }

    if (minigame.buttonIcon && minigame.buttonIcon.parent) {
        minigame.buttonIcon.parent.removeChild(minigame.buttonIcon, true);
    }

    icon = this.createMinigameIcon(resource, x, y, scale);
    this.applyMonochromeIconColor(icon, menu.theme.accent);
    minigame.buttonIcon = icon;
    minigame.group.addChild(icon);

    return icon;
};

GraveFallGame.scene.Game.prototype.getButtonMashIconResource = function (direction) {
    return this.getButtonIconForDirection(direction);
};

GraveFallGame.scene.Game.prototype.clearButtonMashPromptIcons = function (menu) {
    var i;
    var icons;

    if (!menu || !menu.minigame || !menu.minigame.buttonIcons) {
        return;
    }

    icons = menu.minigame.buttonIcons;

    for (i = icons.length - 1; i >= 0; i--) {
        if (icons[i].parent) {
            icons[i].parent.removeChild(icons[i], true);
        }
    }

    menu.minigame.buttonIcons = [];
};

GraveFallGame.scene.Game.prototype.createCenteredMinigameIcon = function (resource, centerX, centerY, scale) {
    var size = Math.round(100 * (scale || 0.42));

    return this.createMinigameIcon(resource, Math.round(centerX - (size / 2)), Math.round(centerY - (size / 2)), scale);
};

GraveFallGame.scene.Game.prototype.setButtonMashPromptMatrix = function (menu, activeDirection) {
    var minigame = menu.minigame;
    var group;
    var directions = ["up", "left", "right", "down"];
    var yOffset = minigame.promptMatrixYOffset || 0;
    var centers = {
        up: { x: 128, y: 54 + yOffset },
        left: { x: 109, y: 70 + yOffset },
        right: { x: 147, y: 70 + yOffset },
        down: { x: 128, y: 86 + yOffset }
    };
    var i;
    var direction;
    var isActive;
    var icon;
    var scale;

    if (!minigame || !minigame.group) {
        return;
    }

    group = minigame.group;

    if (!minigame.buttonIcons) {
        minigame.buttonIcons = [];
    }

    this.clearButtonMashPromptIcons(menu);

    for (i = 0; i < directions.length; i++) {
        direction = directions[i];
        isActive = direction === activeDirection;
        scale = isActive ? 0.33 : 0.27;
        icon = this.createCenteredMinigameIcon(
            this.getButtonMashIconResource(direction),
            centers[direction].x,
            centers[direction].y,
            scale
        );

        this.applyMonochromeIconColor(icon, isActive ? menu.theme.accent : "#DADADA");
        icon.alpha = isActive ? 1 : 0.48;

        group.addChild(icon);
        minigame.buttonIcons.push(icon);
    }
};

// Minigame button prompts are face-button prompts, not D-pad/left-stick prompts.
// Keyboard fallback stays on each player's existing movement keys for debug/keyboard play.
GraveFallGame.scene.Game.prototype.getPressedMinigameDirection = function (menu) {
    if (this.isDevConsoleInputActive && this.isDevConsoleInputActive()) {
        return null;
    }

    if (this.keyboard.justPressed(menu.moveControls.up)) {
        return "up";
    }

    if (this.keyboard.justPressed(menu.moveControls.left)) {
        return "left";
    }

    if (this.keyboard.justPressed(menu.moveControls.right)) {
        return "right";
    }

    if (this.keyboard.justPressed(menu.moveControls.down)) {
        return "down";
    }

    if (this.justPressedFaceUp(menu)) {
        return "up";
    }

    if (this.justPressedFaceLeft(menu)) {
        return "left";
    }

    if (this.justPressedFaceRight(menu)) {
        return "right";
    }

    if (this.justPressedFaceDown(menu)) {
        return "down";
    }

    return null;
};

GraveFallGame.scene.Game.prototype.getPressedMovementMinigameDirection = function (menu) {
    var gp;

    if (this.isDevConsoleInputActive && this.isDevConsoleInputActive()) {
        return null;
    }

    if (this.keyboard.justPressed(menu.moveControls.up)) {
        return "up";
    }

    if (this.keyboard.justPressed(menu.moveControls.left)) {
        return "left";
    }

    if (this.keyboard.justPressed(menu.moveControls.right)) {
        return "right";
    }

    if (this.keyboard.justPressed(menu.moveControls.down)) {
        return "down";
    }

    gp = this.getGamepadForInput(menu);

    if (gp) {
        if (gp.justPressed(12) || gp.stickLeftJustUp) {
            return "up";
        }

        if (gp.justPressed(14) || gp.stickLeftJustLeft) {
            return "left";
        }

        if (gp.justPressed(15) || gp.stickLeftJustRight) {
            return "right";
        }

        if (gp.justPressed(13) || gp.stickLeftJustDown) {
            return "down";
        }
    }

    if (this.justPressedFaceUp(menu)) {
        return "up";
    }

    if (this.justPressedFaceLeft(menu)) {
        return "left";
    }

    if (this.justPressedFaceRight(menu)) {
        return "right";
    }

    if (this.justPressedFaceDown(menu)) {
        return "down";
    }

    return null;
};

GraveFallGame.scene.Game.prototype.getPressedButtonMashDirection = function (menu) {
    if (!menu || !menu.minigame) {
        return null;
    }

    return this.getPressedMinigameDirection(menu);
};

GraveFallGame.scene.Game.prototype.updateButtonMashPromptText = function (menu, direction) {
    var minigame;
    var label;
    var text;

    if (!menu || !menu.minigame || !menu.minigame.promptText) {
        return;
    }

    minigame = menu.minigame;
    label = this.getButtonLabelForDirection(direction || minigame.currentMashDirection);
    text = label ? ("MASH " + label) : "MASH BUTTON";
    minigame.promptText.text = text;
    this.centerMinigameText(minigame.promptText, minigame.group.width, minigame.promptText.y);
};

GraveFallGame.scene.Game.prototype.rollButtonMashButton = function (menu) {
    var minigame = menu.minigame;
    var previous;
    var direction;

    if (!minigame) {
        return;
    }

    previous = minigame.currentMashDirection;
    direction = this.randomMinigameDirection();

    if (direction === previous) {
        direction = this.randomMinigameDirection();
    }

    minigame.currentMashDirection = direction;
    this.setButtonMashPromptMatrix(menu, direction);
    this.updateButtonMashPromptText(menu, direction);
    this.setMinigameFeedback(menu, "");
};

GraveFallGame.scene.Game.prototype.completeButtonMashCycle = function (menu) {
    var minigame = menu.minigame;
    var bonus;

    if (!minigame) {
        return;
    }

    bonus = minigame.damagePerCycle || 8;
    minigame.storedDamage += bonus;
    minigame.pressCount = 0;
    minigame.mashFill.scaleX = 0;

    this.setMinigameFeedback(menu, "");
    this.playSfx(GraveFallGame.SOUNDS.UI_CONFIRM, 0.45);
    this.rollButtonMashButton(menu);
};

GraveFallGame.scene.Game.prototype.setupButtonMashMinigame = function (menu, definition) {
    var group = this.createMinigamePanel(menu, definition.title, 256, 128);
    var prompt = new rune.text.BitmapField("MASH SHOWN");
    var barBack = new rune.display.Graphic(36, 98, 184, 8);
    var barFill = new rune.display.Graphic(36, 98, 184, 8);
    var feedback = this.createHiddenMinigameFeedbackText(108);

    barBack.backgroundColor = "#171717";
    barFill.backgroundColor = menu.theme.accent;
    barFill.scaleX = 0;

    prompt.autoSize = true;
    prompt.scaleX = 1.5;
    prompt.scaleY = 1.5;
    this.centerMinigameText(prompt, group.width, 24);

    feedback.autoSize = true;
    feedback.scaleX = 1;
    feedback.scaleY = 1;
    this.centerMinigameText(feedback, group.width, 108);

    group.addChild(prompt);
    group.addChild(barBack);
    group.addChild(barFill);
    group.addChild(feedback);

    menu.minigame = {
        active: true,
        type: definition.id,
        definition: definition,
        storedDamage: 0,
        pressCount: 0,
        maxUsefulPresses: definition.maxUsefulPresses || 18,
        damagePerCycle: definition.damagePerCycle || 8,
        currentMashDirection: null,
        group: group,
        mashFill: barFill,
        buttonIcon: null,
        buttonIcons: [],
        promptText: prompt,
        feedbackText: feedback
    };

    this.stage.addChild(group);
    this.rollButtonMashButton(menu);
};

GraveFallGame.scene.Game.prototype.updateButtonMashMinigame = function (menu) {
    var minigame;
    var ratio;
    var pressedDirection;

    minigame = menu.minigame;
    pressedDirection = this.getPressedButtonMashDirection(menu);

    if (pressedDirection === minigame.currentMashDirection) {
        minigame.pressCount += 1;
        this.playSfx(GraveFallGame.SOUNDS.UI_MOVE, 0.32);

        if (minigame.pressCount >= minigame.maxUsefulPresses) {
            this.completeButtonMashCycle(menu);
            return;
        }
    } else if (pressedDirection) {
        this.setMinigameFeedback(menu, "");
        this.playSfx(GraveFallGame.SOUNDS.UI_BACK, 0.22);
    }

    ratio = Math.min(1, minigame.pressCount / minigame.maxUsefulPresses);
    minigame.mashFill.scaleX = ratio;
};


//------------------------------------------------------------------------------
// Boss final charge / final strike logic
//------------------------------------------------------------------------------

GraveFallGame.scene.Game.prototype.setEnemyHealthBarVisible = function (visible) {
    var alpha = visible === true ? 1 : 0;

    if (this.enemyHealthBg) {
        this.enemyHealthBg.visible = visible === true;
        this.enemyHealthBg.alpha = alpha;
    }

    if (this.enemyHealthFill) {
        this.enemyHealthFill.visible = visible === true;
        this.enemyHealthFill.alpha = alpha;
    }

    if (this.enemyHealthFrame) {
        this.enemyHealthFrame.visible = visible === true;
        this.enemyHealthFrame.alpha = alpha;
    }

    if (this.enemyHealthText) {
        this.enemyHealthText.visible = visible === true;
        this.enemyHealthText.alpha = alpha;
    }
};

GraveFallGame.scene.Game.prototype.centerFinalChargeText = function (textField, containerWidth, y) {
    if (!textField) {
        return;
    }

    textField.autoSize = true;
    textField.x = Math.round((containerWidth / 2) - (textField.width / 2));
    textField.y = y;
};

GraveFallGame.scene.Game.prototype.createFinalChargeBanner = function () {
    var screenW = this.application.screen.width;
    var uiSkin = this.uiSkin || GraveFallGame.scene.Game.UI_SKINS.dullBrown;
    var framePaletteSwaps = this.getFramePaletteSwaps(uiSkin);
    var width = 840;
    var height = 122;
    var x = Math.round((screenW / 2) - (width / 2));
    var y = 126;
    var group = new rune.display.DisplayObjectContainer(0, 0, screenW, 270);
    var title = new rune.text.BitmapField("CHARGE UP YOUR FINAL STRIKE");
    var bg = new rune.display.Graphic(x, y, width, height);
    var innerBg = new rune.display.Graphic(x + 4, y + 4, width - 8, height - 8);
    var timerBack = new rune.display.Graphic(x + 36, y + 78, width - 72, 10);
    var timerFill = new rune.display.Graphic(x + 36, y + 78, width - 72, 10);
    var powerText = new rune.text.BitmapField("PARTY POWER: 0");
    var timerText = new rune.text.BitmapField("TIME LEFT");
    var frame = this.createBoxFrame(x, y, width, height, framePaletteSwaps);

    bg.backgroundColor = uiSkin.panelBottom || "#151515";
    innerBg.backgroundColor = uiSkin.panelTop || "#202020";
    timerBack.backgroundColor = "#171717";
    timerFill.backgroundColor = this.getPlayerTheme(0).accent;
    timerFill.scaleX = 1;

    title.autoSize = true;
    title.scaleX = 2.4;
    title.scaleY = 2.4;
    title.x = Math.round((screenW / 2) - ((title.text.length * 6 * title.scaleX) / 2));
    title.y = 56;

    powerText.autoSize = true;
    powerText.scaleX = 2;
    powerText.scaleY = 2;
    powerText.x = Math.round((screenW / 2) - ((powerText.text.length * 6 * powerText.scaleX) / 2));
    powerText.y = y + 32;

    timerText.autoSize = true;
    timerText.scaleX = 1;
    timerText.scaleY = 1;
    timerText.x = Math.round((screenW / 2) - ((timerText.text.length * 6 * timerText.scaleX) / 2));
    timerText.y = y + 66;

    group.addChild(title);
    group.addChild(bg);
    group.addChild(innerBg);
    group.addChild(timerBack);
    group.addChild(timerFill);
    group.addChild(frame);
    group.addChild(powerText);
    group.addChild(timerText);

    group.finalChargeTitle = title;
    group.finalChargeTimerFill = timerFill;
    group.finalChargePowerText = powerText;
    group.finalChargeTimerText = timerText;
    group.finalChargePanelWidth = width;
    this.stage.addChild(group);

    return group;
};

GraveFallGame.scene.Game.prototype.preparePlayerMenusForFinalCharge = function () {
    var i;
    var menu;

    if (!this.playerMenus) {
        return;
    }

    for (i = 0; i < this.playerMenus.length; i++) {
        menu = this.playerMenus[i];

        if (!menu) {
            continue;
        }

        menu.confirmed = true;
        menu.selectedAction = null;
        menu.selectedDefendTargetPartyIndex = null;
        menu.menuState = "main";
        menu.standActionState = null;

        if (menu.container) {
            menu.container.y = menu.confirmedY;
            menu.container.visible = true;
            menu.container.alpha = 1;
        }

        if (menu.actionsContainer) {
            menu.actionsContainer.visible = false;
            menu.actionsContainer.alpha = 0;
        }

        if (menu.selectionBar) {
            menu.selectionBar.visible = false;
            menu.selectionBar.alpha = 0;
        }

        if (menu.stand && !menu.healingStandSprite) {
            menu.stand.visible = menu.healthCurrent > 0;
            menu.stand.alpha = menu.healthCurrent > 0 ? 1 : 0;
        }

        if (menu.battleAvatar) {
            menu.battleAvatar.visible = false;
            menu.battleAvatar.alpha = 0;
        }

        if (typeof this.hideCharacterMenuTooltip === "function") {
            this.hideCharacterMenuTooltip(menu);
        }
    }
};

GraveFallGame.scene.Game.prototype.setupFinalChargeMinigame = function (menu) {
    var definition = {
        id: "finalChargeMash",
        damagePerCycle: 18,
        maxUsefulPresses: 10
    };
    var group = this.createMinigamePanel(menu, "FINAL STRIKE CHARGE", 256, 170);
    var title = new rune.text.BitmapField("FINAL STRIKE CHARGE");
    var prompt = new rune.text.BitmapField("MASH BUTTON");
    var barBack = new rune.display.Graphic(36, 116, 184, 8);
    var barFill = new rune.display.Graphic(36, 116, 184, 8);
    var powerText = new rune.text.BitmapField("POWER SCORE +0");

    if (group.minigameScoreText) {
        group.minigameScoreText.visible = false;
    }

    barBack.backgroundColor = "#171717";
    barFill.backgroundColor = menu.theme.accent;
    barFill.scaleX = 0;

    title.autoSize = true;
    title.scaleX = 1;
    title.scaleY = 1;
    this.centerMinigameText(title, group.width, 6);

    prompt.autoSize = true;
    prompt.scaleX = 1;
    prompt.scaleY = 1;
    this.centerMinigameText(prompt, group.width, 34);

    powerText.autoSize = true;
    powerText.scaleX = 1;
    powerText.scaleY = 1;
    this.centerMinigameText(powerText, group.width, 132);

    group.addChild(title);
    group.addChild(prompt);
    group.addChild(barBack);
    group.addChild(barFill);
    group.addChild(powerText);

    menu.minigame = {
        active: true,
        type: definition.id,
        definition: definition,
        isFinalCharge: true,
        storedDamage: 0,
        pressCount: 0,
        maxUsefulPresses: definition.maxUsefulPresses,
        damagePerCycle: definition.damagePerCycle,
        currentMashDirection: null,
        group: group,
        mashFill: barFill,
        buttonIcon: null,
        buttonIcons: [],
        promptMatrixYOffset: 12,
        powerText: powerText,
        promptText: prompt,
        feedbackText: null
    };

    this.stage.addChild(group);
    this.rollButtonMashButton(menu);
    this.layoutPlayerMinigame(menu);
    this.updateFinalChargeMinigameHud(menu);
};

GraveFallGame.scene.Game.prototype.getFinalChargeMenuPowerScore = function (menu) {
    if (!menu || !menu.minigame) {
        return 0;
    }

    return Math.max(0, Math.floor(menu.minigame.storedDamage || 0));
};

GraveFallGame.scene.Game.prototype.updateFinalChargeMinigameHud = function (menu) {
    var minigame;
    var score;
    var text;
    var timerScale;

    if (!menu || !menu.minigame || menu.minigame.isFinalCharge !== true) {
        return;
    }

    minigame = menu.minigame;
    score = this.getFinalChargeMenuPowerScore(menu);
    text = "POWER SCORE +" + score;

    if (minigame.powerText) {
        minigame.powerText.text = text;
        this.centerMinigameText(minigame.powerText, minigame.group.width, minigame.powerText.y);
    }

    if (minigame.group && minigame.group.minigameTimerFill) {
        timerScale = this.finalChargeDurationMs > 0 ? this.finalChargeTimerMs / this.finalChargeDurationMs : 0;
        minigame.group.minigameTimerFill.scaleX = Math.max(0, Math.min(1, timerScale));
    }
};

GraveFallGame.scene.Game.prototype.getFinalChargePartyPowerScore = function () {
    var total = 0;
    var i;

    if (!this.playerMenus) {
        return 0;
    }

    for (i = 0; i < this.playerMenus.length; i++) {
        if (this.playerMenus[i] && this.playerMenus[i].minigame && this.playerMenus[i].minigame.isFinalCharge === true) {
            total += this.getFinalChargeMenuPowerScore(this.playerMenus[i]);
        }
    }

    return total;
};

GraveFallGame.scene.Game.prototype.getFinalChargePartyPowerGoal = function () {
    var activePlayers = 0;
    var scorePerSet = 18;
    var i;
    var menu;

    if (this.playerMenus) {
        for (i = 0; i < this.playerMenus.length; i++) {
            menu = this.playerMenus[i];

            if (menu && menu.healthCurrent > 0) {
                activePlayers++;

                if (menu.minigame && menu.minigame.isFinalCharge === true && menu.minigame.damagePerCycle) {
                    scorePerSet = menu.minigame.damagePerCycle;
                }
            }
        }
    }

    return Math.max(scorePerSet, activePlayers * scorePerSet * 4);
};

GraveFallGame.scene.Game.prototype.updateFinalChargeBanner = function () {
    var total = this.getFinalChargePartyPowerScore();
    var timerRatio = this.finalChargeDurationMs > 0 ? this.finalChargeTimerMs / this.finalChargeDurationMs : 0;
    var text;
    var group = this.finalChargeUi;

    this.finalChargePartyPower = total;

    if (!group) {
        return;
    }

    if (group.finalChargeTimerFill) {
        group.finalChargeTimerFill.scaleX = Math.max(0, Math.min(1, timerRatio));
    }

    if (group.finalChargePowerText) {
        text = "PARTY POWER: " + total;
        group.finalChargePowerText.text = text;
        group.finalChargePowerText.x = Math.round((this.application.screen.width / 2) - ((text.length * 6 * group.finalChargePowerText.scaleX) / 2));
    }
};

GraveFallGame.scene.Game.prototype.clearFinalChargeUi = function () {
    var i;
    var menu;

    if (this.finalChargeUi && this.finalChargeUi.parent) {
        this.finalChargeUi.parent.removeChild(this.finalChargeUi, true);
    }

    this.finalChargeUi = null;

    if (!this.playerMenus) {
        return;
    }

    for (i = 0; i < this.playerMenus.length; i++) {
        menu = this.playerMenus[i];

        if (!menu || !menu.minigame || menu.minigame.isFinalCharge !== true) {
            continue;
        }

        menu.finalChargePowerScore = this.getFinalChargeMenuPowerScore(menu);
        this.clearButtonMashPromptIcons(menu);

        if (menu.minigame.group && menu.minigame.group.parent) {
            menu.minigame.group.parent.removeChild(menu.minigame.group, true);
        }

        menu.minigame = null;
    }
};

GraveFallGame.scene.Game.prototype.startFinalChargePhase = function () {
    var i;
    var menu;
    var anyActive = false;

    if (this.phase === GraveFallGame.scene.Game.PHASE_FINAL_CHARGE || this.phase === GraveFallGame.scene.Game.PHASE_FINAL_STRIKE) {
        return;
    }

    if (typeof this.hideAllCharacterMenuTooltips === "function") {
        this.hideAllCharacterMenuTooltips();
    }

    this.phase = GraveFallGame.scene.Game.PHASE_FINAL_CHARGE;
    this.finalChargeCompleted = false;
    this.finalChargeTimerMs = this.getFinalChargeDurationMs ? this.getFinalChargeDurationMs() : 9000;
    this.finalChargeDurationMs = this.finalChargeTimerMs;
    this.finalChargePartyPower = 0;
    this.finalChargeIntroTimerMs = this.finalChargeIntroDelayMs || 1200;
    this.minigameTimer = this.finalChargeTimerMs;
    this.minigameDurationMs = this.finalChargeDurationMs;

    if (this.turnTimerText) {
        this.turnTimerText.visible = false;
        this.turnTimerText.alpha = 0;
    }

    this.clearProjectiles();
    this.clearArenaItem();
    this.setBattleArenaVisible(false);
    this.setEnemyHealthBarVisible(false);
    this.updateEnemyDamageState();

    if (this.enemySprite) {
        this.enemySprite.visible = true;
        this.enemySprite.alpha = 1;
    }

    this.preparePlayerMenusForFinalCharge();
    this.finalChargeUi = this.createFinalChargeBanner();

    for (i = 0; i < this.playerMenus.length; i++) {
        menu = this.playerMenus[i];

        if (menu && menu.healthCurrent > 0) {
            this.setupFinalChargeMinigame(menu);
            anyActive = true;
        }
    }

    this.updateFinalChargeBanner();
    this.playSfx(GraveFallGame.SOUNDS.PHASE_START, 0.72);

    if (anyActive !== true) {
        this.finishFinalChargePhase();
    }
};

GraveFallGame.scene.Game.prototype.updateFinalChargePhase = function (step) {
    var i;
    var menu;

    if (this.finalChargeIntroTimerMs > 0) {
        this.finalChargeIntroTimerMs -= step;

        if (this.finalChargeIntroTimerMs < 0) {
            this.finalChargeIntroTimerMs = 0;
        }

        this.minigameTimer = this.finalChargeTimerMs;

        for (i = 0; i < this.playerMenus.length; i++) {
            menu = this.playerMenus[i];

            if (menu && menu.healthCurrent > 0 && menu.minigame && menu.minigame.isFinalCharge === true) {
                this.updateFinalChargeMinigameHud(menu);
            }
        }

        this.updateFinalChargeBanner();
        return;
    }

    this.finalChargeTimerMs -= step;

    if (this.finalChargeTimerMs < 0) {
        this.finalChargeTimerMs = 0;
    }

    this.minigameTimer = this.finalChargeTimerMs;

    for (i = 0; i < this.playerMenus.length; i++) {
        menu = this.playerMenus[i];

        if (menu && menu.healthCurrent > 0 && menu.minigame && menu.minigame.isFinalCharge === true) {
            this.updateButtonMashMinigame(menu);
            this.updateFinalChargeMinigameHud(menu);
        }
    }

    this.updateFinalChargeBanner();

    if (this.finalChargeTimerMs <= 0) {
        this.finishFinalChargePhase();
    }
};

GraveFallGame.scene.Game.prototype.finishFinalChargePhase = function () {
    var totalPower = this.getFinalChargePartyPowerScore();

    this.finalChargePartyPower = totalPower;
    this.playSfx(GraveFallGame.SOUNDS.PHASE_END, 0.62);

    if (totalPower > 0) {
        this.addScorePopup(totalPower * 10, "FINAL POWER");
    }

    this.clearFinalChargeUi();
    this.startFinalStrikeSequence();
};

GraveFallGame.scene.Game.prototype.getFinalStrikeRepetitionCount = function (partySize) {
    if (partySize <= 1) {
        return 5;
    }

    if (partySize === 2) {
        return 4;
    }

    if (partySize === 3) {
        return 3;
    }

    return 2;
};

GraveFallGame.scene.Game.prototype.buildFinalStrikeQueue = function () {
    var living = [];
    var queue = [];
    var i;
    var round;
    var repeats;

    if (!this.playerMenus) {
        return queue;
    }

    for (i = 0; i < this.playerMenus.length; i++) {
        if (this.playerMenus[i] && this.playerMenus[i].healthCurrent > 0) {
            living.push(this.playerMenus[i]);
        }
    }

    repeats = this.getFinalStrikeRepetitionCount(living.length);

    for (round = 0; round < repeats; round++) {
        for (i = 0; i < living.length; i++) {
            queue.push(living[i]);
        }
    }

    return queue;
};

GraveFallGame.scene.Game.prototype.getFinalStrikeDamageForPlayer = function (playerMenu) {
    var i;
    var playerStrikeCount = 0;
    var playerPower = Math.max(0, playerMenu && playerMenu.finalChargePowerScore ? playerMenu.finalChargePowerScore : 0);

    if (this.finalStrikeQueue) {
        for (i = 0; i < this.finalStrikeQueue.length; i++) {
            if (this.finalStrikeQueue[i] === playerMenu) {
                playerStrikeCount++;
            }
        }
    }

    playerStrikeCount = Math.max(1, playerStrikeCount);

    return Math.max(1, Math.floor(playerPower / playerStrikeCount));
};

GraveFallGame.scene.Game.prototype.startFinalStrikeSequence = function () {
    this.phase = GraveFallGame.scene.Game.PHASE_FINAL_STRIKE;
    this.finalStrikeQueue = this.buildFinalStrikeQueue();
    this.finalStrikeIndex = 0;
    this.finalStrikeTimerMs = 0;
    this.finalStrikeCurrentMenu = null;
    this.preparePlayerMenusForFinalCharge();
    this.setEnemyHealthBarVisible(false);

    if (this.finalChargeUi) {
        this.finalChargeUi.visible = false;
    }

    if (this.enemySprite) {
        this.enemySprite.visible = true;
        this.enemySprite.alpha = 1;
        this.setDamageStateGroupState(this.enemySprite, "killed");
    }

    if (this.finalStrikeQueue.length <= 0) {
        this.finalChargeCompleted = true;
        this.startEnemyDefeatedSequence();
        return;
    }

    this.beginFinalStrikeStep();
};

GraveFallGame.scene.Game.prototype.beginFinalStrikeStep = function () {
    var menu;
    var damage;

    if (!this.finalStrikeQueue || this.finalStrikeIndex >= this.finalStrikeQueue.length) {
        this.finishFinalStrikeSequence();
        return;
    }

    menu = this.finalStrikeQueue[this.finalStrikeIndex];

    if (!menu || menu.healthCurrent <= 0) {
        this.finalStrikeIndex++;
        this.beginFinalStrikeStep();
        return;
    }

    this.finalStrikeCurrentMenu = menu;
    this.finalStrikeTimerMs = this.finalStrikeStepDurationMs || 520;
    menu.standActionState = "itemAttack";
    this.updatePlayerDamageState(menu, this.areAllPlayersDown());
    this.startPlayerActionPreviewShake(menu, 0);

    damage = this.getFinalStrikeDamageForPlayer(menu);
    this.setDamageStateGroupState(this.enemySprite, "killed");
    this.createEnemyDamagePopup(damage, menu.theme.accent);
    this.spawnEnemyDamageParticles(damage);
    this.setEnemyPreviewFlash(280);
    this.startEnemyDamagePreviewShake(280, 10, 6);
    this.shakeCamera(180, 6, 4, true);
    this.playActionPreviewSfx(menu, 0, true);
};

GraveFallGame.scene.Game.prototype.updateFinalStrikePhase = function (step) {
    if (!this.finalStrikeQueue || this.finalStrikeQueue.length <= 0) {
        this.finishFinalStrikeSequence();
        return;
    }

    this.finalStrikeTimerMs -= step;

    if (this.finalStrikeTimerMs > 0) {
        return;
    }

    if (this.finalStrikeCurrentMenu) {
        this.restorePlayerActionPreviewShake(this.finalStrikeCurrentMenu);
        this.finalStrikeCurrentMenu.standActionState = null;
        this.updatePlayerDamageState(this.finalStrikeCurrentMenu, this.areAllPlayersDown());
    }

    this.finalStrikeIndex++;

    if (this.finalStrikeIndex >= this.finalStrikeQueue.length) {
        this.finishFinalStrikeSequence();
        return;
    }

    this.beginFinalStrikeStep();
};

GraveFallGame.scene.Game.prototype.clearFinalStrikeState = function () {
    var i;

    if (this.playerMenus) {
        for (i = 0; i < this.playerMenus.length; i++) {
            if (this.playerMenus[i]) {
                this.restorePlayerActionPreviewShake(this.playerMenus[i]);
                this.playerMenus[i].standActionState = null;
            }
        }
    }

    this.finalStrikeQueue = [];
    this.finalStrikeIndex = 0;
    this.finalStrikeTimerMs = 0;
    this.finalStrikeCurrentMenu = null;
};

GraveFallGame.scene.Game.prototype.finishFinalStrikeSequence = function () {
    this.clearFinalStrikeState();
    this.finalChargeCompleted = true;
    this.setEnemyHealthBarVisible(false);
    this.startEnemyDefeatedSequence();
};

GraveFallGame.scene.Game.prototype.buildSequenceIcons = function (menu) {
    var i;
    var directionIcon;
    var buttonIcon;
    var sequence;
    var group;
    var startX;
    var direction;
    var directionScale;
    var buttonScale;
    var spacing;
    var centerX;
    var activeDirectionScale;
    var activeButtonScale;

    sequence = menu.minigame.sequence;
    group = menu.minigame.group;

    if (menu.minigame.sequenceIcons) {
        for (i = menu.minigame.sequenceIcons.length - 1; i >= 0; i--) {
            if (menu.minigame.sequenceIcons[i].parent) {
                menu.minigame.sequenceIcons[i].parent.removeChild(menu.minigame.sequenceIcons[i], true);
            }
        }
    }

    if (menu.minigame.sequenceLabels) {
        for (i = menu.minigame.sequenceLabels.length - 1; i >= 0; i--) {
            if (menu.minigame.sequenceLabels[i].parent) {
                menu.minigame.sequenceLabels[i].parent.removeChild(menu.minigame.sequenceLabels[i], true);
            }
        }
    }

    menu.minigame.sequenceIcons = [];
    menu.minigame.sequenceLabels = [];

    spacing = Math.max(32, Math.min(36, Math.floor((group.width - 72) / Math.max(1, sequence.length - 1))));
    directionScale = 0.34;
    buttonScale = 0.28;
    activeDirectionScale = 0.38;
    activeButtonScale = 0.31;
    startX = Math.round((group.width / 2) - (((sequence.length - 1) * spacing) / 2));

    for (i = 0; i < sequence.length; i++) {
        direction = sequence[i];
        centerX = startX + (i * spacing);
        directionIcon = this.createCenteredMinigameIcon(this.getSequenceIconForDirection(direction), centerX, 61, directionScale);
        buttonIcon = this.createCenteredMinigameIcon(this.getButtonIconForDirection(direction), centerX, 96, buttonScale);

        if (i < menu.minigame.sequenceIndex) {
            this.applyMonochromeIconColor(directionIcon, "#BBBBBB");
            this.applyMonochromeIconColor(buttonIcon, "#BBBBBB");
            directionIcon.alpha = 0.45;
            buttonIcon.alpha = 0.45;
        } else if (i === menu.minigame.sequenceIndex) {
            this.applyMonochromeIconColor(directionIcon, menu.theme.accent);
            this.applyMonochromeIconColor(buttonIcon, menu.theme.accent);
            directionIcon.scaleX = activeDirectionScale;
            directionIcon.scaleY = activeDirectionScale;
            directionIcon.x = Math.round(centerX - ((100 * directionIcon.scaleX) / 2));
            directionIcon.y = Math.round(61 - ((100 * directionIcon.scaleY) / 2));
            buttonIcon.scaleX = activeButtonScale;
            buttonIcon.scaleY = activeButtonScale;
            buttonIcon.x = Math.round(centerX - ((100 * buttonIcon.scaleX) / 2));
            buttonIcon.y = Math.round(96 - ((100 * buttonIcon.scaleY) / 2));
        } else {
            this.applyMonochromeIconColor(directionIcon, "#E8E8E8");
            this.applyMonochromeIconColor(buttonIcon, "#E8E8E8");
            directionIcon.alpha = 0.95;
            buttonIcon.alpha = 0.95;
        }

        group.addChild(directionIcon);
        group.addChild(buttonIcon);
        menu.minigame.sequenceIcons.push(directionIcon);
        menu.minigame.sequenceLabels.push(buttonIcon);
    }
};

GraveFallGame.scene.Game.prototype.randomMinigameDirection = function () {
    var directions = ["up", "left", "right", "down"];
    return directions[Math.floor(Math.random() * directions.length)];
};

GraveFallGame.scene.Game.prototype.rollButtonSequence = function (menu) {
    var i;

    menu.minigame.sequence = [];

    for (i = 0; i < menu.minigame.sequenceLength; i++) {
        menu.minigame.sequence.push(this.randomMinigameDirection());
    }

    menu.minigame.sequenceIndex = 0;
    this.buildSequenceIcons(menu);
};

GraveFallGame.scene.Game.prototype.setupButtonSequenceMinigame = function (menu, definition) {
    var group = this.createMinigamePanel(menu, definition.title, 256, 128);
    var prompt = new rune.text.BitmapField("CAST THE SEQUENCE");
    var feedback = this.createHiddenMinigameFeedbackText(106);

    prompt.autoSize = true;
    prompt.scaleX = 1.5;
    prompt.scaleY = 1.5;
    this.centerMinigameText(prompt, group.width, 24);

    feedback.autoSize = true;
    feedback.scaleX = 1;
    feedback.scaleY = 1;
    this.centerMinigameText(feedback, group.width, 106);

    group.addChild(prompt);
    group.addChild(feedback);

    menu.minigame = {
        active: true,
        type: definition.id,
        definition: definition,
        storedDamage: 0,
        group: group,
        sequence: [],
        sequenceIcons: [],
        sequenceLabels: [],
        sequenceIndex: 0,
        sequenceLength: definition.sequenceLength || 5,
        feedbackText: feedback
    };

    this.stage.addChild(group);
    this.rollButtonSequence(menu);
};

GraveFallGame.scene.Game.prototype.updateButtonSequenceMinigame = function (menu) {
    var pressed;
    var expected;
    var minigame;

    minigame = menu.minigame;
    pressed = this.getPressedMovementMinigameDirection(menu);

    if (!pressed) {
        return;
    }

    expected = minigame.sequence[minigame.sequenceIndex];

    if (pressed === expected) {
        minigame.storedDamage += minigame.definition.damagePerInput || 1;
        minigame.sequenceIndex += 1;
        this.playSfx(GraveFallGame.SOUNDS.UI_MOVE, 0.42);

        if (minigame.sequenceIndex >= minigame.sequence.length) {
            minigame.storedDamage += minigame.definition.damagePerSequence || 3;
            this.setMinigameFeedback(menu, "");
            this.rollButtonSequence(menu);
        } else {
            this.setMinigameFeedback(menu, "");
            this.buildSequenceIcons(menu);
        }
    } else {
        minigame.sequenceIndex = 0;
        minigame.storedDamage = Math.max(0, minigame.storedDamage - (minigame.definition.wrongPenalty || 1));
        this.setMinigameFeedback(menu, "");
        this.playSfx(GraveFallGame.SOUNDS.UI_BACK, 0.35);
        this.buildSequenceIcons(menu);
    }
};

GraveFallGame.scene.Game.prototype.setupTargetReticleMinigame = function (menu, definition) {
    var group = this.createMinigamePanel(menu, definition.title, 256, 128);
    var prompt = new rune.text.BitmapField("HIT THE TARGET");
    var target = new rune.display.Graphic(72, 46, 112, 40);
    var bullseye = this.createThemedMinigameSprite(["MG_Ranger_Bullseye_T", "MG_Ranger_Bullseye"], 120, 58, 16, 16, menu.theme.accentDark, menu.theme.accentDark);
    var centerDot = new rune.display.Graphic(126, 64, 4, 4);
    var reticle = this.createThemedMinigameSprite(["MG_Ranger_Reticle_T", "MG_Ranger_Reticle"], 120, 58, 16, 16, menu.theme.accentLight, menu.theme.accentLight);
    var feedback = this.createHiddenMinigameFeedbackText(102);

    target.backgroundColor = "#191919";
    target.alpha = 1;
    centerDot.backgroundColor = menu.theme.accent;
    reticle.alpha = 0.95;

    prompt.autoSize = true;
    prompt.scaleX = 2;
    prompt.scaleY = 2;
    this.centerMinigameText(prompt, group.width, 26);

    feedback.autoSize = true;
    feedback.scaleX = 1;
    feedback.scaleY = 1;
    this.centerMinigameText(feedback, group.width, 102);

    group.addChild(prompt);
    group.addChild(target);
    group.addChild(bullseye);
    group.addChild(centerDot);
    group.addChild(reticle);
    group.addChild(feedback);

    menu.minigame = {
        active: true,
        type: definition.id,
        definition: definition,
        storedDamage: 0,
        group: group,
        targetX: 72,
        targetY: 46,
        targetWidth: 112,
        targetHeight: 40,
        centerX: 128,
        centerY: 66,
        time: Math.random() * 1000,
        jitterX: 0,
        jitterY: 0,
        jitterTimer: 0,
        hitCooldown: 0,
        resetForce: 1,
        resetAngle: Math.random() * Math.PI * 2,
        settleDurationMs: definition.settleDurationMs || 850,
        resetDistance: definition.resetDistance || 62,
        reticle: reticle,
        feedbackText: feedback
    };

    this.stage.addChild(group);
};

GraveFallGame.scene.Game.prototype.resetTargetReticleAim = function (menu) {
    var minigame = menu.minigame;

    if (!minigame) {
        return;
    }

    minigame.resetForce = 1;
    minigame.resetAngle = Math.random() * Math.PI * 2;
    minigame.jitterTimer = 220 + Math.random() * 180;
    minigame.jitterX = -18 + Math.random() * 36;
    minigame.jitterY = -10 + Math.random() * 20;
};

// --- UPDATED TO USE UNIVERSAL INPUT HELPERS ---
GraveFallGame.scene.Game.prototype.updateTargetReticleMinigame = function (menu, step) {
    var minigame;
    var t;
    var radius;
    var rx;
    var ry;
    var dx;
    var dy;
    var distance;
    var bonus;
    var confirmPressed;
    var resetOffsetX;
    var resetOffsetY;

    minigame = menu.minigame;
    minigame.time += step;
    minigame.jitterTimer -= step;
    minigame.hitCooldown -= step;
    minigame.resetForce = Math.max(0, minigame.resetForce - (step / (minigame.settleDurationMs || 850)));
    
    confirmPressed = this.justPressedConfirm(menu);

    if (minigame.jitterTimer <= 0) {
        minigame.jitterTimer = 160 + Math.random() * 260;
        minigame.jitterX = -12 + Math.random() * 24;
        minigame.jitterY = -6 + Math.random() * 12;
    }

    t = minigame.time / 1000;
    radius = 26 * (0.35 + (minigame.resetForce * 0.65));
    resetOffsetX = Math.cos(minigame.resetAngle) * (minigame.resetDistance || 62) * minigame.resetForce;
    resetOffsetY = Math.sin(minigame.resetAngle) * (minigame.resetDistance || 62) * 0.55 * minigame.resetForce;
    rx = minigame.centerX + Math.sin(t * 5.2) * radius + Math.sin(t * 13.1) * 10 + minigame.jitterX + resetOffsetX;
    ry = minigame.centerY + Math.cos(t * 4.1) * 8 + Math.sin(t * 9.7) * 5 + minigame.jitterY + resetOffsetY;

    rx = Math.max(minigame.targetX + 4, Math.min(minigame.targetX + minigame.targetWidth - 20, rx));
    ry = Math.max(minigame.targetY + 4, Math.min(minigame.targetY + minigame.targetHeight - 20, ry));

    minigame.reticle.x = rx;
    minigame.reticle.y = ry;

    if (confirmPressed && minigame.hitCooldown <= 0) {
        dx = (rx + 8) - minigame.centerX;
        dy = (ry + 8) - minigame.centerY;
        distance = Math.sqrt((dx * dx) + (dy * dy));
        bonus = 0;

        if (distance <= 6) {
            bonus = minigame.definition.perfectDamage || 5;
            this.setMinigameFeedback(menu, "PERFECT +" + bonus);
        } else if (distance <= 12) {
            bonus = minigame.definition.goodDamage || 3;
            this.setMinigameFeedback(menu, "GOOD +" + bonus);
        } else if (distance <= 20) {
            bonus = minigame.definition.okDamage || 1;
            this.setMinigameFeedback(menu, "OK +" + bonus);
        } else {
            this.setMinigameFeedback(menu, "MISS");
        }

        minigame.storedDamage += bonus;
        minigame.hitCooldown = minigame.definition.shotCooldownMs || 280;
        this.playSfx(bonus > 0 ? GraveFallGame.SOUNDS.UI_CONFIRM : GraveFallGame.SOUNDS.UI_BACK, 0.38);
    }

    if (confirmPressed) {
        this.resetTargetReticleAim(menu);
    }
};

GraveFallGame.scene.Game.prototype.resetTimingBlock = function (menu) {
    var minigame = menu.minigame;

    minigame.blockX = -minigame.blockWidth - Math.random() * 80;
    minigame.speed = (minigame.definition.baseSpeed || 0.22) + Math.random() * (minigame.definition.speedVariance || 0.12);
    minigame.block.x = minigame.barX + minigame.blockX;
};

GraveFallGame.scene.Game.prototype.setupTimingBarMinigame = function (menu, definition) {
    var group = this.createMinigamePanel(menu, definition.title, 256, 128);
    var prompt = new rune.text.BitmapField("TIME THE STRIKE");
    var bar = this.createOptionalMinigameSprite("MG_Rogue_Bar_Back", 30, 58, 196, 20, "#191919");
    var hitZone = this.createThemedMinigameSprite(["MG_Rogue_HitZone_T", "MG_Rogue_HitZone"], 118, 54, 20, 28, menu.theme.accentDark, menu.theme.accentDark);
    var centerLine = new rune.display.Graphic(127, 52, 2, 32);
    var block = this.createThemedMinigameSprite(["MG_Rogue_Timing_Block_T", "MG_Rogue_Timing_Block"], 30, 56, 14, 24, menu.theme.accentLight, menu.theme.accentLight);
    var feedback = this.createHiddenMinigameFeedbackText(102);

    centerLine.backgroundColor = menu.theme.accent;
    block.alpha = 0.9;

    prompt.autoSize = true;
    prompt.scaleX = 2;
    prompt.scaleY = 2;
    this.centerMinigameText(prompt, group.width, 26);

    feedback.autoSize = true;
    feedback.scaleX = 1;
    feedback.scaleY = 1;
    this.centerMinigameText(feedback, group.width, 102);

    group.addChild(prompt);
    group.addChild(bar);
    group.addChild(hitZone);
    group.addChild(centerLine);
    group.addChild(block);
    group.addChild(feedback);

    menu.minigame = {
        active: true,
        type: definition.id,
        definition: definition,
        storedDamage: 0,
        group: group,
        barX: 30,
        barWidth: 196,
        hitCenterX: 128,
        block: block,
        blockX: 0,
        blockWidth: 14,
        speed: 0,
        feedbackText: feedback
    };

    this.stage.addChild(group);
    this.resetTimingBlock(menu);
};

// --- UPDATED TO USE UNIVERSAL INPUT HELPERS ---
GraveFallGame.scene.Game.prototype.updateTimingBarMinigame = function (menu, step) {
    var minigame;
    var blockCenter;
    var distance;
    var bonus;

    minigame = menu.minigame;
    minigame.blockX += minigame.speed * step;
    minigame.block.x = minigame.barX + minigame.blockX;

    if (minigame.blockX > minigame.barWidth + 8) {
        this.resetTimingBlock(menu);
        this.setMinigameFeedback(menu, "READY");
        return;
    }

    if (this.justPressedConfirm(menu)) {
        blockCenter = minigame.block.x + (minigame.blockWidth / 2);
        distance = Math.abs(blockCenter - minigame.hitCenterX);
        bonus = 0;

        if (distance <= 4) {
            bonus = minigame.definition.perfectDamage || 5;
            this.setMinigameFeedback(menu, "PERFECT +" + bonus);
        } else if (distance <= 12) {
            bonus = minigame.definition.goodDamage || 3;
            this.setMinigameFeedback(menu, "GOOD +" + bonus);
        } else if (distance <= 24) {
            bonus = minigame.definition.okDamage || 1;
            this.setMinigameFeedback(menu, "OK +" + bonus);
        } else {
            this.setMinigameFeedback(menu, "MISS");
        }

        minigame.storedDamage += bonus;
        this.playSfx(bonus > 0 ? GraveFallGame.SOUNDS.UI_CONFIRM : GraveFallGame.SOUNDS.UI_BACK, 0.36);
        this.resetTimingBlock(menu);
    }
};

GraveFallGame.scene.Game.prototype.updatePlayerMinigame = function (menu, step) {
    var definition;
    var updateName;

    if (!menu || !menu.minigame || menu.minigame.active !== true) {
        return;
    }

    this.layoutPlayerMinigame(menu);

    definition = menu.minigame.definition || this.getMinigameDefinition(menu.minigame.type);

    if (!definition) {
        return;
    }

    updateName = definition.update;

    if (typeof this[updateName] === "function") {
        this[updateName](menu, step);
    }

    this.updateMinigameHud(menu);
};

GraveFallGame.scene.Game.prototype.updateMinigamePhase = function (step) {
    var i;
    var menu;

    this.minigameTimer -= step;

    if (this.minigameTimer < 0) {
        this.minigameTimer = 0;
    }

    for (i = 0; i < this.playerMenus.length; i++) {
        menu = this.playerMenus[i];

        if (menu.minigame && menu.minigame.active) {
            this.updatePlayerMinigame(menu, step);
        }
    }

    if (this.minigameTimer <= 0) {
        this.endMinigamePhase();
    }
};

GraveFallGame.scene.Game.prototype.cleanupPlayerMinigame = function (menu) {
    if (!menu || !menu.minigame) {
        return;
    }

    if (menu.minigame.group && menu.minigame.group.parent) {
        menu.minigame.group.parent.removeChild(menu.minigame.group, true);
    }

    menu.minigame.active = false;
    menu.minigame = null;

    if (menu.stand) {
        menu.stand.visible = true;
        menu.stand.alpha = 1;
    }
};

GraveFallGame.scene.Game.prototype.endMinigamePhase = function () {
    var i;
    var menu;

    for (i = 0; i < this.playerMenus.length; i++) {
        menu = this.playerMenus[i];

        if (!menu.minigame) {
            continue;
        }

        menu.attackDamageBonus = Math.floor(menu.minigame.storedDamage || 0);
        this.cleanupPlayerMinigame(menu);
    }

    if (this.turnTimerText) {
        this.turnTimerText.visible = false;
    }

    this.startActionPreviewPhase();
};