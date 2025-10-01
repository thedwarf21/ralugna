# Binding features

There are several points to consider in a DOM - VM binding context.

First, we will need to be able to allow the mutations detection from both the concerned element and the concerned VM fragment.

This section focuses on the components' concerns. To understand how the VM observation works, please have a look to :

➡️ **How the ViewModel object works:** [See observables.md](../observables/observables.md)

## `Binding`

A `Binding` object targets an `ObservableObject` (mostly from a `ViewModel` object, but this point is not mandatory).

Once created, a Binding object allows you to configure automated syncs between this `ObservableObject` and several DOM elements.

The sync execution is then automaticaly triggered when necessary, depending on what has been given through the configuration.

A sync can be unbound at anytime calling the `unbind(element, attr)` method.

**Warning:** don't forget to `destroy` your `Binding` objects when the owner object is destroyed, to prevent memory leaks.

### Configuration format

```js
/**
 * @typedef BindingConfig
 * @property {string} key - the property to be observed, in the targeted `ObservableObject`
 * @property {HTMLElement} element - the DOM element to be sync
 * @property {string} attr - the element's attribute/property to be sync
 * @property {string} [event] - the element's event that should trigger a sync (if you want one) : this can be a custom event
 * @property {function} [onModelValueChange] - an optional sync hook : it receives the new value as a parameter
 */
```

## `BindingParser`

A `BindingParser` object targets a `ViewModel` and allow extracting data from it, through a litteral path string.

Example:

```js
const vm = new ViewModel(
    {
        name: "Alice",
        todos: [{
            title: "Buy milk",
            priority: 1
        }, {
            title: "Walk dog",
            priority: 1
        }]
    }
);

const vmParser = new BindingParser(vm);
```

The `getAtPath(path)` method returns a `BindingParserResult` object :

```js
/**
 * @typedef BindingParserResult
 * @property {any} value - the actual value at this path
 * @property {boolean} observable - allow you to know if this `value` refers to an `ObservableValue` object
 */
```

The `getAtPathForBinding(path)` method extracts the target's parent and property name, which is useful if you want to create a `Binding`.

usage:

```js
// this example is based on the example above
const [observableObject, targetProperty] = vmParser.getAtPathForBinding("name.todos[0].title");
// `observableObject` now references the `ObserbaleObject` observing `{ title: "Buy milk", priority: 1 }`
// `targetProperty` is now "title"
```

## `Interpolator`

An `Interpolator` object uses a `BindingParser` object to translate **double brackets wrapped litteral path strings**.

As it is an overlayer of the `BindingParser`, its concerns are asame :

- resolving patterns in a string (eg. translate `{{name.todos[0].title}}` by `"Buy milk"`)
- extracting data from patterns in a binding purpose (eg. translate `{{name.todos[0].title}}` by the relied `[observableObject, targetProperty]`)

usage:

```js
const vm = new ViewModel(
    {
        name: "Alice",
        todos: [{
            title: "Buy milk",
            priority: 1
        }, {
            title: "Walk dog",
            priority: 1
        }]
    }
);

const vmParser = new BindingParser(vm);
const interpolator = new Interpolator(vmParser);

console.log(interpolator.resolve("I have to {{ name.todos[0].title }} and {{name.todos[1].title}}")); //--> "I have to Buy milk and Walk dog"
console.log(interpolator.getBindingDataFrom("{{ name.todos[0].title }}")); //--> [ <the ObservableObject at name.todos[0]>, "title" ]
```

## Summary

| Class              | Purpose                                                              |
| ------------------ | -------------------------------------------------------------------- |
| `Binding`          | Configure DOM - VM automated syncs                                   |
| `BindingParser`    | Reading and exploiting litteral string paths                         |
| `Interpolator`     | Reading and exploiting double brackets wrapped litteral string paths |

[Back to README.md](../../../README.md#binding-and-viewmodel)