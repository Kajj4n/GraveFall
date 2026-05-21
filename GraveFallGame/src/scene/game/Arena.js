//------------------------------------------------------------------------------
// Arena / battle state
//------------------------------------------------------------------------------

GraveFallGame.scene.Game.prototype.createBattleArena = function () {
    var uiSkin = this.uiSkin || GraveFallGame.scene.Game.UI_SKINS.dullBrown;
    var framePaletteSwaps = this.getFramePaletteSwaps(uiSkin);
    var screenWidth = this.application.screen.width;
    var arenaX = 16;
    var arenaY = 188;
    var arenaWidth = screenWidth - 32;
    var arenaHeight = 392;

    this.arena = {
        x: arenaX,
        y: arenaY,
        width: arenaWidth,
        height: arenaHeight
    };

    this.arenaBackground = new rune.display.Graphic(arenaX, arenaY, arenaWidth, arenaHeight);
    this.arenaBackground.backgroundColor = "#000000";
    this.arenaBackground.visible = false;
    this.stage.addChild(this.arenaBackground);

    this.arenaProjectileLayer = new rune.display.DisplayObjectContainer(arenaX, arenaY, arenaWidth, arenaHeight);
    this.arenaProjectileLayer.visible = false;
    this.stage.addChild(this.arenaProjectileLayer);

    this.arenaAvatarLayer = new rune.display.DisplayObjectContainer(arenaX, arenaY, arenaWidth, arenaHeight);
    this.arenaAvatarLayer.visible = false;
    this.stage.addChild(this.arenaAvatarLayer);

    this.arenaFrame = this.createBoxFrame(arenaX, arenaY, arenaWidth, arenaHeight, framePaletteSwaps);
    this.arenaFrame.visible = false;
    this.stage.addChild(this.arenaFrame);

    this.actionPromptText = new rune.text.BitmapField("AVOID DAMAGE");
    this.actionPromptText.width = screenWidth;
    this.actionPromptText.height = 96;
    this.actionPromptText.scaleX = 5;
    this.actionPromptText.scaleY = 5;
    this.actionPromptText.x = Math.floor((screenWidth / 2) - ((this.actionPromptText.text.length * 6 * this.actionPromptText.scaleX) / 2));
    this.actionPromptText.y = Math.max(24, arenaY - 70);
    this.actionPromptText.visible = false;
    this.actionPromptText.alpha = 0;
    this.stage.addChild(this.actionPromptText);
};


GraveFallGame.scene.Game.prototype.setPassageBackground = function (resource, uiSkin, keepTransform) {
    var oldBackground = this.backgroundBackdrop;
    var parent;
    var insertIndex = 0;
    var newBackground;

    if (!resource || this.backgroundBackdropResource === resource) {
        return;
    }

    parent = oldBackground && oldBackground.parent ? oldBackground.parent : this.stage;

    if (oldBackground && oldBackground.parent && typeof oldBackground.parent.getChildIndex === "function") {
        insertIndex = oldBackground.parent.getChildIndex(oldBackground);
    }

    newBackground = new rune.display.Sprite(
        0,
        0,
        this.application.screen.width,
        this.application.screen.height,
        resource
    );

    this.applyPaletteSwaps(newBackground, this.getFramePaletteSwaps(uiSkin));

    if (oldBackground && keepTransform === true) {
        newBackground.x = oldBackground.x;
        newBackground.y = oldBackground.y;
        newBackground.scaleX = oldBackground.scaleX;
        newBackground.scaleY = oldBackground.scaleY;
        newBackground.alpha = oldBackground.alpha;
        newBackground.visible = oldBackground.visible;
    }

    if (oldBackground && oldBackground.parent) {
        oldBackground.parent.removeChild(oldBackground, true);
    }

    if (typeof parent.addChildAt === "function") {
        parent.addChildAt(newBackground, insertIndex);
    } else {
        parent.addChild(newBackground);
    }

    this.backgroundBackdrop = newBackground;
    this.backgroundBackdropResource = resource;
};

GraveFallGame.scene.Game.prototype.setBattleArenaVisible = function (visible) {
    this.arenaBackground.visible = visible;
    this.arenaProjectileLayer.visible = visible;
    this.arenaAvatarLayer.visible = visible;
    this.arenaFrame.visible = visible;

    if (visible !== true && this.actionPromptText) {
        this.actionPromptTimerFrames = 0;
        this.actionPromptText.visible = false;
        this.actionPromptText.alpha = 0;
    }
};

GraveFallGame.scene.Game.prototype.showActionPromptForFirstEnemy = function () {
    if (this.encounterIndex === 0 && this.actionPromptText) {
        this.actionPromptTimerFrames = 150;
        this.actionPromptText.visible = true;
        this.actionPromptText.alpha = 1;
        this.actionPromptText.x = Math.floor((this.application.screen.width / 2) - ((this.actionPromptText.text.length * 6 * this.actionPromptText.scaleX) / 2));
    } else if (this.actionPromptText) {
        this.actionPromptTimerFrames = 0;
        this.actionPromptText.visible = false;
        this.actionPromptText.alpha = 0;
    }
};

GraveFallGame.scene.Game.prototype.updateActionPromptTimer = function () {
    if (!this.actionPromptText) {
        return;
    }

    if (this.actionPromptTimerFrames > 0) {
        this.actionPromptTimerFrames--;
        this.actionPromptText.visible = true;
        this.actionPromptText.alpha = 1;

        if (this.actionPromptTimerFrames <= 0) {
            this.actionPromptText.visible = false;
            this.actionPromptText.alpha = 0;
        }
    } else {
        this.actionPromptText.visible = false;
        this.actionPromptText.alpha = 0;
    }
};

GraveFallGame.scene.Game.prototype.hideActionPrompt = function () {
    this.actionPromptTimerFrames = 0;

    if (this.actionPromptText) {
        this.actionPromptText.visible = false;
        this.actionPromptText.alpha = 0;
    }
};

GraveFallGame.scene.Game.prototype.layoutBattleAvatarsInArena = function () {
    var inner = this.getArenaInnerBounds();
    var livingCount = 0;
    var i;
    var slotIndex = 0;
    var avatar;
    var spacing;
    var targetX;
    var targetY;

    for (i = 0; i < this.playerMenus.length; i++) {
        if (this.playerMenus[i].healthCurrent > 0) {
            livingCount++;
        }
    }

    if (livingCount <= 0) {
        livingCount = this.playerMenus.length;
    }

    spacing = inner.width / (livingCount + 1);
    targetY = inner.y + inner.height - 90;

    for (i = 0; i < this.playerMenus.length; i++) {
        if (this.playerMenus[i].healthCurrent <= 0) {
            this.playerMenus[i].battleAvatar.visible = false;
            continue;
        }

        avatar = this.playerMenus[i].battleAvatar;
        avatar.visible = true;
        avatar.alpha = 1;
        avatar.flippedX = GraveFallGame.scene.Game.getPartyMemberFlippedX(
            typeof this.playerMenus[i].partyRenderIndex === "number" ? this.playerMenus[i].partyRenderIndex : i,
            this.playerMenus[i].partySize || this.playerMenus.length
        );

        targetX = inner.x + (spacing * (slotIndex + 1)) - (avatar.width / 2);
        avatar.x = targetX;
        avatar.y = targetY;
        slotIndex++;
    }
};

GraveFallGame.scene.Game.prototype.activateBattleAvatar = function (playerMenu) {
    playerMenu.stand.visible = false;
    playerMenu.battleAvatar.visible = playerMenu.healthCurrent > 0;
    playerMenu.battleAvatar.alpha = 1;
};

GraveFallGame.scene.Game.prototype.deactivateBattleAvatar = function (playerMenu) {
    playerMenu.stand.visible = true;
    playerMenu.stand.alpha = 1;
    playerMenu.battleAvatar.visible = false;
    playerMenu.battleAvatar.alpha = 1;
};

GraveFallGame.scene.Game.prototype.getCurrentPartyName = function () {
    var partyName = "THE FALLEN";

    if (typeof this.partyName === "string" && this.partyName.trim().length > 0) {
        return this.partyName.trim();
    }

    if (typeof GraveFallGame.scene.Game.PARTY_NAME === "string" && GraveFallGame.scene.Game.PARTY_NAME.trim().length > 0) {
        return GraveFallGame.scene.Game.PARTY_NAME.trim();
    }

    if (typeof GraveFallGame.scene.Game.PARTY_NAME === "undefined") {
        return partyName;
    }

    return String(GraveFallGame.scene.Game.PARTY_NAME);
};

// --- DYNAMIC LOCALSTORAGE SAVING DIRECTLY IN ARENA.JS ---
GraveFallGame.scene.Game.prototype.saveCurrentRunToLeaderboard = function () {
    var partyName;
    var partySize;
    var key;
    var scores = [];

    if (this.gameOverLeaderboardSaved === true) {
        return;
    }

    this.gameOverLeaderboardSaved = true;

    partyName = this.getCurrentPartyName();
    partySize = (this.partyMembers && this.partyMembers.length) ||
        (this.playerMenus && this.playerMenus.length) ||
        1;

    key = "gravefall_highscores_" + partySize;

    try {
        var data = window.localStorage.getItem(key);
        if (data) {
            scores = JSON.parse(data);
        }
    } catch (e) {
        console.warn("Failed to load highscores", e);
    }

    scores.push({ name: partyName, score: this.score || 0 });
    scores.sort(function (a, b) { return b.score - a.score; });
    
    scores = scores.slice(0, 10);

    try {
        window.localStorage.setItem(key, JSON.stringify(scores));
    } catch (e) {
        console.warn("Failed to save highscores", e);
    }
};

