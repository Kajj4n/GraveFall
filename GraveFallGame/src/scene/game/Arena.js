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
    this.actionPromptText.width = 500;
    this.actionPromptText.height = 48;
    this.actionPromptText.scaleX = 2;
    this.actionPromptText.scaleY = 2;
    this.actionPromptText.x = Math.floor((screenWidth / 2) - ((this.actionPromptText.text.length * 6 * 2) / 2));
    this.actionPromptText.y = arenaY + arenaHeight + 10;
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

GraveFallGame.scene.Game.prototype.showGameOverAndReturnToMenu = function () {
    if (this.phase === GraveFallGame.scene.Game.PHASE_GAME_OVER) {
        return;
    }

    this.phase = GraveFallGame.scene.Game.PHASE_GAME_OVER;
    this.gameOverTimer = 0; 
    this.playSfx(GraveFallGame.SOUNDS.GAME_OVER, 0.85);
    
    this.clearProjectiles();
    this.clearArenaItem();
    this.setBattleArenaVisible(false);
    this.updateAllPlayerDamageStates();

    this.setPlayerTransitionVisibility(false, false);
    this.setEnemyUiAlpha(0);
    if (this.backgroundBackdrop) this.backgroundBackdrop.visible = false;
    if (this.turnTimerText) this.turnTimerText.visible = false;
    if (this.scoreText) this.scoreText.visible = false;

    if (this.scorePopups) {
        for (var i = 0; i < this.scorePopups.length; i++) {
            if (this.scorePopups[i].parent) this.scorePopups[i].parent.removeChild(this.scorePopups[i], true);
        }
        this.scorePopups = [];
    }

    // CREATE GAME OVER TEXT
    if (!this.gameOverText) {
        this.gameOverText = new rune.text.BitmapField("GAME OVER");
        this.gameOverText.width = 800; // FIX: Prevent clipping
        this.gameOverText.height = 64; // FIX: Prevent vertical clipping
        this.gameOverText.scaleX = 4;
        this.gameOverText.scaleY = 4;
        this.gameOverText.x = Math.floor((this.application.screen.width / 2) - ((this.gameOverText.text.length * 6 * 4) / 2));
        this.gameOverText.y = Math.floor(this.application.screen.height / 2) - 80;
        this.stage.addChild(this.gameOverText);
    }
    this.gameOverText.visible = true;
    this.gameOverText.alpha = 1;

    // CREATE FINAL SCORE TEXT
    var finalScoreStr = "FINAL SCORE: " + this.score;
    if (!this.finalScoreText) {
        this.finalScoreText = new rune.text.BitmapField(finalScoreStr);
        this.finalScoreText.width = 800; // FIX: Prevent clipping
        this.finalScoreText.height = 64; // FIX: Prevent vertical clipping
        this.finalScoreText.scaleX = 2;
        this.finalScoreText.scaleY = 2;
        this.finalScoreText.x = Math.floor((this.application.screen.width / 2) - ((finalScoreStr.length * 6 * 2) / 2));
        this.finalScoreText.y = Math.floor(this.application.screen.height / 2);
        this.stage.addChild(this.finalScoreText);
    }
    this.finalScoreText.visible = true;
    this.finalScoreText.alpha = 1;

    // CREATE CONTINUE INSTRUCTION
    var promptStr = "PRESS [SPACE] TO CONTINUE";
    if (!this.gameOverInstruction) {
        this.gameOverInstruction = new rune.text.BitmapField(promptStr);
        this.gameOverInstruction.width = 800; // FIX: Prevent clipping
        this.gameOverInstruction.height = 64; // FIX: Prevent vertical clipping
        this.gameOverInstruction.scaleX = 1.5;
        this.gameOverInstruction.scaleY = 1.5;
        this.gameOverInstruction.x = Math.floor((this.application.screen.width / 2) - ((promptStr.length * 6 * 1.5) / 2));
        this.gameOverInstruction.y = Math.floor(this.application.screen.height / 2) + 60;
        this.stage.addChild(this.gameOverInstruction);
    }
    this.gameOverInstruction.visible = true;
    this.gameOverInstruction.alpha = 1;
};

