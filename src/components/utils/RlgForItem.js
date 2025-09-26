import { BaseComponent } from "../BaseComponent.js";

/** @import {InterpolationContext, RlgForItemConfig} from "./RlgForItem.types.js"; */

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
    #parentTagName;

    /**
     * @private
     * @type {string}
     */
    #indexAttrName;

    /**
     * @private
     * @type {string}
     */
    #varName;

    /**
     * @private
     * @type {string}
     */
    #varPath;

    /**
     * @private
     * @type {string | number}
     */
    #index;

    /**
     * @private
     * @type {any}
     */
    #value;

    /**
     * @param {RlgForItemConfig} config
     */
    set config(config) {
        this.#patternNode = config.patternNode;
        this.#parentTagName = config.parentTagName.toLowerCase();
        this.#indexAttrName = config.indexAttrName;
        this.#varName = config.varName;
        this.#varPath = config.varPath;
        this.#index = config.index;
        this.#value = config.value;
    }

    connectedCallback() {
        super.connectedCallback();
        this.render();
    }

    render() {
        /** @type {InterpolationContext} */
        const context = { 
            path: { [this.#varName]: this.#varPath },
            text : { [this.#varName]: this.#value }
        };
        const clone = this.#patternNode.cloneNode(true);
        clone.setAttribute(this.#indexAttrName, this.#index);
        this.#interpolateNode(clone, context);
        this.innerHTML = '';
        this.appendChild(clone);
    }

    /**
     * @param {Node} node
     * @param {InterpolationContext} context
     */
    #interpolateNode(node, context) {
        if (node.nodeType === Node.TEXT_NODE) {
            node.textContent = this.#interpolateText(node.textContent, context.text);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            for (let attr of node.attributes) {
                this.#interpolateAttr(node, attr, context);
            }
            for (let child of node.childNodes) {
                this.#interpolateNode(child, context);
            }
        }
    }

    /**
     * @param {Node} node 
     * @param {Attr} attr 
     * @param {InterpolationContext} context
     */
    #interpolateAttr(node, attr, context) {
        if (this.#needsPathInterpolation(node, attr)) {
            attr.value = this.#interpolateText(attr.value, context.path);
        } else {
            attr.value = this.#interpolateText(attr.value, context.text);
        }
    }

    /**
     * @param {Node} node 
     * @param {Attr} attr 
     * @returns {boolean}
     */
    #needsPathInterpolation(node, attr) {
        return (
            node.tagName.toLowerCase() === this.#parentTagName
            && attr.name === "each"
        );
    }

    /**
     * @param {string} text
     * @param {Object.<string, any>} context
     * @returns {string}
     */
    #interpolateText(text, context) {
        return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, varName) => {
            if (context[varName] !== undefined) {
                return context[varName];
            } else {
                console.warn(`Interpolation: variable "${varName}" non trouvée dans le contexte`, context);
                return '';
            }
        });
    }
}

BaseComponent.registerComponent(RlgForItem);