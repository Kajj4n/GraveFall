//------------------------------------------------------------------------------
// GraveFall dev console commands
//------------------------------------------------------------------------------
// Rune debug console notes:
// - Main enables Rune debug mode, which exposes application.screen.console.
// - The Rune console command register is application.screen.console.commands.
// - Commands are deliberately namespaced as gf.<category>.<action> so they are
//   easy to find while bugtesting and easy to remove before release.
//------------------------------------------------------------------------------


GraveFallGame.scene.Game.DEV_CONSOLE_SAFE_LINE_LENGTH = 42;

GraveFallGame.scene.Game.installDevConsoleOutputGuard = function () {
    var proto;

    if (typeof rune === "undefined" || !rune.console || !rune.console.ConsoleOutput) {
        return;
    }

    proto = rune.console.ConsoleOutput.prototype;

    if (!proto || proto.__graveFallSafeRenderer === true) {
        return;
    }

    proto.__graveFallSafeRenderer = true;
    proto.__graveFallOriginalRenderCharacter = proto.m_renderCharacter;

    // Rune's console input renderer already skips missing glyphs, but the
    // output renderer assumes every character exists in the bitmap font.
    // Dev commands often print dynamic text, so guard output locally instead
    // of editing lib/rune.js. Unsupported characters render as spaces.
    proto.m_renderCharacter = function (characterCode, x, y) {
        var rect;
        var format;

        if (!this.m_console || !this.m_console.format || !this.m_console.canvas) {
            return;
        }

        format = this.m_console.format;
        rect = format.getCharRect(characterCode) || format.getCharRect(32);

        if (!rect) {
            return;
        }

        this.m_console.canvas.drawImage(
            format.texture,
            x,
            y,
            rect.width,
            rect.height,
            rect.x,
            rect.y,
            rect.width,
            rect.height
        );
    };
};

GraveFallGame.scene.Game.DEV_COMMAND_NAMES = [
    "gf.help",
    "gf.enemy.list",
    "gf.enemy.load",
    "gf.enemy.kill",
    "gf.enemy.damage",
    "gf.enemy.hp",
    "gf.pattern.list",
    "gf.pattern.spawn",
    "gf.player.heal",
    "gf.player.down",
    "gf.player.hp",
    "gf.item.all",
    "gf.item.give",
    "gf.phase.command",
    "gf.phase.action",
    "gf.score.add",
    "gf.score.set"
];

GraveFallGame.scene.Game.prototype.getDevConsoleManager = function () {
    if (!this.application || !this.application.screen || !this.application.screen.console) {
        return null;
    }

    return this.application.screen.console;
};

GraveFallGame.scene.Game.prototype.registerDevConsoleCommand = function (commands, name, callback) {
    var scene = this;

    commands.create(name, function () {
        var result;

        try {
            result = callback.apply(scene, arguments);
        } catch (error) {
            result = "Command error: " + (error && error.message ? error.message : error);
        }

        return scene.sanitizeDevConsoleResult(result);
    }, this);
};

GraveFallGame.scene.Game.prototype.sanitizeDevConsoleResult = function (value) {
    var text;
    var lines;
    var safeLines = [];
    var maxLength = GraveFallGame.scene.Game.DEV_CONSOLE_SAFE_LINE_LENGTH || 42;
    var i;
    var line;

    if (value === null || typeof value === "undefined") {
        return "";
    }

    text = String(value);
    text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    text = text.replace(/[^\x20-\x7E\n]/g, " ");
    lines = text.split("\n");

    for (i = 0; i < lines.length; i++) {
        line = lines[i];

        while (line.length > maxLength) {
            safeLines.push(line.substr(0, maxLength));
            line = line.substr(maxLength);
        }

        safeLines.push(line);
    }

    return safeLines.join("\n");
};

