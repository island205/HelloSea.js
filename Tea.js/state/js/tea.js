(function () {
    var Tea = window.Tea = {}

    var modules = Tea.__modules = {}

    function Module() {}

    var STATUS = Module.STATUS = {
        FETCHING: 1,
        SAVED: 2,
        LOADING: 3,
        LOADED: 4,
        EXECUTING: 5,
        EXECUTED: 6
    }

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
    State.prototype.__addTrigger = function (trigger) {
        this.triggers.push(trigger)
        this.trigger()
    }
    State.prototype.removeTrigger = function (condition, trigger) {
        var i, len, _trigger, triggers = this.triggers,
        index = - 1
        for (i = 0, len = triggers.length; i < len; i++) {
            _trigger = triggers[i]
            if (_trigger.condition === condition && (_trigger.trigger === trigger || _trigger.trigger.originTrigger === trigger)) {
                index = i
                break
            }
        }
        if (index !== - 1) {
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
        index = - 1
        for (i = 0, len = triggers.length; i < len; i++) {
            _trigger = triggers[i]
            if (_trigger.condition === condition && (_trigger.trigger === trigger || _trigger.trigger.originTrigger === trigger)) {
                index = i
                break
            }
        }
        if (index !== - 1) {
            triggers.splice(index, 1)
        }

    }
    State.trigger = function () {
        var triggers = this.triggers.slice(),
        trigger,
        triggable = true
        var i, len, j, count
        for (i = 0, len = triggers.length; i < len; i++) {
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

    Tea.State = State
    Tea.Module = Module

    function require(id) {
        var module = modules[id]
        if (module.exports) {
            return module.exports
        } else {
            return module.exports = Tea.taste(module.factory)
        }
    }

    Tea.infuse = function (id, factory) {
        var module = {
            id: id,
            factory: factory
        }
        modules[id] = module
    }

    Tea.taste = function (factory) {
        var module = {}
        var exports = module.exports = {}
        factory(require, exports, module)
        return module.exports
    }
})()

