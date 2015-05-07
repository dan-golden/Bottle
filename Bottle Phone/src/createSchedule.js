SCHEDULE_SCREEN = require('schedules.js');

var nameInputSkin = new Skin({ borders: { left:2, right:2, top:2, bottom:2 }, stroke: 'gray',});
var fieldStyle = new Style({ color: 'black', font: 'bold 24px Lato', horizontal: 'left', vertical: 'middle', left: 5, right: 5, top: 5, bottom: 5, });
var fieldHintStyle = new Style({ color: '#aaa', font: 'bold 24px Lato', horizontal: 'left', vertical: 'middle', left: 5, right: 5, top: 5, bottom: 5, });
var fieldHintStyle2 = new Style({ color: '#aaa', font: 'bold 18px Lato', horizontal: 'left', vertical: 'middle', left: 2, right: 2, top: 2, bottom: 2, });
var whiteSkin = new Skin({fill:"white"});

var CancelLogo = new Texture("./cancel.png");
var cancelLogoSkin = new Skin({
    width: 120,
    height: 40,
	texture: CancelLogo,
});

var SaveLogo = new Texture("./save.png");
var saveLogoSkin = new Skin({
    width: 120,
    height: 40,
	texture: SaveLogo,
});

function checkValidHours(hour) {
	if(isNaN(hour) || hour=="") {
		return false;
	} else if(+hour > 12 || +hour < 0) {
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
	} else if(+temp > 100 || +temp < 0) {
		return false;
	}
	return true;
}

function checkValidSchedule(schedule) {
    validMessage.string = "Error! ";
	if(!checkValidTemp(schedule.temperature)){
		validMessage.string += "Must input valid temperature.";
		return false;
	} else if(!checkValidHours(schedule.hours)) {
	    validMessage.string += "Must input valid hour (1-12).";
		return false;
	} else if(!checkValidMinutes(schedule.minutes)) {
	    validMessage.string += "Must input valid minute (:00-:59).";
		return false;
	} else if(schedule.repeat == 1 && schedule.repeatedDays.length == 0) {
	    validMessage.string += "Must check days to repeat if repeat is on.";
		return false;
	} else if(schedule.minutes.length !=2) {
	    validMessage.string += "Must input valid minute (2 digits).";
		return false;
	}
	return true;
}

exports.resetCreateScreen = function reset() {
    title.string = "Create a New Schedule";
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
	createScreen.column.timeFields.remove(createScreen.column.timeFields.timeButtons);
    existingValue = false;
	menu.visible = true;
}

var oldSchedule = null;
var pm = false;

exports.addAMPM = function addAMPM() {
	am_pm = new myRadioGroup({buttonNames:"AM,PM"});
	createScreen.column.timeFields.add(am_pm);
}

exports.populateFields = function populateFields(schedule) {
    title.string = "Edit Schedule " + schedule.name;
	oldSchedule = schedule;
	tempField.scroller.textbox.string = schedule.temperature; 
	hourField.scroller.textbox.string = schedule.hours;
	minuteField.scroller.textbox.string = schedule.minutes;
	nameField.scroller.textbox.string = schedule.name;
	if(schedule.repeat) {
		repeatSwitch.behavior.data.value = 1;
		repeatSwitch.behavior.onValueChanged(repeatSwitch);
	}
	selectedBoxes = schedule.repeatedDays;
	for(i = 0; i<selectedBoxes.length; i++) {
		if(selectedBoxes[i] == 'M')
			checkbox[1].distribute("setSelected",true,true);
		if(selectedBoxes[i] == 'Tu')
			checkbox[2].distribute("setSelected",true,true);
		if(selectedBoxes[i] == 'W')
			checkbox[3].distribute("setSelected",true,true);
		if(selectedBoxes[i] == 'Th')
			checkbox[4].distribute("setSelected",true,true);
		if(selectedBoxes[i] == 'F')
			checkbox[5].distribute("setSelected",true,true);
		if(selectedBoxes[i] == 'Sa')
			checkbox[6].distribute("setSelected",true,true);
		if(selectedBoxes[i] == 'Su')
			checkbox[0].distribute("setSelected",true,true);
	}
	exports.addAMPM();
	pm = (schedule.t_of_day == "PM");
    existingValue = true;
}

