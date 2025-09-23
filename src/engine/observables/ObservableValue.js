import { AbstractClassError } from "../errors/AbstractClassError.js";
import { AbstractMethodError } from "../errors/AbstractMethodError.js";

/**
 * @abstract
 * 
 * This class and its subclasses are usable in a non-recursive obervation context.
 * 
 * For a recursive usage, use `ViewModel`.
 * 
 * Inherited by : `ObervableArray`, `ObservableObject`
 */
export class ObservableValue {
    /**
     * @typedef ObservableDataType = Array | Object
     */
    /**
     * @typedef ObserverConfig
     * @property {Object} observer
     * @property {function} callback
     */
    /**
     * @typedef ObservableNotification
     * @property {ObservableValue} [sender]
     * @property {ObservableDataType} [current]
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
    getValue() {
        throw new AbstractMethodError("getValue");
    }

    /**
     * @abstract
     * @param {ObservableDataType} newValue
     */
    setValue(newValue) {
        throw new AbstractMethodError("setValue");
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
        details.current = this.getValue();
        details.sender = this;
        for (const { callback } of this.#observers) {
            callback(details);
        }
    }
}
