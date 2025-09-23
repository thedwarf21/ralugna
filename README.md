# ralugna
A vanilla lightweight webcomponents-oriented JS library (work in progress)

## History

In 2020 january, I started building a web components library. It took me about 3 month to build the RS_WCL (see my other public repos).

But I did quick, because I was spending more time searching how to technically make it work as I intended it to, than to think about its code design.

Since this time, javascript evolved a lot... so as I did.

This is why I decided to build this library again, with a better code design, getting deeper into the concepts, and using more what JS, HTML and CSS provide nowadays.

I hope you will enjoy dicovering it, as much as I did thinking and writing it.

# Binding and ViewModel

Bidirectional binding implies **both DOM observation and data observation**.

JavaScript does **not natively support observation of mutations** on arrays or plain objects.

The `ralugna` library provides tools to solve this limitation through its internal classes.

To ensure observability across an entire nested data structure, you can use the `ViewModel` class.

---

## `Binding`

The `Binding` class is responsible for **linking properties from an `ObservableObject` to DOM elements**, enabling **automatic synchronization** in both directions when needed.

It listens to changes in the observed model and updates the DOM accordingly. It can also update the model when the user interacts with the DOM, via DOM events.

### Example

```js
const vm = new ViewModel({ user: "", password: "" });
const credentialsBinding = new Binding(vm)
    .bind("user", userInput, "value", "change")
    .bind("password", passwordInput, "value", "change");
```

A DOM element's attribute can also be unbound.

```js
credentialsBinding.unbind(userInput, "value");
```

# Web components

## `Composer`

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

## `BaseComponent`

This class is abstract. Its purpose is to encapsulate what all our web components will need : behaviors integration, slots, external CSS.

The CSS can be configured for each component's class, by overriding the `CSS_URL` static constant.

The behaviors can be configured for each component's class by setting a default value to the `#behavior` property.

# Roadmap

➡️ **Project roadmap and progress:** [See NOTES.md](./NOTES.md)
