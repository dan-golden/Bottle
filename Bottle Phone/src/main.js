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

var BottleLogo = new Texture("./bottleTitle.png");
var logoSkin = new Skin({
    width: 320,
    height: 50,
	texture: BottleLogo,
});

var TemperatureButtonLogo = new Texture("./temperatureButton.png");
var temperatureButtonSkin = new Skin({
    width: 120,
    height: 90,
	texture: TemperatureButtonLogo,
});

var ScheduleButtonLogo = new Texture("./scheduleButton.png");
var scheduleButtonSkin = new Skin({
    width: 108,
    height: 66,
	texture: ScheduleButtonLogo,
});

var MonitorButtonLogo = new Texture("./monitorButton.png");
var monitorButtonSkin = new Skin({
    width: 108,
    height: 66,
	texture: MonitorButtonLogo,
});



var babyblueskin = new Skin({ fill: "#CEFFF9"});
var navyblueskin = new Skin({ fill: "#00BAC1"});
var whiteSkin = new Skin( { fill:"white" } );
var blueSkin = new Skin( { fill:"#9898ff", } );
//var blueSkinLabel = new Skin( { fill:"#9898ff", borders: { left:5, right:5, }, stroke: 'gray',} );

var whiteSkinLabel = new Skin( { fill:"white", borders: { left:5, right:5, }, stroke: 'white',} );
var whiteS = new Skin({fill:"white", borders:{left:0, right:0, top:0, bottom:0}, stroke:"white"});
var textStyle = new Style({font:"bold 25px", color:"white", vertical: "middle", horizontal: 'center',});
var bottleStyle = new Style({font:"bold 25px", color:"black", vertical: "middle", horizontal: 'center',});
var barStyle = new Style({font:"bold 25px", color:"black", vertical: "middle", horizontal: 'center',});
var inputStyle = new Style({font:"12px", color:"black", vertical: "middle", horizontal: 'center',});
var titleStyle = new Style({font:"bold 30px", color:"black"});
var scheduleTitleStyle = new Style({font:"bold 20px Helvetica, sans-serif;", color:"black"});
var labelStyle = new Style( { font: "15px Helvetica, sans-serif;", color:"black" } );
var waterLevelStyle = new Style({font:"bold 20px", color:"black", vertical: "middle", horizontal: 'center',});
var redSkin = new Skin({fill:'red'});
var biggerText = new Style({font:"bold 60px", color:"black"});
var bigText = new Style({font:"bold 30px", color:"black"});
var smallText = new Style({font:"bold 20px", color:"black"});
var nameInputSkin = new Skin({borders: { left:2, right:2, top:2, bottom:2 }, stroke: 'gray',});
var fieldStyle = new Style({ color: 'black', fill: "white", font: 'bold 24px', horizontal: 'left', vertical: 'middle', left: 5, right: 5, top: 5, bottom: 5, });
var fieldHintStyle = new Style({ color: 'gray', font: '18px', horizontal: 'left', fill: "white", vertical: 'middle', left: 5, right: 5, top: 5, bottom: 5, });
var timeHintStyle = new Style({ color: 'gray', font: 'bold 16px', horizontal: 'left', fill: "white", vertical: 'middle', });

var buttonStyle = new Style({ font: "bold 25px", color:"white", fill: "white", skin: navyblueskin, stroke: "white"});

var taskNameStyle = new Style({ font: "25px Helvetica, sans-serif; bold;", color:"black" });
var taskStyle = new Style({ font: "20px Helvetica, sans-serif;", color:"black" });
var menuBarSkin = new Skin({ fill: "#CCCCDD",});
var separatorSkin = new Skin({ fill: 'silver',});
var productNameStyle = new Style({  font: 'bold 22px', horizontal: 'left', vertical: 'middle', lines: 1, });
var productDescriptionStyle = new Style({  font: '16px', horizontal: 'left', vertical: 'middle', left: 1, color: 'black' });
var errorStyle = new Style( { font: "15px Helvetica, sans-serif;", color:"red" } );

// Internal Variables
var deviceURL = "";
var temperature_unit = "\xB0 C"; 
var current_temperature =25;
var desired_temperature = 25; 
var current_temperature_string = current_temperature + temperature_unit + " now"; // range of temp should be 32 degrees for freezing to 212 degrees for boiling
var desired_temperature_string = desired_temperature + temperature_unit;
var survival_mode = "OFF";
var dispense_rate = "0";
var dispense_time = "0";
var schedules = [];
var currentScreen = "temperature";
var heating_cooling = "Ready";
var heating_cooling_label = new Label({ left: 0, right: 0, top:0, style: bottleStyle, string: heating_cooling});
var real_desired = 25; 
var real_current = 25; 


