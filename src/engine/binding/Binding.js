import { ObservableObject } from "../observables/ObservableObject.js";

export class Binding {
    /**
     * @typedef BoundAttribute
     * @property {string} key
     * @property {HTMLElement} element
     * @property {string} attr
     * @property {string} [event]
     * @property {function} [callback]
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

    /**
     * @param {string} key
     * @param {HTMLElement} element
     * @param {string} [attr]
     * @param {string} [event]
     */
    bind(key, element, attr = "textContent", event) {
        element[attr] = this.#model[key];
        /** @type {BoundAttribute} */
        const newBinding = { key, element, attr, event };
        this.#bound.push(newBinding);
        if (event) {
            newBinding.callback = () => this.#attrValueChanged(newBinding);
            element.addEventListener(event, newBinding.callback);
        }
    }

    /**
     * @param {HTMLElement} element 
     * @param {string} attr
     */
    unbind(element, attr) {
        for (let i = this.#bound.length - 1; i >= 0; i--) {
            const item = this.#bound[i];
            if (item.element === element && item.attr === attr) {
                this.#bound.splice(i, 1);
                if (item.event) {
                    item.element.removeEventListener(item.event, item.callback);
                }
            }
        }
    }

    /**
     * @param {ObservableObjectNotification} details
     */
    #notifiedChanges(details) {
        for (const binding of this.#bound) {
            const { key, element, attr } = binding;
            if (details.type === ObservableObject.EVENT_TYPE.set && details.key === key) {
                element.setAttribute(attr, details.value);
            }
            if (details.type === ObservableObject.EVENT_TYPE.init) {
                element.setAttribute(attr, details.current[key]);
            }
        }
    }

    /**
     * @param {BoundAttribute} params 
     */
    #attrValueChanged(params) {
        this.#model[params.key] = params.element.getAttribute(params.attr);
    }
}