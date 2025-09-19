import { Behavior } from "./Behavior.js";

class BehaviorIntegrator {
    /**
     * @typedef BehaviorConfig
     * @property {string} name
     * @property {typeof Behavior} class
     */
    /**
     * @param {Object} target 
     * @param {BehaviorConfig[]} behaviorConfigs 
     * @returns {[integratedBehaviors: number, recievedBehaviors: number]}
     */
    integrateAll(target, behaviorConfigs) {
        const validConfigs = this.#checkBehaviors(behaviorConfigs);
        for (const config of validConfigs) {
            this.#integrate(target, config);
        }
        return [validConfigs, behaviorConfigs.length];
    }

    /**
     * @param {Object} target 
     * @param {BehaviorConfig[]} behaviorConfigs 
     */
    destroyAll(target, behaviorConfigs) {
        for (const config of behaviorConfigs) {
            target[config.name].destroy();
        }
    }

    /**
     * @private
     * @param {BehaviorConfig[]} behaviorConfigs
     * @returns {BehaviorConfig[]} 
     */
    #checkBehaviors(behaviorConfigs) {
        const keptConfig = [];
        for (const item of behaviorConfigs) {
            if (this.#checkBehaviorConfig(item, behaviorConfigs)) {
                keptConfig.push(item);
            }
        }
        return keptConfig;
    }

    /**
     * @private
     * @param {BehaviorConfig} config 
     * @param {BehaviorConfig[]} configsList
     * @returns {boolean}
     */
    #checkBehaviorConfig(config, configsList) {
        const currentName = config.name;
        const currentClass = config.class;
        const sameNamedItems = configsList.filter(elt => elt.name === currentName);
        const sameClassItems = configsList.filter(elt => elt.class === currentClass);
        if (sameNamedItems.length > 1) {
            console.warn(`The behavior named "${currentName}" appear several times in your config object => ignored.`);
            return false;
        }
        if (!currentClass || !this.#isBehavior(currentClass)) {
            console.warn(`The behavior named ${currentName} is not relied to a Behavior class => ignored.`);
            return false;
        }
        if (sameClassItems.length > 1) {
            console.warn(`The behavior class "${currentClass.constructor.name}" appear several times in your config object => ignored.`);
            return false;
        }
        return true;
    }
    
    /**
     * @private
     * @param {Object} target
     * @param {BehaviorConfig} behaviorConfig 
     */
    #integrate(target, behaviorConfig) {
        /** @type {Behavior} */
        const behaviorInstance = new behaviorConfig.class();
        const behaviorName = behaviorConfig.name;
        target[behaviorName] = behaviorInstance;
        const proto = Object.getPrototypeOf(behaviorInstance);
        const keys = [
            ...Object.getOwnPropertyNames(proto),   // methods
            ...Object.keys(behaviorInstance)        // properties
        ];
        for (const key of keys) {
            if (key === 'constructor') continue;
            if (key in target) {
                console.warn(`Property conflict during ${behaviorName} integration: ${key} has already been defined on the host object`, target);
                continue;
            }
            this.#bindBehaviorMember(target, behaviorInstance, key);
        }
    }

    /**
     * @private
     * @param {any} cls
     * @returns {boolean} 
     */
    #isBehavior(cls) {
        return typeof cls === "function" && Behavior.prototype.isPrototypeOf(cls.prototype);
    }

    /**
     * @private
     * @param {Object} target
     * @param {Behavior} behavior 
     * @param {string} key 
     */
    #bindBehaviorMember(target, behavior, key) {
        const value = behavior[key];
        if (typeof value === "function") {
            target[key] = value.bind(target);
        } else {
            Object.defineProperty(target, key, {
                get: () => behavior[key],
                set: (val)=> { behavior[key] = val; }
            });
        }
    }
}

export const Composer = new BehaviorIntegrator();