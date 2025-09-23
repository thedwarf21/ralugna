# <span style="color:#26B">Summary</span>

Project structure :

* `/src` : contains the library itself
* `/test-app` : contains a test project using the library. This will be a good way to challenge the library's ergonomy.

# <span style="color:#26B">Roadmaps</span>

What I plan to do in the future weeks.

The new needs will come for "ralunga" during the "test-app" developpement.

## <span style="color:#4A2">ralugna</span>

- [ ] refactor and integrate the live binding mechanics from `RS_WCL`
    - [x] ObservableArray
        - [x] Ensure native `Array` mutation methods availability, and notification triggering
        - [x] Make `myObservableArray[index]` syntax available
    - [x] ObservableObject
        - [x] Replace `set (key, value)` by a proxy access through `Object.defineProperty` on the `ObservableObject`
        - [x] Check that the object given to `set value` is a plain object
    - [x] ObservableValue (common observability abstraction)
    - [x] ViewModel → a class that abstracts a recursive obervability through `ObservableArray` and `ObservableObject`, to make binding simple
        - [x] recursive observation initialization
        - [x] keep the recursive observation during mutations, observing the view model entities' mutations
    - [x] Binding
    - [ ] BindingParser (in progress)
- [ ] refactor and integrate the `RS_WCL` components that could come handy
- [ ] create some base Behaviors for the components


## <span style="color:#4A2">test-app</span>

In order to test multiple use cases, I plan to create a crude HTML builder that could become more and more complex in the end.

# Summary

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
- [ ] 🧲 **[lib]** `BindingParser`
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