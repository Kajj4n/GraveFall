//------------------------------------------------------------------------------
// Menu / command phase UI
//------------------------------------------------------------------------------

GraveFallGame.scene.Game.prototype.createCharacterMenu = function (options) {
    var menuWidth = 320;
    var menuHeight = 128;
    var topPanelHeight = 64;
    var bottomPanelHeight = 64;
    var actionPositions = [10, 95, 180, 255];
    var standScale = 2.3;
    var standWidth = 100 * standScale;
    var battleAvatarScale = 0.7;
    var standX = options.x + (menuWidth / 2) - (standWidth / 2);

    var characterMenu = new rune.display.DisplayObjectContainer(
        options.x,
        options.y,
        menuWidth,
        menuHeight
    );

    var characterMenuCharacter = new rune.display.DisplayObjectContainer(
        0,
        0,
        menuWidth,
        topPanelHeight
    );

    var characterMenuActions = new rune.display.DisplayObjectContainer(
        0,
        topPanelHeight,
        menuWidth,
        bottomPanelHeight
    );

    var uiSkin = options.uiSkin || GraveFallGame.scene.Game.UI_SKINS.dullBrown;
    var framePaletteSwaps = this.getFramePaletteSwaps(uiSkin);
    var outerFrame = this.createBoxFrame(0, 0, menuWidth, menuHeight, framePaletteSwaps);
    var separator = this.createSeparator(0, topPanelHeight - 4, menuWidth, framePaletteSwaps);

    var menuAccent = new rune.display.Graphic(0, 0, menuWidth, 4);
    var actionAccent = new rune.display.Graphic(0, 0, menuWidth, 2);
    var actionSelectionBar = new rune.display.Graphic(actionPositions[0], 57, 60, 3);

    var shouldFlip = options.flipStandX === true;
    var characterStand = this.createDamageStateGroup(standX, 400, 100, 100, this.getPlayerStandDamageStates(options.stand), { flippedX: shouldFlip });
    var battleAvatar = new rune.display.Sprite(0, 0, 100, 100, options.classIcon);

    var characterIcon = this.createDamageStateGroup(10, 5, 80, 80, this.getPortraitDamageStates(options.portrait));
    var characterClassIcon = new rune.display.Sprite(55, 30, 100, 100, options.classIcon);

    var fightIcon = new rune.display.Sprite(10, 10, 100, 100, "Fight_Icon_T");
    var defendIcon = new rune.display.Sprite(95, 10, 100, 100, "Defend_Icon_T");
    var buffIcon = new rune.display.Sprite(180, 10, 100, 100, "Buff_Icon_T");
    var itemIcon = new rune.display.Sprite(255, 10, 100, 100, "Item_Icon_T");

    var healthItemIcon = new rune.display.Sprite(actionPositions[0], 10, 100, 100, "Health_Up_Icon_T");
    var sharpItemIcon = new rune.display.Sprite(actionPositions[1], 10, 100, 100, "Attack_Up_Icon_T");
    var shieldItemIcon = new rune.display.Sprite(actionPositions[2], 10, 100, 100, "Defence_Up_Icon_T");
    var returnItemIcon = new rune.display.Sprite(actionPositions[3], 10, 100, 100, "Back_Arrow_Icon_T");

    var itemIconsArray = [healthItemIcon, sharpItemIcon, shieldItemIcon, returnItemIcon];
    for (var i = 0; i < itemIconsArray.length; i++) {
        itemIconsArray[i].scaleX = 0.6;
        itemIconsArray[i].scaleY = 0.6;
        itemIconsArray[i].visible = false;
        this.applyMonochromeIconColor(itemIconsArray[i], options.playerTheme.accentLight);
        characterMenuActions.addChild(itemIconsArray[i]);
    }

    var characterHealthBarBackground = new rune.display.Graphic(100, 38, 200, 17);
    var characterHealthBar = new rune.display.Graphic(100, 38, 200, 17);
    var characterHealthMax = new rune.text.BitmapField("/" + options.hpMax);
    var characterHealthCurrent = new rune.text.BitmapField(String(options.hpCurrent));
    var HpText = new rune.text.BitmapField("HP");

    characterHealthBar.scaleX = Math.max(0, Math.min(1, options.hpCurrent / options.hpMax));

    characterHealthMax.scaleX = 2;
    characterHealthMax.scaleY = 2;
    characterHealthMax.x = 255;
    characterHealthMax.y = 13;

    characterHealthCurrent.scaleX = 2;
    characterHealthCurrent.scaleY = 2;
    characterHealthCurrent.x = 230;
    characterHealthCurrent.y = 13;

    HpText.scaleX = 2;
    HpText.scaleY = 2;
    HpText.x = 100;
    HpText.y = 15;

    fightIcon.scaleX = 0.6;
    fightIcon.scaleY = 0.6;
    defendIcon.scaleX = 0.6;
    defendIcon.scaleY = 0.6;
    buffIcon.scaleX = 0.6;
    buffIcon.scaleY = 0.6;
    itemIcon.scaleX = 0.6;
    itemIcon.scaleY = 0.6;

    characterClassIcon.scaleX = 0.35;
    characterClassIcon.scaleY = 0.35;

    battleAvatar.scaleX = battleAvatarScale;
    battleAvatar.scaleY = battleAvatarScale;
    battleAvatar.visible = false;
    battleAvatar.alpha = 0;

    characterStand.scaleX = standScale;
    characterStand.scaleY = standScale;

    this.setDamageStateGroupFlippedX(characterStand, shouldFlip);
    battleAvatar.flippedX = shouldFlip;
    characterMenu.addChild(characterMenuCharacter);
    characterMenu.addChild(characterMenuActions);
    characterMenu.addChild(outerFrame);
    characterMenu.addChild(separator);

    characterMenuCharacter.addChild(menuAccent);
    characterMenuActions.addChild(actionAccent);
    characterMenuActions.addChild(actionSelectionBar);
    characterMenuCharacter.addChild(characterIcon);
    characterMenuCharacter.addChild(characterClassIcon);
    characterMenuCharacter.addChild(characterHealthBarBackground);
    characterMenuCharacter.addChild(characterHealthBar);
    characterMenuCharacter.addChild(characterHealthMax);
    characterMenuCharacter.addChild(characterHealthCurrent);
    characterMenuCharacter.addChild(HpText);

    characterMenuActions.addChild(fightIcon);
    characterMenuActions.addChild(defendIcon);
    characterMenuActions.addChild(buffIcon);
    characterMenuActions.addChild(itemIcon);

    this.applyPlayerTheme(options.playerTheme, {
        menuRoot: characterMenu,
        menuCharacter: characterMenuCharacter,
        menuActions: characterMenuActions,
        menuAccent: menuAccent,
        actionAccent: actionAccent,
        selectionBar: actionSelectionBar,
        portrait: characterIcon,
        classIcon: characterClassIcon,
        battleAvatar: battleAvatar,
        stand: characterStand,
        healthBarBackground: characterHealthBarBackground,
        healthBarFill: characterHealthBar,
        actions: [fightIcon, defendIcon, buffIcon, itemIcon]
    }, options);

    this.stage.addChild(characterStand);
    this.arenaAvatarLayer.addChild(battleAvatar);
    this.stage.addChild(characterMenu);

    var playerMenu = {
        container: characterMenu,
        characterContainer: characterMenuCharacter,
        actionsContainer: characterMenuActions,
        stand: characterStand,
        portrait: characterIcon,
        classIcon: characterClassIcon,
        battleAvatar: battleAvatar,
        actions: [fightIcon, defendIcon, buffIcon, itemIcon],
        itemIcons: itemIconsArray,
        actionPositions: actionPositions,
        selectionBar: actionSelectionBar,
        healthBarBackground: characterHealthBarBackground,
        healthBarFill: characterHealthBar,
        healthCurrentText: characterHealthCurrent,
        healthMaxText: characterHealthMax,
        healthCurrent: options.hpCurrent,
        healthMax: options.hpMax,
        healthTextRightX: 300,
        healthTextGap: 4,
        healthTextCharacterWidth: 6,
        healthTextY: 13,
        theme: options.playerTheme,
        selectedIndex: 0,
        selectedAction: null,
        confirmed: false,
        baseY: options.y,
        confirmedY: options.y + 58,
        controls: options.controls,
        moveControls: options.moveControls,
        characterId: options.characterId || null,
        characterName: options.characterName || "Character",
        partyRenderIndex: typeof options.partyRenderIndex === "number" ? options.partyRenderIndex : 0,
        partySize: typeof options.partySize === "number" ? options.partySize : 1,
        flipStandX: shouldFlip,
        attackMinigame: options.attackMinigame || GraveFallGame.scene.Game.DEFAULT_ATTACK_MINIGAME,
        moveSpeed: 4,
        attackDamage: options.attackDamage || 5,
        attackDamageBonus: 0,
        hitCooldown: 0,
        isDefending: false,
        isBuffed: false,
        standResource: options.stand,
        healingStandSprite: null,
        standActionState: null,
        healingStandTimer: 0,
        hideUntilNextEncounter: false,
        revivedFromEnemyDefeat: false,
        menuState: "main"
    };

    this.updatePlayerHealthUi(playerMenu);
    this.updateCharacterMenuVisuals(playerMenu);

    return playerMenu;
};

