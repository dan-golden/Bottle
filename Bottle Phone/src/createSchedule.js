SCHEDULE_SCREEN = require('schedules.js');

function checkValidHours(hour) {
	if(isNaN(hour)) {
		return false;
	} else if(+hour > 24 || +hour < 0) {
		return false;
	}
	return true;
}

function checkValidMinutes(min) {
	if(isNaN(min)) {
		return false;
	} else if(+min > 59 || +min < 0) {
		return false;
	}
	return true;
}

function checkValidTemp(temp) {
	if(isNaN(temp)) {
		return false;
	}
	return true;
}


var cancelButton = BUTTONS.Button.template(function($){ return{
	left:0, right:0, height:50,
	contents: [
		new Label({left:0, right:0, height:40, string:"Cancel", style: buttonStyle})
	],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			toScreen = "Schedule";
			content.bubble("onTriggerTransition");
		}}
	})
}});

var saveButton = BUTTONS.Button.template(function($){ return{
	left:0, right: 0, height:50,
	contents: [
		new Label({left:0, right:0, height:40, string:"Save", style: buttonStyle})
	],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
		
			var newSchedule = {name: nameField.scroller.textbox.string, 
							temperature: tempField.scroller.textbox.string, 
							repeat: repeatSwitchValue, 
							repeatedDays: selectedBoxes, 
							hours: hourField.scroller.textbox.string,
							minutes: minuteField.scroller.textbox.string};
			if(checkValidTemp(newSchedule.temperature) && checkValidHours(newSchedule.hours) && checkValidMinutes(newSchedule.minutes)) {
				validMessage.visible = false;
				schedules.push(newSchedule);
				toScreen = "Schedule";
				content.bubble("onTriggerTransition");
			} else {
				validMessage.visible = true;
			}
		}}
	})
}});
              
var MyField = Container.template(function($) { return { 
  width: 200, height: 36, skin: nameInputSkin, contents: [
    Scroller($, { 
      left: 4, right: 4, top: 4, bottom: 4, active: true, name: "scroller",
      behavior: Object.create(CONTROL.FieldScrollerBehavior.prototype), clip: true, contents: [
        Label($, { 
          name: "textbox", left: 0, top: 0, bottom: 0, skin: THEME.fieldLabelSkin, style: fieldStyle, anchor: 'NAME',
          editable: true, string: $.name,
         	behavior: Object.create( CONTROL.FieldLabelBehavior.prototype, {
         		onEdited: { value: function(label){
         			var data = this.data;
              data.name = label.string;
              label.container.hint.visible = ( data.name.length == 0 );	
         		}}
         	}),
         }),
         Label($, {
   			 	left:4, right:4, top:4, bottom:4, style:fieldHintStyle, string:"Tap to enter info...", name:"hint"
         })
      ]
    })
  ]
}});

var selectedBoxes = [];

var MyCheckBoxTemplate = BUTTONS.LabeledCheckbox.template(function($){ return{
    top:10, bottom:10, left:10, right:10, visible: true, active: true,
    behavior: Object.create(BUTTONS.LabeledCheckboxBehavior.prototype, {
        onSelected: { value:  function(checkBox){
            selectedBoxes.push(checkBox.buttonLabel.string);
        }},
        onUnselected: { value:  function(checkBox){
            selectedBoxes.pop(checkBox.buttonLabel.string);
        }}
    })
}});

var checkbox = [];
checkbox[0] = new MyCheckBoxTemplate({name:"Su", visible: false});
checkbox[1] = new MyCheckBoxTemplate({name:"M", visible: false});
checkbox[2] = new MyCheckBoxTemplate({name:"Tu", visible: false});
checkbox[3] = new MyCheckBoxTemplate({name:"W", visible: false});
checkbox[4] = new MyCheckBoxTemplate({name:"Th", visible: false});
checkbox[5] = new MyCheckBoxTemplate({name:"F", visible: false});
checkbox[6] = new MyCheckBoxTemplate({name:"Sa", visible: false});


var MySwitchTemplate = SWITCHES.SwitchButton.template(function($){ return{
  height:50,
  behavior: Object.create(SWITCHES.SwitchButtonBehavior.prototype, {
    onValueChanged: { value: function(container){
      repeatSwitchValue = 1-repeatSwitchValue;
      SWITCHES.SwitchButtonBehavior.prototype.onValueChanged.call(this, container);
      for(i = 0; i<7; i++){
      	checkbox[i].visible = !checkbox[i].visible;
      }
  }}})
}});

var TextContainerTemplate = Container.template(function($) { return {
  skin: whiteSkin, active: true,
  behavior: Object.create(Container.prototype, {
    onTouchEnded: { value: function(content){
      KEYBOARD.hide();
      content.focus();
    }}
  })
}});

var repeatSwitch = new MySwitchTemplate({ left:0, right:0 });
var repeatSwitchValue = 0;
var tempField = new MyField({ name: "", width: 100});
var nameField = new MyField({name: "", width: 100});
var hourField = new MyField({name: "", width: 50});
hourField.scroller.hint.string = "Hours";
var minuteField = new MyField({name: "", width: 50});
minuteField.scroller.hint.string = "Minutes";
var validMessage = new Label( {left: 100, right:100, style: errorStyle, string: "Error!", visible: false})

exports.CreateScheduleScreen = Container.template(function($) { return { left: 0, right: 0, top: 0, bottom: 0, skin: blueSkin, active: true, contents: [ 
	new Column( { left: 0, right: 0, top:0, contents: [
		Label($, { left: 100, right: 100, style: labelStyle, string: 'New Schedules', }),
		new Line( { left:0, right:0, contents: [new cancelButton(), new saveButton()] }),
		validMessage,
		new Line( { left:0, right:0, contents: [
			Label($, {left: 0, right: 0, style: labelStyle, string: "Name (Optional): "}),
			nameField
		]}),
		new Line( { left:0, right:0, contents: [
			Label($, {left: 0, right: 0, style: labelStyle, string: "Temperature (Degrees C): "}),
			tempField
		]}),
		new Line( { left:0, right:0, contents: [
			Label($, {left: 0, right: 0, style: labelStyle, string: "Time: "}),
			hourField,
			Label($, {left: 0, right: 0, style: labelStyle, string: ":"}),
			minuteField,
		]}),
		new Line( { left:0, right:0, contents: [
			Label($, {left: 0, right: 0, style: labelStyle, string: "Repeat?: "}),
			repeatSwitch
		]}),
		new Column( { left:0, right:0, contents: [
			Label($, {left: 0, right: 0, style: labelStyle, string: "Days: "}),
			new Column({left:0, right: 0, contents:[
				new Line({left:0, right:0, contents:[
					checkbox[0], checkbox[1], checkbox[2], checkbox[3]]
				}),
				new Line({left:0, right:0, contents: [
					checkbox[4], checkbox[5], checkbox[6]]
				})]}),
		]}),
	]})
],
behavior: Object.create(Container.prototype, {
    onTouchEnded: { value: function(content){
      KEYBOARD.hide();
      content.focus();
    }}
  })
}});

