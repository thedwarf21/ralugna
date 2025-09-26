import { ObservableValue } from "./ObservableValue.js";
/** @import { ObservableNotification } from "./ObservableValue.js"; */

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
        init: "init"
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
        this.setValue({ ...initial });
        return this.#initProxy();
    }

    getValue() {
        return { ...this.#target };
    }

    /**
     * @param {Object} newObject
     */
    setValue(newObject) {
        if (!ObservableObject.isPlainObject(newObject)) {
            throw new TypeError("ObservableObject expects a plain object as value.");
        }
        for (const key in newObject) {
            this.#defineReactiveProperty(key, newObject[key]);
        }
        /** @type {ObservableObjectNotification} */
        const details = { type: ObservableObject.EVENT_TYPE.init };
        this._notify(details);
    }

    /**
     * @param {any} value
     * @returns {boolean}
     */
    static isPlainObject(value) {
        return Object.prototype.toString.call(value) === "[object Object]"
    }

    /**
     * @private
     * @returns {Proxy}
     */
    #initProxy() {
        return new Proxy(this, {
            set: (obj, key, value) => {
                if (!(key in obj)) {
                    obj.#defineReactiveProperty(key, value);
                }
                return true;
            },
            deleteProperty: (obj, key) => obj.#deleteProperty(key)
        });
    }

    /**
     * @private
     * @param {string} key 
     * @param {any} initialValue 
     */
    #defineReactiveProperty(key, initialValue) {
        this.#target[key] = initialValue;
        Object.defineProperty(this, key, {
            configurable: true,
            enumerable: true,
            get: () => this.#target[key],
            set: (value) => this.#setProperty(key, value)
        });
    }

    /**
     * @private
     * @param {string} key 
     * @param {any} value 
     */
    #setProperty(key, value) {
        this.#target[key] = value;
        /** @type {ObservableObjectNotification} */
        const details = { type: ObservableObject.EVENT_TYPE.set, key, value };
        this._notify(details);
    }

    /**
     * @private
     * @param {string} key 
     */
    #deleteProperty(key) {
        if (key in this.#target) {
            delete this[key];
            delete this.#target[key];
            /** @type {ObservableObjectNotification} */
            const details = { type: ObservableObject.EVENT_TYPE.delete, key };
            this._notify(details);
        }
    }
}