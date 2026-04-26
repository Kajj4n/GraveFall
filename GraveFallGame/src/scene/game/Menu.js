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
        characterStand.flippedX = true;
        battleAvatar.flippedX = true;
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
        stand: characterStand,
        portrait: characterIcon,
        classIcon: characterClassIcon,
        battleAvatar: battleAvatar,
        actions: [fightIcon, defendIcon, buffIcon, itemIcon],
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
        hitCooldown: 0
    };

    this.updatePlayerHealthUi(playerMenu);
    this.updateCharacterMenuVisuals(playerMenu);

    return playerMenu;
};


GraveFallGame.scene.Game.prototype.updatePlayerDamageState = function (playerMenu, allPlayersDead) {
    var state = this.getHealthDamageState(playerMenu.healthCurrent, playerMenu.healthMax, true, allPlayersDead);
    var downed = state === "knockedOut" || state === "dead";
    var iconColor = downed ? GraveFallGame.scene.Game.PLAYER_DOWNED_PALETTE.mid : playerMenu.theme.accent;

    this.setDamageStateGroupState(playerMenu.stand, state);
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

    if (amount > 0 && wasAlive) {
        this.playSfx(GraveFallGame.SOUNDS.PLAYER_ATTACK, 0.65);
        this.playSfx(GraveFallGame.SOUNDS.ENEMY_HIT, 0.55);
    }

    if (wasAlive && this.enemyHealthCurrent <= 0 && this.enemyDefeatedSoundPlayed !== true) {
        this.enemyDefeatedSoundPlayed = true;
        this.playSfx(GraveFallGame.SOUNDS.ENEMY_DEFEATED, 0.8);
    }
};

GraveFallGame.scene.Game.prototype.resolveCommandPhaseActions = function () {
    var i;
    var playerMenu;

    if (this.enemyHealthCurrent <= 0) {
        return;
    }

    for (i = 0; i < this.playerMenus.length; i++) {
        playerMenu = this.playerMenus[i];

        if (playerMenu.healthCurrent <= 0) {
            continue;
        }

        // Action index 0 is the fight action. This gives the enemy real HP and
        // immediately lets its five visual damage states react to player attacks.
        if (playerMenu.selectedAction === 0) {
            this.applyDamageToEnemy(playerMenu.attackDamage || 20);
        }
    }
};

GraveFallGame.scene.Game.prototype.updateCharacterMenuVisuals = function (playerMenu) {
    var i;

    playerMenu.selectionBar.x = playerMenu.actionPositions[playerMenu.selectedIndex];
    playerMenu.selectionBar.visible = playerMenu.healthCurrent > 0;

    //keep same for now, maybe useful later
    for (i = 0; i < playerMenu.actions.length; i++) {
        if (i === playerMenu.selectedIndex) {
            playerMenu.actions[i].scaleX = 0.6;
            playerMenu.actions[i].scaleY = 0.6;
        } else {
            playerMenu.actions[i].scaleX = 0.6;
            playerMenu.actions[i].scaleY = 0.6;
        }
    }
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
        playerMenu.selectedAction = playerMenu.selectedIndex;
        playerMenu.confirmed = true;
        playerMenu.container.y = playerMenu.confirmedY;
        this.playSfx(GraveFallGame.SOUNDS.UI_CONFIRM, 0.55);
    }

    this.updateCharacterMenuVisuals(playerMenu);
};