var cancelButton = BUTTONS.Button.template(function($){ return{
	height:50, skin: cancelLogoSkin,
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			currentScreen = "schedule";
			exports.resetCreateScreen();
			main.run( new TRANSITIONS.Push(), main.last, ScheduleScreen, {direction: "down", duration : 400 });
		}}
	})
}});

var saveButton = BUTTONS.Button.template(function($){ return{
	height:50, skin: saveLogoSkin,
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			var newSchedule = {name: nameField.scroller.textbox.string, 
							temperature: tempField.scroller.textbox.string, 
							repeat: repeatSwitchValue, 
							repeatedDays: selectedBoxes, 
							hours: hourField.scroller.textbox.string,
							minutes: minuteField.scroller.textbox.string,
							t_of_day: time_of_day,
							existing: existingValue,
							container: null};
			if(checkValidSchedule(newSchedule)) {
				validMessage.visible = false;
				if(newSchedule.existing) {
					SCHEDULE_SCREEN.removeSchedule(oldSchedule.container);
				}
				var schedule = [newSchedule];
				var container = SCHEDULE_SCREEN.generateDisplayContainer(schedule);
				container.forEach(SCHEDULE_SCREEN.ListBuilder);
				exports.resetCreateScreen();
				currentScreen = "schedule";
				main.run( new TRANSITIONS.Push(), main.last, ScheduleScreen, {direction: "down", duration : 400 });
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
   			 	left:4, right:4, top:4, bottom:4, style:fieldHintStyle2, string:"Add a Title Here...", name:"hint"
         })
      ]
    })
  ]
}});


var MyTempField = Container.template(function($) { return { 
  left: 26, width: 70, height: 36, skin: nameInputSkin, contents: [
    Scroller($, { 
      name: "scroller", left: 4, right: 4, top: 4, bottom: 4, active: true, 
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
   			 	left:4, right:4, top:4, bottom:4, style:fieldHintStyle2, string:"0-100", name:"hint"
         })
      ]
    })
  ]
}});

var MyTimeField = Container.template(function($) { return { 
  width: 55, height: 36, skin: nameInputSkin, contents: [
    Scroller($, { 
      left: 4, right: 4, top: 4, bottom: 4, active: true, name: "scroller",
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
   			 	left:4, right:4, top:4, bottom:4, style:fieldHintStyle2, string:"Input here...", name:"hint"
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
        	trace(checkBox.buttonLabel.string+" selected\n");
            selectedBoxes.push(checkBox.buttonLabel.string);
        }},
        onUnselected: { value:  function(checkBox){
            trace(checkBox.buttonLabel.string+" unselected\n");
            selectedBoxes.pop(checkBox.buttonLabel.string);
        }},
        setSelected: { value: function(checkBox, selected) {
			checkBox.variant = selected;
		}}
    })
}});

var time_of_day = "AM";

var myRadioGroup = BUTTONS.RadioGroup.template(function($){ return{
	top:10, bottom:0, left:0, right:0, name: "timeButtons",
	behavior: Object.create(BUTTONS.RadioGroupBehavior.prototype, {
		onRadioButtonSelected: { value: function(buttonName){
			time_of_day = buttonName;
			this.selectedName = buttonName;
	}}})
}});

var am_pm = new myRadioGroup({buttonNames:"AM,PM"})

var checkbox = [];
checkbox[0] = new MyCheckBoxTemplate({name:"Su"});
checkbox[1] = new MyCheckBoxTemplate({name:"M"});
checkbox[2] = new MyCheckBoxTemplate({name:"Tu"});
checkbox[3] = new MyCheckBoxTemplate({name:"W"});
checkbox[4] = new MyCheckBoxTemplate({name:"Th"});
checkbox[5] = new MyCheckBoxTemplate({name:"F"});
checkbox[6] = new MyCheckBoxTemplate({name:"Sa"});

