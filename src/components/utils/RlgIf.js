import { BaseComponent } from "../BaseComponent.js";
import { Interpolator } from "../../engine/binding/Interpolator.js";
import { Binding } from "../../engine/binding/Binding.js";

/**
 * @extends BaseComponent
 */
export class RlgIf extends BaseComponent {
    /**
     * @readonly
     * @type {string}
     */
    static TAG_NAME = this._getFullTagName("if");

    /**
     * @private
     * @type {Interpolator}
     */
    #interpolator;

    /**
     * @private
     * @type {string}
     */
    #testExpression;

    /**
     * @private
     * @type {string[]}
     */
    #patterns;

    /**
     * @private
     * @type {Binding[]}
     */
    #bindings;
    
    /**
     * @readonly
     * @type {string}
     */
    static CONTENT_SLOT_NAME = "content";

    constructor() {
        super();
        this._behaviors = [{ class: SlotsSupport, name: "$slots" }];
        const vmParser = ContextDispatcher.injectOrThrow(SharedContexts.viewModel);
        this.#interpolator = new Interpolator(vmParser);
    }
    /**
     * @override
     */
    _configureBehaviors() {
        this._setSlots([RlgIf.CONTENT_SLOT_NAME]);
    }

    connectedCallback() {
        super.connectedCallback();
        this.#testExpression = this.getAttribute("test");
        if (!this.#testExpression) {
            throw Error(`RlgIf: a "test" attribute containing the visibility condition is required`);
        }
        this.#bindPatterns();
    }

    disconnectedCallback() {
        for (const binding of this.#bindings) {
            binding.destroy();
        }
    }

    /**
     * @private
     */
    #bindPatterns() {
        this.#bindings = [];
        this.#patterns = this.#testExpression.match(Interpolator.patternRegExp);
        for (const pattern of this.#patterns) {
            const [observable, property] = this.#interpolator.getBindingDataFrom(pattern);
            this.#bindings.push(new Binding(observable).bind({ 
                key: property,
                onModelValueChange: () => { this.#evaluateTest(); }
            }));
        }
    }

    /**
     * @private
     */
    #evaluateTest() {
        let evalString = this.#testExpression;
        for (const pattern of this.#patterns) {
            evalString = evalString.replace(pattern, this.#interpolator.resolve(pattern));
        }
        if (eval(evalString)) {
            this.#show();
        } else this.#hide();
    }

    /**
     * @private
     */
    #show() {
        this._getSlot(RlgIf.CONTENT_SLOT_NAME).style.display = "block";
    }

    /**
     * @private
     */
    #hide() {
        this._getSlot(RlgIf.CONTENT_SLOT_NAME).style.display = "none";
    }
}