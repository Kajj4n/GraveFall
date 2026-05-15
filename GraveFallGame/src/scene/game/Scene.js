//------------------------------------------------------------------------------
// Scene lifecycle
//------------------------------------------------------------------------------

GraveFallGame.scene.Game.prototype.init = function () {
    rune.scene.Scene.prototype.init.call(this);

    this.runPaletteKey = GraveFallGame.scene.Game.resolveRunPaletteKey(this.runPaletteKey);
    this.runPalette = GraveFallGame.scene.Game.getRunPalette(this.runPaletteKey);
    this.uiSkin = this.runPalette.inside;
    this.outsideUiSkin = this.runPalette.outside;

    this.encounterIndex = 0;
    this.currentEnemyType = this.getEnemyTypeForEncounter(this.encounterIndex);
    this.actionPhaseTimer = 0;
    this.nextPatternIn = 0;
    this.minigameTimer = 0;
    this.minigameDurationMs = 0;
    this.projectiles = [];
    this.playerMenus = [];
    this.damagePopups = [];
    this.buffVisualEffects = [];
    this.delayedSfxQueue = [];
    this.actionPreviewQueue = [];
    this.actionPreviewIndex = 0;
    this.actionPreviewTimerMs = 0;
    this.actionPreviewCurrentMenu = null;
    this.actionPreviewStepStarted = false;
    this.actionPreviewStepDurationMs = 850;
    this.commandActionsResolved = false;
    this.enemyPreviewFlashTimerMs = 0;
    this.enemyPreviewFlashDurationMs = 0;
    this.enemyPreviewShakeTimerMs = 0;
    this.enemyPreviewShakeDurationMs = 0;
    this.enemyPreviewShakeAmountX = 0;
    this.enemyPreviewShakeAmountY = 0;
    this.enemyPreviewBaseX = null;
    this.enemyPreviewBaseY = null;
    this.enemyDefeatedHealRatio = 0.08;
    this.defendHealRatio = 0.04;
    this.firstActionPhasePromptShown = false;
    this.actionPhaseStartDelayFrames = 0;
    this.actionPromptTimerFrames = 0;

    this.arenaItem = null;
    this.itemSpawnTimer = 0;
    this.gameOverText = null;
    this.gameOverTimer = 0;
    this.lastTurnWarningSecond = null;
    this.enemyDefeatedSoundPlayed = false;
    this.dungeonMusic = null;

    this.commandMenuResetDone = false;
    
    this.enemyFadeTimerMs = 0;
    this.enemyFadeDurationMs = 1500;
    this.enemyDefeatedTimerMs = 0;

    // --- SCORE SYSTEM ---
    this.score = 0;
    this.scorePopups = [];
    this.encounterAllyDowned = false;

    this.passageTransitionTimerMs = 0;
    this.passageTransitionDurationMs = 9550;
    this.passageTransitionCorpseVanishMs = 1100;
    this.passageTransitionWalkStartMs = 1650;
    this.passageTransitionBlackStartMs = 3500;
    this.passageTransitionPlayerFadeOutDurationMs = 450;
    this.passageTransitionLoadEncounterMs = 4200;
    this.passageTransitionFadeInStartMs = 5200;
    this.passageTransitionFadeInEndMs = 6750;
    this.passageTransitionPlayerFadeStartMs = 6850;
    this.passageTransitionPlayerFadeEndMs = 7600;
    this.passageTransitionEnemyFadeStartMs = 7600;
    this.passageTransitionEnemyFadeEndMs = 9000;
    this.passageTransitionActionsFadeStartMs = 7600;
    this.passageTransitionActionsFadeEndMs = 9000;
    this.passageTransitionActionsAppearMs = 9000;
    this.passageTransitionEncounterLoaded = false;
    this.passageTransitionCorpseHidden = false;
    this.passageTransitionStepsPlayed = false;
    this.passageTransitionPartyRevealed = false;
    this.passageTransitionActionsShown = false;
    this.passageTransitionBackdropMaxScale = 1.95;
    this.passageTransitionFocusX = this.application.screen.width / 2;
    this.passageTransitionFocusY = this.application.screen.height * 0.48;

    // Dungeon music starts after the campfire-to-dungeon passage finishes.

    this.turnTimer = 600;
    this.turnTimerMs = this.getTurnTimerDurationMs();

    this.turnTimerText = new rune.text.BitmapField(this.getTurnTimerLabel(this.turnTimerMs));
    this.turnTimerText.scaleX = 2;
    this.turnTimerText.scaleY = 2;
    this.turnTimerText.x = this.application.screen.width - 28;
    this.turnTimerText.y = 8;

    this.backgroundBackdrop = new rune.display.Sprite(
        0,
        0,
        this.application.screen.width,
        this.application.screen.height,
        "Outside_Campfire"
    );
    this.backgroundBackdropResource = "Outside_Campfire";
    this.applyPaletteSwaps(
        this.backgroundBackdrop,
        this.getFramePaletteSwaps(this.outsideUiSkin)
    );
    this.stage.addChild(this.backgroundBackdrop);

    this.enemyHealthMax = this.getCurrentEnemyConfig().hpMax;
    this.enemyHealthCurrent = this.enemyHealthMax;
    this.enemySprite = this.createDamageStateGroup(
        0,
        0,
        100,
        100,
        this.getEnemyDamageStates(this.getCurrentEnemyConfig())
    );
    this.enemySprite.scaleX = 3.2;
    this.enemySprite.scaleY = 3.2;
    this.enemySprite.x = (this.application.screen.width / 1) - ((this.enemySprite.width * this.enemySprite.scaleX) / 1.28);
    this.enemySprite.y = 180;
    this.setDamageStateGroupState(this.enemySprite, "hp100");
    this.stage.addChild(this.enemySprite);
    this.bossPlaceholder = this.enemySprite;

    var eBarWidth = 300;
    var eBarHeight = 32;
    var eBarX = (this.application.screen.width / 2) - (eBarWidth / 2);
    var eBarY = 200;
    this.enemyHealthBarWidth = eBarWidth;
    this.enemyHealthBarX = eBarX; 

    this.enemyHealthBg = new rune.display.Graphic(eBarX, eBarY, eBarWidth, eBarHeight);
    this.enemyHealthBg.backgroundColor = "#111111";
    this.stage.addChild(this.enemyHealthBg);

    this.enemyHealthFill = new rune.display.Graphic(eBarX + 4, eBarY + 4, eBarWidth - 8, eBarHeight - 8);
    this.enemyHealthFill.backgroundColor = "#E53935"; 
    this.stage.addChild(this.enemyHealthFill);

    this.enemyHealthFrame = this.createBoxFrame(eBarX, eBarY, eBarWidth, eBarHeight, this.getFramePaletteSwaps(this.uiSkin));
    this.stage.addChild(this.enemyHealthFrame);

    this.enemyHealthText = new rune.text.BitmapField(this.enemyHealthCurrent + "/" + this.enemyHealthMax);
    this.enemyHealthText.scaleX = 2;
    this.enemyHealthText.scaleY = 2;
    this.enemyHealthText.x = eBarX + (eBarWidth / 2) - ((this.enemyHealthText.text.length * 6 * 2) / 2);
    this.enemyHealthText.y = eBarY + 8;
    this.stage.addChild(this.enemyHealthText);

    this.createBattleArena();
    this.stage.addChild(this.turnTimerText);

    // --- SCORE UI INIT ---
    this.scoreText = new rune.text.BitmapField("SCORE: 0");
    this.scoreText.width = 800;  // FIX: Hardcoded wide width prevents clipping
    this.scoreText.height = 64;  // FIX: Hardcoded tall height prevents vertical clipping
    this.scoreText.scaleX = 2;
    this.scoreText.scaleY = 2;
    this.scoreText.x = (this.application.screen.width / 2) - ((this.scoreText.text.length * 6 * 2) / 2);
    this.scoreText.y = 8;
    this.stage.addChild(this.scoreText);

    var partyMembers = this.partyMembers || GraveFallGame.scene.Game.PARTY_MEMBERS || [];
    var partySize = partyMembers.length;

    for (var partyIndex = 0; partyIndex < partySize; partyIndex++) {
        var partyMember = partyMembers[partyIndex];
        var renderIndex = typeof partyMember.partyRenderIndex === "number" ? partyMember.partyRenderIndex : partyIndex;
        var renderPartySize = typeof partyMember.partySize === "number" ? partyMember.partySize : partySize;

        this.playerMenus.push(this.createCharacterMenu({
            characterId: partyMember.id,
            characterName: partyMember.name,
            x: partyMember.x,
            y: partyMember.y,
            portrait: partyMember.portrait,
            classIcon: partyMember.classIcon,
            stand: partyMember.stand,
            hpCurrent: partyMember.hpCurrent,
            hpMax: partyMember.hpMax,
            playerTheme: this.getPlayerTheme(partyMember.themeIndex || 0),
            flipStandX: GraveFallGame.scene.Game.getPartyMemberFlippedX(renderIndex, renderPartySize),
            partyIndex: partyIndex,
            partyRenderIndex: renderIndex,
            partySize: renderPartySize,
            controls: partyMember.controls,
            moveControls: partyMember.moveControls,
            gamepadIndex: partyMember.gamepadIndex,
            attackMinigame: partyMember.attackMinigame,
            attackDamage: partyMember.attackDamage || 5,
            uiSkin: this.uiSkin
        }));
    }

    // --- INIT INTRO TRANSITION ---
    this.phase = GraveFallGame.scene.Game.PHASE_ENEMY_DEFEATED;
    this.enemyDefeatedTimerMs = this.passageTransitionDurationMs;
    this.passageTransitionTimerMs = 0;
    this.passageTransitionEncounterLoaded = false;
    this.passageTransitionIsIntro = true;
    this.passageTransitionCorpseHidden = true;
    this.passageTransitionStepsPlayed = false;
    this.passageTransitionPartyRevealed = false;
    this.passageTransitionActionsShown = false;
    this.enemyFadeTimerMs = this.enemyFadeDurationMs;
    
    this.clearProjectiles();
    this.clearArenaItem();
    this.clearBuffVisualEffects();
    this.setBattleArenaVisible(false);
    this.turnTimerText.visible = false;
    this.turnTimerText.alpha = 0;

    for (var p = 0; p < this.playerMenus.length; p++) {
        this.playerMenus[p].standActionState = null;
        this.playerMenus[p].container.y = this.playerMenus[p].baseY;
        this.updateCharacterMenuVisuals(this.playerMenus[p]);
    }

    this.updateAllPlayerDamageStates();
    this.setPlayerTransitionVisibility(false, false);
    this.setPlayerTransitionAlpha(0, 0);
    this.updateEnemyDamageState();
    this.setEnemyUiAlpha(0); 
    this.applyPassageCameraTransition(0);

    this.registerDevConsoleCommands();
};

