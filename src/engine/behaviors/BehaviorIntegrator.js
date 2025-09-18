import { Behavior } from "./Behavior.js";

class BehaviorIntegrator {
    /**
     * @typedef BehaviorConfig
     * @property {string} name
     * @property {typeof Behavior} class
     */
    /**
     * @param {Object} target
     * @param {BehaviorConfig} behaviorConfig 
     */
    integrate(target, behaviorConfig) {
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
     * @param {any} cls
     * @returns {boolean} 
     */
    isBehavior(cls) {
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

export const Behaviors = new BehaviorIntegrator();