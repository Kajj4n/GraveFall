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
 * 
 * Game scene.
 */
GraveFallGame.scene.Game = function () {

    //--------------------------------------------------------------------------
    // Super call
    //--------------------------------------------------------------------------

    /**
     * Calls the constructor method of the super class.
     */
    rune.scene.Scene.call(this);
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

GraveFallGame.scene.Game.prototype = Object.create(rune.scene.Scene.prototype);
GraveFallGame.scene.Game.prototype.constructor = GraveFallGame.scene.Game;

//------------------------------------------------------------------------------
// Override public prototype methods (ENGINE)
//------------------------------------------------------------------------------

/**
 * This method is automatically executed once after the scene is instantiated. 
 * The method is used to create objects to be used within the scene.
 *
 * @returns {undefined}
 */

GraveFallGame.scene.Game.prototype.init = function () {
    rune.scene.Scene.prototype.init.call(this);

    // background settings
    this.bgWidth = 390;
    this.bgHeight = 225;
    this.scrollSpeed = 1;

    // two background copies placed side by side
    this.bg1 = new rune.display.Graphic(
        0,
        0,
        this.bgWidth,
        this.bgHeight,
        "background"
    );

    this.bg2 = new rune.display.Graphic(
        this.bgWidth,
        0,
        this.bgWidth,
        this.bgHeight,
        "background"
    );

    this.stage.addChild(this.bg1);
    this.stage.addChild(this.bg2);

    var startGame = new rune.text.BitmapField("GraveFall");
    startGame.autoSize = true;
    startGame.center = this.application.screen.center;
    this.stage.addChild(startGame);
};

//------------------------------------------------------------------------------
// Helper
//------------------------------------------------------------------------------

GraveFallGame.scene.Game.prototype.scrollBackground = function (speed) {
    this.bg1.x -= speed;
    this.bg2.x -= speed;

    // if one image has fully moved off the left side,
    // place it directly after the other one
    if (this.bg1.x <= -this.bgWidth) {
        this.bg1.x = this.bg2.x + this.bgWidth;
    }

    if (this.bg2.x <= -this.bgWidth) {
        this.bg2.x = this.bg1.x + this.bgWidth;
    }
};

/**
 * This method is automatically executed once per "tick". The method is used for 
 * calculations such as application logic.
 *
 * @param {number} step Fixed time step.
 *
 * @returns {undefined}
 */
GraveFallGame.scene.Game.prototype.update = function (step) {
    rune.scene.Scene.prototype.update.call(this, step);

    // moves background constantly
    this.scrollBackground(this.scrollSpeed);

    if (this.keyboard.justPressed("escape")) {
        this.application.scenes.load([
            new GraveFallGame.scene.Menu()
        ]);
    }
};

/**
 * This method is automatically called once just before the scene ends. Use 
 * the method to reset references and remove objects that no longer need to 
 * exist when the scene is destroyed. The process is performed in order to 
 * avoid memory leaks.
 *
 * @returns {undefined}
 */
GraveFallGame.scene.Game.prototype.dispose = function () {
    rune.scene.Scene.prototype.dispose.call(this);
};