// --- NEW SCORE HELPER FUNCTIONS ---
GraveFallGame.scene.Game.prototype.changeScore = function(amount) {
    this.score += amount;
    if (this.score < 0) this.score = 0;
    this.updateScoreUi();
};

GraveFallGame.scene.Game.prototype.addScorePopup = function(amount, text) {
    if (!this.scorePopups) this.scorePopups = [];

    var sign = amount > 0 ? "+" : "";
    var fullText = sign + amount + " " + text;
    var popup = new rune.text.BitmapField(fullText);
    var popupScale = amount < 0 ? 1.65 : 1.5;
    var targetY = 38;

    popup.width = 900; // Prevent clipping on longer reason strings.
    popup.height = 72;
    popup.scaleX = popupScale;
    popup.scaleY = popupScale;
    popup.x = (this.application.screen.width / 2) - ((fullText.length * 6 * popupScale) / 2);

    if (this.scorePopups.length > 0) {
        targetY = this.scorePopups[this.scorePopups.length - 1].y + 24;
    }

    if (targetY > 128) {
        targetY = 38;
    }

    popup.y = targetY;
    popup.life = 1700;

    // Leave score/highscore popups in Rune's default BitmapField styling. The
    // default small font includes its readable pale text and black backdrop.
    this.stage.addChild(popup);
    this.scorePopups.push(popup);

    this.changeScore(amount);
};

