import { ObservableValue } from "./ObservableValue";
/** @import { ObservableNotification } from "./ObservableValue"; */

/**
 * ObservableArray wraps a native array and allows observers to be notified whenever it is mutated.
 * 
 * Each observer registers a callback function, which will be called with mutation details.
 * 
 * Only mutating methods (`push`, `pop`, `splice`, etc.) are instrumented to trigger notifications.
 * 
 * For non-mutating methods such as `map`, `filter`, `some`, `forEach`, etc., use the `.value` getter:
 * 
 * Example:
 * ```js
 * observableArray.value = observableArray.value.filter(callback);
 * ```
 */
export class ObservableArray extends ObservableValue {
    /**
     * @typedef ObservableArrayNotification
     * @extends ObservableNotification
     * @property {string} type
     * @property {any} result
     */
    /**
     * @readonly
     * @type {Record<string, string>}
     */
    static EVENT_TYPE = {
        set: "set",
        push: "push",
        pop: "pop",
        shift: "shift",
        unshift: "unshift",
        reverse: "reverse",
        sort: "sort",
        splice: "splice",
        clear: "clear"
    }

    /**
     * @private
     * @type {Array}
     */
    #target;

    /**
     * @param {Array} toObserve 
     */
    constructor(toObserve) {
        super();
        if (!Array.isArray(toObserve)) {
            throw new TypeError("ObservableArray expects an Array as initial value.");
        }
        this.#target = toObserve;
    }

    getValue() {
        return [...this.#target];
    }

    /**
     * @param {Array} array
     */
    setValue(array) {
        this.#target = array;
        /** @type {ObservableArrayNotification} */
        const details = { type: ObservableArray.EVENT_TYPE.set, result: array };
        this._notify(details);
    }

    /**
     * @param {number} idx 
     * @param {number} length 
     * @param {Array} [itemsToInsert] 
     */
    splice(idx, length, ...itemsToInsert) {
        const result = this.#target.splice(idx, length, ...itemsToInsert);
        /** @type {ObservableArrayNotification} */
        const details = { type: ObservableArray.EVENT_TYPE.splice, result };
        this._notify(details);
    }

    /**
     * @param {any} item 
     */
    push(item) {
        const result = this.#target.push(item);
        /** @type {ObservableArrayNotification} */
        const details = { type: ObservableArray.EVENT_TYPE.push, result };
        this._notify(details);
    }

    /**
     * @param {any} item 
     */
    unshift(item) {
        const result = this.#target.unshift(item);
        /** @type {ObservableArrayNotification} */
        const details = { type: ObservableArray.EVENT_TYPE.unshift, result };
        this._notify(details);
    }

    pop() {
        const result = this.#target.pop();
        /** @type {ObservableArrayNotification} */
        const details = { type: ObservableArray.EVENT_TYPE.pop, result };
        this._notify(details);
    }

    shift() {
        const result = this.#target.shift();
        /** @type {ObservableArrayNotification} */
        const details = { type: ObservableArray.EVENT_TYPE.shift, result };
        this._notify(details);
    }

    reverse() {
        const result = this.#target.reverse();
        /** @type {ObservableArrayNotification} */
        const details = { type: ObservableArray.EVENT_TYPE.reverse, result };
        this._notify(details);
    }

    /**
     * @param {function} [compareFn] 
     */
    sort(compareFn) {
        const result = this.#target.sort(compareFn);
        /** @type {ObservableArrayNotification} */
        const details = { type: ObservableArray.EVENT_TYPE.sort, result };
        this._notify(details);
    }

    clear() {
        const result = this.#target.splice(0);
        /** @type {ObservableArrayNotification} */
        const details = { type: ObservableArray.EVENT_TYPE.clear, result };
        this._notify(details);
    }
}