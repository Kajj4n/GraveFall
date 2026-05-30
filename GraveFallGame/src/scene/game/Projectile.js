//------------------------------------------------------------------------------
// Combat, collisions, projectiles, items
//------------------------------------------------------------------------------

/**
 * Spawns the active enemy projectile pattern.
 *
 * @return {undefined}
 */
GraveFallGame.scene.Game.prototype.spawnEnemyPattern = function () {
    var enemy = this.getCurrentEnemyConfig();
    var patternId = enemy.patterns[Math.floor(Math.random() * enemy.patterns.length)];
    this.spawnEnemyPatternById(patternId);
};

/**
 * Spawns an enemy projectile pattern by identifier.
 *
 * @param {string} patternId Projectile pattern identifier.
 *
 * @return {undefined}
 */
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
        case "crypt_spear_corridor": this.spawnCryptSpearCorridor(); break;
        case "crypt_spear_rise_fall": this.spawnCryptSpearRiseFall(); break;
        case "crypt_arrow_crossfire": this.spawnCryptArrowSpearCrossfire(); break;
        case "bonecaller_shard_arc": this.spawnBoneCallerShardArc(); break;
        case "bonecaller_skull_ring": this.spawnBoneCallerSkullRing(); break;
        case "bonecaller_bone_spiral": this.spawnBoneCallerBoneSpiral(); break;
        case "crystal_rain": this.spawnCrystalRain(); break;
        case "crystal_wall": this.spawnCrystalWall(); break;
        case "crystal_orb_split": this.spawnCrystalOrbSplit(); break;
        case "goblin_animated_walkers": this.spawnGoblinAnimatedWalkers(); break;
        case "orb_split_chain": this.spawnOrbSplitChain(); break;
        case "bouncing_skulls": this.spawnBouncingSkulls(); break;
        case "bomb_cluster": this.spawnBombCluster(); break;
        case "attack_fire_spray": this.spawnAttackFireSpray(); break;
        case "attack_homing_wisps": this.spawnAttackHomingWisps(); break;
        case "attack_pulse_orbs": this.spawnAttackPulseOrbs(); break;
        case "attack_hunter_pack": this.spawnAttackHunterPack(); break;
        case "attack_fuse_minefield": this.spawnAttackFuseMinefield(); break;
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

/**
 * Spawns the boss sword rain projectile pattern.
 *
 * @return {undefined}
 */
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

/**
 * Spawns the boss vertical sweep projectile pattern.
 *
 * @return {undefined}
 */
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

/**
 * Spawns the boss orb burst projectile pattern.
 *
 * @return {undefined}
 */
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

/**
 * Spawns the boss diagonal drop projectile pattern.
 *
 * @return {undefined}
 */
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

/**
 * Spawns the goblin pebble rain projectile pattern.
 *
 * @return {undefined}
 */
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

/**
 * Spawns the goblin dart fan projectile pattern.
 *
 * @return {undefined}
 */
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

/**
 * Spawns the goblin stomp wave projectile pattern.
 *
 * @return {undefined}
 */
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

/**
 * Spawns the goblin boss mace quake projectile pattern.
 *
 * @return {undefined}
 */
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

/**
 * Spawns the goblin boss sword pincer projectile pattern.
 *
 * @return {undefined}
 */
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

/**
 * Spawns the goblin boss head toss projectile pattern.
 *
 * @return {undefined}
 */
GraveFallGame.scene.Game.prototype.spawnGoblinBossHeadToss = function () {
    var inner = this.getArenaInnerBounds();
    var count = 4 + Math.floor(Math.random() * 2);
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
            life: 170,
            startDelay: i * 5,
            bounce: true,
            bouncesRemaining: 1,
            speedMultiplier: 1.004,
            speedMultiplierStart: 35,
            maxSpeed: 6.2,
            fadeOutFrames: 12,
            type: "goblin_bouncing_head",
            spin: fromLeft ? 6 : -6
        });
    }
};

/**
 * Spawns the goblin boss mob charge projectile pattern.
 *
 * @return {undefined}
 */
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

/**
 * Spawns the goblin boss blade trap projectile pattern.
 *
 * @return {undefined}
 */
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

/**
 * Spawns the ghoul orb crawl projectile pattern.
 *
 * @return {undefined}
 */
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

    /* Ghoul soul lights creep in, pull toward the party, then drift onward. */
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

/**
 * Spawns the ghoul dart ambush projectile pattern.
 *
 * @return {undefined}
 */