GraveFallGame.scene.Game.prototype.showGameOverAndReturnToMenu = function () {
    var partyName;
    var finalScoreStr;
    var partyNameStr;
    var promptStr;
    var centerX = Math.floor(this.application.screen.width / 2);
    var centerY = Math.floor(this.application.screen.height / 2);

    if (this.phase === GraveFallGame.scene.Game.PHASE_GAME_OVER) {
        return;
    }

    this.saveCurrentRunToLeaderboard();

    this.phase = GraveFallGame.scene.Game.PHASE_GAME_OVER;
    this.gameOverTimer = 0;
    this.gameOverTimerMs = 0;
    this.gameOverDisplayDurationMs = 20000;
    this.gameOverPartySize = this.playerMenus ? this.playerMenus.length : 1;
    this.playSfx(GraveFallGame.SOUNDS.GAME_OVER, 0.85);

    this.clearProjectiles();
    this.clearArenaItem();
    this.setBattleArenaVisible(false);
    this.updateAllPlayerDamageStates();

    this.setPlayerTransitionVisibility(false, false);
    this.setEnemyUiAlpha(0);

    if (this.backgroundBackdrop) {
        this.backgroundBackdrop.visible = false;
    }

    if (this.turnTimerText) {
        this.turnTimerText.visible = false;
    }

    if (this.scoreText) {
        this.scoreText.visible = false;
    }

    if (this.floorText) {
        this.floorText.visible = false;
    }

    if (this.scorePopups) {
        for (var i = 0; i < this.scorePopups.length; i++) {
            if (this.scorePopups[i].parent) {
                this.scorePopups[i].parent.removeChild(this.scorePopups[i], true);
            }
        }
        this.scorePopups = [];
    }

    partyName = this.getCurrentPartyName();
    partyNameStr = "PARTY: " + partyName;
    finalScoreStr = "FINAL SCORE: " + this.score;
    promptStr = "PRESS [SPACE] TO CONTINUE";

    if (!this.gameOverText) {
        this.gameOverText = new rune.text.BitmapField("GAME OVER");
        this.gameOverText.width = 800;
        this.gameOverText.height = 64;
        this.gameOverText.scaleX = 4;
        this.gameOverText.scaleY = 4;
        this.gameOverText.x = centerX - ((this.gameOverText.text.length * 6 * 4) / 2);
        this.gameOverText.y = centerY - 112;
        this.stage.addChild(this.gameOverText);
    }
    this.gameOverText.text = "GAME OVER";
    this.gameOverText.visible = true;
    this.gameOverText.alpha = 1;

    if (!this.gameOverPartyNameText) {
        this.gameOverPartyNameText = new rune.text.BitmapField(partyNameStr);
        this.gameOverPartyNameText.width = 1000;
        this.gameOverPartyNameText.height = 64;
        this.gameOverPartyNameText.scaleX = 2;
        this.gameOverPartyNameText.scaleY = 2;
        this.gameOverPartyNameText.y = centerY - 30;
        this.stage.addChild(this.gameOverPartyNameText);
    }
    this.gameOverPartyNameText.text = partyNameStr;
    this.gameOverPartyNameText.x = centerX - ((partyNameStr.length * 6 * 2) / 2);
    this.gameOverPartyNameText.visible = true;
    this.gameOverPartyNameText.alpha = 1;

    if (!this.finalScoreText) {
        this.finalScoreText = new rune.text.BitmapField(finalScoreStr);
        this.finalScoreText.width = 800;
        this.finalScoreText.height = 64;
        this.finalScoreText.scaleX = 2;
        this.finalScoreText.scaleY = 2;
        this.finalScoreText.y = centerY + 18;
        this.stage.addChild(this.finalScoreText);
    }
    this.finalScoreText.text = finalScoreStr;
    this.finalScoreText.x = centerX - ((finalScoreStr.length * 6 * 2) / 2);
    this.finalScoreText.visible = true;
    this.finalScoreText.alpha = 1;

    if (!this.gameOverInstruction) {
        this.gameOverInstruction = new rune.text.BitmapField(promptStr);
        this.gameOverInstruction.width = 800;
        this.gameOverInstruction.height = 64;
        this.gameOverInstruction.scaleX = 1.5;
        this.gameOverInstruction.scaleY = 1.5;
        this.gameOverInstruction.y = centerY + 84;
        this.stage.addChild(this.gameOverInstruction);
    }
    this.gameOverInstruction.text = promptStr;
    this.gameOverInstruction.x = centerX - ((promptStr.length * 6 * 1.5) / 2);
    this.gameOverInstruction.visible = true;
    this.gameOverInstruction.alpha = 1;

    if (typeof this.renderGameOverStats === "function") {
        this.renderGameOverStats();
    }
};

GraveFallGame.scene.Game.prototype.updateGameOver = function () {
    this.gameOverTimer++;

    if (typeof this.renderGameOverStats === "function" && !this.gameOverStatsPanel) {
        this.renderGameOverStats();
    }

    if (this.gameOverInstruction) {
        this.gameOverInstruction.alpha = (Math.floor(this.gameOverTimer / 30) % 2 === 0) ? 1 : 0;
    }

    var continuePressed = this.keyboard.justPressed("space");

    if (!continuePressed) {
        for (var i = 0; i < 4; i++) {
            var gp = null;
            try {
                gp = this.gamepads.get(i);
            } catch (e) {}
            if (gp && gp.connected && gp.justPressed(0)) {
                continuePressed = true;
                break;
            }
        }
    }

    if (!(this.isDevConsoleInputActive && this.isDevConsoleInputActive()) && continuePressed) {
        this.application.scenes.load([
            new GraveFallGame.scene.Leaderboard(this.gameOverPartySize)
        ]);
    }
};

GraveFallGame.scene.Game.prototype.setEnemyUiAlpha = function (alpha) {
    alpha = Math.max(0, Math.min(1, alpha));

    if (this.enemySprite) {
        this.enemySprite.alpha = alpha;
        this.enemySprite.visible = alpha > 0;
    }

    if (this.enemyHealthBg) {
        this.enemyHealthBg.alpha = alpha;
        this.enemyHealthBg.visible = alpha > 0;
    }

    if (this.enemyHealthFill) {
        this.enemyHealthFill.alpha = alpha;
        this.enemyHealthFill.visible = alpha > 0;
    }

    if (this.enemyHealthFrame) {
        this.enemyHealthFrame.alpha = alpha;
        this.enemyHealthFrame.visible = alpha > 0;
    }

    if (this.enemyHealthText) {
        this.enemyHealthText.alpha = alpha;
        this.enemyHealthText.visible = alpha > 0;
    }
};

GraveFallGame.scene.Game.prototype.setPlayerTransitionVisibility = function (visible, actionsVisible) {
    var i;
    var menu;
    var showMenus = visible === true && actionsVisible === true;
    var showActions = showMenus;

    if (!this.playerMenus) {
        return;
    }

    for (i = 0; i < this.playerMenus.length; i++) {
        menu = this.playerMenus[i];

        if (!menu) {
            continue;
        }

        if (menu.hideUntilNextEncounter === true) {
            if (menu.container) {
                menu.container.visible = false;
                menu.container.alpha = 0;
            }

            if (menu.actionsContainer) {
                menu.actionsContainer.visible = false;
                menu.actionsContainer.alpha = 0;
            }

            if (menu.selectionBar) {
                menu.selectionBar.visible = false;
                menu.selectionBar.alpha = 0;
            }

            if (menu.stand) {
                menu.stand.visible = false;
                menu.stand.alpha = 0;
            }

            if (menu.battleAvatar) {
                menu.battleAvatar.visible = false;
                menu.battleAvatar.alpha = 0;
            }

            continue;
        }

        if (visible !== true && typeof this.clearHealingStandAnimation === "function") {
            this.clearHealingStandAnimation(menu);
        }

        if (menu.container) {
            menu.container.visible = showMenus;
            menu.container.alpha = showMenus ? 1 : 0;
        }

        if (menu.actionsContainer) {
            menu.actionsContainer.visible = showActions;
            menu.actionsContainer.alpha = showActions ? 1 : 0;
        }

        if (menu.selectionBar) {
            menu.selectionBar.visible = showActions && menu.healthCurrent > 0;
            menu.selectionBar.alpha = showActions ? 1 : 0;
        }

        if (menu.stand) {
            menu.stand.visible = visible === true && !menu.healingStandSprite;
            menu.stand.alpha = visible === true ? 1 : 0;
        }

        if (menu.battleAvatar) {
            menu.battleAvatar.visible = false;
            menu.battleAvatar.alpha = 0;
        }
    }
};

GraveFallGame.scene.Game.prototype.setPlayerTransitionAlpha = function (playerAlpha, actionsAlpha) {
    var i;
    var menu;
    var showPlayer;
    var showMenus;

    playerAlpha = Math.max(0, Math.min(1, playerAlpha));
    actionsAlpha = Math.max(0, Math.min(1, actionsAlpha));
    showPlayer = playerAlpha > 0;
    showMenus = actionsAlpha > 0;

    if (!this.playerMenus) {
        return;
    }

    for (i = 0; i < this.playerMenus.length; i++) {
        menu = this.playerMenus[i];

        if (!menu) {
            continue;
        }

        if (menu.hideUntilNextEncounter === true) {
            if (menu.container) {
                menu.container.visible = false;
                menu.container.alpha = 0;
            }

            if (menu.actionsContainer) {
                menu.actionsContainer.visible = false;
                menu.actionsContainer.alpha = 0;
            }

            if (menu.selectionBar) {
                menu.selectionBar.visible = false;
                menu.selectionBar.alpha = 0;
            }

            if (menu.stand) {
                menu.stand.visible = false;
                menu.stand.alpha = 0;
            }

            if (menu.battleAvatar) {
                menu.battleAvatar.visible = false;
                menu.battleAvatar.alpha = 0;
            }

            continue;
        }

        if (menu.container) {
            menu.container.visible = showMenus;
            menu.container.alpha = actionsAlpha;
        }

        if (menu.actionsContainer) {
            menu.actionsContainer.visible = showMenus;
            menu.actionsContainer.alpha = 1;
        }

        if (menu.selectionBar) {
            menu.selectionBar.visible = showMenus && menu.healthCurrent > 0;
            menu.selectionBar.alpha = 1;
        }

        if (menu.stand) {
            menu.stand.visible = showPlayer && !menu.healingStandSprite;
            menu.stand.alpha = playerAlpha;
        }

        if (menu.battleAvatar) {
            menu.battleAvatar.visible = false;
            menu.battleAvatar.alpha = 0;
        }
    }
};

GraveFallGame.scene.Game.prototype.setPlayerActionMenusVisible = function (visible) {
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

        if (menu.actionsContainer) {
            menu.actionsContainer.visible = visible === true;
            menu.actionsContainer.alpha = visible === true ? 1 : 0;
        }

        if (menu.selectionBar) {
            menu.selectionBar.visible = visible === true && menu.healthCurrent > 0;
            menu.selectionBar.alpha = visible === true ? 1 : 0;
        }

        if (visible !== true && typeof this.hideCharacterMenuTooltip === "function") {
            this.hideCharacterMenuTooltip(menu);
        }
    }
};

GraveFallGame.scene.Game.prototype.updateEnemyHealthBarUi = function () {
    var eBarWidth = this.enemyHealthBarWidth || 300;
    var eBarX = typeof this.enemyHealthBarX === "number" ? this.enemyHealthBarX : (this.application.screen.width / 2) - (eBarWidth / 2);

    if (this.enemyHealthFill && this.enemyHealthMax > 0) {
        this.enemyHealthFill.scaleX = Math.max(0, Math.min(1, this.enemyHealthCurrent / this.enemyHealthMax));
    }

    if (this.enemyHealthText) {
        this.enemyHealthText.text = Math.ceil(this.enemyHealthCurrent) + "/" + this.enemyHealthMax;
        this.enemyHealthText.x = eBarX + (eBarWidth / 2) - ((this.enemyHealthText.text.length * 6 * 2) / 2);
    }
};

GraveFallGame.scene.Game.prototype.rebuildEnemySprite = function (fadeIn) {
    var enemyConfig = this.getCurrentEnemyConfig();
    var insertIndex = 0;

    if (this.enemySprite && this.enemySprite.parent) {
        this.enemySprite.parent.removeChild(this.enemySprite, true);
    }

    this.enemySprite = this.createDamageStateGroup(
        0,
        0,
        100,
        100,
        this.getEnemyDamageStates(enemyConfig)
    );
    this.enemySprite.scaleX = 3.2;
    this.enemySprite.scaleY = 3.2;
    this.enemyEntranceBaseScaleX = this.enemySprite.scaleX;
    this.enemyEntranceBaseScaleY = this.enemySprite.scaleY;
    this.enemySprite.x = (this.application.screen.width / 1) - ((this.enemySprite.width * this.enemySprite.scaleX) / 1.28);
    this.enemySprite.y = 180;
    this.enemyPreviewBaseX = this.enemySprite.x;
    this.enemyPreviewBaseY = this.enemySprite.y;
    this.setDamageStateGroupState(this.enemySprite, "hp100");
    this.enemySprite.alpha = fadeIn === true ? 0 : 1;
    this.enemySprite.visible = fadeIn !== true;

    if (this.backgroundBackdrop && this.backgroundBackdrop.parent === this.stage) {
        insertIndex = this.stage.getChildIndex(this.backgroundBackdrop) + 1;
    }

    this.stage.addChildAt(this.enemySprite, insertIndex);
    this.bossPlaceholder = this.enemySprite;
};

