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
    - [x] ObservableObject
    - [x] ObservableValue (common observability abstraction)
    - [ ] Make obervations automatically recursive on array and JSON properties
    - [ ] Binding
    - [ ] Binding parsers
- [ ] refactor and integrate the `RS_WCL` components that could come handy
- [ ] create some base Behaviors for the components


## <span style="color:#4A2">test-app</span>

In order to test multiple use cases, I plan to create a crude HTML builder that could become more and more complex in the end.
