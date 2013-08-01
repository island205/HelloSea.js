# HelloSea.js

## 介绍

这是一本关于Sea.js，前端模块化的小书。记录一些我在模块化方面的见闻、理解和思考。

> 本书基于Sea.js v2.1.1完成。

## Sea.js是什么？

起初被看作是一门玩具语言的JavaScript，最近已经发生了很大的变化。变化之一就是从HTML中的`<script>`标签转向了模块化。

### 模块化

模块就是一团黑乎乎的东西，有份文档会教你如何使用这团东西，你只知道它的接口，但不知道它内部是如何运作的，但这个模块能满足你的需求。

过程、函数、类都可以称作为模块，它们有一个共同的特点就是封装了功能，供外界调用。对于特定的语言，模块所指的东西各有不同。

在Python中，

> 模块基本上就是一个包含了所有你定义的函数和变量的文件。

我们来定义一个Python的模块：

```python
# !/usr/bin/python
# Filename: greet.py

def hello_pyhton():
    print "Hello,Python"
   
def hello_javascript():
    print "Hello,JavaScript"
```

真的，就是这么简单，我们可以这样使用：

```python
# !/usr/bin/python
# Filename: use_greet.py

import greet

# call greet module's func
# print "Hello,Python"
greet.hello_pyhton()
```

greet.py的模块中有两个方法，把它们import到use_greet.py中，我们就可以使用了。
Python还提供了另外一种引入模块的方法：

```python
# !/usr/bin/python
# Filename: use_greet.py

from greet import hello_pyhton

# call greet module's func
# print "Hello,Python"
hello_pyhton()
```

可以引入模块特定的API。

### JavaScript的模块化

那JavaScript有模块化吗？我想说有，而且是与它一样的，看下面的例子：

```javascript
// File: greet.js
function helloPython(){
    document.write("Hello,Python");
}
function helloJavaScript(){
    document.write("Hello,JavaScript");
}

// File:usegreet.js
helloJavaScript();
```

```html
<!DOCTYPE html>
<!--index.html-->
<script src="./greet.js"></script>
<script src="./usegreet.js"></script>
```

在浏览器中打开index.html：

> Hello,JavaScript

可以看到，JavaScript这种通过全局共享的方式确实可以实现模块化，你只需要在HTML中引入需要使用的模块脚本即可。

但这样的模块化有两个很实在的问题：

1. 必须通过全局变量共享模块，有可能会出现命名冲突的问题；
2. 依赖的文件必须手动地使用标签引入到页面中。

### Node.js的模块化

这些问题如何解决呢？我们要不再来看一下Node.js的模块。你应该知道Node.js，现在它是火得不行！

```javascript
// File:greet.js
exports.helloPython = function() {
    console.log("Hello,Python");
}
exports.helloJavaScript = function() {
    console.log("Hello,JavaScript");
}

// File: usegreet.js
var greet = require("./greet");
greet.helloJavaScript();
```

运行`node usegreet.js`，控制台会打印：

> Hello,JavaScript

Node.js把JavaScript移植到了Server端的开发中，Node.js通过export和require来实现了代码的模块化组织。在一个Node.js的模块文件中，我们可以使用exports把对外的接口暴露出来，其他模块可以使用require函数加载其他文件，获得这些接口，从而使用模块提供出来的功能，而不关心其实现。在npmjs.org上已经有上万的Node.js开源模块了！

### ECMA标准草案

Node.js模块化的组织方案是Server端的实现，并不能直接在浏览器中使用。JavaScript原生并没有支持`exports`和`require`关键字。ECMAScript6标准草案harmony已经考虑到了这种模块化的需求。举个例子：

```javascript
// Define a module
module 'greet' {
    export function helloPython() {
        console.log("Hello,Python")
    }
    export function helloJavaScript() {
        console.log("Hello,JavaScript")
    }
}

// Use module
import {helloPython, helloJavaScript} from 'greet'
helloJavaScript()

// Or 

module Greet from 'greet'
Greet.helloJavaScript()

// Or remote module
module Greet from 'http://bodule.org/greet.js'
Greet.helloJavaScript()
```

