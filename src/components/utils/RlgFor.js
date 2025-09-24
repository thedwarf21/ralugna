import { BaseComponent } from "../BaseComponent.js";
import { SlotsSupport } from "../behaviors/SlotsSupport.js";

/**
 * @extends BaseComponent
 */
export class RlgFor extends BaseComponent {
    /**
     * @readonly
     * @type {string}
     */
    static TAG_NAME = this._getFullTagName("for");

    constructor() {
        super();
        this._behaviors = [{ class: SlotsSupport, name: "$slots" }];
    }

    /**
     * @override
     */
    _configureBehaviors() {
        this._setSlots(["repeatable-content"]);
    }
}

BaseComponent.registerComponent(RlgFor);