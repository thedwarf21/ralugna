import { ObservableArray } from "../../../../engine/observables/ObservableArray.js";
import { RlgForDataObserver } from "./RlgForDataObserver.js";

/** @import { ObservableArrayNotification } from "../../../../engine/observables/ObservableArray.js"; */

export class RlgForArrayObserver extends RlgForDataObserver {
    /**
     * @override
     * @protected
     * @param {ObservableArrayNotification} details 
     */
    _observerHandler(details) {
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
                this._owner.removeArrayItem(details.index);
                break;
            case ObservableArray.EVENT_TYPE.shift:
                this._owner.removeArrayItem(details.index);
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
        const dataPath = this._owner.getArrayItemDataPath(index);
        const newItem = this._owner.getIterationNode(value, dataPath, index);
        const currentItem = this._owner.getItem(index);
        if (currentItem) {
            currentItem.replaceWith(newItem);
        } else {
            this._owner.appendItem(newItem);
        }
    }

    /**
     * @private
     * @param {number} index 
     * @param {any} value 
     */
    #addItem(index, value) {
        const dataPath = this._owner.getArrayItemDataPath(index);
        const newItem = this._owner.getIterationNode(value, dataPath, index);
        if (index > 0) {
            this._owner.appendItem(newItem);
        } else {
            this._owner.prependItem(newItem);
        }
    }

    /**
     * @private
     * @param {any[]} array 
     */
    #initFromArray(array) {
        this._owner.clear();
        this._owner.pathTarget = array;
    }
}
