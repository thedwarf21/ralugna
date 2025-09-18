export class Joystick {
    /**
     * @param {number} x_rate 
     * @param {number} y_rate 
     */
	constructor(x_rate, y_rate) {
		this.x = x_rate;
		this.y = y_rate;
		this.#computeAngleAndIntensity();
	}

	#computeAngleAndIntensity() {
		this.angle = Math.atan2(this.y, this.x);
		this.intensity 	= Math.abs(this.x) > Math.abs(this.y) 
						? Math.abs(this.x) 
						: Math.abs(this.y);
	}
}