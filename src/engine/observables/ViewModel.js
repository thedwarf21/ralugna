import { ObservableObject } from "./ObservableObject.js";
import { ObservableArray } from "./ObservableArray.js";
/** @import {ObservableDataType} from "./ObservableValue.js"; */
/** @import {ObservableObjectNotification} from "./ObservableObject.js"; */
/** @import {ObservableArrayNotification} from "./ObservableArray.js"; */

/**
 * This class provides and deals with keeping a recursive observabilty of an data structure.
 * 
 * It uses `ObervableObject` and `ObservableArray` to ensure that all the sub-references are Binding-friendly. 
 */
export class ViewModel {
    /**
     * @private
     * @type {ObservableDataType}
     */
    #root;

    /**
     * @param {ObservableDataType} source 
     */
    constructor(source) {
        this.#root = this.#convertToObservable(source);
    }

    #convertToObservable(value) {
        if (ObservableObject.isPlainObject(value)) {
            return this.#toObservableObject(value);
        } else if (Array.isArray(value)) {
            return this.#toObservableArray(value);
        } else return value;
    }

    /**
     * @private
     * @param {Object} obj 
     * @returns {ObservableObject}
     */
    #toObservableObject(obj) {
        const result = new ObservableObject({});
        for (const key in obj) {
            const value = this.#convertToObservable(obj[key]);
            result[key] = value;
        }
        result.observe(this, (details) => this.#objectMutated(details));
        return result;
    }

    /**
     * @private
     * @param {Array} array
     * @returns {ObservableArray} 
     */
    #toObservableArray(array) {
        const result = new ObservableArray([]);
        for (const elt of array) {
            const value = this.#convertToObservable(elt);
            result.push(value);
        }
        result.observe(this, (details) => this.#arrayMutated(details));
        return result;
    }

    /**
     * @private
     * @param {ObservableObjectNotification} details 
     */
    #objectMutated(details) {
        const { sender, type, value, key } = details;
        if (type !== ObservableObject.EVENT_TYPE.delete) {
            sender[key] = this.#convertToObservable(value);
        }
    }

    /**
     * @private
     * @param {ObservableArrayNotification} details 
     */
    #arrayMutated(details) {
        const { sender, index, length } = details;
        if (!index || !length) {
            return;
        }
        for (const i = index; i < index + length; i++) {
            const currentValue = sender.getValue()[i];
            sender[i] = this.#convertToObservable(currentValue);
        }
    }
}