bottle_status = "ON";
water_level = 20; 
consumption_level = 0; 

function checkValidAmount(amount) {
	if (amount>24 | amount <0) {
		return false; 
	} else {
		return true;
	}}

var currentScreen = "temperature";

// FUNCTIONS
function updateDeviceTemperature(newTemp) {
    // make sure current_temperature is up to date before calling this to update device
    application.invoke(new Message(deviceURL + "updateTemperature"), Message.JSON);    
}


function updateDeviceSurvivalMode() {
    // make sure survival_mode is up to date before calling this to update device
    var message = new Message(deviceURL + "updateSurvivalMode");
    message.responseText = JSON.stringify({survival_mode: survival_mode, dispense_rate: dispense_rate, dispense_time: dispense_time});
    application.invoke(message, Message.JSON); 
}

function updateDeviceDispenseRate() {
    // make sure survival_mode is up to date before calling this to update device
    application.invoke(new Message(deviceURL + "updateDispenseRate"), Message.JSON);    
}

function repopulateScheduleFields(schedule) {
	CREATE_SCHEDULE_SCREEN.populateFields(schedule);
}

function addAMPM() {
	CREATE_SCHEDULE_SCREEN.addAMPM();
}

function resetCreateScreen() {
	CREATE_SCHEDULE_SCREEN.resetCreateScreen();
}

//BUTTONS


var survivalButton = BUTTONS.Button.template(function($){ return{
	left: -10, right: -10, top: 2, height:50, skin: navyblueskin,
	contents: [ new Label({left:0, right:0, height:40, string:"Tracking", style: textStyle})],
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
		handler.invoke(new Message("/updateTemperature")); 
		handler.invoke(new Message("/updateBottleStatus")); 
		handler.invoke(new Message("/updateWaterLevel")); 
		handler.invoke(new Message(deviceURL + "updateTemperature"), Message.TEXT);
		trace("Discovered the device\n");
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
	    real_current = desired_temperature;
	    if (real_current > real_desired) {heating_cooling = "Cooling"; }
	    else if (real_current < real_desired) {heating_cooling = "Heating"; }
	    else {heating_cooling = "Ready";}
	    heating_cooling_label.string = heating_cooling;
		//trace("inside desiredTemperature in phone\n");
	}
}));

Handler.bind("/currentTemperature", Behavior({
	onInvoke: function(handler, message){
	    message.responseText = current_temperature;
	    real_desired = current_temperature;
	    //trace('real_current' + real_current + "\n");
	    //trace('real_desired'+ real_desired + "\n");
	    if (real_current > real_desired) {heating_cooling = "Cooling"; }
	    else if (real_current < real_desired) {heating_cooling = "Heating"; }
	    else {heating_cooling = "Ready";}
	    heating_cooling_label.string = heating_cooling;
		//trace("inside currentTemperature in phone\n");
		
		
		
	}
}));

Handler.bind("/currentBottleStatus", Behavior({
	onInvoke: function(handler, message){
	    message.responseText = bottle_status;
		//trace("inside currentBottleStatus in phone\n");
	}
}));

Handler.bind("/currentSurvivalMode", Behavior({
	onInvoke: function(handler, message){
	    //message.responseText = survival_mode;
	    message.responseText = JSON.stringify({survival_mode: survival_mode, dispense_rate: dispense_rate, dispense_time: dispense_time});
		//trace("inside currentSurvivalMode in phone\n");
		message.status = 200;
	}
}));


Handler.bind("/currentConsumption", Behavior({
	onInvoke: function(handler, message){
		    message.responseText = consumption_level;
	}
}));


Handler.bind("/delayShowMenu", {
    onInvoke: function(handler, message){
        handler.wait(250);
    },
    onComplete: function(handler, message){
        menu.visible = true;
    }});



