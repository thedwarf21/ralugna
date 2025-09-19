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
        this.#behaviors = config;
    }

    /**
     * @returns {string[]}
     */
    get behaviors() {
        return this.#behaviors.map(config => config.name);
    }
    
    connecetdCallback() {
        this.shadowRoot = this.attachShadow({ mode: "open" });
        this.#prepareSlots();
        this.#prepareBehaviors();
    }

    destroy() {
        Composer.destroyAll(this, this.#behaviors);
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
        const [integratedConfigs, totalCount] = Composer.integrateAll(this.#behaviors);
        this.#behaviors = integratedConfigs;
        console.debug(`Behaviors integration on "${this.constructor.name}": ${integratedConfigs.length} / ${totalCount} behaviors will be integrated.`);
    }
}

customElements.define("rlg-base-component", BaseComponent);