GraveFallGame.scene.Game.prototype.spawnGhoulDartAmbush = function () {
    var inner = this.getArenaInnerBounds();
    var side = Math.random() > 0.5 ? -1 : 1;
    var originX = side < 0 ? inner.x - 42 : inner.x + inner.width + 22;
    var rows = 5;
    var i;
    var y;

    /* Staggered knives accelerate so players must keep changing lanes. */
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

/**
 * Spawns the ghoul stomp pulse projectile pattern.
 *
 * @return {undefined}
 */
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

/**
 * Spawns the ghoul impaled sword drop projectile pattern.
 *
 * @return {undefined}
 */
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

/**
 * Spawns the ghoul bone shard spread projectile pattern.
 *
 * @return {undefined}
 */
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
            vx: spread * 1.02,
            vy: this.randomRange(3.8, 5.35),
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
        vy: this.randomRange(1.9, 2.55),
        damage: 6,
        life: 210,
        splitAt: 142,
        splitCount: 8,
        splitSpeed: 3.2,
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

/**
 * Spawns the ghoul skull drift projectile pattern.
 *
 * @return {undefined}
 */
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

/**
 * Spawns the HyDragon fireball breath projectile pattern.
 *
 * @return {undefined}
 */
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

    /* HyDragon breath uses delayed small fireballs rather than large wave sprites. */
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

/**
 * Spawns the HyDragon fire wave projectile pattern.
 *
 * @return {undefined}
 */
GraveFallGame.scene.Game.prototype.spawnHyDragonFireWave = function () {
    var inner = this.getArenaInnerBounds();
    var centerX = inner.x + (inner.width / 2);
    var count = 5;
    var i;
    var fromTop;
    var x;
    var speed;

    /* HyDragon fire waves form a vertical curtain through the arena center. */
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

/**
 * Spawns the HyDragon sword hunt projectile pattern.
 *
 * @return {undefined}
 */
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

    /* Swords chase briefly, then commit to their path to keep the attack readable. */
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

/**
 * Spawns the HyDragon sword storm projectile pattern.
 *
 * @return {undefined}
 */
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

/**
 * Spawns the HyDragon cross sweep projectile pattern.
 *
 * @return {undefined}
 */
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

/**
 * Spawns the HyDragon fang fan projectile pattern.
 *
 * @return {undefined}
 */
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

/**
 * Spawns the HyDragon roar quake projectile pattern.
 *
 * @return {undefined}
 */
GraveFallGame.scene.Game.prototype.spawnHyDragonRoarQuake = function () {
    var inner = this.getArenaInnerBounds();
    var stompCount = 9;
    var swordCount = 9;
    var i;
    var x;
    var slowFirst;

    /* Roar pattern: shake, floor shockwaves, then falling ceiling blades. */
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

/**
 * Spawns one crypt spear projectile.
 *
 * @param {Object} options Options object.
 *
 * @return {Object} Created display object or data object.
 */
GraveFallGame.scene.Game.prototype.spawnCryptSpearProjectile = function (options) {
    var collisionWidth = options.collisionWidth || 20;
    var collisionHeight = options.collisionHeight || 80;
    var spriteWidth = options.spriteWidth || 80;
    var spriteHeight = options.spriteHeight || 20;

    return this.spawnProjectile({
        x: options.x,
        y: options.y,
        width: collisionWidth,
        height: collisionHeight,
        collisionWidth: collisionWidth,
        collisionHeight: collisionHeight,
        spriteWidth: spriteWidth,
        spriteHeight: spriteHeight,
        spriteOffsetX: (collisionWidth - spriteWidth) / 2,
        spriteOffsetY: (collisionHeight - spriteHeight) / 2,
        spriteRotation: options.fromTop === true ? 90 : -90,
        resource: "Spear_Attack_T",
        vx: options.vx || 0,
        vy: options.vy || 0,
        damage: typeof options.damage === "number" ? options.damage : 8,
        life: options.life || 190,
        startDelay: options.startDelay || 0,
        speedMultiplier: typeof options.speedMultiplier === "number" ? options.speedMultiplier : 1.008,
        speedMultiplierStart: typeof options.speedMultiplierStart === "number" ? options.speedMultiplierStart : 36,
        maxSpeed: typeof options.maxSpeed === "number" ? options.maxSpeed : 7.4,
        fadeOutFrames: typeof options.fadeOutFrames === "number" ? options.fadeOutFrames : 10,
        type: options.type || "crypt_spear_vertical",
        hitboxInsetX: typeof options.hitboxInsetX === "number" ? options.hitboxInsetX : 3,
        hitboxInsetY: typeof options.hitboxInsetY === "number" ? options.hitboxInsetY : 5
    });
};

/**
 * Spawns the crypt spear corridor projectile pattern.
 *
 * @return {undefined}
 */
GraveFallGame.scene.Game.prototype.spawnCryptSpearCorridor = function () {
    var inner = this.getArenaInnerBounds();
    var lanes = [0.14, 0.30, 0.46, 0.62, 0.78, 0.90];
    var i;
    var fromTop;
    var x;

    this.spawnCryptArrowCrossfire({
        rows: 4,
        startDelayBase: 4,
        rowDelay: 10,
        oppositeSideDelay: 8,
        yJitter: 9,
        minSpeed: 4.2,
        maxSpeed: 5.3,
        damage: 5,
        life: 165,
        speedMultiplier: 1.004,
        speedMultiplierStart: 44,
        maxProjectileSpeed: 6.3,
        type: "crypt_spear_corridor_arrow"
    });

    for (i = 0; i < lanes.length; i++) {
        fromTop = i % 2 === 0;
        x = inner.x + Math.round(inner.width * lanes[i]) - 10;
        this.spawnCryptSpearProjectile({
            x: x + this.randomRange(-5, 5),
            y: fromTop ? inner.y - 92 - (i * 4) : inner.y + inner.height + 12 + (i * 4),
            fromTop: fromTop,
            vy: fromTop ? this.randomRange(4.2, 5.6) : this.randomRange(-5.6, -4.2),
            damage: 8,
            life: 190,
            startDelay: 12 + (i * 7),
            speedMultiplier: 1.010,
            speedMultiplierStart: 30,
            maxSpeed: 7.8,
            type: "crypt_spear_corridor"
        });
    }
};

/**
 * Spawns the crypt spear rise-fall projectile pattern.
 *
 * @return {undefined}
 */
GraveFallGame.scene.Game.prototype.spawnCryptSpearRiseFall = function () {
    var inner = this.getArenaInnerBounds();
    var pairs = [0.20, 0.38, 0.56, 0.74];
    var i;
    var x;
    var topFirst;

    this.spawnCryptArrowCrossfire({
        rows: 5,
        startDelayBase: 8,
        rowDelay: 8,
        oppositeSideDelay: 6,
        yJitter: 7,
        minSpeed: 4.0,
        maxSpeed: 5.1,
        damage: 5,
        life: 170,
        speedMultiplier: 1.004,
        speedMultiplierStart: 46,
        maxProjectileSpeed: 6.1,
        type: "crypt_spear_rise_fall_arrow"
    });

    for (i = 0; i < pairs.length; i++) {
        x = inner.x + Math.round(inner.width * pairs[i]) - 10;
        topFirst = i % 2 === 0;

        this.spawnCryptSpearProjectile({
            x: x + this.randomRange(-7, 7),
            y: topFirst ? inner.y - 98 : inner.y + inner.height + 18,
            fromTop: topFirst,
            vy: topFirst ? this.randomRange(4.8, 6.1) : this.randomRange(-6.1, -4.8),
            damage: 8,
            life: 185,
            startDelay: i * 10,
            speedMultiplier: 1.012,
            speedMultiplierStart: 24,
            maxSpeed: 8.2,
            type: "crypt_spear_rise_fall"
        });

        this.spawnCryptSpearProjectile({
            x: x + this.randomRange(-7, 7),
            y: topFirst ? inner.y + inner.height + 18 : inner.y - 98,
            fromTop: !topFirst,
            vy: topFirst ? this.randomRange(-5.4, -4.2) : this.randomRange(4.2, 5.4),
            damage: 8,
            life: 185,
            startDelay: 18 + (i * 10),
            speedMultiplier: 1.006,
            speedMultiplierStart: 32,
            maxSpeed: 7.4,
            type: "crypt_spear_rise_fall"
        });
    }
};

/**
 * Spawns the crypt arrow and spear crossfire projectile pattern.
 *
 * @return {undefined}
 */
GraveFallGame.scene.Game.prototype.spawnCryptArrowSpearCrossfire = function () {
    var inner = this.getArenaInnerBounds();
    var lanes = [0.18, 0.36, 0.54, 0.72, 0.88];
    var i;
    var fromTop;
    var x;

    this.spawnCryptArrowCrossfire({
        rows: 5,
        startDelayBase: 0,
        rowDelay: 7,
        oppositeSideDelay: 9,
        yJitter: 11,
        minSpeed: 4.4,
        maxSpeed: 5.6,
        damage: 6,
        life: 170,
        speedMultiplier: 1.006,
        speedMultiplierStart: 40,
        maxProjectileSpeed: 6.8,
        type: "crypt_arrow_crossfire"
    });

    for (i = 0; i < lanes.length; i++) {
        fromTop = i % 2 !== 0;
        x = inner.x + Math.round(inner.width * lanes[i]) - 10;
        this.spawnCryptSpearProjectile({
            x: x + this.randomRange(-6, 6),
            y: fromTop ? inner.y - 96 - (i * 3) : inner.y + inner.height + 16 + (i * 3),
            fromTop: fromTop,
            vy: fromTop ? this.randomRange(4.5, 5.8) : this.randomRange(-5.8, -4.5),
            damage: 8,
            life: 185,
            startDelay: 10 + (i * 9),
            speedMultiplier: 1.010,
            speedMultiplierStart: 28,
            maxSpeed: 7.9,
            type: "crypt_arrow_crossfire_spear"
        });
    }
};

/**
 * Spawns the crypt arrow crossfire projectile pattern.
 *
 * @param {Object} options Options object.
 *
 * @return {undefined}
 */
GraveFallGame.scene.Game.prototype.spawnCryptArrowCrossfire = function (options) {
    var inner = this.getArenaInnerBounds();
    var config = options || {};
    var rows = config.rows || 5;
    var rowDelay = typeof config.rowDelay === "number" ? config.rowDelay : 7;
    var startDelayBase = typeof config.startDelayBase === "number" ? config.startDelayBase : 0;
    var oppositeSideDelay = typeof config.oppositeSideDelay === "number" ? config.oppositeSideDelay : 10;
    var yJitter = typeof config.yJitter === "number" ? config.yJitter : 12;
    var topPadding = typeof config.topPadding === "number" ? config.topPadding : 34;
    var bottomPadding = typeof config.bottomPadding === "number" ? config.bottomPadding : 34;
    var minSpeed = typeof config.minSpeed === "number" ? config.minSpeed : 4.4;
    var maxSpeed = typeof config.maxSpeed === "number" ? config.maxSpeed : 5.7;
    var damage = typeof config.damage === "number" ? config.damage : 6;
    var life = config.life || 170;
    var speedMultiplier = typeof config.speedMultiplier === "number" ? config.speedMultiplier : 1.006;
    var speedMultiplierStart = typeof config.speedMultiplierStart === "number" ? config.speedMultiplierStart : 40;
    var maxProjectileSpeed = typeof config.maxProjectileSpeed === "number" ? config.maxProjectileSpeed : 6.8;
    var type = config.type || "crypt_arrow_crossfire";
    var verticalSpan = inner.height - topPadding - bottomPadding;
    var i;
    var y;
    var rowProgress;

    for (i = 0; i < rows; i++) {
        rowProgress = rows <= 1 ? 0.5 : i / (rows - 1);
        y = inner.y + topPadding + (rowProgress * verticalSpan);
        this.spawnProjectile({
            x: inner.x - 36 - (i * 10),
            y: y,
            width: 20,
            height: 6,
            resource: "Arrow_attack_T",
            vx: this.randomRange(minSpeed, maxSpeed),
            vy: this.randomRange(-0.16, 0.16),
            damage: damage,
            life: life,
            startDelay: startDelayBase + (i * rowDelay),
            speedMultiplier: speedMultiplier,
            speedMultiplierStart: speedMultiplierStart,
            maxSpeed: maxProjectileSpeed,
            type: type
        });
        this.spawnProjectile({
            x: inner.x + inner.width + 16 + (i * 10),
            y: y + this.randomRange(-yJitter, yJitter),
            width: 20,
            height: 6,
            resource: "Arrow_attack_T",
            flippedX: true,
            vx: this.randomRange(-maxSpeed, -minSpeed),
            vy: this.randomRange(-0.16, 0.16),
            damage: damage,
            life: life,
            startDelay: startDelayBase + oppositeSideDelay + (i * rowDelay),
            speedMultiplier: speedMultiplier,
            speedMultiplierStart: speedMultiplierStart,
            maxSpeed: maxProjectileSpeed,
            type: type
        });
    }
};

/**
 * Spawns the Bone Caller shard arc projectile pattern.
 *
 * @return {undefined}
 */
GraveFallGame.scene.Game.prototype.spawnBoneCallerShardArc = function () {
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
            vx: spread * 0.82,
            vy: this.randomRange(4.15, 5.85),
            rotation: spread * 7,
            damage: 6,
            life: 160,
            startDelay: Math.abs(spread) * 2,
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

/**
 * Spawns the Bone Caller skull ring projectile pattern.
 *
 * @return {undefined}
 */
GraveFallGame.scene.Game.prototype.spawnBoneCallerSkullRing = function () {
    var inner = this.getArenaInnerBounds();
    var count = 4;
    var i;
    var side;
    var x;
    var y;
    var angle;
    var speed;
    var vx;
    var vy;

    /* Fewer skulls enter from varied lanes to pressure movement without flooding. */
    for (i = 0; i < count; i++) {
        side = Math.floor(this.randomRange(0, 4));
        speed = this.randomRange(4.0, 5.65);

        if (side === 0) {
            x = inner.x - 40 - this.randomRange(0, 28);
            y = inner.y + this.randomRange(22, inner.height - 54);
            angle = this.randomRange(-0.75, 0.75);
        } else if (side === 1) {
            x = inner.x + inner.width + 8 + this.randomRange(0, 28);
            y = inner.y + this.randomRange(22, inner.height - 54);
            angle = Math.PI + this.randomRange(-0.75, 0.75);
        } else if (side === 2) {
            x = inner.x + this.randomRange(22, inner.width - 54);
            y = inner.y - 40 - this.randomRange(0, 28);
            angle = (Math.PI / 2) + this.randomRange(-0.85, 0.85);
        } else {
            x = inner.x + this.randomRange(22, inner.width - 54);
            y = inner.y + inner.height + 8 + this.randomRange(0, 28);
            angle = -(Math.PI / 2) + this.randomRange(-0.85, 0.85);
        }

        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed;

        this.spawnProjectile({
            x: x,
            y: y,
            width: 32,
            height: 32,
            resource: "Skull_Attack_T",
            flippedX: vx < 0,
            vx: vx,
            vy: vy,
            damage: 8,
            life: 240,
            startDelay: i * 5,
            bounce: true,
            bouncesRemaining: 8,
            speedMultiplier: 1.001,
            speedMultiplierStart: 36,
            maxSpeed: 6.65,
            pulseSpeedAmplitude: 0.25,
            pulseSpeedFrequency: 0.11,
            pulseSpeedPhase: i * 0.7,
            fadeOutFrames: 18,
            type: "bonecaller_bouncing_skull",
            hitboxInsetX: 4,
            hitboxInsetY: 4,
            spin: vx >= 0 ? 5 : -5
        });
    }
};

/**
 * Spawns the Bone Caller bone spiral projectile pattern.
 *
 * @return {undefined}
 */
GraveFallGame.scene.Game.prototype.spawnBoneCallerBoneSpiral = function () {
    var inner = this.getArenaInnerBounds();
    var centerX = inner.x + (inner.width / 2);
    var centerY = inner.y + (inner.height / 2);
    var radiusX = Math.max(48, (inner.width / 2) - 18);
    var radiusY = Math.max(48, (inner.height / 2) - 14);
    var count = 10;
    var angleOffset = this.randomRange(0, Math.PI * 2);
    var clockwise = Math.random() > 0.5 ? 1 : -1;
    var angularSpeed = clockwise * 0.024;
    var entryStartScale = 1.28;
    var entryFrames = 48;
    var i;
    var angle;
    var entryRadiusX;
    var entryRadiusY;
    var shard;

    /* Bones ease into a readable ring before shrinking inward. */
    for (i = 0; i < count; i++) {
        angle = angleOffset + ((Math.PI * 2) * (i / count));

        entryRadiusX = radiusX * entryStartScale;
        entryRadiusY = radiusY * entryStartScale;

        shard = this.spawnProjectile({
            x: centerX + (Math.cos(angle) * entryRadiusX) - 8,
            y: centerY + (Math.sin(angle) * entryRadiusY) - 4,
            width: 16,
            height: 8,
            resource: "Bone_Shard_Attack_T",
            vx: 0,
            vy: 0,
            rotation: (angle * (180 / Math.PI)) + 90,
            damage: 7,
            life: 360,
            startDelay: 0,
            fadeOutFrames: 22,
            type: "bonecaller_bone_spiral",
            hitboxInsetX: 2,
            hitboxInsetY: 1,
            spin: 0
        });

        shard.spiralCenterX = centerX;
        shard.spiralCenterY = centerY;
        shard.spiralAngle = angle;
        shard.spiralRadiusX = entryRadiusX;
        shard.spiralRadiusY = entryRadiusY;
        shard.spiralStartRadiusX = radiusX;
        shard.spiralStartRadiusY = radiusY;
        shard.spiralScale = entryStartScale;
        shard.spiralEntryStartScale = entryStartScale;
        shard.spiralEntryFrames = entryFrames;
        shard.spiralEntryAge = 0;
        shard.spiralShrinkRate = 0.00245;
        shard.spiralMinScale = 0.28;
        shard.spiralFadeScale = 0.34;
        shard.spiralAngularSpeed = angularSpeed;
        shard.spiralFacePath = true;
        shard.spiralRotationOffset = 90;
        shard.spiralSpriteSpin = clockwise > 0 ? 5.8 : -5.8;
        shard.spiralMotionOnly = true;
    }
};

/**
 * Spawns the crystal rain projectile pattern.
 *
 * @return {undefined}
 */
GraveFallGame.scene.Game.prototype.spawnCrystalRain = function () {
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

/**
 * Spawns the crystal wall projectile pattern.
 *
 * @return {undefined}
 */
GraveFallGame.scene.Game.prototype.spawnCrystalWall = function () {
    var inner = this.getArenaInnerBounds();
    var fromLeft = Math.random() > 0.5;
    var count = 6;
    var i;
    var y;
    var speed;

    /* Crystal wall lanes swing vertically so the party must weave. */
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

/**
 * Spawns the crystal orb split projectile pattern.
 *
 * @return {undefined}
 */
GraveFallGame.scene.Game.prototype.spawnCrystalOrbSplit = function () {
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

/**
 * Spawns animated goblin walker projectiles.
 *
 * @return {undefined}
 */
GraveFallGame.scene.Game.prototype.spawnGoblinAnimatedWalkers = function () {
    var inner = this.getArenaInnerBounds();
    var lanes = [0.16, 0.34, 0.52, 0.70, 0.88];
    var i;
    var speed;
    var x;

    /* Goblin walk frames face downward, so walkers enter from above. */
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
            type: "goblin_animated_walker",
            hitboxInsetX: 2,
            hitboxInsetY: 2
        });
    }
};

/**
 * Spawns an orb split chain projectile pattern.
 *
 * @return {undefined}
 */
GraveFallGame.scene.Game.prototype.spawnOrbSplitChain = function () {
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
            type: "orb_split_parent",
            spin: i % 2 === 0 ? 3 : -3
        });
    }
};

/**
 * Spawns bouncing skull projectiles.
 *
 * @return {undefined}
 */
GraveFallGame.scene.Game.prototype.spawnBouncingSkulls = function () {
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
            type: "bouncing_skull",
            hitboxInsetX: 2,
            hitboxInsetY: 2,
            spin: this.randomRange(-5, 5)
        });
    }
};

