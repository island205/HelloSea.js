## 自己实现一个模块加载器——bodule.js

> shout up, show me the code!

要想真正地了解一个加载器是如何工作的，就是自己实现一个！让我们来一步一步地实现一个名为bodule.js的模块加载器。

### 约定

一个模块系统，必然有一些约定，下面是bodule.js的规范。

#### 模块

bodule.js的模块由以下几个概念组成：

- url，一个url地址对应一个模块；
- meta module：如下形式为一个meta module：

**define(id, dependancies?, factory)**

id必须为完整的url，dependancies如果没有依赖，则可以省略，factory包含两种形式：

Function：function(require, [exports,] [module])：

非Function：直接作为该meta模块的exports。

```javascript
define('http://bodule.org/island205/venus/1.0.0/venus', ['./vango'], function (require, exports, module) {
  //CommonJS
})

// or 


define('http://bodule.org/island205/venus/1.0.0/conststring', 'bodule.js')

// even or

define('http://bodule.org/island205/venus/1.0.0/undefined', undefined)

```

dependancies中的字符串以及CommonJS中的require的参数，必须为url、相对路径或顶级路径的解析依赖于前面的id。

- 一个模块文件包含一个或多个meta module，但是，在该模块文件中，必须包含一个该模块文件url作为id的meta module，例如：

`http://bodule.org/island205/venus/1.0.0/venus.js` 对应的模块文件内容为：


```javascript
define('http://bodule.org/island205/venus/1.0.0/venus', ['./vango'], function (require, exports, module) {
  //CommonJS for venus
})

define('http://bodule.org/venus/1.0.0/vango', [], function (require, exports, module) {
  //CommonJS for vango
})
```

该模块文件包含两个meta module，而第一个是必须的。但这两个meta模块的顺序不做要求。

#### 简化

为了简化代码，针对

```javascript
define('http://bodule.org/island205/venus/1.0.0/venus', ['./vango'], function (require, exports, module) {
  //CommonJS for venus
})
```
这样的代码我们可以将其简化为：

```javascript
define('./venus/1.0.0/venus', ['./vango'], function (require, exports, module) {
  //CommonJS for venus
})
```

或者：


```javascript
define('/venus/1.0.0/venus', ['./vango'], function (require, exports, module) {
  //CommonJS for venus
})
```

这样的形式，然相对路径或者顶级路径必须要由一个绝对路径可参照，在bodule.js中，这个绝对路径来自于当前页面的url地址，或者使用bodule.package进行配置。

#### bodule cloud

在node中，可以使用require('underscore')来引用node_modules中的模块，作为bodule.js的目标，将commonjs桥接到浏览器端来使用，所以允许使用类似的写法，这种模块我们把它称作bodule模块，resovle后映射到`http://bodule.org/underscore/stable`，bodule.js会在bodule.org上提供一个云服务，来支持你从这里加载这些bodule模块。

如果你想使用自己的bodule服务器，可以使用bodule.package来配置boduleServer。

#### npm

npm非常流行，bodule.js将其作为模块的源。我们采取与npm包一致的策略。典型的npm的package.json为（以underscore为例）：

```json
{
  "name"          : "underscore",
  "description"   : "JavaScript's functional programming helper library.",
  "homepage"      : "http://underscorejs.org",
  "keywords"      : ["util", "functional", "server", "client", "browser"],
  "author"        : "Jeremy Ashkenas <jeremy@documentcloud.org>",
  "repository"    : {"type": "git", "url": "git://github.com/jashkenas/underscore.git"},
  "main"          : "underscore.js",
  "version"       : "1.5.1",
  "devDependencies": {
    "phantomjs": "1.9.0-1"
  },
  "scripts": {
    "test": "phantomjs test/vendor/runner.js test/index.html?noglobals=true"
  },
  "licenses": [
    {
      "type": "MIT",
      "url": "https://raw.github.com/jashkenas/underscore/master/LICENSE"
    }
  ],
  "files"         : ["underscore.js", "LICENSE"]
}
```

bodule.js将会使用工具将其转化为bodule模块，最终会以`http://bodule.org/underscore/1.5.1`这样的地址地提供出来。注意：该地址会根据package.json中的main，变为`http://bodule.org/underscore/1.5.1/underscore`。


### bodule.js的API

#### .use

##### .use(id)

在页面中使用一个模块，相当于`node id.js`。

##### .use(dependancies, factory)

在页面上定义一个即时的模块，该模块依赖于dependancies，并use该模块。等价于：

```javascript
define('a-random-id', dependencies, factory)
Bodule.use('a-random-id')
```

