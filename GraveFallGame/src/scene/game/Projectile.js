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
        case "goblin_boss_mace_quake": this.spawnGoblinBossMaceQuake(); break;
        case "goblin_boss_sword_pincer": this.spawnGoblinBossSwordPincer(); break;
        case "goblin_boss_head_toss": this.spawnGoblinBossHeadToss(); break;
        case "goblin_boss_mob_charge": this.spawnGoblinBossMobCharge(); break;
        case "goblin_boss_blade_trap": this.spawnGoblinBossBladeTrap(); break;
        case "ghoul_orb_crawl": this.spawnGhoulOrbCrawl(); break;
        case "ghoul_dart_ambush": this.spawnGhoulDartAmbush(); break;
        case "ghoul_stomp_pulse": this.spawnGhoulStompPulse(); break;
        case "ghoul_impaled_sword_drop": this.spawnGhoulImpaledSwordDrop(); break;
        case "ghoul_bone_shard_spread": this.spawnGhoulBoneShardSpread(); break;
        case "ghoul_skull_drift": this.spawnGhoulSkullDrift(); break;
        case "placeholder_spear_corridor": this.spawnPlaceholderSpearCorridor(); break;
        case "placeholder_arrow_crossfire": this.spawnPlaceholderArrowCrossfire(); break;
        case "placeholder_bone_shard_arc": this.spawnPlaceholderBoneShardArc(); break;
        case "placeholder_skull_ring": this.spawnPlaceholderSkullRing(); break;
        case "placeholder_crystal_rain": this.spawnPlaceholderCrystalRain(); break;
        case "placeholder_crystal_wall": this.spawnPlaceholderCrystalWall(); break;
        case "placeholder_orb_split": this.spawnPlaceholderOrbSplit(); break;
        case "hydragon_fireball_breath": this.spawnHyDragonFireballBreath(); break;
        case "hydragon_fire_wave": this.spawnHyDragonFireWave(); break;
        case "hydragon_orb_breath": this.spawnHyDragonOrbBreath(); break;
        case "hydragon_sword_storm": this.spawnHyDragonSwordStorm(); break;
        case "hydragon_cross_sweep": this.spawnHyDragonCrossSweep(); break;
        case "hydragon_fang_fan": this.spawnHyDragonFangFan(); break;
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

