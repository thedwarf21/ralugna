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
    - [x] ViewModel -> a class that abstracts a recursive obervability through `ObservableArray` and `ObservableObject`, to make binding simple
        - [x] recursive observation initialization
        - [x] keep the recursive observation during mutations, observing the view model entities' mutations
    - [ ] Binding (in progress)
- [ ] refactor and integrate the `RS_WCL` components that could come handy
- [ ] create some base Behaviors for the components


## <span style="color:#4A2">test-app</span>

In order to test multiple use cases, I plan to create a crude HTML builder that could become more and more complex in the end.
