var State = Tea.State
var STATUS = Tea.Module.STATUS

var state1 = new State()
state1.addTrigger(function () {
    return this.state >= STATUS.LOADED
}, function () {
    console.log('module1 is loaded')
})

state2 = new State()
state2.addTrigger(function () {
    return this.state >= STATUS.LOADED
}, function () {
    console.log('module2 is loaded')
})
state3 = new State()
state3.addTrigger(function () {
    return this.state >= STATUS.FETCHING
}, function () {
    console.log('module3 is fetching')
})

State.addAssociatedTrigger([state1, state2], function () {
    return this.state >= STATUS.EXECUTED
}, function () {
    console.log('both module1 and module2 are executed')
})

State.addAssociatedTrigger([state1, state3], function () {
    return this.state >= STATUS.FETCHING
}, function () {
    console.log('module1 and module3 are both fetching')
})

State.addAssociatedTrigger([state1, state2, state3], function () {
    return this.state >= STATUS.EXECUTED
}, function () {
    console.log('module1 and module3 are both fetching')
})

setTimeout(function () {
    state1.to(STATUS.EXECUTED)
}, 10000)
setTimeout(function () {
    state2.to(STATUS.EXECUTED)
}, 15000)
state3.to(STATUS.FETCHING)
setTimeout(function () {
    state2.to(STATUS.LOADED)
}, 10000)
setTimeout(function () {
    state2.to(STATUS.FETCHING)
}, 5000)
setTimeout(function () {
    state3.to(STATUS.EXECUTED)
}, 1000)

