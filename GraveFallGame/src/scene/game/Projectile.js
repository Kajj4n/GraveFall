//------------------------------------------------------------------------------
// Combat, collisions, projectiles, items
//------------------------------------------------------------------------------

GraveFallGame.scene.Game.prototype.spawnEnemyPattern = function () {
    var enemy = this.getCurrentEnemyConfig();
    var patternId = enemy.patterns[Math.floor(Math.random() * enemy.patterns.length)];
    this.spawnEnemyPatternById(patternId);
};

GraveFallGame.scene.Game.prototype.spawnEnemyPatternById = function (patternId) {
    this.playEnemyPatternSfx(patternId);

    switch (patternId) {
        case "boss_sword_rain": this.spawnBossSwordRain(); break;
        case "boss_vertical_sweep": this.spawnBossVerticalSweep(); break;
        case "boss_orb_burst": this.spawnBossOrbBurst(); break;
        case "boss_diagonal_drop": this.spawnBossDiagonalDrop(); break;
        case "goblin_pebble_rain": this.spawnGoblinPebbleRain(); break;
        case "goblin_dart_fan": this.spawnGoblinDartFan(); break;
        case "goblin_stomp_wave": this.spawnGoblinStompWave(); break;
    }
};

GraveFallGame.scene.Game.prototype.spawnBossSwordRain = function () {
    var inner = this.getArenaInnerBounds();
    var count = 5 + Math.floor(Math.random() * 3);
    var i;

    for (i = 0; i < count; i++) {
        this.spawnProjectile({
            x: this.randomRange(inner.x, inner.x + inner.width - 16),
            y: inner.y - this.randomRange(20, 160),
            width: 16,
            height: 48,
            resource: "Falling_Sword_Attack_T",
            vx: this.randomRange(-0.5, 0.5),
            vy: this.randomRange(6.5, 9.0),
            damage: 10,
            life: 160,
            type: "falling_blade"
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnBossVerticalSweep = function () {
    var inner = this.getArenaInnerBounds();
    var fromTop = Math.random() > 0.5;
    var count = 1 + Math.floor(Math.random() * 2);
    var i;
    var x;

    for (i = 0; i < count; i++) {
        x = inner.x + this.randomRange(48, inner.width - 60);
        this.spawnVerticalSweepProjectile({
            x: x,
            y: fromTop ? inner.y - 170 : inner.y + inner.height + 10,
            collisionWidth: 16,
            collisionHeight: 160,
            spriteWidth: 160,
            spriteHeight: 12,
            resource: "Horizontal_Sweep_Attack_T",
            rotation: fromTop ? 90 : -90,
            vx: 0,
            vy: fromTop ? this.randomRange(3.0, 4.3) : this.randomRange(-4.3, -3.0),
            damage: 12,
            life: 110,
            type: "vertical_sweep"
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnBossOrbBurst = function () {
    var inner = this.getArenaInnerBounds();
    var originX = inner.x + (inner.width / 2);
    var originY = inner.y + 30;
    var count = 8 + Math.floor(Math.random() * 4);
    var i;
    var angle;
    var speed;

    for (i = 0; i < count; i++) {
        angle = this.randomRange(0.6, 2.5);
        speed = this.randomRange(3.0, 5.5);

        this.spawnProjectile({
            x: originX,
            y: originY,
            width: 16,
            height: 16,
            resource: "Orb_Attack_T",
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            damage: 7,
            life: 120,
            type: "orb"
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnBossDiagonalDrop = function () {
    var inner = this.getArenaInnerBounds();
    var fromLeft = Math.random() > 0.5;
    var count = 4 + Math.floor(Math.random() * 3);
    var i;

    for (i = 0; i < count; i++) {
        this.spawnProjectile({
            x: fromLeft ? inner.x - this.randomRange(20, 80) : inner.x + inner.width + this.randomRange(20, 80),
            y: inner.y - this.randomRange(20, 120),
            width: 32,
            height: 16,
            resource: "Knife_Attack_T",
            flippedX: fromLeft ? false : true,
            vx: fromLeft ? this.randomRange(2.5, 4.2) : this.randomRange(-4.2, -2.5),
            vy: this.randomRange(5.0, 7.0),
            rotation: fromLeft ? 22 : -22,
            damage: 9,
            life: 120,
            type: "diagonal_blade"
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnGoblinPebbleRain = function () {
    var inner = this.getArenaInnerBounds();
    var count = 10 + Math.floor(Math.random() * 6);
    var i;

    for (i = 0; i < count; i++) {
        this.spawnProjectile({
            x: this.randomRange(inner.x, inner.x + inner.width - 16),
            y: inner.y - this.randomRange(10, 140),
            width: 16,
            height: 16,
            resource: "Orb_Attack_T",
            vx: this.randomRange(-1.2, 1.2),
            vy: this.randomRange(5.5, 8.0),
            damage: 6,
            life: 110,
            type: "pebble"
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnGoblinDartFan = function () {
    var inner = this.getArenaInnerBounds();
    var side = Math.random() > 0.5 ? -1 : 1;
    var originX = side < 0 ? inner.x - 30 : inner.x + inner.width + 30;
    var originY = inner.y + this.randomRange(50, inner.height - 80);
    var i;
    var vy;

    for (i = -2; i <= 2; i++) {
        vy = i * 1.5;
        this.spawnProjectile({
            x: originX,
            y: originY,
            width: 32,
            height: 16,
            resource: "Knife_Attack_T",
            flippedX: side < 0 ? false : true,
            vx: side < 0 ? this.randomRange(7.0, 9.0) : this.randomRange(-9.0, -7.0),
            vy: vy,
            damage: 8,
            life: 100,
            type: "dart"
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnGoblinStompWave = function () {
    var inner = this.getArenaInnerBounds();
    var i;

    for (i = 0; i < 7; i++) {
        this.spawnProjectile({
            x: inner.x + 50 + (i * ((inner.width - 100) / 6)),
            y: inner.y + inner.height - 16,
            width: 16,
            height: 16,
            resource: "StompWave_Attack_T",
            vx: this.randomRange(-0.8, 0.8),
            vy: this.randomRange(-6.5, -4.0),
            damage: 7,
            life: 70,
            type: "stomp_wave"
        });
    }
};

GraveFallGame.scene.Game.prototype.removeProjectileAt = function (index) {
    var projectile = this.projectiles[index];
    if (!projectile) return;
    if (projectile.parent) projectile.parent.removeChild(projectile, true);
    this.projectiles.splice(index, 1);
};

GraveFallGame.scene.Game.prototype.rectsOverlap = function (a, b) {
    return (a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y);
};

GraveFallGame.scene.Game.prototype.isBattleAvatarColliding = function (playerMenu, testX, testY) {
    var i;
    var otherMenu;
    var testAvatar = {
        x: testX,
        y: testY,
        width: playerMenu.battleAvatar.width,
        height: playerMenu.battleAvatar.height
    };

    for (i = 0; i < this.playerMenus.length; i++) {
        otherMenu = this.playerMenus[i];
        if (otherMenu === playerMenu || otherMenu.healthCurrent <= 0) continue;
        if (this.rectsOverlap(testAvatar, otherMenu.battleAvatar)) return true;
    }

    return false;
};

GraveFallGame.scene.Game.prototype.updatePlayerHitFlicker = function (playerMenu) {
    var flashAlpha = 1;

    if (playerMenu.hitCooldown > 0) {
        flashAlpha = playerMenu.hitCooldown % 2 === 0 ? 0.15 : 1;
        playerMenu.hitCooldown--;
    }

    if (playerMenu.healthCurrent > 0) {
        playerMenu.battleAvatar.visible = true;
        playerMenu.battleAvatar.alpha = flashAlpha;
    } else {
        playerMenu.battleAvatar.visible = false;
        playerMenu.battleAvatar.alpha = 1;
    }

    playerMenu.classIcon.alpha = flashAlpha;
};

GraveFallGame.scene.Game.prototype.playPlaceholderHitSound = function () {
    this.playSfx(GraveFallGame.SOUNDS.PLAYER_HIT, 0.55);
};

GraveFallGame.scene.Game.prototype.applyDamageToPlayer = function (playerMenu, amount) {
    var wasAlive = playerMenu.healthCurrent > 0;

    playerMenu.healthCurrent = Math.max(0, playerMenu.healthCurrent - amount);
    this.updatePlayerHealthUi(playerMenu);
    playerMenu.hitCooldown = 12;

    this.shakeOnPlayerDamage(amount);

    if (this.phase !== GraveFallGame.scene.Game.PHASE_ACTION) {
        this.updateAllPlayerDamageStates();
    }

    if (playerMenu.healthCurrent <= 0) {
        if (wasAlive) {
            this.playSfx(GraveFallGame.SOUNDS.PLAYER_DOWNED, 0.8);
        }

        playerMenu.battleAvatar.visible = false;
        playerMenu.battleAvatar.alpha = 1;
        playerMenu.confirmed = true;
    } else if (wasAlive) {
        this.playSfx(GraveFallGame.SOUNDS.PLAYER_HIT, 0.6);
    }
};

GraveFallGame.scene.Game.prototype.checkProjectileCollisions = function () {
    var i;
    var j;
    var projectile;
    var playerMenu;

    for (i = this.projectiles.length - 1; i >= 0; i--) {
        projectile = this.projectiles[i];

        if (!projectile || projectile.hit) {
            continue;
        }

        for (j = 0; j < this.playerMenus.length; j++) {
            playerMenu = this.playerMenus[j];

            if (playerMenu.healthCurrent <= 0 || playerMenu.hitCooldown > 0) {
                continue;
            }

            if (this.rectsOverlap(projectile, playerMenu.battleAvatar)) {
                this.applyDamageToPlayer(playerMenu, projectile.damage);
                projectile.hit = true;
                projectile.hitFlashFrames = 6;
                projectile.vx = 0;
                projectile.vy = 0;
                break;
            }
        }
    }
};

GraveFallGame.scene.Game.prototype.updateProjectiles = function () {
    var inner = this.getArenaInnerBounds();
    var i;
    var projectile;

    for (i = this.projectiles.length - 1; i >= 0; i--) {
        projectile = this.projectiles[i];

        if (!projectile) {
            continue;
        }

        if (projectile.hit) {
            projectile.hitFlashFrames--;
            projectile.alpha = projectile.hitFlashFrames % 2 === 0 ? 0.15 : 1;

            if (projectile.hitFlashFrames <= 0) {
                this.removeProjectileAt(i);
            }

            continue;
        }

        projectile.x += projectile.vx;
        projectile.y += projectile.vy;
        projectile.life--;

        if (
            projectile.life <= 0 ||
            projectile.x < inner.x - 220 ||
            projectile.x > inner.x + inner.width + 220 ||
            projectile.y < inner.y - 220 ||
            projectile.y > inner.y + inner.height + 220
        ) {
            this.removeProjectileAt(i);
        }
    }
};

GraveFallGame.scene.Game.prototype.updateBattleAvatarMovement = function (playerMenu) {
    var speed = playerMenu.moveSpeed || 3;
    var avatar = playerMenu.battleAvatar;
    var inner = this.getArenaInnerBounds();
    var maxX = inner.x + inner.width - avatar.width;
    var maxY = inner.y + inner.height - avatar.height;
    var oldX = avatar.x;
    var oldY = avatar.y;
    var nextX = avatar.x;
    var nextY = avatar.y;

    if (playerMenu.healthCurrent <= 0) {
        return;
    }

    if (this.keyboard.pressed(playerMenu.moveControls.left)) {
        nextX -= speed;
    }

    if (this.keyboard.pressed(playerMenu.moveControls.right)) {
        nextX += speed;
    }

    if (this.keyboard.pressed(playerMenu.moveControls.up)) {
        nextY -= speed;
    }

    if (this.keyboard.pressed(playerMenu.moveControls.down)) {
        nextY += speed;
    }

    nextX = this.clampValue(nextX, inner.x, maxX);
    nextY = this.clampValue(nextY, inner.y, maxY);

    if (this.isBattleAvatarColliding(playerMenu, nextX, nextY)) {
        avatar.x = oldX;
        avatar.y = oldY;
        return;
    }

    avatar.x = nextX;
    avatar.y = nextY;
};

GraveFallGame.scene.Game.prototype.clearArenaItem = function () {
    if (this.arenaItem && this.arenaItem.parent) {
        this.arenaItem.parent.removeChild(this.arenaItem, true);
    }

    this.arenaItem = null;
};

GraveFallGame.scene.Game.prototype.spawnArenaItem = function () {
    var inner = this.getArenaInnerBounds();
    var itemScale = 0.45;
    var item = new rune.display.Sprite(0, 0, 100, 100, "Item_Icon_T");
    var maxX;
    var maxY;

    item.scaleX = itemScale;
    item.scaleY = itemScale;
    this.applyMonochromeIconColor(item, "#FFFFFF");

    maxX = inner.x + inner.width - (item.width * item.scaleX);
    maxY = inner.y + inner.height - (item.height * item.scaleY);

    item.x = this.randomRange(inner.x, maxX);
    item.y = this.randomRange(inner.y, maxY);

    this.arenaAvatarLayer.addChild(item);
    this.arenaItem = item;
    this.playSfx(GraveFallGame.SOUNDS.ITEM_SPAWN, 0.45);
};

GraveFallGame.scene.Game.prototype.updateArenaItem = function () {
    if (this.arenaItem) return;
    if (this.itemSpawnTimer > 0) {
        this.itemSpawnTimer--;
        return;
    }
    this.spawnArenaItem();
};

GraveFallGame.scene.Game.prototype.checkItemCollisions = function () {
    var i;
    var playerMenu;

    if (!this.arenaItem) return;

    for (i = 0; i < this.playerMenus.length; i++) {
        playerMenu = this.playerMenus[i];

        if (playerMenu.healthCurrent <= 0) {
            continue;
        }

        if (this.rectsOverlap(playerMenu.battleAvatar, this.arenaItem)) {
            this.playSfx(GraveFallGame.SOUNDS.ITEM_PICKUP, 0.65);
            this.clearArenaItem();

            // 🔥 ADD THIS: reset random spawn delay
            this.itemSpawnTimer = Math.floor(this.randomRange(90, 240));

            break;
        }
    }
};
GraveFallGame.scene.Game.prototype.updateActionPhase = function () {
    var enemy = this.getCurrentEnemyConfig();
    var i;

    this.actionPhaseTimer--;
    this.nextPatternIn--;

    this.updateArenaItem();
    this.checkItemCollisions();

    if (this.nextPatternIn <= 0) {
        this.spawnEnemyPattern();
        this.nextPatternIn = enemy.patternInterval;
    }

    for (i = 0; i < this.playerMenus.length; i++) {
        this.updateBattleAvatarMovement(this.playerMenus[i]);
        this.updatePlayerHitFlicker(this.playerMenus[i]);
    }

    this.updateProjectiles();
    this.checkProjectileCollisions();

    if (this.areAllPlayersDown()) {
        this.endActionPhase();
        return;
    }

    if (this.actionPhaseTimer <= 0) {
        this.endActionPhase();
    }
};
