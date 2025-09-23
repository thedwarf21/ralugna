export class AbstractClassError extends Error {
    constructor(className) {
        super(`"${className}" is abstract and cannot be instanciated directly`);
        this.name = "AbstractClassError";
    }
}