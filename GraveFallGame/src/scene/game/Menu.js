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

    var itemActionPositions = [6, 70, 134, 198, 262];
    var healthItemIcon = new rune.display.Sprite(itemActionPositions[0], 10, 100, 100, "Health_Up_Buff_Icon_T");
    var sharpItemIcon = new rune.display.Sprite(itemActionPositions[1], 10, 100, 100, "Attack_Up_Buff_Icon_T");
    var shieldItemIcon = new rune.display.Sprite(itemActionPositions[2], 10, 100, 100, "Defence_Up_Buff_Icon_T");
    var speedItemIcon = new rune.display.Sprite(itemActionPositions[3], 10, 100, 100, "Speed_Up_Buff_Icon_T");
    var returnItemIcon = new rune.display.Sprite(itemActionPositions[4], 10, 100, 100, "Back_Arrow_Icon_T");

    var itemIconsArray = [healthItemIcon, sharpItemIcon, shieldItemIcon, speedItemIcon, returnItemIcon];
    for (var i = 0; i < itemIconsArray.length; i++) {
        itemIconsArray[i].scaleX = 0.52;
        itemIconsArray[i].scaleY = 0.52;
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
        itemActionPositions: itemActionPositions,
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
        baseMoveSpeed: 4,
        moveSpeed: 4,
        attackDamage: options.attackDamage || 5,
        attackDamageBonus: 0,
        permanentAttackBonus: 0,
        permanentDefenseBonus: 0,
        permanentSpeedBonus: 0,
        itemInventory: {
            maxHp: 0,
            attack: 0,
            defense: 0,
            speed: 0
        },
        temporaryDefenseBuff: false,
        temporarySpeedBuff: false,
        temporaryAttackBuff: false,
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

    this.updateCharacterMenuVisuals(playerMenu);
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
        this.addScorePopup(amount * 10, "DAMAGE DEALT");
    }

    this.enemyHealthCurrent = Math.max(0, this.enemyHealthCurrent - amount);
    this.updateEnemyDamageState();

    if (amount > 0 && wasAlive) {
        this.spawnEnemyDamageParticles(amount);
    }

    this.updateEnemyHealthBarUi();

    if (amount > 0 && wasAlive && skipDefaultSfx !== true) {
        this.playSfx(GraveFallGame.SOUNDS.PLAYER_ATTACK, 0.65);
        this.playSfx(GraveFallGame.SOUNDS.ENEMY_HIT, 0.55);
    }

    if (wasAlive && this.enemyHealthCurrent <= 0) {
        this.enemyDefeatedSoundPlayed = false;
    }
};


GraveFallGame.scene.Game.prototype.tintBitmapFieldText = function (field, targetColor, stripBackdrop) {
    var color;
    var imageData;
    var data;
    var i;
    var isBackdropPixel;

    if (!field || !field.canvas || !field.canvas.context || !targetColor) {
        return;
    }

    color = rune.color.Color24.fromHex(targetColor);

    // Rune's default BitmapField font bakes the black number backdrop into the
    // font texture. For enemy hit numbers we remove those dark pixels before
    // tinting, but score popups are left untouched so they keep Rune's default.
    field.render();
    imageData = field.canvas.context.getImageData(0, 0, field.canvas.width, field.canvas.height);
    data = imageData.data;

    for (i = 0; i < data.length; i += 4) {
        if (data[i + 3] > 0) {
            isBackdropPixel = stripBackdrop === true && data[i] < 24 && data[i + 1] < 24 && data[i + 2] < 24;

            if (isBackdropPixel) {
                data[i + 3] = 0;
            } else {
                data[i] = color.r.value;
                data[i + 1] = color.g.value;
                data[i + 2] = color.b.value;
            }
        }
    }

    field.canvas.context.putImageData(imageData, 0, 0);
    field.restoreCache();
};