GraveFallGame.scene.Game.prototype.updateScoreUi = function() {
    if (this.scoreText) {
        this.scoreText.text = "SCORE: " + this.score;
        this.scoreText.x = (this.application.screen.width / 2) - ((this.scoreText.text.length * 6 * 2) / 2);
    }
};

GraveFallGame.scene.Game.prototype.updateScorePopups = function(step) {
    if (!this.scorePopups) return;
    for (var i = this.scorePopups.length - 1; i >= 0; i--) {
        var p = this.scorePopups[i];
        p.life -= step;
        p.y += (12 * (step / 1000)); 
        
        if (p.life <= 400) {
            p.alpha = Math.max(0, p.life / 400);
        }
        if (p.life <= 0) {
            if (p.parent) p.parent.removeChild(p, true);
            this.scorePopups.splice(i, 1);
        }
    }
};

GraveFallGame.scene.Game.prototype.update = function (step) {
    var i;
    var secondsLeft;
    var autoSelected;
    var requiresMinigame;

    rune.scene.Scene.prototype.update.call(this, step);

    if (this.isDevConsoleInputActive && this.isDevConsoleInputActive()) {
        return;
    }

    this.updateHealingStandAnimations(step);
    this.updateBuffVisualEffects(step);
    this.updateScorePopups(step); 
    this.updateActionPreviewEffects(step);

    if (this.phase !== GraveFallGame.scene.Game.PHASE_COMMAND) {
        this.commandMenuResetDone = false;
    }

    if (this.phase !== GraveFallGame.scene.Game.PHASE_ENEMY_DEFEATED && this.enemyFadeTimerMs < this.enemyFadeDurationMs) {
        this.enemyFadeTimerMs += step;
        var fadeAlpha = Math.min(1, this.enemyFadeTimerMs / this.enemyFadeDurationMs);
        this.setEnemyUiAlpha(fadeAlpha);
    }

    if (this.phase === GraveFallGame.scene.Game.PHASE_GAME_OVER) {
        this.updateGameOver();
        return;
    }

    if (this.phase === GraveFallGame.scene.Game.PHASE_ENEMY_DEFEATED) {
        this.updateEnemyDefeatedSequence(step);
        return;
    }

    if (this.phase === GraveFallGame.scene.Game.PHASE_COMMAND) {
        if (!this.commandMenuResetDone && this.turnTimerMs === this.getTurnTimerDurationMs()) {
            this.resetPlayerMenusForCommandPhase();
            this.commandMenuResetDone = true;
        }

        this.turnTimerMs -= step;

        if (this.turnTimerMs < 0) {
            this.turnTimerMs = 0;
        }

        secondsLeft = Math.ceil(this.turnTimerMs / 1000);
        this.turnTimerText.text = String(secondsLeft);

        if (secondsLeft > 0 && secondsLeft <= 3 && this.lastTurnWarningSecond !== secondsLeft) {
            this.lastTurnWarningSecond = secondsLeft;
            this.playSfx(GraveFallGame.SOUNDS.TURN_WARNING, 0.45);
        }

        for (i = 0; i < this.playerMenus.length; i++) {
            this.updateCharacterMenuInput(this.playerMenus[i]);
        }

        if (this.turnTimerMs <= 0 || this.areAllPlayersConfirmed()) {
            if (this.turnTimerMs <= 0) {
                autoSelected = false;

                for (i = 0; i < this.playerMenus.length; i++) {
                    if (!this.playerMenus[i].confirmed && this.playerMenus[i].healthCurrent > 0) {
                        this.playerMenus[i].selectedIndex = 0;
                        this.playerMenus[i].selectedAction = 0;
                        this.playerMenus[i].standActionState = "itemAttack";
                        this.playerMenus[i].confirmed = true;
                        this.playerMenus[i].container.y = this.playerMenus[i].confirmedY;
                        autoSelected = true;
                    }
                }

                if (autoSelected) {
                    this.playSfx(GraveFallGame.SOUNDS.TURN_TIMEOUT, 0.7);
                }
            }

            requiresMinigame = false;

            for (i = 0; i < this.playerMenus.length; i++) {
                if (this.playerMenus[i].healthCurrent > 0 && this.playerMenus[i].selectedAction === 0) {
                    requiresMinigame = true;
                    break;
                }
            }

            if (typeof this.hideAllCharacterMenuTooltips === "function") {
                this.hideAllCharacterMenuTooltips();
            }

            if (requiresMinigame && typeof this.startMinigamePhase === "function") {
                this.startMinigamePhase();
            } else {
                this.startActionPreviewPhase();
            }

            return;
        }
    } else if (this.phase === GraveFallGame.scene.Game.PHASE_MINIGAME) {
        this.updateMinigamePhase(step);
    } else if (this.phase === GraveFallGame.scene.Game.PHASE_ACTION_PREVIEW) {
        this.updateActionPreviewPhase(step);
    } else if (this.phase === GraveFallGame.scene.Game.PHASE_ACTION) {
        this.updateActionPhase();
    }

    if (this.keyboard.justPressed("escape")) {
        this.playSfx(GraveFallGame.SOUNDS.UI_BACK, 0.55);
        this.application.scenes.load([
            new GraveFallGame.scene.Menu()
        ]);
    }
};

