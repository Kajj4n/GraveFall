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

    // CHANGED: The projectile layer is now physically bound to the arena's dimensions.
    // This allows negative coordinates to be clipped/hidden!
    this.arenaProjectileLayer = new rune.display.DisplayObjectContainer(arenaX, arenaY, arenaWidth, arenaHeight);
    this.arenaProjectileLayer.visible = false;
    this.stage.addChild(this.arenaProjectileLayer);

    // CHANGED: Same for the avatar layer
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

GraveFallGame.scene.Game.prototype.startActionPhase = function () {
    var enemy = this.getCurrentEnemyConfig();
    var i;

    this.resolveCommandPhaseActions();
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
    this.turnTimerText.alpha = 1;
    this.turnTimerText.text = "10";

    for (i = 0; i < this.playerMenus.length; i++) {
        this.playerMenus[i].confirmed = false;
        this.playerMenus[i].selectedAction = null;
        this.playerMenus[i].container.y = this.playerMenus[i].baseY;
        this.playerMenus[i].hitCooldown = 0;
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