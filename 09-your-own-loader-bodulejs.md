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

让我们开始吧！

### coffeescript

coffeescript是一门非常有趣的语言，敲起代码来很舒服，不会被JavaScript各种繁琐的细节所烦扰。所以我打算使用它来实现bodule.js。访问[coffeescript.org]，上面有简洁文档，如果你熟悉JavaScript，我相信你能很快掌握CoffeeScript的。

### commonjs运行时

从bodule的规范中，可以看出，它其实commonjs，或者说是commonjs wrapping的一个实现。因此，我们将直接使用commonjs的方式来组织我们的代码，你会发现，这样的代码非常清晰易读。

```coffeescript
# This is a **private** CommonJS runtime for `bodule.js`.

# `__modules` for store private module like `util`,`path`, and so on.
modules = {}

# `__require` is used for getting module's API: `exports` property.
require = (id)->
    module = modules[id]
    module.exports or module.exports = use [], module.factory

# Define a module, save module in `__modules`. use `id` to refer them.
define = (id, deps, factory)->
    modules[id] =
        id: id
        deps: deps
        factory:factory

# `__use` to start a CommonJS runtime, or get a module's exports.
use = (deps, factory)->
    module = {}
    exports = module.exports = {}

    # In factory `call`, `this` is global
    factory require, exports, module
    module.exports
```

上面这段代码是commonjs规范一种精简的表达，出自node项目中的module.js。module.js比这复杂多了，包含了多native module、读取、执行module文件、以及支持多种格式的module的事情。而我们上面这段代码就是commonjs最精简的表达，有了它，我们就可以使用common.js的方式来组织代码了。

> 注意，代码中的deps变量完全就是无用的，只是我觉得这样写的话，似乎更清晰一点。

```coffeescript
define 'add', [], (require, exports, module)->
    module.exports = (a, b)->
        a + b

define 'addTwice', ['add'], (require, exports, module)->
    add = require 'add'
    exports.addTwice = (a, b)->
        add add(a, b), b

use ['addTwice'], (require, exports, module)->
    addTwice = require 'addTwice'
    cosnole.log "#{2} + #{3} + #{3} = #{addTwice 2, 3}"
```

上面的代码展示了如何使用这个commonjs运行时，很简单，有木有？

> 很简陋？确实，我们只是用用它来组织代码，最终实现bodule.js这个复杂的commonjs运行时。

### bodule API

我们改从何入手编写一个加载器呢，既然已经有了规范和接口，那我们从接口写起吧。

```coffeescript
define 'bodule', [], (require, exports, module)->
    Bodule = 
        use: (deps, factory)->
        define: (id, deps, factory)->
        package: (conf)->
    
    module.exports = Bodule

use ['bodule'], (require, exports, module)->
    
    Bodule = require 'bodule'
    window.Bodule = Bodule
    window.define = ->
      Bodule.define.apply Bodule, arguments
```
