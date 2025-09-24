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

## Build a custom component

To build a new custom component, you should need to import the `BaseComponent` abstract class. 

Its purpose is to wrap what all our web components will need : behaviors integration, external CSS, and so on...

To create and use your component, you just have to configure it through the class delaration

```js
import { BaseComponent } from "../BaseComponent.js";

export class MyFancyComponent extends BaseComponent {

    static TAG_NAME = this._getFullTagName("fancy-stuff");

    static CSS_URL = "some/css/styles.css"; // this is optional, but you may want to configure an external CSS stylesheets

    constructor() {
        super();
        // whatever you want to do
    }

    connectedCallback() {
        // here, you can reach the ShadowRoot with `this.internalDom` or `this._shadowRoot`
    }
}
```

A component class has to be registered to be usable as a DOM element. So don't forget to put this line after your class delaration.

```js
BaseComponent.registerComponent(MyFancyComponent);
```

### Behaviors & composition

A behavior is a class inheriting from `Behavior` and declaring a reusable behavior and the needed properties to do so.

Example:

```js
import { Behavior } from "../../engine/behaviors/Behavior.js";

export class SlotsSupport extends Behavior {
    /**
     * @typedef SlotConfig
     * @property {string} name
     * @property {HTMLSlotElement} [element]
     */
    /**
     * @protected
     * @type {SlotConfig[]}
     */
    _slots = [];
    
    /**
     * @protected
     * @param {string} name
     * @returns {SlotConfig | undefined}
     */
    _getSlot(name) {
        const filteredSlots = this._slots.filter(elt => elt.name === name);
        return filteredSlots.length === 0 ? undefined : filteredSlots[0];
    }

    /**
     * @protected
     * @param {string[]} names 
     */
    _setSlots(names) {
        if (this._slots.length > 0) {
            throw new Error("SlotSupport: slots can only be configured once.");
        }
        for (const name of names) {
            this._slots.push({ name });
        }
    }

    /**
     * @override
     * @param {ShadowRoot} root
     */
    onAttach(root) {
        for (const slotConfig of this._slot) {
            const slotEl = document.createElement("slot");
            slotEl.setAttribute("name", slotConfig.name);
            root.appendChild(slotEl);
            slotConfig.element = slotEl;
        }
    }
}
```

---

Behaviors can be configured for each component's class by setting the `_behavior` property with a `BehaviorConfigs` list, and implementing the `_configureBehaviors()` configuration hook.

Example:

```js
constructor() {
    super();
    this._behaviors = [{ class: SlotsSupport, name: "$slots" }]; // this will integrate the behavior to the component
}

/**
 * @override
 */
_configureBehaviors() {
    this._setSlots(mySlotsNamesList);  // this will configure the `SlotsSupport` behavior through a method it provides, before its onAttach method gets triggered
}
```

# Roadmap

➡️ **Project roadmap and progress:** [See NOTES.md](./NOTES.md)
