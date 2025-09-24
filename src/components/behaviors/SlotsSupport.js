import { Behavior } from "../../engine/behaviors/Behavior.js";

export class SlotsSupport extends Behavior {
    /**
     * @typedef SlotConfig
     * @property {string} name
     * @property {HTMLSlotElement} [element]
     */
    /**
     * @protected
     * @type {SlotConfig[]}
     */
    _slots = [];
    
    /**
     * @protected
     * @param {string} name
     * @returns {SlotConfig | undefined}
     */
    _getSlot(name) {
        const filteredSlots = this._slots.filter(elt => elt.name === name);
        return filteredSlots.length === 0 ? undefined : filteredSlots[0];
    }

    /**
     * @protected
     * @param {string[]} names 
     */
    _setSlots(names) {
        if (this._slots.length > 0) {
            throw new Error("SlotSupport: slots can only be configured once.");
        }
        for (const name of names) {
            this._slots.push({ name });
        }
    }

    /**
     * @override
     * @param {ShadowRoot} root
     */
    onAttach(root) {
        for (const slotConfig of this._slot) {
            const slotEl = document.createElement("slot");
            slotEl.setAttribute("name", slotConfig.name);
            root.appendChild(slotEl);
            slotConfig.element = slotEl;
        }
    }
}