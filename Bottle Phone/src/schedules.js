// BUTTONS

//create new schedule screen on touch the plus button

// plus button to go to create schedule screen

var plusButton = BUTTONS.Button.template(function($){ return{
	left: 250, right: 1, top: 1, height: 50, width: 50,skin: navyblueskin,
	contents: [
		new Label({left:0, right:0, height:40, string:"+", style: buttonStyle})
	],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			currentScreen = "create";
			menu.visible = false;
			main.run( new TRANSITIONS.Push(), main.last, CreateScheduleScreen, {direction: "up", duration : 400 });
		}}
	})
}});

var editButton = BUTTONS.Button.template(function($){ return{
	right: 1, top: 1, height: 50, width: 50,skin: navyblueskin,
	contents: [
		new Label({left:0, right:0, height:40, string:"Edit", style: buttonStyle})
	],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			currentScreen = "create";
			menu.visible = false;
			main.run( new TRANSITIONS.Push(), main.last, CreateScheduleScreen, {direction: "up", duration : 400 });
	//		populateFields();
		}}
	})
}});

// SCREENS
no_schedule = new Label({ string:"No schedules created yet!", style:errorStyle,});
exports.ScheduleScreen = Container.template(function($) { return { left: 0, right: 0, top: 0, bottom: 0, skin: babyblueskin, contents: [
	new Column({left:0, right:0, top:0, height:80, skin: babyblueskin, vertical: 'middle', 
		contents:[
			new Content({width: 320, height:50, skin:logoSkin}),
			new Label({ left: 0, right: 0, top:15, style: bottleStyle, vertical: 'middle',  string: 'Schedules', skin: babyblueskin}),
			no_schedule,
		]
	}),
	new plusButton(),
	screen	
]}});

function generateRepeatedDaysDict(days) {
	dict = {};
	dict["Su"] = false
	dict["M"] = false;
	dict["Tu"] = false;
	dict["W"] = false;
	dict["Th"] = false;
	dict["f"] = false;
	dict["Sa"] = false;
	for(i = 0; i<days.length; i++) {
		dict[days[i]] = true;
	}
	return dict;
}

var schedule_empty = true;

exports.generateDisplayString = function generateDisplayString(scheds) {
	result = [];
	for (var i = 0; i < scheds.length; i++) {
		title = new Label({left:1, string: scheds[i].name, style:labelStyle});
		timeString = scheds[i].hours + ":" + scheds[i].minutes;
		time = new Label({left:1, string: timeString, style:labelStyle});
		repeat = new Label({left:1, string: "Today, Repeat Off", style: labelStyle});
		if(scheds[i].repeat == 1) {
			days = generateRepeatedDaysDict(scheds[i].repeatedDays);
			repeatString = "Repeats on ";
			if(days["Su"]) 
				repeatString+="Su, ";
			if(days["M"])
				repeatString+="M, ";
			if(days["Tu"])
				repeatString+="Tu, ";
			if(days["W"])
				repeatString+="W, ";
			if(days["Th"])
				repeatString+="Th, ";
			if(days["f"])
				repeatString+="F, ";
			if(days["Sa"])
				repeatString+="Sa, ";
			repeat.string = repeatString;
		}
		temperature = new Label({left:1, string: scheds[i].temperature + "\xB0 F", style: labelStyle});
		scheduleContainer = new Container({left:0, right:0, skin:babyblueskin, contents:[
								new Line({left:0, right:0, contents:[
									new Column({left:0, right:0, width: 150, contents:[title, time, repeat, temperature]}),
									new editButton()
								]})
							]});
		result.push(scheduleContainer);
		schedule_empty = false;
	}
	if (result.length > 0) {
	    no_schedule.string = "";
	}
	return result;
}    


/* This is template for a container which takes up the
 * whole screen.  It contains only a single object,
 * the SCROLLER.VerticalScroller.  Although we are not
 * referencing any values from an object passed on creation,
 * an object is still required as the SCROLLER uses it internally. */
var ScreenContainer = Container.template(function($) { return {
	left:0, right:0, top:100, bottom:100,
	contents: [
   		/* Note that the scroller is declared as having only an empty
   		 * Column and a scrollbar.  All the entries will be added 
   		 * programmatically. */ 
   		SCROLLER.VerticalScroller($, { 
   			contents: [
  				Column($, { left: 0, right: 0, top: 0, name: 'menu', }),
      			SCROLLER.VerticalScrollbar($, { }),
  			]
   		})
   	]
}});

var data = new Object();
var screen = new ScreenContainer(data);

/* This simple function exists so we can call "forEach" on
 * our array of list entries (menuItems).  It adds a new 
 * ProcessorLine() object to the Column named "menu" in the
 * screen object's SCROLLER */
exports.ListBuilder = function ListBuilder(element, index, array) {
	screen.first.menu.add(element);
}