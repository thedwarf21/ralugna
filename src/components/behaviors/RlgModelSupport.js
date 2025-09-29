import { Behavior } from "../../engine/behaviors/Behavior.js";
import { BindingParser } from "../../engine/binding/BindingParser.js";
import { Binding } from "../../engine/binding/Binding.js";

export class RlgModelSupport extends Behavior {
    /**
     * @typedef BindingConfig
     * @property {string} [attr]
     * @property {string} [event]
     * @property {function} [onModelValueChange]
     */
    /**
     * @readonly
     * @type {string}
     */
    static ATTR_NAME = "rlg-model";

    /**
     * @protected
     * @type {BindingParser}
     */
    _vmParser;

    /**
     * @protected
     * @type {any}
     */
    _pathTarget;

    /**
     * @protected
     * @type {BindingConfig}
     */
    _bindingConfig = {};

    /**
     * @protected
     * @type {Binding}
     */
    _binding;

    /**
     * @param {BindingParser} vmParser 
     */
    setVmParser(vmParser) {
        this._vmParser = vmParser;
    }

    /**
     * @param {BindingConfig} config 
     */
    setBindingConfig(config) {
        this._bindingConfig = config;
    }

    /**
     * @override
     * @param {ShadowRoot} root
     */
    onAttach(root) {
        const bindingPath = this._getBindingPath();
        const [ observable, property ] = this._vmParser.getAtPathForBinding(bindingPath);
        const config = this._bindingConfig;
        this._binding = new Binding(observable).bind(property, this, config.attr, config.event, config.onModelValueChange);
    }

    /**
     * @override
     */
    onDestroy() {
        this._binding.unbind(this, config.attr);
    }

    /**
     * @protected
     * @returns {string}
     */
    _getBindingPath() {
        const attrValue = this.getAttribute(RlgModelSupport.ATTR_NAME);
        if (!attrValue) {
            throw new Error(`RlgModelSupport: the "${RlgModelSupport.ATTR_NAME}" attribute shoud be set`);
        }
        return attrValue;
    }
}