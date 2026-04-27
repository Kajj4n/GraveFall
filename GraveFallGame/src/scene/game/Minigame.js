//------------------------------------------------------------------------------
// Minigame phase logic
//------------------------------------------------------------------------------

GraveFallGame.scene.Game.prototype.startMinigamePhase = function () {
    var i;
    var menu;

    this.phase = GraveFallGame.scene.Game.PHASE_MINIGAME;
    this.minigameTimer = 10000; // 10 seconds in ms

    if (this.turnTimerText) {
        this.turnTimerText.visible = false;
    }

    for (i = 0; i < this.playerMenus.length; i++) {
        menu = this.playerMenus[i];

        if (menu.healthCurrent > 0 && menu.selectedAction === 0) {
            this.setupPlayerMinigame(menu);
            menu.stand.visible = false;
            menu.stand.alpha = 0;
        }
    }
};

GraveFallGame.scene.Game.prototype.createMinigameIcon = function (resource, x, y) {
    var icon = new rune.display.Sprite(x, y, 100, 100, resource);

    icon.scaleX = 0.42;
    icon.scaleY = 0.42;

    return icon;
};

GraveFallGame.scene.Game.prototype.layoutPlayerMinigame = function (menu) {
    var group;
    var gap;

    if (!menu || !menu.minigame || !menu.minigame.group) {
        return;
    }

    group = menu.minigame.group;
    gap = 10;

    group.x = menu.container.x + (menu.container.width / 2) - (group.width / 2);
    group.y = menu.container.y - group.height - gap;

    group.visible = true;
    group.alpha = 1;
};

GraveFallGame.scene.Game.prototype.clearMinigameButtons = function (menu) {
    var i;
    var sprite;

    if (!menu || !menu.minigame || !menu.minigame.group) {
        return;
    }

    if (menu.minigame.buttonSprites && menu.minigame.buttonSprites.length > 0) {
        for (i = menu.minigame.buttonSprites.length - 1; i >= 0; i--) {
            sprite = menu.minigame.buttonSprites[i];

            if (sprite && sprite.parent) {
                sprite.parent.removeChild(sprite, true);
            }
        }
    }

    menu.minigame.buttonSprites = [];
};

GraveFallGame.scene.Game.prototype.buildMinigameButtons = function (menu) {
    var i;
    var btn;
    var sprite;
    var group;
    var buttons;

    if (!menu || !menu.minigame) {
        return;
    }

    group = menu.minigame.group;
    buttons = menu.minigame.buttons;

    this.clearMinigameButtons(menu);

    for (i = 0; i < buttons.length; i++) {
        btn = buttons[i];
        sprite = this.createMinigameIcon(btn.resource, btn.x, btn.y);
        group.addChild(sprite);
        menu.minigame.buttonSprites.push(sprite);
    }
};

GraveFallGame.scene.Game.prototype.setupPlayerMinigame = function (menu) {
    var group;
    var theme;

    theme = menu.theme || this.getPlayerTheme(0);

    // 104x104 so the 4 button icons can sit in a cross shape.
    group = new rune.display.DisplayObjectContainer(0, 0, 104, 104);

    menu.minigame = {
        active: true,
        storedDamage: 0,
        currentTarget: 0,
        // Cross layout to match the image you showed.
        buttons: [
            { key: "up", resource: "Y_Button_Icon_T", x: 32, y: 0 },
            { key: "left", resource: "X_Button_Icon_T", x: 0, y: 32 },
            { key: "right", resource: "B_Button_Icon_T", x: 64, y: 32 },
            { key: "down", resource: "A_Button_Icon_T", x: 32, y: 64 }
        ],
        buttonSprites: [],
        group: group,
        theme: theme
    };

    this.stage.addChild(group);

    this.buildMinigameButtons(menu);
    this.scramblePlayerButton(menu);
    this.layoutPlayerMinigame(menu);
};

GraveFallGame.scene.Game.prototype.scramblePlayerButton = function (menu) {
    var i;
    var theme;
    var targetIndex;

    if (!menu || !menu.minigame) {
        return;
    }

    theme = menu.theme || this.getPlayerTheme(0);
    targetIndex = Math.floor(Math.random() * menu.minigame.buttons.length);
    menu.minigame.currentTarget = targetIndex;

    // Rebuild the sprites from scratch each time so the highlight always works.
    // Palette-swapping is destructive, so rebuilding avoids the "first press only"
    // problem.
    this.buildMinigameButtons(menu);

    for (i = 0; i < menu.minigame.buttonSprites.length; i++) {
        if (i === targetIndex) {
            this.applyMonochromeIconColor(menu.minigame.buttonSprites[i], theme.accent);
            menu.minigame.buttonSprites[i].alpha = 1;
            menu.minigame.buttonSprites[i].scaleX = 0.48;
            menu.minigame.buttonSprites[i].scaleY = 0.48;
        } else {
            this.applyMonochromeIconColor(menu.minigame.buttonSprites[i], "#E8E8E8");
            menu.minigame.buttonSprites[i].alpha = 0.95;
            menu.minigame.buttonSprites[i].scaleX = 0.42;
            menu.minigame.buttonSprites[i].scaleY = 0.42;
        }
    }

    this.layoutPlayerMinigame(menu);
};

GraveFallGame.scene.Game.prototype.updatePlayerMinigame = function (menu) {
    var target;
    var inputKey;

    if (!menu || !menu.minigame || menu.minigame.active !== true) {
        return;
    }

    this.layoutPlayerMinigame(menu);

    target = menu.minigame.buttons[menu.minigame.currentTarget];
    inputKey = menu.moveControls[target.key];

    if (inputKey && this.keyboard.justPressed(inputKey)) {
        menu.minigame.storedDamage += 1;
        this.playSfx(GraveFallGame.SOUNDS.UI_MOVE, 0.45);
        this.scramblePlayerButton(menu);
    }
};

GraveFallGame.scene.Game.prototype.updateMinigamePhase = function (step) {
    var i;
    var menu;

    this.minigameTimer -= step;

    if (this.minigameTimer < 0) {
        this.minigameTimer = 0;
    }

    for (i = 0; i < this.playerMenus.length; i++) {
        menu = this.playerMenus[i];

        if (menu.minigame && menu.minigame.active) {
            this.updatePlayerMinigame(menu);
        }
    }

    if (this.minigameTimer <= 0) {
        this.endMinigamePhase();
    }
};

GraveFallGame.scene.Game.prototype.endMinigamePhase = function () {
    var i;
    var menu;

    for (i = 0; i < this.playerMenus.length; i++) {
        menu = this.playerMenus[i];

        if (!menu.minigame) {
            continue;
        }

        // Store bonus damage for the upcoming action phase.
        menu.attackDamageBonus = menu.minigame.storedDamage || 0;

        if (menu.minigame.group && menu.minigame.group.parent) {
            menu.minigame.group.parent.removeChild(menu.minigame.group, true);
        }

        menu.minigame.active = false;
        menu.minigame = null;

        if (menu.stand) {
            menu.stand.visible = true;
            menu.stand.alpha = 1;
        }
    }

    if (this.turnTimerText) {
        this.turnTimerText.visible = false;
    }

    this.startActionPhase();
};