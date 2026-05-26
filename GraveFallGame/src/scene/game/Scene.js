//------------------------------------------------------------------------------
// Scene lifecycle
//------------------------------------------------------------------------------

GraveFallGame.scene.Game.prototype.init = function () {
    GraveFallGame.useBitmapFont();

    rune.scene.Scene.prototype.init.call(this);

    this.runPaletteKey = GraveFallGame.scene.Game.resolveRunPaletteKey(this.runPaletteKey);
    this.runPalette = GraveFallGame.scene.Game.getRunPalette(this.runPaletteKey);
    this.uiSkin = this.runPalette.inside;
    this.outsideUiSkin = this.runPalette.outside;

    this.encounterIndex = 0;

    this.currentEncounterDifficultyMode = null;
    this.nextEncounterDifficultyMode = null;
    this.encounterDifficultyModeActive = null;
    this.lastNormalEnemyType = null;
    this.lastBossEnemyType = null;
    this.currentEnemyType = this.getEnemyTypeForEncounter(this.encounterIndex);
    this.enemyDifficultyCounts = {};
    this.currentEnemyDifficulty = null;
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
    this.finalChargeCompleted = false;
    this.finalChargeUi = null;
    this.finalChargeTimerMs = 0;
    this.finalChargeDurationMs = 0;
    this.finalChargePartyPower = 0;
    this.finalStrikeQueue = [];
    this.finalStrikeIndex = 0;
    this.finalStrikeTimerMs = 0;
    this.finalStrikeCurrentMenu = null;
    this.finalStrikeStepDurationMs = 520;
    this.finalChargeIntroDelayMs = 1200;
    this.finalChargeIntroTimerMs = 0;
    this.enemyPreviewFlashTimerMs = 0;
    this.enemyPreviewFlashDurationMs = 0;
    this.enemyPreviewShakeTimerMs = 0;
    this.enemyPreviewShakeDurationMs = 0;
    this.enemyPreviewShakeAmountX = 0;
    this.enemyPreviewShakeAmountY = 0;
    this.enemyPreviewBaseX = null;
    this.enemyPreviewBaseY = null;
    this.enemyDefeatedHealRatio = 0.15;
    this.bossDefeatedHealRatio = 0.25;
    this.defendHealRatio = 0.15;
    this.firstActionPhasePromptShown = false;
    this.actionPhaseStartDelayFrames = 0;
    this.actionPromptTimerFrames = 0;
    this.isPaused = false;
    this.pauseOverlay = null;
    this.pauseOverlayTitle = null;
    this.pauseOverlayHint = null;
    this.pauseMenuOptions = ["RESUME", "RETURN TO MENU", "QUIT GAME"];
    this.pauseMenuIndex = 0;
    this.pauseMenuButtons = [];

    this.arenaItem = null;
    this.itemSpawnTimer = 0;
    this.gameOverText = null;
    this.gameOverTimer = 0;
    this.lastTurnWarningSecond = null;
    this.enemyDefeatedSoundPlayed = false;
    this.dungeonMusic = null;
    this.bossMusic = null;
    this.musicFades = [];
    this.dungeonMusicDefaultVolume = 0.32;
    this.bossMusicDefaultVolume = 0.44;

    this.commandMenuResetDone = false;
    
    this.enemyFadeTimerMs = 0;
    this.enemyFadeDurationMs = 1500;
    this.enemyDefeatedTimerMs = 0;
    this.bossEntranceState = null;
    this.bossEntranceComplete = false;
    this.bossEntranceActionFadeStartMs = null;
    this.bossEntranceActionFadeDurationMs = 1400;
    this.enemyEntranceBaseScaleX = 3.2;
    this.enemyEntranceBaseScaleY = 3.2;

    // --- SCORE SYSTEM ---
    this.score = 0;
    this.scorePopups = [];
    this.clearRewardPopup = null;
    this.clearRewardPopupTimerMs = 0;
    this.clearRewardPopupDurationMs = 0;
    this.clearRewardPopupBlocksTransition = false;
    this.floorClearBonusAwardedForTransition = false;
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
    this.passageTransitionIsIntro = true;
    this.passageTransitionCorpseHidden = true;
    this.passageTransitionStepsPlayed = false;
    this.passageTransitionPartyRevealed = false;
    this.passageTransitionActionsShown = false;
    this.passageTransitionPendingFloorAdvance = false;
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
    this.enemyDisplaySprite = this.enemySprite;

    var eBarWidth = 300;
    var eBarHeight = 32;
    var eBarX = (this.application.screen.width / 2) - (eBarWidth / 2);
    var eBarY = 150;
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
    this.scoreText.width = 800;  
    this.scoreText.height = 64;  
    this.scoreText.scaleX = 2;
    this.scoreText.scaleY = 2;
    this.scoreText.x = (this.application.screen.width / 2) - ((this.scoreText.text.length * 6 * 2) / 2);
    this.scoreText.y = 8;
    this.stage.addChild(this.scoreText);

    // --- FLOOR UI INIT ---
    this.floorNumber = 1;
    this.floorText = new rune.text.BitmapField("FLOOR: " + this.floorNumber);
    this.floorText.width = 400;  
    this.floorText.height = 64;  
    this.floorText.scaleX = 2;
    this.floorText.scaleY = 2;
    this.floorText.x = 28;
    this.floorText.y = 8;
    this.stage.addChild(this.floorText);

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
            themeIndex: typeof partyMember.themeIndex === "number" ? partyMember.themeIndex : partyIndex,
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
    this.passageTransitionPendingFloorAdvance = false;
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

    if (typeof this.registerDevConsoleCommands === "function") {
        this.registerDevConsoleCommands();
    }
};

