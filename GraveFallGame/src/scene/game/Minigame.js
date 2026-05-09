//------------------------------------------------------------------------------
// Minigame phase logic
//------------------------------------------------------------------------------

GraveFallGame.scene.Game.prototype.startMinigamePhase = function () {
    var i;
    var menu;

    this.phase = GraveFallGame.scene.Game.PHASE_MINIGAME;
    this.minigameTimer = 10000;
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

// --- UPDATED TO USE UNIVERSAL INPUT HELPERS ---
GraveFallGame.scene.Game.prototype.getPressedMinigameDirection = function (menu) {
    if (this.justPressedUp(menu)) {
        return "up";
    }

    if (this.justPressedLeft(menu)) {
        return "left";
    }

    if (this.justPressedRight(menu)) {
        return "right";
    }

    if (this.justPressedDown(menu)) {
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
    this.setButtonMashPromptIcon(menu, this.getButtonMashIconResource(direction), 101, 43, 0.55);
    this.setMinigameFeedback(menu, "MASH " + this.getButtonLabelForDirection(direction));
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

    this.setMinigameFeedback(menu, "MAX +" + bonus);
    this.playSfx(GraveFallGame.SOUNDS.UI_CONFIRM, 0.45);
    this.rollButtonMashButton(menu);
};

GraveFallGame.scene.Game.prototype.setupButtonMashMinigame = function (menu, definition) {
    var group = this.createMinigamePanel(menu, definition.title, 256, 128);
    var prompt = new rune.text.BitmapField("MASH SHOWN");
    var barBack = new rune.display.Graphic(36, 92, 184, 8);
    var barFill = new rune.display.Graphic(36, 92, 184, 8);
    var feedback = this.createHiddenMinigameFeedbackText(102);

    barBack.backgroundColor = "#171717";
    barFill.backgroundColor = menu.theme.accent;
    barFill.scaleX = 0;

    prompt.autoSize = true;
    prompt.scaleX = 2;
    prompt.scaleY = 2;
    this.centerMinigameText(prompt, group.width, 26);

    feedback.autoSize = true;
    feedback.scaleX = 1;
    feedback.scaleY = 1;
    this.centerMinigameText(feedback, group.width, 102);

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
        this.setMinigameFeedback(menu, "MASH " + this.getButtonLabelForDirection(minigame.currentMashDirection));
        this.playSfx(GraveFallGame.SOUNDS.UI_BACK, 0.22);
    }

    ratio = Math.min(1, minigame.pressCount / minigame.maxUsefulPresses);
    minigame.mashFill.scaleX = ratio;
};

GraveFallGame.scene.Game.prototype.buildSequenceIcons = function (menu) {
    var i;
    var icon;
    var sequence;
    var group;
    var startX;
    var direction;

    sequence = menu.minigame.sequence;
    group = menu.minigame.group;

    if (menu.minigame.sequenceIcons) {
        for (i = menu.minigame.sequenceIcons.length - 1; i >= 0; i--) {
            if (menu.minigame.sequenceIcons[i].parent) {
                menu.minigame.sequenceIcons[i].parent.removeChild(menu.minigame.sequenceIcons[i], true);
            }
        }
    }

    menu.minigame.sequenceIcons = [];
    startX = Math.round((group.width / 2) - ((sequence.length * 38) / 2));

    for (i = 0; i < sequence.length; i++) {
        direction = sequence[i];
        icon = this.createMinigameIcon(this.getButtonIconForDirection(direction), startX + (i * 38), 52, 0.34);

        if (i < menu.minigame.sequenceIndex) {
            this.applyMonochromeIconColor(icon, "#BBBBBB");
            icon.alpha = 0.45;
        } else if (i === menu.minigame.sequenceIndex) {
            this.applyMonochromeIconColor(icon, menu.theme.accent);
            icon.scaleX = 0.40;
            icon.scaleY = 0.40;
            icon.y -= 4;
        } else {
            this.applyMonochromeIconColor(icon, "#E8E8E8");
            icon.alpha = 0.95;
        }

        group.addChild(icon);
        menu.minigame.sequenceIcons.push(icon);
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
    var feedback = this.createHiddenMinigameFeedbackText(102);

    prompt.autoSize = true;
    prompt.scaleX = 2;
    prompt.scaleY = 2;
    this.centerMinigameText(prompt, group.width, 26);

    feedback.autoSize = true;
    feedback.scaleX = 1;
    feedback.scaleY = 1;
    this.centerMinigameText(feedback, group.width, 102);

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
    pressed = this.getPressedMinigameDirection(menu);

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
            this.setMinigameFeedback(menu, "COMPLETE +" + String(minigame.definition.damagePerSequence || 3));
            this.rollButtonSequence(menu);
        } else {
            this.setMinigameFeedback(menu, "GOOD");
            this.buildSequenceIcons(menu);
        }
    } else {
        minigame.sequenceIndex = 0;
        minigame.storedDamage = Math.max(0, minigame.storedDamage - (minigame.definition.wrongPenalty || 1));
        this.setMinigameFeedback(menu, "RESET");
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