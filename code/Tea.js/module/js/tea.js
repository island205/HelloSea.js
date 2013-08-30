(function () {
    var Tea = window.Tea = {}

    var modules = Tea.__modules = {}

    var guid = (function () {
        var i = 0
        function guid() {
            return ++i
        }
        return guid
    })()

    var loadScript = (function () {
        var head = document.getElementsByTagName('head')[0]
        function loadScript(id) {
            var script = document.createElement('script')
            script.type = 'text/javascript'
            script.async = 'true'
            script.src = id + '.js'
            script.onload = function () {
                head.removeChild(script)
            }
            head.appendChild(script)
        }
        return loadScript
    })()

    function State() {
        this.state = 0
        this.triggers = []
    }
    State.prototype.to = function (state) {
        if (state > this.state) {
            this.state = state
            this.trigger()
        }
    }
    State.prototype.get = function () {
        return this.state
    }
    State.prototype.addTrigger = function (condition, trigger) {
        var once = function () {
            this.removeTrigger(condition, trigger)
            trigger()
        }.bind(this)
        once.originTrigger = trigger
        this.__addTrigger({
            condition: condition,
            trigger: once
        })
    }
    State.prototype.addAssociatedTrigger = function (states, condition, trigger) {
        State.addAssociatedTrigger(states, condition, trigger)
    }
    State.prototype.__addTrigger = function (trigger) {
        this.triggers.push(trigger)
        this.trigger()
    }
    State.prototype.removeTrigger = function (condition, trigger) {
        var i, len, _trigger, triggers = this.triggers,
        index = -1
        for (i = 0, len = triggers.length; i < len; i++) {
            _trigger = triggers[i]
            if (_trigger.condition === condition && (_trigger.trigger === trigger || _trigger.trigger.originTrigger === trigger)) {
                index = i
                break
            }
        }
        if (index !== -1) {
            triggers.splice(index, 1)
        }
    }
    State.prototype.trigger = function () {
        var triggers = this.triggers.slice(),
        trigger
        var i, len
        for (i = 0, len = triggers.length; i < len; i++) {
            trigger = triggers[i]
            if (trigger.condition.apply(this)) {
                trigger.trigger()
            }
        }
        State.trigger()
    }

    State.triggers = []
    State.addAssociatedTrigger = function (states, condition, trigger) {
        var once = function () {
            this.removeAssociatedTrigger(states, condition, trigger)
            trigger()
        }.bind(this)
        once.originTrigger = trigger
        this.__addAssociatedTrigger({
            states: states,
            condition: condition,
            trigger: once
        })

    }
    State.__addAssociatedTrigger = function (trigger) {
        this.triggers.push(trigger)
        this.trigger()
    }
    State.removeAssociatedTrigger = function (states, condition, trigger) {
        var i, len, _trigger, triggers = this.triggers,
        index = -1
        for (i = 0, len = triggers.length; i < len; i++) {
            _trigger = triggers[i]
            if (_trigger.condition === condition && (_trigger.trigger === trigger || _trigger.trigger.originTrigger === trigger)) {
                index = i
                break
            }
        }
        if (index !== -1) {
            triggers.splice(index, 1)
        }

    }
    State.trigger = function () {
        var triggers = this.triggers.slice(),
        trigger,
        triggable
        var i, len, j, count
        for (i = 0, len = triggers.length; i < len; i++) {
            triggable = true
            trigger = triggers[i]
            for (j = 0, count = trigger.states.length; j < count; j++) {
                if (!trigger.condition.apply(trigger.states[j])) {
                    triggable = false
                    break
                }
            }

            if (triggable) {
                trigger.trigger()
            }
        }
    }

    function Module(id, dependencies, factory) {
        this.id = id
        this.dependencies = dependencies || []
        this.factory = factory
        this.exports = null
        this.state = new State()
        this.state.module = this
    }

    var STATUS = Module.STATUS = {
        FETCHING: 1,
        SAVED: 2,
        LOADING: 3,
        LOADED: 4,
        EXECUTING: 5,
        EXECUTED: 6
    }

    Module.prototype.loadDependencies = function () {
        if (this.state.get() >= STATUS.LOADING) {
            return
        }
        this.state.to(STATUS.LOADING)

        var i, len, dependencieStates = [],
        dependencieModules = [],
        dependencies = this.dependencies,
        dependencie,
        module,
        state

        for (i = 0, len = dependencies.length; i < len; i++) {
            module = Tea.get(dependencies[i])
            dependencieModules.push(module)
            dependencieStates.push(module.state)
        }
        
        this.state.addAssociatedTrigger(dependencieStates, function () {
            return this.state >= STATUS.LOADED
        }, function () {
            this.state.to(STATUS.LOADED)
        }.bind(this))

        for (i = 0, len = dependencieModules.length; i < len; i++) {
            module = dependencieModules[i]
            state = module.state.get()
            if (state < STATUS.FETCHING) {
                module.fetch()
            } else if (state === STATUS.SAVED) {
                module.loadDependencies()
            }
        }
    }

    Module.prototype.fetch = function () {
        if (this.state.get() >= STATUS.FETCHING) {
            return
        }
        loadScript(this.id)
        this.state.to(STATUS.FETCHING)
    }

    function require(id) {
        var module = modules[id]
        if (module.exports) {
            return module.exports
        } else {
            return module.exports = Tea.__taste(module)
        }
    }
    Tea.get = function (id, dependencies, factory) {
        var module = modules[id]
        if (module) {
            module.dependencies = dependencies
            module.factory = factory
        } else {
            module = new Module(id, dependencies, factory)
        }
        return modules[id] = module
    }
    Tea.__infuse = function (id, dependencies, factory) {
        var module = this.get(id, dependencies, factory)
        module.state.to(STATUS.SAVED)
        module.loadDependencies()
        return module
    }
    Tea.__taste = function (module) {
        var exports = module.exports = {}
        module.factory(require, exports, module)
        return module.exports
    }
    Tea.infuse = function (id, dependencies, factory) {
        return this.__infuse(id, dependencies, factory)
    }
    Tea.taste = function (dependencies, factory) {
        var module = this.infuse('_taste_' + guid(), dependencies, factory)
        module.state.addTrigger(function () {
            if (this.state >= STATUS.LOADED) {
                Tea.__taste(module)
            }
        })
        module.loadDependencies()
    }
})()

