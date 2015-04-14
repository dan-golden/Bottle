// KPR Script file

// Update Phone and Device Temperature
function updateTemperature(newTemp) {
    // make sure current_temperature is up to date before calling this to update device
    current_temperature = newTemp;
    //current_temperature_string = current_temperature + temperature_unit;
    //current_temperature_label.string = current_temperature_string;
    updateDeviceTemperature(current_temperature);
}

// Button Templates
var IncreaseTemperatureButtonTemplate = BUTTONS.Button.template(function($){ return{
  top:50, bottom:50, left:50, right:50,
  contents:[
    new Label({name: "label", left:0, right:0, height:55, string:$.textForLabel, style:textStyle}),
  ],
  behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
    onTap: { value:  function(button){
      updateTemperature(current_temperature + 1);
      save_label.string = "Changes saved!";
    }}
  })
}});

var DecreaseTemperatureButtonTemplate = BUTTONS.Button.template(function($){ return{
  top:50, bottom:50, left:50, right:50,
  contents:[
    new Label({name: "label", left:0, right:0, height:55, string:$.textForLabel, style:textStyle}),
  ],
  behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
    onTap: { value:  function(button){
      updateTemperature(current_temperature - 1);
      save_label.string = "Changes saved!";
    }}
  })
}});

var SmallTextButtonTemplate = BUTTONS.Button.template(function($){ return{
  top:25, bottom:10, left:5, right:5, width: 15,
  contents:[
    new Label({left:0, right:0, height:55, string:$.textForLabel, style:textStyle})
  ],
  behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
    onTap: { value:  function(button){
      updateTemperature($.temp);
      save_label.string = "Changes saved!";
    }}
  })
}});

// Buttons
var increase_button = new IncreaseTemperatureButtonTemplate({textForLabel:"^",});
var decrease_button = new DecreaseTemperatureButtonTemplate({textForLabel:"v",});
var cold_button = new SmallTextButtonTemplate({textForLabel:"c", temp: 40});
var room_button = new SmallTextButtonTemplate({textForLabel:"r", temp: 72});
var hot_button = new SmallTextButtonTemplate({textForLabel:"h", temp: 150});
var boil_button = new SmallTextButtonTemplate({textForLabel:"b", temp: 212});
//var water_button = new SmallTextButtonTemplate({textForLabel:"water", temp: current_temperature});
//var tea_button = new SmallTextButtonTemplate({textForLabel:"tea", temp: current_temperature});
//var coffee_button = new SmallTextButtonTemplate({textForLabel:"coffee", temp: current_temperature});
//var iceTea_button = new SmallTextButtonTemplate({textForLabel:"iced tea", temp: current_temperature});

// Labels
// var current_temperature_label = new Label({string: current_temperature_string, style:textStyle, skin: blueSkin});

// Columns
var mainCol = new Column({
	left:0, right:0, top:0, bottom:0,
	skin: whiteS,
	contents:[
		new Line({left:0, right:0, top:0, height:80, skin: whiteSkin,
			contents:[
				new Label({left:-18, right:0, string:"Bot-tle", style:textStyle,}),
			]
		}),
		new Line({left:0, right:0, top:0, bottom:0, skin: whiteSkinLabel,
			contents:[
				new Label({left:10, right:20, string:"Current Temperature:", style:textStyle, skin: whiteSkin}),
			]
		}),
	],
});

exports.homeCol = new Column({
	left:0, right:0, top:0, bottom:0,
	skin: whiteS,
	contents:[
		new Column({left:0, right:0, top:0, height:80, skin: whiteSkin,
			contents:[
				new Label({right: 90, top: 20, string:"Bot-tle", style:textStyle,}),
			]
		}),
		new Column({name: "tempControl", left:0, right:0, top:0, bottom:0, skin: whiteSkinLabel,
			contents:[
				increase_button,
				current_temperature_label,
				decrease_button,
				new Line({left:0, right:0, top:0, bottom:0,
					contents:[ cold_button, room_button, hot_button, boil_button]
				}),
				//new Line({left:0, right:0, top:0, bottom:0,
					//contents:[ water_button, tea_button, coffee_button, iceTea_button]
				//}),
			]
		}),
	],
});