GraveFallGame.scene.Game.prototype.registerDevConsoleCommands = function () {
    GraveFallGame.scene.Game.installDevConsoleOutputGuard();

    var consoleManager = this.getDevConsoleManager();
    var commands;

    if (!consoleManager || !consoleManager.commands) {
        return;
    }

    commands = consoleManager.commands;
    this.unregisterDevConsoleCommands(commands);

    this.registerDevConsoleCommand(commands, "gf.help", this.devCommandHelp);
    this.registerDevConsoleCommand(commands, "gf.enemy.list", this.devCommandEnemyList);
    this.registerDevConsoleCommand(commands, "gf.enemy.load", this.devCommandEnemyLoad);
    this.registerDevConsoleCommand(commands, "gf.enemy.kill", this.devCommandEnemyKill);
    this.registerDevConsoleCommand(commands, "gf.enemy.damage", this.devCommandEnemyDamage);
    this.registerDevConsoleCommand(commands, "gf.enemy.hp", this.devCommandEnemyHp);
    this.registerDevConsoleCommand(commands, "gf.pattern.list", this.devCommandPatternList);
    this.registerDevConsoleCommand(commands, "gf.pattern.spawn", this.devCommandPatternSpawn);
    this.registerDevConsoleCommand(commands, "gf.player.heal", this.devCommandPlayerHeal);
    this.registerDevConsoleCommand(commands, "gf.player.down", this.devCommandPlayerDown);
    this.registerDevConsoleCommand(commands, "gf.player.hp", this.devCommandPlayerHp);
    this.registerDevConsoleCommand(commands, "gf.item.all", this.devCommandItemAll);
    this.registerDevConsoleCommand(commands, "gf.item.give", this.devCommandItemGive);
    this.registerDevConsoleCommand(commands, "gf.phase.command", this.devCommandPhaseCommand);
    this.registerDevConsoleCommand(commands, "gf.phase.action", this.devCommandPhaseAction);
    this.registerDevConsoleCommand(commands, "gf.score.add", this.devCommandScoreAdd);
    this.registerDevConsoleCommand(commands, "gf.score.set", this.devCommandScoreSet);

    if (typeof consoleManager.log === "function") {
        consoleManager.log("[GraveFall dev] Commands ready. Type gf.help");
    }
};

GraveFallGame.scene.Game.prototype.unregisterDevConsoleCommands = function (commands) {
    var commandList = GraveFallGame.scene.Game.DEV_COMMAND_NAMES;
    var i;
    var safety;

    commands = commands || (this.getDevConsoleManager() && this.getDevConsoleManager().commands);

    if (!commands || typeof commands.remove !== "function") {
        return;
    }

    // Rune's remove() deletes the first match only, so repeat defensively in
    // case a scene reload registered a duplicate during testing.
    for (i = 0; i < commandList.length; i++) {
        for (safety = 0; safety < 8; safety++) {
            commands.remove(commandList[i]);
        }
    }
};

GraveFallGame.scene.Game.prototype.devCommandHelp = function (section) {
    section = String(section || "all").toLowerCase();

    if (section === "enemy" || section === "enemies") {
        return [
            "Enemy commands:",
            "gf.enemy.list",
            "gf.enemy.load enemyId",
            "gf.enemy.kill enemyId OR gf.enemy.kill",
            "gf.enemy.damage amount",
            "gf.enemy.hp amount"
        ].join("\n");
    }

    if (section === "player" || section === "players") {
        return [
            "Player commands:",
            "gf.player.heal all OR player",
            "gf.player.down all OR player",
            "gf.player.hp target amount",
            "Targets: all, 1-4, or character id."
        ].join("\n");
    }

    if (section === "item" || section === "items") {
        return [
            "Item commands:",
            "gf.item.all count",
            "gf.item.give target item count"
        ].join("\n");
    }

    if (section === "pattern" || section === "patterns") {
        return [
            "Pattern commands:",
            "gf.pattern.list",
            "gf.pattern.spawn patternId count",
            "Spawning a pattern auto-enters action phase if needed."
        ].join("\n");
    }

    return [
        "GraveFall dev commands:",
        "gf.help enemy OR player OR item OR pattern",
        "gf.enemy.load enemyId",
        "gf.enemy.kill enemyId OR gf.enemy.kill",
        "gf.player.heal all OR player",
        "gf.item.all count",
        "gf.pattern.spawn patternId count",
        "gf.phase.command OR gf.phase.action",
        "gf.score.add amount OR gf.score.set amount"
    ].join("\n");
};