GraveFallGame.scene.Game.prototype.loadEnemyEncounter = function (enemyType, fadeIn) {
    var enemyConfig;
    var alpha = fadeIn === true ? 0 : 1;

    this.encounterAllyDowned = false;

    this.currentEnemyType = enemyType;
    if (typeof this.registerEnemyEncounter === "function") {
        this.registerEnemyEncounter(enemyType);
    }
    enemyConfig = this.getCurrentEnemyConfig();
    this.enemyHealthMax = enemyConfig.hpMax;
    this.enemyHealthCurrent = this.enemyHealthMax;
    this.enemyDefeatedSoundPlayed = false;

    this.rebuildEnemySprite(fadeIn);
    this.resetBossEntranceState();
    this.updateEnemyHealthBarUi();
    this.updateEnemyDamageState();
    this.setEnemyUiAlpha(alpha);

    this.enemyFadeTimerMs = fadeIn === true ? 0 : this.enemyFadeDurationMs;
};

GraveFallGame.scene.Game.prototype.resetPlayersForNewEncounter = function () {
    var i;

    for (i = 0; i < this.playerMenus.length; i++) {
        this.playerMenus[i].confirmed = false;
        this.playerMenus[i].selectedAction = null;
        this.playerMenus[i].selectedDefendTargetPartyIndex = null;
        this.playerMenus[i].standActionState = null;
        this.playerMenus[i].hideUntilNextEncounter = false;
        this.playerMenus[i].revivedFromEnemyDefeat = false;
        this.playerMenus[i].container.y = this.playerMenus[i].baseY;
        this.playerMenus[i].hitCooldown = 0;
        this.playerMenus[i].isDefending = false;
        this.playerMenus[i].temporaryDefenseBuff = false;
        this.playerMenus[i].temporarySpeedBuff = false;
        this.playerMenus[i].moveSpeed = this.calculateEffectiveMoveSpeed(this.playerMenus[i]);
        this.playerMenus[i].menuState = "main";
        this.updateCharacterMenuVisuals(this.playerMenus[i]);
        this.deactivateBattleAvatar(this.playerMenus[i]);
    }

    this.updateAllPlayerDamageStates();
};

GraveFallGame.scene.Game.prototype.getPrimaryCamera = function () {
    if (!this.cameras || typeof this.cameras.getCameraAt !== "function") {
        return null;
    }

    return this.cameras.getCameraAt(0);
};

GraveFallGame.scene.Game.prototype.easePassageTransition = function (value) {
    value = Math.max(0, Math.min(1, value));
    return value < 0.5
        ? 4 * value * value * value
        : 1 - Math.pow(-2 * value + 2, 3) / 2;
};

GraveFallGame.scene.Game.prototype.resetPassageCameraTransition = function () {
    var camera = this.getPrimaryCamera();

    if (camera && camera.viewport) {
        if (camera.viewport.zoom !== 1) {
            camera.viewport.zoom = 1;
        }

        camera.viewport.x = 0;
        camera.viewport.y = 0;
    }

    if (camera && camera.canvas) {
        camera.canvas.smoothing = false;
    }

    if (camera && camera.fade) {
        camera.fade.opacity = 0;
    }

    if (this.backgroundBackdrop) {
        this.backgroundBackdrop.scaleX = 1;
        this.backgroundBackdrop.scaleY = 1;
        this.backgroundBackdrop.x = 0;
        this.backgroundBackdrop.y = 0;
        this.backgroundBackdrop.alpha = 1;
    }
};

GraveFallGame.scene.Game.prototype.applyPassageCameraTransition = function (elapsedMs) {
    var camera = this.getPrimaryCamera();
    var walkStartMs = this.passageTransitionWalkStartMs || 1650;
    var blackStartMs = this.passageTransitionBlackStartMs || 3500;
    var fadeInStartMs = this.passageTransitionFadeInStartMs || 5200;
    var fadeInEndMs = this.passageTransitionFadeInEndMs || 6750;
    var fadeOutStartMs = walkStartMs + 350;
    var maxOpacity = 1;
    var focusX = this.passageTransitionFocusX || (this.application.screen.width / 2);
    var focusY = this.passageTransitionFocusY || (this.application.screen.height * 0.48);
    var pushProgress = 0;
    var fadeOpacity = 0;
    var scale = 1;

    if (camera && camera.viewport) {
        if (camera.viewport.zoom !== 1) {
            camera.viewport.zoom = 1;
        }

        camera.viewport.x = 0;
        camera.viewport.y = 0;
    }

    if (camera && camera.canvas) {
        camera.canvas.smoothing = false;
    }

    if (elapsedMs >= walkStartMs && elapsedMs < blackStartMs) {
        pushProgress = this.easePassageTransition((elapsedMs - walkStartMs) / Math.max(1, blackStartMs - walkStartMs));
    } else if (elapsedMs >= blackStartMs && elapsedMs < fadeInStartMs) {
        pushProgress = 1;
    }

    if (this.backgroundBackdrop) {
        scale = 1 + ((this.passageTransitionBackdropMaxScale - 1) * pushProgress);
        this.backgroundBackdrop.scaleX = scale;
        this.backgroundBackdrop.scaleY = scale;
        this.backgroundBackdrop.x = Math.round(focusX - (focusX * scale));
        this.backgroundBackdrop.y = Math.round(focusY - (focusY * scale));
    }

    if (camera && camera.fade) {
        if (elapsedMs >= fadeOutStartMs && elapsedMs < blackStartMs) {
            fadeOpacity = maxOpacity * this.easePassageTransition((elapsedMs - fadeOutStartMs) / Math.max(1, blackStartMs - fadeOutStartMs));
        } else if (elapsedMs >= blackStartMs && elapsedMs < fadeInStartMs) {
            fadeOpacity = maxOpacity;
        } else if (elapsedMs >= fadeInStartMs && elapsedMs < fadeInEndMs) {
            fadeOpacity = maxOpacity * (1 - this.easePassageTransition((elapsedMs - fadeInStartMs) / Math.max(1, fadeInEndMs - fadeInStartMs)));
        }

        camera.fade.opacity = Math.max(0, Math.min(maxOpacity, fadeOpacity));
    }
};

GraveFallGame.scene.Game.prototype.loadNextEnemyEncounterDuringTransition = function () {
    if (this.passageTransitionEncounterLoaded === true) {
        return;
    }

    this.passageTransitionEncounterLoaded = true;

    if (this.backgroundBackdropResource !== "Background_Test") {
        this.setPassageBackground("Background_Test", this.uiSkin || GraveFallGame.scene.Game.UI_SKINS.dullBrown, false);
    }

    if (this.passageTransitionIsIntro === true) {
        this.passageTransitionIsIntro = false;
        this.loadEnemyEncounter(this.currentEnemyType, true);
    } else {
        this.encounterIndex++;
        this.loadEnemyEncounter(this.getEnemyTypeForEncounter(this.encounterIndex), true);
    }

    this.resetPlayersForNewEncounter();
    this.setEnemyUiAlpha(0);
    this.setPlayerTransitionVisibility(false, false);
    this.setPlayerTransitionAlpha(0, 0);
    this.resetCommandTurnTimer(false, 0);
    this.hideActionPrompt();
};

GraveFallGame.scene.Game.prototype.finishEnemyDefeatedTransitionToCommand = function () {
    if (this.passageTransitionEncounterLoaded !== true) {
        this.loadNextEnemyEncounterDuringTransition();
    }

    this.resetPassageCameraTransition();
    this.startDungeonMusic();
    this.phase = GraveFallGame.scene.Game.PHASE_COMMAND;
    this.resetCommandTurnTimer(true, 1);
    this.enemyFadeTimerMs = this.enemyFadeDurationMs;
    this.setEnemyUiAlpha(1);
    this.resetPlayerMenusForCommandPhase();
    this.setPlayerTransitionVisibility(true, true);
    this.setPlayerTransitionAlpha(1, 1);
    this.setPlayerActionMenusVisible(true);
    this.commandMenuResetDone = true;
};

GraveFallGame.scene.Game.prototype.startEnemyDefeatedSequence = function () {
    var i;

    if (this.phase === GraveFallGame.scene.Game.PHASE_ENEMY_DEFEATED) {
        return;
    }

    if (typeof this.clearAllHealingStandAnimations === "function") {
        this.clearAllHealingStandAnimations(true);
    }

    this.clearActionPreviewState();
    this.applyEnemyDefeatedRecovery();

    this.addScorePopup(1000, "ENEMY DEFEATED");
    
    this.addScorePopup(500, "FLOOR CLEARED");
    this.floorNumber++;
    this.floorText.text = "FLOOR: " + this.floorNumber;

    if (this.encounterAllyDowned !== true) {
        this.addScorePopup(500, "FLAWLESS BATTLE");
    }

    this.phase = GraveFallGame.scene.Game.PHASE_ENEMY_DEFEATED;
    this.enemyDefeatedTimerMs = this.passageTransitionDurationMs;
    this.passageTransitionTimerMs = 0;
    this.passageTransitionEncounterLoaded = false;
    this.passageTransitionCorpseHidden = false;
    this.passageTransitionStepsPlayed = false;
    this.passageTransitionPartyRevealed = false;
    this.passageTransitionActionsShown = false;
    this.enemyFadeTimerMs = this.enemyFadeDurationMs;
    this.clearProjectiles();
    this.clearArenaItem();
    this.setBattleArenaVisible(false);
    this.turnTimerText.visible = false;
    this.turnTimerText.alpha = 0;

    for (i = 0; i < this.playerMenus.length; i++) {
        this.playerMenus[i].standActionState = null;
        this.playerMenus[i].container.y = this.playerMenus[i].revivedFromEnemyDefeat === true
            ? this.playerMenus[i].confirmedY
            : this.playerMenus[i].baseY;
        this.updateCharacterMenuVisuals(this.playerMenus[i]);
    }

    this.updateAllPlayerDamageStates();
    this.setPlayerTransitionVisibility(true, false);
    this.updateEnemyDamageState();
    this.setEnemyUiAlpha(1);
    this.applyPassageCameraTransition(0);
};

GraveFallGame.scene.Game.prototype.startNextEnemyEncounter = function () {
    this.passageTransitionEncounterLoaded = false;
    this.loadNextEnemyEncounterDuringTransition();
    this.finishEnemyDefeatedTransitionToCommand();
};

