import { ObservableArray } from "../../engine/observables/ObservableArray.js";
import { RlgForLooper } from "./RlgForLooper.js";

/** @import { ObservableArrayNotification } from "../../engine/observables/ObservableArray.js"; */

export class RlgForArrayObserver {
    /**
     * @private
     * @type {RlgForLooper}
     */
    #owner;

    /**
     * @private
     * @type {ObservableArray}
     */
    #loopTarget;

    /**
     * @param {RlgForLooper} owner 
     * @param {ObservableArray} loopTarget 
     */
    constructor(owner, loopTarget) {
        this.#owner = owner;
        this.#loopTarget = loopTarget;
        this.#loopTarget.observe(this, (details) => this.#observerHandler(details));
    }

    /**
     * @private
     * @param {ObservableArrayNotification} details 
     */
    #observerHandler(details) {
        switch (details.type) {
            case ObservableArray.EVENT_TYPE.set:
                this.#renderOrUpdateItem(details.index, details.value);
                break;
            case ObservableArray.EVENT_TYPE.push:
                this.#addItem(details.index, details.value);
                break;
            case ObservableArray.EVENT_TYPE.unshift:
                this.#addItem(details.index, details.value);
                break;
            case ObservableArray.EVENT_TYPE.pop:
                this.#owner.removeArrayItem(details.index);
                break;
            case ObservableArray.EVENT_TYPE.shift:
                this.#owner.removeArrayItem(details.index);
                break;
            case ObservableArray.EVENT_TYPE.init:
            case ObservableArray.EVENT_TYPE.clear:
            case ObservableArray.EVENT_TYPE.splice:
            case ObservableArray.EVENT_TYPE.reverse:
            case ObservableArray.EVENT_TYPE.sort:
                this.#initFromArray(details.current);
                break;
        }
    }

    /**
     * @private
     * @param {number} index 
     * @param {any} value 
     */
    #renderOrUpdateItem(index, value) {
        const dataPath = this.#owner.getArrayItemDataPath(index);
        const newItem = this.#owner.getIterationNode(value, dataPath, index);
        const currentItem = this.#owner.getItem(index);
        if (currentItem) {
            currentItem.replaceWith(newItem);
        } else {
            this.#owner.appendItem(newItem);
        }
    }

    /**
     * @private
     * @param {number} index 
     * @param {any} value 
     */
    #addItem(index, value) {
        const dataPath = this.#owner.getArrayItemDataPath(index);
        const newItem = this.#owner.getIterationNode(value, dataPath, index);
        if (index > 0) {
            this.#owner.appendItem(newItem);
        } else {
            this.#owner.prependItem(newItem);
        }
    }

    /**
     * @private
     * @param {any[]} array 
     */
    #initFromArray(array) {
        this.#owner.clear();
        this.#owner.pathTarget = array;
    }
}