/**
 * Spawns a bomb cluster projectile pattern.
 *
 * @return {undefined}
 */
GraveFallGame.scene.Game.prototype.spawnBombCluster = function () {
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
            type: "fuse_bomb",
            hitboxInsetX: 4,
            hitboxInsetY: 4,
            spin: 5
        });
    }
};

/**
 * Spawns a fire spray projectile pattern.
 *
 * @return {undefined}
 */
GraveFallGame.scene.Game.prototype.spawnAttackFireSpray = function () {
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
            type: "attack_fire_spray",
            hitboxInsetX: 3,
            hitboxInsetY: 3,
            spin: fromLeft ? 4 : -4
        });
    }

};

/**
 * Spawns homing wisp projectiles.
 *
 * @return {undefined}
 */
GraveFallGame.scene.Game.prototype.spawnAttackHomingWisps = function () {
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
            type: "attack_brief_homing_wisp",
            hitboxInsetX: 2,
            hitboxInsetY: 2,
            spin: i % 2 === 0 ? 4 : -4
        });
    }
};

/**
 * Spawns pulse orb projectiles.
 *
 * @return {undefined}
 */
GraveFallGame.scene.Game.prototype.spawnAttackPulseOrbs = function () {
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
            type: "attack_pulse_crystal",
            hitboxInsetX: 2,
            hitboxInsetY: 2,
            spin: slowFirst ? 5 : -5
        });
    }
};