GraveFallGame.scene.Game.prototype.spawnGoblinBossMaceQuake = function () {
    var inner = this.getArenaInnerBounds();
    var count = 9;
    var i;
    var x;

    for (i = 0; i < count; i++) {
        x = inner.x + 30 + (i * ((inner.width - 60) / (count - 1)));
        this.spawnProjectile({
            x: x,
            y: inner.y + inner.height - 16,
            width: 16,
            height: 16,
            resource: "StompWave_Attack_T",
            vx: this.randomRange(-0.45, 0.45),
            vy: this.randomRange(-7.2, -4.8),
            damage: 9,
            life: 80,
            type: "goblin_mace_quake"
        });
    }

    for (i = 0; i < 3; i++) {
        this.spawnProjectile({
            x: inner.x + this.randomRange(80, inner.width - 104),
            y: inner.y - this.randomRange(16, 90),
            width: 24,
            height: 24,
            resource: "Goblin_Walk_Attack_1_T",
            vx: this.randomRange(-0.35, 0.35),
            vy: this.randomRange(5.5, 7.0),
            damage: 10,
            life: 100,
            type: "goblin_mace_drop",
            hitboxInsetX: 4,
            hitboxInsetY: 4
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnGoblinBossSwordPincer = function () {
    var inner = this.getArenaInnerBounds();
    var lanes = [0.22, 0.45, 0.68, 0.82];
    var resources = ["Goblin_Walk_Attack_2_T", "Goblin_Walk_Attack_3_T"];
    var i;
    var y;
    var leftSpeed;
    var rightSpeed;

    for (i = 0; i < lanes.length; i++) {
        y = inner.y + Math.round(inner.height * lanes[i]) - 12;
        leftSpeed = this.randomRange(4.8, 6.3);
        rightSpeed = this.randomRange(-6.3, -4.8);

        this.spawnProjectile({
            x: inner.x - 34 - (i * 18),
            y: y,
            width: 24,
            height: 24,
            resource: resources[i % resources.length],
            vx: leftSpeed,
            vy: this.randomRange(-0.18, 0.18),
            damage: 11,
            life: 145,
            type: "goblin_sword_pincer",
            hitboxInsetX: 4,
            hitboxInsetY: 4
        });

        if (i % 2 === 0) {
            this.spawnProjectile({
                x: inner.x + inner.width + 10 + (i * 16),
                y: y + this.randomRange(-10, 10),
                width: 24,
                height: 24,
                resource: resources[(i + 1) % resources.length],
                flippedX: true,
                vx: rightSpeed,
                vy: this.randomRange(-0.18, 0.18),
                damage: 11,
                life: 145,
                type: "goblin_sword_pincer",
                hitboxInsetX: 4,
                hitboxInsetY: 4
            });
        }
    }
};

GraveFallGame.scene.Game.prototype.spawnGoblinBossHeadToss = function () {
    var inner = this.getArenaInnerBounds();
    var count = 6 + Math.floor(Math.random() * 3);
    var i;
    var fromLeft;

    for (i = 0; i < count; i++) {
        fromLeft = i % 2 === 0;
        this.spawnProjectile({
            x: fromLeft ? inner.x - this.randomRange(16, 80) : inner.x + inner.width + this.randomRange(16, 80),
            y: inner.y - this.randomRange(12, 92),
            width: 16,
            height: 16,
            resource: "Goblin_Head_Attack_T",
            flippedX: fromLeft ? false : true,
            vx: fromLeft ? this.randomRange(2.4, 4.4) : this.randomRange(-4.4, -2.4),
            vy: this.randomRange(4.8, 7.2),
            rotation: fromLeft ? this.randomRange(12, 28) : this.randomRange(-28, -12),
            damage: 8,
            life: 130,
            type: "goblin_head_toss"
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnGoblinBossMobCharge = function () {
    var inner = this.getArenaInnerBounds();
    var resources = ["Goblin_Walk_Attack_1_T", "Goblin_Walk_Attack_2_T", "Goblin_Walk_Attack_3_T"];
    var yPositions = [0.28, 0.52, 0.76];
    var i;
    var fromLeft;
    var y;

    for (i = 0; i < resources.length; i++) {
        fromLeft = i !== 1;
        y = inner.y + Math.round(inner.height * yPositions[i]) - 12;

        this.spawnProjectile({
            x: fromLeft ? inner.x - 46 - (i * 16) : inner.x + inner.width + 22 + (i * 16),
            y: y,
            width: 24,
            height: 24,
            resource: resources[i],
            flippedX: !fromLeft,
            vx: fromLeft ? this.randomRange(5.6, 7.4) : this.randomRange(-7.4, -5.6),
            vy: this.randomRange(-0.25, 0.25),
            damage: i === 0 ? 13 : 10,
            life: 135,
            type: "goblin_mob_charge",
            hitboxInsetX: 4,
            hitboxInsetY: 4
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnGoblinBossBladeTrap = function () {
    var inner = this.getArenaInnerBounds();
    var i;
    var y;

    for (i = 0; i < 3; i++) {
        y = inner.y + 54 + (i * ((inner.height - 108) / 2));
        this.spawnProjectile({
            x: i % 2 === 0 ? inner.x - 150 : inner.x + inner.width + 10,
            y: y,
            width: 140,
            height: 12,
            resource: "Horizontal_Sweep_Attack_T",
            flippedX: i % 2 !== 0,
            vx: i % 2 === 0 ? this.randomRange(5.0, 6.4) : this.randomRange(-6.4, -5.0),
            vy: 0,
            damage: 11,
            life: 150,
            type: "goblin_blade_trap",
            hitboxInsetX: 8,
            hitboxInsetY: 1
        });
    }

    for (i = 0; i < 4; i++) {
        this.spawnProjectile({
            x: inner.x + this.randomRange(40, inner.width - 56),
            y: inner.y - this.randomRange(35, 145),
            width: 16,
            height: 48,
            resource: "Falling_Sword_Attack_T",
            vx: this.randomRange(-0.8, 0.8),
            vy: this.randomRange(6.0, 8.0),
            damage: 10,
            life: 150,
            type: "goblin_falling_sword",
            hitboxInsetX: 3,
            hitboxInsetY: 2
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnGhoulOrbCrawl = function () {
    var inner = this.getArenaInnerBounds();
    var count = 6 + Math.floor(Math.random() * 3);
    var i;
    var fromLeft;

    for (i = 0; i < count; i++) {
        fromLeft = i % 2 === 0;
        this.spawnProjectile({
            x: fromLeft ? inner.x - 24 : inner.x + inner.width + 24,
            y: inner.y + this.randomRange(40, inner.height - 56),
            width: 16,
            height: 16,
            resource: "Orb_Attack_T",
            vx: fromLeft ? this.randomRange(2.4, 3.7) : this.randomRange(-3.7, -2.4),
            vy: this.randomRange(-0.9, 0.9),
            damage: 5,
            life: 180,
            type: "ghoul_orb"
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnGhoulDartAmbush = function () {
    var inner = this.getArenaInnerBounds();
    var side = Math.random() > 0.5 ? -1 : 1;
    var originX = side < 0 ? inner.x - 36 : inner.x + inner.width + 36;
    var i;

    for (i = 0; i < 4; i++) {
        this.spawnProjectile({
            x: originX,
            y: inner.y + 42 + (i * ((inner.height - 84) / 3)),
            width: 32,
            height: 16,
            resource: "Knife_Attack_T",
            flippedX: side < 0 ? false : true,
            vx: side < 0 ? this.randomRange(5.3, 6.7) : this.randomRange(-6.7, -5.3),
            vy: this.randomRange(-0.35, 0.35),
            damage: 6,
            life: 125,
            type: "ghoul_dart"
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnGhoulStompPulse = function () {
    var inner = this.getArenaInnerBounds();
    var count = 5;
    var startX = inner.x + this.randomRange(35, 90);
    var i;

    for (i = 0; i < count; i++) {
        this.spawnProjectile({
            x: startX + (i * ((inner.width - 180) / (count - 1))),
            y: inner.y + inner.height - 16,
            width: 16,
            height: 16,
            resource: "StompWave_Attack_T",
            vx: this.randomRange(-0.5, 0.5),
            vy: this.randomRange(-5.5, -3.8),
            damage: 6,
            life: 72,
            type: "ghoul_stomp"
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnGhoulImpaledSwordDrop = function () {
    var inner = this.getArenaInnerBounds();
    var count = 4 + Math.floor(Math.random() * 3);
    var i;

    for (i = 0; i < count; i++) {
        this.spawnProjectile({
            x: inner.x + this.randomRange(28, inner.width - 44),
            y: inner.y - this.randomRange(25, 165),
            width: 16,
            height: 48,
            resource: "Falling_Sword_Attack_T",
            vx: this.randomRange(-0.6, 0.6),
            vy: this.randomRange(5.2, 7.4),
            damage: 9,
            life: 150,
            type: "ghoul_impaled_sword",
            hitboxInsetX: 3,
            hitboxInsetY: 3
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnGhoulBoneShardSpread = function () {
    var inner = this.getArenaInnerBounds();
    var originX = inner.x + (inner.width / 2);
    var originY = inner.y + 12;
    var count = 7;
    var i;
    var spread;

    for (i = 0; i < count; i++) {
        spread = i - Math.floor(count / 2);
        this.spawnProjectile({
            x: originX,
            y: originY + this.randomRange(-4, 12),
            width: 16,
            height: 8,
            resource: "Bone_Shard_Attack_T",
            vx: spread * 0.95,
            vy: this.randomRange(3.7, 5.4),
            rotation: spread * 8,
            damage: 6,
            life: 140,
            type: "ghoul_bone_shard",
            hitboxInsetX: 2,
            hitboxInsetY: 1
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnGhoulSkullDrift = function () {
    var inner = this.getArenaInnerBounds();
    var count = 4 + Math.floor(Math.random() * 2);
    var i;
    var fromLeft;

    for (i = 0; i < count; i++) {
        fromLeft = i % 2 === 0;
        this.spawnProjectile({
            x: fromLeft ? inner.x - 42 : inner.x + inner.width + 10,
            y: inner.y + this.randomRange(28, inner.height - 62),
            width: 32,
            height: 32,
            resource: "Skull_Attack_T",
            flippedX: !fromLeft,
            vx: fromLeft ? this.randomRange(2.1, 3.2) : this.randomRange(-3.2, -2.1),
            vy: this.randomRange(-0.65, 0.65),
            damage: 7,
            life: 190,
            type: "ghoul_skull_drift",
            hitboxInsetX: 5,
            hitboxInsetY: 5
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnHyDragonFireballBreath = function () {
    var inner = this.getArenaInnerBounds();
    var fromLeft = Math.random() > 0.5;
    var originX = fromLeft ? inner.x - 30 : inner.x + inner.width + 30;
    var originY = inner.y + this.randomRange(32, 116);
    var count = 10;
    var i;
    var angle;
    var speed;

    for (i = 0; i < count; i++) {
        angle = fromLeft ? this.randomRange(-0.28, 0.92) : this.randomRange(2.22, 3.42);
        speed = this.randomRange(3.8, 5.9);
        this.spawnProjectile({
            x: originX,
            y: originY + this.randomRange(-10, 10),
            width: 16,
            height: 16,
            resource: "Fireball_Attack_T",
            flippedX: !fromLeft,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            damage: 10,
            life: 145,
            type: "hydragon_fireball"
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnHyDragonFireWave = function () {
    var inner = this.getArenaInnerBounds();
    var fromLeft = Math.random() > 0.5;
    var count = 4;
    var i;
    var y;

    for (i = 0; i < count; i++) {
        y = inner.y + 38 + (i * ((inner.height - 76) / (count - 1)));
        this.spawnProjectile({
            x: fromLeft ? inner.x - 48 - (i * 18) : inner.x + inner.width + 16 + (i * 18),
            y: y,
            width: 32,
            height: 16,
            resource: "Fire_wave_Attack_T",
            flippedX: !fromLeft,
            vx: fromLeft ? this.randomRange(4.6, 6.0) : this.randomRange(-6.0, -4.6),
            vy: this.randomRange(-0.24, 0.24),
            damage: 11,
            life: 150,
            type: "hydragon_fire_wave",
            hitboxInsetX: 2,
            hitboxInsetY: 2
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnHyDragonOrbBreath = function () {
    var inner = this.getArenaInnerBounds();
    var fromLeft = Math.random() > 0.5;
    var originX = fromLeft ? inner.x - 26 : inner.x + inner.width + 26;
    var originY = inner.y + this.randomRange(44, 100);
    var count = 9;
    var i;
    var angle;
    var speed;

    for (i = 0; i < count; i++) {
        angle = fromLeft ? this.randomRange(-0.45, 0.85) : this.randomRange(2.3, 3.6);
        speed = this.randomRange(3.5, 5.2);
        this.spawnProjectile({
            x: originX,
            y: originY,
            width: 16,
            height: 16,
            resource: "Orb_Attack_T",
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            damage: 9,
            life: 150,
            type: "hydragon_orb"
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnHyDragonSwordStorm = function () {
    var inner = this.getArenaInnerBounds();
    var count = 7 + Math.floor(Math.random() * 4);
    var i;

    for (i = 0; i < count; i++) {
        this.spawnProjectile({
            x: this.randomRange(inner.x, inner.x + inner.width - 16),
            y: inner.y - this.randomRange(30, 190),
            width: 16,
            height: 48,
            resource: "Falling_Sword_Attack_T",
            vx: this.randomRange(-1.1, 1.1),
            vy: this.randomRange(7.3, 10.2),
            damage: 13,
            life: 160,
            type: "hydragon_sword"
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnHyDragonCrossSweep = function () {
    var inner = this.getArenaInnerBounds();
    var horizontalY = inner.y + this.randomRange(62, inner.height - 80);
    var verticalX = inner.x + this.randomRange(90, inner.width - 110);

    this.spawnProjectile({
        x: inner.x - 170,
        y: horizontalY,
        width: 160,
        height: 12,
        resource: "Horizontal_Sweep_Attack_T",
        vx: this.randomRange(6.0, 7.2),
        vy: 0,
        damage: 12,
        life: 150,
        type: "hydragon_horizontal_sweep"
    });

    this.spawnVerticalSweepProjectile({
        x: verticalX,
        y: inner.y - 180,
        collisionWidth: 16,
        collisionHeight: 160,
        spriteWidth: 160,
        spriteHeight: 12,
        resource: "Horizontal_Sweep_Attack_T",
        rotation: 90,
        vx: 0,
        vy: this.randomRange(4.4, 5.4),
        damage: 12,
        life: 130,
        type: "hydragon_vertical_sweep"
    });
};

GraveFallGame.scene.Game.prototype.spawnHyDragonFangFan = function () {
    var inner = this.getArenaInnerBounds();
    var originX = inner.x + (inner.width / 2);
    var originY = inner.y - 24;
    var count = 7;
    var i;
    var spread;

    for (i = 0; i < count; i++) {
        spread = i - Math.floor(count / 2);
        this.spawnProjectile({
            x: originX,
            y: originY,
            width: 32,
            height: 16,
            resource: "Knife_Attack_T",
            vx: spread * 1.15,
            vy: this.randomRange(5.3, 7.1),
            rotation: spread * 9,
            damage: 10,
            life: 120,
            type: "hydragon_fang"
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnPlaceholderSpearCorridor = function () {
    var inner = this.getArenaInnerBounds();
    var lanes = [0.20, 0.38, 0.56, 0.74];
    var i;
    var fromLeft;
    var y;

    for (i = 0; i < lanes.length; i++) {
        fromLeft = i % 2 === 0;
        y = inner.y + Math.round(inner.height * lanes[i]);
        this.spawnProjectile({
            x: fromLeft ? inner.x - 38 - (i * 14) : inner.x + inner.width + 12 + (i * 14),
            y: y,
            width: 26,
            height: 6,
            resource: "Spear_Attack_T",
            flippedX: !fromLeft,
            vx: fromLeft ? this.randomRange(5.0, 6.6) : this.randomRange(-6.6, -5.0),
            vy: this.randomRange(-0.18, 0.18),
            damage: 7,
            life: 140,
            type: "placeholder_spear_corridor",
            hitboxInsetX: 1,
            hitboxInsetY: 0
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnPlaceholderArrowCrossfire = function () {
    var inner = this.getArenaInnerBounds();
    var rows = 5;
    var i;
    var y;

    for (i = 0; i < rows; i++) {
        y = inner.y + 34 + (i * ((inner.height - 68) / (rows - 1)));
        this.spawnProjectile({
            x: inner.x - 34 - (i * 10),
            y: y,
            width: 20,
            height: 6,
            resource: "Arrow_attack_T",
            vx: this.randomRange(4.6, 6.0),
            vy: this.randomRange(-0.12, 0.12),
            damage: 6,
            life: 140,
            type: "placeholder_arrow"
        });
        if (i % 2 === 1) {
            this.spawnProjectile({
                x: inner.x + inner.width + 14 + (i * 10),
                y: y + this.randomRange(-10, 10),
                width: 20,
                height: 6,
                resource: "Arrow_attack_T",
                flippedX: true,
                vx: this.randomRange(-6.0, -4.6),
                vy: this.randomRange(-0.12, 0.12),
                damage: 6,
                life: 140,
                type: "placeholder_arrow"
            });
        }
    }
};

GraveFallGame.scene.Game.prototype.spawnPlaceholderBoneShardArc = function () {
    var inner = this.getArenaInnerBounds();
    var originX = inner.x + (inner.width / 2);
    var originY = inner.y - 10;
    var count = 8;
    var i;
    var spread;

    for (i = 0; i < count; i++) {
        spread = i - ((count - 1) / 2);
        this.spawnProjectile({
            x: originX,
            y: originY,
            width: 16,
            height: 8,
            resource: "Bone_Shard_Attack_T",
            vx: spread * 0.75,
            vy: this.randomRange(4.2, 6.0),
            rotation: spread * 7,
            damage: 6,
            life: 130,
            type: "placeholder_bone_arc",
            hitboxInsetX: 2,
            hitboxInsetY: 1
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnPlaceholderSkullRing = function () {
    var inner = this.getArenaInnerBounds();
    var positions = [
        { x: inner.x - 34, y: inner.y - 34, vx: 2.7, vy: 2.4 },
        { x: inner.x + inner.width + 2, y: inner.y - 34, vx: -2.7, vy: 2.4 },
        { x: inner.x - 34, y: inner.y + inner.height + 2, vx: 2.7, vy: -2.4 },
        { x: inner.x + inner.width + 2, y: inner.y + inner.height + 2, vx: -2.7, vy: -2.4 }
    ];
    var i;

    for (i = 0; i < positions.length; i++) {
        this.spawnProjectile({
            x: positions[i].x,
            y: positions[i].y,
            width: 32,
            height: 32,
            resource: "Skull_Attack_T",
            flippedX: positions[i].vx < 0,
            vx: positions[i].vx + this.randomRange(-0.25, 0.25),
            vy: positions[i].vy + this.randomRange(-0.25, 0.25),
            damage: 8,
            life: 170,
            type: "placeholder_skull_ring",
            hitboxInsetX: 5,
            hitboxInsetY: 5
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnPlaceholderCrystalRain = function () {
    var inner = this.getArenaInnerBounds();
    var count = 7;
    var i;
    var longShard;

    for (i = 0; i < count; i++) {
        longShard = i % 2 === 0;
        this.spawnProjectile({
            x: inner.x + this.randomRange(24, inner.width - 40),
            y: inner.y - this.randomRange(20, 170),
            width: longShard ? 32 : 16,
            height: longShard ? 8 : 12,
            resource: longShard ? "Long_Crystal_Shard_Attack_T" : "Crystal_Shard_Attack_T",
            vx: this.randomRange(-0.5, 0.5),
            vy: this.randomRange(5.0, 7.5),
            rotation: this.randomRange(-18, 18),
            damage: 8,
            life: 150,
            type: "placeholder_crystal_rain",
            hitboxInsetX: 2,
            hitboxInsetY: 1
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnPlaceholderCrystalWall = function () {
    var inner = this.getArenaInnerBounds();
    var fromLeft = Math.random() > 0.5;
    var count = 5;
    var i;
    var y;

    for (i = 0; i < count; i++) {
        y = inner.y + 30 + (i * ((inner.height - 60) / (count - 1)));
        this.spawnProjectile({
            x: fromLeft ? inner.x - 46 - (i * 8) : inner.x + inner.width + 14 + (i * 8),
            y: y,
            width: 32,
            height: 8,
            resource: "Long_Crystal_Shard_Attack_T",
            flippedX: !fromLeft,
            vx: fromLeft ? this.randomRange(3.9, 5.3) : this.randomRange(-5.3, -3.9),
            vy: this.randomRange(-0.16, 0.16),
            damage: 8,
            life: 160,
            type: "placeholder_crystal_wall",
            hitboxInsetX: 2,
            hitboxInsetY: 1
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnPlaceholderOrbSplit = function () {
    var inner = this.getArenaInnerBounds();
    var origins = [
        { x: inner.x + (inner.width * 0.28), y: inner.y - 18 },
        { x: inner.x + (inner.width * 0.72), y: inner.y - 18 }
    ];
    var i;
    var j;
    var angle;
    var speed;

    for (i = 0; i < origins.length; i++) {
        for (j = 0; j < 4; j++) {
            angle = this.randomRange(0.75, 2.35);
            speed = this.randomRange(2.8, 4.4);
            this.spawnProjectile({
                x: origins[i].x,
                y: origins[i].y,
                width: 16,
                height: 16,
                resource: "Orb_Attack_T",
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                damage: 6,
                life: 145,
                type: "placeholder_orb_split"
            });
        }
    }
};

GraveFallGame.scene.Game.prototype.removeProjectileAt = function (index) {
    var projectile = this.projectiles[index];
    if (!projectile) return;
    if (projectile.parent) projectile.parent.removeChild(projectile, true);
    this.projectiles.splice(index, 1);
};

GraveFallGame.scene.Game.prototype.getCollisionBounds = function (object) {
    var insetX = object && typeof object.hitboxInsetX === "number" ? object.hitboxInsetX : 0;
    var insetY = object && typeof object.hitboxInsetY === "number" ? object.hitboxInsetY : 0;
    var width = object ? object.width || 0 : 0;
    var height = object ? object.height || 0 : 0;

    insetX = Math.max(0, Math.min(width / 2, insetX));
    insetY = Math.max(0, Math.min(height / 2, insetY));

    return {
        x: (object ? object.x || 0 : 0) + insetX,
        y: (object ? object.y || 0 : 0) + insetY,
        width: Math.max(0, width - (insetX * 2)),
        height: Math.max(0, height - (insetY * 2))
    };
};

GraveFallGame.scene.Game.prototype.rectsOverlap = function (a, b) {
    var aBounds = this.getCollisionBounds(a);
    var bBounds = this.getCollisionBounds(b);

    return (
        aBounds.x < bBounds.x + bBounds.width &&
        aBounds.x + aBounds.width > bBounds.x &&
        aBounds.y < bBounds.y + bBounds.height &&
        aBounds.y + aBounds.height > bBounds.y
    );
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
    var finalDamage = amount;

    if (playerMenu.isDefending || playerMenu.temporaryDefenseBuff === true) {
        finalDamage = Math.ceil(finalDamage * 0.5);
    }

    if (playerMenu.permanentDefenseBonus > 0) {
        finalDamage = Math.ceil(finalDamage * Math.max(0.5, 1 - (playerMenu.permanentDefenseBonus * 0.08)));
    }

    // --- SCORE TRIGGER: TOOK DAMAGE ---
    if (finalDamage > 0) {
        this.addScorePopup(-(finalDamage * 10), "TOOK DAMAGE");
    }
    // ----------------------------------

    playerMenu.healthCurrent = Math.max(0, playerMenu.healthCurrent - finalDamage);
    this.updatePlayerHealthUi(playerMenu);
    playerMenu.hitCooldown = 12;

    if (finalDamage > 0) {
        this.spawnPlayerDamageParticles(playerMenu, finalDamage);
    }

    this.shakeOnPlayerDamage(finalDamage);

    if (this.phase !== GraveFallGame.scene.Game.PHASE_ACTION) {
        this.updateAllPlayerDamageStates();
    }

    if (playerMenu.healthCurrent <= 0) {
        if (wasAlive) {
            this.playSfx(GraveFallGame.SOUNDS.PLAYER_DOWNED, 0.8);
            
            // --- SCORE TRACKER: ALLY DOWNED ---
            this.encounterAllyDowned = true;
            // ----------------------------------
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

    if (this.isHoldingLeft(playerMenu)) {
        nextX -= speed;
    }

    if (this.isHoldingRight(playerMenu)) {
        nextX += speed;
    }

    if (this.isHoldingUp(playerMenu)) {
        nextY -= speed;
    }

    if (this.isHoldingDown(playerMenu)) {
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
    var itemTypes = ["maxHp", "attack", "defense", "speed"];
    var itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    var item = new rune.display.Sprite(0, 0, 100, 100, this.getItemIconResource(itemType));
    var maxX;
    var maxY;

    item.scaleX = itemScale;
    item.scaleY = itemScale;
    this.applyMonochromeIconColor(item, "#FFFFFF");
    item.buffType = itemType;

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
            this.givePlayerItem(playerMenu, this.arenaItem.buffType || "attack");
            this.spawnItemPickupEffect(playerMenu, this.arenaItem.buffType || "attack", 650);
            this.clearArenaItem();
            this.itemSpawnTimer = Math.floor(this.randomRange(90, 240));
            break;
        }
    }
};

GraveFallGame.scene.Game.prototype.updateActionPhase = function () {
    var enemy = this.getCurrentEnemyConfig();
    var i;

    this.updateActionPromptTimer();

    if (this.actionPhaseStartDelayFrames > 0) {
        this.actionPhaseStartDelayFrames--;

        for (i = 0; i < this.playerMenus.length; i++) {
            this.updateBattleAvatarMovement(this.playerMenus[i]);
            this.updatePlayerHitFlicker(this.playerMenus[i]);
        }

        return;
    }

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