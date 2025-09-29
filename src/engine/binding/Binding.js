import { ObservableObject } from "../observables/ObservableObject.js";

export class Binding {
    /**
     * @typedef BindingConfig
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
     * @type {BindingConfig[]}
     */
    #bound = [];

    /**
     * @param {ObservableObject} source 
     */
    constructor(source) {
        this.#model = source;
        this.#model.observe(this, (details) => this.#notifiedChanges(details));
    }

    /**
     * @param {BindingConfig}
     * @returns {Binding}
     */
    bind({ key, element, attr = "textContent", event, onModelValueChange }) {
        this.#applyNewValue(element, attr, this.#model[key]);
        /** @type {BindingConfig} */
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

    destroy() {
        this.#unbindAll();
        this.#model.disconnect(this);
    }

    /**
     * @private
     */
    #unbindAll() {
        for (let i = this.#bound.length - 1; i >= 0; i--) {
            const item = this.#bound[i];
            item.element.removeEventListener(item.event, item.internalCallback);
            this.#bound.splice(i, 1);
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
     * @param {BindingConfig} params 
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
     * @param {BindingConfig} binding
     * @param {any} newValue 
     */
    #executeCallback(binding, newValue) {
        if (binding.onModelValueChange) {
            binding.onModelValueChange(newValue);
        }
    }
}