GraveFallGame.scene.Game.prototype.updatePlayerDamageState = function (playerMenu, allPlayersDead) {
    var state = this.getHealthDamageState(playerMenu.healthCurrent, playerMenu.healthMax, true, allPlayersDead);
    var downed = state === "knockedOut" || state === "dead";
    var iconColor = downed ? GraveFallGame.scene.Game.PLAYER_DOWNED_PALETTE.mid : playerMenu.theme.accent;
    var standState = state;

    if (downed !== true && playerMenu.confirmed === true && playerMenu.standActionState) {
        standState = playerMenu.standActionState;
    }

    this.setDamageStateGroupState(playerMenu.stand, standState);
    this.setDamageStateGroupState(playerMenu.portrait, state);

    this.applyMonochromeIconColor(playerMenu.classIcon, iconColor);
    this.applyMonochromeIconColor(playerMenu.battleAvatar, iconColor);

    if (playerMenu.stand) {
        playerMenu.stand.alpha = 1;

        if (this.phase !== GraveFallGame.scene.Game.PHASE_ACTION && !playerMenu.healingStandSprite) {
            playerMenu.stand.visible = true;
        }
    }

    playerMenu.classIcon.alpha = 1;
    playerMenu.container.alpha = 1;
    playerMenu.selectionBar.visible = !downed;

    for (var i = 0; i < playerMenu.actions.length; i++) {
        playerMenu.actions[i].alpha = downed ? 0.45 : 1;
    }

    for (var j = 0; j < playerMenu.itemIcons.length; j++) {
        playerMenu.itemIcons[j].alpha = downed ? 0.45 : 1;
    }
};

