import { BaseComponent } from "../../BaseComponent.js";
import { Interpolator } from "../../../engine/binding/Interpolator.js";
import { RlgModelSupport } from "../../behaviors/RlgModelSupport.js";
 
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
     * @type {Interpolator}
     */
    #interpolator;

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
        this.#interpolator = new Interpolator(config.vmParser);
    }

    connectedCallback() {
        super.connectedCallback();
        this.render();
    }

    render() {
        /** @type {InterpolationContext} */
        const context = { 
            internalName: this.#varName,
            fullPath: this.#varPath
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
        if (this.#isPathDescriber(node, attr)) {
            attr.value = this.#interpolatePath(attr.value, context);
        } else {
            attr.value = this.#interpolateText(attr.value, context);
        }
    }

    /**
     * @param {Node} node 
     * @param {Attr} attr 
     * @returns {boolean}
     */
    #isPathDescriber(node, attr) {
        return (
            attr.name === RlgModelSupport.ATTR_NAME || (
                node.tagName.toLowerCase() === this.#parentTagName
                && attr.name === "each"
            )
        );
    }

    /**
     * @private
     * @param {string} text 
     * @param {InterpolationContext} context 
     * @returns {string}
     */
    #interpolatePath(text, context) {
        const regexp = new RegExp(context.internalName, "g");
        return text.replace(regexp, context.fullPath);
    }

    /**
     * @param {string} text
     * @param {InterpolationContext} context
     * @returns {string}
     */
    #interpolateText(text, context) {
        const replacements = [];
        const patterns = text.matchAll(Interpolator.patternRegExp);
        for (const pattern of patterns) {
            replacements.push({
                from: pattern,
                to: this.#interpolatePath(pattern, context)
            });
        }
        for (const replacement of replacements) {
            text = text.replace(replacement.from, replacement.to);
        }
        return this.#interpolator.resolve(text);
    }
}

BaseComponent.registerComponent(RlgForItem);