.use比较简单的例子，[simplest.html](https://github.com/Bodule/bodule-engine/blob/master/test/simplest.html#L10)：

```html
<script type="text/javascript">
    Bodule.use('./a.js')
    Bodule.use('/b.js')
    Bodule.use(['./c.js', './d'], function (require, exports, module) {
        var c = require('./c.js')
        var d = require('./d')
        console.log(c + d)
    })
    Bodule.use(['./e'], function (require) {
        var e = require('./e')
        console.log(e)
    })
</script>
```

#### define

##### define(id, dependencies, factory)

定义一个meta module；

##### define(id, anythingNotFunction)

定义一个meta module，该模块的exports即为anythingNotFunction；

几个例子：[d.js](https://github.com/Bodule/bodule-engine/blob/master/test/d.js)，[e.js](https://github.com/Bodule/bodule-engine/blob/master/test/e.js)，[backbone.js](https://github.com/Bodule/bodule-engine/blob/master/bodule.org/bower_components/backbone/1.0.0/backbone.js)

#### .package(config)

配置模块和bodule模块的位置，还可以配置依赖的bodule模块的版本号。

```javascript
Bodule.package({
  cwd: 'http://bodule.org:8080/',
  path: '/bodule.org/',
  bodule_modules:{
    cwd: 'http://bodule.org:3000/',
    path: '/bower_components/',
    dependencies: {
      'backbone': '1.0.0'
    }
  }
})
```
完整的例子可以参考[bodule.org.html](https://github.com/Bodule/bodule-engine/blob/master/test/bodule.org/bodule.org.html)。

#### Tea.js

鉴于上面的解释，我们先来实现一个简单运行时——Tea.js。迫不及待了吧，让我们开始吧！

Tea.js提供两个接口：

1. infuse（沏茶）：用来祭出一个模块；
2. taste（品茶）：运来执行一个模块；
3. require、exports和module来组织模块。

参考CMD，我们来定一下TMD。

> 实际上并没有“他妈的”这种标准。

```javascript
// 定一个TMD的模块
Tea.infuse(id?, dependencies?, factory)

// 使用一个TMD的模块
Tea.taste(dependencies?, factory)
```

##### 运行时（runtime）

我们从最简单的运行时开始。

首先假定我们的所需要的模块都是提前定义好，并加载好的，于是API可以简化为：

```javascript
// 定一个TMD的模块
Tea.infuse(id, factory)

// 使用一个TMD的模块
Tea.taste(factory)
```

测试用例：

```javascript
// File: greet.js
Tea.infuse('greet', function (require, exports) {
    function helloPython() {
        document.write("Hello,Python")
    }
    function helloJavaScript() {
        document.write("Hello,JavaScript")
    }
    exports.helloPython = helloPython
    exports.helloJavaScript = helloJavaScript
})


Tea.taste(function (require) {
    var Greet = require('greet')
    Greet.helloJavaScript()
})
```

实现代码：

```javascript
(function () {
    var Tea = window.Tea = {}

    var modules = Tea.__modules = {}

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
        factory.call(require, exports, module)
        return module.exports
    }
})()
```
示例在[这里](https://github.com/Bodule/HelloSea.js/tree/master/Tea.js/runtime)可以找到。

这段代码的关键在两个地方：

- Tea.taste这个接口，执行一个模块（factory），相当于运行`node somefile.js`，并返回这个模块的接口。我们定义了一个空对象module，有一个exports的空对象，通过这两个对象注入到factory中，获取模块的接口。

> 注意这里的细节：由于返回值是module.exports，因此如果在factory中直接覆盖exports来暴露接口是不可取的。如果真要那么做，就需要使用module.exports来实现，这与Sea.js中的规定一致。

```javascript
var module = {}
var exports = module.exports = {}
factory.call(require, exports, module)
return module.exports
```
- require函数，作为factory的第一个注入参数，为模块提供了访问外部模块的接口。根据id获取对应模块的exports（即接口），如果该模块还没有执行过，就使用Tea.taste执行该模块获取其exports。

再次强调，在所有模块的依赖都分析好，按顺序加载好，这个简单的运行时就可以运作起一个模块系统了。但现实并不是如此，模块依赖一开始并不知道（所依赖的模块只有在运行时才知道依赖情况），也没有加载好，该怎么办呢？

##### 加载期（module loading）

如果模块依赖并不是提前加载好，代码就变成了这样子：

```javascript
Tea.taste(function (require) {
    var Greet = require('greet')
    Greet.helloJavaScript()
})
```

报错了有没有？require('greet')，在modules中并没有这个greet模块。

怎么办，我们必须修正下接口：

```javascript
// 定一个TMD的模块
Tea.infuse(id, dependencies, factory)

// 使用一个TMD的模块
Tea.taste(dependencies, factory)
```

增加一个dependencies参数，指明factory所依赖的模块，只有将这些模块从服务端同步下来之后，才执行这个factory。加入异步了问题，就复杂了起来，我们先来看清一下形式。

##### 状态管理

加载期的复杂性完全在于状态的管理和转移，因此我们需要一个状态管理模块，该模块有两个核心功能：

1. 承载模块状态的转移
2. 支持单个或多个状态实例的联合状态触发器

```javascript
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
```

State的用法如下：

```javascript
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
```

既然有了State，下一步就可以来写模块了。

##### 模块

有了State，我们的模块就相对简单了。只有两个方法loadDependencies和fetch，用来执行两个动作。

```javascript
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
```

State和Module组合在一起，就可以完成整个加载期了。


修改之前的接口，保留基础的`__infuse`和`__taste`，用于执行期；重新编写infuse和taste接口：

```javascript
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
```

有了State，什么时候开始执行期，添加一个触发器（trigger）即可。

最后还需要一个东西，就是真实的脚本加载函数：

```javascript
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
```

好了，最最基础的框架已经完成，看看我们还缺少什么？
