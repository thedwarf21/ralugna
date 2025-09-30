import { BaseComponent } from "../BaseComponent.js";
import { Html } from "../../engine/utils/Html.js";
import { RlgModelSupport } from "../behaviors/RlgModelSupport.js";
import { ContextDispatcher, SharedContexts } from "./context/ContextProvider.js";

/** @import { BindingConfig } from "../behaviors/RlgModelSupport.js"; */

/**
 * @extends BaseComponent
 */
export class RlgBind extends BaseComponent {
    /**
     * @readonly
     * @type {string}
     */
    static CSS_URL = "./RlgBind.css";

    /**
     * @readonly
     * @type {string}
     */
    static TAG_NAME = this._getFullTagName("bind");
    /**
     * @private
     * @type {HTMLElement}
     */
    #element;

    /**
     * @private
     * @type {string}
     */
    #attr;

    constructor() {
        super();
        this._behaviors = [{ class: RlgModelSupport, name: "$rlgModel" }];
    }
    /**
     * @override
     */
    _configureBehaviors() {
        const vmParser = ContextDispatcher.injectOrThrow(SharedContexts.viewModel);
        const attr = this.#attr = this.getAttribute("attr");
        /** @type {BindingConfig} */
        const config = { attr, onModelValueChange: (newValue) => this.#applyModelChange(newValue) };
        this._setVmParser(vmParser);
        this._setBindingConfig(config);
    }

    connectedCallback() {
        super.connectedCallback();
        const tagName = this.getAttribute("tag-name");
        this.#element = Html.create(tagName);
        this.internalDom.append(this.#element);
    }

    /**
     * @private
     */
    #applyModelChange(newValue) {
        if (this.#attr in this.#element) {
            this.#element[this.#attr] = newValue;
        } else {
            this.#element.setAttribute(this.#attr, newValue);
        }
    }
}