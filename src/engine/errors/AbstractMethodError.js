export class AbstractMethodError extends Error {
    constructor(methodName) {
        super(`"${methodName}" must be implemented by subclass`);
    }
}