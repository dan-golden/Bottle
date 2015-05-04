SCHEDULE_SCREEN = require('schedules.js');

function checkValidHours(hour) {
	if(isNaN(hour) || hour=="") {
		return false;
	} else if(+hour > 24 || +hour < 0) {
		return false;
	}
	return true;
}

function checkValidMinutes(min) {
	if(isNaN(min) || min == "") {
		return false;
	} else if(+min > 59 || +min < 0) {
		return false;
	}
	return true;
}

function checkValidTemp(temp) {
	if(isNaN(temp) || temp == "") {
		return false;
	}
	return true;
}

function checkValidSchedule(schedule) {
	if(!checkValidTemp(schedule.temperature)){
		return false;
	} else if(!checkValidHours(schedule.hours)) {
		return false;
	} else if(!checkValidMinutes(schedule.minutes)) {
		return false;
	} else if(schedule.repeat == 1 && schedule.repeatedDays.length == 0) {
		return false;
	}
	return true;
}

function reset() {
	tempField.scroller.textbox.string = ""; 
	hourField.scroller.textbox.string = "";
	minuteField.scroller.textbox.string = "";
	nameField.scroller.textbox.string = "";
	validMessage.visible = false;
	if(repeatSwitchValue == 1) {
		repeatSwitch.behavior.data.value = 0;
		repeatSwitch.behavior.onValueChanged(repeatSwitch);
	}
	for(i = 0; i<7; i++) {
		checkbox[i].distribute("setSelected",false,true); 
	}
	selectedBoxes = [];
	menu.visible = true;
}

var cancelButton = BUTTONS.Button.template(function($){ return{
	left:10, right:10, height:50, skin:redSkin,
	contents: [
		new Label({left:0, right:0, height:40, string:"Cancel", style: buttonStyle})
	],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			currentScreen = "schedule";
			reset();
			main.run( new TRANSITIONS.Push(), main.last, ScheduleScreen, {direction: "down", duration : 400 });
		}}
	})
}});

var saveButton = BUTTONS.Button.template(function($){ return{
	left:10, right: 10, height:50,skin: navyblueskin,
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
							minutes: minuteField.scroller.textbox.string,
							t_of_day: time_of_day};
			if(checkValidSchedule(newSchedule)) {
				validMessage.visible = false;
				schedules.push(newSchedule);
				var tempScheds = [newSchedule];
				var str = SCHEDULE_SCREEN.generateDisplayString(tempScheds);
				str.forEach(SCHEDULE_SCREEN.ListBuilder);
				reset();
				currentScreen = "schedule";
				main.run( new TRANSITIONS.Push(), main.last, ScheduleScreen, {direction: "down", duration : 400 });
			} else {
				validMessage.visible = true;
			}
		}}
	})
}});
              
var MyField = Container.template(function($) { return { 
  width: 170, height: 36, skin: nameInputSkin, contents: [
    Scroller($, { 
      left: 4, right: 4, top: 4, bottom: 4, active: true, name: "scroller", fill: "white", style: bottleStyle,
      behavior: Object.create(CONTROL.FieldScrollerBehavior.prototype), clip: true, contents: [
        Label($, { 
          name: "textbox", left: 0, top: 0, bottom: 0, skin: THEME.fieldLabelSkin, style: bottleStyle, anchor: 'NAME',
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
   			 	left:4, right:4, top:4, bottom:4, style:fieldHintStyle, string:"Tap to edit", name:"hint",
         })
      ]
    })
  ]
}});

var MyTimeField = Container.template(function($) { return { 
  width: 70, height: 36, skin: nameInputSkin, contents: [
    Scroller($, { 
      left: 4, right: 4, top: 4, bottom: 4, active: true, name: "scroller", fill: 'white',
      behavior: Object.create(CONTROL.FieldScrollerBehavior.prototype), clip: true, contents: [
        Label($, { 
          name: "textbox", left: 0, top: 0, bottom: 0, skin: THEME.fieldLabelSkin, style: bottleStyle, anchor: 'NAME',
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
   			 	left:4, right:4, top:4, bottom:4, style:fieldHintStyle, string:"Input here...", name:"hint"
         })
      ]
    })
  ]
}});

var selectedBoxes = [];

var MyCheckBoxTemplate = BUTTONS.LabeledCheckbox.template(function($){ return{
    top:10, bottom:10, left:10, right:10, visible: false, active: true,
    behavior: Object.create(BUTTONS.LabeledCheckboxBehavior.prototype, {
        onSelected: { value:  function(checkBox){
            selectedBoxes.push(checkBox.buttonLabel.string);
        }},
        onUnselected: { value:  function(checkBox){
            selectedBoxes.pop(checkBox.buttonLabel.string);
        }},
        setSelected: { value: function(checkBox, selected) {
			checkBox.variant = selected;
		}}
    })
}});

