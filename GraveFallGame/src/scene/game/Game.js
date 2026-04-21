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

    this.playerMenus = [];

    // Player 1
    this.playerMenus.push(this.createCharacterMenu({
        x: 0,
        y: 600,
        portrait: "Fighter_Portrait",
        classIcon: "Fighter_Icon_T",
        stand: "Fighter_Idle_Stance",
        standX: 100,
        hpCurrent: 130,
        hpMax: 160,
        controls: {
            left: "a",
            right: "d",
            confirm: "space"
        }
    }));

    // Player 2
    this.playerMenus.push(this.createCharacterMenu({
        x: 320,
        y: 600,
        portrait: "Assassin_Portrait",
        classIcon: "Assassin_Icon_T",
        stand: "Assassin_Idle_Stance",
        standX: 430,
        hpCurrent: 95,
        hpMax: 120,
        controls: {
            left: "left",
            right: "right",
            confirm: "enter"
        }
    }));

    // Player 3
    this.playerMenus.push(this.createCharacterMenu({
        x: 640,
        y: 600,
        portrait: "Wizard_Portrait",
        classIcon: "Wizard_Icon_T",
        stand: "Wizard_Idle_Stance",
        standX: 740,
        hpCurrent: 34,
        hpMax: 80,
        controls: {
            left: "j",
            right: "l",
            confirm: "k"
        }
    }));


    // Player 4
    this.playerMenus.push(this.createCharacterMenu({
        x: 960,
        y: 600,
        portrait: "Ranger_Portrait",
        classIcon: "Ranger_Icon_T",
        stand: "Ranger_Idle_Stance",
        standX: 1040,
        hpCurrent: 34,
        hpMax: 80,
        controls: {
            left: "v",
            right: "n",
            confirm: "b"
        }
    }));


    
};

//------------------------------------------------------------------------------
// Helper
//------------------------------------------------------------------------------

/**
 * Creates one character menu panel.
 *
 * @param {Object} options
 * @returns {Object}
 */
GraveFallGame.scene.Game.prototype.createCharacterMenu = function (options) {
    var menuWidth = 320;
    var menuHeight = 125;

    var characterMenu = new rune.display.DisplayObjectContainer(
        options.x,
        options.y,
        menuWidth,
        menuHeight
    );

    var characterMenuCharacter = new rune.display.DisplayObjectContainer(
        0,
        0,
        menuWidth,
        62.5
    );

    var characterMenuActions = new rune.display.DisplayObjectContainer(
        0,
        62.5,
        menuWidth,
        62.5
    );

    var characterStand = new rune.display.Sprite(options.standX, 400, 100, 100, options.stand);
    var characterIcon = new rune.display.Sprite(0, 0, 50, 50, options.portrait);
    var characterClassIcon = new rune.display.Sprite(35, 30, 100, 100, options.classIcon);

    var fightIcon = new rune.display.Sprite(10, 0, 100, 100, "Fight_Icon_T");
    var defendIcon = new rune.display.Sprite(95, 0, 100, 100, "Defend_Icon_T");
    var buffIcon = new rune.display.Sprite(180, 0, 100, 100, "Buff_Icon_T");
    var itemIcon = new rune.display.Sprite(255, 0, 100, 100, "Item_Icon_T");

    var characterHealthBar = new rune.display.Graphic(100, 33, 200, 17);
    var characterHealthMax = new rune.text.BitmapField("/" + options.hpMax);
    var characterHealthCurrent = new rune.text.BitmapField(String(options.hpCurrent));
    var HpText = new rune.text.BitmapField("HP");

    // Background / panel styling
    characterMenu.backgroundColor = "";
    characterMenuCharacter.backgroundColor = "";
    characterMenuActions.backgroundColor = "";
    characterHealthBar.backgroundColor = "#ff0000";
    characterClassIcon.Color32 = "#ff0000";

    // HP text styling
    characterHealthMax.scaleX = 2;
    characterHealthMax.scaleY = 2;
    characterHealthMax.x = 255;
    characterHealthMax.y = 5;

    characterHealthCurrent.scaleX = 2;
    characterHealthCurrent.scaleY = 2;
    characterHealthCurrent.x = 210;
    characterHealthCurrent.y = 5;

    HpText.scaleX = 2;
    HpText.scaleY = 2;
    HpText.x = 100;
    HpText.y = 7;

    // Icon scaling
    fightIcon.scaleX = 0.6;
    fightIcon.scaleY = 0.6;

    defendIcon.scaleX = 0.6;
    defendIcon.scaleY = 0.6;

    buffIcon.scaleX = 0.6;
    buffIcon.scaleY = 0.6;

    itemIcon.scaleX = 0.6;
    itemIcon.scaleY = 0.6;

    characterClassIcon.scaleX = 0.35;
    characterClassIcon.scaleY = 0.35;

    characterStand.scaleX = 2.3;
    characterStand.scaleY = 2.3;

    // Build hierarchy

    characterMenu.addChild(characterMenuCharacter);
    characterMenu.addChild(characterMenuActions);

    characterMenuCharacter.addChild(characterIcon);
    characterMenuCharacter.addChild(characterClassIcon);

    characterMenuCharacter.addChild(characterHealthBar);
    characterMenuCharacter.addChild(characterHealthMax);
    characterMenuCharacter.addChild(characterHealthCurrent);
    characterMenuCharacter.addChild(HpText);

    characterMenuActions.addChild(fightIcon);
    characterMenuActions.addChild(defendIcon);
    characterMenuActions.addChild(buffIcon);
    characterMenuActions.addChild(itemIcon);

    this.stage.addChild(characterStand);


    this.stage.addChild(characterMenu);

    return {
        container: characterMenu,
        actions: [fightIcon, defendIcon, buffIcon, itemIcon],
        selectedIndex: 0,
        confirmed: false,
        baseY: options.y,
        confirmedY: options.y + 60,
        controls: options.controls
    };
};

