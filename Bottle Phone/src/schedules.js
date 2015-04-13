// BUTTONS

//create new schedule screen on touch the plus button

// plus button to go to create schedule screen

var plusButton = BUTTONS.Button.template(function($){ return{
	left: 285, right: 15, top: 20, height:20,
	contents: [
		new Label({left:0, right:0, height:40, string:"+", style: buttonStyle1})
	],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			toScreen = "Menu"; // change to new schedule screen 
			content.bubble("onTriggerTransition");
		}}
	})
}});

// plus button to go to create schedule screen

/* NOT IMPLEMENTED YET
var deleteButton = BUTTONS.Button.template(function($){ return{
	left: 285, right: 15, top: 20, height:20,
	contents: [
		new Label({left:0, right:0, height:40, string:"+", style: buttonStyle1})
	],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			toScreen = "Menu"; // change to new schedule screen 
			content.bubble("onTriggerTransition");
		}}
	})
}});
*/

// populate the screen with existed schedules
//start

// SCREENS

exports.ScheduleScreen = Container.template(function($) { return { left: 0, right: 0, top: 0, bottom: 0, skin: blueSkin, contents: [
	Label($, { left: 0, right: 0, style: labelStyle, string: '', }),
	new menuButton(),
	new plusButton(),
	screen	
],
 }});

/* STATIC */
/* A simple array of objects. Each will be used as a single
 * entry in our scrollable list. */
 
 
//Change this Daniel

exports.newSchedule = [{name: "Morning Tea", 
	temperature: "100 C", 
	repeat: "1", 
	repeatedDays:"Mon, Tu", 
	time: "10:45"}];

function generateDisplayString(newSchedule) {
	result = [];
	for (var i = 0; i < newSchedule.length; i++) {
		temp = i+1+"."+newSchedule[i].name + " scheduled at " + newSchedule[i].time + " on " + newSchedule[i].repeatedDays;
		dict = {};
		dict["title"] = temp;
		result.push(dict);
	}
	return result;
}    



/* This is a template that will be used to for each entry populating the list. 
 * Note that it is anticipating an object each time in is instanciated */
var ProcessorLine = Line.template(function($) { return { left: 0, right: 0, active: true, skin: THEME.lineSkin, 
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
     			           Label($, { left: 0, right: 0, style: productDescriptionStyle, skin: whiteSkin, active: true, string: $.title,     			            
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
function ListBuilder(element, index, array) {
	screen.first.menu.add(new ProcessorLine(element));
}