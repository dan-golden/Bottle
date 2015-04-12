// KPR Script file


var mainCol = new Column({
	left:0, right:0, top:0, bottom:0,
	skin: whiteS,
	contents:[
		new Line({left:0, right:0, top:0, height:80, skin: whiteS,
				contents:[
					new Label({left:-18, right:0, string:"Bot-tle", style:titleStyle,}),
				]
			}),
		new Line({left:0, right:0, top:0, bottom:0, skin: blueSkinLabel,
				contents:[
					new Label({left:10, right:20, string:"Current Temperature:", style:textStyle, skin: blueSkin}),
					current_temperature_label,
				]
			}),
		
	],
	
});