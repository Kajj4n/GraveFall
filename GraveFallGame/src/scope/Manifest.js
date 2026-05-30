//------------------------------------------------------------------------------
// Namespace
//------------------------------------------------------------------------------

/**
 * The application namespace.
 * 
 * @namespace GraveFallGame
 */
var GraveFallGame = function() {

    //--------------------------------------------------------------------------
    // Public static scope
    //--------------------------------------------------------------------------
    
    /**
     * Public scope.
     *
     * @type {Object}
     * @private
     */
    var m_this = {};

    //--------------------------------------------------------------------------
    // Package structure
    //--------------------------------------------------------------------------
    
    /**
     * This package contains classes that represent data, or that are used to 
     * manage data. Data can consist of concrete information, or of raw data 
     * such as resource files.
     *
     * @namespace data
     * @memberof GraveFallGame
     * @since 1.0
     */
    m_this.data = {};
    
    /**
     * This package includes the scenes that make up the application. Scenes 
     * are used to represent graphical parts (also known as views) of an 
     * application.
     *
     * @namespace scene
     * @memberof GraveFallGame
     * @since 1.0
     */
    m_this.scene = {};

    /**
     * This package contains the application's most vital classes.
     *
     * @namespace system
     * @memberof GraveFallGame
     * @since 1.0
     */
    m_this.system = {};
    
    //--------------------------------------------------------------------------
    // Return public scope object
    //--------------------------------------------------------------------------

    /**
     * Public scope.
     */
    return m_this;
}();

//------------------------------------------------------------------------------
// Font resources
//------------------------------------------------------------------------------

GraveFallGame.FONT_SMALL = "GF_Font_192x30";

/**
 * Enables the GraveFall bitmap font after resources are available.
 *
 * @return {undefined}
 */
GraveFallGame.useBitmapFont = function() {
    if (rune && rune.text && rune.text.BitmapFormat) {
        rune.text.BitmapFormat.FONT_SMALL = GraveFallGame.FONT_SMALL;
    }
};

//------------------------------------------------------------------------------
// Public static methods
//------------------------------------------------------------------------------

/**
 * Creates and starts the GraveFall application instance.
 *
 * @param {Function} callback Callback executed by Rune after bootstrap.
 *
 * @return {*} Returned value.
 */
GraveFallGame.bootstrap = function(callback) {
    var app = new GraveFallGame.system.Main();
        app.start(callback);
        
    return app;
};
