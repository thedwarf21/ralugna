# Observables

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