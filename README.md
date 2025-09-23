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
The `ralugna` library provides tools to solve this limitation through `ObservableArray` and `ObservableObject`.

To ensure observability across an entire nested data structure, you can use the `ViewModel` class.

---

## `ObservableValue`

> **Abstract base class**

Both `ObservableArray` and `ObservableObject` inherit from `ObservableValue`.

It handles:
- Observer registration
- Mutation notifications
- A common interface (`getValue()` / `setValue()`)

Each observer registers with a callback, which is triggered upon any mutation.

---

## `ObservableArray`

An `ObservableArray` wraps a native array and exposes common **mutating methods**:

- `push`, `pop`, `shift`, `unshift`
- `splice`, `reverse`, `sort`
- Plus a custom `clear()` method

These operations trigger notifications to all registered observers.

### Reading the array

Use `getValue()` to get a **copy** of the internal array:

```js
const copy = myObservableArray.getValue();
console.log("Length:", copy.length);
```

### Replacing the array

Use `setValue()` to replace the entire array:

```js
myObservableArray.setValue([1, 2, 3]);
```

### Accessing individual elements

You can **read or update array elements using standard bracket notation**:

```js
const firstItem = myObservableArray[0];
myObservableArray[2] = someValue;
myObservableArray.push(someOtherValue);
```

---

## `ObservableObject`

An `ObservableObject` wraps a plain JavaScript object.

You can use it as if it were a regular object:

* Read, write, add, or delete properties

* Every mutation triggers a notification

This provides seamless reactivity while preserving native syntax:

```js
const person = new ObservableObject({ name: "Alice" });

console.log(person.name);     // "Alice"
person.age = 30;              // triggers notification
delete person.name;           // triggers notification
```

---

## `ViewModel`

The `ViewModel` class recursively traverses any data structure and replaces:

* Arrays → `ObservableArray`

* Plain objects → `ObservableObject`

This ensures that **every nested part of your data** becomes observable.

This makes it possible to bind **any property at any depth** to the DOM using the `Binding` class.

### Example

```js
const data = {
  name: "Alice",
  todos: [{
    title: "Buy milk",
    priority: 1
  }, {
    title: "Walk dog",
    priority: 1
  }]
};

const vm = new ViewModel(data);

// Now: vm.name is observable, vm.todos is an ObservableArray, and each todo item is observable
// each mutated value is automaticaly turned into a observable one if necessary
vm.todos.push({ title: "Read a book", priority: 5 }); // the item becomes an ObservableObject
vm.name = "Bob"; // this value will stay as-is
```

## Summary

| Class              | Purpose                                        |
| ------------------ | ---------------------------------------------- |
| `ObservableValue`  | Abstract class for observers and notifications |
| `ObservableArray`  | Observes mutations on arrays                   |
| `ObservableObject` | Observes mutations on plain objects            |
| `ViewModel`        | Makes a full data structure observable         |

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