GraveFallGame.scene.Game.prototype.getDevEnemyIds = function () {
    var enemies = GraveFallGame.scene.Game.ENEMIES || {};
    var enemyIds = [];
    var id;

    for (id in enemies) {
        if (enemies.hasOwnProperty(id)) {
            enemyIds.push(id);
        }
    }

    enemyIds.sort();
    return enemyIds;
};

GraveFallGame.scene.Game.prototype.resolveDevEnemyId = function (enemyId) {
    var ids = this.getDevEnemyIds();
    var search = String(enemyId || "").toLowerCase();
    var i;
    var config;

    if (search === "") {
        return null;
    }

    for (i = 0; i < ids.length; i++) {
        if (ids[i].toLowerCase() === search) {
            return ids[i];
        }
    }

    for (i = 0; i < ids.length; i++) {
        config = GraveFallGame.scene.Game.ENEMIES[ids[i]];
        if (config && config.name && config.name.toLowerCase() === search) {
            return ids[i];
        }
    }

    return null;
};

GraveFallGame.scene.Game.prototype.devCommandEnemyList = function () {
    var ids = this.getDevEnemyIds();
    var lines = ["Enemies:"];
    var i;
    var config;

    for (i = 0; i < ids.length; i++) {
        config = GraveFallGame.scene.Game.ENEMIES[ids[i]];
        lines.push(ids[i] + " - " + (config ? config.name : "?") + " HP " + (config ? config.hpMax : "?"));
    }

    return lines.join("\n");
};

GraveFallGame.scene.Game.prototype.devPrepareImmediateBattle = function () {
    if (this.backgroundBackdropResource !== "Background_Test") {
        this.setPassageBackground("Background_Test", this.uiSkin || GraveFallGame.scene.Game.UI_SKINS.dullBrown, false);
    }

    this.passageTransitionIsIntro = false;
    this.passageTransitionEncounterLoaded = true;
    this.passageTransitionCorpseHidden = true;
    this.passageTransitionStepsPlayed = true;
    this.passageTransitionPartyRevealed = true;
    this.passageTransitionActionsShown = true;
    this.enemyFadeTimerMs = this.enemyFadeDurationMs;

    this.resetPassageCameraTransition();
    this.clearProjectiles();
    this.clearArenaItem();
    this.clearBuffVisualEffects();
    this.hideActionPrompt();

    if (typeof this.clearActionPreviewState === "function") {
        this.clearActionPreviewState();
    }

    if (typeof this.clearAllHealingStandAnimations === "function") {
        this.clearAllHealingStandAnimations(true);
    }

    this.setBattleArenaVisible(false);
    this.setEnemyUiAlpha(1);
    this.setPlayerTransitionVisibility(true, true);
    this.setPlayerTransitionAlpha(1, 1);

    this.phase = GraveFallGame.scene.Game.PHASE_COMMAND;
    this.actionPhaseTimer = 0;
    this.nextPatternIn = 0;
    this.actionPhaseStartDelayFrames = 0;
    this.turnTimerMs = 25000;
    this.lastTurnWarningSecond = null;

    if (this.turnTimerText) {
        this.turnTimerText.visible = true;
        this.turnTimerText.alpha = 1;
        this.turnTimerText.text = "25";
    }

    this.startDungeonMusic();
    this.resetPlayersForNewEncounter();
    this.resetPlayerMenusForCommandPhase();
    this.setPlayerActionMenusVisible(true);
    this.commandMenuResetDone = true;
};

GraveFallGame.scene.Game.prototype.devLoadEnemyById = function (enemyId) {
    var resolvedId = this.resolveDevEnemyId(enemyId);

    if (!resolvedId) {
        return null;
    }

    this.devPrepareImmediateBattle();
    this.loadEnemyEncounter(resolvedId, false);
    this.devPrepareImmediateBattle();
    this.updateEnemyHealthBarUi();
    this.updateEnemyDamageState();

    return resolvedId;
};

