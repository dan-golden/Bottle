// Bottle Phone Application

//IMPORTS

var CONTROLS_THEME = require('themes/flat/theme');
var THEME = require('themes/sample/theme');
for ( var i in CONTROLS_THEME ){
    THEME[i] = CONTROLS_THEME[i]
}
var BUTTONS = require("controls/buttons");
var CONTROL = require('mobile/control');
var KEYBOARD = require('mobile/keyboard');
var TRANSITIONS = require('transitions');
var SLIDERS = require('controls/sliders');
var SWITCHES = require('controls/switch');
var SCROLLER = require('mobile/scroller');
var SCREEN = require('mobile/screen');


// Skins and Styles
var whiteSkin = new Skin( { fill:"white" } );
var blueSkin = new Skin( { fill:"#9898ff", } );
var blueSkinLabel = new Skin( { fill:"#9898ff", borders: { left:5, right:5, }, stroke: 'gray',} );
var blueTitleSkin = new Skin( { fill:"#d3d3d3", borders: { top: 5, bottom: 5, left:5, right:5, }, stroke: 'gray', });
var whiteS = new Skin({
		fill:"#e5e5ff",
		borders:{left:5, right:5, top:5, bottom:5},
		stroke:"gray"});
var textStyle = new Style({font:"bold 25px", color:"black"});
var titleStyle = new Style({font:"bold 30px", color:"black"});
var repeatingPatternTexture = new Texture('./assets/menuIcon.png', 1)
var repeatingPatternSkin = new Skin({ texture: repeatingPatternTexture, width: 244, height: 88, tiles: { left:0, right:0, top:0, bottom:0 }, });
var labelStyle = new Style( { font: "15px Helvetica, sans-serif;", color:"white" } );
var redSkin = new Skin({fill:'red'});
var buttonStyle = new Style({ font: "15px Helvetica, sans-serif;", color:"white", skin: redSkin });
var bigText = new Style({font:"bold 40px", color:"#333333"});
var smallText = new Style({font:"bold 20px", color:"#333333"});
var nameInputSkin = new Skin({ borders: { left:2, right:2, top:2, bottom:2 }, stroke: 'gray',});
var fieldStyle = new Style({ color: 'black', font: 'bold 24px', horizontal: 'left', vertical: 'middle', left: 5, right: 5, top: 5, bottom: 5, });
var fieldHintStyle = new Style({ color: '#aaa', font: '24px', horizontal: 'left', vertical: 'middle', left: 5, right: 5, top: 5, bottom: 5, });
var buttonStyle1 = new Style({ font: "25px Helvetica, sans-serif;", color:"white", skin: redSkin });
var taskNameStyle = new Style({ font: "25px Helvetica, sans-serif; bold;", color:"black" });
var taskStyle = new Style({ font: "20px Helvetica, sans-serif;", color:"black" });
var blackSkin = new Skin({ fill: 'black',});
var yellowSkin	= new Skin({ fill: 'yellow'});
var separatorSkin = new Skin({ fill: 'silver',});
var productNameStyle = new Style({  font: 'bold 22px', horizontal: 'left', vertical: 'middle', lines: 1, });
var productDescriptionStyle = new Style({  font: '16px', horizontal: 'left', vertical: 'middle', left: 1, color: 'Black' });

// Internal Variables
var deviceURL = "";
var temperature_unit = "\xB0 F"; //default temperature to Fahrenheit
var current_temperature = 70;
var current_temperature_string = current_temperature + temperature_unit; // range of temp should be 32 degrees for freezing to 212 degrees for boiling
var survival_mode = "OFF";
var currentScreen = "Temperature";
var toScreen = "Menu";
var dispense_rate = 0;
var dispense_time = 0;
var schedules = [];

// FUNCTIONS
var converter = function(input) {
	if(input == "Menu") {
		return MenuScreen;
	} else if(input == "Schedule")
		return ScheduleScreen;
	else if(input == "Temperature")
		return TemperatureScreen;
	else
		return SurvivalScreen;
}


