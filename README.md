# Web Components System

## Requirements

1. [ ] `workflows` html -> template -> dom insert
2. [ ] `workflows`css -> style -> dom insert
3. [ ] `class` GlobalStore
4. [ ] `class` WCBaseElement
   1. [ ] lifecycle hook `callback fun`
      1. [ ] onStart
      2. [ ] `internal` registerIfNot
      3. [ ] onBeforeInit
      4. [ ] `internal` init -> instantiate & insert to dom
      5. [ ] onAfterInit
      6. [ ] onUpdate
         * `prop` callback function
         * `prop` dependencies array
   2. [ ] reactive state management
   3. [ ] connect to global store
   4. [ ] receive props
   5. [ ] receive css & html
   6. [ ] `abstract` `static` register() method
      * custom define call


