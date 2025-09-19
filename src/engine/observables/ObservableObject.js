import { ObservableValue } from "./ObservableValue";
/** @import { ObservableNotification } from "./ObservableValue"; */

export class ObservableObject extends ObservableValue {
    /**
     * @typedef ObservableObjectNotification
     * @extends ObservableNotification
     * @property {string} type
     * @property {string} [key]
     * @property {any} [value]
     */
    /**
     * @readonly
     * @type {Record<string, string>}
     */
    static EVENT_TYPE = {
        set: "set",
        delete: "delete",
        reset: "reset"
    };

    /**
     * @private
     * @type {Object}
     */
    #target = {};

    /**
     * @param {Object} initial 
     */
    constructor(initial) {
        super();
        if (!initial || typeof initial !== "object" || Array.isArray(initial)) {
            throw new TypeError("ObservableObject expects a plain object as initial value.");
        }
        this.#target = { ...initial };
    }

    get value() {
        return { ...this.#target };
    }

    /**
     * @param {Object} newObject
     */
    set value(newObject) {
        this.#target = { ...newObject };
        /** @type {ObservableObjectNotification} */
        const details = { type: ObservableObject.EVENT_TYPE.reset };
        this._notify(details);
    }

    /**
     * @param {string} key 
     * @param {any} value 
     */
    set(key, value) {
        this.#target[key] = value;
        /** @type {ObservableObjectNotification} */
        const details = { type: ObservableObject.EVENT_TYPE.set, key, value };
        this._notify(details);
    }

    /**
     * @param {string} key 
     */
    delete(key) {
        const existed = key in this.#target;
        if (existed) {
            delete this.#target[key];
            /** @type {ObservableObjectNotification} */
            const details = { type: ObservableObject.EVENT_TYPE.delete, key };
            this._notify(details);
        }
    }
}