var time_of_day = "AM";

var MyTimeBoxTemplate = BUTTONS.LabeledCheckbox.template(function($){ return{
    active: true,
    behavior: Object.create(BUTTONS.LabeledCheckboxBehavior.prototype, {
        onSelected: { value:  function(checkBox){
            time_of_day = checkBox.buttonLabel.string;
            if (time_of_day == "AM") {
                am_pm[1].distribute("setSelected", false, true);
            } else {
                am_pm[0].distribute("setSelected", false, true);
            }
        }},
    })
}});

var checkbox = [];
checkbox[0] = new MyCheckBoxTemplate({name:"Su"});
checkbox[1] = new MyCheckBoxTemplate({name:"M"});
checkbox[2] = new MyCheckBoxTemplate({name:"Tu"});
checkbox[3] = new MyCheckBoxTemplate({name:"W"});
checkbox[4] = new MyCheckBoxTemplate({name:"Th"});
checkbox[5] = new MyCheckBoxTemplate({name:"F"});
checkbox[6] = new MyCheckBoxTemplate({name:"Sa"});

var am_pm = [];
am_pm[0] = new MyTimeBoxTemplate({name:"AM"});
am_pm[0].distribute("setSelected", true, true);
am_pm[1] = new MyTimeBoxTemplate({name:"PM"});

var MySwitchTemplate = SWITCHES.SwitchButton.template(function($){ return{
  height:30,skin: babyblueskin,
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
  skin: babyblueskin, active: true,
  behavior: Object.create(Container.prototype, {
    onTouchEnded: { value: function(content){
      KEYBOARD.hide();
      content.focus();
    }}
  })
}});

var repeatSwitch = new MySwitchTemplate({right:100, value:0 });
var repeatSwitchValue = 0;
var tempField = new MyField({ name: "",});
tempField.scroller.hint.string = temperature_unit;
var nameField = new MyField({name: "",});
var hourField = new MyTimeField({name: "",});
hourField.scroller.hint.string = "Hr.";
var minuteField = new MyTimeField({name: "",});
minuteField.scroller.hint.string = "Min.";
var validMessage = new Label( {left: 100, right:100, style: errorStyle, string: "Error!", visible: false})

exports.CreateScheduleScreen = Container.template(function($) { return { left: 0, right: 0, top: 0, bottom: 0, skin: babyblueskin, active: true, contents: [ 
	new Column( { left: 0, right: 0, top:0, contents: [
		new Column({left:0, right:0, top:0, height:80, skin: babyblueskin,
			contents:[
				new Label({top: 30, string:"Bot-tle", style:bottleStyle,}),
			]
		}),
		validMessage,
		new Line( { left:0, right:20, bottom: 5, contents: [
			Label($, {left: 20, right: 0, style: labelStyle, string: "Title (Optional): "}),
			nameField
		]}),
		new Line( { left:0, right:20, contents: [
			Label($, {left: 20, right: 20, style: labelStyle, string: "Temperature: "}),
			tempField
		]}),
		new Line({ left:20, right: 20, height:80, skin: babyblueskin,
			contents:[
			    Label($, {right: 20, style: labelStyle, string: "Time: "}),
			    hourField,
			    Label($, {style: labelStyle, string: ":"}),
			    minuteField,
			    new Column({left:10, right:0, top:10, height:80, skin: babyblueskin,
			        contents:[
			            am_pm[0],
			            am_pm[1],
			        ]
		        }),
			]
		}),
		new Line( { left:20, right:100, contents: [
			Label($, {left: 0, right: 0, style: labelStyle, string: "Repeat?: "}),
			repeatSwitch
		]}),
		new Column( { left:20, right:0, contents: [
			Label($, {left: 0, right: 0, style: labelStyle, string: "Days: "}),
			new Column({left:0, right: 0, contents:[
				new Line({left:0, right:0, contents:[
					checkbox[0], checkbox[1], checkbox[2], checkbox[3]]
				}),
				new Line({left:0, right:0, contents: [
					checkbox[4], checkbox[5], checkbox[6]]
				})]}),
		]}),
		new Line( {left: 60, right: 60, 
		    contents: [
		        new cancelButton(),
		        new saveButton(),
		] } ),
	]})
],
behavior: Object.create(Container.prototype, {
    onTouchEnded: { value: function(content){
      KEYBOARD.hide();
      content.focus();
    }}
  })
}});