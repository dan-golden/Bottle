var THEME = require('themes/flat/theme');
var BUTTONS = require('controls/buttons');

var whiteS = new Skin({fill:"white"});

var myRadioGroup = BUTTONS.RadioGroup.template(function($){ return{
    top:50, bottom:50, left:50, right:50,
    behavior: Object.create(BUTTONS.RadioGroupBehavior.prototype, {
        onRadioButtonSelected: { value: function(buttonName){
            this.selectedName = buttonName;
    }}})
}});

var radioGroup = new myRadioGroup({ buttonNames: "Lorem,Ipsum,Dolor,Sit,Amet" });
var MainCon = Container.template(function($) { return {
    left: 0, right: 0, top: 0, bottom: 0, skin: whiteS, active: true,
    behavior: Object.create(Container.prototype, {
        onTouchEnded: { value: function(content){
            radioGroup.first.next.distribute("setSelected", true, true);
            trace(radioGroup.first+"\n");
        }}
    })
}});


var main = new MainCon;
application.add(main);
main.add(radioGroup);