/**
 * Spawns hunter pack projectiles.
 *
 * @return {undefined}
 */
GraveFallGame.scene.Game.prototype.spawnAttackHunterPack = function () {
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
            type: "attack_hunter_goblin",
            hitboxInsetX: 2,
            hitboxInsetY: 2,
            faceVelocity: true,
            faceVelocityOffset: -90
        });
    }
};

/**
 * Spawns a fuse minefield projectile pattern.
 *
 * @return {undefined}
 */
GraveFallGame.scene.Game.prototype.spawnAttackFuseMinefield = function () {
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
            type: "attack_fuse_minefield_bomb",
            hitboxInsetX: 4,
            hitboxInsetY: 4,
            spin: i % 2 === 0 ? 3 : -3
        });
    }
};

/**
 * Spawns the goblin boss fuse bomb projectile pattern.
 *
 * @return {undefined}
 */
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
            shrapnelCount: 6,
            shrapnelSpeed: 3.0,
            shrapnelDamage: 5,
            shrapnelLife: 150,
            shrapnelResource: "Goblin_Head_Attack_T",
            shrapnelWidth: 16,
            shrapnelHeight: 16,
            shrapnelBounce: true,
            shrapnelBouncesRemaining: 1,
            shrapnelMaxSpeed: 4.8,
            shrapnelFadeOutFrames: 14,
            type: "goblin_fuse_bomb",
            hitboxInsetX: 4,
            hitboxInsetY: 4,
            spin: i % 2 === 0 ? 3 : -3
        });
    }
};

