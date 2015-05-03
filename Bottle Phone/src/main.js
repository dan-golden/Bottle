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

//THEME.buttonStyle = new Style({ font:"bold 25px", color:"white", fill: "white", skin: { fill: "blue"}, stroke: "white", vertical: "middle", horizontal: 'center',});
// Skins and Styles
var babyblueskin = new Skin({ fill: "#CEFFF9"});
var navyblueskin = new Skin({ fill: "#00BAC1"});
var whiteSkin = new Skin( { fill:"white" } );
//var blueSkin = new Skin( { fill:"#9898ff", } );
//var blueSkinLabel = new Skin( { fill:"#9898ff", borders: { left:5, right:5, }, stroke: 'gray',} );
var whiteSkinLabel = new Skin( { fill:"white", borders: { left:5, right:5, }, stroke: 'white',} );
//var blueTitleSkin = new Skin( { fill:"#d3d3d3", borders: { top: 5, bottom: 5, left:5, right:5, }, stroke: 'gray', });
var whiteS = new Skin({fill:"white", borders:{left:0, right:0, top:0, bottom:0}, stroke:"white"});
var textStyle = new Style({font:"bold 25px", color:"white", vertical: "middle", horizontal: 'center',});
var bottleStyle = new Style({font:"bold 25px", color:"black", vertical: "middle", horizontal: 'center',});
var titleStyle = new Style({font:"bold 30px", color:"black"});
//var repeatingPatternTexture = new Texture('./assets/menuIcon.png', 1)
//var repeatingPatternSkin = new Skin({ texture: repeatingPatternTexture, width: 244, height: 88, tiles: { left:0, right:0, top:0, bottom:0 }, });
var labelStyle = new Style( { font: "15px Helvetica, sans-serif;", color:"black" } );
var redSkin = new Skin({fill:'red'});
var biggerText = new Style({font:"bold 60px", color:"black"});
var bigText = new Style({font:"bold 30px", color:"black"});
var smallText = new Style({font:"bold 20px", color:"black"});
var nameInputSkin = new Skin({ borders: { left:2, right:2, top:2, bottom:2 }, stroke: 'gray',});
var fieldStyle = new Style({ color: 'black', fill: "white", font: 'bold 24px', horizontal: 'left', vertical: 'middle', left: 5, right: 5, top: 5, bottom: 5, });
var fieldHintStyle = new Style({ color: 'gray', font: '24px', horizontal: 'left', fill: "white", vertical: 'middle', left: 5, right: 5, top: 5, bottom: 5, });

var buttonStyle1 = new Style({ font:"bold 25px", color:"white", fill: "white", skin: navyblueskin, stroke: "white"});
var buttonStyle = new Style({ font: "bold 25px", color:"white", fill: "white", skin: navyblueskin, stroke: "white"});

var taskNameStyle = new Style({ font: "25px Helvetica, sans-serif; bold;", color:"black" });
var taskStyle = new Style({ font: "20px Helvetica, sans-serif;", color:"black" });
var blackSkin = new Skin({ fill: 'black',});
var yellowSkin	= new Skin({ fill: 'yellow'});
var separatorSkin = new Skin({ fill: 'silver',});
var productNameStyle = new Style({  font: 'bold 22px', horizontal: 'left', vertical: 'middle', lines: 1, });
var productDescriptionStyle = new Style({  font: '16px', horizontal: 'left', vertical: 'middle', left: 1, color: 'black' });
var errorStyle = new Style( { font: "15px Helvetica, sans-serif;", color:"red" } );


// Internal Variables
var deviceURL = "";
var temperature_unit = "\xB0 F"; //default temperature to Fahrenheit
var current_temperature = 70;
var desired_temperature = 70; 
var current_temperature_string = current_temperature + temperature_unit + " now"; // range of temp should be 32 degrees for freezing to 212 degrees for boiling
var desired_temperature_string = desired_temperature + temperature_unit;
var survival_mode = "OFF";
var currentScreen = "Temperature";
var toScreen = "Menu";
var dispense_rate = 0;
var dispense_time = 0;
var schedules = [];
bottle_status = "ON";
water_level = 20; 

