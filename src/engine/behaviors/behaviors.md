# `BevahiorIntegrator`

The `BevahiorIntegrator` object integrates behaviors to another object.

These behaviors can be declared implementing a dedicated class inheriting from `Behavior`.

Its `integrateAll` method needs to be sent a `BehaviorConfig` list :

```js
/**
 * @typedef BehaviorConfig
 * @property {string} name - will be used to name the property holding the behavior's object in the host object
 * @property {typeof Behavior} class - the behavior's class
 */
```

The integrated behaviors' references are stored into the target object. Then **each property and method from the behavior, gets directly linked to the target object**.

For example, if a component uses the `SlotsSupport` behavior, it will get a `_slots` property referencing the `SlotsSupport` behavior object's `_slots` property, as well as the `_getSlot(name)` method and the `_setSlots(names)` configuration method.

It's great for this integration to be **transparent and natural**, but **be careful your behaviors' methods and properties names not to collide**.

## Behaviors' lifecyle

The `BevahiorIntegrator`, automaticaly calls several lifecycle hooks.

### Components hooks

The `BaseComponent` abstract class, integrates uses a `BevahiorIntegrator`, to allow custom components to integrate and configure internal behaviors.

Using behaviors, a component becomes responsible of their configuration.

It has to override the `_configureBehaviors()` hook, and call its embeded behaviors' configuration methods, so that they can work fine.

### Behavior hooks

These should be implemented, direclty in the behavior's class :

- `onAttach(root)` : is automaticaly called right after the behavior's configuration. `root` is the component's internal DOM (`ShadowRoot`).
- `destroy()` : is automaticaly called when the owner component gets disconnected from the DOM. Implement this to prevent memory leaks, depending on what you behavior needs to work (listeners, observers, etc...)

[Back to README.md](../../../README.md#behaviors--composition)
