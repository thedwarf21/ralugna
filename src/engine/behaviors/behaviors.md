# `BevahiorIntegrator`

This importable object integrates behaviors to another object.

This behaviors can be declared implementing a dedicated class inheriting from `Behavior`.

Its `integrateAll` method needs to be sent a `BehaviorConfig` list :

```js
/**
 * @typedef BehaviorConfig
 * @property {string} name - will be used to name the property holding the behavior's object in the host object
 * @property {typeof Behavior} class - the behavior's class
 */
```

Don't forget to call the `destroyAll` method, when your host object gets destroyed, to prevent memory leaks.