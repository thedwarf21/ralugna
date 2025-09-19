import { AbstractClassError } from "../errors/AbstractClassError";

/**
 * @abstract
 */
export class Behavior {
    constructor() {
        if (this.constructor.name === "Behavior") {
            throw new AbstractClassError("Behavior");
        }
    }

    destroy() {}
}