GraveFallGame.scene.Game.prototype.updateAllPlayerDamageStates = function () {
    var allPlayersDead = this.areAllPlayersDown();
    var i;

    for (i = 0; i < this.playerMenus.length; i++) {
        this.updateCharacterMenuInput(this.playerMenus[i]);
        this.updatePlayerDamageState(this.playerMenus[i], allPlayersDead);
    }
};

GraveFallGame.scene.Game.prototype.updateEnemyDamageState = function () {
    this.setDamageStateGroupState(
        this.enemySprite,
        this.getHealthDamageState(this.enemyHealthCurrent, this.enemyHealthMax, false, false)
    );
};

// --- PASS COLOR TO ENEMY DAMAGE ---
GraveFallGame.scene.Game.prototype.applyDamageToEnemy = function (amount, playerColor, skipDefaultSfx) {
    var wasAlive = this.enemyHealthCurrent > 0;

    if (amount > 0) {
        this.addScorePopup(amount * 10, "DAMAGE DEALT", playerColor);
    }

    this.enemyHealthCurrent = Math.max(0, this.enemyHealthCurrent - amount);
    this.updateEnemyDamageState();

    this.updateEnemyHealthBarUi();

    if (amount > 0 && wasAlive && skipDefaultSfx !== true) {
        this.playSfx(GraveFallGame.SOUNDS.PLAYER_ATTACK, 0.65);
        this.playSfx(GraveFallGame.SOUNDS.ENEMY_HIT, 0.55);
    }

    if (wasAlive && this.enemyHealthCurrent <= 0) {
        this.enemyDefeatedSoundPlayed = false;
    }
};


