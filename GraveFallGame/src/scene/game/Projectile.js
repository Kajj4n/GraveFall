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
        case "goblin_boss_fuse_bombs": this.spawnGoblinBossFuseBombs(); break;
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
        case "experimental_animated_walkers": this.spawnExperimentalAnimatedWalkers(); break;
        case "experimental_orb_split_chain": this.spawnExperimentalOrbSplitChain(); break;
        case "experimental_bouncing_skulls": this.spawnExperimentalBouncingSkulls(); break;
        case "experimental_bomb_cluster": this.spawnExperimentalBombCluster(); break;
        case "attack_lab_fire_spray": this.spawnAttackLabFireSpray(); break;
        case "attack_lab_homing_wisps": this.spawnAttackLabHomingWisps(); break;
        case "attack_lab_pulse_orbs": this.spawnAttackLabPulseOrbs(); break;
        case "attack_lab_hunter_pack": this.spawnAttackLabHunterPack(); break;
        case "attack_lab_fuse_minefield": this.spawnAttackLabFuseMinefield(); break;
        case "hydragon_fireball_breath": this.spawnHyDragonFireballBreath(); break;
        case "hydragon_fire_wave": this.spawnHyDragonFireWave(); break;
        case "hydragon_orb_breath": this.spawnHyDragonSwordHunt(); break;
        case "hydragon_sword_hunt": this.spawnHyDragonSwordHunt(); break;
        case "hydragon_sword_storm": this.spawnHyDragonSwordStorm(); break;
        case "hydragon_cross_sweep": this.spawnHyDragonCrossSweep(); break;
        case "hydragon_fang_fan": this.spawnHyDragonFangFan(); break;
        case "hydragon_roar_quake": this.spawnHyDragonRoarQuake(); break;
    }
};