GraveFallGame.scene.Game.prototype.createEnemyDamagePopup = function (amount, playerColor) {
    var text;
    var popup;
    var popupWidth;
    var popupColor;
    var popupAmount;
    var enemyLeft;
    var enemyRight;
    var enemyMidY;
    var popupHeight;
    var minX;
    var maxX;
    var minY;
    var maxY;
    var sidePadding;
    var i;

    if (!this.enemySprite || amount <= 0) {
        return;
    }

    if (!this.damagePopups) {
        this.damagePopups = [];
    }

    popupAmount = Math.floor(amount);
    popupColor = playerColor || "#FFFFFF";

    for (i = this.damagePopups.length - 1; i >= 0; i--) {
        if (this.damagePopups[i].damageAmount === popupAmount && this.damagePopups[i].playerColor === popupColor && this.damagePopups[i].life > 660) {
            return;
        }
    }

    text = "-" + popupAmount;
    popup = new rune.text.BitmapField(text);
    popup.autoSize = true;
    popup.scaleX = 3;
    popup.scaleY = 3;
    popup.life = 900;
    popup.startLife = popup.life;
    popup.floatSpeed = 18;
    popup.damageAmount = popupAmount;
    popup.playerColor = popupColor;

    this.tintBitmapFieldText(popup, popupColor, true);

    enemyLeft = this.getStageAnchorForNode(this.enemySprite, 0, 0.5).x;
    enemyRight = this.getStageAnchorForNode(this.enemySprite, 1, 0.5).x;
    enemyMidY = this.getStageAnchorForNode(this.enemySprite, 0.5, 0.44).y;
    popupWidth = text.length * 6 * (popup.scaleX || 1);
    popupHeight = 8 * (popup.scaleY || 1);
    sidePadding = 6;
    minX = 16;
    maxX = this.application.screen.width - popupWidth - 16;
    minY = 48;
    maxY = this.application.screen.height - popupHeight - 48;

    // Keep the damage number visually attached to the enemy instead of drifting
    // to the screen edge. Since the enemy usually stands on the right side, put
    // the popup just to its left; if an enemy appears on the left, use its right.
    if (enemyRight + sidePadding + popupWidth <= maxX) {
        popup.x = Math.round(enemyRight + sidePadding);
    } else {
        popup.x = Math.round(enemyLeft - popupWidth - sidePadding);
    }

    popup.y = Math.round(enemyMidY - (popupHeight / 2) - (this.damagePopups.length * 30));
    popup.x = Math.max(minX, Math.min(maxX, popup.x));
    popup.y = Math.max(minY, Math.min(maxY, popup.y));

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
            menu.temporaryDefenseBuff = false;
            menu.temporarySpeedBuff = false;
            menu.temporaryAttackBuff = false;
            menu.moveSpeed = this.calculateEffectiveMoveSpeed(menu);
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

GraveFallGame.scene.Game.prototype.getClassBuffType = function (playerMenu) {
    var id = playerMenu && playerMenu.characterId ? String(playerMenu.characterId).toLowerCase() : "";
    var minigame = playerMenu && playerMenu.attackMinigame ? playerMenu.attackMinigame : "";

    if (id === "fighter" || id.indexOf("fighter_") === 0 || minigame === "buttonMash") {
        return "defense";
    }

    if (id === "assassin" || id.indexOf("assassin_") === 0 || id === "rogue" || id.indexOf("rogue_") === 0 || minigame === "timingBar") {
        return "speed";
    }

    if (id === "wizard" || id.indexOf("wizard_") === 0 || minigame === "buttonSequence") {
        return "maxHp";
    }

    if (id === "ranger" || id.indexOf("ranger_") === 0 || minigame === "targetReticle") {
        return "attack";
    }

    return null;
};

GraveFallGame.scene.Game.prototype.getItemBuffTypeForAction = function (selectedAction) {
    if (selectedAction >= 10 && selectedAction <= 13) {
        return this.getItemBuffTypeForIndex(selectedAction - 10);
    }

    return null;
};

GraveFallGame.scene.Game.prototype.getActionPreviewStandState = function (selectedAction, playerMenu) {
    var itemBuffType;
    var classBuffType;

    if (selectedAction === 2) {
        return "buff";
    }

    if (selectedAction === 0) {
        return "itemAttack";
    }

    if (selectedAction === 1) {
        return "itemDefend";
    }

    itemBuffType = this.getItemBuffTypeForAction(selectedAction);

    if (itemBuffType) {
        classBuffType = this.getClassBuffType(playerMenu);

        if (classBuffType === itemBuffType) {
            return "buff";
        }

        if (itemBuffType === "attack") {
            return "itemAttack";
        }

        if (itemBuffType === "speed") {
            return "itemSpeedPotion";
        }

        if (itemBuffType === "maxHp") {
            return "itemPotion";
        }

        if (itemBuffType === "defense") {
            return "itemDefend";
        }
    }

    return null;
};

GraveFallGame.scene.Game.prototype.getActionPreviewDuration = function (selectedAction) {
    if (selectedAction === 1 || selectedAction === 2 || selectedAction === 10 || selectedAction === 12 || selectedAction === 13) {
        return 1100;
    }

    if (selectedAction === 0) {
        return 760;
    }

    return 950;
};

GraveFallGame.scene.Game.prototype.startPlayerActionPreviewShake = function (playerMenu, selectedAction) {
    if (!playerMenu || !playerMenu.stand) {
        return;
    }

    if (typeof playerMenu.previewStandBaseX !== "number") {
        playerMenu.previewStandBaseX = playerMenu.stand.x;
        playerMenu.previewStandBaseY = playerMenu.stand.y;
    }

    playerMenu.previewShakeTimerMs = selectedAction === 1 || selectedAction === 2 || selectedAction === 10 || selectedAction === 12 || selectedAction === 13 ? 420 : 300;
    playerMenu.previewShakeDurationMs = playerMenu.previewShakeTimerMs;
    playerMenu.previewShakeAmountX = selectedAction === 1 || selectedAction === 2 || selectedAction === 10 || selectedAction === 12 || selectedAction === 13 ? 3 : 8;
    playerMenu.previewShakeAmountY = selectedAction === 1 || selectedAction === 2 || selectedAction === 10 || selectedAction === 12 || selectedAction === 13 ? 2 : 5;
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

    if (selectedAction === 1) {
        this.playSfx(GraveFallGame.SOUNDS.UI_CONFIRM, 0.45);
        return;
    }

    if (selectedAction === 2 || selectedAction === 10 || selectedAction === 11 || selectedAction === 12 || selectedAction === 13) {
        this.playSfx(GraveFallGame.SOUNDS.ITEM_PICKUP, 0.62);
        return;
    }

    this.playSfx(GraveFallGame.SOUNDS.UI_CONFIRM, 0.45);
};

GraveFallGame.scene.Game.prototype.calculatePlayerAttackDamage = function (playerMenu) {
    var baseDmg = (playerMenu.attackDamage || 5) + (playerMenu.permanentAttackBonus || 0);
    var bonusDmg = (playerMenu.attackDamageBonus || 0) * 1;
    var totalDmg = baseDmg + bonusDmg;

    if (playerMenu.isBuffed || playerMenu.temporaryAttackBuff) {
        totalDmg = Math.ceil(totalDmg * 1.5);
        playerMenu.isBuffed = false;
        playerMenu.temporaryAttackBuff = false;
    }

    playerMenu.attackDamageBonus = 0;
    return totalDmg;
};

GraveFallGame.scene.Game.prototype.applyCommandActionForPlayer = function (playerMenu) {
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
        this.applyClassBuffForPlayer(playerMenu);
    } else if (playerMenu.selectedAction === 10) {
        if (this.consumePlayerItem(playerMenu, "maxHp")) {
            this.applyPermanentItemBuff("maxHp", playerMenu);
        }
    } else if (playerMenu.selectedAction === 11) {
        if (this.consumePlayerItem(playerMenu, "attack")) {
            this.applyPermanentItemBuff("attack", playerMenu);
        }
    } else if (playerMenu.selectedAction === 12) {
        if (this.consumePlayerItem(playerMenu, "defense")) {
            this.applyPermanentItemBuff("defense", playerMenu);
        }
    } else if (playerMenu.selectedAction === 13) {
        if (this.consumePlayerItem(playerMenu, "speed")) {
            this.applyPermanentItemBuff("speed", playerMenu);
        }
    }

    this.playActionPreviewSfx(playerMenu, playerMenu.selectedAction, didDamage);
    return didDamage;
};