GraveFallGame.scene.Game.prototype.resetBossEntranceState = function () {
    this.bossEntranceState = null;
    this.bossEntranceComplete = false;

    if (this.enemySprite) {
        this.enemySprite.x = typeof this.enemyPreviewBaseX === "number" ? this.enemyPreviewBaseX : this.enemySprite.x;
        this.enemySprite.y = typeof this.enemyPreviewBaseY === "number" ? this.enemyPreviewBaseY : this.enemySprite.y;
        this.enemySprite.scaleX = typeof this.enemyEntranceBaseScaleX === "number" ? this.enemyEntranceBaseScaleX : this.enemySprite.scaleX;
        this.enemySprite.scaleY = typeof this.enemyEntranceBaseScaleY === "number" ? this.enemyEntranceBaseScaleY : this.enemySprite.scaleY;
    }
};

GraveFallGame.scene.Game.prototype.isBossEntranceRequiredForCurrentEncounter = function () {
    var enemyConfig = this.getCurrentEnemyConfig ? this.getCurrentEnemyConfig() : null;

    return !!(enemyConfig && enemyConfig.isBoss === true && this.passageTransitionEncounterLoaded === true);
};

GraveFallGame.scene.Game.prototype.updateBossEntranceDuringTransition = function (elapsedMs, entranceStartMs) {
    var localMs = elapsedMs - entranceStartMs;
    var stomps = [
        { time: 0, alpha: 0.18, shakeX: 8, shakeY: 6, volume: 0.45 },
        { time: 360, alpha: 0.38, shakeX: 10, shakeY: 8, volume: 0.52 },
        { time: 720, alpha: 0.62, shakeX: 12, shakeY: 10, volume: 0.6 },
        { time: 1080, alpha: 0.84, shakeX: 14, shakeY: 12, volume: 0.68 },
        { time: 1440, alpha: 1, shakeX: 18, shakeY: 15, volume: 0.78 }
    ];
    var roars = [
        { time: 1740, shakeX: 22, shakeY: 18, volume: 0.9 },
        { time: 2040, shakeX: 18, shakeY: 14, volume: 0.82 },
        { time: 2340, shakeX: 14, shakeY: 11, volume: 0.74 }
    ];
    var completeMs = 2780;
    var alpha = 0;
    var stompIndex = -1;
    var state;
    var i;
    var impactAge;
    var impactStrength;

    if (!this.bossEntranceState || this.bossEntranceState.enemyType !== this.currentEnemyType) {
        this.bossEntranceState = {
            enemyType: this.currentEnemyType,
            lastStompIndex: -1,
            lastRoarIndex: -1
        };
        this.bossEntranceComplete = false;
    }

    state = this.bossEntranceState;

    if (localMs < 0) {
        this.setEnemyUiAlpha(0);
        return false;
    }

    for (i = 0; i < stomps.length; i++) {
        if (localMs >= stomps[i].time) {
            stompIndex = i;
            alpha = stomps[i].alpha;
        }
    }

    if (stompIndex >= 0) {
        while (state.lastStompIndex < stompIndex) {
            state.lastStompIndex++;
            this.shakeCamera(280, stomps[state.lastStompIndex].shakeX, stomps[state.lastStompIndex].shakeY, true);
            this.playSfx(GraveFallGame.SOUNDS.ATTACK_STOMP, stomps[state.lastStompIndex].volume);
        }
    }

    for (i = 0; i < roars.length; i++) {
        if (localMs >= roars[i].time && state.lastRoarIndex < i) {
            state.lastRoarIndex = i;
            this.shakeCamera(i === 0 ? 520 : 360, roars[i].shakeX, roars[i].shakeY, true);
            this.playSfx(GraveFallGame.SOUNDS.ATTACK_STOMP, roars[i].volume);
        }
    }

    this.setEnemyUiAlpha(alpha);

    if (this.enemySprite) {
        if (stompIndex >= 0) {
            impactAge = localMs - stomps[stompIndex].time;
            impactStrength = impactAge < 180 ? (1 - (impactAge / 180)) : 0;
        } else {
            impactStrength = 0;
        }

        this.enemySprite.x = (typeof this.enemyPreviewBaseX === "number" ? this.enemyPreviewBaseX : this.enemySprite.x);
        this.enemySprite.y = (typeof this.enemyPreviewBaseY === "number" ? this.enemyPreviewBaseY : this.enemySprite.y) - Math.round(12 * impactStrength);
        this.enemySprite.scaleX = (typeof this.enemyEntranceBaseScaleX === "number" ? this.enemyEntranceBaseScaleX : 3.2) + (0.14 * impactStrength);
        this.enemySprite.scaleY = (typeof this.enemyEntranceBaseScaleY === "number" ? this.enemyEntranceBaseScaleY : 3.2) + (0.14 * impactStrength);
    }

    if (localMs >= completeMs) {
        this.bossEntranceComplete = true;
        this.setEnemyUiAlpha(1);

        if (this.enemySprite) {
            this.enemySprite.x = typeof this.enemyPreviewBaseX === "number" ? this.enemyPreviewBaseX : this.enemySprite.x;
            this.enemySprite.y = typeof this.enemyPreviewBaseY === "number" ? this.enemyPreviewBaseY : this.enemySprite.y;
            this.enemySprite.scaleX = typeof this.enemyEntranceBaseScaleX === "number" ? this.enemyEntranceBaseScaleX : this.enemySprite.scaleX;
            this.enemySprite.scaleY = typeof this.enemyEntranceBaseScaleY === "number" ? this.enemyEntranceBaseScaleY : this.enemySprite.scaleY;
        }

        return true;
    }

    return false;
};

GraveFallGame.scene.Game.prototype.updateEnemyDefeatedSequence = function (step) {
    var elapsedMs;
    var playerFadeStartMs;
    var playerFadeEndMs;
    var enemyFadeStartMs;
    var enemyFadeEndMs;
    var actionsFadeStartMs;
    var actionsFadeEndMs;
    var playerAlpha;
    var enemyAlpha;
    var actionsAlpha;
    var outgoingPlayerAlpha;
    var playerFadeOutEndMs;
    var walkStartMs;
    var blackStartMs;
    var bossEntranceComplete;

    this.enemyDefeatedTimerMs -= step;
    this.passageTransitionTimerMs += step;
    elapsedMs = this.passageTransitionTimerMs;
    walkStartMs = this.passageTransitionWalkStartMs || 1650;
    blackStartMs = this.passageTransitionBlackStartMs || 3500;
    playerFadeOutEndMs = Math.min(blackStartMs, walkStartMs + (this.passageTransitionPlayerFadeOutDurationMs || 450));
    playerFadeStartMs = this.passageTransitionPlayerFadeStartMs || 6850;
    playerFadeEndMs = this.passageTransitionPlayerFadeEndMs || 7600;
    enemyFadeStartMs = this.passageTransitionEnemyFadeStartMs || 7600;
    enemyFadeEndMs = this.passageTransitionEnemyFadeEndMs || 9000;
    actionsFadeStartMs = this.passageTransitionActionsFadeStartMs || 7600;
    actionsFadeEndMs = this.passageTransitionActionsFadeEndMs || 9000;

    this.applyPassageCameraTransition(elapsedMs);

    if (this.passageTransitionCorpseHidden !== true && elapsedMs >= (this.passageTransitionCorpseVanishMs || 1100)) {
        this.passageTransitionCorpseHidden = true;

        if (this.enemyDefeatedSoundPlayed !== true) {
            this.enemyDefeatedSoundPlayed = true;
            this.playSfx(GraveFallGame.SOUNDS.ENEMY_DEFEATED, 0.8);
        }

        this.setEnemyUiAlpha(0);
    }

    if (this.passageTransitionStepsPlayed !== true && elapsedMs >= walkStartMs) {
        this.passageTransitionStepsPlayed = true;
        this.setPlayerTransitionVisibility(false, false);
        this.setPlayerTransitionAlpha(0, 0);
        this.playSfx(GraveFallGame.SOUNDS.PASSAGE_STEPS, 0.72);
    }

    if (this.passageTransitionEncounterLoaded !== true) {
        if (this.passageTransitionIsIntro === true) {
            outgoingPlayerAlpha = 0;
        } else if (elapsedMs < walkStartMs) {
            outgoingPlayerAlpha = 1;
        } else if (elapsedMs < playerFadeOutEndMs) {
            outgoingPlayerAlpha = 1 - this.easePassageTransition((elapsedMs - walkStartMs) / Math.max(1, playerFadeOutEndMs - walkStartMs));
        } else {
            outgoingPlayerAlpha = 0;
        }

        this.setPlayerTransitionVisibility(outgoingPlayerAlpha > 0, false);
        this.setPlayerTransitionAlpha(outgoingPlayerAlpha, 0);
    }

    if (elapsedMs >= (this.passageTransitionLoadEncounterMs || 4200)) {
        this.loadNextEnemyEncounterDuringTransition();
    }

    if (this.passageTransitionPartyRevealed !== true && elapsedMs >= (this.passageTransitionFadeInEndMs || 6750)) {
        this.passageTransitionPartyRevealed = true;
        this.resetPassageCameraTransition();
        this.setEnemyUiAlpha(0);
        this.setPlayerTransitionVisibility(true, false);
        this.setPlayerTransitionAlpha(0, 0);
        this.turnTimerText.visible = false;
        this.turnTimerText.alpha = 0;
    }

    if (this.passageTransitionEncounterLoaded === true) {
        if (this.isBossEntranceRequiredForCurrentEncounter()) {
            bossEntranceComplete = this.updateBossEntranceDuringTransition(elapsedMs, enemyFadeStartMs);

            if (elapsedMs < playerFadeStartMs) {
                playerAlpha = 0;
            } else if (elapsedMs < playerFadeEndMs) {
                playerAlpha = this.easePassageTransition((elapsedMs - playerFadeStartMs) / Math.max(1, playerFadeEndMs - playerFadeStartMs));
            } else {
                playerAlpha = 1;
            }

            this.setPlayerTransitionVisibility(playerAlpha > 0, false);
            this.setPlayerTransitionAlpha(playerAlpha, 0);
            this.turnTimerText.visible = false;
            this.turnTimerText.alpha = 0;

            if (bossEntranceComplete === true && this.passageTransitionActionsShown !== true) {
                this.passageTransitionActionsShown = true;
                this.finishEnemyDefeatedTransitionToCommand();
                return;
            }
        } else {
            if (elapsedMs < enemyFadeStartMs) {
                enemyAlpha = 0;
            } else if (elapsedMs < enemyFadeEndMs) {
                enemyAlpha = this.easePassageTransition((elapsedMs - enemyFadeStartMs) / Math.max(1, enemyFadeEndMs - enemyFadeStartMs));
            } else {
                enemyAlpha = 1;
            }

            this.setEnemyUiAlpha(enemyAlpha);

            if (elapsedMs < playerFadeStartMs) {
                playerAlpha = 0;
            } else if (elapsedMs < playerFadeEndMs) {
                playerAlpha = this.easePassageTransition((elapsedMs - playerFadeStartMs) / Math.max(1, playerFadeEndMs - playerFadeStartMs));
            } else {
                playerAlpha = 1;
            }

            if (elapsedMs < actionsFadeStartMs) {
                actionsAlpha = 0;
                this.setPlayerTransitionVisibility(playerAlpha > 0, false);
                this.setPlayerTransitionAlpha(playerAlpha, actionsAlpha);
                this.turnTimerText.visible = false;
                this.turnTimerText.alpha = 0;
            } else if (elapsedMs < actionsFadeEndMs) {
                actionsAlpha = this.easePassageTransition((elapsedMs - actionsFadeStartMs) / Math.max(1, actionsFadeEndMs - actionsFadeStartMs));
                this.setPlayerTransitionVisibility(true, true);
                if (elapsedMs < playerFadeEndMs) {
                    playerAlpha = this.easePassageTransition((elapsedMs - playerFadeStartMs) / Math.max(1, playerFadeEndMs - playerFadeStartMs));
                } else {
                    playerAlpha = 1;
                }
                this.setPlayerTransitionAlpha(playerAlpha, actionsAlpha);
                this.turnTimerText.visible = true;
                this.turnTimerText.alpha = actionsAlpha;
                this.turnTimerText.text = this.getTurnTimerLabel();
            } else {
                actionsAlpha = 1;
                this.setEnemyUiAlpha(1);
                this.setPlayerTransitionVisibility(true, true);
                this.setPlayerTransitionAlpha(1, 1);
                this.setPlayerActionMenusVisible(true);
                this.turnTimerText.visible = true;
                this.turnTimerText.alpha = 1;
                this.turnTimerText.text = this.getTurnTimerLabel();

                if (this.passageTransitionActionsShown !== true) {
                    this.passageTransitionActionsShown = true;
                    this.finishEnemyDefeatedTransitionToCommand();
                    return;
                }
            }
        }
    }

    if (this.enemyDefeatedTimerMs <= 0) {
        if (this.isBossEntranceRequiredForCurrentEncounter() && this.bossEntranceComplete !== true) {
            return;
        }

        this.finishEnemyDefeatedTransitionToCommand();
    }
};

