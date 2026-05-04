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

    var characterStand = this.createDamageStateGroup(standX, 400, 100, 100, this.getPlayerStandDamageStates(options.stand), { flippedX: options.flipStandX });
    var battleAvatar = new rune.display.Sprite(0, 0, 100, 100, options.classIcon);

    var characterIcon = this.createDamageStateGroup(10, 5, 80, 80, this.getPortraitDamageStates(options.portrait));
    var characterClassIcon = new rune.display.Sprite(55, 30, 100, 100, options.classIcon);

    var fightIcon = new rune.display.Sprite(10, 10, 100, 100, "Fight_Icon_T");
    var defendIcon = new rune.display.Sprite(95, 10, 100, 100, "Defend_Icon_T");
    var buffIcon = new rune.display.Sprite(180, 10, 100, 100, "Buff_Icon_T");
    var itemIcon = new rune.display.Sprite(255, 10, 100, 100, "Item_Icon_T");

    // --- ITEM SUBMENU ICONS ---
    var healthItemIcon = new rune.display.Sprite(actionPositions[0], 10, 100, 100, "Health_Up_Icon_T");
    var sharpItemIcon = new rune.display.Sprite(actionPositions[1], 10, 100, 100, "Attack_Up_Icon_T");
    var shieldItemIcon = new rune.display.Sprite(actionPositions[2], 10, 100, 100, "Defence_Up_Icon_T");
    var returnItemIcon = new rune.display.Sprite(actionPositions[3], 10, 100, 100, "Back_Arrow_Icon_T");

    var itemIconsArray = [healthItemIcon, sharpItemIcon, shieldItemIcon, returnItemIcon];
    for (var i = 0; i < itemIconsArray.length; i++) {
        itemIconsArray[i].scaleX = 0.6;
        itemIconsArray[i].scaleY = 0.6;
        itemIconsArray[i].visible = false;
        // Apply coloring here explicitly to match other actions
        this.applyMonochromeIconColor(itemIconsArray[i], options.playerTheme.accentLight);
        characterMenuActions.addChild(itemIconsArray[i]);
    }
    // --------------------------

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

    if (options.flipStandX === true) {
        characterStand.flippedX = false;
        battleAvatar.flippedX = false;
    }

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
        moveSpeed: 4,
        attackDamage: options.attackDamage || 20,
        attackDamageBonus: 0,
        hitCooldown: 0,
        isDefending: false,
        isBuffed: false,
        standResource: options.stand,
        healingStandSprite: null,
        standActionState: null,
        healingStandTimer: 0,
        menuState: "main" // Toggles between "main" and "items"
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

    playerMenu.stand.alpha = 1;
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

GraveFallGame.scene.Game.prototype.applyDamageToEnemy = function (amount) {
    var wasAlive = this.enemyHealthCurrent > 0;

    this.enemyHealthCurrent = Math.max(0, this.enemyHealthCurrent - amount);
    this.updateEnemyDamageState();

    this.updateEnemyHealthBarUi();

    if (amount > 0 && wasAlive) {
        this.playSfx(GraveFallGame.SOUNDS.PLAYER_ATTACK, 0.65);
        this.playSfx(GraveFallGame.SOUNDS.ENEMY_HIT, 0.55);
    }

    if (wasAlive && this.enemyHealthCurrent <= 0) {
        // The defeat sound is now delayed until the corpse sprite disappears,
        // so the hit can breathe before the passage transition starts.
        this.enemyDefeatedSoundPlayed = false;
    }
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
            baseDmg = 5;
            bonusDmg = (playerMenu.attackDamageBonus || 0) * 1; 
            totalDmg = baseDmg + bonusDmg;

            if (playerMenu.isBuffed) {
                totalDmg *= 2; 
                playerMenu.isBuffed = false;
            }
            
            this.applyDamageToEnemy(totalDmg);
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
        
        // --- ITEM: HEALTH POTION (NOW REVIVES) ---
        else if (playerMenu.selectedAction === 10) {
            for (j = 0; j < this.playerMenus.length; j++) {
                target = this.playerMenus[j];

                var healAmount = Math.max(1, Math.floor(target.healthMax * 0.10));

                if (target.healthCurrent <= 0) {
                    // REVIVE
                    target.healthCurrent = healAmount;
                    target.confirmed = false;
                    target.selectedAction = null;
                    target.isDefending = false;
                    target.isBuffed = false;
                    target.hitCooldown = 0;
                } else {
                    // NORMAL HEAL
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

    // Hide inactive icons
    for (i = 0; i < inactiveIcons.length; i++) {
        inactiveIcons[i].visible = false;
    }

    // Show and scale active icons
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
    playerMenu.standActionState = null; // Clean up action state
    playerMenu.confirmed = false;
    playerMenu.container.y = playerMenu.baseY;

    if (playerMenu.stand && playerMenu.healthCurrent > 0) {
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
            playerMenu.selectedIndex = playerMenu.actions.length - 1; // 3
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
            // Open Items Sub-Menu
            playerMenu.menuState = "items";
            playerMenu.selectedIndex = 0;
            this.playSfx(GraveFallGame.SOUNDS.UI_CONFIRM, 0.55);
        } else if (playerMenu.menuState === "items" && playerMenu.selectedIndex === 3) {
            // Return to Main Menu
            playerMenu.menuState = "main";
            playerMenu.selectedIndex = 3;
            this.playSfx(GraveFallGame.SOUNDS.UI_BACK, 0.55);
        } else {
            // Confirm Action
            playerMenu.selectedAction = playerMenu.menuState === "main" ? playerMenu.selectedIndex : 10 + playerMenu.selectedIndex;
            playerMenu.confirmed = true;
            playerMenu.container.y = playerMenu.confirmedY;

            // --- CHANGED: Added logic for item submenu mapping to attack/defend visual states
            if (playerMenu.selectedAction === 0 || playerMenu.selectedAction === 11) {
                playerMenu.standActionState = "itemAttack"; // Attack or Sharpening Tool
            } else if (playerMenu.selectedAction === 1 || playerMenu.selectedAction === 12) {
                playerMenu.standActionState = "itemDefend"; // Defend or Shield Barrier
            } else {
                playerMenu.standActionState = null;
            }

            // Apply the sprite change immediately
            this.updatePlayerDamageState(playerMenu, this.areAllPlayersDown());

            if (playerMenu.selectedAction === 10) {
                if (typeof this.startHealingStandAnimation === "function") {
                    this.startHealingStandAnimation(playerMenu);
                }

                var j, target;
                for (j = 0; j < this.playerMenus.length; j++) {
                    target = this.playerMenus[j];

                    if (target.healthCurrent <= 0) {
                        var reviveAmount = Math.floor(target.healthMax * 0.15);
                        target.healthCurrent = Math.max(1, reviveAmount);

                        this.updatePlayerHealthUi(target);
                        this.updatePlayerDamageState(target, this.areAllPlayersDown());

                        target.confirmed = false;
                        target.selectedAction = null;
                        target.standActionState = null; // Clean up revived state
                        target.container.y = target.baseY;

                        if (target.stand) {
                            target.stand.visible = true;
                            target.stand.alpha = 1;
                        }
                    }
                }
            }

            this.playSfx(GraveFallGame.SOUNDS.UI_CONFIRM, 0.55);
        }
    }
    this.updateCharacterMenuVisuals(playerMenu);
};