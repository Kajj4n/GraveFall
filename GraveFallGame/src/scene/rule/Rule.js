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
 * Rule scene.
 */
GraveFallGame.scene.Rule = function () {

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

GraveFallGame.scene.Rule.prototype = Object.create(rune.scene.Scene.prototype);
GraveFallGame.scene.Rule.prototype.constructor = GraveFallGame.scene.Rule;

//------------------------------------------------------------------------------
// Override public prototype methods (ENGINE)
//------------------------------------------------------------------------------

/**
 * This method is automatically executed once after the scene is instantiated. 
 * The method is used to create objects to be used within the scene.
 *
 * @returns {undefined}
 */
GraveFallGame.scene.Rule.prototype.init = function() {
    rune.scene.Scene.prototype.init.call(this);

    var ruleText = new rune.text.BitmapField(
        "HOW TO PLAY\n\n" +
        "CHOOSE FIGHT TO START ATTACK MINIGAMES\n" +
        "GOOD QTES DEAL BONUS DAMAGE\n" +
        "THEN AVOID THE ENEMY PROJECTILES\n" +
        "SURVIVE AS LONG AS YOU CAN\n\n" +
        "PRESS ESCAPE TO GO BACK"
    );

    ruleText.autoSize = true;
    ruleText.scaleX = 3;
    ruleText.scaleY = 3;

    ruleText.x = Math.round(this.application.screen.centerX - (ruleText.width / 2));
    ruleText.y = Math.round(this.application.screen.centerY - (ruleText.height / 2));

    this.stage.addChild(ruleText);
};

/**
 * This method is automatically executed once per "tick". The method is used for 
 * calculations such as application logic.
 *
 * @param {number} step Fixed time step.
 *
 * @returns {undefined}
 */
GraveFallGame.scene.Rule.prototype.update = function(step) {
    rune.scene.Scene.prototype.update.call(this, step);

    if (this.keyboard.justPressed("escape")) {
        GraveFallGame.playSound(this.application, GraveFallGame.SOUNDS.UI_BACK, 0.55);
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
GraveFallGame.scene.Rule.prototype.dispose = function () {
    rune.scene.Scene.prototype.dispose.call(this);
};