/**
 * Spawns projectiles in a radial pattern.
 *
 * @param {Object} options Options object.
 *
 * @return {undefined}
 */
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

/**
 * Splits a projectile into child projectiles.
 *
 * @param {Object} projectile Projectile display object.
 *
 * @return {undefined}
 */
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
        type: "orb_split_child",
        spin: projectile.spin ? projectile.spin * -1 : 0
    });
};

/**
 * Explodes a projectile and spawns explosion effects.
 *
 * @param {Object} projectile Projectile display object.
 *
 * @return {undefined}
 */
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
        type: "bomb_explosion",
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
            type: "bomb_shrapnel",
            hitboxInsetX: projectile.shrapnelResource === "Goblin_Head_Attack_T" ? 3 : 2,
            hitboxInsetY: projectile.shrapnelResource === "Goblin_Head_Attack_T" ? 3 : 1,
            spin: projectile.shrapnelResource === "Goblin_Head_Attack_T" ? 7 : 8
        });
    }

    this.playSfx(GraveFallGame.SOUNDS.ATTACK_STOMP, 0.85);
    this.shakeCamera(260, 8, 6, true);
};

/**
 * Updates bounce behavior for a projectile inside bounds.
 *
 * @param {Object} projectile Projectile display object.
 * @param {Object} inner Inner.
 *
 * @return {undefined}
 */
