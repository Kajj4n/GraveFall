//------------------------------------------------------------------------------
// Scene lifecycle
//------------------------------------------------------------------------------

GraveFallGame.scene.Game.prototype.init = function () {
    rune.scene.Scene.prototype.init.call(this);

    this.phase = GraveFallGame.scene.Game.PHASE_COMMAND;
    this.encounterIndex = 0;
    this.currentEnemyType = this.getEnemyTypeForEncounter(this.encounterIndex);
    this.actionPhaseTimer = 0;
    this.nextPatternIn = 0;
    this.minigameTimer = 0;
    this.projectiles = [];
    this.playerMenus = [];

    this.arenaItem = null;
    this.itemSpawnTimer = 0;
    this.gameOverText = null;
    this.gameOverTimer = 0;
    this.lastTurnWarningSecond = null;
    this.enemyDefeatedSoundPlayed = false;
    this.dungeonMusic = null;
    
    // Fade-in timer for every new enemy and its healthbar.
    this.enemyFadeTimerMs = 0;
    this.enemyFadeDurationMs = 1500;
    this.enemyDefeatedTimerMs = 0;

    this.startDungeonMusic();

    // turn timer (10 seconds ≈ 600 frames)
    this.turnTimer = 600;
    this.turnTimerMs = 10000;

    this.turnTimerText = new rune.text.BitmapField("10");
    this.turnTimerText.scaleX = 2;
    this.turnTimerText.scaleY = 2;
    this.turnTimerText.x = this.application.screen.width - 28;
    this.turnTimerText.y = 8;

    this.backgroundBackdrop = new rune.display.Sprite(
        0,
        0,
        this.application.screen.width,
        this.application.screen.height,
        "Background_Test"
    );
    this.applyPaletteSwaps(
        this.backgroundBackdrop,
        this.getFramePaletteSwaps(GraveFallGame.scene.Game.UI_SKINS.dullBrown)
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

    // --- ENEMY HEALTH BAR UI ---
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

    this.enemyHealthFrame = this.createBoxFrame(eBarX, eBarY, eBarWidth, eBarHeight, this.getFramePaletteSwaps(GraveFallGame.scene.Game.UI_SKINS.dullBrown));
    this.stage.addChild(this.enemyHealthFrame);

    this.enemyHealthText = new rune.text.BitmapField(this.enemyHealthCurrent + "/" + this.enemyHealthMax);
    this.enemyHealthText.scaleX = 2;
    this.enemyHealthText.scaleY = 2;
    this.enemyHealthText.x = eBarX + (eBarWidth / 2) - ((this.enemyHealthText.text.length * 6 * 2) / 2);
    this.enemyHealthText.y = eBarY + 8;
    this.stage.addChild(this.enemyHealthText);

    // Initial opacity set to 0 to prepare for the fade-in
    this.enemySprite.alpha = 0;
    this.enemyHealthBg.alpha = 0;
    this.enemyHealthFill.alpha = 0;
    this.enemyHealthFrame.alpha = 0;
    this.enemyHealthText.alpha = 0;
    // --------------------------------

    this.createBattleArena();
    this.stage.addChild(this.turnTimerText);

    this.playerMenus.push(this.createCharacterMenu({
        x: 0,
        y: 592,
        portrait: "Fighter_Portrait",
        classIcon: "Fighter_Icon_T",
        stand: "Fighter_Idle_Stance",
        hpCurrent: 100,
        hpMax: 160,
        playerTheme: this.getPlayerTheme(0),
        controls: {
            left: "a",
            right: "d",
            confirm: "space"
        },
        moveControls: {
            left: "a",
            right: "d",
            up: "w",
            down: "s"
        }
    }));

    this.playerMenus.push(this.createCharacterMenu({
        x: 320,
        y: 592,
        portrait: "Assassin_Portrait",
        classIcon: "Assassin_Icon_T",
        stand: "Assassin_Idle_Stance",
        hpCurrent: 95,
        hpMax: 120,
        playerTheme: this.getPlayerTheme(1),
        controls: {
            left: "left",
            right: "right",
            confirm: "enter"
        },
        moveControls: {
            left: "left",
            right: "right",
            up: "up",
            down: "down"
        }
    }));

    this.playerMenus.push(this.createCharacterMenu({
        x: 640,
        y: 592,
        portrait: "Wizard_Portrait",
        classIcon: "Wizard_Icon_T",
        stand: "Wizard_Idle_Stance",
        hpCurrent: 34,
        hpMax: 100,
        playerTheme: this.getPlayerTheme(2),
        flipStandX: true,
        controls: {
            left: "j",
            right: "l",
            confirm: "k"
        },
        moveControls: {
            left: "j",
            right: "l",
            up: "i",
            down: "k"
        }
    }));

    this.playerMenus.push(this.createCharacterMenu({
        x: 960,
        y: 592,
        portrait: "Ranger_Portrait",
        classIcon: "Ranger_Icon_T",
        stand: "Ranger_Idle_Stance",
        hpCurrent: 34,
        hpMax: 112,
        playerTheme: this.getPlayerTheme(3),
        flipStandX: true,
        controls: {
            left: "v",
            right: "n",
            confirm: "b"
        },
        moveControls: {
            left: "f",
            right: "h",
            up: "t",
            down: "g"
        }
    }));

    this.updateAllPlayerDamageStates();
    this.updateEnemyDamageState();
};

GraveFallGame.scene.Game.prototype.update = function (step) {
    var i;
    var secondsLeft;
    var autoSelected;
    var requiresMinigame;

    rune.scene.Scene.prototype.update.call(this, step);

    // Enemy and health bar fade-in logic.
    if (this.enemyFadeTimerMs < this.enemyFadeDurationMs) {
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

            if (requiresMinigame && typeof this.startMinigamePhase === "function") {
                this.startMinigamePhase();
            } else {
                this.startActionPhase();
            }

            return;
        }
    } else if (this.phase === GraveFallGame.scene.Game.PHASE_MINIGAME) {
        this.updateMinigamePhase(step);
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

GraveFallGame.scene.Game.prototype.dispose = function () {
    this.stopDungeonMusic();
    this.clearProjectiles();
    this.clearArenaItem();

    this.projectiles = null;
    this.playerMenus = null;
    this.backgroundBackdrop = null;
    this.bossPlaceholder = null;
    this.enemySprite = null;
    this.enemyHealthCurrent = null;
    this.enemyHealthMax = null;
    
    // Cleanup new UI
    this.enemyHealthBg = null;
    this.enemyHealthFill = null;
    this.enemyHealthFrame = null;
    this.enemyHealthText = null;
    this.enemyHealthBarWidth = null;
    this.enemyHealthBarX = null;
    this.enemyFadeTimerMs = null;
    this.enemyFadeDurationMs = null;
    this.enemyDefeatedTimerMs = null;
    this.encounterIndex = null;

    this.arenaBackground = null;
    this.arenaProjectileLayer = null;
    this.arenaAvatarLayer = null;
    this.arenaFrame = null;
    this.arena = null;
    this.turnTimerText = null;
    this.turnTimerMs = null;
    this.arenaItem = null;
    this.itemSpawnTimer = null;
    this.gameOverText = null;
    this.gameOverTimer = null;
    this.dungeonMusic = null;

    rune.scene.Scene.prototype.dispose.call(this);
};