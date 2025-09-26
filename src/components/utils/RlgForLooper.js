import { RlgForItem } from "./RlgForItem.js";

/** @import {BindingParserResult} from "../../engine/binding/BindingParser.js"; */
/** @import {RlgForItemConfig} from "./RlgForItem.js"; */
/** @import {LooperData} from "./RlgFor.types.js"; */

export class RlgForLooper {
    /**
     * @private
     * @type {LooperData}
     */
    #loopData;

    /**
     * @private
     * @type {RlgForItem[]}
     */
    #items;

    /**
     * @param {LooperData} loopData 
     */
    constructor(loopData) {
        this.#loopData = loopData;
    }
    
    /**
     * @returns {RlgForItem[]}
     */
    getContentsFromLoop() {
        switch (this.#loopData.operator) {
            case RlgFor.OPERATORS.of:
                this.#items = this.#reflectArray();
                break;
            case RlgFor.OPERATORS.in:
                this.#items = this.#reflectObject();
                break;
        }
        return this.#items;
    }

    /**
     * @param {any} value
     * @returns {RlgForItem}
     */
    getIterationNode(value) {
        const patternNode = this.#loopData.patternNode.cloneNode(true);
        const iterationEl = new RlgForItem();
        /** @type {RlgForItemConfig} */
        iterationEl.config =  { 
            patternNode,
            parentTagName: this.#loopData.parentTagName,
            varName: this.#loopData.itemName,
            varPath: this.#loopData.dataPath,
            value
        };
        return iterationEl;
    }

    /**
     * @private
     * @returns {RlgForItem[]}
     */
    #reflectArray() {
        const contentsList = [];
        const data = this.#loopData.pathTarget;
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            const newHtmlNode = this.getIterationNode(item);
            contentsList.push(newHtmlNode);
        }
        return contentsList;
    }

    /**
     * @private
     * @returns {RlgForItem[]}
     */
    #reflectObject() {
        const contentsList = [];
        const data = this.#loopData.pathTarget;
        for (const prop in data) {
            const item = data[prop];
            const newHtmlNode = this.getIterationNode(item);
            contentsList.push(newHtmlNode);
        }
        return contentsList;
    }
}