//------------------------------------------------------------------------------
// Constructor scope
//------------------------------------------------------------------------------

/** 
 * Creates a new Requests object.
 * 
 * @constructor
 * @extends rune.resource.Requests
 * 
 * @class
 * @classdesc
 * 
 * This class includes (bakes) resource files used by the application. A 
 * resource file is made available by reference (URI) or base64-encoded string. 
 * Tip: Use Rune-tools to easily bake resource files into this class.
 */
GraveFallGame.data.Requests = function() {

    //--------------------------------------------------------------------------
    // Super call
    //--------------------------------------------------------------------------
    
    /**
     * Extend rune.resource.Requests
     */
    rune.resource.Requests.call(this);
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

GraveFallGame.data.Requests.prototype = Object.create(rune.resource.Requests.prototype);
GraveFallGame.data.Requests.prototype.constructor = GraveFallGame.data.Requests;

//------------------------------------------------------------------------------
// Override protected prototype methods
//------------------------------------------------------------------------------

/**
 * @inheritDoc
 */
GraveFallGame.data.Requests.prototype.m_construct = function() {
    rune.resource.Requests.prototype.m_construct.call(this);
    this.add("background", "./../asset/png/background.png");
	this.add("A_Button_Icon", "./../asset/png/GraveFallBlenderTextures/A_Button_Icon.png");
	this.add("Buff_Icon", "./../asset/png/GraveFallBlenderTextures/Buff_Icon.png");
	this.add("B_Button_Icon", "./../asset/png/GraveFallBlenderTextures/B_Button_Icon.png");
	this.add("character", "./../asset/png/GraveFallBlenderTextures/character.png");
	this.add("Circle", "./../asset/png/GraveFallBlenderTextures/Circle.png");
	this.add("Defend_Icon", "./../asset/png/GraveFallBlenderTextures/Defend_Icon.png");
	this.add("Fighter_Icon", "./../asset/png/GraveFallBlenderTextures/Fighter_Icon.png");
	this.add("Fight_Icon", "./../asset/png/GraveFallBlenderTextures/Fight_Icon.png");
	this.add("IntroGrave", "./../asset/png/GraveFallBlenderTextures/IntroGrave.png");
	this.add("Item_Icon", "./../asset/png/GraveFallBlenderTextures/Item_Icon.png");
	this.add("LogoOutput", "./../asset/png/GraveFallBlenderTextures/LogoOutput.png");
	this.add("Mage_Icon", "./../asset/png/GraveFallBlenderTextures/Mage_Icon.png");
	this.add("Ranger_Icon", "./../asset/png/GraveFallBlenderTextures/Ranger_Icon.png");
	this.add("Rogue_Icon", "./../asset/png/GraveFallBlenderTextures/Rogue_Icon.png");
	this.add("A_Button_Icon", "./../asset/png/GraveFallBlenderTextures/Transparent Render/A_Button_Icon.png");
	this.add("Buff_Icon", "./../asset/png/GraveFallBlenderTextures/Transparent Render/Buff_Icon.png");
	this.add("B_Button_Icon", "./../asset/png/GraveFallBlenderTextures/Transparent Render/B_Button_Icon.png");
	this.add("Defend_Icon", "./../asset/png/GraveFallBlenderTextures/Transparent Render/Defend_Icon.png");
	this.add("Fighter_Icon_T", "./../asset/png/GraveFallBlenderTextures/Transparent Render/Fighter_Icon_T.png");
	this.add("Fight_Icon", "./../asset/png/GraveFallBlenderTextures/Transparent Render/Fight_Icon.png");
	this.add("Item_Icon", "./../asset/png/GraveFallBlenderTextures/Transparent Render/Item_Icon.png");
	this.add("Mage_Icon", "./../asset/png/GraveFallBlenderTextures/Transparent Render/Mage_Icon.png");
	this.add("Ranger_Icon", "./../asset/png/GraveFallBlenderTextures/Transparent Render/Ranger_Icon.png");
	this.add("Rogue_Icon", "./../asset/png/GraveFallBlenderTextures/Transparent Render/Rogue_Icon.png");
	this.add("X_Button_Icon", "./../asset/png/GraveFallBlenderTextures/Transparent Render/X_Button_Icon.png");
	this.add("Y_Button_Icon", "./../asset/png/GraveFallBlenderTextures/Transparent Render/Y_Button_Icon.png");
	this.add("X_Button_Icon", "./../asset/png/GraveFallBlenderTextures/X_Button_Icon.png");
	this.add("Y_Button_Icon", "./../asset/png/GraveFallBlenderTextures/Y_Button_Icon.png");
};