GraveFallGame.scene.Game.prototype.tintBitmapFieldText = function (field, targetColor) {
    var color;
    var imageData;
    var data;
    var i;

    if (!field || !field.canvas || !field.canvas.context || !targetColor) {
        return;
    }

    color = rune.color.Color24.fromHex(targetColor);

    // Render the bitmap font once, then recolor its opaque pixels. This keeps the
    // existing Rune bitmap text while letting each player own their damage color.
    field.render();
    imageData = field.canvas.context.getImageData(0, 0, field.canvas.width, field.canvas.height);
    data = imageData.data;

    for (i = 0; i < data.length; i += 4) {
        if (data[i + 3] > 0) {
            data[i] = color.r.value;
            data[i + 1] = color.g.value;
            data[i + 2] = color.b.value;
        }
    }

    field.canvas.context.putImageData(imageData, 0, 0);
    field.restoreCache();
};

GraveFallGame.scene.Game.prototype.createEnemyDamagePopup = function (amount, playerColor) {
    var text;
    var popup;
    var healthTextWidth;
    var popupWidth;
    var barRight;

    if (!this.enemySprite || !this.enemyHealthText || amount <= 0) {
        return;
    }

    if (!this.damagePopups) {
        this.damagePopups = [];
    }

    text = "-" + Math.floor(amount);
    popup = new rune.text.BitmapField(text);
    popup.autoSize = true;
    popup.scaleX = 2;
    popup.scaleY = 2;
    popup.life = 720;
    popup.startLife = popup.life;
    popup.floatSpeed = 8;

    healthTextWidth = this.enemyHealthText.text.length * 6 * (this.enemyHealthText.scaleX || 1);
    popupWidth = text.length * 6 * popup.scaleX;
    barRight = (typeof this.enemyHealthBarX === "number" ? this.enemyHealthBarX : 0) + (this.enemyHealthBarWidth || 300);

    popup.x = Math.round(this.enemyHealthText.x + healthTextWidth + 8);
    popup.y = Math.round(this.enemyHealthText.y - 1 - (this.damagePopups.length * 13));

    if (popup.x + popupWidth > barRight - 6) {
        popup.x = Math.round(this.enemyHealthText.x - popupWidth - 8);
    }

    this.tintBitmapFieldText(popup, playerColor || "#FFFFFF");
    this.stage.addChild(popup);
    this.damagePopups.push(popup);
};

GraveFallGame.scene.Game.prototype.setEnemyPreviewFlash = function (durationMs) {
    this.enemyPreviewFlashTimerMs = Math.max(this.enemyPreviewFlashTimerMs || 0, durationMs || 260);
    this.enemyPreviewFlashDurationMs = Math.max(this.enemyPreviewFlashDurationMs || 0, durationMs || 260);
};

GraveFallGame.scene.Game.prototype.startEnemyDamagePreviewShake = function (durationMs, amountX, amountY) {
    if (!this.enemySprite) {
        return;
    }

    if (typeof this.enemyPreviewBaseX !== "number") {
        this.enemyPreviewBaseX = this.enemySprite.x;
        this.enemyPreviewBaseY = this.enemySprite.y;
    }

    this.enemyPreviewShakeTimerMs = Math.max(this.enemyPreviewShakeTimerMs || 0, durationMs || 300);
    this.enemyPreviewShakeDurationMs = Math.max(this.enemyPreviewShakeDurationMs || 0, durationMs || 300);
    this.enemyPreviewShakeAmountX = amountX || 8;
    this.enemyPreviewShakeAmountY = amountY || 5;
};

GraveFallGame.scene.Game.prototype.restoreEnemyDamagePreviewShake = function () {
    if (this.enemySprite && typeof this.enemyPreviewBaseX === "number") {
        this.enemySprite.x = this.enemyPreviewBaseX;
        this.enemySprite.y = this.enemyPreviewBaseY;
    }

    this.enemyPreviewShakeTimerMs = 0;
    this.enemyPreviewShakeDurationMs = 0;
};

