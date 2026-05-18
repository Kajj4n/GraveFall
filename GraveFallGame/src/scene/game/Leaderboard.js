// -----------------------------------------------------------------------------
// IMPORTANT: YOU MUST ADD <script src="js/scene/Leaderboard.js"></script> 
// TO YOUR index.html FILE FOR THIS SCENE TO LOAD WITHOUT CRASHING!
// -----------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Constructor scope
//------------------------------------------------------------------------------

/**
 * Creates a new object.
 *
 * @constructor
 * @extends rune.scene.Scene
 *
 * @class
 * @classdesc
 * Leaderboard scene.
 */
GraveFallGame.scene.Leaderboard = function (initialTab) {
    this.pageIndex = initialTab ? Math.max(0, Math.min(3, initialTab - 1)) : 0;
    this.pageContainer = null;
    this.tabs = null;
    this.backgroundSkin = null;
    this.menuSkin = null;

    rune.scene.Scene.call(this);
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

GraveFallGame.scene.Leaderboard.prototype = Object.create(rune.scene.Scene.prototype);
GraveFallGame.scene.Leaderboard.prototype.constructor = GraveFallGame.scene.Leaderboard;

//------------------------------------------------------------------------------
// Shared helpers
//------------------------------------------------------------------------------

GraveFallGame.scene.Leaderboard.prototype.applyPaletteSwaps = GraveFallGame.scene.Game.prototype.applyPaletteSwaps;
GraveFallGame.scene.Leaderboard.prototype.getFramePaletteSwaps = GraveFallGame.scene.Game.prototype.getFramePaletteSwaps;
GraveFallGame.scene.Leaderboard.prototype.applyMonochromeIconColor = GraveFallGame.scene.Game.prototype.applyMonochromeIconColor;
GraveFallGame.scene.Leaderboard.prototype.createBoxFrame = GraveFallGame.scene.Game.prototype.createBoxFrame;
GraveFallGame.scene.Leaderboard.prototype.createSeparator = GraveFallGame.scene.Game.prototype.createSeparator;
GraveFallGame.scene.Leaderboard.prototype.createFramePiece = GraveFallGame.scene.Game.prototype.createFramePiece;
GraveFallGame.scene.Leaderboard.prototype.tintBitmapFieldText = GraveFallGame.scene.Game.prototype.tintBitmapFieldText;
GraveFallGame.scene.Leaderboard.prototype.isDevConsoleInputActive = GraveFallGame.scene.Game.prototype.isDevConsoleInputActive;

//------------------------------------------------------------------------------
// Overrides
//------------------------------------------------------------------------------

GraveFallGame.scene.Leaderboard.prototype.sanitizeBitmapText = function (text) {
    var safeText;

    safeText = text === undefined || text === null ? "" : String(text);
    safeText = safeText.toUpperCase();
    safeText = safeText.replace(/[^A-Z0-9 \-.:,!?\/\[\]\(\)\+]/g, " ");
    safeText = safeText.replace(/\s{2,}/g, " ").trim();

    return safeText;
};

GraveFallGame.scene.Leaderboard.prototype.init = function () {
    rune.scene.Scene.prototype.init.call(this);
    var screen = this.application.screen;
    var palette = GraveFallGame.scene.Game.getRunPalette(
        GraveFallGame.scene.Game.resolveRunPaletteKey(GraveFallGame.scene.Game.ACTIVE_RUN_PALETTE_KEY)
    );
    this.backgroundSkin = palette.outside;
    this.menuSkin = palette.inside;
    var framePaletteSwaps = this.getFramePaletteSwaps(this.menuSkin);

    var background = new rune.display.Sprite(0, 0, screen.width, screen.height, "Outside_Campfire");
    this.applyPaletteSwaps(background, this.getFramePaletteSwaps(this.backgroundSkin));
    this.stage.addChild(background);

    var shell = new rune.display.DisplayObjectContainer(42, 26, screen.width - 84, screen.height - 94);
    var top = new rune.display.Graphic(0, 0, shell.width, Math.round(shell.height * 0.45));
    var bottom = new rune.display.Graphic(0, Math.round(shell.height * 0.45), shell.width, shell.height - Math.round(shell.height * 0.45));
    var accent = new rune.display.Graphic(16, 16, shell.width - 32, 4);
    
    top.backgroundColor = this.menuSkin.panelTop;
    bottom.backgroundColor = this.menuSkin.panelBottom;
    accent.backgroundColor = this.menuSkin.frame.mid;
    
    shell.addChild(top);
    shell.addChild(bottom);
    shell.addChild(accent);
    shell.addChild(this.createBoxFrame(0, 0, shell.width, shell.height, framePaletteSwaps));
    this.stage.addChild(shell);

    var title = new rune.text.BitmapField(this.sanitizeBitmapText ? this.sanitizeBitmapText("HALL OF FAME") : "HALL OF FAME");
    title.width = 1000;
    title.scaleX = 3.3; title.scaleY = 3.3;
    title.x = Math.round(screen.centerX - ((title.text.length * 6 * 3.3) / 2));
    title.y = 56;
    this.stage.addChild(title);

    this.createPageTabs();

    var footer = new rune.display.DisplayObjectContainer(0, screen.height - 62, screen.width, 62);
    footer.backgroundColor = this.menuSkin.panelBottom;
    footer.addChild(this.createSeparator(0, 0, screen.width, framePaletteSwaps));
    this.stage.addChild(footer);

    var footerText = new rune.text.BitmapField(this.sanitizeBitmapText ? this.sanitizeBitmapText("LEFT/RIGHT OR D-PAD CHANGE TAB    B/BACKSPACE/ESC RETURN TO MENU") : "LEFT/RIGHT OR D-PAD CHANGE TAB    B/BACKSPACE/ESC RETURN TO MENU");
    footerText.width = 1200;
    footerText.scaleX = 1.2; footerText.scaleY = 1.2;
    footerText.x = Math.round(screen.centerX - ((footerText.text.length * 6 * 1.2) / 2));
    footerText.y = 24;
    footer.addChild(footerText);
    this.tintBitmapFieldText(footerText, this.menuSkin.frame.light, true);

    this.renderPage();
};

GraveFallGame.scene.Leaderboard.prototype.createPageTabs = function () {
    var i;
    var tab;
    var text;
    var x = 186;
    var y = 142;
    var w = 214;
    var h = 38;
    var color;

    this.tabs = [];

    var labels = ["1 PLAYER", "2 PLAYERS", "3 PLAYERS", "4 PLAYERS"];

    for (i = 0; i < 4; i++) {
        color = GraveFallGame.scene.Game.PLAYER_THEMES[i].accent;
        tab = new rune.display.DisplayObjectContainer(x + (i * (w + 12)), y, w, h);
        tab.backgroundColor = this.menuSkin.panelBottom;
        tab.tabStripe = new rune.display.Graphic(0, 0, w, 4);
        tab.tabStripe.backgroundColor = color;
        tab.addChild(tab.tabStripe);
        tab.addChild(this.createBoxFrame(0, 0, w, h, this.getFramePaletteSwaps(this.menuSkin)));
        
        text = new rune.text.BitmapField(labels[i]);
        text.width = 200;
        text.scaleX = 1.15; text.scaleY = 1.15;
        text.x = Math.round((w / 2) - ((labels[i].length * 6 * 1.15) / 2));
        text.y = 13;
        tab.addChild(text);
        this.stage.addChild(tab);
        this.tabs.push(tab);
    }
};

GraveFallGame.scene.Leaderboard.prototype.getLeaderboardScores = function (partySize) {
    var scores = [];
    var parsed;
    var raw;
    var key;
    var i;
    var entry;

    try {
        if (typeof GraveFallGame.scene.Game.getHighscores === "function") {
            parsed = GraveFallGame.scene.Game.getHighscores(partySize);
            if (Array.isArray(parsed)) {
                scores = parsed.slice();
            }
        } else if (typeof window !== "undefined" && window.localStorage) {
            key = typeof GraveFallGame.scene.Game.getLeaderboardStorageKey === "function"
                ? GraveFallGame.scene.Game.getLeaderboardStorageKey(partySize)
                : "gravefall_highscores_" + (partySize || 1);

            raw = window.localStorage.getItem(key);
            if (raw) {
                parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    for (i = 0; i < parsed.length; i++) {
                        entry = parsed[i];
                        if (entry && typeof entry.score === "number") {
                            scores.push(entry);
                        }
                    }
                }
            }
        }
    } catch (e) {
        scores = [];
    }

    scores = scores
        .filter(function (entry) {
            return entry && typeof entry.score === "number";
        })
        .sort(function (a, b) {
            return b.score - a.score;
        })
        .slice(0, 10);

    return scores;
};

