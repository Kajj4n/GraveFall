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
 * Game state.
 */
GraveFallGame.scene.Menu = function () {

    /**
     * Index of the currently selected menu option.
     *
     * @type {number}
     */
    this.index = 0;

    /**
     * Array containing the menu text fields.
     *
     * @type {Array}
     */
    this.options = null;

    /**
     * Pointer graphic.
     *
     * @type {?rune.ui.VTMenuPointer}
     */
    this.pointer = null;

    /**
     * Gap between pointer and text.
     *
     * @type {number}
     */
    this.pointerGap = 20;

    /**
     * Gap between menu rows.
     *
     * @type {number}
     */
    this.optionGap = 24;

    /**
     * Menu scale.
     *
     * @type {number}
     */
    this.menuScale = 4;

    rune.scene.Scene.call(this);
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

GraveFallGame.scene.Menu.prototype = Object.create(rune.scene.Scene.prototype);
GraveFallGame.scene.Menu.prototype.constructor = GraveFallGame.scene.Menu;

//------------------------------------------------------------------------------
// Override public prototype methods (ENGINE)
//------------------------------------------------------------------------------

/**
 * @inheritDoc
 */
GraveFallGame.scene.Menu.prototype.init = function (step) {
    rune.scene.Scene.prototype.init.call(this);

    var screen = this.application.screen;

    this.options = [
        new rune.text.BitmapField("Start Game"),
        new rune.text.BitmapField("Rules")
    ];

    this.pointer = new rune.ui.VTMenuPointer();
    this.pointer.scaleX = this.menuScale;
    this.pointer.scaleY = this.menuScale;
    this.stage.addChild(this.pointer);

    var i;
    var opt;
    var maxWidth = 0;
    var totalHeight = 0;
    var charWidth = 6; // Standard Rune text char width

    for (i = 0; i < this.options.length; i++) {
        opt = this.options[i];
        opt.scaleX = this.menuScale;
        opt.scaleY = this.menuScale;

        var optWidth = opt.text.length * charWidth * this.menuScale;
        if (optWidth > maxWidth) {
            maxWidth = optWidth;
        }

        totalHeight += 9 * this.menuScale; 
    }

    totalHeight += this.optionGap * (this.options.length - 1);

    var blockWidth = this.pointer.width + this.pointerGap + maxWidth;
    var menuLeft = Math.round(screen.centerX - (blockWidth / 2));
    var textX = menuLeft + this.pointer.width + this.pointerGap;
    var currentY = Math.round(screen.centerY - (totalHeight / 2));

    for (i = 0; i < this.options.length; i++) {
        opt = this.options[i];
        opt.x = textX;
        opt.y = currentY;

        this.stage.addChild(opt);

        currentY += (9 * this.menuScale) + this.optionGap;
    }

    this.updateVisuals();
};

/**
 * @inheritDoc
 */
GraveFallGame.scene.Menu.prototype.update = function (step) {
    rune.scene.Scene.prototype.update.call(this, step);

    if (this.keyboard.justPressed("down") && this.index < this.options.length - 1) {
        this.index++;
        GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_MOVE, 0.45);
        this.updateVisuals();
    }

    if (this.keyboard.justPressed("up") && this.index > 0) {
        this.index--;
        GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_MOVE, 0.45);
        this.updateVisuals();
    }

    if (this.keyboard.justPressed("space")) {
        GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_CONFIRM, 0.6);

        if (this.index === 0) {
            this.application.scenes.load([
                new GraveFallGame.scene.CharacterSelect()
            ]);
        } else if (this.index === 1) {
            this.application.scenes.load([
                new GraveFallGame.scene.Rule()
            ]);
        }
    }
};

GraveFallGame.scene.Menu.prototype.updateVisuals = function () {
    var selectedOption = this.options[this.index];
    var optionHeight = 9 * this.menuScale;

    this.pointer.x = Math.round(selectedOption.x - this.pointer.width - this.pointerGap);
    this.pointer.y = Math.round(selectedOption.y + (optionHeight / 2) - (this.pointer.height / 2));
};