GraveFallGame.scene.Game.prototype.updateGameOver = function () {
    this.gameOverTimer++;
    
    if (this.gameOverInstruction) {
        this.gameOverInstruction.alpha = (Math.floor(this.gameOverTimer / 30) % 2 === 0) ? 1 : 0;
    }

    if (this.keyboard.justPressed("space")) {
        this.application.scenes.load([
            new GraveFallGame.scene.Menu()
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
    this.enemySprite.x = (this.application.screen.width / 1) - ((this.enemySprite.width * this.enemySprite.scaleX) / 1.28);
    this.enemySprite.y = 180;
    this.enemyPreviewBaseX = this.enemySprite.x;
    this.enemyPreviewBaseY = this.enemySprite.y;
    this.setDamageStateGroupState(this.enemySprite, "hp100");
    this.enemySprite.alpha = fadeIn === true ? 0 : 1;
    this.enemySprite.visible = fadeIn !== true;
    
    var insertIndex = 0;
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
    enemyConfig = this.getCurrentEnemyConfig();
    this.enemyHealthMax = enemyConfig.hpMax;
    this.enemyHealthCurrent = this.enemyHealthMax;
    this.enemyDefeatedSoundPlayed = false;

    this.rebuildEnemySprite(fadeIn);
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
    this.turnTimerText.visible = false;
    this.turnTimerText.alpha = 0;
    this.turnTimerText.text = "25";
    this.turnTimerMs = 25000;
    this.lastTurnWarningSecond = null;
};

GraveFallGame.scene.Game.prototype.finishEnemyDefeatedTransitionToCommand = function () {
    if (this.passageTransitionEncounterLoaded !== true) {
        this.loadNextEnemyEncounterDuringTransition();
    }

    this.resetPassageCameraTransition();
    this.startDungeonMusic();
    this.phase = GraveFallGame.scene.Game.PHASE_COMMAND;
    this.turnTimerMs = 25000;
    this.lastTurnWarningSecond = null;
    this.turnTimerText.visible = true;
    this.turnTimerText.alpha = 1;
    this.turnTimerText.text = "25";
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

    // --- SCORE TRIGGER: Defeated Enemies ---
    this.addScorePopup(1000, "ENEMY DEFEATED");
    if (this.encounterAllyDowned !== true) {
        this.addScorePopup(500, "FLAWLESS BATTLE");
    }
    // ---------------------------------------

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
            this.turnTimerText.text = "25";
        } else {
            actionsAlpha = 1;
            this.setEnemyUiAlpha(1);
            this.setPlayerTransitionVisibility(true, true);
            this.setPlayerTransitionAlpha(1, 1);
            this.setPlayerActionMenusVisible(true);
            this.turnTimerText.visible = true;
            this.turnTimerText.alpha = 1;
            this.turnTimerText.text = "25";

            if (this.passageTransitionActionsShown !== true) {
                this.passageTransitionActionsShown = true;
                this.finishEnemyDefeatedTransitionToCommand();
                return;
            }
        }
    }

    if (this.enemyDefeatedTimerMs <= 0) {
        this.finishEnemyDefeatedTransitionToCommand();
    }
};


GraveFallGame.scene.Game.prototype.updateActionPreviewEffects = function (step) {
    var i;
    var menu;
    var popup;
    var flashRatio;
    var shakeRatio;
    var shakeX;
    var shakeY;
    var delayed;

    if (this.delayedSfxQueue) {
        for (i = this.delayedSfxQueue.length - 1; i >= 0; i--) {
            delayed = this.delayedSfxQueue[i];
            delayed.delayMs -= step;

            if (delayed.delayMs <= 0) {
                this.playSfx(delayed.soundName, delayed.volume, delayed.pan, delayed.unique);
                this.delayedSfxQueue.splice(i, 1);
            }
        }
    }

    if (this.damagePopups) {
        for (i = this.damagePopups.length - 1; i >= 0; i--) {
            popup = this.damagePopups[i];
            popup.life -= step;
            popup.y -= (popup.floatSpeed || 22) * (step / 1000);

            if (popup.life < 240) {
                popup.alpha = Math.max(0, popup.life / 240);
            }

            if (popup.life <= 0) {
                if (popup.parent) {
                    popup.parent.removeChild(popup, true);
                }

                this.damagePopups.splice(i, 1);
            }
        }
    }

    if (this.enemyPreviewFlashTimerMs > 0) {
        this.enemyPreviewFlashTimerMs -= step;
        flashRatio = this.enemyPreviewFlashDurationMs > 0 ? this.enemyPreviewFlashTimerMs / this.enemyPreviewFlashDurationMs : 0;

        if (this.enemySprite) {
            this.enemySprite.alpha = Math.max(0.3, Math.min(1, flashRatio < 0.5 ? 1 : 0.35));
        }

        if (this.enemyPreviewFlashTimerMs <= 0 && this.enemySprite && this.phase !== GraveFallGame.scene.Game.PHASE_ENEMY_DEFEATED) {
            this.enemySprite.alpha = 1;
        }
    }

    if (this.enemySprite && this.enemyPreviewShakeTimerMs > 0) {
        if (typeof this.enemyPreviewBaseX !== "number") {
            this.enemyPreviewBaseX = this.enemySprite.x;
            this.enemyPreviewBaseY = this.enemySprite.y;
        }

        this.enemyPreviewShakeTimerMs -= step;
        shakeRatio = this.enemyPreviewShakeDurationMs > 0 ? this.enemyPreviewShakeTimerMs / this.enemyPreviewShakeDurationMs : 0;
        shakeX = (Math.random() < 0.5 ? -1 : 1) * Math.ceil((this.enemyPreviewShakeAmountX || 8) * Math.max(0, shakeRatio));
        shakeY = (Math.random() < 0.5 ? -1 : 1) * Math.ceil((this.enemyPreviewShakeAmountY || 5) * Math.max(0, shakeRatio));

        if (this.enemyPreviewShakeTimerMs > 0) {
            this.enemySprite.x = this.enemyPreviewBaseX + shakeX;
            this.enemySprite.y = this.enemyPreviewBaseY + shakeY;
        } else {
            this.restoreEnemyDamagePreviewShake();
        }
    }

    if (!this.playerMenus) {
        return;
    }

    for (i = 0; i < this.playerMenus.length; i++) {
        menu = this.playerMenus[i];

        if (!menu || !menu.stand || menu.previewShakeTimerMs <= 0) {
            continue;
        }

        if (typeof menu.previewStandBaseX !== "number") {
            menu.previewStandBaseX = menu.stand.x;
            menu.previewStandBaseY = menu.stand.y;
        }

        menu.previewShakeTimerMs -= step;
        shakeRatio = menu.previewShakeDurationMs > 0 ? menu.previewShakeTimerMs / menu.previewShakeDurationMs : 0;
        shakeX = (Math.random() < 0.5 ? -1 : 1) * Math.ceil((menu.previewShakeAmountX || 4) * Math.max(0, shakeRatio));
        shakeY = (Math.random() < 0.5 ? -1 : 1) * Math.ceil((menu.previewShakeAmountY || 3) * Math.max(0, shakeRatio));

        if (menu.previewShakeTimerMs > 0) {
            menu.stand.x = menu.previewStandBaseX + shakeX;
            menu.stand.y = menu.previewStandBaseY + shakeY;
        } else {
            this.restorePlayerActionPreviewShake(menu);
        }
    }
};

GraveFallGame.scene.Game.prototype.clearActionPreviewState = function () {
    var i;

    this.actionPreviewQueue = [];
    this.actionPreviewIndex = 0;
    this.actionPreviewTimerMs = 0;
    this.actionPreviewCurrentMenu = null;
    this.actionPreviewStepStarted = false;
    this.enemyPreviewFlashTimerMs = 0;
    this.enemyPreviewFlashDurationMs = 0;
    this.restoreEnemyDamagePreviewShake();

    if (this.enemySprite && this.phase !== GraveFallGame.scene.Game.PHASE_ENEMY_DEFEATED) {
        this.enemySprite.alpha = 1;
    }

    if (this.playerMenus) {
        for (i = 0; i < this.playerMenus.length; i++) {
            this.restorePlayerActionPreviewShake(this.playerMenus[i]);
        }
    }
};

GraveFallGame.scene.Game.prototype.buildActionPreviewQueue = function () {
    var queue = [];
    var i;
    var menu;

    for (i = 0; i < this.playerMenus.length; i++) {
        menu = this.playerMenus[i];

        if (menu && menu.healthCurrent > 0 && menu.selectedAction !== null && typeof menu.selectedAction !== "undefined") {
            queue.push(menu);
        }
    }

    return queue;
};

GraveFallGame.scene.Game.prototype.startActionPreviewPhase = function () {
    var i;
    var menu;

    if (typeof this.hideAllCharacterMenuTooltips === "function") {
        this.hideAllCharacterMenuTooltips();
    }

    if (this.enemyHealthCurrent <= 0) {
        this.startEnemyDefeatedSequence();
        return;
    }

    this.phase = GraveFallGame.scene.Game.PHASE_ACTION_PREVIEW;
    this.commandActionsResolved = false;
    this.actionPreviewQueue = this.buildActionPreviewQueue();
    this.actionPreviewIndex = 0;
    this.actionPreviewTimerMs = 0;
    this.actionPreviewCurrentMenu = null;
    this.actionPreviewStepStarted = false;
    this.lastTurnWarningSecond = null;

    if (this.turnTimerText) {
        this.turnTimerText.visible = false;
        this.turnTimerText.alpha = 0;
    }

    for (i = 0; i < this.playerMenus.length; i++) {
        menu = this.playerMenus[i];
        menu.actionPreviewResolved = false;
        menu.isDefending = false;

        if (menu.stand) {
            menu.stand.visible = menu.healthCurrent > 0;
            menu.stand.alpha = menu.healthCurrent > 0 ? 1 : 0;
        }
    }

    if (this.actionPreviewQueue.length <= 0) {
        this.commandActionsResolved = true;
        this.startActionPhase();
        return;
    }

    this.beginActionPreviewStep();
};

GraveFallGame.scene.Game.prototype.beginActionPreviewStep = function () {
    var playerMenu;
    var standState;

    if (!this.actionPreviewQueue || this.actionPreviewIndex >= this.actionPreviewQueue.length) {
        this.finishActionPreviewPhase();
        return;
    }

    playerMenu = this.actionPreviewQueue[this.actionPreviewIndex];

    if (!playerMenu || playerMenu.healthCurrent <= 0) {
        this.actionPreviewIndex++;
        this.beginActionPreviewStep();
        return;
    }

    this.actionPreviewCurrentMenu = playerMenu;
    this.actionPreviewTimerMs = this.getActionPreviewDuration(playerMenu.selectedAction);
    this.actionPreviewStepStarted = true;

    standState = this.getActionPreviewStandState(playerMenu.selectedAction, playerMenu);
    playerMenu.standActionState = standState;
    this.updatePlayerDamageState(playerMenu, this.areAllPlayersDown());
    this.startPlayerActionPreviewShake(playerMenu, playerMenu.selectedAction);
    this.applyCommandActionForPlayer(playerMenu);
};

GraveFallGame.scene.Game.prototype.finishActionPreviewPhase = function () {
    var i;

    this.commandActionsResolved = true;

    for (i = 0; i < this.playerMenus.length; i++) {
        this.restorePlayerActionPreviewShake(this.playerMenus[i]);
    }

    this.clearActionPreviewState();

    if (this.enemyHealthCurrent <= 0) {
        this.startEnemyDefeatedSequence();
        return;
    }

    this.startActionPhase();
};

GraveFallGame.scene.Game.prototype.updateActionPreviewPhase = function (step) {
    if (!this.actionPreviewQueue || this.actionPreviewQueue.length <= 0) {
        this.finishActionPreviewPhase();
        return;
    }

    this.actionPreviewTimerMs -= step;

    if (this.actionPreviewTimerMs > 0) {
        return;
    }

    if (this.actionPreviewCurrentMenu) {
        this.restorePlayerActionPreviewShake(this.actionPreviewCurrentMenu);
    }

    if (this.enemyHealthCurrent <= 0) {
        this.finishActionPreviewPhase();
        return;
    }

    this.actionPreviewIndex++;

    if (this.actionPreviewIndex >= this.actionPreviewQueue.length) {
        this.finishActionPreviewPhase();
        return;
    }

    this.beginActionPreviewStep();
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
    this.actionPhaseTimer = enemy.actionPhaseDuration;
    this.nextPatternIn = 0;
    this.actionPhaseStartDelayFrames = this.firstActionPhasePromptShown === true ? 0 : 30;

    if (this.actionPhaseStartDelayFrames > 0) {
        this.firstActionPhasePromptShown = true;

        if (this.actionPromptText) {
            this.actionPromptText.visible = true;
            this.actionPromptText.alpha = 1;
        }
    } else if (this.actionPromptText) {
        this.actionPromptText.visible = false;
        this.actionPromptText.alpha = 0;
    }

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

    if (this.actionPromptText) {
        this.actionPromptText.visible = false;
        this.actionPromptText.alpha = 0;
    }
    this.commandActionsResolved = false;
    this.clearProjectiles();
    this.setBattleArenaVisible(false);
    this.clearArenaItem();

    this.turnTimerMs = 25000;
    this.lastTurnWarningSecond = null;
    this.turnTimerText.visible = true;
    this.turnTimerText.alpha = 1;
    this.turnTimerText.text = "25";

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
        this.restorePlayerCommandMenuVisibility(this.playerMenus[i]);

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

    if (options.resource) {
        display = new rune.display.Sprite(options.x, options.y, options.width, options.height, options.resource);
        this.applyPaletteSwaps(
            display,
            this.getProjectilePaletteSwaps(options.projectilePalette)
        );
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

    display.vx = options.vx || 0;
    display.vy = options.vy || 0;
    display.damage = options.damage || 8;
    display.life = options.life || 180;
    display.type = options.type || "generic";
    display.hitFlashFrames = 0;
    display.hit = false;

    return display;
};

GraveFallGame.scene.Game.prototype.spawnProjectile = function (options) {
    var projectile = this.createProjectileDisplay(options);
    this.arenaProjectileLayer.addChild(projectile);
    this.projectiles.push(projectile);
    return projectile;
};

GraveFallGame.scene.Game.prototype.spawnVerticalSweepProjectile = function (options) {
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
    hitbox.vx = options.vx || 0;
    hitbox.vy = options.vy || 0;
    hitbox.damage = options.damage || 8;
    hitbox.life = options.life || 180;
    hitbox.type = options.type || "generic";
    hitbox.hitFlashFrames = 0;
    hitbox.hit = false;

    this.arenaProjectileLayer.addChild(hitbox);
    this.projectiles.push(hitbox);
    return hitbox;
};