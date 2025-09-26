import { BaseComponent } from "../BaseComponent.js";
import { SlotsSupport } from "../behaviors/SlotsSupport.js";
import { BindingParser } from "../../engine/binding/BindingParser.js";
import { ContextDispatcher, SharedContexts } from "./context/ContextProvider.js";
import { Html } from "../../engine/utils/Html.js";
import { RlgForLooper } from "./RlgForLooper.js";

/** @import {LoopData, LooperData} from "./RlgFor.types.js"; */

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
    static PATTERN_SLOT_NAME = "pattern";

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
            throw new Error(`RlgFor: invalid each expression "${each}". Should be "varName of array" or "varName in object"`);
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
            expressionMembers.length === 3 &&
            this.#supportedOperators.includes(expressionMembers[1])
        );
    }

    /**
     * @private
     */
    #executeLoop() {
        /** @type {LooperData} */
        const config = { 
            ...this.loopData,
            pathTarget: this.#vmParser.getAtPath(this.loopData.dataPath),
            patternNode: this.#getPatternClone(),
            parentTagName: RlgFor.TAG_NAME
        }
        const looper = new RlgForLooper(config);
        const items = looper.getContentsFromLoop();
        this.internalDom.append(...items);
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