GraveFallGame.scene.Game.prototype.applyEnemyDefeatedRecovery = function () {
    var i;
    var menu;
    var healAmount;
    var wasDowned;
    var healedAny = false;
    var ratio = typeof this.enemyDefeatedHealRatio === "number" ? this.enemyDefeatedHealRatio : 0.08;

    if (!this.playerMenus) {
        return;
    }

    for (i = 0; i < this.playerMenus.length; i++) {
        menu = this.playerMenus[i];

        if (!menu || menu.healthMax <= 0 || menu.healthCurrent >= menu.healthMax) {
            continue;
        }

        healAmount = Math.max(1, Math.floor(menu.healthMax * ratio));
        wasDowned = menu.healthCurrent <= 0;

        if (wasDowned === true) {
            // Enemy-clear recovery revives downed players with the same percentage heal.
            // Keep them visible in the same tucked/confirmed HUD state as a player
            // who already took their turn, but do not offer actions until the next fight.
            menu.healthCurrent = Math.min(menu.healthMax, healAmount);
            menu.hideUntilNextEncounter = false;
            menu.revivedFromEnemyDefeat = true;
            menu.confirmed = true;
            menu.selectedAction = null;
            menu.actionPreviewResolved = true;
            menu.isDefending = false;
            menu.isBuffed = false;
            menu.hitCooldown = 0;
            menu.standActionState = null;
            menu.menuState = "main";
            menu.selectedIndex = 0;

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

            if (menu.battleAvatar) {
                menu.battleAvatar.visible = false;
                menu.battleAvatar.alpha = 0;
            }

            if (menu.stand && !menu.healingStandSprite) {
                menu.stand.visible = true;
                menu.stand.alpha = 1;
            }
        } else {
            menu.hideUntilNextEncounter = false;
            menu.revivedFromEnemyDefeat = false;
            menu.healthCurrent = Math.min(menu.healthMax, menu.healthCurrent + healAmount);
        }

        this.updatePlayerHealthUi(menu);
        this.updatePlayerDamageState(menu, this.areAllPlayersDown());
        this.updateCharacterMenuVisuals(menu);
        healedAny = true;
    }

    if (healedAny === true) {
        this.playSfx(GraveFallGame.SOUNDS.ITEM_PICKUP, 0.42);
    }
};

GraveFallGame.scene.Game.prototype.getActionPreviewStandState = function (selectedAction) {
    if (selectedAction === 0 || selectedAction === 2 || selectedAction === 11) {
        return "itemAttack";
    }

    if (selectedAction === 1 || selectedAction === 12) {
        return "itemDefend";
    }

    return null;
};

GraveFallGame.scene.Game.prototype.getActionPreviewDuration = function (selectedAction) {
    if (selectedAction === 1 || selectedAction === 12) {
        return 1000;
    }

    if (selectedAction === 0) {
        return 760;
    }

    return 900;
};

GraveFallGame.scene.Game.prototype.startPlayerActionPreviewShake = function (playerMenu, selectedAction) {
    if (!playerMenu || !playerMenu.stand) {
        return;
    }

    if (typeof playerMenu.previewStandBaseX !== "number") {
        playerMenu.previewStandBaseX = playerMenu.stand.x;
        playerMenu.previewStandBaseY = playerMenu.stand.y;
    }

    playerMenu.previewShakeTimerMs = selectedAction === 1 || selectedAction === 12 ? 420 : 300;
    playerMenu.previewShakeDurationMs = playerMenu.previewShakeTimerMs;
    playerMenu.previewShakeAmountX = selectedAction === 1 || selectedAction === 12 ? 3 : 8;
    playerMenu.previewShakeAmountY = selectedAction === 1 || selectedAction === 12 ? 2 : 5;
};

GraveFallGame.scene.Game.prototype.restorePlayerActionPreviewShake = function (playerMenu) {
    if (!playerMenu || !playerMenu.stand) {
        return;
    }

    if (typeof playerMenu.previewStandBaseX === "number") {
        playerMenu.stand.x = playerMenu.previewStandBaseX;
        playerMenu.stand.y = playerMenu.previewStandBaseY;
    }

    playerMenu.previewShakeTimerMs = 0;
    playerMenu.previewShakeDurationMs = 0;
};