GraveFallGame.scene.Game.prototype.resetPlayerMenusForCommandPhase = function () {
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

        if (typeof this.clearHealingStandAnimation === "function") {
            this.clearHealingStandAnimation(menu);
        }

        menu.menuState = "main";
        menu.selectedIndex = 0;
        menu.selectedAction = null;
        menu.selectedDefendTargetPartyIndex = null;
        menu.standActionState = null;
        menu.confirmed = false;
        menu.container.y = menu.baseY;

        this.restorePlayerCommandMenuVisibility(menu);
    }
};

GraveFallGame.scene.Game.prototype.startHealingStandAnimation = function (playerMenu) {
    var standResource;
    var sprite;
    var theme;
    var standFrameWidth;
    var standFrameHeight;
    var standParent;
    var standIndex;

    if (!playerMenu || !playerMenu.stand || !playerMenu.standResource) {
        return;
    }

    theme = playerMenu.theme || this.getPlayerTheme(0);
    standResource = playerMenu.standResource.replace("_Idle_Stance", "_Item_Potion");

    if (!this.resourceExists(standResource)) {
        return;
    }

    if (playerMenu.healingStandSprite && playerMenu.healingStandSprite.parent) {
        playerMenu.healingStandSprite.parent.removeChild(playerMenu.healingStandSprite, true);
    }

    standFrameWidth = playerMenu.stand.unscaledWidth || 100;
    standFrameHeight = playerMenu.stand.unscaledHeight || 100;

    if (playerMenu.stand.stateSprites && playerMenu.stand.stateSprites.length > 0) {
        standFrameWidth = playerMenu.stand.stateSprites[0].unscaledWidth || standFrameWidth;
        standFrameHeight = playerMenu.stand.stateSprites[0].unscaledHeight || standFrameHeight;
    }

    sprite = new rune.display.Sprite(
        playerMenu.stand.x,
        playerMenu.stand.y,
        standFrameWidth,
        standFrameHeight,
        standResource
    );

    sprite.scaleX = playerMenu.stand.scaleX;
    sprite.scaleY = playerMenu.stand.scaleY;
    sprite.alpha = 1;

    if (playerMenu.flipStandX === true || (playerMenu.stand && playerMenu.stand.damageStateFlippedX === true)) {
        sprite.flippedX = true;
    }

    standParent = playerMenu.stand.parent || this.stage;
    standIndex = typeof standParent.getChildIndex === "function" ? standParent.getChildIndex(playerMenu.stand) : -1;

    if (standIndex > -1 && typeof standParent.addChildAt === "function") {
        standParent.addChildAt(sprite, Math.min(standParent.numChildren, standIndex + 1));
    } else {
        standParent.addChild(sprite);
    }

    this.applyPaletteSwaps(sprite, this.getClothingPaletteSwaps(theme));
    this.applyMonochromeIconColor(sprite, theme.accentLight);

    playerMenu.healingStandSprite = sprite;
    playerMenu.healingStandTimer = 2000;

    playerMenu.stand.visible = false;
    playerMenu.stand.alpha = 0;
};

