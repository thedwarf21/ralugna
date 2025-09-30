# ralugna
A vanilla lightweight MVVM webcomponents-oriented JS library (work in progress)

**Project in active development — Not yet production-ready**

Core architecture is nearly complete (bindings, components, behaviors).
Once context support is finalized, a full demo app will be built and documented.

If you're curious, feel free to explore — but expect breaking changes for now.

## Documentation index

- [History](#history)
- [Binding and ViewModel](#binding-and-viewmodel)
- [Web components](#web-components)
    - [Available Components](#available-components)
        - [`<rlg-if>`](#the-conditional-display)
        - [`<rlg-bind>`](#the-unary-binding-wrapper)
        - [`<rlg-for>`](#the-loop-component)
    - [Custom Components](#build-a-custom-component)
        - [Behaviors](#behaviors--composition)
- [Roadmap](#roadmap)

# History

In 2020 january, I started building a web components library called **RS_WCL** (see my other public repos).
It was a fast-paced technical challenge rather than a long-term project.

Since then, both JavaScript and my own approach to development have evolved significantly.

This is why I decided to rebuild the library from scratch — with cleaner design, deeper concepts, and a modern take on what JS, HTML and CSS have to offer.

I hope you'll enjoy exploring it as much as I enjoyed crafting it.

---

# Binding and ViewModel

Bidirectional binding can imply **both DOM observation and data observation**.

JavaScript does **not natively support observation of mutations** on arrays or plain objects.

The `ralugna` library provides tools to solve this limitation through its internal classes.

To ensure observability across an entire nested data structure, you can use the `ViewModel` class.

The `ralugna` library provides **tools and web components abstracting all of the binding mechanics**. The only point you should keep in mind, is that you may need a `ViewModel` instance in each of your templates controllers.

Example:

```js
import { ViewModel } from 'src/engine/observables/ViewModel.js';

const user = new ViewModel({
  name: 'Alice',
  age: 23,
  todos: [...]
});
```

---

# Web components

## Available components

`ralugna` provides several base utils components, to help you in templating your pages and page fragments.

### The conditional display

This component provides a way to **dynamicaly show / hide some parts** of the template, depending on a **condition**.

It uses a `content` slot.

You can use it this way :

```html
<rlg-if test="{{ user.age }} >= 18 && {{ options.visible }}">
    <div slot="content"><!-- your content --></div>
</rlg-if>
```

Be careful about the syntax. You might want to write :

```html
<rlg-if test="{{ user.age >= 18 && options.visible }}"> //❌ invalid binding expression in the double brackets : it cannot be directly interpolated from the `ViewModel`
<rlg-if test="{{ user.age }} >= 18 && {{ options.visible }}"> //✅ the binding engine will see which expressions to observe and interpolate
```

but this syntax won't work. The **double brackets** should wrap each **observed expression**, for the library to be able to identify each of them them and register their observation.

The double brackets contents are dynamicaly **replaced by the actual value, before the test expression gets evaluated**. So, you could write something like :

```html
<rlg-if test="{{ user.name }}.toLowerCase().startsWith('h')">
```

---

### The unary binding wrapper

You probably may need to display a **dynamic content** into a paragraph, or a dynamic image, **that could be changed from your controller**.

This component can create **any DOM element you need**, and bind one of its attributes / properties to a `ViewModel` property.

```html
Hello <rlg-bind tag-name="span" attr="innerText" rlg-model="user.name"></rlg-bind> !
<!-- or -->
<rlg-bind tag-name="img" attr="src" rlg-model="product.pictureUrl"></rlg-bind>
<!-- or anything you would need... -->
```

---

### The loop component

Displaying a template for **each element of an array or each property of an object** can be very useful indeed. And it can be even more useful if the displayed items automaticaly updates when the array or the object you display, mutates.

This is what provides this component. Its internal slot's name is `pattern`

```html
<rlg-for each="item of user.todos">
    <div slot="pattern">
        <b>{{ item.planedBeginTime }}:</b> {{ item.description }}
    </div>
<rlg-for>
```

---

## Build a custom component

To build a new custom component, you should need to import the `BaseComponent` abstract class. 

Its purpose is to wrap what all our web components will need : behaviors integration, external CSS, and so on...

To create and use your component, you just have to configure it through the class delaration

```js
import { BaseComponent } from "../BaseComponent.js";

export class MyFancyComponent extends BaseComponent {

    static TAG_NAME = this._getFullTagName("fancy-stuff"); // this is neaded for the tag registration (see below)

    static CSS_URL = "some/css/styles.css"; // this is optional, but you may want to configure an external CSS stylesheets

    constructor() {
        super();
        // whatever you want to do
    }

    connectedCallback() {
        super.connectedCallback();
        // here, you can reach the ShadowRoot with `this.internalDom` or `this._shadowRoot`
        // keep in mind this callback is called each time your component is attached to the DOM
    }
}

BaseComponent.registerComponent(MyFancyComponent); // a component class has to be registered to become a usable HTML element
```

---

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
    this._setSlots(mySlotsNamesList);  // this will configure the `SlotsSupport` behavior through a method it provides, before its `onAttach` method gets triggered
}
```

# Roadmap

➡️ **Project roadmap and progress:** [See NOTES.md](./NOTES.md)
