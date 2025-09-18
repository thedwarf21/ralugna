/**
 * @abstract
 */
export class Behavior {
    constructor() {
        if (this.constructor.name === "Behavior") {
            throw new Error("`Behavior` is abstract and cannot be instanciated directly");
        }
    }

    destroy() {}
}