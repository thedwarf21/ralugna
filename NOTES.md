# Project structure

* `/src` : contains the library itself
* `/test-app` : contains a test project using the library. This will be a good way to challenge the library's ergonomy.

---

# Currently working on

What I plan to do in the future days, with detailed subtasks for the in-progress tasks.

The new needs will come for "ralunga" during the "test-app" developpement.

## ralugna

- [ ] refactor and integrate the `RS_WCL` components that could come handy
    - [ ] integrate `<rlg-for each="internalName of/in path[2].the.property[2].bind"></rlg-for>` **[SP: 3]**
        - [ ] use a slot for repeated content (display: none on the slot + cloneNode to generate the shadow DOM content dynamicaly)
        - [ ] must test the `each` attribute's consistence 
        - [ ] nested `<rlg-for>` must be able to reference the parent `<rlg-for>` internal name from the `each` expression
    - [ ] integrate `<rlg-if condition="booleanExpression"></rlg-if>` **[SP: 1]**
- [ ] create some base Behaviors for the components

## test-app

In order to test multiple use cases, I plan to create a crude HTML builder that could become more and more complex in the end.

---

# Sprints & Backlog

## Legend

🧲 chore - internal logic, tooling, or non-visible feature

🧩 showable feature - visible behavior, usable in test-app*

🐛 bug fix

🔧 refactoring

🧾 documentation

---

## Sprint 1 (17/09 → 23/09)

- [x] 🧲 **[lib]** Integrate a small objects composition engine **[SP: 2]**
- [x] 🧲 **[lib]** Create an abstract base component **[SP: 1]**
- [x] 🧲 **[lib]** `ObservableValue` (common observability abstraction) **[SP: 1]**
- [x] 🧲 **[lib]** `ObservableArray` **[SP: 1]**
- [x] 🧲 **[lib]** `ObservableObject` **[SP: 1]**
- [x] 🧲 **[lib]** `ViewModel` → a class that abstracts a recursive observability through `ObservableArray` and `ObservableObject`, to make binding simple **[SP: 2]**
- [x] 🧲 **[lib]** `Binding` **[SP: 1]**
- [x] 🧲 **[lib]** `BindingParser` **[SP: 1]**
- [x] 🧾 **[lib]** Documenting code and planed progression **[SP: 1]**

---

## Sprint 2 (24/09 → TBD)

- [ ] 🧲 **[lib]** refactor and integrate the `RS_WCL` components that could come handy (the if and for, in helper.js should) **[SP: 4]**
- [ ] 🧩 **[test-app]** create a static default page using an HTML template demonstrating ralugna's binding mechanics **[SP: 2]**
- [ ] 🧲 **[lib]** create a Canvas component, to use it as a display container **[SP: 2]**

---

## Sprint 3 (TBD)

- [ ] 🧩 **[test-app]** create a components gallery page-fragment **[SP: 2]**
- [ ] 🧩 **[test-app]** rebuild the main page to include the components gallery and an edition canvas **[SP: 1]**
- [ ] 🧲 **[lib]** create a drag and drop controller **[SP: 1]**
- [ ] 🧩 **[test-app]** use the drag and drop controller to append a component to the canvas by dragging it from the components gallery **[SP: 1]**
- [ ] 🧲 **[lib]** create a selection controller **[SP: 2]**
- [ ] 🧲 **[lib]** create a selection customizable widget component (could accept later: resizable, movable, ...) **[SP: 1]**

---

## Backlog

- [ ] 🧩 **[test-app]** use the selection controller and display the selection **[SP: 1]**
- [ ] 🧲🧩 **[lib]** implement move and resize selection widgets features **[SP: 2]**