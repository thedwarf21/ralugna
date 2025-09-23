# Project structure

* `/src` : contains the library itself
* `/test-app` : contains a test project using the library. This will be a good way to challenge the library's ergonomy.

# Currently working on

What I plan to do in the future days, with detailed subtasks for the in-progress tasks.

The new needs will come for "ralunga" during the "test-app" developpement.

## ralugna

- [ ] refactor and integrate the `RS_WCL` components that could come handy
- [ ] create some base Behaviors for the components


## test-app

In order to test multiple use cases, I plan to create a crude HTML builder that could become more and more complex in the end.

# Sprints & Backlog

## Legend

🧲 chore - internal logic, tooling, or non-visible feature
🧩 showable feature - visible behavior, usable in test-app
🐛 bug fix
🔧 refactoring
🧾 documentation

## Sprint 1 (17/09 → 23/09)

- [x] 🧲 **[lib]** Integrate a small objects composition engine
- [x] 🧲 **[lib]** Create an abstract base component
- [x] 🧲 **[lib]** `ObservableValue` (common observability abstraction)
- [x] 🧲 **[lib]** `ObservableArray`
- [x] 🧲 **[lib]** `ObservableObject`
- [x] 🧲 **[lib]** `ViewModel` → a class that abstracts a recursive observability through `ObservableArray` and `ObservableObject`, to make binding simple
- [x] 🧲 **[lib]** `Binding`
- [x] 🧲 **[lib]** `BindingParser`
- [x] 🧾 **[lib]** Documenting code and planed progression

## Sprint 2 (24/09 → TBD)

- [ ] 🧲 **[lib]** refactor and integrate the `RS_WCL` components that could come handy (the if and for, in helper.js should)
- [ ] 🧩 **[test-app]** create a static default page using an HTML template demonstrating ralugna's binding mechanics
- [ ] 🧲 **[lib]** create a Canvas component, to use it as a display container

## Sprint 3 (TBD)

- [ ] 🧩 **[test-app]** create a components gallery page-fragment
- [ ] 🧩 **[test-app]** rebuild the main page to include the components gallery and an edition canvas
- [ ] 🧲 **[lib]** create a drag and drop controller
- [ ] 🧩 **[test-app]** use the drag and drop controller to append a component to the canvas by dragging it from the components gallery

## Backlog

- [ ] 🧲 **[lib]** create a selection controller
- [ ] 🧲 **[lib]** create a selection customizable widget component (could accept later: resizable, movable, ...)
- [ ] 🧩 **[test-app]** use the selection controller and display the selection
- [ ] 🧲🧩 **[lib]** implement move and resize selection widgets features