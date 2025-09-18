import { Joystick } from "./Joystick.js";
import { Control } from "./Control.js";
/** import {ControlConfig} from "./Control.js"; */

export class GamepadAdapter {

    /**
     * @protected
     * @type {number[]}
     */
    calibration;

	/**
	 * @protected
	 * @type {Control[]}
	 */
	controls;

	constructor() { 
		this.controls = [];
		this.calibration = [0, 0, 0, 0];
	}

	calibrate() {
		const gamepad = GamepadController.getConnectedGamepad();
		this.calibration = [gamepad.axes[0],
							gamepad.axes[1],
							gamepad.axes[2],
							gamepad.axes[3]];
	}

	/**
	 * @param {ControlConfig} config
	 */
	addControlEntry(config) {
		this.controls.push(new Control(config));
	}

	/**
	 * @param {number} controlIndex 
	 * @param {number} buttonIndex 
	 */
	setControlMapping(controlIndex, buttonIndex) {
		this.controls[controlIndex].actionAlreadyDone = true; // Prevents the control exectution when setting through a button press
		this.controls[controlIndex].buttonIndex = buttonIndex;
	}

	/**
	 * @param {string} code
	 */
	applyControl(code) {
		const gamepad = GamepadController.getConnectedGamepad();
		for (const control of this.controls)
			if (control.code === code)
				control.applyContext(gamepad);
	}

	updateJoysticksStates() {
		const gamepad = GamepadController.getConnectedGamepad();
		this.leftJoystick = new Joystick(this.axes[0], this.axes[1]);
		this.rightJoystick = new Joystick(this.axes[2], this.axes[3]);
		if (gamepad.axes.length > 4)
			this.accelerometer = new Joystick(gamepad.axes[4], gamepad.axes[5]);
	}

    /**
     * @returns {Gamepad}
     */
	static getConnectedGamepad() {
		const gamepads = navigator.getGamepads();
		for (const gamepad of gamepads)
			if (gamepad !== null)
				return gamepad;
	}

	/**
	 * @private
	 * @returns {number[]}
	 */
	get axes() {
		const gamepad = GamepadController.getConnectedGamepad();
		return [gamepad.axes[0] - this.calibration[0],
				gamepad.axes[1] - this.calibration[1],
				gamepad.axes[2] - this.calibration[2],
				gamepad.axes[3] - this.calibration[3]]
	}
}
