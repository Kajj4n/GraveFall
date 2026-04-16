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
 * * Game state.
 */
GraveFallGame.scene.Menu = function() {
    
    //--------------------------------------------------------------------------
    // Private properties
    //--------------------------------------------------------------------------

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

    // Create a property for the pointer
    this.pointer = null;

    //--------------------------------------------------------------------------
    // Super call
    //--------------------------------------------------------------------------
    
    /**
     * ...
     */
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
GraveFallGame.scene.Menu.prototype.init = function(step) {
    rune.scene.Scene.prototype.init.call(this);

    this.options = [
        new rune.text.BitmapField("Start Game"),
        new rune.text.BitmapField("Rules")
    ];

    for (var i = 0; i < this.options.length; i++) {
        var opt = this.options[i];
        opt.autoSize = true;
        // Left-aligned to the center with a small offset
        opt.x = this.application.screen.centerX - 50; 
        opt.y = 100 + (i * 15);
        this.stage.addChild(opt);
    }

    // --- Create and add the pointer ---
    this.pointer = new rune.ui.VTMenuPointer();
    this.stage.addChild(this.pointer);

    this.updateVisuals();
};

/**
 * @inheritDoc
 */
GraveFallGame.scene.Menu.prototype.update = function(step) {
    rune.scene.Scene.prototype.update.call(this, step);

    // Move selection down
    if (this.keyboard.justPressed("down") && this.index < this.options.length - 1) {
        this.index++;
        this.updateVisuals();
    }

    // Move selection up
    if (this.keyboard.justPressed("up") && this.index > 0) {
        this.index--;
        this.updateVisuals();
    }

    // Select option
    if (this.keyboard.justPressed("space")) {
        if (this.index === 0) {
            this.application.scenes.load([
                new GraveFallGame.scene.Game()
            ]);
        } else if (this.index === 1) {
            this.application.scenes.load([
                new GraveFallGame.scene.Rule()
            ]);
        }
    }
};

//------------------------------------------------------------------------------
// Internal prototype methods
//------------------------------------------------------------------------------

/**
 * Updates the visual state of the menu options.
 *
 * @returns {undefined}
 */
GraveFallGame.scene.Menu.prototype.updateVisuals = function() {
    // Get the currently selected text object
    var selectedOption = this.options[this.index];

    // Position the pointer to the left of the selected text
    // We subtract the pointer's width and a 10px gap
    this.pointer.x = selectedOption.x - this.pointer.width - 10;

    // Center the pointer vertically against the text line
    this.pointer.centerY = selectedOption.centerY - 1;
};