GraveFallGame.scene.Game.prototype.updateHealingStandAnimations = function (step) {
    var i;
    var menu;

    if (!this.playerMenus) {
        return;
    }

    for (i = 0; i < this.playerMenus.length; i++) {
        menu = this.playerMenus[i];

        if (!menu || !menu.healingStandSprite) {
            continue;
        }

        menu.healingStandTimer -= step;

        if (menu.healingStandTimer > 0) {
            continue;
        }

        if (menu.healingStandSprite.parent) {
            menu.healingStandSprite.parent.removeChild(menu.healingStandSprite, true);
        }

        menu.healingStandSprite = null;
        menu.healingStandTimer = 0;

        if (this.phase !== GraveFallGame.scene.Game.PHASE_ACTION && menu.stand) {
            menu.stand.visible = true;
            menu.stand.alpha = 1;
        }
    }
};

GraveFallGame.scene.Game.prototype.clearHealingStandAnimation = function (playerMenu, restoreStand) {
    if (!playerMenu || !playerMenu.healingStandSprite) {
        return;
    }

    if (playerMenu.healingStandSprite.parent) {
        playerMenu.healingStandSprite.parent.removeChild(playerMenu.healingStandSprite, true);
    }

    playerMenu.healingStandSprite = null;
    playerMenu.healingStandTimer = 0;

    if (restoreStand === true && playerMenu.stand) {
        playerMenu.stand.visible = true;
        playerMenu.stand.alpha = 1;
    }
};

