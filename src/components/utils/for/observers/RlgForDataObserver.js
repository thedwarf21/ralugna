import { RlgForLooper } from "../RlgForLooper.js";

/**
 * @abstract
 */
export class RlgForDataObserver {
    /**
     * @protected
     * @type {RlgForLooper}
     */
    _owner;

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
        this._owner = owner;
        this.#loopTarget = loopTarget;
        this.#loopTarget.observe(this, (details) => this._observerHandler(details));
    }

    diconnect() {
        this.#loopTarget.disconnect(this);
    }

    /**
     * @abstract
     * @protected
     * @param {ObservableNotification} details 
     */
    _observerHandler(details) {
        throw new AbstractMethodError("#observerHandler(details)");
    }
}