import { AbstractClassError } from "../errors/AbstractClassError.js";
import { AbstractMethodError } from "../errors/AbstractMethodError.js";

/**
 * @abstract
 */
export class ObservableValue {
    /**
     * @typedef ObserverConfig
     * @property {Object} observer
     * @property {function} callback
     */
    /**
     * @typedef ObservableNotification
     * @property @property {Array | Object} [current]
     */

    /**
     * @private
     * @type {ObserverConfig[]}
     */
    #observers;

    constructor() {
         if (this.constructor.name === "ObservableValue") {
            throw new AbstractClassError("ObservableValue");
        }
    }

    /**
     * @abstract
     */
    get value() {
        throw new AbstractMethodError("get value");
    }

    /**
     * @abstract
     */
    set value(val) {
        throw new AbstractMethodError("set value");
    }

    /**
     * @param {Object} observer
     * @param {function} callback
     */
    observe(observer, callback) {
        if (typeof callback !== "function") {
            throw new TypeError("Expected callback to be a function");
        }
        if (!this._hasObserver(observer)) {
            this.#observers.push({ observer, callback });
        }
    }

    disconnect(observer) {
        this.#observers = this.#observers.filter(o => o.observer !== observer);
    }

    disconnectAll() {
        this.#observers = [];
    }

    /**
     * @protected
     * @param {Object} observer 
     * @returns {boolean}
     */
    _hasObserver(observer) {
        return this.#observers.some(o => o.observer === observer);
    }

    /**
     * @protected
     * @type {ObservableNotification} details
     */
    _notify(details) {
        details.current = this.value;
        for (const { callback } of this.#observers) {
            callback(details);
        }
    }
}