GraveFallGame.scene.Game.prototype.getPlayerAttackPreviewSfx = function (playerMenu) {
    var id = playerMenu && playerMenu.characterId ? playerMenu.characterId : "";
    var minigame = playerMenu && playerMenu.attackMinigame ? playerMenu.attackMinigame : "";

    if (id === "wizard" || minigame === "buttonSequence") {
        return GraveFallGame.SOUNDS.ATTACK_ORB;
    }

    if (id === "ranger" || minigame === "targetReticle") {
        return GraveFallGame.SOUNDS.ATTACK_DART;
    }

    return GraveFallGame.SOUNDS.PLAYER_ATTACK;
};

GraveFallGame.scene.Game.prototype.playActionPreviewSfx = function (playerMenu, selectedAction, didDamage) {
    var id;
    var attackSfx;

    if (selectedAction === 0) {
        id = playerMenu && playerMenu.characterId ? playerMenu.characterId : "";
        attackSfx = this.getPlayerAttackPreviewSfx(playerMenu);
        this.playSfx(attackSfx, id === "ranger" ? 0.6 : 0.68);

        if (id === "assassin" || (playerMenu && playerMenu.attackMinigame === "timingBar")) {
            this.queueSfx(120, attackSfx, 0.58);
        }

        if (didDamage === true) {
            this.queueSfx(id === "assassin" ? 170 : 70, GraveFallGame.SOUNDS.ENEMY_HIT, 0.54);
        }

        return;
    }

    if (selectedAction === 1 || selectedAction === 12) {
        this.playSfx(GraveFallGame.SOUNDS.UI_CONFIRM, 0.45);
        return;
    }

    if (selectedAction === 2 || selectedAction === 11 || selectedAction === 10) {
        this.playSfx(GraveFallGame.SOUNDS.ITEM_PICKUP, 0.62);
        return;
    }

    this.playSfx(GraveFallGame.SOUNDS.UI_CONFIRM, 0.45);
};

GraveFallGame.scene.Game.prototype.calculatePlayerAttackDamage = function (playerMenu) {
    var baseDmg = playerMenu.attackDamage || 5;
    var bonusDmg = (playerMenu.attackDamageBonus || 0) * 1;
    var totalDmg = baseDmg + bonusDmg;

    if (playerMenu.isBuffed) {
        totalDmg *= 2;
        playerMenu.isBuffed = false;
    }

    playerMenu.attackDamageBonus = 0;
    return totalDmg;
};

GraveFallGame.scene.Game.prototype.applyCommandActionForPlayer = function (playerMenu) {
    var j;
    var target;
    var healAmount;
    var totalDmg;
    var didDamage = false;

    if (!playerMenu || playerMenu.healthCurrent <= 0 || playerMenu.actionPreviewResolved === true) {
        return false;
    }

    playerMenu.actionPreviewResolved = true;

    if (playerMenu.selectedAction === 0) {
        totalDmg = this.calculatePlayerAttackDamage(playerMenu);
        didDamage = totalDmg > 0 && this.enemyHealthCurrent > 0;

        if (didDamage) {
            this.applyDamageToEnemy(totalDmg, playerMenu.theme.accent, true);
            this.createEnemyDamagePopup(totalDmg, playerMenu.theme.accent);
            this.setEnemyPreviewFlash(300);
            this.startEnemyDamagePreviewShake(300, 8, 5);
            this.shakeCamera(160, 4, 3, true);
        }
    } else if (playerMenu.selectedAction === 1) {
        playerMenu.isDefending = true;
    } else if (playerMenu.selectedAction === 2) {
        playerMenu.isBuffed = true;
    } else if (playerMenu.selectedAction === 10) {
        if (typeof this.startHealingStandAnimation === "function") {
            this.startHealingStandAnimation(playerMenu);
        }

        for (j = 0; j < this.playerMenus.length; j++) {
            target = this.playerMenus[j];
            healAmount = Math.max(1, Math.floor(target.healthMax * 0.10));

            if (target.healthCurrent <= 0) {
                target.healthCurrent = healAmount;
                target.confirmed = false;
                target.selectedAction = null;
                target.isDefending = false;
                target.isBuffed = false;
                target.hitCooldown = 0;
            } else {
                target.healthCurrent = Math.min(target.healthMax, target.healthCurrent + healAmount);
            }

            this.updatePlayerHealthUi(target);
            this.updatePlayerDamageState(target, this.areAllPlayersDown());
        }
    } else if (playerMenu.selectedAction === 11) {
        for (j = 0; j < this.playerMenus.length; j++) {
            if (this.playerMenus[j].healthCurrent > 0) {
                this.playerMenus[j].isBuffed = true;
            }
        }
    } else if (playerMenu.selectedAction === 12) {
        for (j = 0; j < this.playerMenus.length; j++) {
            if (this.playerMenus[j].healthCurrent > 0) {
                this.playerMenus[j].isDefending = true;
            }
        }
    }

    this.playActionPreviewSfx(playerMenu, playerMenu.selectedAction, didDamage);
    return didDamage;
};

