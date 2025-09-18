import { Composer } from "../engine/behaviors/BehaviorIntegrator.js";
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
            if (!this.#getSlot(name)) {
                this.#slots.push({ name: name });
            }
        }
    }

    /**
     * @protected
     * @param {BehaviorConfig[]} config
     */
    set behaviors(config) {
        const keptConfig = [];
        for (const item of config) {
            if (this.#checkBehaviorConfig(item, config)) {
                keptConfig.push(item);
            }
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

    destroy() {
        for (const behaviorConfig of this.#behaviors) {
            const behavior = this[behaviorConfig.name];
            behavior.destroy();
        }
    }

    /**
     * @param {BehaviorConfig} config 
     * @param {BehaviorConfig[]} configsList
     * @returns {boolean}
     */
    #checkBehaviorConfig(config, configsList) {
        const currentName = config.name;
        const currentClass = config.class;
        const sameNamedItems = configsList.filter(elt => elt.name === currentName);
        if (sameNamedItems.length > 1) {
            console.warn(`The behavior named ${currentName} appear several times in your config object => ignored.`);
            return false;
        }
        if (!currentClass || !Composer.isBehavior(currentClass)) {
            console.warn(`The behavior named ${currentName} is not relied to a Behavior class => ignored.`);
            return false;
        }
        return true;
    }

    /**
     * @private
     * @param {string} name
     * @returns {SlotConfig | undefined}
     */
    #getSlot(name) {
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
}

customElements.define("rlg-base-component", BaseComponent);