GraveFallGame.scene.Game.prototype.startActionPhase = function () {
    var enemy = this.getCurrentEnemyConfig();
    var i;

    if (typeof this.hideAllCharacterMenuTooltips === "function") {
        this.hideAllCharacterMenuTooltips();
    }

    if (this.commandActionsResolved !== true) {
        this.resolveCommandPhaseActions();
        this.commandActionsResolved = true;
    }

    if (typeof this.clearAllHealingStandAnimations === "function") {
        this.clearAllHealingStandAnimations(false);
    }

    if (this.enemyHealthCurrent <= 0) {
        this.startEnemyDefeatedSequence();
        return;
    }

    this.clearArenaItem();
    this.itemSpawnTimer = Math.floor(this.randomRange(90, 240));
    this.turnTimerText.alpha = 0;
    this.phase = GraveFallGame.scene.Game.PHASE_ACTION;
    this.playSfx(GraveFallGame.SOUNDS.PHASE_START, 0.65);
    this.actionPhaseTimer = this.getActionPhaseDurationFrames(enemy);
    this.nextPatternIn = 0;
    this.actionPhaseStartDelayFrames = 60;
    this.showActionPromptForFirstEnemy();

    this.clearProjectiles();
    this.setBattleArenaVisible(true);
    this.layoutBattleAvatarsInArena();

    for (i = 0; i < this.playerMenus.length; i++) {
        this.playerMenus[i].container.y = this.playerMenus[i].confirmedY;
        this.playerMenus[i].hitCooldown = 0;
        this.playerMenus[i].moveSpeed = this.calculateEffectiveMoveSpeed(this.playerMenus[i]);
        this.activateBattleAvatar(this.playerMenus[i]);
    }
};

GraveFallGame.scene.Game.prototype.endActionPhase = function () {
    var i;

    this.phase = GraveFallGame.scene.Game.PHASE_COMMAND;
    this.playSfx(GraveFallGame.SOUNDS.PHASE_END, 0.5);
    this.actionPhaseTimer = 0;
    this.nextPatternIn = 0;
    this.actionPhaseStartDelayFrames = 0;
    this.hideActionPrompt();
    this.commandActionsResolved = false;
    this.clearProjectiles();
    this.setBattleArenaVisible(false);
    this.clearArenaItem();

    this.resetCommandTurnTimer(true, 1);

    for (i = 0; i < this.playerMenus.length; i++) {
        this.playerMenus[i].confirmed = false;
        this.playerMenus[i].selectedAction = null;
        this.playerMenus[i].selectedDefendTargetPartyIndex = null;
        this.playerMenus[i].standActionState = null; 
        this.playerMenus[i].container.y = this.playerMenus[i].baseY;
        this.playerMenus[i].hitCooldown = 0;
        this.playerMenus[i].isDefending = false;
        this.playerMenus[i].temporaryDefenseBuff = false;
        this.playerMenus[i].temporarySpeedBuff = false;
        this.playerMenus[i].moveSpeed = this.calculateEffectiveMoveSpeed(this.playerMenus[i]);
        
        this.playerMenus[i].menuState = "main";
        if (typeof this.restorePlayerCommandMenuVisibility === "function") {
            this.restorePlayerCommandMenuVisibility(this.playerMenus[i]);
        } else {
            this.updateCharacterMenuVisuals(this.playerMenus[i]);
        }

        this.deactivateBattleAvatar(this.playerMenus[i]);
    }

    this.updateAllPlayerDamageStates();

    if (this.areAllPlayersDown()) {
        this.showGameOverAndReturnToMenu();
    }
};

GraveFallGame.scene.Game.prototype.clearProjectiles = function () {
    var i;

    if (!this.projectiles) {
        this.projectiles = [];
        return;
    }

    for (i = this.projectiles.length - 1; i >= 0; i--) {
        if (this.projectiles[i].parent) {
            this.projectiles[i].parent.removeChild(this.projectiles[i], true);
        }
        this.projectiles[i] = null;
    }

    this.projectiles = [];
};

GraveFallGame.scene.Game.prototype.createProjectileDisplay = function (options) {
    var display;
    
    // SCALE CONSTANTS
    var dmgMulti = this.getDifficultyMultiplier ? this.getDifficultyMultiplier() : 1.0;
    var spdMulti = this.getDifficultySpeedMultiplier ? this.getDifficultySpeedMultiplier() : 1.0;

    options = options || {};

    if (options.resource) {
        display = new rune.display.Sprite(options.x, options.y, options.width, options.height, options.resource);
        this.applyPaletteSwaps(
            display,
            this.getProjectilePaletteSwaps(options.projectilePalette)
        );

        this.applyProjectileAnimation(display, options.animation);
    } else {
        display = new rune.display.Graphic(options.x, options.y, options.width, options.height);
        display.backgroundColor = options.color || "#FFFFFF";
    }

    if (options.rotation) {
        display.rotation = options.rotation;
    }

    if (options.flippedX === true) {
        display.flippedX = true;
    }

    if (typeof options.alpha === "number") {
        display.alpha = options.alpha;
    }

    display.vx = (options.vx || 0) * spdMulti;
    display.vy = (options.vy || 0) * spdMulti;
    display.damage = Math.ceil((typeof options.damage === "number" ? options.damage : 8) * dmgMulti);
    display.pendingDamage = display.damage;
    display.baseAlpha = typeof options.alpha === "number" ? options.alpha : 1;
    display.startDelay = Math.max(0, Math.floor(options.startDelay || 0));
    display.activateSfx = options.activateSfx || null;
    display.life = options.life || 180;
    display.maxLife = display.life;
    display.age = 0;
    display.type = options.type || "generic";

    if (display.startDelay > 0) {
        display.visible = false;
        display.alpha = 0;
        display.damage = 0;
    }

    display.hitboxLeeway = this.getProjectileHitboxLeeway(options);
    this.setObjectHitboxInset(display, display.hitboxLeeway, display.hitboxLeeway);
    display.hitFlashFrames = 0;
    display.hit = false;
    display.pierce = options.pierce === true;
    display.hitPlayers = {};
    display.spin = options.spin || 0;
    display.bounce = options.bounce === true;
    display.bouncesRemaining = typeof options.bouncesRemaining === "number" ? options.bouncesRemaining : 999;
    display.splitAt = typeof options.splitAt === "number" ? options.splitAt : null;
    display.splitDone = false;
    display.splitCount = options.splitCount || 0;
    display.splitSpeed = (options.splitSpeed || 3) * spdMulti;
    display.splitLife = options.splitLife || 160;
    display.splitDamage = Math.ceil((options.splitDamage || Math.max(1, Math.ceil((options.damage||8) * 0.6))) * dmgMulti);
    display.splitResource = options.splitResource || options.resource || "Orb_Attack_T";
    display.splitWidth = options.splitWidth || Math.max(8, Math.floor(options.width || 16));
    display.splitHeight = options.splitHeight || Math.max(8, Math.floor(options.height || 16));
    display.splitRemoveParent = options.splitRemoveParent === true;
    display.explodeOnExpire = options.explodeOnExpire === true;
    display.explodeOnHit = options.explodeOnHit === true;
    display.exploded = false;
    display.explosionRadius = options.explosionRadius || 72;
    display.explosionDamage = Math.ceil((options.explosionDamage || 12) * dmgMulti);
    display.explosionLife = options.explosionLife || 22;
    display.explosionResource = options.explosionResource || "Explosion_Circle_Attack_Big_T";
    display.explosionAnimation = options.explosionAnimation || {
        name: "explode",
        frames: [0, 1, 2, 3, 4, 5],
        framerate: 14,
        looped: false
    };
    display.shrapnelCount = options.shrapnelCount || 0;
    display.shrapnelSpeed = (options.shrapnelSpeed || 4.2) * spdMulti;
    display.shrapnelDamage = Math.ceil((options.shrapnelDamage || 6) * dmgMulti);
    display.shrapnelLife = options.shrapnelLife || 150;
    display.shrapnelResource = options.shrapnelResource || "Bone_Shard_Attack_T";
    display.shrapnelWidth = options.shrapnelWidth || 16;
    display.shrapnelHeight = options.shrapnelHeight || 8;
    display.shrapnelBounce = options.shrapnelBounce === true;
    display.shrapnelBouncesRemaining = typeof options.shrapnelBouncesRemaining === "number" ? options.shrapnelBouncesRemaining : 999;
    
    var baseShrapnelMaxSpeed = typeof options.shrapnelMaxSpeed === "number" ? options.shrapnelMaxSpeed : null;
    display.shrapnelMaxSpeed = baseShrapnelMaxSpeed !== null ? baseShrapnelMaxSpeed * spdMulti : null;
    
    display.shrapnelFadeOutFrames = Math.max(0, Math.floor(options.shrapnelFadeOutFrames || 0));

    display.homingFrames = Math.max(0, Math.floor(options.homingFrames || 0));
    display.homingDelay = Math.max(0, Math.floor(options.homingDelay || 0));
    display.homingTurnRate = typeof options.homingTurnRate === "number" ? options.homingTurnRate : 0.08;
    
    var baseHomingSpeed = typeof options.homingSpeed === "number" ? options.homingSpeed : null;
    display.homingSpeed = baseHomingSpeed !== null ? baseHomingSpeed * spdMulti : null;
    
    display.homingStopDistance = typeof options.homingStopDistance === "number" ? options.homingStopDistance : 0;
    display.drag = typeof options.drag === "number" ? options.drag : 1;
    display.accelX = (options.accelX || 0) * spdMulti;
    display.accelY = (options.accelY || 0) * spdMulti;
    display.speedMultiplier = typeof options.speedMultiplier === "number" ? options.speedMultiplier : 1;
    display.speedMultiplierStart = Math.max(0, Math.floor(options.speedMultiplierStart || 0));
    
    var baseMaxSpeed = typeof options.maxSpeed === "number" ? options.maxSpeed : null;
    display.maxSpeed = baseMaxSpeed !== null ? baseMaxSpeed * spdMulti : null;
    
    var baseMinSpeed = typeof options.minSpeed === "number" ? options.minSpeed : null;
    display.minSpeed = baseMinSpeed !== null ? baseMinSpeed * spdMulti : null;
    
    display.pulseSpeedAmplitude = (options.pulseSpeedAmplitude || 0) * spdMulti;
    display.pulseSpeedFrequency = options.pulseSpeedFrequency || 0;
    display.pulseSpeedPhase = options.pulseSpeedPhase || 0;
    
    var givenBaseSpeed = typeof options.baseSpeed === "number" ? options.baseSpeed : Math.sqrt((display.vx * display.vx) + (display.vy * display.vy));
    if (typeof options.baseSpeed === "number") {
        display.baseSpeed = options.baseSpeed * spdMulti;
    } else {
        display.baseSpeed = givenBaseSpeed;
    }

    display.swayAmplitude = options.swayAmplitude || 0; 
    display.swayFrequency = options.swayFrequency || 0; 
    display.swayPhase = options.swayPhase || 0;
    display.swayAxis = options.swayAxis || "y";
    display.previousSwayOffset = 0;
    display.fadeOutFrames = Math.max(0, Math.floor(options.fadeOutFrames || 0));
    display.fadeOutToZero = options.fadeOutToZero === true;
    display.faceVelocity = options.faceVelocity === true;
    display.faceVelocityOffset = typeof options.faceVelocityOffset === "number" ? options.faceVelocityOffset : 0;
    display.explosionFadeOutFrames = Math.max(0, Math.floor(options.explosionFadeOutFrames || 0));

    return display;
};