GraveFallGame.scene.Game.prototype.resolveCommandPhaseActions = function () {
    var i, j, playerMenu, target;
    var baseDmg, bonusDmg, totalDmg;

    if (this.enemyHealthCurrent <= 0) {
        return;
    }

    for (i = 0; i < this.playerMenus.length; i++) {
        playerMenu = this.playerMenus[i];

        if (playerMenu.healthCurrent <= 0) continue;

        playerMenu.isDefending = false;

        // FIGHT
        if (playerMenu.selectedAction === 0) {
            baseDmg = playerMenu.attackDamage || 5;
            bonusDmg = (playerMenu.attackDamageBonus || 0) * 1; 
            totalDmg = baseDmg + bonusDmg;

            if (playerMenu.isBuffed) {
                totalDmg *= 2; 
                playerMenu.isBuffed = false;
            }
            
            // Pass the player's specific color over to attribute the score
            this.applyDamageToEnemy(totalDmg, playerMenu.theme.accent);
            playerMenu.attackDamageBonus = 0; 
        }
        
        // DEFEND
        else if (playerMenu.selectedAction === 1) {
            playerMenu.isDefending = true;
            this.playSfx(GraveFallGame.SOUNDS.UI_CONFIRM, 0.4);
        }
        
        // BUFF
        else if (playerMenu.selectedAction === 2) {
            playerMenu.isBuffed = true;
            this.playSfx(GraveFallGame.SOUNDS.UI_MOVE, 0.6);
        }
        
        // --- ITEM: HEALTH POTION ---
        else if (playerMenu.selectedAction === 10) {
            for (j = 0; j < this.playerMenus.length; j++) {
                target = this.playerMenus[j];

                var healAmount = Math.max(1, Math.floor(target.healthMax * 0.10));

                if (target.healthCurrent <= 0) {
                    target.healthCurrent = healAmount;
                    target.confirmed = false;
                    target.selectedAction = null;
                    target.isDefending = false;
                    target.isBuffed = false;
                    target.hitCooldown = 0;
                } else {
                    target.healthCurrent = Math.min(target.healthMax, target.healthCurrent + healAmount);
                }

                this.updatePlayerHealthUi(target);
                this.updatePlayerDamageState(target, this.areAllPlayersDown());
            }

            this.playSfx(GraveFallGame.SOUNDS.ITEM_PICKUP, 0.7);
        }

        // --- ITEM: SHARPENING TOOL ---
        else if (playerMenu.selectedAction === 11) {
            for (j = 0; j < this.playerMenus.length; j++) {
                if (this.playerMenus[j].healthCurrent > 0) {
                    this.playerMenus[j].isBuffed = true;
                }
            }
            this.playSfx(GraveFallGame.SOUNDS.ITEM_PICKUP, 0.7);
        }

        // --- ITEM: SHIELD BARRIER ---
        else if (playerMenu.selectedAction === 12) {
            for (j = 0; j < this.playerMenus.length; j++) {
                if (this.playerMenus[j].healthCurrent > 0) {
                    this.playerMenus[j].isDefending = true;
                }
            }
            this.playSfx(GraveFallGame.SOUNDS.ITEM_PICKUP, 0.7);
        }
    }
};