/**
 * Updates the scaling of the action icons for one player.
 *
 * @param {Object} playerMenu
 * @returns {undefined}
 */
GraveFallGame.scene.Game.prototype.updateCharacterMenuVisuals = function (playerMenu) {
    for (var i = 0; i < playerMenu.actions.length; i++) {
        if (i === playerMenu.selectedIndex) {
            playerMenu.actions[i].scaleX = 0.7;
            playerMenu.actions[i].scaleY = 0.7;
        } else {
            playerMenu.actions[i].scaleX = 0.6;
            playerMenu.actions[i].scaleY = 0.6;
        }
    }
};

/**
 * Handles input for one player menu.
 *
 * @param {Object} playerMenu
 * @returns {undefined}
 */
GraveFallGame.scene.Game.prototype.updateCharacterMenuInput = function (playerMenu) {
    if (playerMenu.confirmed) {
        playerMenu.container.y = playerMenu.confirmedY;
        this.updateCharacterMenuVisuals(playerMenu);
        return;
    }

    if (this.keyboard.justPressed(playerMenu.controls.left)) {
        playerMenu.selectedIndex--;

        if (playerMenu.selectedIndex < 0) {
            playerMenu.selectedIndex = playerMenu.actions.length - 1;
        }
    }

    if (this.keyboard.justPressed(playerMenu.controls.right)) {
        playerMenu.selectedIndex++;

        if (playerMenu.selectedIndex >= playerMenu.actions.length) {
            playerMenu.selectedIndex = 0;
        }
    }

    if (this.keyboard.justPressed(playerMenu.controls.confirm)) {
        playerMenu.confirmed = true;
        playerMenu.container.y = playerMenu.confirmedY;
    }

    this.updateCharacterMenuVisuals(playerMenu);
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

    for (var i = 0; i < this.playerMenus.length; i++) {
        this.updateCharacterMenuInput(this.playerMenus[i]);
    }

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
    this.playerMenus = null;
    rune.scene.Scene.prototype.dispose.call(this);
};