Handler.bind("/updateTemperature", Behavior({
	onInvoke: function(handler, message){
	    handler.invoke( new Message(deviceURL + "currentTemperature"), Message.TEXT );
		//trace("inside updateTemp in phone\n");
	},
	onComplete: function(handler, message, text) {
	    current_temperature = parseFloat(text);
	    real_current = parseFloat(text);
	    if (real_current > real_desired) {heating_cooling = "Cooling"; }
	    else if (real_current < real_desired) {heating_cooling = "Heating"; }
	    else {heating_cooling = "Ready";}
	    heating_cooling_label.string = heating_cooling;
	    current_temperature_string = current_temperature + temperature_unit + " now";
	    menuTempLabel.string = current_temperature + "";   

	    if (bottle_status == 0 ) {
	    current_temperature_label.string = "OFF"} 
	    else { current_temperature_label.string = current_temperature_string; }
	    if (bottle_status == 0 ) {
	    current_temperature_label.string = "OFF"} 
	    else { current_temperature_label.string = current_temperature_string; }
	    if (bottle_status == 0 ) {

	    menuTempLabel.string = "OFF"; 
	    heating_cooling_label.string = "";} 
	    else { menuTempLabel.string = current_temperature + "\xB0 C"; 
	    heating_cooling_label.string = heating_cooling;}
	    menuTempLabel.string = "OFF"} 

	    
	}
));


Handler.bind("/updateBottleStatus", Behavior({
	onInvoke: function(handler, message){
	    handler.invoke( new Message(deviceURL + "currentBottleStatus"), Message.TEXT );
		//trace("inside updateBottleStatus in phone\n");
	},
	onComplete: function(handler, message, text) {
	    bottle_status = text; 
		bottle_status_label.string = bottle_status; 
		if (bottle_status == 0 ) {
	    menuTempLabel.string = "OFF"; 
	    heating_cooling_label.string = "";
	    current_temperature_label.string = "OFF"; } 
	    else { menuTempLabel.string = current_temperature + "\xB0 C"; 
	    heating_cooling_label.string = heating_cooling;
	    handler.invoke(new Message("/updateTemperature")) }
		
		
		
	}
}));

Handler.bind("/updateWaterLevel", Behavior({
	onInvoke: function(handler, message){
	    handler.invoke( new Message(deviceURL + "currentWaterLevel"), Message.TEXT );
		//trace("inside updateWaterLevel in phone\n");
	},
	onComplete: function(handler, message, text) {
	    water_level = parseFloat(text); 
		water_level_label.string = water_level;
		TEMPERATURE_SCREEN.bottleContainer.waterContainer.height = 190 * water_level/100;
		TEMPERATURE_SCREEN.bottleContainer.waterLabel.string = Math.round(water_level)+"% Full";
	}
}));

Handler.bind("/updateConsumptionLevel", Behavior({
	onInvoke: function(handler, message){
	    handler.invoke( new Message(deviceURL + "currentConsumptionLevel"), Message.TEXT );
	},
	onComplete: function(handler, message, text) {
	    consumption_level = parseFloat(text); 
		consumption_level_label.string = consumption_level;
	}
}));



// Labels
var current_temperature_label = new Label({string: current_temperature_string, style:bigText, skin: babyblueskin});
var desired_temperature_label = new Label({string: desired_temperature_string, style:biggerText, skin: babyblueskin});
var survival_mode_label = new Label({string: survival_mode, style:bottleStyle, skin: babyblueskin});
//var dispense_rate_label = new Label({string: dispense_rate, style:bottleStyle, skin: babyblueskin});
//var dispense_time_label = new Label({string: dispense_time, style:bottleStyle, skin: babyblueskin});
var save_label = new Label({string: "Changes Saved!", style:labelStyle, skin: babyblueskin, visible: false});
var survival_title_label = new Label({ left: 0, right: 0, top:0, vertical: 'middle', style: bottleStyle, string: 'Survival Mode', skin: babyblueskin});
var survival_title_label = new Label({ left: 0, right: 0, top:0, vertical: 'middle', style: bottleStyle, string: 'Advanced Tracking', skin: babyblueskin});
var bottle_status_label = new Label({left:0, right:0, height:40, width:70, string: bottle_status, style: labelStyle}); //need to add to main screen 
var water_level_label = new Label({left:0, right:0, height:40, width:70, string: water_level, style: labelStyle}); //need to add to main screen 
var consumption_level_label = new Label({height:40, width:30, left: 0, string: consumption_level, style: labelStyle}); //need to add to main screen 
var SURVIVAL_SCREEN = require('survival.js');
var CREATE_SCHEDULE_SCREEN = require("createSchedule.js");
var SCHEDULE_SCREEN = require("schedules.js");
var TEMPERATURE_SCREEN = require("home.js");

// SCREENS
var ScheduleScreen = Container.template(function($) { return { left: 0, right: 0, top: 0, bottom: 0, skin: babyblueskin, contents: [
	Label($, { left: 0, right: 0, style: textStyle, string: 'Current Schedules', }),
	SCHEDULE_SCREEN.ScheduleScreen(new Object()),
], }});