GraveFallGame.scene.Game.prototype.devCommandEnemyLoad = function (enemyId) {
    var resolvedId = this.devLoadEnemyById(enemyId);

    if (!resolvedId) {
        return "Usage: gf.enemy.load enemyId\n" + this.devCommandEnemyList();
    }

    return "Loaded enemy: " + resolvedId + " (" + this.getCurrentEnemyConfig().name + ")";
};

GraveFallGame.scene.Game.prototype.devCommandEnemyKill = function (enemyId) {
    var resolvedId = null;

    if (enemyId) {
        resolvedId = this.devLoadEnemyById(enemyId);
        if (!resolvedId) {
            return "Unknown enemy: " + enemyId;
        }
    } else {
        this.devPrepareImmediateBattle();
        resolvedId = this.currentEnemyType;
    }

    this.enemyHealthCurrent = 0;
    this.updateEnemyHealthBarUi();
    this.updateEnemyDamageState();
    this.phase = GraveFallGame.scene.Game.PHASE_COMMAND;
    this.startEnemyDefeatedSequence();

    return "Killed enemy: " + resolvedId;
};

GraveFallGame.scene.Game.prototype.devCommandEnemyDamage = function (amount) {
    var damage = parseInt(amount, 10);

    if (isNaN(damage)) {
        return "Usage: gf.enemy.damage amount";
    }

    this.devPrepareImmediateBattle();
    this.enemyHealthCurrent = Math.max(0, this.enemyHealthCurrent - Math.max(0, damage));
    this.updateEnemyHealthBarUi();
    this.updateEnemyDamageState();

    if (this.enemyHealthCurrent <= 0) {
        this.phase = GraveFallGame.scene.Game.PHASE_COMMAND;
        this.startEnemyDefeatedSequence();
        return "Enemy damage applied. Enemy defeated.";
    }

    return "Enemy HP: " + this.enemyHealthCurrent + "/" + this.enemyHealthMax;
};

GraveFallGame.scene.Game.prototype.devCommandEnemyHp = function (amount) {
    var hp = parseInt(amount, 10);

    if (isNaN(hp)) {
        return "Usage: gf.enemy.hp amount";
    }

    this.devPrepareImmediateBattle();
    this.enemyHealthCurrent = Math.max(0, Math.min(this.enemyHealthMax, hp));
    this.updateEnemyHealthBarUi();
    this.updateEnemyDamageState();

    return "Enemy HP set to " + this.enemyHealthCurrent + "/" + this.enemyHealthMax;
};

GraveFallGame.scene.Game.prototype.getDevPatternIds = function () {
    var enemies = GraveFallGame.scene.Game.ENEMIES || {};
    var seen = {};
    var patterns = [];
    var enemyId;
    var i;
    var patternId;

    for (enemyId in enemies) {
        if (enemies.hasOwnProperty(enemyId) && enemies[enemyId].patterns) {
            for (i = 0; i < enemies[enemyId].patterns.length; i++) {
                patternId = enemies[enemyId].patterns[i];
                if (seen[patternId] !== true) {
                    seen[patternId] = true;
                    patterns.push(patternId);
                }
            }
        }
    }

    patterns.sort();
    return patterns;
};

GraveFallGame.scene.Game.prototype.resolveDevPatternId = function (patternId) {
    var patterns = this.getDevPatternIds();
    var search = String(patternId || "").toLowerCase();
    var i;

    for (i = 0; i < patterns.length; i++) {
        if (patterns[i].toLowerCase() === search) {
            return patterns[i];
        }
    }

    return null;
};

GraveFallGame.scene.Game.prototype.devCommandPatternList = function () {
    return "Patterns:\n" + this.getDevPatternIds().join("\n");
};