GraveFallGame.scene.Game.prototype.resolveCommandPhaseActions = function () {
    var i;

    if (this.enemyHealthCurrent <= 0) {
        return;
    }

    for (i = 0; i < this.playerMenus.length; i++) {
        if (this.playerMenus[i] && this.playerMenus[i].healthCurrent > 0) {
            this.applyCommandActionForPlayer(this.playerMenus[i]);
        }
    }
};

GraveFallGame.scene.Game.prototype.updateCharacterMenuVisuals = function (playerMenu) {
    var i;
    var isItemMenu = playerMenu.menuState === "items";
    var activeIcons = isItemMenu ? playerMenu.itemIcons : playerMenu.actions;
    var inactiveIcons = isItemMenu ? playerMenu.actions : playerMenu.itemIcons;
    var positions = isItemMenu ? playerMenu.itemActionPositions : playerMenu.actionPositions;
    var iconScale = isItemMenu ? 0.52 : 0.6;
    var downed = playerMenu.healthCurrent <= 0;
    var enabled;
    var buffType;

    if (!downed && !this.isMenuIndexSelectable(playerMenu, playerMenu.menuState, playerMenu.selectedIndex)) {
        playerMenu.selectedIndex = this.findSelectableMenuIndex(playerMenu, playerMenu.menuState, playerMenu.selectedIndex, 1);
    }

    for (i = 0; i < inactiveIcons.length; i++) {
        inactiveIcons[i].visible = false;
    }

    for (i = 0; i < activeIcons.length; i++) {
        activeIcons[i].visible = true;
        activeIcons[i].scaleX = iconScale;
        activeIcons[i].scaleY = iconScale;
        enabled = !downed && this.isMenuIndexSelectable(playerMenu, playerMenu.menuState, i);

        if (isItemMenu && i < GraveFallGame.scene.Game.ITEM_BUFF_TYPES.length) {
            buffType = this.getItemBuffTypeForIndex(i);
            enabled = !downed && this.getPlayerItemCount(playerMenu, buffType) > 0;
        }

        activeIcons[i].alpha = enabled ? 1 : 0.28;
    }

    if (!isItemMenu && activeIcons[3]) {
        activeIcons[3].alpha = (!downed && this.getPlayerTotalItemCount(playerMenu) > 0) ? 1 : 0.28;
    }

    if (isItemMenu && activeIcons[activeIcons.length - 1]) {
        activeIcons[activeIcons.length - 1].alpha = downed ? 0.28 : 1;
    }

    if (typeof playerMenu.selectionBar.width === "number") {
        playerMenu.selectionBar.width = isItemMenu ? 50 : 60;
    }

    playerMenu.selectionBar.x = positions[playerMenu.selectedIndex] || positions[0];
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

GraveFallGame.scene.Game.ITEM_BUFF_TYPES = ["maxHp", "attack", "defense", "speed"];

GraveFallGame.scene.Game.BUFF_CONFIGS = {
    defense: { icon: "Defence_Up_Icon_T", itemIcon: "Defence_Up_Buff_Icon_T" },
    attack: { icon: "Attack_Up_Icon_T", itemIcon: "Attack_Up_Buff_Icon_T" },
    speed: { icon: "Speed_Up_Icon_T", itemIcon: "Speed_Up_Buff_Icon_T" },
    maxHp: { icon: "Health_Up_Icon_T", itemIcon: "Health_Up_Buff_Icon_T" },
    heal: { icon: "Health_Up_Icon_T", itemIcon: "Health_Up_Buff_Icon_T" }
};

GraveFallGame.scene.Game.prototype.darkenHexColor = function (hexColor, multiplier) {
    var hex = (hexColor || "#FFFFFF").replace("#", "");
    var factor = typeof multiplier === "number" ? multiplier : 0.45;
    var r;
    var g;
    var b;

    if (hex.length === 3) {
        hex = hex.charAt(0) + hex.charAt(0) + hex.charAt(1) + hex.charAt(1) + hex.charAt(2) + hex.charAt(2);
    }

    if (hex.length !== 6) {
        return "#555555";
    }

    r = Math.max(0, Math.min(255, Math.round(parseInt(hex.substring(0, 2), 16) * factor)));
    g = Math.max(0, Math.min(255, Math.round(parseInt(hex.substring(2, 4), 16) * factor)));
    b = Math.max(0, Math.min(255, Math.round(parseInt(hex.substring(4, 6), 16) * factor)));

    function pair(value) {
        var out = value.toString(16).toUpperCase();
        return out.length < 2 ? "0" + out : out;
    }

    return "#" + pair(r) + pair(g) + pair(b);
};

GraveFallGame.scene.Game.prototype.getBuffEffectColors = function (playerMenu) {
    var theme = playerMenu && playerMenu.theme ? playerMenu.theme : null;
    var paletteIndex = playerMenu && typeof playerMenu.partyRenderIndex === "number" ? (playerMenu.partyRenderIndex % 4) : -1;
    var palette = null;
    var primary = theme ? (theme.accentLight || theme.accent || "#FFFFFF") : "#FFFFFF";

    if (paletteIndex === 0) {
        palette = { primary: "#FF8A80", secondary: "#FF5252", tertiary: "#D50000" };
    } else if (paletteIndex === 1) {
        palette = { primary: "#80D8FF", secondary: "#00B0FF", tertiary: "#2962FF" };
    } else if (paletteIndex === 2) {
        palette = { primary: "#FFFF8D", secondary: "#FFEA00", tertiary: "#FFC400" };
    } else if (paletteIndex === 3) {
        palette = { primary: "#CCFF90", secondary: "#76FF03", tertiary: "#2E7D32" };
    }

    if (!palette) {
        palette = {
            primary: primary,
            secondary: theme ? (theme.accent || primary) : primary,
            tertiary: theme && theme.accentDark ? theme.accentDark : "#FFFFFF"
        };
    }

    return {
        primary: palette.primary,
        dark: palette.secondary,
        darker: palette.tertiary
    };
};

GraveFallGame.scene.Game.prototype.getPlayerDamageEffectColors = function (playerMenu) {
    var colors = this.getBuffEffectColors(playerMenu);

    return [
        this.darkenHexColor(colors.darker, 0.9),
        colors.darker,
        colors.dark,
        colors.primary
    ];
};

GraveFallGame.scene.Game.prototype.getStageAnchorForNode = function (node, xRatio, yRatio) {
    var scaleX;
    var scaleY;
    var width;
    var height;
    var anchor = { x: 0, y: 0 };
    var parent;
    var offsetX = 0;
    var offsetY = 0;

    if (!node) {
        return anchor;
    }

    scaleX = Math.abs(node.scaleX || 1);
    scaleY = Math.abs(node.scaleY || 1);
    width = (node.unscaledWidth || node.width || 100) * scaleX;
    height = (node.unscaledHeight || node.height || 100) * scaleY;

    parent = node.parent;
    while (parent && parent !== this.stage) {
        offsetX += parent.x || 0;
        offsetY += parent.y || 0;
        parent = parent.parent;
    }

    anchor.x = offsetX + node.x + (width * (typeof xRatio === "number" ? xRatio : 0.5));
    anchor.y = offsetY + node.y + (height * (typeof yRatio === "number" ? yRatio : 0.5));

    return anchor;
};

GraveFallGame.scene.Game.prototype.getLivingPlayerMenus = function () {
    var targets = [];
    var i;

    if (!this.playerMenus) {
        return targets;
    }

    for (i = 0; i < this.playerMenus.length; i++) {
        if (this.playerMenus[i] && this.playerMenus[i].healthCurrent > 0) {
            targets.push(this.playerMenus[i]);
        }
    }

    return targets;
};

GraveFallGame.scene.Game.prototype.getBuffIconResource = function (buffType) {
    var config = GraveFallGame.scene.Game.BUFF_CONFIGS[buffType] || GraveFallGame.scene.Game.BUFF_CONFIGS.attack;
    return config.icon;
};

GraveFallGame.scene.Game.prototype.getItemIconResource = function (buffType) {
    var config = GraveFallGame.scene.Game.BUFF_CONFIGS[buffType] || GraveFallGame.scene.Game.BUFF_CONFIGS.attack;
    return config.itemIcon || config.icon;
};

GraveFallGame.scene.Game.prototype.getItemBuffTypeForIndex = function (index) {
    return GraveFallGame.scene.Game.ITEM_BUFF_TYPES[index] || null;
};

GraveFallGame.scene.Game.prototype.getPlayerItemCount = function (playerMenu, buffType) {
    if (!playerMenu || !playerMenu.itemInventory || !buffType) {
        return 0;
    }

    return Math.max(0, playerMenu.itemInventory[buffType] || 0);
};

GraveFallGame.scene.Game.prototype.getPlayerTotalItemCount = function (playerMenu) {
    var itemTypes = GraveFallGame.scene.Game.ITEM_BUFF_TYPES;
    var total = 0;
    var i;

    if (!playerMenu || !playerMenu.itemInventory) {
        return 0;
    }

    for (i = 0; i < itemTypes.length; i++) {
        total += this.getPlayerItemCount(playerMenu, itemTypes[i]);
    }

    return total;
};

GraveFallGame.scene.Game.prototype.givePlayerItem = function (playerMenu, buffType) {
    if (!playerMenu || !buffType) {
        return false;
    }

    if (!playerMenu.itemInventory) {
        playerMenu.itemInventory = { maxHp: 0, attack: 0, defense: 0, speed: 0 };
    }

    playerMenu.itemInventory[buffType] = this.getPlayerItemCount(playerMenu, buffType) + 1;
    this.updateCharacterMenuVisuals(playerMenu);
    return true;
};

GraveFallGame.scene.Game.prototype.consumePlayerItem = function (playerMenu, buffType) {
    if (!playerMenu || !buffType || this.getPlayerItemCount(playerMenu, buffType) <= 0) {
        return false;
    }

    playerMenu.itemInventory[buffType]--;
    this.updateCharacterMenuVisuals(playerMenu);
    return true;
};

GraveFallGame.scene.Game.prototype.isMenuIndexSelectable = function (playerMenu, menuState, index) {
    var buffType;

    if (!playerMenu || playerMenu.healthCurrent <= 0) {
        return false;
    }

    if (menuState === "items") {
        if (index === playerMenu.itemIcons.length - 1) {
            return true;
        }

        buffType = this.getItemBuffTypeForIndex(index);
        return this.getPlayerItemCount(playerMenu, buffType) > 0;
    }

    if (index === 3) {
        return this.getPlayerTotalItemCount(playerMenu) > 0;
    }

    return index >= 0 && index < playerMenu.actions.length;
};

GraveFallGame.scene.Game.prototype.findSelectableMenuIndex = function (playerMenu, menuState, startIndex, direction) {
    var count = menuState === "items" ? playerMenu.itemIcons.length : playerMenu.actions.length;
    var index = startIndex;
    var i;

    if (count <= 0) {
        return 0;
    }

    direction = direction < 0 ? -1 : 1;

    for (i = 0; i < count; i++) {
        index = (index + count) % count;

        if (this.isMenuIndexSelectable(playerMenu, menuState, index)) {
            return index;
        }

        index += direction;
    }

    return 0;
};

GraveFallGame.scene.Game.prototype.calculateEffectiveMoveSpeed = function (playerMenu) {
    var speed = (playerMenu && playerMenu.baseMoveSpeed) || 4;

    if (!playerMenu) {
        return speed;
    }

    speed += playerMenu.permanentSpeedBonus || 0;

    if (playerMenu.temporarySpeedBuff === true) {
        speed += 1.6;
    }

    return Math.max(2, speed);
};

GraveFallGame.scene.Game.prototype.applyClassBuffForPlayer = function (playerMenu) {
    var id = playerMenu && playerMenu.characterId ? playerMenu.characterId : "";
    var targets = this.getLivingPlayerMenus();
    var i;
    var target;
    var healAmount;

    if (!playerMenu) {
        return;
    }

    if (id === "fighter" || id.indexOf("fighter_") === 0 || playerMenu.attackMinigame === "buttonMash") {
        for (i = 0; i < targets.length; i++) {
            targets[i].temporaryDefenseBuff = true;
            targets[i].isDefending = true;
        }
        this.spawnPartyBuffEffect("defense", targets, 1050);
        return;
    }

    if (id === "assassin" || id.indexOf("assassin_") === 0 || id.indexOf("rogue_") === 0 || playerMenu.attackMinigame === "timingBar") {
        for (i = 0; i < targets.length; i++) {
            targets[i].temporarySpeedBuff = true;
            targets[i].moveSpeed = this.calculateEffectiveMoveSpeed(targets[i]);
        }
        this.spawnPartyBuffEffect("speed", targets, 1050);
        return;
    }

    if (id === "wizard" || id.indexOf("wizard_") === 0 || playerMenu.attackMinigame === "buttonSequence") {
        for (i = 0; i < targets.length; i++) {
            target = targets[i];
            healAmount = Math.max(1, Math.floor(target.healthMax * 0.05));
            target.healthCurrent = Math.min(target.healthMax, target.healthCurrent + healAmount);
            this.updatePlayerHealthUi(target);
            this.updatePlayerDamageState(target, this.areAllPlayersDown());
        }
        this.spawnPartyBuffEffect("heal", targets, 1050);
        return;
    }

    if (id === "ranger" || id.indexOf("ranger_") === 0 || playerMenu.attackMinigame === "targetReticle") {
        for (i = 0; i < targets.length; i++) {
            targets[i].temporaryAttackBuff = true;
            targets[i].isBuffed = true;
        }
        this.spawnPartyBuffEffect("attack", targets, 1050);
        return;
    }

    playerMenu.temporaryAttackBuff = true;
    playerMenu.isBuffed = true;
    this.spawnPartyBuffEffect("attack", [playerMenu], 1050);
};

GraveFallGame.scene.Game.prototype.applyPermanentItemBuff = function (buffType, sourceMenu) {
    var targets = this.getLivingPlayerMenus();
    var i;
    var target;
    var amount;

    if (targets.length <= 0) {
        return;
    }

    for (i = 0; i < targets.length; i++) {
        target = targets[i];

        if (buffType === "maxHp") {
            amount = Math.max(4, Math.ceil(target.healthMax * 0.08));
            target.healthMax += amount;
            target.healthCurrent = Math.min(target.healthMax, target.healthCurrent + amount);
            this.updatePlayerHealthUi(target);
            this.updatePlayerDamageState(target, this.areAllPlayersDown());
        } else if (buffType === "attack") {
            target.permanentAttackBonus = (target.permanentAttackBonus || 0) + 1;
        } else if (buffType === "defense") {
            target.permanentDefenseBonus = Math.min(5, (target.permanentDefenseBonus || 0) + 1);
        } else if (buffType === "speed") {
            target.permanentSpeedBonus = Math.min(3, (target.permanentSpeedBonus || 0) + 0.4);
            target.moveSpeed = this.calculateEffectiveMoveSpeed(target);
        }
    }

    this.spawnPartyBuffEffect(buffType, targets, 1200);
};

GraveFallGame.scene.Game.prototype.applyRandomPermanentItemBuff = function (sourceMenu) {
    var buffs = ["maxHp", "attack", "defense", "speed"];
    var buffType = buffs[Math.floor(Math.random() * buffs.length)];
    this.applyPermanentItemBuff(buffType, sourceMenu);
};

GraveFallGame.scene.Game.prototype.getBuffEffectAnchor = function (playerMenu) {
    var node;

    if (!playerMenu) {
        return { x: 0, y: 0 };
    }

    node = playerMenu.stand;

    if (this.phase === GraveFallGame.scene.Game.PHASE_ACTION && playerMenu.battleAvatar && playerMenu.battleAvatar.visible === true) {
        node = playerMenu.battleAvatar;
    }

    return this.getStageAnchorForNode(node, 0.5, 0.45);
};

GraveFallGame.scene.Game.prototype.getEnemyEffectAnchor = function () {
    return this.getStageAnchorForNode(this.enemySprite, 0.5, 0.5);
};

GraveFallGame.scene.Game.prototype.spawnPartyBuffEffect = function (buffType, targets, durationMs) {
    var i;

    if (!targets || targets.length <= 0) {
        return;
    }

    for (i = 0; i < targets.length; i++) {
        this.spawnBuffEffectForPlayer(targets[i], buffType, durationMs || 1000);
    }
};

GraveFallGame.scene.Game.prototype.spawnBuffEffectForPlayer = function (playerMenu, buffType, durationMs) {
    var colors;
    var iconResource;
    var anchor;
    var icon;
    var effect;
    var i;
    var particle;
    var particleResource;
    var angle;
    var distance;
    var speed;
    var scale;
    var particleColor;

    if (!playerMenu || !this.stage) {
        return;
    }

    if (!this.buffVisualEffects) {
        this.buffVisualEffects = [];
    }

    colors = this.getBuffEffectColors(playerMenu);
    iconResource = this.getBuffIconResource(buffType);
    anchor = this.getBuffEffectAnchor(playerMenu);

    icon = new rune.display.Sprite(0, 0, 100, 100, iconResource);
    icon.scaleX = 0.7;
    icon.scaleY = 0.7;
    icon.x = Math.round(anchor.x - 35);
    icon.y = Math.round(anchor.y - 88);
    icon.alpha = 1;
    this.applyMonochromeIconColor(icon, colors.primary);
    this.stage.addChild(icon);

    effect = {
        icon: icon,
        particles: [],
        life: durationMs || 1000,
        maxLife: durationMs || 1000,
        centerX: anchor.x,
        centerY: anchor.y - 42,
        buffType: buffType
    };

    for (i = 0; i < 14; i++) {
        particleResource = i % 2 === 0 ? "Buff_Up_Particle_T" : "Sparkle_Particle_T";
        particle = new rune.display.Sprite(0, 0, 16, 16, particleResource);
        angle = Math.random() * Math.PI * 2;
        distance = this.randomRange ? this.randomRange(10, 28) : (10 + Math.random() * 18);
        speed = this.randomRange ? this.randomRange(0.007, 0.02) : (0.007 + Math.random() * 0.013);
        scale = this.randomRange ? this.randomRange(0.32, 0.7) : (0.32 + Math.random() * 0.38);
        particleColor = i % 3 === 0 ? colors.darker : (i % 2 === 0 ? colors.primary : colors.dark);

        particle.scaleX = scale;
        particle.scaleY = scale;
        particle.x = Math.round(anchor.x + Math.cos(angle) * distance);
        particle.y = Math.round(anchor.y + Math.sin(angle) * distance);
        particle.vx = Math.cos(angle) * speed;
        particle.vy = Math.sin(angle) * speed - (this.randomRange ? this.randomRange(0.003, 0.01) : (0.003 + Math.random() * 0.007));
        particle.wobble = Math.random() * Math.PI * 2;
        particle.wobbleSpeed = this.randomRange ? this.randomRange(0.015, 0.04) : (0.015 + Math.random() * 0.025);
        particle.wobbleAmount = this.randomRange ? this.randomRange(0.02, 0.07) : (0.02 + Math.random() * 0.05);
        particle.rotation = Math.random() * Math.PI * 2;
        particle.rotationSpeed = (Math.random() < 0.5 ? -1 : 1) * (this.randomRange ? this.randomRange(0.002, 0.007) : (0.002 + Math.random() * 0.005));
        particle.life = durationMs || 1000;
        particle.maxLife = durationMs || 1000;
        particle.alpha = 0.82 + Math.random() * 0.16;
        this.applyMonochromeIconColor(particle, particleColor);
        this.stage.addChild(particle);
        effect.particles.push(particle);
    }

    this.buffVisualEffects.push(effect);
};

GraveFallGame.scene.Game.prototype.spawnItemPickupEffect = function (playerMenu, buffType, durationMs) {
    var colors;
    var anchor;
    var effect;
    var particle;
    var particleResource;
    var angle;
    var distance;
    var speed;
    var scale;
    var i;

    if (!playerMenu || !this.stage) {
        return;
    }

    if (!this.buffVisualEffects) {
        this.buffVisualEffects = [];
    }

    colors = this.getBuffEffectColors(playerMenu);
    anchor = this.getBuffEffectAnchor(playerMenu);
    effect = {
        icon: null,
        particles: [],
        life: durationMs || 650,
        maxLife: durationMs || 650,
        centerX: anchor.x,
        centerY: anchor.y,
        buffType: buffType || "pickup"
    };

    for (i = 0; i < 10; i++) {
        particleResource = i % 2 === 0 ? "Sparkle_Particle_T" : "Buff_Up_Particle_T";
        particle = new rune.display.Sprite(0, 0, 16, 16, particleResource);
        angle = Math.random() * Math.PI * 2;
        distance = this.randomRange ? this.randomRange(6, 18) : (6 + Math.random() * 12);
        speed = this.randomRange ? this.randomRange(0.006, 0.016) : (0.006 + Math.random() * 0.01);
        scale = this.randomRange ? this.randomRange(0.24, 0.5) : (0.24 + Math.random() * 0.26);

        particle.scaleX = scale;
        particle.scaleY = scale;
        particle.x = Math.round(anchor.x + Math.cos(angle) * distance);
        particle.y = Math.round(anchor.y + Math.sin(angle) * distance);
        particle.vx = Math.cos(angle) * speed;
        particle.vy = Math.sin(angle) * speed - (this.randomRange ? this.randomRange(0.002, 0.007) : (0.002 + Math.random() * 0.005));
        particle.wobble = Math.random() * Math.PI * 2;
        particle.wobbleSpeed = this.randomRange ? this.randomRange(0.012, 0.03) : (0.012 + Math.random() * 0.018);
        particle.wobbleAmount = this.randomRange ? this.randomRange(0.015, 0.05) : (0.015 + Math.random() * 0.035);
        particle.rotation = Math.random() * Math.PI * 2;
        particle.rotationSpeed = (Math.random() < 0.5 ? -1 : 1) * (this.randomRange ? this.randomRange(0.0015, 0.006) : (0.0015 + Math.random() * 0.0045));
        particle.life = durationMs || 650;
        particle.maxLife = durationMs || 650;
        particle.alpha = 0.75 + Math.random() * 0.18;
        this.applyMonochromeIconColor(particle, i % 2 === 0 ? colors.dark : colors.primary);
        this.stage.addChild(particle);
        effect.particles.push(particle);
    }

    this.buffVisualEffects.push(effect);
};


GraveFallGame.scene.Game.prototype.spawnParticleBurstAt = function (centerX, centerY, options) {
    var effect;
    var i;
    var particle;
    var colors;
    var particleColor;
    var particleResource;
    var angle;
    var distance;
    var speed;
    var scale;
    var count;
    var durationMs;

    if (!this.stage) {
        return;
    }

    if (!this.buffVisualEffects) {
        this.buffVisualEffects = [];
    }

    options = options || {};
    colors = options.colors || ["#FFFFFF"];
    count = options.count || 8;
    durationMs = options.durationMs || 420;

    effect = {
        icon: null,
        particles: [],
        life: durationMs,
        maxLife: durationMs,
        centerX: centerX,
        centerY: centerY,
        buffType: options.effectType || "burst"
    };

    for (i = 0; i < count; i++) {
        particleResource = i % 2 === 0 ? (options.primaryResource || "Buff_Up_Particle_T") : (options.secondaryResource || options.primaryResource || "Sparkle_Particle_T");
        particle = new rune.display.Sprite(0, 0, 16, 16, particleResource);
        angle = (options.directional === true ? (-0.7 + Math.random() * 1.4) : (Math.random() * Math.PI * 2));
        distance = this.randomRange ? this.randomRange(options.minDistance || 1, options.maxDistance || 10) : ((options.minDistance || 1) + Math.random() * ((options.maxDistance || 10) - (options.minDistance || 1)));
        speed = this.randomRange ? this.randomRange(options.minSpeed || 0.004, options.maxSpeed || 0.02) : ((options.minSpeed || 0.004) + Math.random() * ((options.maxSpeed || 0.02) - (options.minSpeed || 0.004)));
        scale = this.randomRange ? this.randomRange(options.minScale || 0.12, options.maxScale || 0.28) : ((options.minScale || 0.12) + Math.random() * ((options.maxScale || 0.28) - (options.minScale || 0.12)));
        particleColor = colors[i % colors.length];

        particle.scaleX = scale;
        particle.scaleY = scale;
        particle.x = Math.round(centerX + Math.cos(angle) * distance);
        particle.y = Math.round(centerY + Math.sin(angle) * distance);
        particle.vx = Math.cos(angle) * speed;
        particle.vy = Math.sin(angle) * speed + (options.baseVy || 0);

        if (options.directional === true) {
            particle.vx += options.forwardX || 0;
            particle.vy += options.forwardY || 0;
        }

        particle.wobble = Math.random() * Math.PI * 2;
        particle.wobbleSpeed = this.randomRange ? this.randomRange(0.008, 0.022) : (0.008 + Math.random() * 0.014);
        particle.wobbleAmount = this.randomRange ? this.randomRange(0.01, 0.035) : (0.01 + Math.random() * 0.025);
        particle.rotation = Math.random() * Math.PI * 2;
        particle.rotationSpeed = (Math.random() < 0.5 ? -1 : 1) * (this.randomRange ? this.randomRange(0.002, 0.009) : (0.002 + Math.random() * 0.007));
        particle.life = durationMs;
        particle.maxLife = durationMs;
        particle.alpha = 0.78 + Math.random() * 0.18;
        this.applyMonochromeIconColor(particle, particleColor);
        this.stage.addChild(particle);
        effect.particles.push(particle);
    }

    this.buffVisualEffects.push(effect);
};

GraveFallGame.scene.Game.prototype.spawnEnemyDamageParticles = function (amount) {
    var anchor = this.getEnemyEffectAnchor();
    var count = Math.max(22, Math.min(44, Math.floor((amount || 0) * 1.05) + 18));

    this.spawnParticleBurstAt(anchor.x, anchor.y + 16, {
        effectType: "enemyHit",
        colors: ["#4A0404", "#7A1111", "#A81818", "#D62D2D", "#FF5252"],
        count: count,
        durationMs: 680,
        minDistance: 2,
        maxDistance: 34,
        minSpeed: 0.012,
        maxSpeed: 0.055,
        minScale: 0.34,
        maxScale: 0.84,
        directional: false,
        baseVy: -0.002,
        primaryResource: "Sparkle_Particle_T",
        secondaryResource: "Sparkle_Particle_T"
    });
};

GraveFallGame.scene.Game.prototype.spawnPlayerDamageParticles = function (playerMenu, amount) {
    var anchor;
    var count;
    var colors;

    if (!playerMenu) {
        return;
    }

    anchor = this.getBuffEffectAnchor(playerMenu);
    colors = this.getPlayerDamageEffectColors(playerMenu);
    count = Math.max(12, Math.min(24, Math.floor((amount || 0) * 0.7) + 8));

    this.spawnParticleBurstAt(anchor.x, anchor.y + 8, {
        effectType: "playerHit",
        colors: colors,
        count: count,
        durationMs: 560,
        minDistance: 1,
        maxDistance: 24,
        minSpeed: 0.008,
        maxSpeed: 0.038,
        minScale: 0.24,
        maxScale: 0.62,
        directional: false,
        baseVy: -0.001,
        primaryResource: "Sparkle_Particle_T",
        secondaryResource: "Sparkle_Particle_T"
    });
};

GraveFallGame.scene.Game.prototype.updateBuffVisualEffects = function (step) {
    var i;
    var j;
    var effect;
    var particle;
    var ratio;
    var flicker;

    if (!this.buffVisualEffects) {
        return;
    }

    for (i = this.buffVisualEffects.length - 1; i >= 0; i--) {
        effect = this.buffVisualEffects[i];
        effect.life -= step;
        ratio = effect.maxLife > 0 ? Math.max(0, effect.life / effect.maxLife) : 0;

        if (effect.icon) {
            effect.icon.y -= 0.012 * step;
            effect.icon.alpha = Math.min(1, ratio * 1.4) * (0.75 + Math.random() * 0.25);
            effect.icon.scaleX = 0.66 + ((1 - ratio) * 0.16);
            effect.icon.scaleY = effect.icon.scaleX;
        }

        for (j = effect.particles.length - 1; j >= 0; j--) {
            particle = effect.particles[j];
            particle.life -= step;
            particle.wobble += particle.wobbleSpeed;
            particle.x += (particle.vx * step) + Math.sin(particle.wobble) * (particle.wobbleAmount || 0.12);
            particle.y += particle.vy * step;

            if (typeof particle.rotation === "number") {
                particle.rotation += (particle.rotationSpeed || 0) * step;
            }

            flicker = 0.45 + Math.random() * 0.55;
            particle.alpha = Math.min(1, ratio * 1.8) * flicker;

            if (particle.life <= 0 && particle.parent) {
                particle.parent.removeChild(particle, true);
                effect.particles.splice(j, 1);
            }
        }

        if (effect.life <= 0) {
            if (effect.icon && effect.icon.parent) {
                effect.icon.parent.removeChild(effect.icon, true);
            }

            for (j = effect.particles.length - 1; j >= 0; j--) {
                if (effect.particles[j].parent) {
                    effect.particles[j].parent.removeChild(effect.particles[j], true);
                }
            }

            this.buffVisualEffects.splice(i, 1);
        }
    }
};

GraveFallGame.scene.Game.prototype.clearBuffVisualEffects = function () {
    var i;
    var j;
    var effect;

    if (!this.buffVisualEffects) {
        return;
    }

    for (i = this.buffVisualEffects.length - 1; i >= 0; i--) {
        effect = this.buffVisualEffects[i];

        if (effect.icon && effect.icon.parent) {
            effect.icon.parent.removeChild(effect.icon, true);
        }

        for (j = 0; j < effect.particles.length; j++) {
            if (effect.particles[j].parent) {
                effect.particles[j].parent.removeChild(effect.particles[j], true);
            }
        }
    }

    this.buffVisualEffects = [];
};


GraveFallGame.scene.Game.prototype.updateCharacterMenuInput = function (playerMenu) {
    var direction;
    var previousIndex;
    var buffType;

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

    if (!this.isMenuIndexSelectable(playerMenu, playerMenu.menuState, playerMenu.selectedIndex)) {
        playerMenu.selectedIndex = this.findSelectableMenuIndex(playerMenu, playerMenu.menuState, playerMenu.selectedIndex, 1);
    }

    if (this.keyboard.justPressed(playerMenu.controls.left) || this.keyboard.justPressed(playerMenu.controls.right)) {
        direction = this.keyboard.justPressed(playerMenu.controls.left) ? -1 : 1;
        previousIndex = playerMenu.selectedIndex;
        playerMenu.selectedIndex = this.findSelectableMenuIndex(playerMenu, playerMenu.menuState, playerMenu.selectedIndex + direction, direction);

        if (playerMenu.selectedIndex !== previousIndex) {
            this.playSfx(GraveFallGame.SOUNDS.UI_MOVE, 0.4);
        }
    }

    if (this.keyboard.justPressed(playerMenu.controls.confirm)) {
        if (!this.isMenuIndexSelectable(playerMenu, playerMenu.menuState, playerMenu.selectedIndex)) {
            this.playSfx(GraveFallGame.SOUNDS.UI_BACK, 0.35);
            this.updateCharacterMenuVisuals(playerMenu);
            return;
        }

        if (playerMenu.menuState === "main" && playerMenu.selectedIndex === 3) {
            playerMenu.menuState = "items";
            playerMenu.selectedIndex = this.findSelectableMenuIndex(playerMenu, "items", 0, 1);
            this.playSfx(GraveFallGame.SOUNDS.UI_CONFIRM, 0.55);
        } else if (playerMenu.menuState === "items" && playerMenu.selectedIndex === playerMenu.itemIcons.length - 1) {
            playerMenu.menuState = "main";
            playerMenu.selectedIndex = 3;
            this.playSfx(GraveFallGame.SOUNDS.UI_BACK, 0.55);
        } else {
            if (playerMenu.menuState === "items") {
                buffType = this.getItemBuffTypeForIndex(playerMenu.selectedIndex);

                if (this.getPlayerItemCount(playerMenu, buffType) <= 0) {
                    this.playSfx(GraveFallGame.SOUNDS.UI_BACK, 0.35);
                    this.updateCharacterMenuVisuals(playerMenu);
                    return;
                }
            }

            playerMenu.selectedAction = playerMenu.menuState === "main" ? playerMenu.selectedIndex : 10 + playerMenu.selectedIndex;
            playerMenu.confirmed = true;
            playerMenu.container.y = playerMenu.confirmedY;
            playerMenu.standActionState = this.getActionPreviewStandState(playerMenu.selectedAction, playerMenu);

            this.updatePlayerDamageState(playerMenu, this.areAllPlayersDown());

            this.playSfx(GraveFallGame.SOUNDS.UI_CONFIRM, 0.55);
        }
    }
    this.updateCharacterMenuVisuals(playerMenu);
};