GraveFallGame.scene.Game.prototype.applyProjectileAnimation = function (display, animation) {
    var animationName;

    if (!display || !animation || !display.animation || typeof display.animation.create !== "function") {
        return;
    }

    animationName = animation.name || "move";
    display.animation.create(
        animationName,
        animation.frames || [0],
        animation.framerate || 8,
        animation.looped !== false
    );
    display.animation.gotoAndPlay(animationName, animation.startFrame || 0);
};

GraveFallGame.scene.Game.prototype.spawnProjectile = function (options) {
    var projectile = this.createProjectileDisplay(options);
    this.arenaProjectileLayer.addChild(projectile);
    this.projectiles.push(projectile);
    return projectile;
};

GraveFallGame.scene.Game.prototype.spawnVerticalSweepProjectile = function (options) {
    var dmgMulti = this.getDifficultyMultiplier ? this.getDifficultyMultiplier() : 1.0;
    var spdMulti = this.getDifficultySpeedMultiplier ? this.getDifficultySpeedMultiplier() : 1.0;
    
    var hitbox = new rune.display.DisplayObjectContainer(
        options.x,
        options.y,
        options.collisionWidth || 16,
        options.collisionHeight || 160
    );
    var sweepSprite = new rune.display.Sprite(
        -((options.spriteWidth || 160) - hitbox.width) / 2,
        -((options.spriteHeight || 12) - hitbox.height) / 2,
        options.spriteWidth || 160,
        options.spriteHeight || 12,
        options.resource || "Horizontal_Sweep_Attack_T"
    );

    this.applyPaletteSwaps(
        sweepSprite,
        this.getProjectilePaletteSwaps(options.projectilePalette)
    );

    if (options.rotation) {
        sweepSprite.rotation = options.rotation;
    }

    if (options.flippedX === true) {
        sweepSprite.flippedX = true;
    }

    hitbox.addChild(sweepSprite);
    hitbox.vx = (options.vx || 0) * spdMulti;
    hitbox.vy = (options.vy || 0) * spdMulti;
    hitbox.damage = Math.ceil((typeof options.damage === "number" ? options.damage : 8) * dmgMulti);
    hitbox.life = options.life || 180;
    hitbox.type = options.type || "generic";
    hitbox.hitboxLeeway = this.getProjectileHitboxLeeway(options);
    this.setObjectHitboxInset(hitbox, hitbox.hitboxLeeway, hitbox.hitboxLeeway);
    hitbox.hitFlashFrames = 0;
    hitbox.hit = false;

    this.arenaProjectileLayer.addChild(hitbox);
    this.projectiles.push(hitbox);
    return hitbox;
};

GraveFallGame.scene.Game.prototype.applyDamageToPlayer = function (playerMenu, amount) {
    var wasAlive = playerMenu.healthCurrent > 0;
    var finalDamage = amount;

    if (playerMenu.isDefending || playerMenu.temporaryDefenseBuff === true) {
        finalDamage = Math.ceil(finalDamage * 0.5);
    }

    if (playerMenu.permanentDefenseBonus > 0) {
        finalDamage = Math.ceil(finalDamage * Math.max(0.5, 1 - (playerMenu.permanentDefenseBonus * 0.08)));
    }

    if (finalDamage > 0) {
        this.addScorePopup(-(finalDamage * 10), "TOOK DAMAGE", playerMenu.theme.accent);
    }

    playerMenu.healthCurrent = Math.max(0, playerMenu.healthCurrent - finalDamage);
    this.updatePlayerHealthUi(playerMenu);
    playerMenu.hitCooldown = 12;

    if (finalDamage > 0) {
        this.spawnPlayerDamageParticles(playerMenu, finalDamage);
    }

    this.shakeOnPlayerDamage(finalDamage);

    if (this.phase !== GraveFallGame.scene.Game.PHASE_ACTION) {
        this.updateAllPlayerDamageStates();
    }

    if (playerMenu.healthCurrent <= 0) {
        if (wasAlive) {
            this.playSfx(GraveFallGame.SOUNDS.PLAYER_DOWNED, 0.8);
            this.encounterAllyDowned = true;
        }

        playerMenu.battleAvatar.visible = false;
        playerMenu.battleAvatar.alpha = 1;
        playerMenu.confirmed = true;
    } else if (wasAlive) {
        this.playSfx(GraveFallGame.SOUNDS.PLAYER_HIT, 0.6);
    }
};

GraveFallGame.scene.Game.prototype.updateBattleAvatarMovement = function (playerMenu) {
    var speed = playerMenu.moveSpeed || 3;
    var avatar = playerMenu.battleAvatar;
    var inner = this.getArenaInnerBounds();
    var oldX = avatar.x;
    var oldY = avatar.y;
    var nextX = avatar.x;
    var nextY = avatar.y;
    var clamped;

    if (playerMenu.healthCurrent <= 0) {
        return;
    }

    if (this.isHoldingLeft(playerMenu)) {
        nextX -= speed;
    }

    if (this.isHoldingRight(playerMenu)) {
        nextX += speed;
    }

    if (this.isHoldingUp(playerMenu)) {
        nextY -= speed;
    }

    if (this.isHoldingDown(playerMenu)) {
        nextY += speed;
    }

    clamped = this.clampObjectHitboxToBounds(avatar, nextX, nextY, inner);
    nextX = clamped.x;
    nextY = clamped.y;

    if (this.isBattleAvatarColliding(playerMenu, nextX, nextY)) {
        avatar.x = oldX;
        avatar.y = oldY;
        return;
    }

    avatar.x = nextX;
    avatar.y = nextY;
};

GraveFallGame.scene.Game.prototype.clearArenaItem = function () {
    if (this.arenaItem && this.arenaItem.parent) {
        this.arenaItem.parent.removeChild(this.arenaItem, true);
    }

    this.arenaItem = null;
};

GraveFallGame.scene.Game.prototype.spawnArenaItem = function () {
    var inner = this.getArenaInnerBounds();
    var itemScale = 0.45;
    var itemTypes = ["maxHp", "attack", "defense", "speed"];
    var itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    var item = new rune.display.Sprite(0, 0, 100, 100, this.getItemIconResource(itemType));
    var maxX;
    var maxY;

    item.scaleX = itemScale;
    item.scaleY = itemScale;
    this.applyMonochromeIconColor(item, "#FFFFFF");
    item.buffType = itemType;

    maxX = inner.x + inner.width - (item.width * item.scaleX);
    maxY = inner.y + inner.height - (item.height * item.scaleY);

    item.x = this.randomRange(inner.x, maxX);
    item.y = this.randomRange(inner.y, maxY);

    this.arenaAvatarLayer.addChild(item);
    this.arenaItem = item;
    this.playSfx(GraveFallGame.SOUNDS.ITEM_SPAWN, 0.45);
};

GraveFallGame.scene.Game.prototype.updateArenaItem = function () {
    if (this.arenaItem) return;
    if (this.itemSpawnTimer > 0) {
        this.itemSpawnTimer--;
        return;
    }
    this.spawnArenaItem();
};

GraveFallGame.scene.Game.prototype.checkItemCollisions = function () {
    var i;
    var playerMenu;

    if (!this.arenaItem) return;

    for (i = 0; i < this.playerMenus.length; i++) {
        playerMenu = this.playerMenus[i];

        if (playerMenu.healthCurrent <= 0) {
            continue;
        }

        if (this.rectsOverlap(playerMenu.battleAvatar, this.arenaItem)) {
            this.playSfx(GraveFallGame.SOUNDS.ITEM_PICKUP, 0.65);
            this.givePlayerItem(playerMenu, this.arenaItem.buffType || "attack");
            this.spawnItemPickupEffect(playerMenu, this.arenaItem.buffType || "attack", 650);
            this.clearArenaItem();
            this.itemSpawnTimer = Math.floor(this.randomRange(90, 240));
            break;
        }
    }
};

GraveFallGame.scene.Game.prototype.updateActionPhase = function () {
    var enemy = this.getCurrentEnemyConfig();
    var i;

    this.updateActionPromptTimer();

    if (this.actionPhaseStartDelayFrames > 0) {
        this.actionPhaseStartDelayFrames--;

        for (i = 0; i < this.playerMenus.length; i++) {
            this.updateBattleAvatarMovement(this.playerMenus[i]);
            this.updatePlayerHitFlicker(this.playerMenus[i]);
        }

        return;
    }

    this.actionPhaseTimer--;
    this.nextPatternIn--;

    this.updateArenaItem();
    this.checkItemCollisions();

    if (this.nextPatternIn <= 0) {
        this.spawnEnemyPattern();
        this.nextPatternIn = enemy.patternInterval;
    }

    for (i = 0; i < this.playerMenus.length; i++) {
        this.updateBattleAvatarMovement(this.playerMenus[i]);
        this.updatePlayerHitFlicker(this.playerMenus[i]);
    }

    this.updateProjectiles();
    this.checkProjectileCollisions();

    if (this.areAllPlayersDown()) {
        this.endActionPhase();
        return;
    }

    if (this.actionPhaseTimer <= 0) {
        this.endActionPhase();
    }
};

//------------------------------------------------------------------------------

// Game over stats and leaderboard transition
//------------------------------------------------------------------------------

