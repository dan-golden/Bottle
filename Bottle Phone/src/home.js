// KPR Script file

// Button Templates
var MyButtonTemplate = BUTTONS.Button.template(function($){ return{
  top:50, bottom:50, left:50, right:50,
  contents:[
    new Label({name: "label", left:0, right:0, height:55, string:$.textForLabel, style:bigText}),
  ],
  behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
    onTap: { value:  function(button){
      save_label.string = "Changes saved!";
      updateDeviceTemperature($.temp);
    }}
  })
}});

var SmallTextButtonTemplate = BUTTONS.Button.template(function($){ return{
  top:25, bottom:10, left:5, right:5, width: 15,
  contents:[
    new Label({left:0, right:0, height:55, string:$.textForLabel, style:smallText})
  ],
  behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
    onTap: { value:  function(button){
      updateDeviceTemperature($.temp);
      save_label.string = "Changes saved!";
    }}
  })
}});

// Buttons
var increase_button = new MyButtonTemplate({textForLabel:"^", temp: current_temperature+1});
var decrease_button = new MyButtonTemplate({textForLabel:"V", temp: current_temperature-1});
var cold_button = new SmallTextButtonTemplate({textForLabel:"c", temp: 40});
var room_button = new SmallTextButtonTemplate({textForLabel:"r", temp: 72});
var hot_button = new SmallTextButtonTemplate({textForLabel:"h", temp: 150});
var boil_button = new SmallTextButtonTemplate({textForLabel:"b", temp: 212});
var water_button = new SmallTextButtonTemplate({textForLabel:"water", temp: current_temperature});
var tea_button = new SmallTextButtonTemplate({textForLabel:"tea", temp: current_temperature});
var coffee_button = new SmallTextButtonTemplate({textForLabel:"coffee", temp: current_temperature});
var iceTea_button = new SmallTextButtonTemplate({textForLabel:"iced tea", temp: current_temperature});

// Columns
var mainCol = new Column({
	left:0, right:0, top:0, bottom:0,
	skin: whiteS,
	contents:[
		new Line({left:0, right:0, top:0, height:80, skin: whiteS,
			contents:[
				new Label({left:-18, right:0, string:"Bot-tle", style:titleStyle,}),
			]
		}),
		new Line({left:0, right:0, top:0, bottom:0, skin: blueSkinLabel,
			contents:[
				new Label({left:10, right:20, string:"Current Temperature:", style:textStyle, skin: blueSkin}),
				current_temperature_label,
			]
		}),
	],
});

exports.homeCol = new Column({
	left:0, right:0, top:0, bottom:0,
	skin: whiteS,
	contents:[
		new Line({left:0, right:0, top:0, height:80, skin: whiteS,
			contents:[
				new Label({left:-18, right:0, string:"Bot-tle", style:titleStyle,}),
			]
		}),
		new Column({name: "tempControl", left:0, right:0, top:0, bottom:0, skin: blueSkinLabel,
			contents:[
				increase_button,
				new Label({left:-18, right:0, string: current_temperature_string, style:titleStyle,}),
				decrease_button,
				new Line({left:0, right:0, top:0, bottom:0,
					contents:[ cold_button, room_button, hot_button, boil_button]
				}),
				new Line({left:0, right:0, top:0, bottom:0,
					contents:[ water_button, tea_button, coffee_button, iceTea_button]
				}),
			]
		}),
	],
});
