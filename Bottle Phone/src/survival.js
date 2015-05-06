var alert_label = new Label({ left: 50, right: 0, top:15, vertical: 'middle', style: bottleStyle, string: 'Alert: '});


var MySlider = SLIDERS.HorizontalSlider.template(function($){ return{
  height:50, left:50, right:50,
  behavior: Object.create(SLIDERS.HorizontalSliderBehavior.prototype, {
    onValueChanged: { value: function(container){
      SLIDERS.HorizontalSliderBehavior.prototype.onValueChanged.call(this, container);
      //trace("Value is: " + this.data.value + "\n");
      dispense_rate = this.data.value.toFixed(0);
      dispense_rate_label.string = "Dispense " + dispense_rate + " oz";
      updateDeviceDispenseRate();
      
  }}})
}});


/*var MySlider1 = SLIDERS.HorizontalSlider.template(function($){ return{
  height:50, left:50, right:50,
  behavior: Object.create(SLIDERS.HorizontalSliderBehavior.prototype, {
    onValueChanged: { value: function(container){
      SLIDERS.HorizontalSliderBehavior.prototype.onValueChanged.call(this, container);
      trace("Value is: " + this.data.value + "\n");
      dispense_time = this.data.value.toFixed(0);
      dispense_time_label.string = "every " + dispense_time + " mins";
      updateDeviceDispenseRate();
      
  }}})
}});*/

var MySwitchTemplate = SWITCHES.SwitchButton.template(function($){ return{
  height:50, width: 10, right: 70, left: 0, top: 0, 
  behavior: Object.create(SWITCHES.SwitchButtonBehavior.prototype, {
    onValueChanged: { value: function(container){
      SWITCHES.SwitchButtonBehavior.prototype.onValueChanged.call(this, container);
      //trace("Value is: " + this.data.value + "\n");
      if (this.data.value == 1) {
      	survival_mode = "ON";
      	line1.visible = true; 
      	line2.visible = true;
      	save_button.visible = true;
      } else {
      	survival_mode = "OFF";
      	save_label.visible = false;
      	line1.visible = false;
      	line2.visible = false; 
      	save_button.visible = false;
      	validMessage.visible = false;
      }
      survival_mode_label.string = "Water Tracking is " + survival_mode;
      updateDeviceSurvivalMode(); 
      
  }}})
}});

var MyButtonTemplate = BUTTONS.Button.template(function($){ return{
	height:50, skin: saveLogoSkin, visible: false,
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			//trace("Button was tapped.\n");
     		 if(checkValidAmount(dispense_rate) == false) {
				save_label.visible = false;
			} else {
				save_label.visible = true;
			}
     		 
     		 //content.invoke(new Message("/currentSurvivalMode"));
     		 content.invoke(new Message(deviceURL + "updateSurvivalMode"), Message.JSON);
     		 //trace("calling device's update survival handler");
     		 
			}}, 
			
	})
}});



var validMessage = new Label( {left: 0, right:0, top: 15, style: errorStyle, string: "Please enter a valid amount up to 24oz", visible: false})	

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
              //amount = label.string;
              dispense_rate = parseFloat(label.string);
              //trace("printing dispense rate " + dispense_rate); 
              label.container.hint.visible = ( data.name.length == 0 );	
              

			if(checkValidAmount(dispense_rate) == true) {
				validMessage.visible = false;
				save_label.visible = false;
			} else {
				validMessage.visible = true;
			}
			

              		data.name = label.string;
              		amount = label.string;
              		label.container.hint.visible = ( data.name.length == 0 );	
					if(checkValidAmount(amount) == true) {
						validMessage.visible = false;
					} else {
						validMessage.visible = true;
					}	
         		}},
         		onFocused: { value: function(label){
         			menu.visible = false;
         			KEYBOARD.show();
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
              //amount = label.string;
              
              dispense_time = parseFloat(label.string);
              //trace("printing dispense time " + dispense_time); 
              label.container.hint.visible = ( data.name.length == 0 );	
              

			
			

         			var data = this.data;	
          		    data.name = label.string;
              		amount = label.string;
	                label.container.hint.visible = ( data.name.length == 0 );	
         		}},
         		onFocused: { value: function(label){
         			menu.visible = false;
         			KEYBOARD.show();
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

var SaveLogo = new Texture("./save.png");
var saveLogoSkin = new Skin({
    width: 120,
    height: 40,
	texture: SaveLogo,
});

var save_button = new MyButtonTemplate({textForLabel:"Save", skin: saveLogoSkin, visible: false});

var BottleLogo = new Texture("./bottleTitle.png");
var logoSkin = new Skin({
    width: 320,
    height: 50,
	texture: BottleLogo,
	fill:"black",
});
var rateField = new MyField1({ name: "", string: 0});
var amountField = new MyField({ name: "",});
var line1 = new Line({left:0, right:0, top:0, height: 40, visible: false, contents: [
				new Label({string: "Dispense " }),
				amountField, 
				new Label({string: " oz "}),	
					
				]})
var line2 = new Line({left:26, right:0, top:0,  visible: false, contents: [
				new Label({string: "Every " }),
				rateField, 
				new Label({string: " minutes "}),	
					
				]
			})
exports.SurvivalScreen = Container.template(function($) {return { left: 0, right: 0, top: 0, bottom: 0, active: true, contents: [ 

	new Column({left:0, right:0, top:0, bottom:0, 
	contents:[
		new Content({width: 320, height:50, skin:logoSkin}),
		validMessage,
		new Column({name: "secondCol", left:0, right:0, top:0, 
			contents:[
				save_label,
				survival_title_label,
				new Line({left:0, right:0, top:0, bottom:0, contents: [
					new Label({left:50, right:0, top:0, bottom:0, width: 80, string: "Water Consumed: "}),	
					consumption_level_label, 
					new Label({left:0, right:0, top:0, bottom:0, string: " oz", }),	
					
				]
			}),
				new Line({left:0, right:0, top:0, bottom:0,contents: [
					alert_label, 
					new MySwitchTemplate({value: 0}),	
					
				]
			}),
				line1, 
				line2, 
				save_button,	
			], 
behavior: Object.create(Container.prototype, {
    onTouchEnded: { value: function(content){
      KEYBOARD.hide();
      content.focus();
      application.invoke(new Message("/delayShowMenu"));
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
      application.invoke(new Message("/delayShowMenu"));
    }}
  })
}});