import { BindingParser } from "./BindingParser.js";

export class Interpolator {
    /**
     * @readonly
     * @type {RegExp}
     */
    static patternRegExp = /\{\{\s*(\w+)\s*\}\}/g;

    /**
     * @private
     * @type {BindingParser}
     */
    #bindingParser;

    /**
     * @param {BindingParser} bindingParser 
     */
    constructor(bindingParser) {
        this.#bindingParser = bindingParser;
    }

    /**
     * @param {string} str 
     */
    resolve(str) {
        const patterns = str.match(Interpolator.patternRegExp);
        for (const pattern of patterns) {
            str = str.replace(pattern, this.#getValueFrom(pattern));
        }
        return str;
    }

    /**
     * @param {string} pattern 
     * @returns {[ ObservableValue, string ]}
     */
    getBindingDataFrom(pattern) {
        const path = this.#getPatternContent(pattern);
        return this.#bindingParser.getAtPathForBinding(path);
    }

    /**
     * 
     * @param {string} pattern 
     * @returns {string}
     */
    #getPatternContent(pattern) {
        return pattern.replace(/^\{\{\s*/, "").replace(/\s*\}\}$/, "");
    }

    /**
     * @private
     * @param {string} pattern 
     * @returns {any}
     */
    #getValueFrom(pattern) {
        const path = this.#getPatternContent(pattern);
        const parsingResult = this.#bindingParser.getAtPath(path);
        const value = parsingResult.value;
        if (parsingResult.observable) {
            console.warn(`Interpolator: observable values (Array/Object) are not directly interpolable. Target a property or use a <rlg-for> component instead`);
            return pattern;
        }
        return value;
    }
}