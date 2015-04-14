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
			toScreen = "CreateSchedule"; // change to new schedule screen 
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
	new Column({left:0, right:0, top:0, height:80, skin: whiteS,
		contents:[
			new Label({right: 90, top: 20, string:"Bot-tle", style:titleStyle,}),
		]
	}),
	new menuButton(),
	new plusButton(),
	screen	
]}});

/* STATIC */
/* A simple array of objects. Each will be used as a single
 * entry in our scrollable list. */
 
 
//Change this Daniel

exports.generateDisplayString = function generateDisplayString(scheds) {
	result = [];
	for (var i = 0; i < scheds.length; i++) {
		temp = scheds[i].name + " scheduled at " + scheds[i].hours + ":" + scheds[i].minutes;
		if(scheds[i].repeat == 1) {
			temp+= " on ";
			for(var j = 0; j < scheds[i].repeatedDays.length; j++) {
				temp+= scheds[i].repeatedDays[j] + ", ";
			}
		}
		temp += " for " + scheds[i].temperature + "\xB0 F";
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
exports.ListBuilder = function ListBuilder(element, index, array) {
	screen.first.menu.add(new ProcessorLine(element));
}