GraveFallGame.scene.Game.prototype.updateProjectileBounce = function (projectile, inner) {
    var bounds;
    var overflow;
    var bounced = false;

    if (!projectile || projectile.bounce !== true) {
        return;
    }

    bounds = this.getCollisionBounds(projectile);

    overflow = inner.x - bounds.x;
    if (overflow > 0 && projectile.vx < 0) {
        projectile.x += overflow;
        bounds.x += overflow;
        projectile.vx *= -1;
        bounced = true;
    }

    overflow = (bounds.x + bounds.width) - (inner.x + inner.width);
    if (overflow > 0 && projectile.vx > 0) {
        projectile.x -= overflow;
        bounds.x -= overflow;
        projectile.vx *= -1;
        bounced = true;
    }

    overflow = inner.y - bounds.y;
    if (overflow > 0 && projectile.vy < 0) {
        projectile.y += overflow;
        bounds.y += overflow;
        projectile.vy *= -1;
        bounced = true;
    }

    overflow = (bounds.y + bounds.height) - (inner.y + inner.height);
    if (overflow > 0 && projectile.vy > 0) {
        projectile.y -= overflow;
        bounds.y -= overflow;
        projectile.vy *= -1;
        bounced = true;
    }

    if (bounced) {
        projectile.bouncesRemaining--;
        projectile.flippedX = projectile.vx < 0;

        if (projectile.bouncesRemaining <= 0) {
            projectile.life = Math.min(projectile.life, Math.max(12, projectile.fadeOutFrames || 12));
        }
    }
};

/**
 * Returns the center point of the nearest battle avatar.
 *
 * @param {number} x Horizontal position.
 * @param {number} y Vertical position.
 *
 * @return {Object} Resolved value.
 */
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

/**
 * Activates a projectile that was waiting for a delay.
 *
 * @param {Object} projectile Projectile display object.
 *
 * @return {undefined}
 */
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

/**
 * Clamps projectile velocity to configured speed limits.
 *
 * @param {Object} projectile Projectile display object.
 *
 * @return {undefined}
 */
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

/**
 * Sets projectile speed without changing its movement direction.
 *
 * @param {Object} projectile Projectile display object.
 * @param {Object} targetSpeed Target speed.
 *
 * @return {undefined}
 */
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

/**
 * Updates projectile rotation or facing from its velocity.
 *
 * @param {Object} projectile Projectile display object.
 *
 * @return {undefined}
 */
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

