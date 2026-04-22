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
	this.add("UI_Frame_B", "./../asset/png/GraveFallBlenderTextures/Border_Texture/UI_Frame_B.png");
	this.add("UI_Frame_BL", "./../asset/png/GraveFallBlenderTextures/Border_Texture/UI_Frame_BL.png");
	this.add("UI_Frame_BL_T", "./../asset/png/GraveFallBlenderTextures/Border_Texture/UI_Frame_BL_T.png");
	this.add("UI_Frame_BR", "./../asset/png/GraveFallBlenderTextures/Border_Texture/UI_Frame_BR.png");
	this.add("UI_Frame_BR_T", "./../asset/png/GraveFallBlenderTextures/Border_Texture/UI_Frame_BR_T.png");
	this.add("UI_Frame_B_T", "./../asset/png/GraveFallBlenderTextures/Border_Texture/UI_Frame_B_T.png");
	this.add("UI_Frame_L", "./../asset/png/GraveFallBlenderTextures/Border_Texture/UI_Frame_L.png");
	this.add("UI_Frame_L_T", "./../asset/png/GraveFallBlenderTextures/Border_Texture/UI_Frame_L_T.png");
	this.add("UI_Frame_R", "./../asset/png/GraveFallBlenderTextures/Border_Texture/UI_Frame_R.png");
	this.add("UI_Frame_R_T", "./../asset/png/GraveFallBlenderTextures/Border_Texture/UI_Frame_R_T.png");
	this.add("UI_Frame_T", "./../asset/png/GraveFallBlenderTextures/Border_Texture/UI_Frame_T.png");
	this.add("UI_Frame_TL", "./../asset/png/GraveFallBlenderTextures/Border_Texture/UI_Frame_TL.png");
	this.add("UI_Frame_TL_T", "./../asset/png/GraveFallBlenderTextures/Border_Texture/UI_Frame_TL_T.png");
	this.add("UI_Frame_TR", "./../asset/png/GraveFallBlenderTextures/Border_Texture/UI_Frame_TR.png");
	this.add("UI_Frame_TR_T", "./../asset/png/GraveFallBlenderTextures/Border_Texture/UI_Frame_TR_T.png");
	this.add("UI_Frame_T_T", "./../asset/png/GraveFallBlenderTextures/Border_Texture/UI_Frame_T_T.png");
	this.add("UI_Separator_L", "./../asset/png/GraveFallBlenderTextures/Border_Texture/UI_Separator_L.png");
	this.add("UI_Separator_L_T", "./../asset/png/GraveFallBlenderTextures/Border_Texture/UI_Separator_L_T.png");
	this.add("UI_Separator_M", "./../asset/png/GraveFallBlenderTextures/Border_Texture/UI_Separator_M.png");
	this.add("UI_Separator_M_T", "./../asset/png/GraveFallBlenderTextures/Border_Texture/UI_Separator_M_T.png");
	this.add("UI_Separator_R", "./../asset/png/GraveFallBlenderTextures/Border_Texture/UI_Separator_R.png");
	this.add("UI_Separator_R_T", "./../asset/png/GraveFallBlenderTextures/Border_Texture/UI_Separator_R_T.png");
	this.add("Buff_Icon", "./../asset/png/GraveFallBlenderTextures/Buff_Icon.png");
	this.add("B_Button_Icon", "./../asset/png/GraveFallBlenderTextures/B_Button_Icon.png");
	this.add("Assassin_Idle_Stance", "./../asset/png/GraveFallBlenderTextures/Character Sprites/Assassin_Idle_Stance.png");
	this.add("Assassin_Portrait", "./../asset/png/GraveFallBlenderTextures/Character Sprites/Assassin_Portrait.png");
	this.add("Fighter_Idle_Stance", "./../asset/png/GraveFallBlenderTextures/Character Sprites/Fighter_Idle_Stance.png");
	this.add("Fighter_Portrait", "./../asset/png/GraveFallBlenderTextures/Character Sprites/Fighter_Portrait.png");
	this.add("Nikita_Boss", "./../asset/png/GraveFallBlenderTextures/Character Sprites/Nikita_Boss.jpg");
	this.add("Ranger_Idle_Stance", "./../asset/png/GraveFallBlenderTextures/Character Sprites/Ranger_Idle_Stance.png");
	this.add("Ranger_Portrait", "./../asset/png/GraveFallBlenderTextures/Character Sprites/Ranger_Portrait.png");
	this.add("Wizard_Idle_Stance", "./../asset/png/GraveFallBlenderTextures/Character Sprites/Wizard_Idle_Stance.png");
	this.add("Wizard_Portrait", "./../asset/png/GraveFallBlenderTextures/Character Sprites/Wizard_Portrait.png");
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
	this.add("Assassin_Icon_T", "./../asset/png/GraveFallBlenderTextures/Transparent Render/Assassin_Icon_T.png");
	this.add("A_Button_Icon_T", "./../asset/png/GraveFallBlenderTextures/Transparent Render/A_Button_Icon_T.png");
	this.add("Buff_Icon_T", "./../asset/png/GraveFallBlenderTextures/Transparent Render/Buff_Icon_T.png");
	this.add("B_Button_Icon_T", "./../asset/png/GraveFallBlenderTextures/Transparent Render/B_Button_Icon_T.png");
	this.add("Defend_Icon_T", "./../asset/png/GraveFallBlenderTextures/Transparent Render/Defend_Icon_T.png");
	this.add("Fighter_Icon_T", "./../asset/png/GraveFallBlenderTextures/Transparent Render/Fighter_Icon_T.png");
	this.add("Fight_Icon_T", "./../asset/png/GraveFallBlenderTextures/Transparent Render/Fight_Icon_T.png");
	this.add("Item_Icon_T", "./../asset/png/GraveFallBlenderTextures/Transparent Render/Item_Icon_T.png");
	this.add("Ranger_Icon_T", "./../asset/png/GraveFallBlenderTextures/Transparent Render/Ranger_Icon_T.png");
	this.add("Wizard_Icon_T", "./../asset/png/GraveFallBlenderTextures/Transparent Render/Wizard_Icon_T.png");
	this.add("X_Button_Icon_T", "./../asset/png/GraveFallBlenderTextures/Transparent Render/X_Button_Icon_T.png");
	this.add("Y_Button_Icon_T", "./../asset/png/GraveFallBlenderTextures/Transparent Render/Y_Button_Icon_T.png");
	this.add("X_Button_Icon", "./../asset/png/GraveFallBlenderTextures/X_Button_Icon.png");
	this.add("Y_Button_Icon", "./../asset/png/GraveFallBlenderTextures/Y_Button_Icon.png");
};