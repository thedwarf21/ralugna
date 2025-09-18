export class Control {
    /**
     * @typedef ControlConfig
     * @property {string} code - unique control identifier
     * @property {string} name - control label
     * @property {function} fnPushedAction - pushed button callback
     * @property {function} fnUnpushedAction  - button up callback
     * @property {boolean} isAuto - if false, the relying button must have been released for the `fnPushedAction` to trigger again
     */
    /**
     * @type {string}
     */
    code;

    /**
     * @type {string}
     */
    name;

    /**
     * @type {function}
     */
    pushedAction;

    /**
     * @type {function}
     */
    unpushedAction;

    /**
     * @type {boolean}
     */
    isAuto;

    /**
     * @type {boolean}
     */
    actionAlreadyDone;

    /**
     * @type {number}
     */
    buttonIndex;

    /**
     * @param {ControlConfig} config
     */
	constructor(config) {
		this.code = config.code;
		this.name = config.name;
		this.pushedAction = config.fnPushedAction;
		this.unpushedAction = config.fnUnpushedAction;
		this.isAuto = config.isAuto;
		this.actionAlreadyDone = false;
		this.buttonIndex = undefined;
	}

    /**
     * @param {Gamepad} gamepad 
     */
	applyContext(gamepad) {
		if (this.#isButtonPressed(gamepad)) {
			if (this.#isExecutionPossible()) {
				this.#execute(true);
				this.actionAlreadyDone = true;
			}
		} else {
			this.#execute(false);
			this.actionAlreadyDone = false;
		}

	}

    /**
     * @param {boolean} button_state 
     * @returns {any}
     */
	#execute(button_state) {
		if (button_state)
			return this.pushedAction();
		
		if (this.unpushedAction) 
			return this.unpushedAction();
	}

    /**
     * @param {Gamepad} gamepad 
     * @returns {boolean}
     */
	#isButtonPressed(gamepad) {
		return this.buttonIndex !== undefined && gamepad.buttons[this.buttonIndex].pressed;
	}

    /**
     * @returns {boolean}
     */
	#isExecutionPossible() {
		return !this.actionAlreadyDone || this.isAuto;
	}
}