GraveFallGame.scene.Game.prototype.updateCharacterMenuVisuals = function (playerMenu) {
    var i;
    var activeIcons = playerMenu.menuState === "main" ? playerMenu.actions : playerMenu.itemIcons;
    var inactiveIcons = playerMenu.menuState === "main" ? playerMenu.itemIcons : playerMenu.actions;

    for (i = 0; i < inactiveIcons.length; i++) {
        inactiveIcons[i].visible = false;
    }

    for (i = 0; i < activeIcons.length; i++) {
        activeIcons[i].visible = true;
        if (i === playerMenu.selectedIndex) {
            activeIcons[i].scaleX = 0.6;
            activeIcons[i].scaleY = 0.6;
        } else {
            activeIcons[i].scaleX = 0.6;
            activeIcons[i].scaleY = 0.6;
        }
    }

    playerMenu.selectionBar.x = playerMenu.actionPositions[playerMenu.selectedIndex];
    playerMenu.selectionBar.visible = playerMenu.healthCurrent > 0;
};

GraveFallGame.scene.Game.prototype.resetCharacterMenuState = function (playerMenu) {
    if (!playerMenu) {
        return;
    }

    if (playerMenu.healingStandSprite) {
        this.clearHealingStandAnimation(playerMenu);
    }

    playerMenu.menuState = "main";
    playerMenu.selectedIndex = 0;
    playerMenu.selectedAction = null;
    playerMenu.standActionState = null; 
    playerMenu.hideUntilNextEncounter = false;
    playerMenu.revivedFromEnemyDefeat = false;
    playerMenu.confirmed = false;
    playerMenu.container.y = playerMenu.baseY;

    if (playerMenu.stand && !playerMenu.healingStandSprite) {
        playerMenu.stand.visible = true;
        playerMenu.stand.alpha = 1;
    }

    this.updateCharacterMenuVisuals(playerMenu);
};

GraveFallGame.scene.Game.prototype.updateCharacterMenuInput = function (playerMenu) {
    if (playerMenu.healthCurrent <= 0) {
        playerMenu.confirmed = true;
        playerMenu.selectedAction = null;
        playerMenu.container.y = playerMenu.confirmedY;
        this.updateCharacterMenuVisuals(playerMenu);
        return;
    }

    if (playerMenu.confirmed) {
        playerMenu.container.y = playerMenu.confirmedY;
        this.updateCharacterMenuVisuals(playerMenu);
        return;
    }

    if (this.keyboard.justPressed(playerMenu.controls.left)) {
        playerMenu.selectedIndex--;

        if (playerMenu.selectedIndex < 0) {
            playerMenu.selectedIndex = playerMenu.actions.length - 1; 
        }

        this.playSfx(GraveFallGame.SOUNDS.UI_MOVE, 0.4);
    }

    if (this.keyboard.justPressed(playerMenu.controls.right)) {
        playerMenu.selectedIndex++;

        if (playerMenu.selectedIndex >= playerMenu.actions.length) {
            playerMenu.selectedIndex = 0;
        }

        this.playSfx(GraveFallGame.SOUNDS.UI_MOVE, 0.4);
    }

    if (this.keyboard.justPressed(playerMenu.controls.confirm)) {
        if (playerMenu.menuState === "main" && playerMenu.selectedIndex === 3) {
            playerMenu.menuState = "items";
            playerMenu.selectedIndex = 0;
            this.playSfx(GraveFallGame.SOUNDS.UI_CONFIRM, 0.55);
        } else if (playerMenu.menuState === "items" && playerMenu.selectedIndex === 3) {
            playerMenu.menuState = "main";
            playerMenu.selectedIndex = 3;
            this.playSfx(GraveFallGame.SOUNDS.UI_BACK, 0.55);
        } else {
            playerMenu.selectedAction = playerMenu.menuState === "main" ? playerMenu.selectedIndex : 10 + playerMenu.selectedIndex;
            playerMenu.confirmed = true;
            playerMenu.container.y = playerMenu.confirmedY;

            if (playerMenu.selectedAction === 0 || playerMenu.selectedAction === 11) {
                playerMenu.standActionState = "itemAttack"; 
            } else if (playerMenu.selectedAction === 1 || playerMenu.selectedAction === 12) {
                playerMenu.standActionState = "itemDefend"; 
            } else {
                playerMenu.standActionState = null;
            }

            this.updatePlayerDamageState(playerMenu, this.areAllPlayersDown());

            this.playSfx(GraveFallGame.SOUNDS.UI_CONFIRM, 0.55);
        }
    }
    this.updateCharacterMenuVisuals(playerMenu);
};