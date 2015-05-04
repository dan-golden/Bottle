var alert_label = new Label({ left: 50, right: 0, top:15, vertical: 'middle', style: bottleStyle, string: 'Alert: '});
function checkValidAmount(amount) {
	if (amount>24) {
		return false; 
	} else {
		return true;
	}}

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
  height:50, width: 10, right: 70, left: 0, top: 0, 
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



/*var MyButtonTemplate = BUTTONS.Button.template(function($){ return{
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
}});*/

var amount = ""; 

var validMessage = new Label( {left: 0, right:0, style: errorStyle, string: "Selected amount exceeds bottle capacity!", visible: false})	


var MyField = Container.template(function($) { return { 
  width: 170, height: 36, top: 0, skin: nameInputSkin, contents: [
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
              amount = label.string;
              
              label.container.hint.visible = ( data.name.length == 0 );	
              

			if(checkValidAmount(amount) == true) {
				validMessage.visible = false;
			} else {
				validMessage.visible = true;
			}
			
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


var MyField1 = Container.template(function($) { return { 
  width: 170, height: 36, top: 0, skin: nameInputSkin, contents: [
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
              amount = label.string;
              
              label.container.hint.visible = ( data.name.length == 0 );	
              

			
			
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

//var save_button = new MyButtonTemplate({textForLabel:"Save"});

	
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
var BottleLogo = new Texture("./bottleTitle.png");
var logoSkin = new Skin({
    width: 320,
    height: 50,
	texture: BottleLogo,
	fill:"black",
});
var rateField = new MyField1({ name: "",});
var amountField = new MyField({ name: "",});
exports.SurvivalScreen = Container.template(function($) {return { left: 0, right: 0, top: 0, bottom: 0, skin: babyblueskin, active: true, contents: [ 

	new Column({left:0, right:0, top:0, bottom:0, skin: babyblueskin,
	contents:[
		new Content({width: 320, height:50, skin:logoSkin}),
		validMessage,
		new Column({name: "secondCol", left:0, right:0, top:0, skin: babyblueskin,
			contents:[
				//save_label,
				survival_title_label,
				new Line({left:0, right:0, top:0, bottom:0, skin: babyblueskin, contents: [
					alert_label, 
					new MySwitchTemplate({value: 0}),	
					
				]
			}),

				new Line({left:0, right:0, top:0, height: 40, skin: babyblueskin, contents: [
				new Label({string: "Dispense " }),
				amountField, 
				new Label({string: " oz "}),	
					
				]
			}),
				new Line({left:26, right:0, top:0, skin: babyblueskin, contents: [
				new Label({string: "Every " }),
				rateField, 
				new Label({string: " minutes "}),	
					
				]
			}),
				
				
			], 
behavior: Object.create(Container.prototype, {
    onTouchEnded: { value: function(content){
      KEYBOARD.hide();
      content.focus();
    }}
  })
		}),
	], 
}) 
], 

behavior: Object.create(Container.prototype, {
    onTouchEnded: { value: function(content){
      KEYBOARD.hide();
      content.focus();
    }}
  })
}});