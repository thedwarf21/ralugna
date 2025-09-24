import { AbstractClassError } from "../errors/AbstractClassError";

/**
 * The behaviors' integration implies a `get` and `set` definition on the consumer objet for each behavior's property
 * => a Behavior class should never declare a getter/setter using this form : `get property() {}`, because it would be overriden during the integration
 * 
 * @abstract
 */
export class Behavior {
    constructor() {
        if (this.constructor.name === "Behavior") {
            throw new AbstractClassError("Behavior");
        }
    }

    /**
     * Life cycle methods which implementation is not mandatory
     * 
     * @abstract
     */
    onAttach() {}           // called during the behavior's integration to an object
    destroy() {}            // called by the `BehaviorIntegrator`'s `destroyAll` method
}