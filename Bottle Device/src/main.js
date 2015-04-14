// Bottle Device Application

// Skins and Styles
var whiteSkin = new Skin( { fill:"white" } );
var labelStyle = new Style( { font: "bold 20px", color:"black" } );

// Internal Variables
phoneURL = "";
temperature_unit = "\xB0 F"; //default temperature to Fahrenheit
current_temperature = 70; // range of temp should be 32 degrees for freezing to 212 degrees for boiling
current_temperature_string = current_temperature + temperature_unit;
desired_temperature = 70; 
desired_temperature_string = desired_temperature + temperature_unit;
old_slider = 32;
new_slider = 32;

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
		desired_temperature = parseFloat(text);
		desired_temperature_string = desired_temperature + temperature_unit;
		desired_temperature_label.string = desired_temperature_string;
		trace("desired temp " + desired_temperature);
	    //current_temperature = parseFloat(text);
	    //current_temperature_string = current_temperature + temperature_unit;
	    //current_temperature_label.string = current_temperature_string;
	}
}));

Handler.bind("/updateSurvivalMode", Behavior({
	onInvoke: function(handler, message){
	    handler.invoke(new Message(phoneURL + "currentSurvivalMode"), Message.TEXT);
	},
	onComplete: function(handler, message, text) {
	    survival_mode_switch.string = text;
	}
}));

Handler.bind("/potResult", Object.create(Behavior.prototype, {
	onInvoke: { value: function( handler, message ){
				application.distribute( "receiveSliderChange", message.requestObject );
				if ( new_slider != old_slider ) { // if the slider value changed
				    current_temperature = new_slider;
				    current_temperature_string = current_temperature + temperature_unit;
				    current_temperature_label.string = current_temperature_string;
				    old_slider = new_slider;
				    d = new Date(); // update last-time updated displayed time
	                last_time_updated.string = d.toString();
				    handler.invoke( new Message(phoneURL + "updateTemperature"), Message.JSON );
				}
			}}
}));
var desired_temperature_label = new Label({left:0, right:0, height:40, width:70, string:desired_temperature, style: labelStyle});
var current_temperature_label = new Label({left:0, right:0, height:40, width:70, string:current_temperature, style: labelStyle});
var last_time_updated = new Label({left:20, right:20, height:40, string:new Date(), style: labelStyle});
var survival_mode_switch = new Label({left:0, right:0, height:40, width:80, string:"OFF", style: labelStyle});

var mainColumn = new Column({
	left: 0, right: 0, top: 0, bottom: 0, skin: whiteSkin,
	contents: [
	    new Line({left:10, right:10, top:10, bottom:0,
				contents:[
				    new Label({left:20, right:0, width: 160, height:40, string:"Desired Temperature:", style: labelStyle}),
				    desired_temperature_label,
      			]
			}),
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
	    new_slider = (data.slider).toFixed(0);
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