// FUNCTIONS
var converter = function(input) {
	if(input == "Menu") {
		return MenuScreen;
	} else if(input == "Schedule")
		return ScheduleScreen;
	else if(input == "Temperature")
		return TemperatureScreen;
	else if(input == "Survival")
		return SurvivalScreen;
	else if(input == "CreateSchedule")
		return CreateScheduleScreen;
}


function updateDeviceTemperature(newTemp) {
    // make sure current_temperature is up to date before calling this to update device
    application.invoke(new Message(deviceURL + "updateTemperature"), Message.JSON);    
}


function updateDeviceSurvivalMode() {
    // make sure survival_mode is up to date before calling this to update device
    var message = new Message(deviceURL + "updateSurvivalMode");
    message.responseText = survival_mode;
    application.invoke(message, Message.JSON);    
}

function updateDeviceDispenseRate() {
    // make sure survival_mode is up to date before calling this to update device
    application.invoke(new Message(deviceURL + "updateDispenseRate"), Message.JSON);    
}


var menuButton = BUTTONS.Button.template(function($){ return{
	left: 1, right: 200, top: 1, height:50, skin: navyblueskin,
	contents: [
		new Label({left:0, right:0, height:40, string:"Menu", style: textStyle})
	],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			toScreen = "Menu";
			currentScreen = "NotCreateSchedule";
			content.bubble("onTriggerTransition");
		}}
	})
}});

var survivalButton = BUTTONS.Button.template(function($){ return{
	left: -10, right: -10, top: 2, height:50, skin: navyblueskin,
	contents: [ new Label({left:0, right:0, height:40, string:"Water Monitoring", style: textStyle})],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			toScreen = "Survival";
			currentScreen = "Menu";
			content.bubble("onTriggerTransition");
		}}
	})
}});

var scheduleButton = BUTTONS.Button.template(function($){ return{
	left: -10, right: -10,top: 2, height:50,skin: navyblueskin,
	contents: [ new Label({left:0, right:0, height:40, string:"Schedules", style: textStyle})],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			toScreen = "Schedule";
			currentScreen = "Menu";
			content.bubble("onTriggerTransition");
		}}
	})
}});
var temperatureButton = BUTTONS.Button.template(function($){ return{
	left: -10, right: -10, top: 10, height:50,skin: navyblueskin,
	contents: [	new Label({left:0, right:0, height:40, string:"Temperature", style: textStyle})],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			toScreen = "Temperature";
			currentScreen = "Menu";
			content.bubble("onTriggerTransition");
		}}
	})
}});

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


Handler.bind("/desiredTemperature", Behavior({
	onInvoke: function(handler, message){
	    message.responseText = desired_temperature;
		trace("inside desiredTemperature in phone");
	}
}));

Handler.bind("/currentTemperature", Behavior({
	onInvoke: function(handler, message){
	    message.responseText = current_temperature;
		trace("inside currentTemperature in phone");
	}
}));

Handler.bind("/currentBottleStatus", Behavior({
	onInvoke: function(handler, message){
	    message.responseText = bottle_status;
		trace("inside currentBottleStatus in phone");
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
	    current_temperature = parseFloat(text);
	    current_temperature_string = current_temperature + temperature_unit + " now";
	    current_temperature_label.string = current_temperature_string;
	}
}));


Handler.bind("/updateBottleStatus", Behavior({
	onInvoke: function(handler, message){
	    handler.invoke( new Message(deviceURL + "currentBottleStatus"), Message.TEXT );
		trace("inside updateBottleStatus in phone");
	},
	onComplete: function(handler, message, text) {
	    bottle_status = text; 
		bottle_status_label.string = bottle_status; 
	}
}));

Handler.bind("/updateWaterLevel", Behavior({
	onInvoke: function(handler, message){
	    handler.invoke( new Message(deviceURL + "currentWaterLevel"), Message.TEXT );
		trace("inside updateWaterLevel in phone");
	},
	onComplete: function(handler, message, text) {
	    water_level = parseFloat(text); 
		water_level_label.string = water_level; 
	}
}));


