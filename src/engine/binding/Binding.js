import { ObservableObject } from "../observables/ObservableObject.js";

export class Binding {
    /**
     * @typedef BoundAttribute
     * @property {string} key
     * @property {HTMLElement} element
     * @property {string} attr
     */
    /**
     * @private
     * @type {ObservableObject}
     */
    #model;

    /**
     * @private
     * @type {BoundAttribute[]}
     */
    #bound = [];

    /**
     * @param {ObservableObject} source 
     */
    constructor(source) {
        this.#model = source;
        this.#model.observe((details) => this.#notifiedChanges(details));
    }

    #notifiedChanges(details) {
        for (const binding of this.#bound) {
            const key = binding.key;
            const element = binding.element;
            const attr = binding.attr;
            if (details.type === ObservableObject.EVENT_TYPE.set && details.key === key) {
                element[attr] = details.value;
            }
            if (details.type === ObservableObject.EVENT_TYPE.init) {
                element[attr] = details.current[key];
            }
        }
    }

    /**
     * @param {string} key
     * @param {HTMLElement} element
     * @param {string} attr
     */
    bindPropertyToElement(key, element, attr = "textContent") {
        element[attr] = this.#model[key];
        /** @type {BoundAttribute} */
        const newBinding = { key, element, attr };
        this.#bound.push(newBinding);
    }
}