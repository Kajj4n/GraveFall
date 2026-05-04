//------------------------------------------------------------------------------
// Arena / battle state
//------------------------------------------------------------------------------

GraveFallGame.scene.Game.prototype.createBattleArena = function () {
    var uiSkin = GraveFallGame.scene.Game.UI_SKINS.dullBrown;
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
};

GraveFallGame.scene.Game.prototype.setBattleArenaVisible = function (visible) {
    this.arenaBackground.visible = visible;
    this.arenaProjectileLayer.visible = visible;
    this.arenaAvatarLayer.visible = visible;
    this.arenaFrame.visible = visible;
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

        if (i >= 2) {
            avatar.flippedX = true;
        } else {
            avatar.flippedX = false;
        }

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
    this.gameOverTimer = 180;
    this.playSfx(GraveFallGame.SOUNDS.GAME_OVER, 0.85);
    this.clearProjectiles();
    this.clearArenaItem();
    this.setBattleArenaVisible(false);
    this.turnTimerText.alpha = 0;
    this.updateAllPlayerDamageStates();

    if (!this.gameOverText) {
        this.gameOverText = new rune.text.BitmapField("GAME OVER");
        this.gameOverText.scaleX = 3;
        this.gameOverText.scaleY = 3;
        this.gameOverText.x = Math.floor((this.application.screen.width - (9 * 16 * this.gameOverText.scaleX)) / 2);
        this.gameOverText.y = 24;
        this.stage.addChild(this.gameOverText);
    }

    this.gameOverText.visible = true;
    this.gameOverText.alpha = 1;
};