GraveFallGame.scene.Game.prototype.spawnBossSwordRain = function () {
    var inner = this.getArenaInnerBounds();
    var count = 5 + Math.floor(Math.random() * 3);
    var i;
    var slowFirst;

    for (i = 0; i < count; i++) {
        slowFirst = i % 2 === 0;
        this.spawnProjectile({
            x: this.randomRange(inner.x, inner.x + inner.width - 16),
            y: inner.y - this.randomRange(35, 190),
            width: 16,
            height: 48,
            resource: "Falling_Sword_Attack_T",
            vx: this.randomRange(-0.7, 0.7),
            vy: this.randomRange(5.9, 8.2),
            damage: 10,
            life: 185,
            startDelay: i * 4,
            drag: slowFirst ? 0.994 : 1.003,
            speedMultiplier: slowFirst ? 1.018 : 0.992,
            speedMultiplierStart: slowFirst ? 44 : 62,
            maxSpeed: 10.5,
            fadeOutFrames: 10,
            type: "falling_blade",
            hitboxInsetX: 3,
            hitboxInsetY: 3
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
    var count = 9 + Math.floor(Math.random() * 4);
    var i;
    var angle;
    var speed;

    for (i = 0; i < count; i++) {
        angle = this.randomRange(0.55, 2.6);
        speed = this.randomRange(2.6, 4.6);

        this.spawnProjectile({
            x: originX,
            y: originY,
            width: 16,
            height: 16,
            resource: "Orb_Attack_T",
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            damage: 7,
            life: 190,
            startDelay: i * 3,
            homingFrames: 34,
            homingDelay: 8,
            homingTurnRate: 0.045,
            homingSpeed: speed + 0.3,
            speedMultiplier: 1.004,
            maxSpeed: 5.5,
            fadeOutFrames: 12,
            type: "orb",
            spin: i % 2 === 0 ? 3 : -3
        });
    }
};
GraveFallGame.scene.Game.prototype.spawnBossDiagonalDrop = function () {
    var inner = this.getArenaInnerBounds();
    var fromLeft = Math.random() > 0.5;
    var count = 5 + Math.floor(Math.random() * 3);
    var i;
    var vx;

    for (i = 0; i < count; i++) {
        vx = fromLeft ? this.randomRange(2.4, 3.7) : this.randomRange(-3.7, -2.4);
        this.spawnProjectile({
            x: fromLeft ? inner.x - this.randomRange(34, 110) : inner.x + inner.width + this.randomRange(34, 110),
            y: inner.y - this.randomRange(26, 140),
            width: 32,
            height: 16,
            resource: "Knife_Attack_T",
            flippedX: !fromLeft,
            vx: vx,
            vy: this.randomRange(4.3, 5.7),
            rotation: fromLeft ? 22 : -22,
            damage: 9,
            life: 165,
            startDelay: i * 5,
            speedMultiplier: 1.009,
            speedMultiplierStart: 42,
            maxSpeed: 7.8,
            fadeOutFrames: 10,
            type: "diagonal_blade",
            hitboxInsetX: 2,
            hitboxInsetY: 2
        });
    }
};
GraveFallGame.scene.Game.prototype.spawnGoblinPebbleRain = function () {
    var inner = this.getArenaInnerBounds();
    var count = 12 + Math.floor(Math.random() * 5);
    var i;

    for (i = 0; i < count; i++) {
        this.spawnProjectile({
            x: this.randomRange(inner.x - 20, inner.x + inner.width + 4),
            y: inner.y - this.randomRange(20, 170),
            width: 16,
            height: 16,
            resource: "Orb_Attack_T",
            vx: this.randomRange(-1.4, 1.4),
            vy: this.randomRange(4.8, 6.6),
            damage: 6,
            life: 155,
            startDelay: i * 2,
            bounce: i % 4 === 0,
            bouncesRemaining: 1,
            speedMultiplier: i % 3 === 0 ? 1.006 : 1,
            maxSpeed: 8.0,
            fadeOutFrames: 10,
            type: "pebble",
            hitboxInsetX: 2,
            hitboxInsetY: 2,
            spin: i % 2 === 0 ? 4 : -4
        });
    }
};
GraveFallGame.scene.Game.prototype.spawnGoblinDartFan = function () {
    var inner = this.getArenaInnerBounds();
    var side = Math.random() > 0.5 ? -1 : 1;
    var originX = side < 0 ? inner.x - 42 : inner.x + inner.width + 42;
    var originY = inner.y + this.randomRange(46, inner.height - 82);
    var i;
    var vy;
    var speed;

    for (i = -3; i <= 3; i++) {
        vy = i * 1.05;
        speed = this.randomRange(5.7, 7.2);
        this.spawnProjectile({
            x: originX,
            y: originY,
            width: 32,
            height: 16,
            resource: "Knife_Attack_T",
            flippedX: side > 0,
            vx: side < 0 ? speed : -speed,
            vy: vy,
            damage: 8,
            life: 150,
            startDelay: (i + 3) * 5,
            speedMultiplier: 1.006,
            speedMultiplierStart: 22,
            maxSpeed: 9.5,
            fadeOutFrames: 8,
            type: "dart",
            hitboxInsetX: 2,
            hitboxInsetY: 2
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
            vx: this.randomRange(-0.9, 0.9),
            vy: this.randomRange(-5.8, -3.8),
            damage: 7,
            life: 105,
            startDelay: i * 4,
            drag: 0.992,
            speedMultiplier: 1.018,
            speedMultiplierStart: 32,
            maxSpeed: 7.4,
            fadeOutFrames: 8,
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
            vy: this.randomRange(-6.5, -4.4),
            damage: 9,
            life: 102,
            startDelay: i * 3,
            speedMultiplier: 1.016,
            speedMultiplierStart: 34,
            maxSpeed: 8.0,
            fadeOutFrames: 8,
            type: "goblin_mace_quake"
        });
    }

    for (i = 0; i < 3; i++) {
        this.spawnProjectile({
            x: inner.x + this.randomRange(80, inner.width - 104),
            y: inner.y - this.randomRange(30, 115),
            width: 24,
            height: 24,
            resource: "Goblin_Walk_Attack_T",
            animation: {
                name: "walk",
                frames: [0, 1, 2],
                framerate: 10,
                looped: true
            },
            vx: this.randomRange(-0.35, 0.35),
            vy: this.randomRange(4.2, 5.7),
            damage: 10,
            life: 145,
            startDelay: i * 10,
            homingFrames: 24,
            homingDelay: 8,
            homingTurnRate: 0.045,
            homingSpeed: 3.8,
            maxSpeed: 5.8,
            type: "goblin_mace_drop_charger",
            hitboxInsetX: 3,
            hitboxInsetY: 3,
            faceVelocity: true,
            faceVelocityOffset: -90
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnGoblinBossSwordPincer = function () {
    var inner = this.getArenaInnerBounds();
    var lanes = [0.22, 0.45, 0.68, 0.82];
    var i;
    var y;
    var leftSpeed;
    var rightSpeed;

    for (i = 0; i < lanes.length; i++) {
        y = inner.y + Math.round(inner.height * lanes[i]) - 12;
        leftSpeed = this.randomRange(4.2, 5.6);
        rightSpeed = this.randomRange(-5.6, -4.2);

        this.spawnProjectile({
            x: inner.x - 44 - (i * 18),
            y: y,
            width: 24,
            height: 24,
            resource: "Goblin_Walk_Attack_T",
            animation: {
                name: "walk",
                frames: [0, 1, 2],
                framerate: 10,
                looped: true
            },
            vx: leftSpeed,
            vy: this.randomRange(-0.22, 0.22),
            damage: 11,
            life: 190,
            startDelay: i * 7,
            speedMultiplier: 1.008,
            speedMultiplierStart: 34,
            maxSpeed: 7.0,
            type: "goblin_sword_pincer",
            hitboxInsetX: 3,
            hitboxInsetY: 3,
            faceVelocity: true,
            faceVelocityOffset: -90
        });

        if (i % 2 === 0) {
            this.spawnProjectile({
                x: inner.x + inner.width + 20 + (i * 16),
                y: y + this.randomRange(-10, 10),
                width: 24,
                height: 24,
                resource: "Goblin_Walk_Attack_T",
                animation: {
                    name: "walk",
                    frames: [0, 1, 2],
                    framerate: 10,
                    looped: true
                },
                vx: rightSpeed,
                vy: this.randomRange(-0.22, 0.22),
                damage: 11,
                life: 190,
                startDelay: i * 7,
                speedMultiplier: 1.008,
                speedMultiplierStart: 34,
                maxSpeed: 7.0,
                type: "goblin_sword_pincer",
                hitboxInsetX: 3,
                hitboxInsetY: 3,
                faceVelocity: true,
                faceVelocityOffset: -90
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
            x: fromLeft ? inner.x - this.randomRange(24, 90) : inner.x + inner.width + this.randomRange(24, 90),
            y: inner.y - this.randomRange(20, 110),
            width: 16,
            height: 16,
            resource: "Goblin_Head_Attack_T",
            flippedX: !fromLeft,
            vx: fromLeft ? this.randomRange(2.3, 3.8) : this.randomRange(-3.8, -2.3),
            vy: this.randomRange(3.8, 5.8),
            rotation: fromLeft ? this.randomRange(12, 28) : this.randomRange(-28, -12),
            damage: 8,
            life: 210,
            startDelay: i * 4,
            bounce: true,
            bouncesRemaining: 2,
            speedMultiplier: 1.006,
            speedMultiplierStart: 35,
            maxSpeed: 6.8,
            type: "goblin_bouncing_head",
            spin: fromLeft ? 6 : -6
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnGoblinBossMobCharge = function () {
    var inner = this.getArenaInnerBounds();
    var lanes = [0.18, 0.36, 0.54, 0.72, 0.88];
    var i;
    var x;
    var fromTop;
    var vy;

    for (i = 0; i < lanes.length; i++) {
        fromTop = i % 2 === 0;
        x = inner.x + Math.round(inner.width * lanes[i]) - 12;
        vy = fromTop ? this.randomRange(2.2, 2.9) : this.randomRange(-2.9, -2.2);

        this.spawnProjectile({
            x: x,
            y: fromTop ? inner.y - 50 - (i * 10) : inner.y + inner.height + 20 + (i * 10),
            width: 24,
            height: 24,
            resource: "Goblin_Walk_Attack_T",
            animation: {
                name: "walk",
                frames: [0, 1, 2],
                framerate: 10,
                looped: true
            },
            vx: this.randomRange(-0.45, 0.45),
            vy: vy,
            damage: i === 0 ? 13 : 10,
            life: 315,
            startDelay: i * 10,
            homingFrames: 44,
            homingDelay: 10,
            homingTurnRate: 0.055,
            homingSpeed: 3.1,
            drag: 1.002,
            maxSpeed: 4.0,
            type: "goblin_hunter_pack",
            hitboxInsetX: 3,
            hitboxInsetY: 3,
            faceVelocity: true,
            faceVelocityOffset: -90
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnGoblinBossBladeTrap = function () {
    var inner = this.getArenaInnerBounds();
    var i;
    var y;
    var fromLeft;

    for (i = 0; i < 4; i++) {
        y = inner.y + 38 + (i * ((inner.height - 76) / 3));
        fromLeft = i % 2 === 0;
        this.spawnProjectile({
            x: fromLeft ? inner.x - 150 - (i * 14) : inner.x + inner.width + 10 + (i * 14),
            y: y,
            width: 140,
            height: 12,
            resource: "Horizontal_Sweep_Attack_T",
            flippedX: !fromLeft,
            vx: fromLeft ? this.randomRange(4.2, 5.6) : this.randomRange(-5.6, -4.2),
            vy: this.randomRange(-0.08, 0.08),
            damage: 11,
            life: 190,
            startDelay: i * 9,
            speedMultiplier: 1.004,
            maxSpeed: 6.2,
            type: "goblin_blade_trap",
            hitboxInsetX: 8,
            hitboxInsetY: 1
        });
    }

    for (i = 0; i < 5; i++) {
        this.spawnProjectile({
            x: inner.x + this.randomRange(40, inner.width - 56),
            y: inner.y - this.randomRange(35, 165),
            width: 16,
            height: 48,
            resource: "Falling_Sword_Attack_T",
            vx: this.randomRange(-0.7, 0.7),
            vy: this.randomRange(5.4, 7.2),
            damage: 10,
            life: 175,
            startDelay: i * 5,
            drag: 0.995,
            speedMultiplier: 1.012,
            speedMultiplierStart: 52,
            maxSpeed: 8.5,
            type: "goblin_falling_sword",
            hitboxInsetX: 3,
            hitboxInsetY: 2
        });
    }
};
GraveFallGame.scene.Game.prototype.spawnGhoulOrbCrawl = function () {
    var inner = this.getArenaInnerBounds();
    var count = 7 + Math.floor(Math.random() * 2);
    var centerX = inner.x + (inner.width / 2);
    var centerY = inner.y + (inner.height / 2);
    var margin = 34;
    var i;
    var side;
    var x;
    var y;
    var dx;
    var dy;
    var distance;
    var speed;

    // Slow soul lights now creep in from outside the arena, briefly pull toward
    // the party, then drift onward with a pulsing speed so the ghoul feels eerie
    // instead of just firing a straight line.
    for (i = 0; i < count; i++) {
        side = i % 4;

        if (side === 0) {
            x = inner.x - margin - this.randomRange(0, 26);
            y = inner.y + this.randomRange(32, inner.height - 48);
        } else if (side === 1) {
            x = inner.x + inner.width + margin + this.randomRange(0, 26);
            y = inner.y + this.randomRange(32, inner.height - 48);
        } else if (side === 2) {
            x = inner.x + this.randomRange(32, inner.width - 48);
            y = inner.y - margin - this.randomRange(0, 26);
        } else {
            x = inner.x + this.randomRange(32, inner.width - 48);
            y = inner.y + inner.height + margin + this.randomRange(0, 26);
        }

        dx = centerX - x;
        dy = centerY - y;
        distance = Math.sqrt((dx * dx) + (dy * dy)) || 1;
        speed = this.randomRange(1.35, 2.05);

        this.spawnProjectile({
            x: x - 8,
            y: y - 8,
            width: 16,
            height: 16,
            resource: "Orb_Attack_T",
            vx: (dx / distance) * speed,
            vy: (dy / distance) * speed,
            damage: 5,
            life: 240,
            startDelay: i * 7,
            homingFrames: 44,
            homingDelay: 8,
            homingTurnRate: 0.055,
            homingSpeed: 2.15,
            drag: 1.001,
            maxSpeed: 3.1,
            pulseSpeedAmplitude: 0.28,
            pulseSpeedFrequency: 0.13,
            pulseSpeedPhase: i * 0.85,
            fadeOutFrames: 18,
            type: "ghoul_soul_crawl",
            hitboxInsetX: 2,
            hitboxInsetY: 2,
            spin: i % 2 === 0 ? 2 : -2
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnGhoulDartAmbush = function () {
    var inner = this.getArenaInnerBounds();
    var side = Math.random() > 0.5 ? -1 : 1;
    var originX = side < 0 ? inner.x - 42 : inner.x + inner.width + 22;
    var rows = 5;
    var i;
    var y;

    // Staggered, accelerating ambush knives: the first gaps are readable, then
    // the pattern tightens and asks players to move lanes rather than stand still.
    for (i = 0; i < rows; i++) {
        y = inner.y + 34 + (i * ((inner.height - 68) / (rows - 1)));
        this.spawnProjectile({
            x: originX - (side > 0 ? 32 : 0),
            y: y + this.randomRange(-8, 8),
            width: 32,
            height: 16,
            resource: "Knife_Attack_T",
            flippedX: side > 0,
            vx: side < 0 ? this.randomRange(4.5, 5.6) : this.randomRange(-5.6, -4.5),
            vy: this.randomRange(-0.55, 0.55),
            damage: 6,
            life: 170,
            startDelay: i * 9,
            speedMultiplier: 1.012,
            speedMultiplierStart: 28,
            maxSpeed: 7.4,
            fadeOutFrames: 10,
            type: "ghoul_dart_ambush",
            hitboxInsetX: 2,
            hitboxInsetY: 1
        });

        if (i % 2 === 0) {
            this.spawnProjectile({
                x: side < 0 ? inner.x + inner.width + 22 : inner.x - 42,
                y: y + this.randomRange(-12, 12),
                width: 32,
                height: 16,
                resource: "Knife_Attack_T",
                flippedX: side < 0,
                vx: side < 0 ? this.randomRange(-5.2, -4.2) : this.randomRange(4.2, 5.2),
                vy: this.randomRange(-0.35, 0.35),
                damage: 6,
                life: 160,
                startDelay: 14 + (i * 9),
                speedMultiplier: 1.009,
                speedMultiplierStart: 28,
                maxSpeed: 6.8,
                fadeOutFrames: 10,
                type: "ghoul_counter_dart",
                hitboxInsetX: 2,
                hitboxInsetY: 1
            });
        }
    }
};

GraveFallGame.scene.Game.prototype.spawnGhoulStompPulse = function () {
    var inner = this.getArenaInnerBounds();
    var count = 6;
    var startX = inner.x + this.randomRange(32, 78);
    var i;

    for (i = 0; i < count; i++) {
        this.spawnProjectile({
            x: startX + (i * ((inner.width - 156) / (count - 1))),
            y: inner.y + inner.height - 16,
            width: 16,
            height: 16,
            resource: "StompWave_Attack_T",
            vx: this.randomRange(-0.55, 0.55),
            vy: this.randomRange(-5.9, -4.1),
            damage: 6,
            life: 96,
            startDelay: i * 5,
            drag: 0.996,
            speedMultiplier: 1.018,
            speedMultiplierStart: 34,
            maxSpeed: 7.2,
            fadeOutFrames: 8,
            type: "ghoul_stomp_pulse"
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnGhoulImpaledSwordDrop = function () {
    var inner = this.getArenaInnerBounds();
    var count = 5 + Math.floor(Math.random() * 2);
    var i;

    for (i = 0; i < count; i++) {
        this.spawnProjectile({
            x: inner.x + this.randomRange(28, inner.width - 44),
            y: inner.y - this.randomRange(35, 185),
            width: 16,
            height: 48,
            resource: "Falling_Sword_Attack_T",
            vx: this.randomRange(-0.45, 0.45),
            vy: this.randomRange(3.9, 5.6),
            damage: 9,
            life: 185,
            startDelay: i * 8,
            speedMultiplier: 1.017,
            speedMultiplierStart: 24,
            maxSpeed: 9.4,
            fadeOutFrames: 10,
            type: "crypt_impaled_sword",
            hitboxInsetX: 3,
            hitboxInsetY: 3
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnGhoulBoneShardSpread = function () {
    var inner = this.getArenaInnerBounds();
    var originX = inner.x + (inner.width / 2);
    var originY = inner.y + 8;
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
            vx: spread * 0.9,
            vy: this.randomRange(3.4, 4.8),
            rotation: spread * 8,
            damage: 6,
            life: 165,
            startDelay: Math.abs(spread) * 4,
            swayAmplitude: 0.45,
            swayFrequency: 0.15,
            swayPhase: i * 0.5,
            fadeOutFrames: 12,
            type: "bonecaller_bone_shard",
            hitboxInsetX: 2,
            hitboxInsetY: 1,
            spin: spread === 0 ? 0 : (spread > 0 ? 3 : -3)
        });
    }

    this.spawnProjectile({
        x: originX - 10,
        y: inner.y - 28,
        width: 20,
        height: 20,
        resource: "Orb_Attack_T",
        vx: this.randomRange(-0.35, 0.35),
        vy: this.randomRange(1.6, 2.2),
        damage: 6,
        life: 210,
        splitAt: 142,
        splitCount: 8,
        splitSpeed: 2.85,
        splitLife: 185,
        splitDamage: 4,
        splitResource: "Bone_Shard_Attack_T",
        splitWidth: 16,
        splitHeight: 8,
        splitRemoveParent: true,
        type: "bonecaller_split_core",
        spin: 3
    });
};

GraveFallGame.scene.Game.prototype.spawnGhoulSkullDrift = function () {
    var inner = this.getArenaInnerBounds();
    var count = 4 + Math.floor(Math.random() * 2);
    var i;
    var fromLeft;
    var speed;

    for (i = 0; i < count; i++) {
        fromLeft = i % 2 === 0;
        speed = this.randomRange(2.3, 3.2);
        this.spawnProjectile({
            x: fromLeft ? inner.x - 52 - (i * 8) : inner.x + inner.width + 20 + (i * 8),
            y: inner.y + this.randomRange(28, inner.height - 62),
            width: 32,
            height: 32,
            resource: "Skull_Attack_T",
            flippedX: !fromLeft,
            vx: fromLeft ? speed : -speed,
            vy: this.randomRange(-1.15, 1.15),
            damage: 7,
            life: 330,
            bounce: true,
            bouncesRemaining: 8,
            speedMultiplier: 1.002,
            maxSpeed: 4.1,
            type: "ghoul_bouncing_skull",
            hitboxInsetX: 4,
            hitboxInsetY: 4,
            spin: fromLeft ? 4 : -4
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnHyDragonFireballBreath = function () {
    var inner = this.getArenaInnerBounds();
    var fromLeft = Math.random() > 0.5;
    var originX = fromLeft ? inner.x - 38 : inner.x + inner.width + 14;
    var originY = inner.y + this.randomRange(58, inner.height - 118);
    var sweepDirection = Math.random() > 0.5 ? 1 : -1;
    var count = 34;
    var i;
    var sweep;
    var angle;
    var speed;

    // Real HyDragon breath now uses the successful lab flamethrower idea:
    // many small fireballs, delayed into a spray, with no oversized wave sprites.
    for (i = 0; i < count; i++) {
        sweep = ((i / (count - 1)) - 0.5) * 1.25 * sweepDirection;
        angle = fromLeft ? sweep : Math.PI - sweep;
        speed = this.randomRange(3.15, 4.55) + (i * 0.02);

        this.spawnProjectile({
            x: originX,
            y: originY + (Math.sin(i * 0.58) * 18),
            width: 18,
            height: 18,
            resource: "Fireball_Attack_T",
            flippedX: !fromLeft,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            damage: 9,
            life: 145,
            startDelay: i * 3,
            speedMultiplier: 1.004,
            speedMultiplierStart: 10,
            maxSpeed: 6.4,
            drag: 0.998,
            fadeOutFrames: 20,
            type: "hydragon_fire_spray",
            hitboxInsetX: 3,
            hitboxInsetY: 3,
            spin: fromLeft ? 4 : -4
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnHyDragonFireWave = function () {
    var inner = this.getArenaInnerBounds();
    var centerX = inner.x + (inner.width / 2);
    var count = 5;
    var i;
    var fromTop;
    var x;
    var speed;

    // The larger wave sprite is no longer a left/right sweep. HyDragon now drops
    // a central vertical fire curtain: waves move up/down through the middle so
    // they pair better with side flame breath.
    for (i = 0; i < count; i++) {
        fromTop = i % 2 === 0;
        x = centerX - 16 + ((i - Math.floor(count / 2)) * 30);
        speed = this.randomRange(4.6, 5.9);

        this.spawnProjectile({
            x: x,
            y: fromTop ? inner.y - 40 - (i * 8) : inner.y + inner.height + 24 + (i * 8),
            width: 32,
            height: 16,
            resource: "Fire_wave_Attack_T",
            flippedX: !fromTop,
            rotation: fromTop ? 90 : -90,
            vx: this.randomRange(-0.22, 0.22),
            vy: fromTop ? speed : -speed,
            damage: 11,
            life: 190,
            startDelay: i * 8,
            speedMultiplier: 1.006,
            speedMultiplierStart: 28,
            maxSpeed: 7.2,
            swayAmplitude: 1.4,
            swayFrequency: 0.18,
            swayPhase: i * 0.8,
            swayAxis: "x",
            fadeOutFrames: 14,
            type: "hydragon_fire_wave_vertical",
            hitboxInsetX: 2,
            hitboxInsetY: 2
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnHyDragonOrbBreath = function () {
    this.spawnHyDragonSwordHunt();
};

GraveFallGame.scene.Game.prototype.spawnHyDragonSwordHunt = function () {
    var inner = this.getArenaInnerBounds();
    var count = 8;
    var centerX = inner.x + (inner.width / 2);
    var centerY = inner.y + (inner.height / 2);
    var i;
    var side;
    var x;
    var y;
    var dx;
    var dy;
    var distance;
    var speed;

    // Replaces the homing orb breath with sword-oriented pressure. These blades
    // enter from outside, actively chase for longer than the old orbs, then keep
    // their committed path so the attack remains readable.
    for (i = 0; i < count; i++) {
        side = i % 4;
        if (side === 0) {
            x = inner.x - 48;
            y = inner.y + this.randomRange(36, inner.height - 74);
        } else if (side === 1) {
            x = inner.x + inner.width + 32;
            y = inner.y + this.randomRange(36, inner.height - 74);
        } else if (side === 2) {
            x = inner.x + this.randomRange(50, inner.width - 66);
            y = inner.y - 74;
        } else {
            x = inner.x + this.randomRange(50, inner.width - 66);
            y = inner.y + inner.height + 30;
        }

        dx = centerX - x;
        dy = centerY - y;
        distance = Math.sqrt((dx * dx) + (dy * dy)) || 1;
        speed = this.randomRange(2.6, 3.35);

        this.spawnProjectile({
            x: x,
            y: y,
            width: 16,
            height: 48,
            resource: "Falling_Sword_Attack_T",
            vx: (dx / distance) * speed,
            vy: (dy / distance) * speed,
            damage: 12,
            life: 245,
            startDelay: i * 7,
            homingFrames: 72,
            homingDelay: 6,
            homingTurnRate: 0.105,
            homingSpeed: 4.75,
            drag: 1.001,
            maxSpeed: 6.8,
            pulseSpeedAmplitude: 0.28,
            pulseSpeedFrequency: 0.12,
            pulseSpeedPhase: i * 0.8,
            fadeOutFrames: 14,
            type: "hydragon_sword_hunt",
            hitboxInsetX: 3,
            hitboxInsetY: 3,
            faceVelocity: true,
            faceVelocityOffset: -90
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnHyDragonSwordStorm = function () {
    var inner = this.getArenaInnerBounds();
    var count = 7 + Math.floor(Math.random() * 4);
    var i;
    var slowFirst;

    for (i = 0; i < count; i++) {
        slowFirst = i % 2 === 0;
        this.spawnProjectile({
            x: this.randomRange(inner.x, inner.x + inner.width - 16),
            y: inner.y - this.randomRange(40, 210),
            width: 16,
            height: 48,
            resource: "Falling_Sword_Attack_T",
            vx: this.randomRange(-0.9, 0.9),
            vy: slowFirst ? this.randomRange(3.4, 4.8) : this.randomRange(6.8, 8.6),
            damage: 13,
            life: 190,
            startDelay: i * 4,
            speedMultiplier: slowFirst ? 1.025 : 0.992,
            speedMultiplierStart: slowFirst ? 36 : 28,
            minSpeed: 3.2,
            maxSpeed: 10.4,
            fadeOutFrames: 12,
            type: "hydragon_sword_storm",
            hitboxInsetX: 3,
            hitboxInsetY: 3
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnHyDragonCrossSweep = function () {
    var inner = this.getArenaInnerBounds();
    var horizontalY = inner.y + this.randomRange(58, inner.height - 76);
    var verticalX = inner.x + this.randomRange(80, inner.width - 100);

    this.spawnProjectile({
        x: inner.x - 170,
        y: horizontalY,
        width: 160,
        height: 12,
        resource: "Horizontal_Sweep_Attack_T",
        vx: this.randomRange(5.0, 6.3),
        vy: this.randomRange(-0.12, 0.12),
        damage: 12,
        life: 180,
        speedMultiplier: 1.004,
        maxSpeed: 7.0,
        type: "hydragon_horizontal_sweep",
        hitboxInsetX: 8,
        hitboxInsetY: 1
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
        vy: this.randomRange(4.2, 5.2),
        damage: 12,
        life: 150,
        type: "hydragon_vertical_sweep"
    });
};
GraveFallGame.scene.Game.prototype.spawnHyDragonFangFan = function () {
    var inner = this.getArenaInnerBounds();
    var originX = inner.x + (inner.width / 2);
    var originY = inner.y - 28;
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
            vx: spread * 1.05,
            vy: this.randomRange(4.8, 6.0),
            rotation: spread * 9,
            damage: 10,
            life: 155,
            startDelay: Math.abs(spread) * 4,
            homingFrames: 26,
            homingDelay: 8,
            homingTurnRate: 0.045,
            homingSpeed: 5.5,
            maxSpeed: 7.4,
            fadeOutFrames: 10,
            type: "hydragon_fang_hunt",
            hitboxInsetX: 2,
            hitboxInsetY: 1
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnHyDragonRoarQuake = function () {
    var inner = this.getArenaInnerBounds();
    var stompCount = 9;
    var swordCount = 9;
    var i;
    var x;
    var slowFirst;

    // A roar pattern: immediate shake, floor shockwaves, then ceiling blades
    // dropping while the screen is still unsettled.
    this.playSfx(GraveFallGame.SOUNDS.ATTACK_STOMP, 0.9);
    this.shakeCamera(380, 13, 10, true);

    for (i = 0; i < stompCount; i++) {
        x = inner.x + 24 + (i * ((inner.width - 48) / (stompCount - 1)));
        this.spawnProjectile({
            x: x,
            y: inner.y + inner.height - 16,
            width: 16,
            height: 16,
            resource: "StompWave_Attack_T",
            vx: (i - Math.floor(stompCount / 2)) * 0.18,
            vy: this.randomRange(-6.8, -5.0),
            damage: 8,
            life: 112,
            startDelay: i * 2,
            speedMultiplier: 1.014,
            speedMultiplierStart: 24,
            maxSpeed: 8.4,
            fadeOutFrames: 10,
            type: "hydragon_roar_stomp_wave",
            hitboxInsetX: 2,
            hitboxInsetY: 2
        });
    }

    for (i = 0; i < swordCount; i++) {
        slowFirst = i % 2 === 0;
        this.spawnProjectile({
            x: inner.x + this.randomRange(20, inner.width - 36),
            y: inner.y - this.randomRange(80, 240),
            width: 16,
            height: 48,
            resource: "Falling_Sword_Attack_T",
            vx: this.randomRange(-0.85, 0.85),
            vy: slowFirst ? this.randomRange(3.2, 4.5) : this.randomRange(6.5, 8.1),
            damage: 12,
            life: 205,
            startDelay: 18 + (i * 5),
            speedMultiplier: slowFirst ? 1.026 : 0.995,
            speedMultiplierStart: slowFirst ? 34 : 20,
            minSpeed: 3.1,
            maxSpeed: 10.0,
            fadeOutFrames: 12,
            type: "hydragon_roar_ceiling_sword",
            hitboxInsetX: 3,
            hitboxInsetY: 3
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnPlaceholderSpearCorridor = function () {
    var inner = this.getArenaInnerBounds();
    var lanes = [0.18, 0.34, 0.50, 0.66, 0.82];
    var i;
    var fromLeft;
    var y;

    for (i = 0; i < lanes.length; i++) {
        fromLeft = i % 2 === 0;
        y = inner.y + Math.round(inner.height * lanes[i]);
        this.spawnProjectile({
            x: fromLeft ? inner.x - 46 - (i * 12) : inner.x + inner.width + 18 + (i * 12),
            y: y,
            width: 26,
            height: 6,
            resource: "Spear_Attack_T",
            flippedX: !fromLeft,
            vx: fromLeft ? this.randomRange(4.0, 5.2) : this.randomRange(-5.2, -4.0),
            vy: this.randomRange(-0.16, 0.16),
            damage: 7,
            life: 180,
            startDelay: i * 8,
            speedMultiplier: 1.014,
            speedMultiplierStart: 30,
            maxSpeed: 7.8,
            fadeOutFrames: 10,
            type: "crypt_spear_corridor",
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
            x: inner.x - 36 - (i * 10),
            y: y,
            width: 20,
            height: 6,
            resource: "Arrow_attack_T",
            vx: this.randomRange(4.4, 5.7),
            vy: this.randomRange(-0.16, 0.16),
            damage: 6,
            life: 170,
            startDelay: i * 7,
            speedMultiplier: 1.006,
            speedMultiplierStart: 40,
            maxSpeed: 6.8,
            type: "crypt_arrow_crossfire"
        });
        this.spawnProjectile({
            x: inner.x + inner.width + 16 + (i * 10),
            y: y + this.randomRange(-12, 12),
            width: 20,
            height: 6,
            resource: "Arrow_attack_T",
            flippedX: true,
            vx: this.randomRange(-5.7, -4.4),
            vy: this.randomRange(-0.16, 0.16),
            damage: 6,
            life: 170,
            startDelay: 10 + (i * 7),
            speedMultiplier: 1.006,
            speedMultiplierStart: 40,
            maxSpeed: 6.8,
            type: "crypt_arrow_crossfire"
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnPlaceholderBoneShardArc = function () {
    var inner = this.getArenaInnerBounds();
    var originX = inner.x + (inner.width / 2);
    var originY = inner.y - 12;
    var count = 9;
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
            vx: spread * 0.72,
            vy: this.randomRange(3.7, 5.2),
            rotation: spread * 7,
            damage: 6,
            life: 160,
            startDelay: Math.abs(spread) * 3,
            swayAmplitude: 0.35,
            swayFrequency: 0.13,
            swayPhase: i * 0.6,
            fadeOutFrames: 10,
            type: "bonecaller_shard_arc",
            hitboxInsetX: 2,
            hitboxInsetY: 1,
            spin: spread > 0 ? 3 : (spread < 0 ? -3 : 0)
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnPlaceholderSkullRing = function () {
    var inner = this.getArenaInnerBounds();
    var positions = [
        { x: inner.x - 54, y: inner.y + 30, vx: 3.9, vy: 5.3 },
        { x: inner.x + inner.width + 22, y: inner.y + 52, vx: -3.9, vy: -5.1 },
        { x: inner.x - 58, y: inner.y + inner.height - 64, vx: 4.2, vy: -5.4 },
        { x: inner.x + inner.width + 26, y: inner.y + inner.height - 36, vx: -4.2, vy: 5.2 },
        { x: inner.x + (inner.width * 0.22), y: inner.y - 54, vx: 2.2, vy: 5.8 },
        { x: inner.x + (inner.width * 0.78), y: inner.y + inner.height + 22, vx: -2.2, vy: -5.8 }
    ];
    var i;

    // Bone Caller should feel like it is throwing loose skulls into a haunted
    // pinball machine: faster, more vertical travel, and enough bounces that
    // the arena keeps changing after the first dodge.
    for (i = 0; i < positions.length; i++) {
        this.spawnProjectile({
            x: positions[i].x,
            y: positions[i].y,
            width: 32,
            height: 32,
            resource: "Skull_Attack_T",
            flippedX: positions[i].vx < 0,
            vx: positions[i].vx + this.randomRange(-0.35, 0.35),
            vy: positions[i].vy + this.randomRange(-0.45, 0.45),
            damage: 8,
            life: 380,
            startDelay: i * 5,
            bounce: true,
            bouncesRemaining: 16,
            speedMultiplier: 1.002,
            speedMultiplierStart: 36,
            maxSpeed: 6.6,
            pulseSpeedAmplitude: 0.35,
            pulseSpeedFrequency: 0.11,
            pulseSpeedPhase: i * 0.7,
            fadeOutFrames: 16,
            type: "bonecaller_bouncing_skull",
            hitboxInsetX: 4,
            hitboxInsetY: 4,
            spin: i % 2 === 0 ? 6 : -6
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnPlaceholderCrystalRain = function () {
    var inner = this.getArenaInnerBounds();
    var lanes = [0.12, 0.27, 0.42, 0.58, 0.73, 0.88];
    var fromTop = Math.random() > 0.5;
    var i;
    var x;
    var longShard;
    var slowFirst;

    for (i = 0; i < lanes.length; i++) {
        x = inner.x + Math.round(inner.width * lanes[i]) - 10;
        longShard = i % 2 === 0;
        slowFirst = i % 2 === 0;

        this.spawnProjectile({
            x: x,
            y: fromTop ? inner.y - 42 - (i * 12) : inner.y + inner.height + 14 + (i * 12),
            width: longShard ? 32 : 18,
            height: longShard ? 8 : 18,
            resource: longShard ? "Long_Crystal_Shard_Attack_T" : "Crystal_Shard_Attack_T",
            vx: this.randomRange(-0.28, 0.28),
            vy: fromTop ? this.randomRange(2.0, 2.8) : this.randomRange(-2.8, -2.0),
            rotation: this.randomRange(-18, 18),
            damage: 8,
            life: 260,
            startDelay: i * 8,
            drag: slowFirst ? 0.990 : 1.007,
            speedMultiplier: slowFirst ? 1.025 : 0.985,
            speedMultiplierStart: slowFirst ? 58 : 70,
            minSpeed: 0.7,
            maxSpeed: 6.5,
            swayAmplitude: 0.9,
            swayFrequency: 0.18,
            swayPhase: i * 0.5,
            swayAxis: "x",
            fadeOutFrames: 14,
            type: "crystal_husk_pulse_shard",
            hitboxInsetX: 2,
            hitboxInsetY: 1,
            spin: slowFirst ? 5 : -5
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnPlaceholderCrystalWall = function () {
    var inner = this.getArenaInnerBounds();
    var fromLeft = Math.random() > 0.5;
    var count = 6;
    var i;
    var y;
    var speed;

    // The Crystal Husk wall is now its signature pressure pattern: faster lanes
    // that swing hard up/down, making the party weave instead of standing in one
    // safe lane.
    for (i = 0; i < count; i++) {
        y = inner.y + 24 + (i * ((inner.height - 48) / (count - 1)));
        speed = this.randomRange(5.4, 6.9);

        this.spawnProjectile({
            x: fromLeft ? inner.x - 56 - (i * 8) : inner.x + inner.width + 24 + (i * 8),
            y: y,
            width: 32,
            height: 8,
            resource: "Long_Crystal_Shard_Attack_T",
            flippedX: !fromLeft,
            vx: fromLeft ? speed : -speed,
            vy: this.randomRange(-0.32, 0.32),
            damage: 8,
            life: 190,
            startDelay: i * 5,
            pulseSpeedAmplitude: 0.65,
            pulseSpeedFrequency: 0.17,
            pulseSpeedPhase: i * 0.65,
            swayAmplitude: 2.35,
            swayFrequency: 0.23,
            swayPhase: i * 0.75,
            swayAxis: "y",
            maxSpeed: 8.2,
            fadeOutFrames: 12,
            type: "crystal_husk_wall",
            hitboxInsetX: 2,
            hitboxInsetY: 1,
            spin: fromLeft ? 3 : -3
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnPlaceholderOrbSplit = function () {
    var inner = this.getArenaInnerBounds();
    var origins = [
        { x: inner.x + (inner.width * 0.26), y: inner.y - 24 },
        { x: inner.x + (inner.width * 0.74), y: inner.y - 24 }
    ];
    var i;

    for (i = 0; i < origins.length; i++) {
        this.spawnProjectile({
            x: origins[i].x - 10,
            y: origins[i].y,
            width: 20,
            height: 20,
            resource: "Crystal_Shard_Attack_T",
            vx: this.randomRange(-0.45, 0.45),
            vy: this.randomRange(1.8, 2.45),
            damage: 8,
            life: 240,
            startDelay: i * 18,
            splitAt: 155 - (i * 10),
            splitCount: 8,
            splitSpeed: 3.0,
            splitLife: 190,
            splitDamage: 5,
            splitResource: "Crystal_Shard_Attack_T",
            splitWidth: 16,
            splitHeight: 16,
            splitRemoveParent: true,
            drag: 1.003,
            maxSpeed: 4.2,
            type: "crystal_husk_split_prism",
            hitboxInsetX: 2,
            hitboxInsetY: 2,
            spin: i % 2 === 0 ? 4 : -4
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnExperimentalAnimatedWalkers = function () {
    var inner = this.getArenaInnerBounds();
    var lanes = [0.16, 0.34, 0.52, 0.70, 0.88];
    var i;
    var speed;
    var x;

    // The placeholder goblin walk frames face downward, so these test walkers
    // enter from above and walk down through the arena instead of sliding sideways.
    for (i = 0; i < lanes.length; i++) {
        speed = this.randomRange(2.2, 3.1);
        x = inner.x + Math.round(inner.width * lanes[i]) - 12;

        this.spawnProjectile({
            x: x,
            y: inner.y - 44 - (i * 18),
            width: 24,
            height: 24,
            resource: "Goblin_Walk_Attack_T",
            animation: {
                name: "walk",
                frames: [0, 1, 2],
                framerate: 10,
                looped: true
            },
            vx: this.randomRange(-0.12, 0.12),
            vy: speed,
            damage: 8,
            life: 330,
            type: "experimental_animated_walker",
            hitboxInsetX: 2,
            hitboxInsetY: 2
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnExperimentalOrbSplitChain = function () {
    var inner = this.getArenaInnerBounds();
    var count = 3;
    var i;
    var originX;

    for (i = 0; i < count; i++) {
        originX = inner.x + 90 + (i * ((inner.width - 180) / (count - 1)));

        this.spawnProjectile({
            x: originX - 12,
            y: inner.y - 36 - (i * 20),
            width: 24,
            height: 24,
            resource: "Orb_Attack_T",
            vx: this.randomRange(-0.55, 0.55),
            vy: this.randomRange(1.7, 2.35),
            damage: 9,
            life: 285,
            splitAt: 190 - (i * 18),
            splitCount: 7,
            splitSpeed: 3.2 + (i * 0.18),
            splitLife: 230,
            splitDamage: 5,
            splitResource: "Orb_Attack_T",
            splitWidth: 16,
            splitHeight: 16,
            splitRemoveParent: true,
            type: "experimental_orb_split_parent",
            spin: i % 2 === 0 ? 3 : -3
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnExperimentalBouncingSkulls = function () {
    var inner = this.getArenaInnerBounds();
    var count = 4;
    var i;
    var side;
    var speed;
    var x;
    var y;
    var vx;
    var vy;

    for (i = 0; i < count; i++) {
        side = i % 4;
        speed = this.randomRange(2.7, 3.8);

        if (side === 0) {
            x = inner.x - 42 - (i * 8);
            y = inner.y + this.randomRange(24, inner.height - 56);
            vx = speed;
            vy = this.randomRange(-1.4, 1.4);
        } else if (side === 1) {
            x = inner.x + inner.width + 10 + (i * 8);
            y = inner.y + this.randomRange(24, inner.height - 56);
            vx = -speed;
            vy = this.randomRange(-1.4, 1.4);
        } else if (side === 2) {
            x = inner.x + this.randomRange(24, inner.width - 56);
            y = inner.y - 42 - (i * 8);
            vx = this.randomRange(-1.4, 1.4);
            vy = speed;
        } else {
            x = inner.x + this.randomRange(24, inner.width - 56);
            y = inner.y + inner.height + 10 + (i * 8);
            vx = this.randomRange(-1.4, 1.4);
            vy = -speed;
        }

        this.spawnProjectile({
            x: x,
            y: y,
            width: 32,
            height: 32,
            resource: "Skull_Attack_T",
            vx: vx,
            vy: vy,
            damage: 8,
            life: 390,
            bounce: true,
            bouncesRemaining: 14,
            type: "experimental_bouncing_skull",
            hitboxInsetX: 2,
            hitboxInsetY: 2,
            spin: this.randomRange(-5, 5)
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnExperimentalBombCluster = function () {
    var inner = this.getArenaInnerBounds();
    var count = 3;
    var i;
    var angle;
    var speed;

    for (i = 0; i < count; i++) {
        angle = this.randomRange(0, Math.PI * 2);
        speed = this.randomRange(0.55, 1.05);

        this.spawnProjectile({
            x: inner.x + this.randomRange(70, inner.width - 94),
            y: inner.y + this.randomRange(70, inner.height - 94),
            width: 24,
            height: 24,
            resource: "Bomb_Attack_T",
            animation: {
                name: "fuse",
                frames: [0, 1],
                framerate: 6,
                looped: true
            },
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            damage: 7,
            life: 120 + (i * 22),
            bounce: true,
            bouncesRemaining: 10,
            explodeOnExpire: true,
            explosionRadius: 48,
            explosionDamage: 12,
            explosionLife: 34,
            explosionFadeOutFrames: 12,
            explosionResource: "Explosion_Circle_Attack_Big_T",
            explosionAnimation: {
                name: "explode",
                frames: [0, 1, 2, 3, 4, 5],
                framerate: 14,
                looped: false
            },
            shrapnelCount: 10,
            shrapnelSpeed: 3.7,
            shrapnelDamage: 5,
            shrapnelLife: 220,
            shrapnelResource: "Bone_Shard_Attack_T",
            explodeOnHit: true,
            type: "experimental_bomb",
            hitboxInsetX: 4,
            hitboxInsetY: 4,
            spin: 5
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnAttackLabFireSpray = function () {
    var inner = this.getArenaInnerBounds();
    var fromLeft = Math.random() > 0.5;
    var originX = fromLeft ? inner.x - 38 : inner.x + inner.width + 14;
    var originY = inner.y + this.randomRange(60, inner.height - 120);
    var sweepDirection = Math.random() > 0.5 ? 1 : -1;
    var count = 34;
    var i;
    var sweep;
    var angle;
    var speed;
    var size;

    for (i = 0; i < count; i++) {
        sweep = ((i / (count - 1)) - 0.5) * 1.3 * sweepDirection;
        angle = fromLeft ? sweep : Math.PI - sweep;
        speed = this.randomRange(3.2, 4.7) + (i * 0.018);
        size = 18;

        this.spawnProjectile({
            x: originX,
            y: originY + (Math.sin(i * 0.58) * 18),
            width: size,
            height: size,
            resource: "Fireball_Attack_T",
            flippedX: !fromLeft,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            damage: 7,
            life: 138,
            startDelay: i * 3,
            speedMultiplier: 1.004,
            speedMultiplierStart: 10,
            maxSpeed: 6.2,
            drag: 0.998,
            fadeOutFrames: 18,
            type: "attack_lab_fire_spray",
            hitboxInsetX: 3,
            hitboxInsetY: 3,
            spin: fromLeft ? 4 : -4
        });
    }

};

GraveFallGame.scene.Game.prototype.spawnAttackLabHomingWisps = function () {
    var inner = this.getArenaInnerBounds();
    var count = 8;
    var centerX = inner.x + (inner.width / 2);
    var centerY = inner.y + (inner.height / 2);
    var margin = 42;
    var i;
    var side;
    var x;
    var y;
    var dx;
    var dy;
    var distance;
    var speed;

    for (i = 0; i < count; i++) {
        side = i % 4;

        if (side === 0) {
            x = inner.x - margin - this.randomRange(0, 34);
            y = inner.y + this.randomRange(28, inner.height - 44);
        } else if (side === 1) {
            x = inner.x + inner.width + margin + this.randomRange(0, 34);
            y = inner.y + this.randomRange(28, inner.height - 44);
        } else if (side === 2) {
            x = inner.x + this.randomRange(28, inner.width - 44);
            y = inner.y - margin - this.randomRange(0, 34);
        } else {
            x = inner.x + this.randomRange(28, inner.width - 44);
            y = inner.y + inner.height + margin + this.randomRange(0, 34);
        }

        dx = centerX - x;
        dy = centerY - y;
        distance = Math.sqrt((dx * dx) + (dy * dy)) || 1;
        speed = this.randomRange(1.9, 2.6);

        this.spawnProjectile({
            x: x - 8,
            y: y - 8,
            width: 16,
            height: 16,
            resource: "Orb_Attack_T",
            vx: (dx / distance) * speed,
            vy: (dy / distance) * speed,
            damage: 7,
            life: 260,
            startDelay: i * 5,
            homingFrames: 62,
            homingTurnRate: 0.075,
            homingSpeed: 2.9,
            drag: 1.001,
            maxSpeed: 4.2,
            pulseSpeedAmplitude: 0.45,
            pulseSpeedFrequency: 0.16,
            pulseSpeedPhase: i * 0.9,
            type: "attack_lab_brief_homing_wisp",
            hitboxInsetX: 2,
            hitboxInsetY: 2,
            spin: i % 2 === 0 ? 4 : -4
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnAttackLabPulseOrbs = function () {
    var inner = this.getArenaInnerBounds();
    var lanes = [0.12, 0.28, 0.44, 0.60, 0.76, 0.90];
    var fromTop = Math.random() > 0.5;
    var i;
    var x;
    var slowFirst;

    for (i = 0; i < lanes.length; i++) {
        x = inner.x + Math.round(inner.width * lanes[i]) - 10;
        slowFirst = i % 2 === 0;

        this.spawnProjectile({
            x: x,
            y: fromTop ? inner.y - 36 - (i * 12) : inner.y + inner.height + 12 + (i * 12),
            width: 20,
            height: 20,
            resource: "Crystal_Shard_Attack_T",
            vx: this.randomRange(-0.28, 0.28),
            vy: fromTop ? this.randomRange(2.1, 2.8) : this.randomRange(-2.8, -2.1),
            damage: 8,
            life: 260,
            startDelay: i * 8,
            drag: slowFirst ? 0.990 : 1.007,
            speedMultiplier: slowFirst ? 1.025 : 0.985,
            speedMultiplierStart: slowFirst ? 58 : 70,
            minSpeed: 0.7,
            maxSpeed: 6.5,
            swayAmplitude: 0.9,
            swayFrequency: 0.18,
            swayPhase: i * 0.5,
            swayAxis: "x",
            fadeOutFrames: 14,
            type: "attack_lab_pulse_crystal",
            hitboxInsetX: 2,
            hitboxInsetY: 2,
            spin: slowFirst ? 5 : -5
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnAttackLabRicochetFunnel = function () {
    var inner = this.getArenaInnerBounds();
    var i;
    var y;
    var speed;
    var centerX = inner.x + (inner.width / 2);
    var centerY = inner.y + (inner.height / 2);

    for (i = 0; i < 4; i++) {
        y = inner.y + 36 + (i * ((inner.height - 72) / 3));
        speed = this.randomRange(2.6, 3.4);

        this.spawnProjectile({
            x: i % 2 === 0 ? inner.x - 52 - (i * 8) : inner.x + inner.width + 20 + (i * 8),
            y: y,
            width: 32,
            height: 32,
            resource: "Skull_Attack_T",
            vx: i % 2 === 0 ? speed : -speed,
            vy: i < 2 ? this.randomRange(0.45, 1.15) : this.randomRange(-1.15, -0.45),
            damage: 8,
            life: 430,
            startDelay: i * 10,
            bounce: true,
            bouncesRemaining: 18,
            speedMultiplier: 1.001,
            maxSpeed: 4.6,
            type: "attack_lab_ricochet_skull",
            hitboxInsetX: 2,
            hitboxInsetY: 2,
            spin: i % 2 === 0 ? 4 : -4
        });
    }

    this.spawnProjectile({
        x: centerX - 12,
        y: centerY - 12,
        width: 24,
        height: 24,
        resource: "Orb_Attack_T",
        vx: this.randomRange(-0.4, 0.4),
        vy: this.randomRange(-0.4, 0.4),
        damage: 6,
        life: 280,
        startDelay: 38,
        splitAt: 210,
        splitCount: 10,
        splitSpeed: 2.9,
        splitLife: 190,
        splitDamage: 4,
        splitResource: "Bone_Shard_Attack_T",
        splitWidth: 16,
        splitHeight: 8,
        splitRemoveParent: true,
        type: "attack_lab_funnel_split_core",
        spin: 4
    });
};

GraveFallGame.scene.Game.prototype.spawnAttackLabHunterPack = function () {
    var inner = this.getArenaInnerBounds();
    var lanes = [0.18, 0.36, 0.54, 0.72, 0.88];
    var i;
    var x;
    var fromTop;
    var vy;

    for (i = 0; i < lanes.length; i++) {
        fromTop = i % 2 === 0;
        x = inner.x + Math.round(inner.width * lanes[i]) - 12;
        vy = fromTop ? this.randomRange(2.1, 2.8) : this.randomRange(-2.8, -2.1);

        this.spawnProjectile({
            x: x,
            y: fromTop ? inner.y - 48 - (i * 10) : inner.y + inner.height + 18 + (i * 10),
            width: 24,
            height: 24,
            resource: "Goblin_Walk_Attack_T",
            animation: {
                name: "walk",
                frames: [0, 1, 2],
                framerate: 10,
                looped: true
            },
            vx: this.randomRange(-0.4, 0.4),
            vy: vy,
            damage: 8,
            life: 310,
            startDelay: i * 12,
            homingFrames: 46,
            homingDelay: 12,
            homingTurnRate: 0.055,
            homingSpeed: 3.0,
            drag: 1.002,
            maxSpeed: 3.9,
            type: "attack_lab_hunter_goblin",
            hitboxInsetX: 2,
            hitboxInsetY: 2,
            faceVelocity: true,
            faceVelocityOffset: -90
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnAttackLabFuseMinefield = function () {
    var inner = this.getArenaInnerBounds();
    var count = 4;
    var i;
    var x;
    var y;
    var angle;
    var speed;

    for (i = 0; i < count; i++) {
        x = inner.x + 52 + (i * ((inner.width - 104) / (count - 1)));
        y = i % 2 === 0 ? inner.y - 34 : inner.y + inner.height + 10;
        angle = i % 2 === 0 ? this.randomRange(1.05, 2.05) : this.randomRange(-2.05, -1.05);
        speed = this.randomRange(1.1, 1.7);

        this.spawnProjectile({
            x: x,
            y: y,
            width: 24,
            height: 24,
            resource: "Bomb_Attack_T",
            animation: {
                name: "fuse",
                frames: [0, 1],
                framerate: 5,
                looped: true
            },
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            damage: 7,
            life: 120 + (i * 14),
            startDelay: i * 8,
            bounce: true,
            bouncesRemaining: 8,
            drag: 0.996,
            speedMultiplier: 1.006,
            speedMultiplierStart: 40,
            maxSpeed: 3.1,
            explodeOnExpire: true,
            explodeOnHit: true,
            explosionRadius: 48,
            explosionDamage: 12,
            explosionLife: 34,
            explosionFadeOutFrames: 12,
            explosionResource: "Explosion_Circle_Attack_Big_T",
            explosionAnimation: {
                name: "explode",
                frames: [0, 1, 2, 3, 4, 5],
                framerate: 14,
                looped: false
            },
            shrapnelCount: 8,
            shrapnelSpeed: 3.4,
            shrapnelDamage: 5,
            shrapnelLife: 190,
            shrapnelResource: "Bone_Shard_Attack_T",
            type: "attack_lab_fuse_minefield_bomb",
            hitboxInsetX: 4,
            hitboxInsetY: 4,
            spin: i % 2 === 0 ? 3 : -3
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnGoblinBossFuseBombs = function () {
    var inner = this.getArenaInnerBounds();
    var count = 3;
    var i;
    var x;
    var y;
    var angle;
    var speed;

    for (i = 0; i < count; i++) {
        x = inner.x + 60 + (i * ((inner.width - 120) / (count - 1)));
        y = i % 2 === 0 ? inner.y - 36 : inner.y + inner.height + 12;
        angle = i % 2 === 0 ? this.randomRange(0.95, 2.15) : this.randomRange(-2.15, -0.95);
        speed = this.randomRange(1.1, 1.6);

        this.spawnProjectile({
            x: x,
            y: y,
            width: 24,
            height: 24,
            resource: "Bomb_Attack_T",
            animation: {
                name: "fuse",
                frames: [0, 1],
                framerate: 5,
                looped: true
            },
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            damage: 7,
            life: 130 + (i * 18),
            startDelay: i * 12,
            bounce: true,
            bouncesRemaining: 8,
            drag: 0.996,
            speedMultiplier: 1.006,
            speedMultiplierStart: 40,
            maxSpeed: 3.2,
            explodeOnExpire: true,
            explodeOnHit: true,
            explosionRadius: 48,
            explosionDamage: 12,
            explosionLife: 36,
            explosionFadeOutFrames: 12,
            explosionResource: "Explosion_Circle_Attack_Big_T",
            explosionAnimation: {
                name: "explode",
                frames: [0, 1, 2, 3, 4, 5],
                framerate: 14,
                looped: false
            },
            shrapnelCount: 8,
            shrapnelSpeed: 3.25,
            shrapnelDamage: 5,
            shrapnelLife: 220,
            shrapnelResource: "Goblin_Head_Attack_T",
            shrapnelWidth: 16,
            shrapnelHeight: 16,
            shrapnelBounce: true,
            shrapnelBouncesRemaining: 3,
            shrapnelMaxSpeed: 5.2,
            shrapnelFadeOutFrames: 12,
            type: "goblin_fuse_bomb",
            hitboxInsetX: 4,
            hitboxInsetY: 4,
            spin: i % 2 === 0 ? 3 : -3
        });
    }
};

GraveFallGame.scene.Game.prototype.spawnRadialProjectiles = function (options) {
    var count = options.count || 8;
    var speed = options.speed || 3.5;
    var width = options.width || 16;
    var height = options.height || 16;
    var angleOffset = typeof options.angleOffset === "number" ? options.angleOffset : this.randomRange(0, Math.PI * 2);
    var i;
    var angle;

    for (i = 0; i < count; i++) {
        angle = angleOffset + ((Math.PI * 2) * (i / count));
        this.spawnProjectile({
            x: options.x - (width / 2),
            y: options.y - (height / 2),
            width: width,
            height: height,
            resource: options.resource || "Orb_Attack_T",
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            rotation: angle * (180 / Math.PI),
            damage: options.damage || 6,
            life: options.life || 180,
            bounce: options.bounce === true,
            bouncesRemaining: typeof options.bouncesRemaining === "number" ? options.bouncesRemaining : 999,
            maxSpeed: typeof options.maxSpeed === "number" ? options.maxSpeed : null,
            minSpeed: typeof options.minSpeed === "number" ? options.minSpeed : null,
            speedMultiplier: typeof options.speedMultiplier === "number" ? options.speedMultiplier : 1,
            speedMultiplierStart: Math.max(0, Math.floor(options.speedMultiplierStart || 0)),
            fadeOutFrames: Math.max(0, Math.floor(options.fadeOutFrames || 0)),
            type: options.type || "radial_projectile",
            hitboxInsetX: options.hitboxInsetX || 0,
            hitboxInsetY: options.hitboxInsetY || 0,
            spin: options.spin || 0
        });
    }
};

GraveFallGame.scene.Game.prototype.splitProjectile = function (projectile) {
    var centerX = projectile.x + (projectile.width / 2);
    var centerY = projectile.y + (projectile.height / 2);

    if (!projectile || projectile.splitDone === true || projectile.splitCount <= 0) {
        return;
    }

    projectile.splitDone = true;
    this.playSfx(GraveFallGame.SOUNDS.ATTACK_ORB, 0.45);

    this.spawnRadialProjectiles({
        x: centerX,
        y: centerY,
        count: projectile.splitCount,
        speed: projectile.splitSpeed,
        width: projectile.splitWidth,
        height: projectile.splitHeight,
        resource: projectile.splitResource,
        damage: projectile.splitDamage,
        life: projectile.splitLife,
        type: "experimental_split_child",
        spin: projectile.spin ? projectile.spin * -1 : 0
    });
};

GraveFallGame.scene.Game.prototype.explodeProjectile = function (projectile) {
    var centerX;
    var centerY;
    var radius;

    if (!projectile || projectile.exploded === true) {
        return;
    }

    projectile.exploded = true;
    centerX = projectile.x + (projectile.width / 2);
    centerY = projectile.y + (projectile.height / 2);
    radius = projectile.explosionRadius || 72;

    this.spawnProjectile({
        x: centerX - radius,
        y: centerY - radius,
        width: radius * 2,
        height: radius * 2,
        resource: projectile.explosionResource || "Explosion_Circle_Attack_Big_T",
        animation: projectile.explosionAnimation || {
            name: "explode",
            frames: [0, 1, 2, 3, 4, 5],
            framerate: 14,
            looped: false
        },
        damage: projectile.explosionDamage || 12,
        life: projectile.explosionLife || 34,
        pierce: true,
        type: "experimental_bomb_explosion",
        hitboxInsetX: 2,
        hitboxInsetY: 2,
        fadeOutFrames: projectile.explosionFadeOutFrames || 10,
        fadeOutToZero: true
    });

    if (projectile.shrapnelCount > 0) {
        this.spawnRadialProjectiles({
            x: centerX,
            y: centerY,
            count: projectile.shrapnelCount,
            speed: projectile.shrapnelSpeed || 4,
            width: projectile.shrapnelWidth || 16,
            height: projectile.shrapnelHeight || 8,
            resource: projectile.shrapnelResource || "Bone_Shard_Attack_T",
            damage: projectile.shrapnelDamage || 5,
            life: projectile.shrapnelLife || 180,
            bounce: projectile.shrapnelBounce === true,
            bouncesRemaining: typeof projectile.shrapnelBouncesRemaining === "number" ? projectile.shrapnelBouncesRemaining : 999,
            maxSpeed: typeof projectile.shrapnelMaxSpeed === "number" ? projectile.shrapnelMaxSpeed : null,
            fadeOutFrames: projectile.shrapnelFadeOutFrames || 0,
            type: "experimental_bomb_shrapnel",
            hitboxInsetX: projectile.shrapnelResource === "Goblin_Head_Attack_T" ? 3 : 2,
            hitboxInsetY: projectile.shrapnelResource === "Goblin_Head_Attack_T" ? 3 : 1,
            spin: projectile.shrapnelResource === "Goblin_Head_Attack_T" ? 7 : 8
        });
    }

    this.playSfx(GraveFallGame.SOUNDS.ATTACK_STOMP, 0.85);
    this.shakeCamera(260, 8, 6, true);
};

GraveFallGame.scene.Game.prototype.updateProjectileBounce = function (projectile, inner) {
    var maxX;
    var maxY;
    var bounced = false;

    if (!projectile || projectile.bounce !== true) {
        return;
    }

    maxX = inner.x + inner.width - projectile.width;
    maxY = inner.y + inner.height - projectile.height;

    if (projectile.x < inner.x && projectile.vx < 0) {
        projectile.x = inner.x;
        projectile.vx *= -1;
        bounced = true;
    } else if (projectile.x > maxX && projectile.vx > 0) {
        projectile.x = maxX;
        projectile.vx *= -1;
        bounced = true;
    }

    if (projectile.y < inner.y && projectile.vy < 0) {
        projectile.y = inner.y;
        projectile.vy *= -1;
        bounced = true;
    } else if (projectile.y > maxY && projectile.vy > 0) {
        projectile.y = maxY;
        projectile.vy *= -1;
        bounced = true;
    }

    if (bounced) {
        projectile.bouncesRemaining--;
        projectile.flippedX = projectile.vx < 0;

        if (projectile.bouncesRemaining <= 0) {
            projectile.life = Math.min(projectile.life, 20);
        }
    }
};

GraveFallGame.scene.Game.prototype.getNearestBattleAvatarCenter = function (x, y) {
    var best = null;
    var bestDistance = Infinity;
    var i;
    var playerMenu;
    var avatar;
    var centerX;
    var centerY;
    var dx;
    var dy;
    var distance;

    for (i = 0; i < this.playerMenus.length; i++) {
        playerMenu = this.playerMenus[i];

        if (!playerMenu || playerMenu.healthCurrent <= 0 || !playerMenu.battleAvatar || playerMenu.battleAvatar.visible === false) {
            continue;
        }

        avatar = playerMenu.battleAvatar;
        centerX = avatar.x + ((avatar.width || 0) * Math.abs(avatar.scaleX || 1) / 2);
        centerY = avatar.y + ((avatar.height || 0) * Math.abs(avatar.scaleY || 1) / 2);
        dx = centerX - x;
        dy = centerY - y;
        distance = (dx * dx) + (dy * dy);

        if (distance < bestDistance) {
            bestDistance = distance;
            best = {
                x: centerX,
                y: centerY,
                distance: Math.sqrt(distance)
            };
        }
    }

    return best;
};

GraveFallGame.scene.Game.prototype.activateDelayedProjectile = function (projectile) {
    if (!projectile) {
        return;
    }

    projectile.visible = true;
    projectile.alpha = typeof projectile.baseAlpha === "number" ? projectile.baseAlpha : 1;
    projectile.damage = typeof projectile.pendingDamage === "number" ? projectile.pendingDamage : projectile.damage;

    if (projectile.activateSfx) {
        this.playSfx(projectile.activateSfx, 0.45);
    }
};

GraveFallGame.scene.Game.prototype.clampProjectileSpeed = function (projectile) {
    var speed;
    var targetSpeed = null;
    var scale;

    if (!projectile) {
        return;
    }

    speed = Math.sqrt((projectile.vx * projectile.vx) + (projectile.vy * projectile.vy));

    if (speed <= 0.0001) {
        return;
    }

    if (typeof projectile.maxSpeed === "number" && speed > projectile.maxSpeed) {
        targetSpeed = projectile.maxSpeed;
    }

    if (typeof projectile.minSpeed === "number" && speed < projectile.minSpeed) {
        targetSpeed = projectile.minSpeed;
    }

    if (targetSpeed !== null) {
        scale = targetSpeed / speed;
        projectile.vx *= scale;
        projectile.vy *= scale;
    }
};

GraveFallGame.scene.Game.prototype.setProjectileSpeedKeepingDirection = function (projectile, targetSpeed) {
    var speed;
    var scale;

    if (!projectile || typeof targetSpeed !== "number") {
        return;
    }

    speed = Math.sqrt((projectile.vx * projectile.vx) + (projectile.vy * projectile.vy));

    if (speed <= 0.0001) {
        return;
    }

    scale = targetSpeed / speed;
    projectile.vx *= scale;
    projectile.vy *= scale;
};

GraveFallGame.scene.Game.prototype.updateProjectileFacing = function (projectile) {
    var angle;

    if (!projectile || projectile.faceVelocity !== true) {
        return;
    }

    if (Math.abs(projectile.vx || 0) < 0.001 && Math.abs(projectile.vy || 0) < 0.001) {
        return;
    }

    angle = Math.atan2(projectile.vy, projectile.vx) * (180 / Math.PI);
    projectile.rotation = angle + (projectile.faceVelocityOffset || 0);
};

GraveFallGame.scene.Game.prototype.updateProjectileDynamicMotion = function (projectile) {
    var centerX;
    var centerY;
    var target;
    var dx;
    var dy;
    var distance;
    var currentSpeed;
    var desiredSpeed;
    var desiredVx;
    var desiredVy;
    var turnRate;
    var pulseSpeed;
    var newSwayOffset;
    var swayDelta;

    if (!projectile) {
        return;
    }

    if (projectile.homingFrames > 0 && projectile.age >= (projectile.homingDelay || 0)) {
        centerX = projectile.x + ((projectile.width || 0) / 2);
        centerY = projectile.y + ((projectile.height || 0) / 2);
        target = this.getNearestBattleAvatarCenter(centerX, centerY);

        if (target && (!projectile.homingStopDistance || target.distance > projectile.homingStopDistance)) {
            dx = target.x - centerX;
            dy = target.y - centerY;
            distance = Math.sqrt((dx * dx) + (dy * dy));

            if (distance > 0.0001) {
                currentSpeed = Math.sqrt((projectile.vx * projectile.vx) + (projectile.vy * projectile.vy));
                desiredSpeed = typeof projectile.homingSpeed === "number" ? projectile.homingSpeed : currentSpeed;
                turnRate = typeof projectile.homingTurnRate === "number" ? projectile.homingTurnRate : 0.08;
                desiredVx = (dx / distance) * desiredSpeed;
                desiredVy = (dy / distance) * desiredSpeed;
                projectile.vx += (desiredVx - projectile.vx) * turnRate;
                projectile.vy += (desiredVy - projectile.vy) * turnRate;
            }
        }

        projectile.homingFrames--;
    }

    projectile.vx += projectile.accelX || 0;
    projectile.vy += projectile.accelY || 0;

    if (projectile.drag && projectile.drag !== 1) {
        projectile.vx *= projectile.drag;
        projectile.vy *= projectile.drag;
    }

    if (projectile.speedMultiplier && projectile.speedMultiplier !== 1 && projectile.age >= (projectile.speedMultiplierStart || 0)) {
        projectile.vx *= projectile.speedMultiplier;
        projectile.vy *= projectile.speedMultiplier;
    }

    if (projectile.pulseSpeedAmplitude && projectile.pulseSpeedFrequency) {
        pulseSpeed = projectile.baseSpeed + (Math.sin((projectile.age * projectile.pulseSpeedFrequency) + projectile.pulseSpeedPhase) * projectile.pulseSpeedAmplitude);
        pulseSpeed = Math.max(0.35, pulseSpeed);
        this.setProjectileSpeedKeepingDirection(projectile, pulseSpeed);
    }

    this.clampProjectileSpeed(projectile);

    if (projectile.swayAmplitude && projectile.swayFrequency) {
        newSwayOffset = Math.sin((projectile.age * projectile.swayFrequency) + projectile.swayPhase) * projectile.swayAmplitude;
        swayDelta = newSwayOffset - (projectile.previousSwayOffset || 0);
        projectile.previousSwayOffset = newSwayOffset;

        if (projectile.swayAxis === "x") {
            projectile.x += swayDelta;
        } else {
            projectile.y += swayDelta;
        }
    }
};

GraveFallGame.scene.Game.prototype.removeProjectileAt = function (index) {
    var projectile = this.projectiles[index];
    if (!projectile) return;
    if (projectile.parent) projectile.parent.removeChild(projectile, true);
    this.projectiles.splice(index, 1);
};

GraveFallGame.scene.Game.prototype.getProjectileHitboxLeeway = function (options) {
    var width = options && options.collisionWidth ? options.collisionWidth : (options && options.width ? options.width : 0);
    var height = options && options.collisionHeight ? options.collisionHeight : (options && options.height ? options.height : 0);
    var shortestSide = Math.min(width || 0, height || 0);
    var requestedX = options && typeof options.hitboxInsetX === "number" ? options.hitboxInsetX : null;
    var requestedY = options && typeof options.hitboxInsetY === "number" ? options.hitboxInsetY : null;
    var leeway;

    if (options && typeof options.hitboxLeeway === "number") {
        leeway = options.hitboxLeeway;
    } else if (requestedX !== null || requestedY !== null) {
        leeway = Math.max(requestedX || 0, requestedY || 0);
    } else if (shortestSide <= 0) {
        leeway = 1;
    } else {
        leeway = Math.round(shortestSide * 0.1);
    }

    leeway = Math.max(1, Math.min(2, leeway));

    if (shortestSide > 0) {
        leeway = Math.min(leeway, Math.max(0, Math.floor((shortestSide - 2) / 2)));
    }

    return leeway;
};

GraveFallGame.scene.Game.prototype.getCollisionBoundsAt = function (object, x, y) {
    var objectX = object ? object.x || 0 : 0;
    var objectY = object ? object.y || 0 : 0;
    var boundsX = typeof x === "number" ? x : objectX;
    var boundsY = typeof y === "number" ? y : objectY;
    var hitbox = object && object.hitbox ? object.hitbox : null;
    var insetX;
    var insetY;
    var width;
    var height;

    if (hitbox) {
        return {
            x: boundsX + (hitbox.x - objectX),
            y: boundsY + (hitbox.y - objectY),
            width: hitbox.width,
            height: hitbox.height
        };
    }

    insetX = object && typeof object.hitboxInsetLeft === "number" ? object.hitboxInsetLeft : (object && typeof object.hitboxInsetX === "number" ? object.hitboxInsetX : 0);
    insetY = object && typeof object.hitboxInsetTop === "number" ? object.hitboxInsetTop : (object && typeof object.hitboxInsetY === "number" ? object.hitboxInsetY : 0);
    width = object ? object.width || 0 : 0;
    height = object ? object.height || 0 : 0;

    insetX = Math.max(0, Math.min(width / 2, insetX));
    insetY = Math.max(0, Math.min(height / 2, insetY));

    return {
        x: boundsX + insetX,
        y: boundsY + insetY,
        width: Math.max(0, width - insetX - (object && typeof object.hitboxInsetRight === "number" ? object.hitboxInsetRight : insetX)),
        height: Math.max(0, height - insetY - (object && typeof object.hitboxInsetBottom === "number" ? object.hitboxInsetBottom : insetY))
    };
};

GraveFallGame.scene.Game.prototype.getCollisionBounds = function (object) {
    return this.getCollisionBoundsAt(object);
};

GraveFallGame.scene.Game.prototype.rectBoundsOverlap = function (aBounds, bBounds) {
    return rune.geom.Rectangle.intersects(
        aBounds.x,
        aBounds.y,
        aBounds.width,
        aBounds.height,
        bBounds.x,
        bBounds.y,
        bBounds.width,
        bBounds.height
    );
};

GraveFallGame.scene.Game.prototype.rectsOverlap = function (a, b) {
    return this.rectBoundsOverlap(this.getCollisionBounds(a), this.getCollisionBounds(b));
};

GraveFallGame.scene.Game.prototype.isBattleAvatarColliding = function (playerMenu, testX, testY) {
    var i;
    var otherMenu;
    var testBounds = this.getCollisionBoundsAt(playerMenu.battleAvatar, testX, testY);

    for (i = 0; i < this.playerMenus.length; i++) {
        otherMenu = this.playerMenus[i];
        if (otherMenu === playerMenu || otherMenu.healthCurrent <= 0) continue;
        if (this.rectBoundsOverlap(testBounds, this.getCollisionBounds(otherMenu.battleAvatar))) return true;
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

        if (!projectile || projectile.hit || projectile.damage <= 0) {
            continue;
        }

        for (j = 0; j < this.playerMenus.length; j++) {
            playerMenu = this.playerMenus[j];

            if (playerMenu.healthCurrent <= 0 || playerMenu.hitCooldown > 0) {
                continue;
            }

            if (projectile.pierce === true && projectile.hitPlayers && projectile.hitPlayers[j] === true) {
                continue;
            }

            if (this.rectsOverlap(projectile, playerMenu.battleAvatar)) {
                this.applyDamageToPlayer(playerMenu, projectile.damage);

                if (projectile.pierce === true) {
                    projectile.hitPlayers[j] = true;
                } else {
                    if (projectile.explodeOnHit === true) {
                        this.explodeProjectile(projectile);
                    }

                    projectile.hit = true;
                    projectile.hitFlashFrames = 6;
                    projectile.vx = 0;
                    projectile.vy = 0;
                    break;
                }
            }
        }
    }
};

GraveFallGame.scene.Game.prototype.updateProjectiles = function () {
    var inner = this.getArenaInnerBounds();
    var i;
    var projectile;
    var expiredByLife;
    var outsideBounds;

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

        if (projectile.startDelay > 0) {
            projectile.startDelay--;

            if (projectile.startDelay <= 0) {
                this.activateDelayedProjectile(projectile);
            }

            continue;
        }

        projectile.age++;

        if (projectile.spin) {
            projectile.rotation += projectile.spin;
        }

        this.updateProjectileDynamicMotion(projectile);
        projectile.x += projectile.vx;
        projectile.y += projectile.vy;
        this.updateProjectileBounce(projectile, inner);
        this.updateProjectileFacing(projectile);

        projectile.life--;

        if (typeof projectile.splitAt === "number" && projectile.splitDone !== true && projectile.life <= projectile.splitAt) {
            this.splitProjectile(projectile);

            if (projectile.splitRemoveParent === true) {
                this.removeProjectileAt(i);
                continue;
            }
        }

        if (projectile.explodeOnExpire === true && projectile.life <= 30) {
            projectile.alpha = projectile.life % 8 < 4 ? 0.35 : 1;
        } else if (projectile.fadeOutFrames > 0 && projectile.life <= projectile.fadeOutFrames) {
            projectile.alpha = Math.max(projectile.fadeOutToZero === true ? 0 : 0.15, (typeof projectile.baseAlpha === "number" ? projectile.baseAlpha : 1) * (projectile.life / projectile.fadeOutFrames));
        }

        expiredByLife = projectile.life <= 0;
        outsideBounds = (
            projectile.x < inner.x - 220 ||
            projectile.x > inner.x + inner.width + 220 ||
            projectile.y < inner.y - 220 ||
            projectile.y > inner.y + inner.height + 220
        );

        if (expiredByLife || outsideBounds) {
            if (expiredByLife && projectile.explodeOnExpire === true) {
                this.explodeProjectile(projectile);
            }

            this.removeProjectileAt(i);
        }
    }
};

GraveFallGame.scene.Game.prototype.getClampBoundsAt = function (object, x, y) {
    var objectX = object ? object.x || 0 : 0;
    var objectY = object ? object.y || 0 : 0;
    var boundsX = typeof x === "number" ? x : objectX;
    var boundsY = typeof y === "number" ? y : objectY;
    var scaleX;
    var scaleY;
    var width;
    var height;
    var insetLeft;
    var insetTop;
    var insetRight;
    var insetBottom;

    if (!object || typeof object.hitboxClampInsetLeft !== "number") {
        return this.getCollisionBoundsAt(object, x, y);
    }

    scaleX = object.scaleX || 1;
    scaleY = object.scaleY || 1;
    width = Math.abs((object.width || 0) * scaleX);
    height = Math.abs((object.height || 0) * scaleY);
    insetLeft = Math.max(0, Math.min(width / 2, object.hitboxClampInsetLeft || 0));
    insetTop = Math.max(0, Math.min(height / 2, object.hitboxClampInsetTop || 0));
    insetRight = Math.max(0, Math.min(width - insetLeft, object.hitboxClampInsetRight || insetLeft));
    insetBottom = Math.max(0, Math.min(height - insetTop, object.hitboxClampInsetBottom || insetTop));

    return {
        x: boundsX + insetLeft,
        y: boundsY + insetTop,
        width: Math.max(0, width - insetLeft - insetRight),
        height: Math.max(0, height - insetTop - insetBottom)
    };
};

GraveFallGame.scene.Game.prototype.clampObjectHitboxToBounds = function (object, x, y, bounds) {
    var clampedX = x;
    var clampedY = y;
    var objectBounds = this.getClampBoundsAt(object, clampedX, clampedY);
    var overflow;

    overflow = bounds.x - objectBounds.x;
    if (overflow > 0) {
        clampedX += overflow;
        objectBounds.x += overflow;
    }

    overflow = (objectBounds.x + objectBounds.width) - (bounds.x + bounds.width);
    if (overflow > 0) {
        clampedX -= overflow;
        objectBounds.x -= overflow;
    }

    overflow = bounds.y - objectBounds.y;
    if (overflow > 0) {
        clampedY += overflow;
        objectBounds.y += overflow;
    }

    overflow = (objectBounds.y + objectBounds.height) - (bounds.y + bounds.height);
    if (overflow > 0) {
        clampedY -= overflow;
    }

    return {
        x: clampedX,
        y: clampedY
    };
};

GraveFallGame.scene.Game.prototype.updateBattleAvatarMovement = function (playerMenu) {
    var speed = playerMenu.moveSpeed || 3;
    var avatar = playerMenu.battleAvatar;
    var inner = this.getArenaInnerBounds();
    var oldX = avatar.x;
    var oldY = avatar.y;
    var nextX = avatar.x;
    var nextY = avatar.y;
    var clamped;

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

    clamped = this.clampObjectHitboxToBounds(avatar, nextX, nextY, inner);
    nextX = clamped.x;
    nextY = clamped.y;

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