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

// SCREENS
no_schedule = new Label({ string:"No schedules created yet!", style:errorStyle,});
exports.ScheduleScreen = Container.template(function($) { return { left: 0, right: 0, top: 0, bottom: 0, skin: babyblueskin, contents: [
	new Column({left:0, right:0, top:0, height:80, skin: babyblueskin, vertical: 'middle', 
		contents:[
			new Label({right: 90, top: 20, string:"Bot-tle", style:bottleStyle,}),
			new Label({ left: 0, right: 0, top:15, style: bottleStyle, vertical: 'middle',  string: 'Schedules', skin: babyblueskin}),
			no_schedule,
		]
	}),
	new plusButton(),
	screen	
]}});

/* STATIC */
/* A simple array of objects. Each will be used as a single
 * entry in our scrollable list. */
 
 
//Change this Daniel

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
        if (scheds[i].name) {
		    temp = scheds[i].name + " | " + scheds[i].hours + ":";
		} else {
		    temp = "Schedule " + i.toString() + " | " + scheds[i].hours + ":";
		}
		if(scheds[i].minutes < 10)
			temp+="0";
		temp+=scheds[i].minutes;
		temp += scheds[i].t_of_day + " ";
		if(scheds[i].repeat == 1) {
			temp+= " on ";
			days = generateRepeatedDaysDict(scheds[i].repeatedDays);
			if(days["Su"]) 
				temp+="Su, ";
			if(days["M"])
				temp+="M, ";
			if(days["Tu"])
				temp+="Tu, ";
			if(days["W"])
				temp+="W, ";
			if(days["Th"])
				temp+="Th, ";
			if(days["f"])
				temp+="F, ";
			if(days["Sa"])
				temp+="Sa, ";
		}
		temp += "for " + scheds[i].temperature + "\xB0 F";
		dict = {};
		dict["title"] = temp;
		result.push(dict);
		schedule_empty = false;
	}
	if (result.length > 0) {
	    no_schedule.string = "";
	}
	return result;
}    

/* This is a template that will be used to for each entry populating the list. 
 * Note that it is anticipating an object each time in is instanciated */
var ProcessorLine = Line.template(function($) { return { left: 0, right: 0, active: true, 
	contents: [
     	Column($, { left: 0, right: 0, contents: [
     		Container($, { left: 4, right: 4, height: 32, 
     			contents: [
     			           /* This label expects that the object passed to ProcessorLine() 
     			            * includes a value for title.  Note that this Label is not marked
     			            * as active. Touches registered here will bubble back up to the
     			            * nested objects until it hits one which is active. */
     			           /* This label is expecting a value for button.  Note that this Label
     			            * is marked active.  Touches registered here will be handeled here */
     			           Label($, { left: 0, right: 0, style: labelStyle, skin: babyblueskin, active: true, string: $.title,     			            
     			           }), 
 			           ], 
	           }),
     		Line($, { left: 0, right: 0, height: 1, skin: separatorSkin, }),
     	], }),
     ], 
 }});

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
	screen.first.menu.add(new ProcessorLine(element));
}