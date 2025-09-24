import { BaseComponent } from "../BaseComponent.js";
import { SlotsSupport } from "../behaviors/SlotsSupport.js";
import { BindingParser } from "../../engine/binding/BindingParser.js";
import { ContextDispatcher, SharedContexts } from "./context/ContextProvider.js";
import { Html } from "../../engine/utils/Html.js";
import { RlgForItem } from "./RlgForItem.js";

/**
 * @extends BaseComponent
 */
export class RlgFor extends BaseComponent {
    /**
     * @readonly
     * @type {string}
     */
    static TAG_NAME = this._getFullTagName("for");

    /**
     * @readonly
     * @type {string}
     */
    static CSS_URL = "./RlgFor.css";

    /**
     * @readonly
     * @type {string}
     */
    static PATTERN_SLOT_NAME = "repeatable-content";

    /**
     * @readonly
     * @type {Record<string, string>}
     */
    static OPERATORS = {
        in: "in",
        of: "of"
    };

    /**
     * @private
     * @type {string[]}
     */
    #supportedOperators = [RlgFor.OPERATORS.in, RlgFor.OPERATORS.of];

    /**
     * @private
     * @type {BindingParser}
     */
    #vmParser;
    
    /**
     * @typedef LoopData
     * @property {string} itemName
     * @property {string} operator
     * @property {string} dataPath
     * @property {BindingParser} vmParser 
     */
    /**
     * @type {LoopData}
     */
    loopData;

    constructor() {
        super();
        this._behaviors = [{ class: SlotsSupport, name: "$slots" }];
        this.#vmParser = ContextDispatcher.injectOrThrow(SharedContexts.viewModel);
    }

    /**
     * @override
     */
    _configureBehaviors() {
        this._setSlots([RlgFor.PATTERN_SLOT_NAME]);
    }

    connectedCallback() {
        super.connectedCallback();
        this.loopData = this.#getLoopDataFromAttr();
        this.loopData.pathTarget = this.#vmParser.getAtPath(this.loopData.dataPath);
        this.#executeLoop();
    }

    /**
     * @private
     * @returns {LoopData}
     */
    #getLoopDataFromAttr() {
        const [ itemName, operator, dataPath ] = this.#getEachAttrMembers();
        return { itemName, operator, dataPath };
    }

    /**
     * @private
     * @returns {string[]}
     */
    #getEachAttrMembers() {
        const eachAttr = this.getAttribute("each");
        if (!eachAttr) {
            throw new Error(`RlgFor: missing "each" attribute`);
        }
        const eachAttrMembers = eachAttr.split(" ").filter(Boolean);
        if (!this.#isValidEachAttr(eachAttrMembers)) {
            throw new Error(`RlgFor: invalid each expression "${each}". Should be "varName of path[2].an.array" or "varName in path[2].an.object"`);
        }
        return eachAttrMembers;
    }

    /**
     * @private
     * @param {string[]} expressionMembers 
     * @returns 
     */
    #isValidEachAttr(expressionMembers) {
        return (
            expressionMembers.length !== 3 &&
            !this.#supportedOperators.includes(expressionMembers[1])
        );
    }

    /**
     * @private
     */
    #executeLoop() {
        switch (this.loopData.operator) {
            case RlgFor.OPERATORS.of:
                this.#reflectArray();
                break;
            case RlgFor.OPERATORS.in:
                this.#reflectObject();
                break;
        }
    }

    /**
     * @private
     */
    #reflectArray() {
        const data = this.loopData.pathTarget;
        for (const i = 0; i < data.length; i++) {
            const item = data[i];
            const newHtmlNode = this.#getIterationNode(item);
            this.internalDom.append(newHtmlNode);
        }
    }

    /**
     * @private
     */
    #reflectObject() {
        for (const prop in this.loopData.pathTarget) {
            const item = data[prop];
            const newHtmlNode = this.#getIterationNode(item);
            this.internalDom.append(newHtmlNode);
        }
    }

    /**
     * @private
     * @param {any} value
     * @returns {RlgForItem} 
     */
    #getIterationNode(value) {
        const patternNode = this.#getPatternClone();
        const iterationEl = new RlgForItem();
        iterationEl.config =  { patternNode, varName: this.loopData.itemName, value };
        return iterationEl;
    }

    /**
     * @private
     * @returns {HtmlDivElement}
     */
    #getPatternClone() {
        const slot = this._getSlot(RlgFor.PATTERN_SLOT_NAME);
        const slotContent = slot.assignedNodes({ flatten: true });
        const slotClone = Html.create("div");
        slotClone.append(...slotContent.map(n => n.cloneNode(true)));
        return slotClone;
    }
}

BaseComponent.registerComponent(RlgFor);