// --- NEW SCORE HELPER FUNCTIONS ---
GraveFallGame.scene.Game.prototype.changeScore = function(amount) {
    this.score += amount;
    if (this.score < 0) this.score = 0;
    this.updateScoreUi();
};

GraveFallGame.scene.Game.prototype.addScorePopup = function(amount, text, color) {
    if (!this.scorePopups) this.scorePopups = [];

    var sign = amount > 0 ? "+" : "";
    var fullText = sign + amount + " " + text;
    var popup = new rune.text.BitmapField(fullText);
    var popupScale = amount < 0 ? 1.65 : 1.5;
    var targetY = 38;

    popup.width = 900; 
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

    if (color) {
        var swaps = [{ from: "#ffffff", to: color }];
        if (popup.texture) {
            this.applyPaletteSwaps(popup, swaps);
        } else {
            var children = popup.children || [];
            if (typeof popup.getChildAt === "function" && popup.numChildren > 0) {
                children = [];
                for (var j = 0; j < popup.numChildren; j++) {
                    children.push(popup.getChildAt(j));
                }
            }
            for (var k = 0; k < children.length; k++) {
                this.applyPaletteSwaps(children[k], swaps);
            }
        }
    }

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


GraveFallGame.scene.Game.prototype.clearClearRewardPopup = function () {
    if (this.clearRewardPopup && this.clearRewardPopup.parent) {
        this.clearRewardPopup.parent.removeChild(this.clearRewardPopup, true);
    }

    this.clearRewardPopup = null;
    this.clearRewardPopupTimerMs = 0;
    this.clearRewardPopupDurationMs = 0;
    this.clearRewardPopupBlocksTransition = false;
};

GraveFallGame.scene.Game.prototype.createClearRewardText = function (text, x, y, width, scale, color, centered) {
    var safeText = this.sanitizeBitmapText ? this.sanitizeBitmapText(text) : String(text || "");
    var field = new rune.text.BitmapField(safeText.length > 0 ? safeText : " ");

    field.width = width;
    field.scaleX = scale;
    field.scaleY = scale;
    field.x = centered === true
        ? Math.round(x + ((width / 2) - ((field.text.length * 6 * scale) / 2)))
        : x;
    field.y = y;

    if (typeof this.tintBitmapFieldText === "function") {
        this.tintBitmapFieldText(field, color || (this.uiSkin && this.uiSkin.frame ? this.uiSkin.frame.light : "#FFFFFF"), true);
    }

    return field;
};

GraveFallGame.scene.Game.prototype.showClearRewardPopup = function (summary) {
    var screen = this.application.screen;
    var uiSkin = this.uiSkin || GraveFallGame.scene.Game.UI_SKINS.dullBrown;
    var framePaletteSwaps = this.getFramePaletteSwaps(uiSkin);
    var isBoss = !!(summary && summary.isBoss === true);
    var width = isBoss ? 600 : 520;
    var height = isBoss ? 230 : 166;
    var x = Math.round((screen.width - width) / 2);
    var y = isBoss ? 226 : 252;
    var popup;
    var bgTop;
    var bgBottom;
    var accent;
    var title;
    var lines;
    var i;
    var lineScale = isBoss ? 1.35 : 1.3;
    var lineY = isBoss ? 70 : 66;
    var scoreGained = summary && typeof summary.scoreGained === "number" ? summary.scoreGained : 0;
    var healingGained = summary && typeof summary.healingGained === "number" ? summary.healingGained : 0;
    var revivedCount = summary && typeof summary.revivedCount === "number" ? summary.revivedCount : 0;
    var flawlessScore = summary && typeof summary.flawlessScore === "number" ? summary.flawlessScore : 0;
    var floorScore = summary && typeof summary.floorScore === "number" ? summary.floorScore : 0;
    var defeatedName = summary && summary.enemyName ? summary.enemyName : "ENEMY";

    this.clearClearRewardPopup();

    popup = new rune.display.DisplayObjectContainer(x, y, width, height);
    popup.alpha = 0;
    popup.rewardPopElapsedMs = 0;
    popup.rewardPopDurationMs = 5000;
    popup.rewardBaseScaleX = 1;
    popup.rewardBaseScaleY = 1;
    popup.scaleX = 0.92;
    popup.scaleY = 0.92;

    bgTop = new rune.display.Graphic(0, 0, width, 56);
    bgTop.backgroundColor = uiSkin.panelTop;
    bgTop.alpha = 0.98;
    popup.addChild(bgTop);

    bgBottom = new rune.display.Graphic(0, 56, width, height - 56);
    bgBottom.backgroundColor = uiSkin.panelBottom;
    bgBottom.alpha = 0.96;
    popup.addChild(bgBottom);

    accent = new rune.display.Graphic(0, 54, width, 4);
    accent.backgroundColor = uiSkin.frame.mid;
    popup.addChild(accent);

    popup.addChild(this.createBoxFrame(0, 0, width, height, framePaletteSwaps));

    title = this.createClearRewardText(
        isBoss ? "FLOOR " + String(summary.floorCleared || this.floorNumber || 1) + " CLEARED" : defeatedName + " DEFEATED",
        0,
        17,
        width,
        isBoss ? 2.3 : 2.05,
        uiSkin.frame.light,
        true
    );
    popup.addChild(title);

    if (isBoss) {
        lines = [
            "BOSS VANQUISHED: " + defeatedName,
            "SCORE GAINED +" + String(scoreGained),
            "FLOOR BONUS +" + String(floorScore),
            "HP RESTORED +" + String(healingGained),
            revivedCount > 0 ? "REVIVED ALLIES: " + String(revivedCount) : "NEXT FLOOR: " + String((summary.floorCleared || this.floorNumber || 1) + 1)
        ];

        if (flawlessScore > 0) {
            lines.push("FLAWLESS BONUS +" + String(flawlessScore));
        } else if (revivedCount > 0) {
            lines.push("NEXT FLOOR: " + String((summary.floorCleared || this.floorNumber || 1) + 1));
        }
    } else {
        lines = [
            "SCORE GAINED +" + String(scoreGained),
            "HP RESTORED +" + String(healingGained),
            revivedCount > 0 ? "REVIVED ALLIES: " + String(revivedCount) : "MOVING ON..."
        ];

        if (flawlessScore > 0) {
            lines.push("FLAWLESS BONUS +" + String(flawlessScore));
        }
    }

    for (i = 0; i < lines.length; i++) {
        popup.addChild(this.createClearRewardText(lines[i], 30, lineY + (i * 26), width - 60, lineScale, uiSkin.frame.light, true));
    }

    this.stage.addChild(popup);
    this.clearRewardPopup = popup;
    this.clearRewardPopupTimerMs = popup.rewardPopDurationMs;
    this.clearRewardPopupDurationMs = popup.rewardPopDurationMs;
    this.clearRewardPopupBlocksTransition = true;

    this.playSfx(GraveFallGame.SOUNDS.UI_CONFIRM, isBoss ? 0.68 : 0.52);
};

GraveFallGame.scene.Game.prototype.updateClearRewardPopup = function (step) {
    var popup = this.clearRewardPopup;
    var duration;
    var elapsed;
    var ratio;
    var popScale;

    if (!popup) {
        return;
    }

    step = typeof step === "number" && isFinite(step) ? step : 16;
    duration = Math.max(1, this.clearRewardPopupDurationMs || popup.rewardPopDurationMs || 2200);

    this.clearRewardPopupTimerMs -= step;
    popup.rewardPopElapsedMs = (popup.rewardPopElapsedMs || 0) + step;
    elapsed = popup.rewardPopElapsedMs;
    ratio = Math.max(0, Math.min(1, elapsed / duration));

    if (elapsed < 180) {
        popup.alpha = Math.max(0, Math.min(1, elapsed / 180));
        popScale = 0.92 + (0.11 * Math.sin((elapsed / 180) * Math.PI));
        popup.scaleX = popScale;
        popup.scaleY = popScale;
    } else if (this.clearRewardPopupTimerMs < 420) {
        popup.alpha = Math.max(0, this.clearRewardPopupTimerMs / 420);
        popup.scaleX = 1;
        popup.scaleY = 1;
    } else {
        popup.alpha = 1;
        popup.scaleX = 1;
        popup.scaleY = 1;
    }

    popup.y += Math.sin(ratio * Math.PI) * 0.035 * (step / 16.6667);

    if (this.clearRewardPopupTimerMs <= 0) {
        this.clearClearRewardPopup();
    }
};

// --- ACTION PREVIEW HELPERS (RESTORED) ---
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
    var nonAttackQueue = [];
    var attackQueue = [];
    var i;
    var menu;

    for (i = 0; i < this.playerMenus.length; i++) {
        menu = this.playerMenus[i];

        if (menu && menu.healthCurrent > 0 && menu.selectedAction !== null && typeof menu.selectedAction !== "undefined") {
            if (menu.selectedAction === 0) {
                attackQueue.push(menu);
            } else {
                nonAttackQueue.push(menu);
            }
        }
    }

    return nonAttackQueue.concat(attackQueue);
};