createScreen = CREATE_SCHEDULE_SCREEN.CreateScheduleScreen();
var CreateScheduleScreen = Container.template(function($) { return { left: 0, right: 0, top: 0, bottom: 0, skin: babyblueskin, 
	contents: [
		createScreen,
	], onTouchEnded: { value: function(content){
		KEYBOARD.hide();
		content.focus();
	}}, 
}});

var SurvivalScreen = Container.template(function($) { return { left: 0, right: 0, top: 0, bottom: 0, skin: babyblueskin, contents: [
	SURVIVAL_SCREEN.SurvivalScreen(),
], }});

var TemperatureScreen = Container.template(function($) { return { left: 0, right: 0, top: 0, bottom: 0, skin: babyblueskin, contents: [
	Label($, { left: 0, right: 0, style: textStyle, string: 'Manual Temperature Control', }),
	TEMPERATURE_SCREEN.homeCol,
], }});

//var MenuScreen = new MenuScreen();
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

var FullScreen = Column.template(function($) { return { left: 0, right: 0, top: 0, bottom: 0, active: true, skin: babyblueskin,
	onTouchEnded: { value: function(content){
		KEYBOARD.hide();
		content.focus();
	}}
}});

var MainScreen = Container.template(function($) { return { left: 0, right: 0, top: 0, bottom: 30, active: true, skin: babyblueskin, 
	onTouchEnded: { value: function(content){
		KEYBOARD.hide();
		content.focus();
	}}, 
}});

var scheduleButton = BUTTONS.Button.template(function($){ return{
	left: 5, right: 0,top: 2, height: 25,skin: navyblueskin,
	contents: [ new Label({left:0, right:0, height:20, string:"Schedules", style: smallText})],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			if(currentScreen != "schedule") {
				currentScreen = "schedule";
				main.run( new TRANSITIONS.CrossFade(), main.last, ScheduleScreen, { duration : 20 });
			}
		}}
	})
}});
var survivalButton = BUTTONS.Button.template(function($){ return{
	left: 0, right: 5,top: 2, height: 25,skin: navyblueskin,
	contents: [ new Label({left:0, right:0, height:20, string:"Survival", style: smallText})],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			if(currentScreen != "survival") {
				currentScreen = "survival";
				main.run( new TRANSITIONS.CrossFade(), main.last, SurvivalScreen, { duration : 20 });
			}
		}}
	})
}});
var menuTempLabel = new Label({left:0, right:0, height:20, string:"25 \xB0 C" , style: smallText});
var temperatureButton = BUTTONS.Button.template(function($){ return{
	left: 10, right: 10,top: 2, height: 25,skin: navyblueskin,
	contents: [ menuTempLabel ],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			if(currentScreen != "temperature") {
				currentScreen = "temperature";
				main.run( new TRANSITIONS.CrossFade(), main.last, TemperatureScreen, { duration : 20 });
			}
		}}
	})
}});


var scheduleButton = BUTTONS.Button.template(function($){ return{
	top: 14, width: 100, height: 64, skin: scheduleButtonSkin,
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			if(currentScreen != "schedule") {
				currentScreen = "schedule";
				main.run( new TRANSITIONS.CrossFade(), main.last, ScheduleScreen, { duration : 20 });
			}
		}}
	})
}});
var survivalButton = BUTTONS.Button.template(function($){ return{
	top: 14, width: 100, height: 64, skin: monitorButtonSkin,
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			if(currentScreen != "survival") {
				currentScreen = "survival";
				main.run( new TRANSITIONS.CrossFade(), main.last, SurvivalScreen, { duration : 20 });
			}
		}}
	})
}});
var menuTempLabel = new Label({left:0, right:0, height:80, string:"25 \xB0 C", style: buttonStyle});
var temperatureButton = BUTTONS.Button.template(function($){ return{
	width: 120, height: 90 ,skin: temperatureButtonSkin,
	contents: [ menuTempLabel ],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			if(currentScreen != "temperature") {
				currentScreen = "temperature";
				main.run( new TRANSITIONS.CrossFade(), main.last, TemperatureScreen, { duration : 20 });
			}
		}}
	})
}});

var tButton = new temperatureButton();
var sButton = new scheduleButton();
var suButton = new survivalButton();

var menu = new Line({
	left:0, right: 0, height:72, contents: [
		sButton,
		tButton,
		suButton
	], skin: babyblueskin
});
var main = new MainScreen();
var full = new FullScreen();

full.add(main);
full.add(menu);
application.add(full);
main.add(TemperatureScreen);

application.behavior = new ApplicationBehavior();