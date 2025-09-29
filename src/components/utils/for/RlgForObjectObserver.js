import { ObservableObject } from "../../../engine/observables/ObservableObject.js";
import { RlgForLooper } from "./RlgForLooper.js";
/** @import {ObservableObjectNotification} from "../../../engine/observables/ObservableObject.js"; */

export class RlgForObjectObserver {
    /**
     * @private
     * @type {RlgForLooper}
     */
    #owner;

    /**
     * @private
     * @type {ObservableObject}
     */
    #loopTarget;

    /**
     * @param {RlgForLooper} owner 
     * @param {ObservableObject} loopTarget
     */
    constructor(owner, loopTarget) {
        this.#owner = owner;
        this.#loopTarget = loopTarget;
        this.#loopTarget.observe(this, (details) => this.#observerHandler(details));
    }

    /**
     * @private
     * @param {ObservableObjectNotification} details 
     */
    #observerHandler(details) {
        switch (details.type) {
            case ObservableObject.EVENT_TYPE.set:
                this.#renderOrUpdateItem(details.key, details.value);
                break;
            case ObservableObject.EVENT_TYPE.delete:
                this.#owner.removeObjectItem(key);
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
        const dataPath = this.#owner.getObjectItemDataPath(key); 
        const newItem = this.#owner.getIterationNode(value, dataPath, key);
        const currentItem = this.#owner.getItem(key);
        if (currentItem) {
            currentItem.replaceWith(newItem);
        } else {
            this.#owner.appendItem(newItem);
        }
    }

    /**
     * @private
     * @param {Object} obj 
     */
    #initFromObject(obj) {
        this.#owner.clear();
        this.#owner.pathTarget = obj;
    }
}