/**
 * Updates homing, acceleration, orbit, and other dynamic projectile motion.
 *
 * @param {Object} projectile Projectile display object.
 *
 * @return {undefined}
 */
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
    var entryProgress;
    var entryEase;
    var entryStartScale;

    if (!projectile) {
        return;
    }

    if (typeof projectile.spiralCenterX === "number" && typeof projectile.spiralCenterY === "number") {
        projectile.spiralAngle += projectile.spiralAngularSpeed || 0;

        if (typeof projectile.spiralRadiusX === "number" && typeof projectile.spiralRadiusY === "number") {
            if (typeof projectile.spiralEntryFrames === "number" && projectile.spiralEntryFrames > 0) {
                projectile.spiralEntryAge = Math.min(projectile.spiralEntryFrames, (projectile.spiralEntryAge || 0) + 1);
                entryProgress = projectile.spiralEntryAge / Math.max(1, projectile.spiralEntryFrames);
                entryEase = 1 - Math.pow(1 - entryProgress, 2);
                entryStartScale = typeof projectile.spiralEntryStartScale === "number" ? projectile.spiralEntryStartScale : 1.25;
                projectile.spiralScale = entryStartScale + ((1 - entryStartScale) * entryEase);

                if (projectile.spiralEntryAge >= projectile.spiralEntryFrames) {
                    projectile.spiralEntryFrames = 0;
                    projectile.spiralScale = 1;
                }
            } else {
                projectile.spiralScale = Math.max(
                    typeof projectile.spiralMinScale === "number" ? projectile.spiralMinScale : 0.25,
                    (typeof projectile.spiralScale === "number" ? projectile.spiralScale : 1) - (projectile.spiralShrinkRate || 0)
                );
            }

            projectile.spiralRadiusX = (projectile.spiralStartRadiusX || projectile.spiralRadiusX) * projectile.spiralScale;
            projectile.spiralRadiusY = (projectile.spiralStartRadiusY || projectile.spiralRadiusY) * projectile.spiralScale;
            projectile.x = projectile.spiralCenterX + (Math.cos(projectile.spiralAngle) * projectile.spiralRadiusX) - ((projectile.width || 0) / 2);
            projectile.y = projectile.spiralCenterY + (Math.sin(projectile.spiralAngle) * projectile.spiralRadiusY) - ((projectile.height || 0) / 2);

            if (projectile.spiralScale <= (projectile.spiralFadeScale || 0.35)) {
                this.beginProjectileFadeOut(projectile, projectile.fadeOutFrames || 12, true);
            }
        } else {
            projectile.spiralRadius = Math.max(
                typeof projectile.spiralMinRadius === "number" ? projectile.spiralMinRadius : 0,
                projectile.spiralRadius - (projectile.spiralRadialSpeed || 0)
            );
            projectile.x = projectile.spiralCenterX + (Math.cos(projectile.spiralAngle) * projectile.spiralRadius) - ((projectile.width || 0) / 2);
            projectile.y = projectile.spiralCenterY + (Math.sin(projectile.spiralAngle) * projectile.spiralRadius) - ((projectile.height || 0) / 2);

            if (projectile.spiralRadius <= (projectile.spiralFadeRadius || 42)) {
                this.beginProjectileFadeOut(projectile, projectile.fadeOutFrames || 12, true);
            }
        }

        if (projectile.spiralFacePath === true) {
            projectile.rotation = (projectile.spiralAngle * (180 / Math.PI)) + (projectile.spiralRotationOffset || 0) + (projectile.age * (projectile.spiralSpriteSpin || 0));
        }

        if (projectile.spiralMotionOnly === true) {
            return;
        }
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

/**
 * Starts projectile fade-out removal.
 *
 * @param {Object} projectile Projectile display object.
 * @param {number} frames Duration or count measured in frames.
 * @param {boolean} keepMotion Keep motion.
 *
 * @return {undefined}
 */
GraveFallGame.scene.Game.prototype.beginProjectileFadeOut = function (projectile, frames, keepMotion) {
    var duration;

    if (!projectile || projectile.fadingOut === true) {
        return;
    }

    duration = Math.max(1, Math.floor(frames || projectile.fadeOutFrames || 10));
    projectile.fadingOut = true;
    projectile.fadeKeepMotion = keepMotion === true;
    projectile.fadeOutTimer = duration;
    projectile.fadeOutDuration = duration;
    projectile.fadeStartAlpha = typeof projectile.alpha === "number" ? projectile.alpha : (typeof projectile.baseAlpha === "number" ? projectile.baseAlpha : 1);
    projectile.damage = 0;
    projectile.pendingDamage = 0;
    projectile.hit = false;
    projectile.hitFlashFrames = 0;
    projectile.startDelay = 0;

    if (keepMotion !== true) {
        projectile.vx = (projectile.vx || 0) * 0.35;
        projectile.vy = (projectile.vy || 0) * 0.35;
        projectile.accelX = 0;
        projectile.accelY = 0;
        projectile.homingFrames = 0;
    }
};

/**
 * Removes one projectile from the active projectile list.
 *
 * @param {number} index Index to resolve.
 * @param {boolean} immediate Immediate.
 *
 * @return {undefined}
 */
GraveFallGame.scene.Game.prototype.removeProjectileAt = function (index, immediate) {
    var projectile = this.projectiles[index];

    if (!projectile) {
        return;
    }

    if (immediate !== true && projectile.fadingOut !== true) {
        this.beginProjectileFadeOut(projectile, projectile.fadeOutFrames || 10, false);
        return;
    }

    if (projectile.parent) {
        projectile.parent.removeChild(projectile, true);
    }

    this.projectiles.splice(index, 1);
};

/**
 * Returns collision leeway for projectile hitboxes.
 *
 * @param {Object} options Options object.
 *
 * @return {number} Resolved numeric value.
 */
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

/**
 * Returns collision bounds for an object at a proposed position.
 *
 * @param {Object} object Display object to measure or clamp.
 * @param {number} x Horizontal position.
 * @param {number} y Vertical position.
 *
 * @return {Object} Resolved value.
 */
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

/**
 * Returns current collision bounds for an object.
 *
 * @param {Object} object Display object to measure or clamp.
 *
 * @return {Object} Resolved value.
 */
GraveFallGame.scene.Game.prototype.getCollisionBounds = function (object) {
    return this.getCollisionBoundsAt(object);
};

/**
 * Checks whether two bounds objects overlap.
 *
 * @param {Object} aBounds A bounds.
 * @param {Object} bBounds B bounds.
 *
 * @return {boolean} True if the condition is met.
 */
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

/**
 * Checks whether two rectangle-like objects overlap.
 *
 * @param {Object} a A.
 * @param {Object} b B.
 *
 * @return {boolean} True if the condition is met.
 */
GraveFallGame.scene.Game.prototype.rectsOverlap = function (a, b) {
    return this.rectBoundsOverlap(this.getCollisionBounds(a), this.getCollisionBounds(b));
};

/**
 * Checks whether a battle avatar would collide at a proposed position.
 *
 * @param {Object} playerMenu Player menu state object.
 * @param {number} testX Test x.
 * @param {number} testY Test y.
 *
 * @return {boolean} True if the condition is met.
 */
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

/**
 * Updates player hit flicker timers and visibility.
 *
 * @param {Object} playerMenu Player menu state object.
 *
 * @return {undefined}
 */
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

/**
 * Checks projectile collisions against player battle avatars.
 *
 * @return {undefined}
 */
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

/**
 * Updates all active projectiles and removes expired ones.
 *
 * @return {undefined}
 */
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

        if (projectile.fadingOut === true) {
            if (projectile.fadeKeepMotion === true) {
                projectile.age++;

                if (projectile.spin) {
                    projectile.rotation += projectile.spin;
                }

                this.updateProjectileDynamicMotion(projectile);
                projectile.x += projectile.vx || 0;
                projectile.y += projectile.vy || 0;
                this.updateProjectileBounce(projectile, inner);
                this.updateProjectileFacing(projectile);
            }

            projectile.fadeOutTimer--;
            projectile.alpha = Math.max(0, (projectile.fadeStartAlpha || 1) * (projectile.fadeOutTimer / Math.max(1, projectile.fadeOutDuration || 1)));

            if (projectile.fadeOutTimer <= 0) {
                this.removeProjectileAt(i, true);
            }

            continue;
        }

        if (projectile.hit) {
            projectile.hitFlashFrames--;
            projectile.alpha = projectile.hitFlashFrames % 2 === 0 ? 0.15 : 1;

            if (projectile.hitFlashFrames <= 0) {
                this.beginProjectileFadeOut(projectile, projectile.fadeOutFrames || 8, false);
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
            this.beginProjectileFadeOut(projectile, Math.max(1, projectile.life), true);
            continue;
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
                this.removeProjectileAt(i, true);
                continue;
            }

            this.removeProjectileAt(i, outsideBounds === true);
        }
    }
};

