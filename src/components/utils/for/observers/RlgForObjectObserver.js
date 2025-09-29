import { ObservableObject } from "../../../../engine/observables/ObservableObject.js";
import { RlgForDataObserver } from "./RlgForDataObserver.js";
/** @import {ObservableObjectNotification} from "../../../../engine/observables/ObservableObject.js"; */

export class RlgForObjectObserver extends RlgForDataObserver {
    /**
     * @override
     * @protected
     * @param {ObservableObjectNotification} details 
     */
    _observerHandler(details) {
        switch (details.type) {
            case ObservableObject.EVENT_TYPE.set:
                this.#renderOrUpdateItem(details.key, details.value);
                break;
            case ObservableObject.EVENT_TYPE.delete:
                this._owner.removeObjectItem(details.key);
                break;
            case ObservableObject.EVENT_TYPE.init:
                this.#initFromObject(details.current);
                break;
        }
    }

    /**
     * @private
     * @param {string} key 
     * @param {any} value 
     */
    #renderOrUpdateItem(key, value) {
        const dataPath = this._owner.getObjectItemDataPath(key); 
        const newItem = this._owner.getIterationNode(value, dataPath, key);
        const currentItem = this._owner.getItem(key);
        if (currentItem) {
            currentItem.replaceWith(newItem);
        } else {
            this._owner.appendItem(newItem);
        }
    }

    /**
     * @private
     * @param {Object} obj 
     */
    #initFromObject(obj) {
        this._owner.clear();
        this._owner.pathTarget = obj;
    }
}