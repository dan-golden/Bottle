// Bottle Device Application

// Skins and Styles
var whiteSkin = new Skin( { fill:"white" } );
var labelStyle = new Style( { font: "bold 20px", color:"black" } );

// Internal Variables
phoneURL = "";
temperature_unit = "\xB0 F"; //default temperature to Fahrenheit
current_temperature = "70" + temperature_unit; // range of temp should be 32 degrees for freezing to 212 degrees for boiling
old_slider = 70;
new_slider = 70;
survival_mode = "OFF";
dispense_rate = ""; 
dispense_time = 0;

// Handler calls
Handler.bind("/discover", Behavior({
	onInvoke: function(handler, message){
		phoneURL = JSON.parse(message.requestText).url;
	}
}));

Handler.bind("/forget", Behavior({
	onInvoke: function(handler, message){
		phoneURL = "";
	}
}));

Handler.bind("/currentTemperature", Behavior({
	onInvoke: function(handler, message){
	    message.responseText = current_temperature;
	}
}));

Handler.bind("/updateTemperature", Behavior({
	onInvoke: function(handler, message){
	    d = new Date();
	    // update last-time updated displayed time
	    last_time_updated.string = d.toString();
	    handler.invoke(new Message(phoneURL + "currentTemperature"), Message.TEXT);
	},
	onComplete: function(handler, message, text) {
	    current_temperature = text;
	    current_temperature_label.string = current_temperature;
	}
}));

Handler.bind("/updateSurvivalMode", Behavior({
	onInvoke: function(handler, message){
	    handler.invoke(new Message(phoneURL + "currentSurvivalMode"), Message.TEXT);
	    trace("inside updateSurvivalMode");
	},
	onComplete: function(handler, message, text) {
		survival_mode = text; 
	    survival_mode_switch.string = survival_mode;
	    trace("completed Survival Mode");
	}
}));

Handler.bind("/updateDispenseRate", Behavior({
	onInvoke: function(handler, message){
	    handler.invoke(new Message(phoneURL + "currentDispenseRate"), Message.JSON);
	    trace("inside updateDispenseRate");
	},
	onComplete: function(handler, message, json) {
		dispense_time = json.time;
		dispense_rate = json.rate;
		dispense_rate_label.string = "Dispensing " + dispense_rate + " oz every " + dispense_time + " mins";
	    trace("completed updateDispenseRate");
	}
}));


Handler.bind("/potResult", Object.create(Behavior.prototype, {
	onInvoke: { value: function( handler, message ){
				application.distribute( "receiveSliderChange", message.requestObject );
				
				if ( new_slider != old_slider ) { // if the slider value changed
				    current_temperature = new_slider.toString() + temperature_unit;
				    current_temperature_label.string = current_temperature;
				    old_slider = new_slider;
				    d = new Date(); // update last-time updated displayed time
	                last_time_updated.string = d.toString();
				    handler.invoke( new Message(phoneURL + "updateTemperature"), Message.JSON );
				}
				
				handler.invoke( new Message(phoneURL + "updateSurvivalMode"), Message.JSON );
				
				
			}}
}));

var current_temperature_label = new Label({left:0, right:0, height:40, width:70, string:current_temperature, style: labelStyle});
var last_time_updated = new Label({left:20, right:20, height:40, string:new Date(), style: labelStyle});
var survival_mode_switch = new Label({left:0, right:0, height:40, width:80, string: survival_mode, style: labelStyle});
var dispense_rate_label = new Label({left:0, right:0, height:40, width:80, string: dispense_rate, style: labelStyle});

var mainColumn = new Column({
	left: 0, right: 0, top: 0, bottom: 0, skin: whiteSkin,
	contents: [
	    new Line({left:10, right:10, top:10, bottom:0,
				contents:[
				    new Label({left:20, right:0, width: 160, height:40, string:"Current Temperature:", style: labelStyle}),
				    current_temperature_label,
      			]
			}),
		new Line({left:10, right:10, top:10, bottom:0,
				contents:[
				    new Label({left:20, right:0, width: 160, height:40, string:"Survival Mode:", style: labelStyle}),
				    survival_mode_switch,
      			]
			}),
		new Line({left:10, right:10, top:10, bottom:0,
				contents:[
				    //new Label({left:20, right:0, width: 160, height:40, string:"Dispense Rate:", style: labelStyle}),
				    dispense_rate_label,
      			]
			}),
		new Line({left:10, right:10, top:10, bottom:0,
				contents:[
				    new Label({left:0, right:0, height:40, string:"Last Updated At:", style: labelStyle}),
      			]
			}),
		new Line({left:10, right:10, top:10, bottom:0,
				contents:[
				    last_time_updated,
      			]
			}),
	]
});

var ApplicationBehavior = Behavior.template({
	onLaunch: function(application) {
		application.shared = true;
	},
	onDisplayed: function(application) {
		application.discover("bottlePhone");
	},
	onQuit: function(application) {
		application.shared = false;
		application.forget("bottlePhone");
	},
})

var MainContainer = Container.template(function($) { return { left: 0, right: 0, top: 0, bottom: 0, }});

var MainCanvas = Canvas.template(function($) { return { left: 10, right: 10, top: 10, bottom: 10, behavior: Object.create((MainCanvas.behaviors[0]).prototype), }});
MainCanvas.behaviors = new Array(1);
MainCanvas.behaviors[0] = Behavior.template({
	onDisplaying: function(content) {
		this.canvas = content;
            	// start asking for readings once the canvas is loaded 
				application.invoke( new MessageWithObject( "pins:/potentiometers/read?repeat=on&callback=/potResult&interval=70" ) );
	},
	receiveSliderChange: function(params, data) {
	    new_slider = (data.slider*180 + 32).toFixed(2);
	},

})
var mainCanvas = new MainCanvas();
        application.add( mainCanvas );
        
		application.invoke( new MessageWithObject( "pins:configure", {
            potentiometers: {
                require: "potentiometers",
                pins: {
					slider: { pin: 64 },
                }
            },
        }));
        
application.behavior = new ApplicationBehavior();
application.add(mainColumn);