// Labels
var current_temperature_label = new Label({string: current_temperature_string, style:bigText, skin: babyblueskin});
var desired_temperature_label = new Label({string: desired_temperature_string, style:biggerText, skin: babyblueskin});
var survival_mode_label = new Label({string: survival_mode, style:bottleStyle, skin: babyblueskin});
var dispense_rate_label = new Label({string: dispense_rate, style:bottleStyle, skin: babyblueskin});
var dispense_time_label = new Label({string: dispense_time, style:bottleStyle, skin: babyblueskin});
var save_label = new Label({string: "Changes Saved", style:labelStyle, skin: babyblueskin, visible: false});
var survival_title_label = new Label({ left: 0, right: 0, top:0, vertical: 'middle', style: bottleStyle, string: 'Water Monitoring', skin: babyblueskin});
var bottle_status_label = new Label({left:0, right:0, height:40, width:70, string: bottle_status, style: labelStyle}); //need to add to main screen 
var water_level_label = new Label({left:0, right:0, height:40, width:70, string: water_level, style: labelStyle}); //need to add to main screen 



var SURVIVAL_SCREEN = require('survival.js');
var CREATE_SCHEDULE_SCREEN = require("createSchedule.js");
var SCHEDULE_SCREEN = require("schedules.js");

// SCREENS
var MenuScreen = Column.template(function($) { return { left: 0, right: 0, top: 0, bottom: 0, vertical: 'middle', skin: babyblueskin, contents: [
	Label($, { left: 0, right: 0, top: 20, style: bottleStyle, string: 'Menu', }),
	tButton,
	sButton,
	suButton,
], }});

var ScheduleScreen = Container.template(function($) { return { left: 0, right: 0, top: 0, bottom: 0, skin: babyblueskin, contents: [
	Label($, { left: 0, right: 0, style: textStyle, string: 'Current Schedules', }),
	SCHEDULE_SCREEN.ScheduleScreen(new Object()),
	new menuButton(),
], }});

var CreateScheduleScreen = Container.template(function($) { return { left: 0, right: 0, top: 0, bottom: 0, skin: babyblueskin, contents: [
	CREATE_SCHEDULE_SCREEN.CreateScheduleScreen(),
], }});

var SurvivalScreen = Container.template(function($) { return { left: 0, right: 0, top: 0, bottom: 0, skin: babyblueskin, contents: [
	SURVIVAL_SCREEN.mainCol,
	new menuButton(),	
], }});

var TemperatureScreen = Container.template(function($) { return { left: 0, right: 0, top: 0, bottom: 0, skin: babyblueskin, contents: [
	Label($, { left: 0, right: 0, style: textStyle, string: 'Manual Temperature Control', }),
	TEMPERATURE_SCREEN.homeCol,
	new menuButton()
], }});

var MenuScreen = new MenuScreen();
var ScheduleScreen = new ScheduleScreen();
var SurvivalScreen = new SurvivalScreen();
var TemperatureScreen = new TemperatureScreen();
var CreateScheduleScreen = new CreateScheduleScreen();


//Containers, Application


var ApplicationBehavior = Behavior.template({
    onLaunch: function(application) {
		application.shared = true;
	},
	onDisplayed: function(application) {
		application.discover("bottleDevice");
	},
	onQuit: function(application) {
		application.forget("bottleDevice");
		application.shared = false;
	},
})

var MainScreen = Container.template(function($) { return { left: 0, right: 0, top: 0, bottom: 0, active: true, skin: babyblueskin, behavior: Object.create((
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
		KEYBOARD.hide();
		save_label.visible = false;
		if(toScreen == "Menu" || currentScreen == "CreateSchedule") {
			container.run( new TRANSITIONS.Push(), container.last, toScreenObj, { direction : "right", duration : 400 } );
		} else {
			container.run( new TRANSITIONS.Push(), container.last, toScreenObj, { direction : "left", duration : 400 } );
		}
	},
})

var main = new MainScreen();
application.add(main);
main.add(TemperatureScreen);

application.behavior = new ApplicationBehavior();