GraveFallGame.scene.Game.prototype.devEnsureActionPhaseForPatternTest = function () {
    this.devPrepareImmediateBattle();

    if (this.phase !== GraveFallGame.scene.Game.PHASE_ACTION) {
        this.commandActionsResolved = true;
        this.phase = GraveFallGame.scene.Game.PHASE_ACTION;
        this.actionPhaseTimer = this.getCurrentEnemyConfig().actionPhaseDuration;
        this.nextPatternIn = 999999;
        this.actionPhaseStartDelayFrames = 0;
        this.clearProjectiles();
        this.setBattleArenaVisible(true);
        this.layoutBattleAvatarsInArena();
        this.turnTimerText.alpha = 0;

        for (var i = 0; i < this.playerMenus.length; i++) {
            this.playerMenus[i].container.y = this.playerMenus[i].confirmedY;
            this.playerMenus[i].hitCooldown = 0;
            this.playerMenus[i].moveSpeed = this.calculateEffectiveMoveSpeed(this.playerMenus[i]);
            this.activateBattleAvatar(this.playerMenus[i]);
        }
    }
};

GraveFallGame.scene.Game.prototype.devCommandPatternSpawn = function (patternId, count) {
    var resolvedId = this.resolveDevPatternId(patternId);
    var spawnCount = parseInt(count, 10);
    var i;

    if (!resolvedId) {
        return "Usage: gf.pattern.spawn patternId count\nType gf.pattern.list";
    }

    if (isNaN(spawnCount) || spawnCount < 1) {
        spawnCount = 1;
    }

    spawnCount = Math.min(spawnCount, 8);
    this.devEnsureActionPhaseForPatternTest();

    for (i = 0; i < spawnCount; i++) {
        this.playEnemyPatternSfx(resolvedId);
        this.spawnEnemyPatternById(resolvedId);
    }

    return "Spawned pattern " + resolvedId + " x" + spawnCount;
};

GraveFallGame.scene.Game.prototype.resolveDevPlayers = function (target) {
    var players = [];
    var search = String(target || "all").toLowerCase();
    var rawIndex;
    var index;
    var i;
    var menu;

    if (search === "all" || search === "party" || search === "everyone") {
        for (i = 0; i < this.playerMenus.length; i++) {
            players.push(this.playerMenus[i]);
        }
        return players;
    }

    rawIndex = parseInt(search, 10);
    if (!isNaN(rawIndex)) {
        index = rawIndex <= 0 ? 0 : rawIndex - 1;
        if (this.playerMenus[index]) {
            players.push(this.playerMenus[index]);
        }
        return players;
    }

    for (i = 0; i < this.playerMenus.length; i++) {
        menu = this.playerMenus[i];
        if ((menu.characterId && menu.characterId.toLowerCase() === search) ||
            (menu.characterName && menu.characterName.toLowerCase() === search)) {
            players.push(menu);
            return players;
        }
    }

    return players;
};

GraveFallGame.scene.Game.prototype.devRefreshPlayersAfterHealthChange = function (players) {
    var i;

    for (i = 0; i < players.length; i++) {
        this.updatePlayerHealthUi(players[i]);
        this.updateCharacterMenuVisuals(players[i]);
    }

    this.updateAllPlayerDamageStates();

    if (this.phase === GraveFallGame.scene.Game.PHASE_ACTION) {
        this.layoutBattleAvatarsInArena();
    }
};

GraveFallGame.scene.Game.prototype.devCommandPlayerHeal = function (target) {
    var players = this.resolveDevPlayers(target || "all");
    var i;

    if (players.length <= 0) {
        return "No matching player: " + target;
    }

    for (i = 0; i < players.length; i++) {
        players[i].healthCurrent = players[i].healthMax;
        players[i].hideUntilNextEncounter = false;
        players[i].revivedFromEnemyDefeat = false;
        if (this.phase === GraveFallGame.scene.Game.PHASE_ACTION) {
            this.activateBattleAvatar(players[i]);
        }
    }

    this.devRefreshPlayersAfterHealthChange(players);
    return "Healed players: " + players.length;
};

GraveFallGame.scene.Game.prototype.devCommandPlayerDown = function (target) {
    var players = this.resolveDevPlayers(target || "all");
    var i;

    if (players.length <= 0) {
        return "No matching player: " + target;
    }

    for (i = 0; i < players.length; i++) {
        players[i].healthCurrent = 0;
        if (this.phase === GraveFallGame.scene.Game.PHASE_ACTION) {
            this.deactivateBattleAvatar(players[i]);
        }
    }

    this.devRefreshPlayersAfterHealthChange(players);
    return "Downed players: " + players.length;
};

