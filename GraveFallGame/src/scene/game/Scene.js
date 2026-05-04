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

    // Resets the player menus once when a fresh command phase starts.
    this.commandMenuResetDone = false;
    
    // Fade-in timer for every new enemy and its healthbar.
    this.enemyFadeTimerMs = 0;
    this.enemyFadeDurationMs = 1500;
    this.enemyDefeatedTimerMs = 0;

    // Passage transition that plays between enemy encounters.
    // This deliberately avoids CameraViewport.zoom because that resizes Rune's
    // camera canvas and can make character sprites look fuzzy after the zoom.
    // Instead, only the background art is pushed toward the entryway while the
    // camera itself stays at 1:1 so party/enemy sprites keep their normal pixel quality.
    this.passageTransitionTimerMs = 0;
    this.passageTransitionDurationMs = 8400;
    this.passageTransitionCorpseVanishMs = 1100;
    this.passageTransitionWalkStartMs = 1650;
    this.passageTransitionBlackStartMs = 3500;
    this.passageTransitionLoadEncounterMs = 3900;
    this.passageTransitionFadeInStartMs = 4600;
    this.passageTransitionFadeInEndMs = 6200;
    this.passageTransitionEnemyFadeStartMs = 6500;
    this.passageTransitionActionsAppearMs = 8200;
    this.passageTransitionEncounterLoaded = false;
    this.passageTransitionCorpseHidden = false;
    this.passageTransitionStepsPlayed = false;
    this.passageTransitionPartyRevealed = false;
    this.passageTransitionActionsShown = false;
    this.passageTransitionBackdropMaxScale = 1.95;
    this.passageTransitionFocusX = this.application.screen.width / 2;
    this.passageTransitionFocusY = this.application.screen.height * 0.48;

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

    this.updateHealingStandAnimations(step);

    // If we are no longer in the command phase, allow the next command phase
    // to trigger a fresh menu reset.
    if (this.phase !== GraveFallGame.scene.Game.PHASE_COMMAND) {
        this.commandMenuResetDone = false;
    }

    // Enemy and health bar fade-in logic.
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
        if (!this.commandMenuResetDone && this.turnTimerMs === 10000) {
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
                        this.playerMenus[i].standActionState = "itemAttack"; // Automatically apply attack stance visual
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
        menu.standActionState = null; // Clean up action state
        menu.confirmed = false;
        menu.container.y = menu.baseY;

        if (menu.stand && menu.healthCurrent > 0) {
            menu.stand.visible = true;
            menu.stand.alpha = 1;
        }

        this.updateCharacterMenuVisuals(menu);
    }
};

GraveFallGame.scene.Game.prototype.startHealingStandAnimation = function (playerMenu) {
    var standResource;
    var sprite;
    var theme;

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

    sprite = new rune.display.Sprite(
        playerMenu.stand.x,
        playerMenu.stand.y,
        playerMenu.stand.width,
        playerMenu.stand.height,
        standResource
    );

    sprite.scaleX = playerMenu.stand.scaleX;
    sprite.scaleY = playerMenu.stand.scaleY;
    sprite.alpha = 1;

    if (playerMenu.stand.flippedX === true) {
        sprite.flippedX = true;
    }

    this.stage.addChild(sprite);

    // Apply the same character palette first.
    this.applyPaletteSwaps(sprite, this.getClothingPaletteSwaps(theme));

    // Then recolor any monochrome section that the potion sprite uses.
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

        if (this.phase !== GraveFallGame.scene.Game.PHASE_ACTION && menu.stand && menu.healthCurrent > 0) {
            menu.stand.visible = true;
            menu.stand.alpha = 1;
        }
    }
};

GraveFallGame.scene.Game.prototype.clearHealingStandAnimation = function (playerMenu) {
    if (!playerMenu || !playerMenu.healingStandSprite) {
        return;
    }

    if (playerMenu.healingStandSprite.parent) {
        playerMenu.healingStandSprite.parent.removeChild(playerMenu.healingStandSprite, true);
    }

    playerMenu.healingStandSprite = null;
    playerMenu.healingStandTimer = 0;
};

GraveFallGame.scene.Game.prototype.dispose = function () {
    var i;

    this.stopDungeonMusic();
    this.clearProjectiles();
    this.clearArenaItem();

    if (this.playerMenus) {
        for (i = 0; i < this.playerMenus.length; i++) {
            this.clearHealingStandAnimation(this.playerMenus[i]);
        }
    }

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
    this.commandMenuResetDone = null;
    this.passageTransitionTimerMs = null;
    this.passageTransitionDurationMs = null;
    this.passageTransitionCorpseVanishMs = null;
    this.passageTransitionWalkStartMs = null;
    this.passageTransitionBlackStartMs = null;
    this.passageTransitionLoadEncounterMs = null;
    this.passageTransitionFadeInStartMs = null;
    this.passageTransitionFadeInEndMs = null;
    this.passageTransitionEnemyFadeStartMs = null;
    this.passageTransitionActionsAppearMs = null;
    this.passageTransitionEncounterLoaded = null;
    this.passageTransitionCorpseHidden = null;
    this.passageTransitionStepsPlayed = null;
    this.passageTransitionPartyRevealed = null;
    this.passageTransitionActionsShown = null;
    this.passageTransitionBackdropMaxScale = null;
    this.passageTransitionFocusX = null;
    this.passageTransitionFocusY = null;

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