GraveFallGame.scene.Game.prototype.startActionPreviewPhase = function () {
    var i;
    var menu;

    if (typeof this.hideAllCharacterMenuTooltips === "function") {
        this.hideAllCharacterMenuTooltips();
    }

    if (this.enemyHealthCurrent <= 0) {
        this.startEnemyDefeatResolution();
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
        this.startEnemyDefeatResolution();
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
// ---------------------------------------------------------


GraveFallGame.scene.Game.prototype.update = function (step) {
    var i;
    var secondsLeft;
    var autoSelected;
    var requiresMinigame;
    var pauseRequested;
    var gp;

    rune.scene.Scene.prototype.update.call(this, step);

    this.updateMusicFades(step);

    if (this.isDevConsoleInputActive && this.isDevConsoleInputActive()) {
        return;
    }

    pauseRequested = false;
    if (this.keyboard.justPressed("escape")) {
        pauseRequested = true;
    }

    for (i = 0; i < 4 && pauseRequested !== true; i++) {
        try {
            gp = this.gamepads.get(i);
        } catch (e) {
            gp = null;
        }

        if (gp && gp.connected && gp.justPressed(9)) {
            pauseRequested = true;
        }
    }

    if (this.isPaused === true) {
        this.updatePauseMenu(step);
        return;
    }

    if (this.phase !== GraveFallGame.scene.Game.PHASE_GAME_OVER && pauseRequested === true) {
        this.togglePauseState();
        return;
    }

    this.updateHealingStandAnimations(step);
    this.updateBuffVisualEffects(step);
    this.updateScorePopups(step);
    this.updateClearRewardPopup(step);
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

    if (this.phase === GraveFallGame.scene.Game.PHASE_FINAL_CHARGE) {
        this.updateFinalChargePhase(step);
        return;
    }

    if (this.phase === GraveFallGame.scene.Game.PHASE_FINAL_STRIKE) {
        this.updateFinalStrikePhase(step);
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
        this.updateActionPhase(step);
    }

};

GraveFallGame.scene.Game.prototype.ensurePauseOverlay = function () {
    var screen;
    var framePaletteSwaps;
    var overlay;
    var panel;
    var title;
    var hint;
    var buttonContainer;
    var buttonWidth;
    var buttonHeight;
    var buttonX;
    var buttonY;
    var buttonGap;
    var i;
    var button;
    var buttonFrame;
    var label;
    var selected;
    var labelX;
    var labelY;
    var options;

    if (this.pauseOverlay) {
        return this.pauseOverlay;
    }

    screen = this.application.screen;
    framePaletteSwaps = this.getFramePaletteSwaps(this.uiSkin || GraveFallGame.scene.Game.UI_SKINS.dullBrown);
    options = this.pauseMenuOptions || ["RESUME", "RETURN TO MENU", "QUIT GAME"];

    overlay = new rune.display.DisplayObjectContainer(0, 0, screen.width, screen.height);
    overlay.visible = false;
    overlay.alpha = 0.96;

    panel = new rune.display.Graphic(0, 0, screen.width, screen.height);
    panel.backgroundColor = "#000000";
    panel.alpha = 0.72;
    overlay.addChild(panel);

    title = new rune.text.BitmapField("PAUSED");
    title.width = 1000;
    title.scaleX = 3.5;
    title.scaleY = 3.5;
    title.x = Math.round((screen.width / 2) - ((title.text.length * 6 * 3.5) / 2));
    title.y = Math.round(screen.height * 0.30);
    overlay.addChild(title);

    hint = new rune.text.BitmapField("UP/DOWN TO CHOOSE   A / ENTER TO SELECT   ESC TO RESUME");
    hint.width = 1400;
    hint.scaleX = 1.5;
    hint.scaleY = 1.5;
    hint.x = Math.round((screen.width / 2) - ((hint.text.length * 6 * 1.5) / 2));
    hint.y = Math.round(screen.height * 0.40);
    overlay.addChild(hint);

    buttonContainer = new rune.display.DisplayObjectContainer(0, 0, screen.width, screen.height);
    overlay.addChild(buttonContainer);

    buttonWidth = 360;
    buttonHeight = 44;
    buttonGap = 18;
    buttonX = Math.round((screen.width / 2) - (buttonWidth / 2));
    buttonY = Math.round(screen.height * 0.50);
    this.pauseMenuButtons = [];

    for (i = 0; i < options.length; i++) {
        selected = i === this.pauseMenuIndex;
        button = new rune.display.Graphic(buttonX, buttonY + (i * (buttonHeight + buttonGap)), buttonWidth, buttonHeight);
        button.backgroundColor = selected ? this.uiSkin.panelTop : this.uiSkin.panelBottom;
        button.alpha = selected ? 1 : 0.88;
        buttonContainer.addChild(button);

        buttonFrame = this.createBoxFrame(buttonX, buttonY + (i * (buttonHeight + buttonGap)), buttonWidth, buttonHeight, framePaletteSwaps);
        buttonContainer.addChild(buttonFrame);

        label = new rune.text.BitmapField(options[i]);
        label.width = buttonWidth;
        label.scaleX = 1.8;
        label.scaleY = 1.8;
        labelX = Math.round(buttonX + ((buttonWidth - (label.text.length * 6 * 1.8)) / 2));
        labelY = Math.round(buttonY + (i * (buttonHeight + buttonGap)) + ((buttonHeight - (6 * 1.8)) / 2) - 1);
        label.x = labelX;
        label.y = labelY;
        buttonContainer.addChild(label);
        if (typeof this.tintBitmapFieldText === "function") {
            this.tintBitmapFieldText(label, selected ? this.uiSkin.frame.light : this.uiSkin.frame.mid, true);
        }

        this.pauseMenuButtons.push({ button: button, frame: buttonFrame, label: label });
    }

    this.stage.addChild(overlay);
    this.pauseOverlay = overlay;
    this.pauseOverlayTitle = title;
    this.pauseOverlayHint = hint;

    return overlay;
};

GraveFallGame.scene.Game.prototype.refreshPauseMenuButtons = function () {
    var i;
    var item;
    var options;

    options = this.pauseMenuOptions || ["RESUME", "RETURN TO MENU", "QUIT GAME"];
    if (!this.pauseMenuButtons) {
        return;
    }

    for (i = 0; i < this.pauseMenuButtons.length; i++) {
        item = this.pauseMenuButtons[i];
        if (!item) {
            continue;
        }

        item.button.backgroundColor = i === this.pauseMenuIndex ? this.uiSkin.panelTop : this.uiSkin.panelBottom;
        item.button.alpha = i === this.pauseMenuIndex ? 1 : 0.88;
        if (typeof this.tintBitmapFieldText === "function") {
            this.tintBitmapFieldText(item.label, i === this.pauseMenuIndex ? this.uiSkin.frame.light : this.uiSkin.frame.mid, true);
        }
        item.label.text = options[i] || "";
        item.label.x = Math.round(item.button.x + ((item.button.width - (item.label.text.length * 6 * item.label.scaleX)) / 2));
        item.label.y = Math.round(item.button.y + ((item.button.height - (6 * item.label.scaleY)) / 2) - 1);
    }
};

GraveFallGame.scene.Game.prototype.showPauseOverlay = function () {
    var overlay = this.ensurePauseOverlay();

    this.pauseMenuIndex = Math.max(0, Math.min(this.pauseMenuIndex || 0, (this.pauseMenuOptions || []).length - 1));
    this.refreshPauseMenuButtons();
    overlay.visible = true;
    overlay.alpha = 0.96;
};

GraveFallGame.scene.Game.prototype.hidePauseOverlay = function () {
    if (this.pauseOverlay) {
        this.pauseOverlay.visible = false;
        this.pauseOverlay.alpha = 0;
    }
};

GraveFallGame.scene.Game.prototype.togglePauseState = function () {
    this.isPaused = !this.isPaused;

    if (this.isPaused) {
        this.pauseMenuIndex = 0;
        this.showPauseOverlay();
    } else {
        this.hidePauseOverlay();
    }
};

GraveFallGame.scene.Game.prototype.executePauseMenuSelection = function () {
    var selection;

    selection = (this.pauseMenuOptions || ["RESUME", "RETURN TO MENU", "QUIT GAME"])[this.pauseMenuIndex] || "RESUME";

    if (selection === "RESUME") {
        this.togglePauseState();
        return;
    }

    if (selection === "RETURN TO MENU") {
        this.application.scenes.load([
            new GraveFallGame.scene.Menu()
        ]);
        return;
    }

    if (selection === "QUIT GAME") {
        if (typeof window !== "undefined" && window.close) {
            window.close();
        }
        this.application.scenes.load([
            new GraveFallGame.scene.Menu()
        ]);
    }
};

GraveFallGame.scene.Game.prototype.updatePauseMenu = function (step) {
    var i;
    var gp;
    var upPressed = false;
    var downPressed = false;
    var selectPressed = false;
    var resumePressed = false;

    if (this.keyboard.justPressed("escape")) {
        resumePressed = true;
    }
    if (this.keyboard.justPressed("up") || this.keyboard.justPressed("w")) {
        upPressed = true;
    }
    if (this.keyboard.justPressed("down") || this.keyboard.justPressed("s")) {
        downPressed = true;
    }
    if (this.keyboard.justPressed("enter") || this.keyboard.justPressed("space")) {
        selectPressed = true;
    }

    for (i = 0; i < 4; i++) {
        try {
            gp = this.gamepads.get(i);
        } catch (e) {
            gp = null;
        }

        if (gp && gp.connected) {
            if (gp.stickLeftJustUp || gp.justPressed(12)) upPressed = true;
            if (gp.stickLeftJustDown || gp.justPressed(13)) downPressed = true;
            if (gp.justPressed(0) || gp.justPressed(1) || gp.justPressed(2)) selectPressed = true;
            if (gp.justPressed(9)) resumePressed = true;
        }
    }

    if (upPressed === true) {
        this.pauseMenuIndex--;
        if (this.pauseMenuIndex < 0) {
            this.pauseMenuIndex = (this.pauseMenuOptions || []).length - 1;
        }
        GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_MOVE, 0.45);
        this.refreshPauseMenuButtons();
    }

    if (downPressed === true) {
        this.pauseMenuIndex++;
        if (this.pauseMenuIndex >= (this.pauseMenuOptions || []).length) {
            this.pauseMenuIndex = 0;
        }
        GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_MOVE, 0.45);
        this.refreshPauseMenuButtons();
    }

    if (resumePressed === true) {
        GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_BACK, 0.55);
        this.togglePauseState();
        return;
    }

    if (selectPressed === true) {
        GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_CONFIRM, 0.55);
        this.executePauseMenuSelection();
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

        if (typeof this.restorePlayerCommandMenuVisibility === "function") {
            this.restorePlayerCommandMenuVisibility(menu);
        }
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

    if (typeof this.unregisterDevConsoleCommands === "function") {
        this.unregisterDevConsoleCommands();
    }

    this.stopDungeonMusic();
    this.stopBossMusic();
    this.musicFades = [];
    this.clearProjectiles();
    this.clearArenaItem();
    this.clearBuffVisualEffects();
    if (typeof this.clearFinalChargeUi === "function") {
        this.clearFinalChargeUi();
    }
    if (typeof this.clearFinalStrikeState === "function") {
        this.clearFinalStrikeState();
    }

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
    this.enemyDisplaySprite = null;
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
    this.bossDefeatedHealRatio = null;
    this.defendHealRatio = null;
    this.finalChargeCompleted = null;
    this.finalChargeUi = null;
    this.finalChargeTimerMs = null;
    this.finalChargeDurationMs = null;
    this.finalChargePartyPower = null;
    this.finalStrikeQueue = null;
    this.finalStrikeIndex = null;
    this.finalStrikeTimerMs = null;
    this.finalStrikeCurrentMenu = null;
    this.finalStrikeStepDurationMs = null;
    this.finalChargeIntroDelayMs = null;
    this.finalChargeIntroTimerMs = null;
    this.firstActionPhasePromptShown = null;
    this.actionPhaseStartDelayFrames = null;
    this.actionPromptTimerFrames = null;
    this.actionPromptText = null;
    this.enemyFadeTimerMs = null;
    this.enemyFadeDurationMs = null;
    this.enemyDefeatedTimerMs = null;
    this.bossEntranceState = null;
    this.bossEntranceComplete = null;
    this.bossEntranceActionFadeStartMs = null;
    this.bossEntranceActionFadeDurationMs = null;
    this.enemyEntranceBaseScaleX = null;
    this.enemyEntranceBaseScaleY = null;
    this.lastNormalEnemyType = null;
    this.lastBossEnemyType = null;
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
    this.passageTransitionPendingFloorAdvance = null;
    this.passageTransitionBackdropMaxScale = null;
    this.passageTransitionFocusX = null;
    this.passageTransitionFocusY = null;

    // --- SCORE DISPOSE ---
    this.clearClearRewardPopup();
    this.scoreText = null;
    this.scorePopups = null;
    this.clearRewardPopupTimerMs = null;
    this.clearRewardPopupDurationMs = null;
    this.clearRewardPopupBlocksTransition = null;
    this.floorClearBonusAwardedForTransition = null;
    this.finalScoreText = null;
    this.gameOverPartyNameText = null;
    this.gameOverInstruction = null;

    // Dispose Highscore board array 
    if (this.highscoreTexts) {
        for (i = 0; i < this.highscoreTexts.length; i++) {
            if (this.highscoreTexts[i] && this.highscoreTexts[i].parent) {
                this.highscoreTexts[i].parent.removeChild(this.highscoreTexts[i], true);
            }
        }
        this.highscoreTexts = null;
    }

    this.floorText = null;
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
    this.bossMusic = null;
    this.musicFades = null;
    this.dungeonMusicDefaultVolume = null;
    this.bossMusicDefaultVolume = null;

    rune.scene.Scene.prototype.dispose.call(this);
};