
var PinsSimulators = require('PinsSimulators');
var configure = exports.configure = function(configuration) {
	this.pinsSimulator = shell.delegate("addSimulatorPart", {
			header : { 
				label : "Bot-tle", 
				name : "Change Inputs Manually", 
				iconVariant : PinsSimulators.SENSOR_MODULE 
			},
			axes : [
				new PinsSimulators.AnalogInputAxisDescription(
					{
						dataType : "boolean", 
						valueLabel : "Bottle Status",
						valueID : "bottleStatus",
						speed : 0,
						value: 1,
						defaultControl : PinsSimulators.BUTTON
					}
				),
				
				new PinsSimulators.AnalogInputAxisDescription(
					{
						valueLabel : "Current Temperature",
						valueID : "slider",
						minValue: 0,
						maxValue: 100,
						defaultControl : PinsSimulators.SLIDER,
						speed : 0,
						value: 25
					}
				),
				new PinsSimulators.AnalogInputAxisDescription(
					{
						valueLabel : "Water Level",
						valueID : "waterLevel",
						minValue: 0,
						maxValue: 100,
						defaultControl : PinsSimulators.SLIDER,
						speed : 0,
						value: 100
					}
				),
				new PinsSimulators.AnalogInputAxisDescription(
					{
						valueLabel : "Water Consumed",
						valueID : "consumption",
						minValue: 0,
						maxValue: 150,
						defaultControl : PinsSimulators.SLIDER,
						speed : 0,
						value: 0
					}
				),
				
			]
		});
}
var close = exports.close = function() {
	shell.delegate("removeSimulatorPart", this.pinsSimulator);
}

/*var read = exports.read = function() {
	return this.pinsSimulator.delegate("getValue");
}*/

var read = exports.read = function() {
	var axes = this.pinsSimulator.delegate("getValue");
		return axes;
}
exports.pins = {
			bottleStatus: { type: "A2D" }, 
			waterLevel: { type: "A2D" }, 
			slider: { type: "A2D" }, 
			consumption: { type: "A2D" }, 
		};