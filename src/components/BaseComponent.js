import { BehaviorIntegrator } from "../engine/behaviors/BehaviorIntegrator.js";
import { Html } from "../engine/utils/Html.js";
/** @import { BehaviorConfig } from "../engine/behaviors/BehaviorIntegrator.js"; */

/**
 * @abstract
 * @extends {HTMLElement}
 */
export class BaseComponent extends HTMLElement {
    /**
     * @readonly
     * @type {string}
     */
    static PREFFIX = "rlg-";
    
    /**
     * @readonly
     * @type {string}
     */
    static TAG_NAME = this._getFullTagName("base-component");

    /**
     * @readonly
     * @type {string}
     */
    static CSS_URL = "";

    /**
     * @protected
     * @type {BehaviorConfig[]}
     */
    _behaviors = [];

    /**
     * @protected
     * @type {ShadowRoot} 
     */
    _shadowRoot;

    /**
     * @private
     * @type {BehaviorIntegrator}
     */
    #behaviorIntegrator;

    constructor() {
        super();
        if (this.constructor.name === "BaseComponent") {
            throw new Error("`BaseComponent` is abstract and cannot be instanciated directly");
        }
    }

    /**
     * @protected
     * @param {BehaviorConfig[]} config
     */
    set behaviors(config) {
        this._behaviors = config;
    }

    /**
     * @returns {string[]}
     */
    get behaviors() {
        return this._behaviors.map(config => config.name);
    }

    /**
     * @returns {ShadowRoot}
     */
    get internalDom() {
        return this._shadowRoot;
    }
    
    connectedCallback() {
        this._shadowRoot = this.attachShadow({ mode: "open" });
        this._appendStyles();
        this._prepareBehaviors();
        this._configureBehaviors();
        this.#behaviorIntegrator.attachBehaviors(this._shadowRoot);
    }

    /**
     * @protected
     */
    _configureBehaviors() {}

    destroy() {
        this.#behaviorIntegrator.destroyAll(this, this._behaviors);
    }

    /**
     * @param {string} name 
     * @returns {string}
     */
    _getFullTagName(name) {
        return BaseComponent.PREFFIX + name;
    }

    /**
     * @protected
     */
    _appendStyles() {
        const url = this.constructor.CSS_URL;
        if (url) {
            const stylesEl = Html.styles(url);
            this._shadowRoot.appendChild(stylesEl);
        }
    }

    /**
     * @protected
     */
    _prepareBehaviors() {
        this.#behaviorIntegrator = new BehaviorIntegrator();
        const [integratedConfigs, totalCount] = this.#behaviorIntegrator.integrateAll(this, this._behaviors);
        this._behaviors = integratedConfigs;
        console.debug(`Behaviors integration on "${this.constructor.name}": ${integratedConfigs.length} / ${totalCount} behaviors will be integrated.`);
    }

    /**
     * @param {typeof BaseComponent} component 
     */
    static registerComponent(component) {
        customElements.define(component.TAG_NAME, component);
    }
}

BaseComponent.registerComponent(BaseComponent);