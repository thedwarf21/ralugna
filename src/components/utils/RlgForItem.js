import { BaseComponent } from "../BaseComponent.js";

export class RlgForItem extends BaseComponent {
    /**
     * @readonly
     * @type {string}
     */
    static TAG_NAME = this._getFullTagName("for-item");

    /**
     * @private
     * @type {HTMLDivElement}
     */
    #patternNode;

    /**
     * @private
     * @type {string}
     */
    #varName;

    /**
     * @private
     * @type {any}
     */
    #value;

    /**
     * @typedef {Object} RlgForItemConfig
     * @property {HTMLElement} patternNode
     * @property {string} varName
     * @property {any} value
     */
    /**
     * @param {RlgForItemConfig} config
     */
    set config(config) {
        this.#patternNode = config.patternNode;
        this.#varName = config.varName;
        this.#value = config.value;
    }

    connectedCallback() {
        super.connectedCallback();
        this.render();
    }

    render() {
        
    }
}