GraveFallGame.scene.Leaderboard.prototype.renderPage = function () {
    var i;
    var scores;
    var startY;
    var partySize;

    if (this.pageContainer && this.pageContainer.parent) {
        this.pageContainer.parent.removeChild(this.pageContainer, true);
    }

    this.pageContainer = new rune.display.DisplayObjectContainer(74, 198, 1132, 414);
    this.stage.addChild(this.pageContainer);

    partySize = this.pageIndex + 1;
    scores = this.getLeaderboardScores(partySize);
    startY = 30;

    if (scores.length === 0) {
        var emptyText = new rune.text.BitmapField(this.sanitizeBitmapText ? this.sanitizeBitmapText("NO RECORDS YET") : "NO RECORDS YET");
        emptyText.width = 800;
        emptyText.scaleX = 2;
        emptyText.scaleY = 2;
        emptyText.x = Math.round((1132 / 2) - ((emptyText.text.length * 6 * 2) / 2));
        emptyText.y = 150;
        this.pageContainer.addChild(emptyText);
        this.tintBitmapFieldText(emptyText, this.menuSkin.frame.light, true);
    } else {
        for (i = 0; i < scores.length; i++) {
            var entry = scores[i];
            var rankStr = String(i + 1) + ".";
            var rankText = new rune.text.BitmapField(rankStr);
            var nameText = new rune.text.BitmapField(this.sanitizeBitmapText ? this.sanitizeBitmapText(entry.name || "UNKNOWN PARTY") : String(entry.name || "UNKNOWN PARTY"));
            var scoreText = new rune.text.BitmapField(String(entry.score));

            var scale = 1.8;

            rankText.width = 100;
            nameText.width = 800;
            scoreText.width = 400;

            rankText.scaleX = scale;
            rankText.scaleY = scale;
            nameText.scaleX = scale;
            nameText.scaleY = scale;
            scoreText.scaleX = scale;
            scoreText.scaleY = scale;

            rankText.x = 240;
            nameText.x = 320;
            scoreText.x = 900 - (String(entry.score).length * 6 * scale);

            rankText.y = startY + (i * 35);
            nameText.y = startY + (i * 35);
            scoreText.y = startY + (i * 35);

            this.pageContainer.addChild(rankText);
            this.pageContainer.addChild(nameText);
            this.pageContainer.addChild(scoreText);

            if (i === 0) {
                this.tintBitmapFieldText(rankText, GraveFallGame.scene.Game.PLAYER_THEMES[2].accent, true);
                this.tintBitmapFieldText(nameText, GraveFallGame.scene.Game.PLAYER_THEMES[2].accent, true);
                this.tintBitmapFieldText(scoreText, GraveFallGame.scene.Game.PLAYER_THEMES[2].accent, true);
            } else if (i === 1) {
                this.tintBitmapFieldText(rankText, GraveFallGame.scene.Game.PLAYER_DOWNED_PALETTE.light, true);
                this.tintBitmapFieldText(nameText, GraveFallGame.scene.Game.PLAYER_DOWNED_PALETTE.light, true);
                this.tintBitmapFieldText(scoreText, GraveFallGame.scene.Game.PLAYER_DOWNED_PALETTE.light, true);
            } else if (i === 2) {
                this.tintBitmapFieldText(rankText, GraveFallGame.scene.Game.UI_SKINS.dullBrown.frame.light, true);
                this.tintBitmapFieldText(nameText, GraveFallGame.scene.Game.UI_SKINS.dullBrown.frame.light, true);
                this.tintBitmapFieldText(scoreText, GraveFallGame.scene.Game.UI_SKINS.dullBrown.frame.light, true);
            }
        }
    }

    if (this.tabs) {
        for (i = 0; i < this.tabs.length; i++) {
            this.tabs[i].alpha = i === this.pageIndex ? 1 : 0.55;
        }
    }
};

