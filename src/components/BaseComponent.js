import { Behaviors } from "../engine/behaviors/BehaviorIntegrator.js";
/** import { BehaviorConfig } from "../engine/behaviors/BehaviorIntegrator.js"; */

/**
 * @abstract
 * @extends {HTMLElement}
 */
export class BaseComponent extends HTMLElement {
    /**
     * @typedef SlotConfig
     * @property {string} name
     * @property {HTMLSlotElement} [element]
     */
    /**
     * @private
     * @type {SlotConfig[]}
     */
    #slots = [];

    /**
     * @private
     * @type {BehaviorConfig[]}
     */
    #behaviors = [];

    /**
     * @protected
     * @type {ShadowRoot} 
     */
    shadowRoot

    constructor() {
        super();
        if (this.constructor.name === "BaseComponent") {
            throw new Error("`BaseComponent` is abstract and cannot be instanciated directly");
        }
    }

    /**
     * @protected
     * @param {string[]} names 
     */
    set slots(names) {
        this.#slots = [];
        for (const name of names) {
            if (!this.getSlot(name)) {
                this.#slots.push({ name: name });
            }
        }
    }

    /**
     * @param {BehaviorConfig[]} config
     */
    set behaviors(config) {
        const keptConfig = [];
        for (const item of config) {
            const currentName = item.name;
            const currentClass = item.class;
            const sameNamedItems = config.filter(elt => elt.name === currentName);
            if (sameNamedItems.length > 1) {
                console.warn(`The behavior named ${currentName} appear several times in your config object => ignored.`);
                continue;
            }
            if (!currentClass || !Behaviors.isBehavior(currentClass)) {
                console.warn(`The behavior named ${currentName} is not relied to a Behavior class => ignored.`);
                continue;
            }
            keptConfig.push(item);
        }
        this.#behaviors = keptConfig;
    }

    /**
     * @returns {string[]}
     */
    get behaviors() {
        const result = [];
        this.#behaviors.forEach(behaviorConfig => result.push(behaviorConfig.name));
        return result;
    }
    
    connecetdCallback() {
        this.shadowRoot = this.attachShadow({ mode: "open" });
        this.#prepareSlots();
        this.#prepareBehaviors();
    }

    /**
     * @private
     * @param {string} name
     * @returns {SlotConfig | undefined}
     */
    getSlot(name) {
        const filteredSlots = this.#slots.filter(elt => elt.name === name);
        return filteredSlots.length === 0 ? undefined : filteredSlots[0];
    }

    /**
     * @private
     */
    #prepareSlots() {
        for (const slotConfig of this.#slots) {
            const slot = document.createElement("slot");
            slot.setAttribute("name", slotConfig.name);
            slotConfig.element = slot;
            root.appendChild(slot);
        }
    }

    /**
     * @private
     */
    #prepareBehaviors() {
        for (const behaviorConfig of this.#behaviors) {
            Behaviors.integrate(this, behaviorConfig);
        }
    }

    destroy() {
        for (const behaviorConfig of this.#behaviors) {
            const behavior = this[behaviorConfig.name];
            behavior.destroy();
        }
    }

    /**
     * @abstract
     */
    childrenAvailableCallback() {}
}

customElements.define("rlg-base-component", BaseComponent);