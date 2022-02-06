# Web Components System

## Requirements

1. [x] `workflows` html -> template -> dom insert
2. [x] `workflows`css import & tailwind css
3. [x] `class` GlobalStore
4. [x] `class` WCSBaseElement
    1. [x] lifecycle hook `callback fun`
        1. [x] onStart
        2. [x] onBeforeRender
        3. [x] onAfterRender
        4. [x] onUpdateState
    2. [x] reactive state management
    3. [x] connect to global store
    4. [x] receive props
    5. [x] `static` registerTag() method * custom define call
    6. [x] import other WCSBaseElement
    7. [x] `on:` event directive
5. [x] create `eslint-plugin-wcs`
6. [x] `class` RouterElement
    1. [x] single page(index.html) routing
    2. [x] take RouteMap type blueprint object as prop
    3. [x] `static` navigate(url)
    4. [x] `static` goBack()
    5. [x] `static` refresh()
7. [ ] command line tools
    1. [x] wcs create