GraveFallGame.scene.Leaderboard.prototype.update = function (step) {
    var pressLeft;
    var pressRight;
    var pressBack;
    var i;
    var gp;

    rune.scene.Scene.prototype.update.call(this, step);

    if (this.isDevConsoleInputActive && this.isDevConsoleInputActive()) {
        return;
    }

    pressLeft = this.keyboard.justPressed("left") || this.keyboard.justPressed("a");
    pressRight = this.keyboard.justPressed("right") || this.keyboard.justPressed("d");
    pressBack = this.keyboard.justPressed("escape") || this.keyboard.justPressed("backspace");

    for (i = 0; i < 4; i++) {
        gp = this.gamepads.get(i);
        if (gp) {
            if (gp.justPressed(14) || gp.stickLeftJustLeft) pressLeft = true;
            if (gp.justPressed(15) || gp.stickLeftJustRight) pressRight = true;
            if (gp.justPressed(1) || gp.justPressed(2)) pressBack = true; // B, X
        }
    }

    if (pressBack) {
        GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_BACK, 0.55);
        this.application.scenes.load([
            new GraveFallGame.scene.Menu()
        ]);
        return;
    }

    if (pressRight) {
        this.pageIndex++;
        if (this.pageIndex > 3) this.pageIndex = 0;
        GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_MOVE, 0.45);
        this.renderPage();
        return;
    }

    if (pressLeft) {
        this.pageIndex--;
        if (this.pageIndex < 0) this.pageIndex = 3;
        GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_MOVE, 0.45);
        this.renderPage();
        return;
    }
};

GraveFallGame.scene.Leaderboard.prototype.dispose = function () {
    this.pageContainer = null;
    this.tabs = null;
    rune.scene.Scene.prototype.dispose.call(this);
};