import { ViewModel } from "../observables/ViewModel.js";
import { ObservableValue } from "../observables/ObservableValue.js";

export class BindingParser {
    /**
     * @typedef BindingParserResult
     * @property {any} value
     * @property {boolean} observable
     */
    /**
     * @private
     * @type {ViewModel}
     */
    #viewModel

    /**
     * @param {ViewModel} viewModel 
     */
    constructor(viewModel) {
        if (!(viewModel instanceof ViewModel)) {
            throw new TypeError("BindingParser's constructor expects a ViewModel.");
        }
        this.#viewModel = viewModel;
    }

    /**
     * @param {string} path - eg. "user.todos[2].name"
     * @returns {BindingParserResult}
     */
    getAtPath(path) {
        const parsedPath = this.#parsePath(path);
        if (!parsedPath.length || parsedPath.some(part => part === "")) {
            throw new InvalidPathError(path);
        }
        const value = parsedPath.reduce((acc, key) => acc?.[key], this.#viewModel);
        const isObservable = ObservableValue.isObservable(value);
        /** @type {BindingParserResult} */
        const result = { value, observable: isObservable };
        return result;
    }

    /**
     * @private
     * @param {string} path 
     * @returns {string[]}
     */
    #parsePath(path) {
        try {
            return path.replace(/\[(\w+)\]/g, '.$1').split('.'); // convert [2] to .2
        } catch(e) {
            throw new InvalidPathError(path);
        }
    }
}

/**
 * This custom Error class is specific to this module, that's why it is included in this file
 * 
 * @extends Error
 */
export class InvalidPathError extends Error {
    constructor(path) {
        super(`Incorrect path format: ${path}`);
        this.name = "InvalidPathError";
    }
}