(function () {
    var originalSaveCurrentRunToLeaderboard = GraveFallGame.scene.Game.prototype.saveCurrentRunToLeaderboard;
    var originalShowGameOverAndReturnToMenu = GraveFallGame.scene.Game.prototype.showGameOverAndReturnToMenu;
    var originalUpdateGameOver = GraveFallGame.scene.Game.prototype.updateGameOver;
    var originalDispose = GraveFallGame.scene.Game.prototype.dispose;

    GraveFallGame.scene.Game.prototype.buildGameOverSummary = function () {
        var summary = {
            partyName: this.getCurrentPartyName ? this.getCurrentPartyName() : "THE FALLEN",
            score: typeof this.score === "number" ? this.score : 0,
            partySize: this.gameOverPartySize || (this.partyMembers && this.partyMembers.length) || (this.playerMenus && this.playerMenus.length) || 1,
            players: []
        };
        var menus = this.playerMenus || [];
        var i;
        var menu;
        var stats;
        var bestStat;

        for (i = 0; i < menus.length; i++) {
            menu = menus[i];
            if (!menu) {
                continue;
            }

            stats = menu.stats || {};
            bestStat = this.getGameOverBestStat(stats);

            summary.players.push({
                name: menu.characterName || (menu.controller && menu.controller.label) || (menu.controller && menu.controller.id) || ("PLAYER " + (i + 1)),
                controllerId: menu.controller && menu.controller.id ? menu.controller.id : ("P" + (i + 1)),
                themeIndex: typeof menu.themeIndex === "number" ? menu.themeIndex : (menu.controller && typeof menu.controller.themeIndex === "number" ? menu.controller.themeIndex : 0),
                standResource: menu.standResource || null,
                flipStandX: menu.flipStandX === true,
                stats: {
                    damageDealt: typeof stats.damageDealt === "number" ? stats.damageDealt : 0,
                    damageTaken: typeof stats.damageTaken === "number" ? stats.damageTaken : 0,
                    healingDone: typeof stats.healingDone === "number" ? stats.healingDone : 0,
                    healingReceived: typeof stats.healingReceived === "number" ? stats.healingReceived : 0,
                    timesDowned: typeof stats.timesDowned === "number" ? stats.timesDowned : 0,
                    timesRevived: typeof stats.timesRevived === "number" ? stats.timesRevived : 0,
                    attacksUsed: typeof stats.attacksUsed === "number" ? stats.attacksUsed : 0,
                    defendsUsed: typeof stats.defendsUsed === "number" ? stats.defendsUsed : 0,
                    buffsUsed: typeof stats.buffsUsed === "number" ? stats.buffsUsed : 0,
                    itemsUsed: typeof stats.itemsUsed === "number" ? stats.itemsUsed : 0,
                    enemiesDefeated: typeof stats.enemiesDefeated === "number" ? stats.enemiesDefeated : 0
                },
                bestStat: bestStat
            });
        }

        return summary;
    };

    GraveFallGame.scene.Game.prototype.getGameOverBestStat = function (stats) {
        var candidates = [
            { key: "damageDealt", label: "DAMAGE DEALT", value: typeof stats.damageDealt === "number" ? stats.damageDealt : 0 },
            { key: "healingDone", label: "HEALING DONE", value: typeof stats.healingDone === "number" ? stats.healingDone : 0 },
            { key: "healingReceived", label: "HEALING RECEIVED", value: typeof stats.healingReceived === "number" ? stats.healingReceived : 0 },
            { key: "enemiesDefeated", label: "ENEMIES DEFEATED", value: typeof stats.enemiesDefeated === "number" ? stats.enemiesDefeated : 0 },
            { key: "attacksUsed", label: "ATTACKS USED", value: typeof stats.attacksUsed === "number" ? stats.attacksUsed : 0 },
            { key: "defendsUsed", label: "DEFENDS USED", value: typeof stats.defendsUsed === "number" ? stats.defendsUsed : 0 },
            { key: "buffsUsed", label: "BUFFS USED", value: typeof stats.buffsUsed === "number" ? stats.buffsUsed : 0 },
            { key: "itemsUsed", label: "ITEMS USED", value: typeof stats.itemsUsed === "number" ? stats.itemsUsed : 0 },
            { key: "timesRevived", label: "REVIVES", value: typeof stats.timesRevived === "number" ? stats.timesRevived : 0 }
        ];
        var best = null;
        var i;

        for (i = 0; i < candidates.length; i++) {
            if (!best || candidates[i].value > best.value) {
                best = candidates[i];
            }
        }

        if (!best || best.value <= 0) {
            return {
                key: "survival",
                label: "SURVIVAL",
                value: 0
            };
        }

        return best;
    };

    GraveFallGame.scene.Game.prototype.saveCurrentRunToLeaderboard = function () {
        var partyName;
        var partySize;
        var summary;

        if (this.gameOverLeaderboardSaved === true) {
            return;
        }

        this.gameOverLeaderboardSaved = true;
        partyName = this.getCurrentPartyName();
        partySize = this.gameOverPartySize || (this.partyMembers && this.partyMembers.length) || (this.playerMenus && this.playerMenus.length) || 1;
        summary = this.buildGameOverSummary();

        if (summary) {
            this.gameOverSummary = summary;
        }

        try {
            if (typeof GraveFallGame.scene.Game.saveHighscore === "function") {
                GraveFallGame.scene.Game.saveHighscore(partyName, this.score || 0, partySize);
                return;
            }
        } catch (e) {
        }

        try {
            if (typeof window !== "undefined" && window.localStorage) {
                var key = "gravefall_highscores_" + partySize;
                var scores = [];
                var raw = window.localStorage.getItem(key);

                if (raw) {
                    scores = JSON.parse(raw) || [];
                }

                scores.push({ name: partyName, score: this.score || 0, partySize: partySize, savedAt: new Date().toISOString() });
                scores.sort(function (a, b) { return b.score - a.score; });
                scores = scores.slice(0, 10);
                window.localStorage.setItem(key, JSON.stringify(scores));
            }
        } catch (e2) {
        }
    };

    GraveFallGame.scene.Game.prototype.createGameOverPortrait = function (playerEntry, theme, cardWidth) {
        var sprite;
        var standResource = playerEntry && playerEntry.standResource ? playerEntry.standResource : null;
        var portraitScale = 1.0;
        var portraitWidth = 100;
        var portraitHeight = 100;
        var portraitX = Math.round((cardWidth / 2) - ((portraitWidth * portraitScale) / 2));
        var portraitY = 34;

        if (!standResource || !this.resourceExists(standResource)) {
            sprite = new rune.display.Graphic(Math.round((cardWidth / 2) - 42), portraitY + 8, 84, 84);
            sprite.backgroundColor = theme.accentDark;
            sprite.alpha = 0.92;
            return sprite;
        }

        sprite = new rune.display.Sprite(portraitX, portraitY, portraitWidth, portraitHeight, standResource);
        sprite.scaleX = portraitScale;
        sprite.scaleY = portraitScale;
        sprite.alpha = 1;
        sprite.flippedX = playerEntry.flipStandX === true;
        this.applyPaletteSwaps(sprite, this.getClothingPaletteSwaps(theme));

        return sprite;
    };


    GraveFallGame.scene.Game.prototype.sanitizeBitmapText = function (text) {
        var safeText;
    
        safeText = text === undefined || text === null ? "" : String(text);
        safeText = safeText.toUpperCase();
    
        // Rune's bitmap font in this project is safest with plain ASCII letters,
        // numbers and common punctuation. Replace anything else so stat screens
        // and leaderboard names never crash when they are rendered.
        safeText = safeText.replace(/[^A-Z0-9 \-.:,!?\/\[\]\(\)\+]/g, " ");
        safeText = safeText.replace(/\s{2,}/g, " ").trim();
    
        return safeText;
    };

    GraveFallGame.scene.Game.prototype.createGameOverStatLine = function (text, x, y, width, color) {
        var safeText = this.sanitizeBitmapText ? this.sanitizeBitmapText(text) : String(text || "");
        var field = new rune.text.BitmapField(safeText);

        field.width = width;
        field.scaleX = 0.95;
        field.scaleY = 0.95;
        field.x = x;
        field.y = y;

        if (typeof this.tintBitmapFieldText === "function") {
            this.tintBitmapFieldText(field, color || "#FFFFFF", true);
        }

        return field;
    };

    GraveFallGame.scene.Game.prototype.createGameOverStatsCard = function (x, y, width, height, playerEntry, uiSkin) {
        var card = new rune.display.DisplayObjectContainer(x, y, width, height);
        var bgTop = new rune.display.Graphic(0, 0, width, Math.round(height * 0.38));
        var bgBottom = new rune.display.Graphic(0, Math.round(height * 0.38), width, Math.round(height * 0.62));
        var accent = new rune.display.Graphic(0, 0, 8, height);
        var portraitBg = new rune.display.Graphic(14, 28, width - 28, 132);
        var badgeBg = new rune.display.Graphic(18, 10, width - 36, 22);
        var badgeText = new rune.text.BitmapField("");
        var nameText = new rune.text.BitmapField(this.sanitizeBitmapText ? this.sanitizeBitmapText(playerEntry.name || "PLAYER") : String(playerEntry.name || "PLAYER"));
        var stats = playerEntry.stats || {};
        var bestStat = playerEntry.bestStat || this.getGameOverBestStat(stats);
        var theme = this.getPlayerTheme(playerEntry.themeIndex || 0);
        var portrait = this.createGameOverPortrait(playerEntry, theme, width);
        var statRowsLeft = [
            { label: "DMG DEALT", value: stats.damageDealt },
            { label: "DMG TAKEN", value: stats.damageTaken },
            { label: "HEAL DONE", value: stats.healingDone },
            { label: "HEAL RCVD", value: stats.healingReceived },
            { label: "DOWNED", value: stats.timesDowned }
        ];
        var statRowsRight = [
            { label: "ATTACKS", value: stats.attacksUsed },
            { label: "DEFENDS", value: stats.defendsUsed },
            { label: "BUFFS", value: stats.buffsUsed },
            { label: "ITEMS", value: stats.itemsUsed },
            { label: "KOs", value: stats.enemiesDefeated }
        ];
        var statTextY = 188;
        var statLeftX = 18;
        var statRightX = Math.floor(width / 2) + 4;
        var statLineGap = 21;
        var i;
        var statLine;
        var footerText;

        bgTop.backgroundColor = uiSkin.panelTop;
        bgBottom.backgroundColor = uiSkin.panelBottom;
        bgBottom.alpha = 0.97;
        accent.backgroundColor = theme.accent;
        portraitBg.backgroundColor = uiSkin.panelTop;
        portraitBg.alpha = 0.88;
        badgeBg.backgroundColor = theme.accentDark;
        badgeBg.alpha = 0.98;

        badgeText.text = this.sanitizeBitmapText ? this.sanitizeBitmapText("BEST: " + (bestStat.label || "")) : ("BEST: " + (bestStat.label || ""));
        badgeText.width = width - 44;
        badgeText.scaleX = 1.0;
        badgeText.scaleY = 1.0;
        badgeText.x = 28;
        badgeText.y = 14;

        nameText.width = width - 24;
        nameText.scaleX = 1.5;
        nameText.scaleY = 1.5;
        nameText.x = Math.round((width / 2) - ((nameText.text.length * 6 * 1.5) / 2));
        nameText.y = 150;

        if (portrait) {
            card.addChild(portrait);
        }

        card.addChild(bgTop);
        card.addChild(bgBottom);
        card.addChild(portraitBg);
        card.addChild(badgeBg);
        card.addChild(accent);
        card.addChild(badgeText);
        card.addChild(nameText);

        if (typeof this.tintBitmapFieldText === "function") {
            this.tintBitmapFieldText(badgeText, theme.accentLight, true);
            this.tintBitmapFieldText(nameText, theme.accentLight, true);
        }

        for (i = 0; i < statRowsLeft.length; i++) {
            statLine = this.createGameOverStatLine(
                statRowsLeft[i].label + ": " + String(statRowsLeft[i].value || 0),
                statLeftX,
                statTextY + (i * statLineGap),
                Math.floor(width / 2) - 24,
                uiSkin.frame.light
            );
            card.addChild(statLine);
        }

        for (i = 0; i < statRowsRight.length; i++) {
            statLine = this.createGameOverStatLine(
                statRowsRight[i].label + ": " + String(statRowsRight[i].value || 0),
                statRightX,
                statTextY + (i * statLineGap),
                Math.floor(width / 2) - 24,
                uiSkin.frame.light
            );
            card.addChild(statLine);
        }

        footerText = this.createGameOverStatLine(
            "BEST: " + (this.sanitizeBitmapText ? this.sanitizeBitmapText(bestStat.label || "") : (bestStat.label || "")) + " - " + String(bestStat.value || 0),
            18,
            height - 26,
            width - 36,
            theme.accentLight
        );
        card.addChild(footerText);

        card.addChild(this.createBoxFrame(0, 0, width, height, this.getFramePaletteSwaps(uiSkin)));

        return card;
    };

    GraveFallGame.scene.Game.prototype.renderGameOverStats = function () {
        var screen = this.application.screen;
        var summary = this.gameOverSummary || this.buildGameOverSummary();
        var uiSkin = this.uiSkin || GraveFallGame.scene.Game.UI_SKINS.dullBrown;
        var framePaletteSwaps = this.getFramePaletteSwaps(uiSkin);
        var panelX = 44;
        var panelY = 34;
        var panelW = screen.width - 88;
        var panelH = screen.height - 112;
        var headerY = 16;
        var cardsY = 122;
        var cardGap = 16;
        var cardWidth;
        var cardHeight = 330;
        var totalWidth;
        var startX;
        var i;
        var card;
        var titleText;
        var partyText;
        var scoreText;

        if (this.gameOverStatsPanel && this.gameOverStatsPanel.parent) {
            this.gameOverStatsPanel.parent.removeChild(this.gameOverStatsPanel, true);
        }

        this.gameOverStatsPanel = new rune.display.DisplayObjectContainer(panelX, panelY, panelW, panelH);
        this.gameOverStatsPanel.backgroundColor = uiSkin.panelBottom;
        this.gameOverStatsPanel.alpha = 0.98;
        this.gameOverStatsPanel.addChild(this.createBoxFrame(0, 0, panelW, panelH, framePaletteSwaps));
        this.stage.addChild(this.gameOverStatsPanel);

        titleText = new rune.text.BitmapField(this.sanitizeBitmapText ? this.sanitizeBitmapText("POST-BATTLE STATS") : "POST-BATTLE STATS");
        titleText.width = 1200;
        titleText.scaleX = 3;
        titleText.scaleY = 3;
        titleText.x = Math.round((panelW / 2) - ((titleText.text.length * 6 * 3) / 2));
        titleText.y = headerY;
        this.gameOverStatsPanel.addChild(titleText);
        if (typeof this.tintBitmapFieldText === "function") {
            this.tintBitmapFieldText(titleText, uiSkin.frame.light, true);
        }

        partyText = new rune.text.BitmapField("PARTY: " + (this.sanitizeBitmapText ? this.sanitizeBitmapText(summary.partyName || "THE FALLEN") : String(summary.partyName || "THE FALLEN")));
        partyText.width = 1200;
        partyText.scaleX = 2;
        partyText.scaleY = 2;
        partyText.x = Math.round((panelW / 2) - ((partyText.text.length * 6 * 2) / 2));
        partyText.y = 56;
        this.gameOverStatsPanel.addChild(partyText);
        if (typeof this.tintBitmapFieldText === "function") {
            this.tintBitmapFieldText(partyText, uiSkin.frame.light, true);
        }

        scoreText = new rune.text.BitmapField(this.sanitizeBitmapText ? this.sanitizeBitmapText("FINAL SCORE: " + String(summary.score)) : ("FINAL SCORE: " + String(summary.score)));
        scoreText.width = 800;
        scoreText.scaleX = 1.8;
        scoreText.scaleY = 1.8;
        scoreText.x = Math.round((panelW / 2) - ((scoreText.text.length * 6 * 1.8) / 2));
        scoreText.y = 86;
        this.gameOverStatsPanel.addChild(scoreText);
        if (typeof this.tintBitmapFieldText === "function") {
            this.tintBitmapFieldText(scoreText, uiSkin.frame.light, true);
        }

        if (this.gameOverCards) {
            for (i = 0; i < this.gameOverCards.length; i++) {
                if (this.gameOverCards[i] && this.gameOverCards[i].parent) {
                    this.gameOverCards[i].parent.removeChild(this.gameOverCards[i], true);
                }
            }
        }

        this.gameOverCards = [];

        if (!summary.players || summary.players.length <= 0) {
            var noPlayers = new rune.text.BitmapField(this.sanitizeBitmapText ? this.sanitizeBitmapText("NO PARTY DATA AVAILABLE") : "NO PARTY DATA AVAILABLE");
            noPlayers.width = 1000;
            noPlayers.scaleX = 1.6;
            noPlayers.scaleY = 1.6;
            noPlayers.x = Math.round((panelW / 2) - ((noPlayers.text.length * 6 * 1.6) / 2));
            noPlayers.y = 210;
            this.gameOverStatsPanel.addChild(noPlayers);
            if (typeof this.tintBitmapFieldText === "function") {
                this.tintBitmapFieldText(noPlayers, uiSkin.frame.light, true);
            }
        } else {
            cardGap = summary.players.length > 4 ? 10 : 16;
            cardWidth = Math.floor((panelW - 40 - (cardGap * (summary.players.length - 1))) / summary.players.length);
            cardWidth = Math.max(230, Math.min(280, cardWidth));
            totalWidth = (cardWidth * summary.players.length) + (cardGap * (summary.players.length - 1));
            startX = Math.round((panelW - totalWidth) / 2);

            for (i = 0; i < summary.players.length; i++) {
                card = this.createGameOverStatsCard(startX + (i * (cardWidth + cardGap)), cardsY, cardWidth, cardHeight, summary.players[i], uiSkin);
                this.gameOverStatsPanel.addChild(card);
                this.gameOverCards.push(card);
            }
        }

        if (!this.gameOverCountdownText) {
            this.gameOverCountdownText = new rune.text.BitmapField("");
            this.gameOverCountdownText.width = 1200;
            this.gameOverCountdownText.scaleX = 1.5;
            this.gameOverCountdownText.scaleY = 1.5;
            this.gameOverStatsPanel.addChild(this.gameOverCountdownText);
        }

        this.gameOverCountdownText.text = this.sanitizeBitmapText ? this.sanitizeBitmapText("LEADERBOARD IN 20 SECONDS") : "LEADERBOARD IN 20 SECONDS";
        this.gameOverCountdownText.x = Math.round((panelW / 2) - ((this.gameOverCountdownText.text.length * 6 * 1.5) / 2));
        this.gameOverCountdownText.y = panelH - 54;
        if (typeof this.tintBitmapFieldText === "function") {
            this.tintBitmapFieldText(this.gameOverCountdownText, uiSkin.frame.light, true);
        }

        if (!this.gameOverInstruction) {
            this.gameOverInstruction = new rune.text.BitmapField("");
            this.gameOverInstruction.width = 1200;
            this.gameOverInstruction.scaleX = 1.5;
            this.gameOverInstruction.scaleY = 1.5;
            this.gameOverStatsPanel.addChild(this.gameOverInstruction);
        }

        this.gameOverInstruction.text = this.sanitizeBitmapText ? this.sanitizeBitmapText("PRESS [SPACE] OR [A] TO CONTINUE") : "PRESS [SPACE] OR [A] TO CONTINUE";
        this.gameOverInstruction.x = Math.round((panelW / 2) - ((this.gameOverInstruction.text.length * 6 * 1.5) / 2));
        this.gameOverInstruction.y = panelH - 28;
        if (typeof this.tintBitmapFieldText === "function") {
            this.tintBitmapFieldText(this.gameOverInstruction, uiSkin.frame.light, true);
        }
    };

    GraveFallGame.scene.Game.prototype.updateGameOver = function (step) {
        var continuePressed = false;
        var i;
        var gp;
        var remainingSeconds;
        var stepMs;

        stepMs = typeof step === "number" && isFinite(step) ? step : 16;
        this.gameOverTimer++;
        this.gameOverTimerMs = (this.gameOverTimerMs || 0) + stepMs;

        if (this.gameOverInstruction) {
            this.gameOverInstruction.alpha = (Math.floor(this.gameOverTimer / 30) % 2 === 0) ? 1 : 0;
        }

        remainingSeconds = Math.max(0, Math.ceil(((this.gameOverDisplayDurationMs || 20000) - this.gameOverTimerMs) / 1000));

        if (this.gameOverCountdownText) {
            this.gameOverCountdownText.text = "LEADERBOARD IN " + remainingSeconds + " SECONDS";
            this.gameOverCountdownText.x = Math.round((this.gameOverStatsPanel.width / 2) - ((this.gameOverCountdownText.text.length * 6 * 1.5) / 2));
        }

        if (this.keyboard.justPressed("space") || this.keyboard.justPressed("enter")) {
            continuePressed = true;
        }

        for (i = 0; i < 4 && continuePressed !== true; i++) {
            try {
                gp = this.gamepads.get(i);
            } catch (e) {
                gp = null;
            }

            if (gp && gp.connected && gp.justPressed(0)) {
                continuePressed = true;
            }
        }

        if (!(this.isDevConsoleInputActive && this.isDevConsoleInputActive()) && (continuePressed === true || this.gameOverTimerMs >= (this.gameOverDisplayDurationMs || 20000))) {
            this.application.scenes.load([
                new GraveFallGame.scene.Leaderboard(this.gameOverPartySize)
            ]);
        }
    };

    GraveFallGame.scene.Game.prototype.dispose = function () {
        var i;

        if (this.gameOverCards) {
            for (i = 0; i < this.gameOverCards.length; i++) {
                if (this.gameOverCards[i] && this.gameOverCards[i].parent) {
                    this.gameOverCards[i].parent.removeChild(this.gameOverCards[i], true);
                }
            }
        }

        if (this.gameOverStatsPanel && this.gameOverStatsPanel.parent) {
            this.gameOverStatsPanel.parent.removeChild(this.gameOverStatsPanel, true);
        }

        this.gameOverStatsPanel = null;
        this.gameOverCards = null;
        this.gameOverTitleText = null;
        this.gameOverScoreText = null;
        this.gameOverCountdownText = null;
        this.gameOverInstruction = null;

        if (typeof originalDispose === "function") {
            originalDispose.call(this);
        }
    };
})();

