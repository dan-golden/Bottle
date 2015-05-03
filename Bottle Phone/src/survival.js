var alert_label = new Label({ left: 50, right: 0, top:15, vertical: 'middle', style: bottleStyle, string: 'Alert: '});


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
  height:50, width: 10, right: 70, left: 0, 
  behavior: Object.create(SWITCHES.SwitchButtonBehavior.prototype, {
    onValueChanged: { value: function(container){
      SWITCHES.SwitchButtonBehavior.prototype.onValueChanged.call(this, container);
      trace("Value is: " + this.data.value + "\n");
      if (this.data.value == 1) {
      	survival_mode = "ON";
      } else {
      	survival_mode = "OFF";
      }
      survival_mode_label.string = "Water Monitoring is " + survival_mode;
      updateDeviceSurvivalMode(); 
  }}})
}});

var MyButtonTemplate = BUTTONS.Button.template(function($){ return{
  top:25, bottom:25, left:-10, right:-10, height: 50, skin: navyblueskin,
  contents:[
    new Label({left:0, right:0, height:50, string:$.textForLabel, style:textStyle})
  ],
  behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
    onTap: { value:  function(button){
      trace("Button was tapped.\n");
      save_label.visible = true;
    }}
  })
}});


function checkValidAmount(amount) {
	if (amount>24) {
		return false; 
	} else {
		return true;
	}}

var validMessage = new Label( {left: 100, right:100, style: errorStyle, string: "Selected amount exceeds bottle capacity!", visible: false})	


var MyField = Container.template(function($) { return { 
  width: 170, height: 36, skin: nameInputSkin, contents: [
    Scroller($, { 
      left: 4, right: 4, top: 4, bottom: 4, active: true, name: "scroller", fill: "white", style: bottleStyle,
      behavior: Object.create(CONTROL.FieldScrollerBehavior.prototype), clip: true, contents: [
        Label($, { 
          name: "textbox", left: 0, top: 0, bottom: 0, skin: THEME.fieldLabelSkin, style: bottleStyle, anchor: 'AMOUNT',
          editable: true, string: $.name,
         	behavior: Object.create( CONTROL.FieldLabelBehavior.prototype, {
         		onEdited: { value: function(label){
         			var data = this.data;
              data.name = label.string;
              label.container.hint.visible = ( data.name.length == 0 );	
              
              /*var newAlert= {amount: amountField.scroller.textbox.string, 
							rate: rateField.scroller.textbox.string};
			if(checkValidAmount(amount)) {
				validMessage.visible = false;
			} else {
				validMessage.visible = true;
			}*/
			
         		}}
         	}),
         }),
         Label($, {
   			 	left:4, right:4, top:4, bottom:4, style:fieldHintStyle, string:"", name:"hint",
         })
      ]
    })
  ]
}});


var save_button = new MyButtonTemplate({textForLabel:"Save"});

	
/**var save_Button = BUTTONS.Button.template(function($){ return{
	left:10, right: 10, height:50,skin: navyblueskin,
	contents: [
		new Label({left:0, right:0, height:40, string:"Save", style: buttonStyle})
	],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			
		}}
	})
}});**/

var rateField = new MyField({ name: "",});
var amountField = new MyField({ name: "",});
rateField.scroller.hint.string = "min";
amountField.scroller.hint.string = "amt.";

exports.mainCol = new Column({
	left:0, right:0, top:0, bottom:0,
	skin: babyblueskin,
	contents:[
		new Column({left:0, right:0, top:0, height:80, skin: babyblueskin,
			contents:[
				new Label({right: 90, top: 20, string:"Bot-tle", style:bottleStyle,}),
				
			]
		}),
		validMessage,
		new Column({name: "secondCol", left:0, right:0, top:0, bottom:0, skin: babyblueskin,
			contents:[
				save_label,
				survival_title_label,
				new Line({left:0, right:0, top:0, bottom:0, skin: babyblueskin, contents: [
					alert_label, 
					new MySwitchTemplate({value: 0}),	
					
				]
			}),
			
								
				//new MySlider({ min:0, max:100, value:50 }),
				dispense_rate_label,
				amountField, 
				//new MySlider1({ min:0, max:100, value:50 }),
				dispense_time_label,
				rateField, 
				save_button, 
				
			]
		}),
	]
});