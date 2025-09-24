class ContextProvider {
    #globals = new Map();

    /**
     * @param {string} key 
     * @param {any} value 
     */
    provide(key, value) {
        this.#globals.set(key, value);
    }

    injectOrThrow(key) {
        if (!this.#globals.has(key)) {
            throw new Error(`Missing context: ${key}`);
        }
        return this.#globals.get(key);
    }

    clear(key) {
        this.#globals.delete(key);
    }

    clearAll() {
        this.#globals.clear();
    }
}

export const ContextDispatcher = new ContextProvider();

/**
 * @type {Record<string, string>}
 */
export const SharedContexts = {
    viewModel: "ViewModel"
}