function updateDeviceTemperature(newTemp) {
    // make sure current_temperature is up to date before calling this to update device
    current_temperature = newTemp;
    current_temperature_string = current_temperature + temperature_unit;
    application.invoke(new Message(deviceURL + "updateTemperature"), Message.JSON);    
}

function updateDeviceSurvivalMode() {
    // make sure survival_mode is up to date before calling this to update device
    application.invoke(new Message(deviceURL + "updateSurvivalMode"), Message.JSON);    
}

function updateDeviceDispenseRate() {
    // make sure survival_mode is up to date before calling this to update device
    application.invoke(new Message(deviceURL + "updateDispenseRate"), Message.JSON);    
}

// BUTTONS
var backButton = BUTTONS.Button.template(function($){ return{
	left: 50, right: 50, top: 50, height:50,
	contents: [
		new Label({left:0, right:0, height:40, string:"Go Back", style: labelStyle})
	],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			toScreen = currentScreen;
			content.bubble("onTriggerTransition");
		}}
	})
}});

var newMenu = Container.template(function($) { return { 
	left: 1, top:1, width: 244, height: 88, skin: repeatingPatternSkin, 
	contents: [ new Label({left:0, right:0, height:88, width:244, string:"", style: buttonStyle})],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTouchBegan: function(container, id, x, y, ticks) {
			toScreen = "Menu";
			container.bubble("onTriggerTransition");
		}
	})
	} 
});

var menuButton = BUTTONS.Button.template(function($){ return{
	left: 1, right: 200, top: 1, height:50,
	contents: [
		new Label({left:0, right:0, height:40, string:"Menu", style: buttonStyle})
	],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			toScreen = "Menu";
			content.bubble("onTriggerTransition");
		}}
	})
}});

var survivalButton = BUTTONS.Button.template(function($){ return{
	left: 50, right: 50, top: 50, height:50,
	contents: [ new Label({left:0, right:0, height:40, string:"Survival", style: labelStyle})],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			toScreen = "Survival";
			content.bubble("onTriggerTransition");
		}}
	})
}});

var scheduleButton = BUTTONS.Button.template(function($){ return{
	left: 50, right: 50, top: 50, height:50,
	contents: [ new Label({left:0, right:0, height:40, string:"Schedules", style: labelStyle})],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			toScreen = "Schedule";
			content.bubble("onTriggerTransition");
		}}
	})
}});
var temperatureButton = BUTTONS.Button.template(function($){ return{
	left: 50, right: 50, top: 50, height:50,
	contents: [	new Label({left:0, right:0, height:40, string:"Temperature", style: labelStyle})],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			toScreen = "Temperature";
			content.bubble("onTriggerTransition");
		}}
	})
}});

var bButton = new backButton();
var tButton = new temperatureButton();
var sButton = new scheduleButton();
var suButton = new survivalButton();

//HANDLERS

Handler.bind("/discover", Behavior({
	onInvoke: function(handler, message){
		deviceURL = JSON.parse(message.requestText).url;
		trace("Discovered the device");
	}
}));

Handler.bind("/forget", Behavior({
	onInvoke: function(handler, message){
		deviceURL = "";
	}
}));


Handler.bind("/currentTemperature", Behavior({
	onInvoke: function(handler, message){
	    message.responseText = current_temperature_string;
		trace("inside currentTemperature in phone");
	}
}));

Handler.bind("/currentSurvivalMode", Behavior({
	onInvoke: function(handler, message){
	    message.responseText = survival_mode;
		trace("inside currentSurvivalMode in phone");
	}
}));

Handler.bind("/currentDispenseRate", Behavior({
	onInvoke: function(handler, message){
	    message.responseText = JSON.stringify( { time: dispense_time , rate: dispense_rate} );
		trace("inside currentDispenseRate in phone");
	}
}));

Handler.bind("/updateTemperature", Behavior({
	onInvoke: function(handler, message){
	    handler.invoke( new Message(deviceURL + "currentTemperature"), Message.TEXT );
		trace("inside updateTemp in phone");
	},
	onComplete: function(handler, message, text) {
	    current_temperature_string = text;
	    current_temperature_label.string = current_temperature_string;
	}
}));