GraveFallGame.scene.Game.prototype.devCommandPlayerHp = function (target, amount) {
    var players = this.resolveDevPlayers(target || "all");
    var hp = parseInt(amount, 10);
    var i;

    if (players.length <= 0) {
        return "No matching player: " + target;
    }

    if (isNaN(hp)) {
        return "Usage: gf.player.hp target amount";
    }

    for (i = 0; i < players.length; i++) {
        players[i].healthCurrent = Math.max(0, Math.min(players[i].healthMax, hp));
    }

    this.devRefreshPlayersAfterHealthChange(players);
    return "Set player HP for " + players.length + " players.";
};

GraveFallGame.scene.Game.prototype.resolveDevItemType = function (itemType) {
    var search = String(itemType || "").toLowerCase();

    if (search === "all" || search === "*") return "all";
    if (search === "maxhp" || search === "max_hp" || search === "hp" || search === "health") return "maxHp";
    if (search === "attack" || search === "atk" || search === "damage") return "attack";
    if (search === "defense" || search === "defence" || search === "def" || search === "shield") return "defense";
    if (search === "speed" || search === "spd" || search === "move") return "speed";

    return null;
};

GraveFallGame.scene.Game.prototype.devGiveItems = function (players, itemType, count) {
    var itemTypes = GraveFallGame.scene.Game.ITEM_BUFF_TYPES || ["maxHp", "attack", "defense", "speed"];
    var types = itemType === "all" ? itemTypes : [itemType];
    var amount = Math.max(1, Math.min(99, count || 1));
    var p;
    var t;
    var n;

    for (p = 0; p < players.length; p++) {
        if (!players[p].itemInventory) {
            players[p].itemInventory = { maxHp: 0, attack: 0, defense: 0, speed: 0 };
        }

        for (t = 0; t < types.length; t++) {
            for (n = 0; n < amount; n++) {
                this.givePlayerItem(players[p], types[t]);
            }
        }

        this.updateCharacterMenuVisuals(players[p]);
    }
};

GraveFallGame.scene.Game.prototype.devCommandItemAll = function (count) {
    var players = this.resolveDevPlayers("all");
    var amount = parseInt(count, 10);

    if (isNaN(amount)) {
        amount = 1;
    }

    this.devGiveItems(players, "all", amount);
    return "Gave every item x" + amount + " to every player.";
};

GraveFallGame.scene.Game.prototype.devCommandItemGive = function (target, itemType, count) {
    var players = this.resolveDevPlayers(target || "all");
    var resolvedType = this.resolveDevItemType(itemType || "all");
    var amount = parseInt(count, 10);

    if (players.length <= 0) {
        return "No matching player: " + target;
    }

    if (!resolvedType) {
        return "Usage: gf.item.give target item count";
    }

    if (isNaN(amount)) {
        amount = 1;
    }

    this.devGiveItems(players, resolvedType, amount);
    return "Gave " + resolvedType + " x" + amount + " to " + players.length + " players.";
};

GraveFallGame.scene.Game.prototype.devCommandPhaseCommand = function () {
    this.devPrepareImmediateBattle();
    return "Entered command phase.";
};

GraveFallGame.scene.Game.prototype.devCommandPhaseAction = function () {
    this.devEnsureActionPhaseForPatternTest();
    this.nextPatternIn = 0;
    return "Entered action phase.";
};

GraveFallGame.scene.Game.prototype.devCommandScoreAdd = function (amount) {
    var scoreAmount = parseInt(amount, 10);

    if (isNaN(scoreAmount)) {
        return "Usage: gf.score.add amount";
    }

    this.changeScore(scoreAmount);
    return "Score: " + this.score;
};

GraveFallGame.scene.Game.prototype.devCommandScoreSet = function (amount) {
    var scoreAmount = parseInt(amount, 10);

    if (isNaN(scoreAmount)) {
        return "Usage: gf.score.set amount";
    }

    this.score = Math.max(0, scoreAmount);
    this.updateScoreUi();
    return "Score: " + this.score;
};
