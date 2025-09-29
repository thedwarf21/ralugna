import { ObservableObject } from "../observables/ObservableObject.js";

export class Binding {
    /**
     * @typedef BoundAttribute
     * @property {string} key
     * @property {HTMLElement} element
     * @property {string} attr
     * @property {string} [event]
     * @property {function} [onModelValueChange]
     * @property {function} [internalCallback]
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
     * @param {function} [onModelValueChange]
     * @returns {Binding}
     */
    bind(key, element, attr = "textContent", event, onModelValueChange) {
        this.#applyNewValue(element, attr, this.#model[key]);
        /** @type {BoundAttribute} */
        const newBinding = { key, element, attr, event, onModelValueChange };
        this.#bound.push(newBinding);
        if (event) {
            newBinding.internalCallback = () => this.#attrValueChanged(newBinding);
            element.addEventListener(event, newBinding.internalCallback);
        }
        return this;
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
                    item.element.removeEventListener(item.event, item.internalCallback);
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
                const newValue = details.value;
                this.#applyNewValue(element, attr, newValue);
                this.#executeCallback(binding, newValue);
            }
            if (details.type === ObservableObject.EVENT_TYPE.init) {
                const newValue = details.current[key];
                this.#applyNewValue(element, attr, newValue);
                this.#executeCallback(binding, newValue);
            }
        }
    }

    /**
     * @param {BoundAttribute} params 
     */
    #attrValueChanged(params) {
        this.#model[params.key] = params.element.getAttribute(params.attr);
    }

    /**
     * 
     * @param {HTMLElement} element 
     * @param {string} attr 
     * @param {any} newValue 
     */
    #applyNewValue(element, attr, newValue) {
        if (attr in element) {
            element[attr] = newValue;
        } else {
            element.setAttribute(attr, newValue);
        }
    }

    /**
     * @private
     * @param {BoundAttribute} binding
     * @param {any} newValue 
     */
    #executeCallback(binding, newValue) {
        if (binding.onModelValueChange) {
            binding.onModelValueChange(newValue);
        }
    }
}