// Labels
var current_temperature_label = new Label({left:10, right:5, top:5, bottom:5, string: current_temperature_string, style:textStyle, skin: blueSkin});
var survival_mode_label = new Label({string: survival_mode, style:textStyle, skin: blueSkin});
var dispense_rate_label = new Label({string: dispense_rate, style:textStyle, skin: blueSkin});
var dispense_time_label = new Label({string: dispense_time, style:textStyle, skin: blueSkin});
var save_label = new Label({string: "", style:labelStyle, skin: blueSkin});
var survival_title_label = new Label({ left: 0, right: 0, top:0, style: textStyle, string: 'Survival Mode', skin: blueSkin});



var SURVIVAL_SCREEN = require('survival.js');
var CREATE_SCHEDULE_SCREEN = require("createSchedule.js");
var SCHEDULE_SCREEN = require("schedules.js");
var TEMPERATURE_SCREEN = require("home.js");

// SCREENS
var MenuScreen = Column.template(function($) { return { left: 0, right: 0, top: 0, bottom: 0, skin: blueSkin, contents: [
	Label($, { left: 0, right: 0, top: 20, style: labelStyle, string: 'Menu', }),
	tButton,
	sButton,
	suButton,
	bButton,
], }});

var ScheduleScreen = Container.template(function($) { return { left: 0, right: 0, top: 0, bottom: 0, skin: blueSkin, contents: [
	Label($, { left: 0, right: 0, style: labelStyle, string: 'Current Schedules', }),
	//SCHEDULE_SCREEN.ScheduleScreen,
	new menuButton(),
], }});

var SurvivalScreen = Container.template(function($) { return { left: 0, right: 0, top: 0, bottom: 0, skin: blueSkin, contents: [
	SURVIVAL_SCREEN.mainCol,
	new menuButton(),	
], }});

var TemperatureScreen = Container.template(function($) { return { left: 0, right: 0, top: 0, bottom: 0, skin: blueSkin, contents: [
	Label($, { left: 0, right: 0, style: labelStyle, string: 'Manual Temperature Control', }),
	TEMPERATURE_SCREEN.homeCol,
	new menuButton()
], }});

var MenuScreen = new MenuScreen();
var ScheduleScreen = new ScheduleScreen();
var SurvivalScreen = new SurvivalScreen();
var TemperatureScreen = new TemperatureScreen();


//Containers, Application


var ApplicationBehavior = Behavior.template({
    onLaunch: function(application) {
		application.shared = true;
//		var str = SCHEDULE_SCREEN.generateDisplayString(SCHEDULE_SCREEN.newSchedule);
//		str.SCHEDULE_SCREEN.forEach(SCHEDULE_SCREEN.ListBuilder);
	},
	onDisplayed: function(application) {
		application.discover("bottleDevice");
	},
	onQuit: function(application) {
		application.forget("bottleDevice");
		application.shared = false;
	},
})

var MainScreen = Container.template(function($) { return { left: 0, right: 0, top: 0, bottom: 0, active: true, skin: blueSkin, behavior: Object.create((
	MainScreen.behaviors[0]).prototype),
	onTouchEnded: { value: function(content){
			KEYBOARD.hide();
			content.focus();
		}}
}});

MainScreen.behaviors = new Array(2);
MainScreen.behaviors[0] = Behavior.template({
	onCreate: function(container, data) {
	},
	onTriggerTransition: function(container) {
		var toScreenObj = converter(toScreen);
		
		if(toScreen == "Menu") {
			container.run( new TRANSITIONS.Push(), container.last, toScreenObj, { direction : "right", duration : 400 } );
		} else {
			container.run( new TRANSITIONS.Push(), container.last, toScreenObj, { direction : "left", duration : 400 } );
		}
	},
})

var main = new MainScreen();
application.add(main);
main.add(ScheduleScreen);

application.behavior = new ApplicationBehavior();