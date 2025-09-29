import { ObservableValue } from "../../../engine/observables/ObservableValue.js";
import { RlgForItem } from "./RlgForItem.js";

/** @import {RlgForItemConfig} from "./RlgForItem.js"; */
/** @import {LooperData} from "./RlgFor.types.js"; */

export class RlgForLooper {
    /**
     * @readonly
     * @type {string}
     */
    static INDEX_ATTR_NAME = "loop-index";

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
     * @private
     * @type {HTMLElement | DocumentFragment}
     */
    #itemsContainer;

    /**
     * @param {LooperData} loopData 
     */
    constructor(loopData) {
        this.#loopData = loopData;
    }

    /**
     * @param {ObservableValue}
     */
    set pathTarget(value) {
        this.#loopData.pathTarget = value;
        this.render(this.#itemsContainer);
    }

    /**
     * @param {HTMLElement | DocumentFragment | ShadowRoot} container
     */
    render(container) {
        this.#itemsContainer = container;
        this.#initItemsFromLoop();
        this.#itemsContainer.append(...this.#items);
    }

    /**
     * @param {string | number} index
     * @returns {RlgForItem | undefined}
     */
    getItem(index) {
        return this.#items?.find(item => item.getAttribute(RlgForLooper.INDEX_ATTR_NAME) == index); // == is for arrays ("0", "1", etc., in HTML attributes)
    }

    /**
     * @param {number} index
     * @returns {string}
     */
    getArrayItemDataPath(index) {
        return this.#loopData.dataPath + "[" + index + "]";
    }

    /**
     * @param {string} prop 
     * @returns {string}
     */
    getObjectItemDataPath(prop) {
        return `${this.#loopData.dataPath}.${prop}`;
    }

    /**
     * @param {RlgForItem} item 
     */
    appendItem(item) {
        this.#items.push(item);
        this.#itemsContainer.append(item);
    }

    /**
     * @param {RlgForItem} item 
     */
    prependItem(item) {
        this.#items.unshift(item);
        this.#itemsContainer.prepend(item);
    }

    /**
     * @param {string | number} index
     * @returns {RlgForItem | undefined}
     */
    removeArrayItem(index) {
        const item = this.getItem(index);
        if (item) {
            this.#items.splice(index, 1);
            item.remove();
        } else {
            console.warn(`RlgForLooper: unable to delete index "${index}" => unknow index`);
        }
    }

    /**
     * @param {string} prop
     */
    removeObjectItem(prop) {
        for (let i = 0; i < this.#items.length; i++) {
            const item = this.#items[i];
            if (item.getAttribute(RlgForLooper.INDEX_ATTR_NAME) === prop) {
                this.#items.splice(i, 1);
                item.remove();
                break;
            }
        }
        console.warn(`RlgForLooper: unable to delete key "${key}" => unknow key`);
    }

    clear() {
        for (const item of this.#items) {
            item.remove();
        }
        this.#items = [];
    }

    /**
     * @param {string} dataPath 
     * @param {string | number} index
     * @returns {RlgForItem}
     */
    getIterationNode(dataPath, index) {
        const patternNode = this.#loopData.patternNode.cloneNode(true);
        const iterationEl = new RlgForItem();
        /** @type {RlgForItemConfig} */
        iterationEl.config =  { 
            patternNode,
            vmParser: this.#loopData.vmParser,
            parentTagName: this.#loopData.parentTagName,
            indexAttrName: RlgForLooper.INDEX_ATTR_NAME,
            varName: this.#loopData.itemName,
            varPath: dataPath,
            index
        };
        return iterationEl;
    }
    
    /**
     * @private
     */
    #initItemsFromLoop() {
        switch (this.#loopData.operator) {
            case RlgFor.OPERATORS.of:
                this.#items = this.#reflectArray();
                break;
            case RlgFor.OPERATORS.in:
                this.#items = this.#reflectObject();
                break;
        }
    }

    /**
     * @private
     * @returns {RlgForItem[]}
     */
    #reflectArray() {
        const contentsList = [];
        const data = this.#loopData.pathTarget;
        for (let i = 0; i < data.length; i++) {
            const dataPath = this.getArrayItemDataPath(i);
            const newHtmlNode = this.getIterationNode(dataPath, i);
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
            const dataPath = this.getObjectItemDataPath(prop);
            const newHtmlNode = this.getIterationNode(dataPath, prop);
            contentsList.push(newHtmlNode);
        }
        return contentsList;
    }
}