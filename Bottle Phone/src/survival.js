var MySlider = SLIDERS.HorizontalSlider.template(function($){ return{
  height:50, left:50, right:50,
  behavior: Object.create(SLIDERS.HorizontalSliderBehavior.prototype, {
    onValueChanged: { value: function(container){
      SLIDERS.HorizontalSliderBehavior.prototype.onValueChanged.call(this, container);
      trace("Value is: " + this.data.value + "\n");
      dispense_rate = this.data.value.toFixed(0);
      dispense_rate_label.string = "Dispense " + dispense_rate + " oz";
      updateDeviceDispenseRate();
      
  }}})
}});

var MySlider1 = SLIDERS.HorizontalSlider.template(function($){ return{
  height:50, left:50, right:50,
  behavior: Object.create(SLIDERS.HorizontalSliderBehavior.prototype, {
    onValueChanged: { value: function(container){
      SLIDERS.HorizontalSliderBehavior.prototype.onValueChanged.call(this, container);
      trace("Value is: " + this.data.value + "\n");
      dispense_time = this.data.value.toFixed(0);
      dispense_time_label.string = "every " + dispense_time + " mins";
      updateDeviceDispenseRate();
      
  }}})
}});

var MySwitchTemplate = SWITCHES.SwitchButton.template(function($){ return{
  height:50, width: 100,
  behavior: Object.create(SWITCHES.SwitchButtonBehavior.prototype, {
    onValueChanged: { value: function(container){
      SWITCHES.SwitchButtonBehavior.prototype.onValueChanged.call(this, container);
      trace("Value is: " + this.data.value + "\n");
      if (this.data.value == 1) {
      	survival_mode = "ON";
      } else {
      	survival_mode = "OFF";
      }
      survival_mode_label.string = "Survival mode is " + survival_mode;
      updateDeviceSurvivalMode(); 
  }}})
}});



var MyButtonTemplate = BUTTONS.Button.template(function($){ return{
  top:50, bottom:50, left:50, right:50,
  contents:[
    new Label({left:0, right:0, height:55, string:$.textForLabel, style:bigText})
  ],
  behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
    onTap: { value:  function(button){
      trace("Button was tapped.\n");
      save_label.visible = true;
    }}
  })
}});


var save_button = new MyButtonTemplate({textForLabel:"Save"});


exports.mainCol = new Column({
	left:0, right:0, top:0, bottom:0,
	skin: whiteS,
	contents:[
		new Column({left:0, right:0, top:0, height:80, skin: whiteS,
			contents:[
				new Label({right: 90, top: 20, string:"Bot-tle", style:titleStyle,}),
			]
		}),
		new Column({name: "secondCol", left:0, right:0, top:0, bottom:0, skin: blueSkinLabel,
			contents:[
				save_label,
				survival_title_label,
				new MySwitchTemplate({value: 0}),					
				survival_mode_label,
				new MySlider({ min:0, max:100, value:50 }),
				dispense_rate_label,
				new MySlider1({ min:0, max:100, value:50 }),
				dispense_time_label,
				save_button, 
				
			]
		}),
	]
});