/**
 * Returns clamp bounds for an object at a proposed position.
 *
 * @param {Object} object Display object to measure or clamp.
 * @param {number} x Horizontal position.
 * @param {number} y Vertical position.
 *
 * @return {Object} Resolved value.
 */
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
    insetLeft = typeof object.hitboxClampInsetLeft === "number" ? object.hitboxClampInsetLeft : 0;
    insetTop = typeof object.hitboxClampInsetTop === "number" ? object.hitboxClampInsetTop : 0;
    insetRight = typeof object.hitboxClampInsetRight === "number" ? object.hitboxClampInsetRight : insetLeft;
    insetBottom = typeof object.hitboxClampInsetBottom === "number" ? object.hitboxClampInsetBottom : insetTop;

    insetLeft = Math.max(-width, Math.min(width / 2, insetLeft));
    insetRight = Math.max(-width, Math.min(width - insetLeft, insetRight));
    insetTop = Math.max(-height, Math.min(height / 2, insetTop));
    insetBottom = Math.max(-height, Math.min(height - insetTop, insetBottom));

    return {
        x: boundsX + insetLeft,
        y: boundsY + insetTop,
        width: Math.max(0, width - insetLeft - insetRight),
        height: Math.max(0, height - insetTop - insetBottom)
    };
};

/**
 * Clamps an object position so its hitbox remains inside bounds.
 *
 * @param {Object} object Display object to measure or clamp.
 * @param {number} x Horizontal position.
 * @param {number} y Vertical position.
 * @param {Object} bounds Bounds.
 *
 * @return {number} Resolved numeric value.
 */
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