GraveFallGame.scene.Game.prototype.clearAllHealingStandAnimations = function (restoreStand) {
    var i;

    if (!this.playerMenus) {
        return;
    }

    for (i = 0; i < this.playerMenus.length; i++) {
        this.clearHealingStandAnimation(this.playerMenus[i], restoreStand === true);
    }
};

GraveFallGame.scene.Game.prototype.dispose = function () {
    var i;

    this.unregisterDevConsoleCommands();

    this.stopDungeonMusic();
    this.clearProjectiles();
    this.clearArenaItem();
    this.clearBuffVisualEffects();

    if (this.playerMenus) {
        for (i = 0; i < this.playerMenus.length; i++) {
            this.clearHealingStandAnimation(this.playerMenus[i]);
        }
    }

    this.projectiles = null;
    this.buffVisualEffects = null;
    this.playerMenus = null;
    this.backgroundBackdrop = null;
    this.backgroundBackdropResource = null;
    this.runPalette = null;
    this.runPaletteKey = null;
    this.uiSkin = null;
    this.outsideUiSkin = null;
    this.bossPlaceholder = null;
    this.enemySprite = null;
    this.enemyHealthCurrent = null;
    this.enemyHealthMax = null;
    
    this.enemyHealthBg = null;
    this.enemyHealthFill = null;
    this.enemyHealthFrame = null;
    this.enemyHealthText = null;
    this.enemyHealthBarWidth = null;
    this.enemyHealthBarX = null;
    this.enemyPreviewShakeTimerMs = null;
    this.enemyPreviewShakeDurationMs = null;
    this.enemyPreviewShakeAmountX = null;
    this.enemyPreviewShakeAmountY = null;
    this.enemyPreviewBaseX = null;
    this.enemyPreviewBaseY = null;
    this.enemyDefeatedHealRatio = null;
    this.defendHealRatio = null;
    this.firstActionPhasePromptShown = null;
    this.actionPhaseStartDelayFrames = null;
    this.actionPromptTimerFrames = null;
    this.actionPromptText = null;
    this.enemyFadeTimerMs = null;
    this.enemyFadeDurationMs = null;
    this.enemyDefeatedTimerMs = null;
    this.encounterIndex = null;
    this.commandMenuResetDone = null;
    this.passageTransitionTimerMs = null;
    this.passageTransitionDurationMs = null;
    this.passageTransitionCorpseVanishMs = null;
    this.passageTransitionWalkStartMs = null;
    this.passageTransitionBlackStartMs = null;
    this.passageTransitionPlayerFadeOutDurationMs = null;
    this.passageTransitionLoadEncounterMs = null;
    this.passageTransitionFadeInStartMs = null;
    this.passageTransitionFadeInEndMs = null;
    this.passageTransitionPlayerFadeStartMs = null;
    this.passageTransitionPlayerFadeEndMs = null;
    this.passageTransitionEnemyFadeStartMs = null;
    this.passageTransitionEnemyFadeEndMs = null;
    this.passageTransitionActionsFadeStartMs = null;
    this.passageTransitionActionsFadeEndMs = null;
    this.passageTransitionActionsAppearMs = null;
    this.passageTransitionEncounterLoaded = null;
    this.passageTransitionIsIntro = null;
    this.passageTransitionCorpseHidden = null;
    this.passageTransitionStepsPlayed = null;
    this.passageTransitionPartyRevealed = null;
    this.passageTransitionActionsShown = null;
    this.passageTransitionBackdropMaxScale = null;
    this.passageTransitionFocusX = null;
    this.passageTransitionFocusY = null;

    // --- SCORE DISPOSE ---
    this.scoreText = null;
    this.scorePopups = null;
    this.finalScoreText = null;
    this.gameOverPartyNameText = null;
    this.gameOverInstruction = null;

    this.avoidDamageText = null;

    this.arenaBackground = null;
    this.arenaProjectileLayer = null;
    this.arenaAvatarLayer = null;
    this.arenaFrame = null;
    this.arena = null;
    this.turnTimerText = null;
    this.turnTimerMs = null;
    this.minigameTimer = null;
    this.minigameDurationMs = null;
    this.arenaItem = null;
    this.itemSpawnTimer = null;
    this.gameOverText = null;
    this.gameOverTimer = null;
    this.dungeonMusic = null;

    rune.scene.Scene.prototype.dispose.call(this);
};