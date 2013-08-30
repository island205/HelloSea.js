(function () {
    var Tea = window.Tea = {}

    var modules = Tea.__modules = {}
    var dependencies = Tea.__dependencies = {}
    var syncCallbacks = Tea.__syncCallbacks = []

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
        var i, len, dependencie;
    Module.prototype.syncDependencies = function (callback) {

    }

    function require(id) {
        var module = modules[id]
        if (module.exports) {
            return module.exports
        } else {
            return module.exports = Tea.__taste(module.factory)
    Tea.__infuse = function (id, factory) {
        var module = {
            id: id,
            factory: factory
        }
        return modules[id] = module
    }

    Tea.__taste = function (factory) {
        var module = {}
    }

    Tea.__taste = function (module) {
        var exports = module.exports = {}
        factory(require, exports, module)
        return module.exports
        registerDependencies(id, dependencies)
        sync(dependencies, function () {
            dependenciesSynced(module)
        })
        var module = Tea.__infuse(id, factory)
    Tea.infuse = function (id, dependencies, factory) {
        var module = new Module(id, factory, dependencies)
        sync(dependencies, function () {
            Tea.__taste(factory)
        })
        return modules[id] = module

    /*
     * Sync的标准是，模块从服务端加载下来，并且被infuse好
     *
     * */
    function sync(dependencies, callback) { 
        var i, len, dependencie, dependenciesToSync = []
        for(i = 0, len = dependencies.length; i < len; i++) {
            dependencie = dependencies[i]
            if (!modules[dependencie]) {
                dependenciesToSync.push(dependencie)
                loadScript(dependencie)
            }
        }
        syncCallbacks.push([callback, dependenciesToSync])
    }

    function registerDependencies(id, dependencies) {
    }

    function dependenciesSynced(module) {
    
    }


        module.syncDependencies(function () {
            Tea.__taste(module)
        })
    }
})()