var MySwitchTemplate = SWITCHES.SwitchButton.template(function($){ return{
  height:30,
  behavior: Object.create(SWITCHES.SwitchButtonBehavior.prototype, {
    onValueChanged: { value: function(container){
      KEYBOARD.hide();
      repeatSwitchValue = 1-repeatSwitchValue;
      SWITCHES.SwitchButtonBehavior.prototype.onValueChanged.call(this, container);
      for(i = 0; i<7; i++){
      	checkbox[i].visible = !checkbox[i].visible;
      }
      daysLabel.visible = !daysLabel.visible;
  }}})
}});


var TextContainerTemplate = Container.template(function($) { return {
  skin: whiteS, active: true,
  behavior: Object.create(Container.prototype, {
    onTouchEnded: { value: function(content){
      KEYBOARD.hide();
      content.focus();
    }}
  })
}});

var repeatSwitch = new MySwitchTemplate({right:100, value:0 });
var repeatSwitchValue = 0;
var tempField = new MyTempField({ name: "",});
var nameField = new MyField({name: "",});
var hourField = new MyTimeField({name: "",});
hourField.scroller.hint.string = "Hr.";
var minuteField = new MyTimeField({name: "",});
minuteField.scroller.hint.string = "Min.";
var validMessage = new Label( {style: errorStyle, string: "Error!", visible: false})
var daysLabel = new Label( {left: 0, right: 0, style: labelStyle,  string: "Select Days: ", visible: false});
var existingValue = false;
var title = new Label( {bottom: 10, style: bottleStyle, string: "Create a New Schedule", });

exports.CreateScheduleScreen = Container.template(function($) { return { left: 0, right: 0, top: 0, bottom: 0,  active: true, contents: [ 
	new Column( {name:"column", left: 0, right: 0, top:0, contents: [
		new Content({width: 320, height:50, skin:logoSkin}),
		validMessage,
		title,
		new Line( { left:0, right:20, bottom: 5, contents: [
			Label($, {left: 20, right: 0, style: labelStyle, string: "Title: "}),
			nameField
		]}),
		new Line( { left:0, right:20, contents: [
			Label($, {left: 20, style: labelStyle, string: "Temperature: "}),
			tempField,
			Label($, {left: 10, right: 0, width: 20, style: labelStyle, string: temperature_unit}),
		]}),
		new Line({name:"timeFields", left:20, right: 20, height:80, 
			contents:[
			    Label($, {right: 35, style: labelStyle, string: "Time: "}),
			    hourField,
			    Label($, {style: labelStyle, string: ":"}),
			    minuteField,
			    Label($, {width: 15, style: labelStyle, string: ""}),
			]
		}),
		new Line( { left:20, right:100, contents: [
			Label($, {left: 0, right: 0, style: labelStyle, string: "Repeat?: "}),
			repeatSwitch
		]}),
		new Column( { left:20, right:0, contents: [
			new Column({left:0, right: 0, contents:[
			    daysLabel,
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
	], behavior: Object.create(Container.prototype, {
        onDisplayed: { value: function(content){
        	if(pm) {
            	am_pm.first.next.distribute("setSelected", true, true);
           		am_pm.first.distribute("setSelected", false, true);
           	}
        }}
    })})
],
behavior: Object.create(Container.prototype, {
    onTouchEnded: { value: function(content){
      KEYBOARD.hide();
      content.focus();
    }},
    onDisplaying: {value: function(content){
    	if(SCHEDULE_SCREEN.shouldIrepopulate) {
    		exports.populateFields(SCHEDULE_SCREEN.incomingSchedule);
    		SCHEDULE_SCREEN.shouldIrepopulate = false;
    	}
    }}
  })
}});