可以到这里查看更多的[例子](http://wiki.ecmascript.org/doku.php?id=harmony:modules_examples)。

不过该标准还处于草案阶段，没有主流的浏览器所支持，那我们该怎么办？恩，已经有一些先行者了。

### LABjs

[LABjs](https://github.com/getify/LABjs)是一个动态的脚本加载类库，替代难看的，低性能的`script`标签。该类库可以并行地加载多个脚本，可按照需求顺序执行依赖的代码，这样在保证依赖的同时大大提高的脚本的加载速度。

LABjs已经三岁了，其作者getify声称，由于社区里大家更喜欢使用AMD模式，随在2012年7月25号停止对该类库的更新。但LABjs绝对是JavaScript在浏览器端模块化的鼻祖，在脚本加载方面做了大量的工作。

### requirejs

与LABjs不同的地方在于，RequireJS是一个动态的模块加载器。其作者James Burke曾是Dojo核心库loader和build system的开发者。2009年随着JavaScript代码加载之需要，在Dojo XDloader的开发经验基础之上，它开始了新项目RunJS。后更名为RequireJS，在AMD模块提案指定方面，他起到了重要的作用。james从xdloader 到 runjs 再到requirejs一直在思考着该如何实现一个module wrapper，让更多的js、更多的node模块等等等可以在浏览器环境中无痛使用。

### seajs

seajs相对于前两者就比较年轻，2010年玉伯发起了这个开源项目，SeaJS遵循CMD规范，与RequireJS类似，同样做为模块加载器。那我们如何使用seajs来封装刚才的示例呢？

```javascript
// File:greet.js
define(function (require, exports) {
    function helloPython() {
        document.write("Hello,Python");
    }
    function helloJavaScript() {
        document.write("Hello,JavaScript");
    }
    exports.helloPython = helloPython;
    exports.helloJavaScript = helloJavaScript;
});

// File:usegreet.js
sea.use("greet", function (Greet) {
    greet.helloJavaScript();
});
```
## 小试身手

还记得jQuery如何使用的么？Sea.js也是如此。例子在[这里](https://github.com/Bodule/HelloSea.js/blob/master/gettingstart)可以找到，用[anywhere](https://github.com/JacksonTian/anywhere)起个静态服务来看看。

### 首先写个模块：

```javascript
// File:js/module/greet.js
define(function (require, exports) {
    function helloPython() {
        document.write("Hello,Python");
    }
    function helloJavaScript() {
        document.write("Hello,JavaScript");
    }
    exports.helloPython = helloPython;
    exports.helloJavaScript = helloJavaScript;
});
```

如果你对Node.js非常熟悉，你可以把这个模块理解为Node.js的模块加上一个Wrapper。

### 在页面中引入Sea.js：

```html
<!-- File:index.html -->
<!DOCTYPE HTML>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Getting start width Sea.js</title>
    <!-- 引入seajs-->
    <script src="/js/sea.js"></script>
</head>
<body>
    
</body>
</html>
```
### 加载模块文件！

```html
<!DOCTYPE HTML>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Getting start width Sea.js</title>
    <!-- 引入seajs-->
    <script src="/js/sea.js"></script>
    <script>
        seajs.use(['/js/module/greet'], function (Greet) {
            Greet.helloJavaScript()
        })
    </script>
</head>
<body>
    
</body>
</html>
```

看到页面上输出的`Hello,JavaScript`么，这确实太简单了！

## 使用指南

刚才的示例很简单？实际上Sea.js本身小巧而不失灵活，让我们再来深入地了解下如何使用Sea.js!

### 定义模块

Sea.js是[CMD](https://github.com/amdjs/amdjs-api/wiki/AMD)这个模块系统的一个运行时，Sea.js可以加载的模块，就是CMD规范里所指明的。那我们该如何编写一个CMD模块呢？

Sea.js提供了一个全局方法——`define`，用来定义一个CMD模块。

##### define(factory)

```javascript
define(function(require, exports, module) {
    // 模块代码
    // 使用require获取依赖模块的接口
    // 使用exports或者module来暴露该模块的对外接口
})
```

`factory`是这样一个函数`function (require?, exports?, module?) {}`，如果模块本身既不依赖其他模块，也不提供接口，`require`、`exports`和`module`都可以省略。但通常会是以下两种新式：

```javascript
define(function(require, exports) {
    var Vango = require('vango')
    exports.drawCicle = function () {
        var vango = new Vango(document.body, 100, 100)
        vango.cicle(50, 50, 50, {
            fill: true,
            styles:{
                fillStyle:"red"
            }
        })
    } 
})
```

或者：

```javascript
define(function(require, exports, module) {
    var Vango = require('vango')
    module.exports = {
        drawCicle: function () {
            var vango = new Vango(document.body, 100, 100)
            vango.cicle(50, 50, 50, {
                fill: true,
                styles:{
                    fillStyle:"red"
                }
            })
        }
    } 
})
```

> **注意**：必须保证参数的顺序，即需要用到exports，require不能省略；在模块中exports对象不可覆盖，如果需要覆盖请使用`module.exports`的形式（这与node的用法一致，在后面的原理介绍会有相关的解释）。你可以使用`module.exports`来export任意的对象（包括字符串、数字等等）。

##### define(id?, dependencies?, factory)

**id**：String 模块标识
**dependencies**：Array 模块依赖的模块标识

这种写法并不属于CMD规范，而是源自[Module/Transport/D](http://wiki.commonjs.org/wiki/Modules/Transport/D)。

```javascript
define('drowcicle', ['vango'], function(require, exports) {
    var Vango = require('vango')
    exports.drawCicle = function () {
        var vango = new Vango(document.body, 100, 100)
        vango.cicle(50, 50, 50, {
            fill: true,
            styles:{
                fillStyle:"red"
            }
        })
    } 
})
```

与CMD的define没有本质区别，我更情愿把它称作“具名模块”。Sea.js从用于生产的角度来说，必须支持具名模块，因为开发时模块拆得太小，生产环境必须把这些模块文件打包为一个文件，如果模块都是匿名的，那就傻逼了。

> 所以Sea.js支持具名模块也是无奈之举。

##### define(anythingelse)

除去以上两种新式，在CMD标准中，可以给define传入任意的字符串或者对象，表示接口就是对象或者字符串。不过这只是包含在标准中，在Sea.js并没有相关的实现。

### 配置Sea.js

Sea.js为了能够使用起来更灵活，提供了配置的接口。可配置的内容包括静态服务的位置，简化模块标识或路径。接下来我们来详细地了解下这些内容。

##### seajs.config(config)

**config**：Object，配置键值对。

Sea.js通过`.config`API来进行配置。你甚至可以在多个地方调用seajs.config来配置。Sea.js会mix传入的多个config对象。

```javascript
seajs.config({
    alias: {
        'jquery': 'path/to/jquery.js',
        'a': 'path/to/a.js'
    },
    preload: ['seajs-text']
})
```

```javascript
seajs.config({
    alias: {
        'underscore': 'path/to/underscore.js',
        'a': 'path/to/biz/a.js'
    },
    preload: ['seajs-combo']
})
```

上面两个配置会合并为：

```javascript
{
    alias: {
        'jquery': 'path/to/jquery.js',
        'underscore': 'path/to/underscore.js',
        'a': 'path/to/biz/a.js'
    },
    preload: ['seajs-text', 'seajs-combo']

}
```

`config`可以配置的键入下：

##### base

**base**：String，在解析绝对路径标识的模块时所使用的base路径。

默认地，在不配置base的情况下，base与sea.js的引用路径。如果引用路径为`http://example.com/assets/sea.js`，则base为`http://example.com/assets/`。

> 在阅读Sea.js这份文档时看到：

>> 当 sea.js 的访问路径中含有版本号时，base 不会包含 seajs/x.y.z 字串。 当 sea.js 有多个版本时，这样会很方便。

> 即如果sea.js的引用路径为`http://example.com/assets/1.0.0/sea.js`，则base仍为'`http://example.com/assets/'。这种方便性，我觉得过了点。

使用base配置，根本上可以分离静态文件的位置，比如使用CDN等等。

```javascript
seajs.config({
    base: 'http://g.tbcdn.cn/tcc/'
})
```

> 如果我们有三个CDN域名，如何将静态资源散列到这三个域名上呢？

##### paths

**paths**：Object，如果目录太深，可以使用paths这个配置项来缩写，可以在require时少写些代码。

如果：

```javascript
seajs.config({
    base: 'http://g.tbcdn.cn/tcc/'，
    paths: {
        'index': 's/js/index'
    }
})
```

则：

```javascript
define(function(require, exports, module) {
    // http://g.tbcdn.cn/tcc/s/js/index/switch.js
    var Switch = require('index/switch')
});
```

##### alias

**alias**：Object，本质上看不出和paths有什么区别，区别就在使用的概念上。

```javascript
seajs.config({
    alias: {
        'jquery': 'jquery/jquery/1.10.1/jquery'
    }
})
```

然后：

```javascript
define(function(require, exports, module) {
    // jquery/jquery/1.10.1/jquery
    var $ = require('jquery')
});

```

> 看出使用概念的区别了么？

还有一些别的配置，比如`preload`、`map`等，可以参考[配置](https://github.com/seajs/seajs/issues/262)。

### 启用模块

### 插件

#### 使用插件

#### 开发插件

##### 插件机制       

##### CDN插件

### 构建与部署

#### SPM2

#### SPM1与SPM2

## 实战

## 原理与实现

### 原理

Sea.js很酷不是？

Sea.js给出了CMD规范，本质上Sea.js是这个规范的一个运行时。

#### node

怎么解释这个问题，我们还是从Node模块说起，用我们之前使用过的一个模块：

```javascript
// File: usegreet.js
var greet = require("./greet");
greet.helloJavaScript();
```

当我们使用`node usegreet.js`来运行这个模块时，实际上node会构建一个运行的上下文，在这个上下文中运行这个模块。运行到`require('./greet')`这句话时，会通过注入的API，在新的上下文中解析greet.js这个模块，然后通过注入的`exports`或`module`这两个关键字获取该模块的接口，将接口暴露出来给usegreet.js使用，即通过`greet`这个对象来引用这些接口。例如，`helloJavaScript`这个函数。详细细节可以参看node源码中的[module.js](https://github.com/joyent/node/blob/master/lib/module.js)。

node的模块方案的特点如下：

1. 使用require、exports和module作为模块化组织的关键字；
2. 每个模块只加载一次，作为单例存在于内存中，每次require时使用的是它的接口；
3. require是同步的，通俗地讲，就是node运行A模块，发现需要B模块，会停止运行A模块，把B模块加载好，获取的B的接口，才继续运行A模块。如果B模块已经加载到内存中了，当然require B可以直接使用B的接口，否则会通过fs模块化同步地将B文件内存，开启新的上下文解析B模块，获取B的API。

实际上node如果通过fs异步的读取文件的话，require也可以是异步的，所以曾经node中有require.async这个API。

#### Sea.js

Sea.js采用了和Node相似的CMD规范，我觉得它们应该是一样的。使用require、exports和module来组织模块。但Sea.js比起Node的不同点在于，前者的运行环境是在浏览器中，这就导致A依赖的B模块不能同步地读取过来，所以Sea.js比起Node，除了运行之外，还提供了两个额外的东西：

1. 模块的管理
2. 模块从服务端的同步

即Sea.js必须分为模块加载期和执行期。加载期需要将执行期所有用到的模块从服务端同步过来，在再执行期按照代码的逻辑顺序解析执行模块。本身执行期与node的运行期没什么区别。

所以Sea.js需要三个接口：

1. define用来wrapper模块，指明依赖，同步依赖；
2. use用来启动加载期；
3. require关键字，实际上是执行期的桥梁。

> 并不太喜欢Sea.js的use API，因为其回调函数并没有使用与Define一样的参数列表。

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

##### 模块标识（id）

模块id的标准参考[Module Identifiers](http://wiki.commonjs.org/wiki/Modules/1.1.1#Module_Identifiers)，简单说来就是作为一个模块的唯一标识。

出于学习的目的，我将它们翻译引用在这里：

1. 模块标识由数个被斜杠（/）隔开的词项组成；
2. 每次词项必须是小写的标识、“.”或“..”；
3. 模块标识并不是必须有像“.js”这样的文件扩展名；
4. 模块标识不是相对的，就是顶级的。相对的模块标识开头要么是“.”，要么是“..”；
5. Top-level identifiers are resolved off the conceptual module name space root. 
6. 相对的模块标识被解释为相对于某模块的标识，“require”语句是写在这个模块中，并在这个模块中调用的。

##### 模块（factory）

顾名思义，factory就是工厂，一个可以产生模块的工厂。node中的工厂就是新的运行时，而在Sea.js中（Tea.js）中也同样，factory就是一个函数。这个函数接受三个参数。

```javascript
function (require, exports, module) {
    // here is module body
}
```

在整个运行时中只有模块，即只有factory。

##### 依赖（dependencies）

依赖就是一个id的数组，即模块所依赖模块的标识。

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

##### 模块依赖树

可以想见，整个模块系统是一棵树。启动模块作为根节点，依赖模块作为叶子节点。

在加载期，模块从根节点开始，依据模块间的依赖，先加载根节点，叶子节点才会慢慢显现出来。只有当最底层的根节点加载完成之后，才能回调来开始执行根模块。

在执行期，执行也是从根节点开始，本质上是按照代码的顺序结构，对整棵树进行了遍历。有的模块可能已经EXECUTED，而有的还小执行获取其exports。

##### 如何确定整个依赖树加载好了呢？

1. 定义A模块，如果有模块依赖于A，把该模块加入到等待A的模块队列中；
2. 加载A模块，状态变为FETCHING
3. A加载完成，获取A模块依赖的BCDEFG模块，发现B模块没有定义，而C加载中，D自己已加载好，E加载子模块中，F加载完成，E行中，G已经解析好，SAVED；
4. 由于FEG本身以及子模块都已加载好，因此A模块要确定已经加载好了，必须等待BCDE加载好；开始加载必须的子模块，LOADING；
5. 针对B重复步骤1；
6. 将A加入到CDE的等待队列中；
7. BCDE加载好之后都会从自己的等待队列中取出等待自己加载好的模块，通知A自己已经加载好了；
8. A每次收到子模块加载好的通知，都看一遍自己依赖的模块是否状态都变成了加载完成，如果加载完成，则A加载完成，A通知其等待队列中的模块自己已加载完成，LOADED；

针对每一次执行期，对应的加载依赖树与整个模块依赖树是有区别的，因为子模块已经加载好了的模块，并不在加载树中。

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

#### 资源定位

#### Sea.js

##### 模块的状态

由于浏览器端与Node的环境差异，模块存在加载期和执行期，所以Sea.js中为模块定义了六种状态。

```javascript
var STATUS = Module.STATUS = {
  // 1 - The `module.uri` is being fetched
  FETCHING: 1,
  // 2 - The meta data has been saved to cachedMods
  SAVED: 2,
  // 3 - The `module.dependencies` are being loaded
  LOADING: 3,
  // 4 - The module are ready to execute
  LOADED: 4,
  // 5 - The module is being executed
  EXECUTING: 5,
  // 6 - The `module.exports` is available
  EXECUTED: 6
}
```

分别为：

- FETCHING：开始从服务端加载模块
- SAVED：模块加载完成
- LOADING：加载依赖模块中
- LOADED：依赖模块加载完成
- EXECUTING：模块执行中
- EXECUTED：模块执行完成


[module.js](https://github.com/seajs/seajs/blob/master/src/module.js)是Sea.js的核心，我们来看一下，module.js是如何控制模块加载过程的。

##### 加载过程

- Sea.use调用Module.use构造一个没有factory的模块，该模块即为这个运行期的根节点。

```javascript
// Use function is equal to load a anonymous module
Module.use = function (ids, callback, uri) {
    var mod = Module.get(uri, isArray(ids) ? ids: [ids])

    mod.callback = function () {
        var exports = []
        var uris = mod.resolve()

        for (var i = 0, len = uris.length; i < len; i++) {
            exports[i] = cachedMods[uris[i]].exec()
        }

        if (callback) {
            callback.apply(global, exports)
        }

        delete mod.callback
    }

    mod.load()
}
```

模块构造完成，则调用mod.load()来同步其子模块；直接跳过fetching这一步；mod.callback也是Sea.js纯粹的一点，在模块加载完成后，会调用这个callback。

- 在load方法中，获取子模块，加载子模块，在子模块加载完成后，会触发mod.onload()：

```javascript
// Load module.dependencies and fire onload when all done
Module.prototype.load = function () {
    var mod = this

    // If the module is being loaded, just wait it onload call
    if (mod.status >= STATUS.LOADING) {
        return
    }

    mod.status = STATUS.LOADING

    // Emit `load` event for plugins such as combo plugin
    var uris = mod.resolve()
    emit("load", uris)

    var len = mod._remain = uris.length
    var m

    // Initialize modules and register waitings
    for (var i = 0; i < len; i++) {
        m = Module.get(uris[i])

        if (m.status < STATUS.LOADED) {
            // Maybe duplicate
            m._waitings[mod.uri] = (m._waitings[mod.uri] || 0) + 1
        }
        else {
            mod._remain--
        }
    }

    if (mod._remain === 0) {
        mod.onload()
        return
    }

    // Begin parallel loading
    var requestCache = {}

    for (i = 0; i < len; i++) {
        m = cachedMods[uris[i]]

        if (m.status < STATUS.FETCHING) {
            m.fetch(requestCache)
        }
        else if (m.status === STATUS.SAVED) {
            m.load()
        }
    }

    // Send all requests at last to avoid cache bug in IE6-9. Issues#808
    for (var requestUri in requestCache) {
        if (requestCache.hasOwnProperty(requestUri)) {
            requestCache[requestUri]()
        }
    }
}
```

模块的状态是最关键的，模块状态的流转决定了加载的行为；

- 是否触发onload是由模块的_remian属性来确定，在load和子模块的onload函数中都对_remain进行了计算，如果为0，则表示模块加载完成，调用onload：

```javascript
// Call this method when module is loaded
Module.prototype.onload = function () {
    var mod = this
    mod.status = STATUS.LOADED

    if (mod.callback) {
        mod.callback()
    }

    // Notify waiting modules to fire onload
    var waitings = mod._waitings
    var uri, m

    for (uri in waitings) {
        if (waitings.hasOwnProperty(uri)) {
            m = cachedMods[uri]
            m._remain -= waitings[uri]
            if (m._remain === 0) {
                m.onload()
            }
        }
    }

    // Reduce memory taken
    delete mod._waitings
    delete mod._remain
}
```
模块的_remain和_waitings是两个非常关键的属性，子模块通过_waitings获得父模块，通过_remain来判断模块是否加载完成。

- 当这个没有factory的根模块触发onload之后，会调用其方法callback，callback是这样的：

```javascript
mod.callback = function () {
    var exports = []
    var uris = mod.resolve()

    for (var i = 0, len = uris.length; i < len; i++) {
        exports[i] = cachedMods[uris[i]].exec()
    }

    if (callback) {
        callback.apply(global, exports)
    }

    delete mod.callback
}
```

这预示着加载期结束，开始执行期；

- 而执行期相对比较无脑，首先是直接调用根模块依赖模块的exec方法获取其exports，用它们来调用use传经来的callback。而子模块在执行时，都是按照标准的模块解析方式执行的：

```javascript
// Execute a module
Module.prototype.exec = function () {
    var mod = this

    // When module is executed, DO NOT execute it again. When module
    // is being executed, just return `module.exports` too, for avoiding
    // circularly calling
    if (mod.status >= STATUS.EXECUTING) {
        return mod.exports
    }

    mod.status = STATUS.EXECUTING

    // Create require
    var uri = mod.uri

    function require(id) {
        return Module.get(require.resolve(id)).exec()
    }

    require.resolve = function (id) {
        return Module.resolve(id, uri)
    }

    require.async = function (ids, callback) {
        Module.use(ids, callback, uri + "_async_" + cid())
        return require
    }

    // Exec factory
    var factory = mod.factory

    var exports = isFunction(factory) ? factory(require, mod.exports = {},
    mod) : factory

    if (exports === undefined) {
        exports = mod.exports
    }

    // Emit `error` event
    if (exports === null && ! IS_CSS_RE.test(uri)) {
        emit("error", mod)
    }

    // Reduce memory leak
    delete mod.factory

    mod.exports = exports
    mod.status = STATUS.EXECUTED

    // Emit `exec` event
    emit("exec", mod)

    return exports
}
```

> 看到这一行代码了么？ 
> `var exports = isFunction(factory) ? factory(require, mod.exports = {}, mod) : factory`
> 真的，整个Sea.js就是为了这行代码能够完美运行


## 快速参考

## 开源贡献

## 参考资料

- [实例解析 SeaJS 内部执行过程 - 从 use 说起](https://github.com/seajs/seajs/issues/308)
- [SeaJS v1.2 中文注释版](https://github.com/seajs/seajs/issues/305)
- [hello seajs](http://mrzhang.me/blog/hello-seajs.html)
- [http://seajs.org/docs/](http://seajs.org/docs/)
- [使用SeaJS实现模块化JavaScript开发](http://cnodejs.org/topic/4f16442ccae1f4aa270010d9)
- [use.js](http://documentup.com/tbranyen/use.js)
- [harmony:modules](http://wiki.ecmascript.org/doku.php?id=harmony:modules)
- [harmony:module_loaders](http://wiki.ecmascript.org/doku.php?id=harmony:module_loaders)
- [AMD规范](https://github.com/amdjs/amdjs-api/wiki/AMD)
- [CMD规范](https://github.com/seajs/seajs/issues/242)
- [AMD 和 CMD 的区别有哪些？](http://www.zhihu.com/question/20351507/answer/14859415)
- [与 RequireJS 的异同](https://github.com/seajs/seajs/issues/277)
- [基于CommonJS Modules/2.0的实现：BravoJS](http://www.cnblogs.com/snandy/archive/2012/06/10/2543893.html)
- [Dynamic Script Request (DSR) API](http://tagneto.org/how/reference/js/DynamicScriptRequest.html)
- [Achieving A Runtime CPAN With Dojo's XD Loader](http://tagneto.org/talks/AjaxExperienceXDomain/)
- [jQueryRequireJS](http://www.tagneto.org/talks/jQueryRequireJS/jQueryRequireJS.html)
- [labjs](http://www.slideshare.net/itchina110/labjs)
- [行进中的前端类库：KISSY CommonJS 的模块系统，AMD 和 Wrappings, 以及 RequireJS](http://lifesinger.org/blog/2011/01/commonjs-amd-wrappings-and-requirejs/)
- [jsi](http://code.google.com/p/jsi/wiki/History)
- [从零开始编写自己的JavaScript框架（一）](http://www.ituring.com.cn/article/48461)