GraveFallGame.scene.Game.prototype.updateGameOver = function () {
    if (this.gameOverTimer > 0) {
        this.gameOverTimer--;
    }

    if (this.gameOverText) {
        this.gameOverText.alpha = this.gameOverTimer % 20 < 12 ? 1 : 0.35;
    }

    if (this.gameOverTimer <= 0) {
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
    var showActions = visible === true && actionsVisible === true;

    if (!this.playerMenus) {
        return;
    }

    for (i = 0; i < this.playerMenus.length; i++) {
        menu = this.playerMenus[i];

        if (!menu) {
            continue;
        }

        if (visible !== true && typeof this.clearHealingStandAnimation === "function") {
            this.clearHealingStandAnimation(menu);
        }

        if (menu.container) {
            menu.container.visible = visible === true;
            menu.container.alpha = visible === true ? 1 : 0;
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
            menu.stand.visible = visible === true && menu.healthCurrent > 0;
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
    var showActions;

    playerAlpha = Math.max(0, Math.min(1, playerAlpha));
    actionsAlpha = Math.max(0, Math.min(1, actionsAlpha));
    showPlayer = playerAlpha > 0;
    showActions = actionsAlpha > 0;

    if (!this.playerMenus) {
        return;
    }

    for (i = 0; i < this.playerMenus.length; i++) {
        menu = this.playerMenus[i];

        if (!menu) {
            continue;
        }

        if (menu.container) {
            menu.container.visible = showPlayer;
            menu.container.alpha = playerAlpha;
        }

        if (menu.actionsContainer) {
            menu.actionsContainer.visible = showActions;
            menu.actionsContainer.alpha = actionsAlpha;
        }

        if (menu.selectionBar) {
            menu.selectionBar.visible = showActions && menu.healthCurrent > 0;
            menu.selectionBar.alpha = actionsAlpha;
        }

        if (menu.stand) {
            menu.stand.visible = showPlayer && menu.healthCurrent > 0;
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
    this.setDamageStateGroupState(this.enemySprite, "hp100");
    this.enemySprite.alpha = fadeIn === true ? 0 : 1;
    this.enemySprite.visible = fadeIn !== true;
    
    // Boss Z-Index Fix
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
        this.playerMenus[i].standActionState = null; // Clean up action state
        this.playerMenus[i].container.y = this.playerMenus[i].baseY;
        this.playerMenus[i].hitCooldown = 0;
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
        // Do not leave Rune's camera canvas resized after the transition.
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

    // Keep the actual camera locked to its native 1:1 render size. The old
    // transition used CameraViewport.zoom, which resized Rune's camera canvas
    // and made character sprites look blurry. This transition still gives a
    // forward passage push, but only by transforming the background art while
    // the party/enemy sprites are hidden.
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
        // Keep the pushed-in background hidden behind a completely black fade,
        // then snap it back at fadeInStartMs while the screen is still fully black.
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
    this.encounterIndex++;
    this.loadEnemyEncounter(this.getEnemyTypeForEncounter(this.encounterIndex), true);
    this.resetPlayersForNewEncounter();
    this.setEnemyUiAlpha(0);
    this.setPlayerTransitionVisibility(false, false);
    this.setPlayerTransitionAlpha(0, 0);
    this.turnTimerText.visible = false;
    this.turnTimerText.alpha = 0;
    this.turnTimerText.text = "10";
    this.turnTimerMs = 10000;
    this.lastTurnWarningSecond = null;
};

GraveFallGame.scene.Game.prototype.finishEnemyDefeatedTransitionToCommand = function () {
    if (this.passageTransitionEncounterLoaded !== true) {
        this.loadNextEnemyEncounterDuringTransition();
    }

    this.resetPassageCameraTransition();
    this.phase = GraveFallGame.scene.Game.PHASE_COMMAND;
    this.turnTimerMs = 10000;
    this.lastTurnWarningSecond = null;
    this.turnTimerText.visible = true;
    this.turnTimerText.alpha = 1;
    this.turnTimerText.text = "10";
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
        this.playerMenus[i].container.y = this.playerMenus[i].baseY;
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

    this.enemyDefeatedTimerMs -= step;
    this.passageTransitionTimerMs += step;
    elapsedMs = this.passageTransitionTimerMs;
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

    if (this.passageTransitionStepsPlayed !== true && elapsedMs >= (this.passageTransitionWalkStartMs || 1650)) {
        this.passageTransitionStepsPlayed = true;
        this.setPlayerTransitionVisibility(false, false);
        this.setPlayerTransitionAlpha(0, 0);
        this.playSfx(GraveFallGame.SOUNDS.PASSAGE_STEPS, 0.72);
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
            this.turnTimerText.text = "10";
        } else {
            actionsAlpha = 1;
            this.setEnemyUiAlpha(1);
            this.setPlayerTransitionVisibility(true, true);
            this.setPlayerTransitionAlpha(1, 1);
            this.setPlayerActionMenusVisible(true);
            this.turnTimerText.visible = true;
            this.turnTimerText.alpha = 1;
            this.turnTimerText.text = "10";

            if (this.passageTransitionActionsShown !== true) {
                this.passageTransitionActionsShown = true;
            }
        }
    }

    if (this.enemyDefeatedTimerMs <= 0) {
        this.finishEnemyDefeatedTransitionToCommand();
    }
};

GraveFallGame.scene.Game.prototype.startActionPhase = function () {
    var enemy = this.getCurrentEnemyConfig();
    var i;

    this.resolveCommandPhaseActions();

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
    this.clearProjectiles();
    this.setBattleArenaVisible(true);
    this.layoutBattleAvatarsInArena();

    for (i = 0; i < this.playerMenus.length; i++) {
        this.playerMenus[i].container.y = this.playerMenus[i].confirmedY;
        this.playerMenus[i].hitCooldown = 0;
        this.activateBattleAvatar(this.playerMenus[i]);
    }
};

GraveFallGame.scene.Game.prototype.endActionPhase = function () {
    var i;

    this.phase = GraveFallGame.scene.Game.PHASE_COMMAND;
    this.playSfx(GraveFallGame.SOUNDS.PHASE_END, 0.5);
    this.actionPhaseTimer = 0;
    this.nextPatternIn = 0;
    this.clearProjectiles();
    this.setBattleArenaVisible(false);
    this.clearArenaItem();

    this.turnTimerMs = 10000;
    this.lastTurnWarningSecond = null;
    this.turnTimerText.visible = true;
    this.turnTimerText.alpha = 1;
    this.turnTimerText.text = "10";

    for (i = 0; i < this.playerMenus.length; i++) {
        this.playerMenus[i].confirmed = false;
        this.playerMenus[i].selectedAction = null;
        this.playerMenus[i].standActionState = null; // Clean up action state
        this.playerMenus[i].container.y = this.playerMenus[i].baseY;
        this.playerMenus[i].hitCooldown = 0;
        this.playerMenus[i].isDefending = false;
        
        // Return menu to main state
        this.playerMenus[i].menuState = "main";
        this.updateCharacterMenuVisuals(this.playerMenus[i]);

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

    // Projectile art should use the transparent *_T files and the three-color
    // pink source ramp. Those colors are palette-swapped here into a neutral
    // white / grey / dark palette at runtime.
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