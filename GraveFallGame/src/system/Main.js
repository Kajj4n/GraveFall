//------------------------------------------------------------------------------
// Constructor scope
//------------------------------------------------------------------------------

/**
 * Creates a new instance of the Main class.
 *
 * @constructor
 * 
 * @class
 * @classdesc
 * 
 * Entry point class.
 */
GraveFallGame.system.Main = function() {

    //--------------------------------------------------------------------------
    // Super call
    //--------------------------------------------------------------------------
    
    /**
     * Extend (Rune) Application.
     */
    rune.system.Application.call(this, {
        developer: "se.lnu",
        app: "GraveFallGame",
        build: "1.0.0",
        scene: GraveFallGame.scene.Menu,
        resources: GraveFallGame.data.Requests,
        useGamepads:true,
        useKeyboard:true,
        framerate: 60,
        debug: true
    });
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

GraveFallGame.system.Main.prototype = Object.create(rune.system.Application.prototype);
GraveFallGame.system.Main.prototype.constructor = GraveFallGame.system.Main;