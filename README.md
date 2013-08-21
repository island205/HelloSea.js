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

def hello_python():
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
greet.hello_python()
```

greet.py的模块中有两个方法，把它们import到use_greet.py中，我们就可以使用了。
Python还提供了另外一种引入模块的方法：

```python
# !/usr/bin/python
# Filename: use_greet.py

from greet import hello_python

# call greet module's func
# print "Hello,Python"
hello_python()
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

参考[es6-module-transpiler](http://square.github.io/es6-module-transpiler/)和[es6-module-loader](https://github.com/ModuleLoader/es6-module-loader)这两个项目。

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

> 即如果sea.js的引用路径为http://example.com/assets/1.0.0/sea.js，则base仍为http://example.com/assets/。这种方便性，我觉得过了点。

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

##### preload

`preload`配置项可以让你在加载普通模块之前提前加载一些模块。既然所有模块都是在use之后才加载的，preload有何意义？然，看下面这段：

```javascript
seajs.config({
    preload: [
        Function.prototype.bind ? '' : 'es5-safe',
        this.JSON ? '' : 'json'
    ]
});
```

preload比较适合用来加载一些核心模块，或者是shim模块。这是一个全局的配置，使用者无需关系核心模块或者是shim模块的加载，把注意力放在核心功能即可。

还有一些别的配置，比如`vars`、`map`等，可以参考[配置](https://github.com/seajs/seajs/issues/262)。

### 使用模块

##### seajs.use(id)

Sea.js通过use方法来启动一个模块。

```javascript
seajs.use('./main')
```

在这里，`./main`是main模块的id，Sea.js在main模块LOADED之后，执行这个模块。

Sea.js还有另外一种启动模块的方式：

##### seajs.use(ids, callbacks)

```javascript
seajs.use('./main', function(main) {
    main.init()
})
```

Sea.js执行ids中的所有模块，然后传递给callback使用。

### 插件

Sea.js官方提供了7个插件，对Sea.js的功能进行了补充。

- seajs-text：用来加载HTML或者模板文件；
- seajs-style：提供了`importStyle`，动态地向页面中插入css；
- seajs-combo：该插件提供了依赖combo的功能，能把多个依赖的模块uri combo，减少HTTP请求；
- seajs-flush：该插件是对seajs-combo的补充，或者是大杀器，可以先hold住前面的模块请求，最后将请求的模块combo成一个url，一次加载hold住的模块；
- seajs-debug：Fiddler用过么？这个插件基本就是提供了这样一种功能，可以通过修改config，将线上文件proxy到本地服务器，便于线上开发调试和排错；
- seajs-log：提供一个seajs.log API，斯觉得比较鸡肋；
- seajs-health：目标功能是，分析当前网页的模块健康情况。

由此可见，Sea.js的插件主要是解决一些附加问题，或者是给Sea.js添加一些而外的功能。私觉得有些功能并不合适让Sea.js来处理。

##### 插件机制       

总结一下，插件机制大概就是两种：

- 使用Sea.js在加载过程中的事件，注入一些插件代码，修改Sea.js的运行流程，实现插件的功能；
- 其次就是给seajs加入一些方法，提供一些额外的功能。

> 私还是觉得Sea.js应该保持纯洁；为了实现插件，在Sea.js中加入的代码，感觉有点不值；combo这种事情，更希望采取别的方式来实现。
> Sea.js应该做好运行时。

### 构建与部署

很多时候，某个工具或者类库，玩玩可以，但是一用到生产环境，就感觉力不从心了。就拿Sea.js来说，开发的时候根据业务将逻辑拆分到很多小模块，逻辑清晰，开发方便。但是上线后，模块太多，HTTP请求太多，就会拖慢页面速度。

所以我们必须对模块进行打包压缩。这也是SPM的初衷。

SPM是什么？

使用者认为SPM是Sea.js Package Manager，但是实际上代表的是Static Package Manager，及静态包管理工具。如果大家有用过npm，你可以认为SPM是一个针对前端模块的包管理工具。当然它不仅仅如此。

SPM包括：

- 源服务：类似于npm源服务器的源服务；
- 包管理工具：相当于npm的命令行，安装、发布模块，解决模块依赖；
- 构建工具：模块CMD化、合并模块、压缩等；都是针对我们一开始提到的问题；
- 配置管理：管理配置；
- 辅助功能：比较像Yeoman，以插件提供一些便于平时开发的组件。

> SPM心很大，yo、bower和grunt这三个工具，SPM囊括三者。

#### spm

> spm is a package manager, it is not build tools.

这句话来自github上[spm2](https://github.com/spmjs/spm2)的README文件。`spm是一个包管理工具，不是构建工具！`，它与npm非常相似。

##### spm的包规范

一个spm的模块至少包含：

```bash
-- dist
    -- overlay.js
    -- overlay.min.js
-- package.json
```

###### package.json

在模块中必须提供一个package.json，该文件遵循[Common Module Definition](https://github.com/cmdjs/specification)模块标准。与node的`package.json`兼容。在此基础上添加了两个key。

- family，即是包发布者在spmjs.org上的用户名；
- spm，针对spm的配置。

一个典型的`package.json`文件：

```json
{
    "family": "arale",
    "name": "base",
    "version": "1.0.0",
    "description": "base is ....",
    "homepage": "http://aralejs.org/base/",
    "repository": {
        "type": "git",
        "url": "https://github.com/aralejs/base.git"
    },
    "keywords": ["class"],

    "spm": {
        "source": "src",
        "output": ["base.js", "i18n/*"],
        "alias": {
            "class": "arale/class/1.0.0/class",
            "events": "arale/events/1.0.0/events"
        }
    }
}
```

###### dist

`dist`目录包含了模块必要的模块代码；可能是使用spm-build打包的，当然只要满足两个条件，就是一个spm的包。

##### 安装

`$ npm install spm -g`

安装好了spm，那该如何使用spm呢？让我们从help命令开始：

##### help

我们可以运行`spm help`查看`spm`所包含的功能：

```bash
$ spm help

  Static Package Manager

  Usage: spm <command> [options]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

  System Commands:

    plugin         plugin system for spm
    config         configuration for spm
    help           show help information

  Package Commands:

    tree           show dependencies tree
    info           information of a module
    login          login your account
    search         search modules
    install        install a module
    publish        publish a module
    unpublish      unpublish a module

  Plugin Commands:

    init           init a template
    build          Build a standar cmd module.
```

`spm`包含三种命令，**系统命令**，即与`spm`本身相关（配置、插件和帮助），**包命令**，与包管理相关，**插件命令**，插件并不属于`spm`的核心内容，目前有两个插件`init`和`build`。

也可以使用`help`来查看单个命令的用法：

```bash
$ spm help install

  Usage: spm-install [options] family/name[@version]

  Options:

    -h, --help               output usage information
    -s, --source [name]      the source repo name
    -d, --destination [dir]  the destination, default: sea-modules
    -g, --global             install the package to ~/.spm/sea-modules
    -f, --force              force to download a unstable module
    -v, --verbose            show more logs
    -q, --quiet              show less logs
    --parallel [number]      parallel installation
    --no-color               disable colorful print


  Examples:

   $ spm install jquery
   $ spm install jquery/jquery arale/class
   $ spm install jquery/jquery@1.8.2
```

##### config

我们可以使用`config`来配置用户信息、安装方式以及源。

```bash
; Config username
$ spm config user.name island205

; Or, config default source 
$ spm config source.default.url http://spmjs.org

##### search

`spm`是一个包管理工具，与`npm`类似，有自己的源服务器。我们可以使用`search`命令来查看源提供的包。

> 由于`spm`在包规范中加入了`family`的概念，常常想运行`spm install backbone`，发现并没有backbone这个包。原因就是`backbone`是放在`gallery`这族下的。

```bash
$ spm search backbone

  1 result

  gallery/backbone
  keys: model view controller router server client browser
  desc: Give your JS App some Backbone with Models, Views, Collections, and Events.
```

##### install 

然后我们就可以使用`install`来安装了，注意我们必须使用包的全名，即`族名/包名`。

```bash
$ spm install gallery/backbone

        install: gallery/backbone@stable
          fetch: gallery/backbone@stable
       download: repository/gallery/backbone/1.0.0/backbone-1.0.0.tar.gz
           save: c:\Users\zhi.cun\.spm\cache\gallery\backbone\1.0.0\backbone-1.0.0.tar.gz
        extract: c:\Users\zhi.cun\.spm\cache\gallery\backbone\1.0.0\backbone-1.0.0.tar.gz
          found: dist in the package
      installed: sea-modules\gallery\backbone\1.0.0
        depends: gallery/underscore@1.4.4

        install: gallery/underscore@1.4.4
          fetch: gallery/underscore@1.4.4
       download: repository/gallery/underscore/1.4.4/underscore-1.4.4.tar.gz
           save: c:\Users\zhi.cun\.spm\cache\gallery\underscore\1.4.4\underscore-1.4.4.tar.gz
        extract: c:\Users\zhi.cun\.spm\cache\gallery\underscore\1.4.4\underscore-1.4.4.tar.gz
          found: dist in the package
      installed: sea-modules\gallery\underscore\1.4.4
```
`spm`将模块安装在了`sea_modules`中，并且在`~/.spm/cache`中做了缓存。

```hash
`~sea-modules/
  `~gallery/
    |~backbone/
    | `~1.0.0/
    |   |-backbone-debug.js
    |   |-backbone.js
    |   `-package.json
    `~underscore/
      `~1.4.4/
        |-package.json
        |-underscore-debug.js
        `-underscore.js
```

`spm`还加载了`backbone`的依赖`underscore`。

当然，Sea.js也是一个模块，你可以通过下面的命令来安装：

```bash
$ spm install seajs/seajs
```

`seajs`的安装路径为`sea_modules/seajs/seajs/2.1.1/sea.js`，看到这里，结合seajs顶级模块定位的方式，对于seajs在计算base路径的时，去掉了`seajs/seajs/2.1.1/`的原因。

##### build

`spm`并不是以构建工具为目标，它本身是一个包管理器。所以`spm`将构建的功能以插件的功能提供出来。我们可以通过plugin命令来安装`build`：

```bash
$ spm plugin install build
```

安装好之后，如果你使用的是标准的`spm`包模式，就可以直接运行`spm build`来进行标准的打包。

**SPM2的功能和命令就介绍到这里，更多的命令在之后的实践中介绍。**

#### spm与spm2

##### spm与spm2

其实之前介绍的spm是其第二个版本[spm2](https://github.com/spmjs/spm2)。spm的第一个版本可以在[这里](https://github.com/spmjs/spm)找到。

spm与spm2同样都是包管理工具，那它们之间有什么不同呢？

- 从定位上，spm2更加强调该工具是一个cmd包管理工具；
- 从提供的用户接口（cmd命令）spm2比起spm更加规范，作为包管理工具，在使用方式和命令都更趋同于npm；
- 在spm2中，构建命令以插件的方式独立出来，并且分层清晰；Transport和Concat分装成了grunt，便于自定义build方式；基于基础的grunt，构建了一个标准的spm-build工具，用于构建标准的cmd模块；
- 与此类似，deploy和init的功能都是以插件的形式提供的；
- 修改了package.json规范。

为什么作者对spm进行了大量的重构？

之所以进行大量的重构，就是为了保持spm作为包管理工具的特征。如npm一般，只指定最少的规范（package.json），提供包管理的命令，但是这个包如何构建，代码如何压缩并不是spm关心的事情。

只有规则简单合理，只定义接口，不关心具体实现，才有更广的实用性。

> spm本身是从业务需求成长起来的一个包管理工具，spm1更多的是一些需求功能的堆砌，而spm2就是对这些功能的提炼，形成一套适用于业界的工具。

##### apm

apm的全称是：

> Alipay package manager

即支付宝的包管理工具。

apm是基于spm的一套专门为支付宝开发的工具集。我们可以这么看，spm2和apm是spm升级后的两个产物，spm2更加专注于包管理和普适性，而apm更加专注于支付宝业务。由于业务细节和规模的不同，apm可能并不适合其他公司所用，所以需要spm2，而又因为支付宝业务的特殊性和基因，必须apm。

谢谢 @lepture 的指正：

> 不一定要用 apm，只是 apm 把所有要用到的插件都打包好了，同时相应的默认配置也为支付宝做了处理，方便内部员工使用，不用再配置了。

## 实战

### venus-in-cmd

Venus是一个javascript类库，是一个canvas的wrapper，为了学习spm，我们使用cmd的模式来重构这个类库。

#### 安装spm-init

spm提供了初始cmd模块的脚手架，我们可以使用下面的命令来安装这个脚手架：

```bash
$ spm plugin install init
```

#### 初始化一个cmd项目

运行：

```bash
$ spm init
```

就可以初始化一个cmd模块的项目，回答一些spm的问题，就能在当前目录生成必要的文件和文件夹：

```bash
|~examples/
| `-index.md
|~src/
| `-venus.js
|~tests/
| `-venus-spec.js
|-LICENSE
|-Makefile
|-package.json
`-README.md
```

我们在`src`中添加`venus`的代码。

#### 编写cmd模块

或者将现有的模块转化为cmd模块。

本例中的[Venus](https://github.com/island205/Venus)本来就已经存在，那我们如何将其转成cmd模块呢？

在Venus的源码中我惊喜地发现这段代码：

```javascript
// File: vango.js

/*
 * wrapper for browser,nodejs or AMD loader evn
 */
(function(root, factory) {
    if (typeof exports === "object") {
        // Node
        module.exports = factory();
    // AMD loader
    } else if (typeof define === "function" && define.amd) {
        define(factory);
    } else {
        // Broser
        root.Vango = factory();
    }
})(this, function() {
    // Factory for build Vango
})
```

这段代码可以令`vango.js`支持浏览器（通过script直接引入）、node环境以及AMD加载器。

于是事情就简单了，因为我们可以很简单地将一个Node模块转成CMD模块，添加如下的wrapper即可：

```javascript
// File: vango.js
define(function (require, exports, module) {
    (function(root, factory) {
        if (typeof exports === "object") {
            // Node
            module.exports = factory();
        // AMD loader
        } else if (typeof define === "function" && define.amd) {
            define(factory);
        } else {
            // Broser
            root.Vango = factory();
        }
    })(this, function() {
        // Factory for build Vango
        // return Vango
    })
})
```

##### UMD

上面那段有点黑魔法的代码还有一个更复杂的形式，即[Universal Module Definition](https://github.com/umdjs/umd)：

```javascript
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define('backbone', ['jquery', 'underscore'], function (jQuery, _) {
      return factory(jQuery, _);
    });
  } else if (typeof exports === 'object') {
  // Node.js
    module.exports = factory(require('jquery'), require('underscore'));
  } else {
    // Browser globals
    root.Backbone = factory(root.jQuery, root._);
  }
}(this, function (jQuery, _) {
  var Backbone = {};
  // Backbone code that depends on jQuery and _
  return Backbone;

}));
```

当然并不是所有的CMD模块都得这么写，你可以按照自己的方式，使用`require`、`exports`和`module`这三个关键字，遵循CMD的规范即可。

最后`src`有两个文件，`venus.js`就很简单了：

```javascript
define(function (require, exports, module) {
	var Vango = require('./vango');
	exports.Vango = Vango;
})
```

我们的venus的cmd版本搞定了，vango.js作为vango具体实现，而venus.js只是这些将这些画家暴露出来。

#### 构建

作为标准的cmd模块，我们可以使用`spm-build`来构建，别忘了之前提到的，你可以使用`spm plugin install build`来安装。

在项目的根目录下运行`spm build`：

```bash
$ spm build
           Task: "clean:build" (clean) task

           Task: "spm-install" task

           Task: "transport:src" (transport) task
      transport: 2 files

           Task: "concat:css" (concat) task
       concated: 0 files

           Task: "transport:css" (transport) task
      transport: 0 files

           Task: "concat:js" (concat) task
       concated: 2 files

           Task: "copy:build" (copy) task

           Task: "cssmin:css" (cssmin) task

           Task: "uglify:js" (uglify) task
           file: ".build/dist/venus.js" created.

           Task: "clean:dist" (clean) task

           Task: "copy:dist" (copy) task
         copied: 2 files

           Task: "clean:build" (clean) task
       cleaning: ".build"...

           Task: "spm-newline" task
         create: dist/venus-debug.js
         create: dist/venus.js

           Done: without errors.
```

从构建的log中可以看出，`spm`完全就是使用grunt来构建的，涉及到多个grunt task。你完全可以自己编写Gruntfile.js来实现自定义的构建过程。

venus就被构建好了，`spm`在目录中生成了一个`dist`文件夹：

```bash
|~dist/
  |-venus-debug.js
  `-venus.js
```

`venus-debug.js`中的内容为：

```javascript
define("island205/venus/1.0.0/venus-debug", [ "./vango-debug" ], function(require, exports, module) {
    var Vango = require("./vango-debug");
    exports.Vango = Vango;
});

define("island205/venus/1.0.0/vango-debug", [], function(require, exports, module) {
    // Vango's code
})
```

`venus.js`的内容与之一样，只是经过了压缩，去掉了模块名最后的`-debug`。

`spm`将`src`中的vango.js和venus.js根据依赖打到了一起。作为包的主模块，venus.js被放到了最前面。

> 这是Sea.js的约定，打包后的模块文件中的一个define即为该包的主模块，也就是说，你通过`require('island205/venus/1.0.0/venus')`，虽然Sea.js加载的是整个打包的模块，但是会把的一个factory的exports作为venus暴露的接口。

#### 发布

如果你用过npm，那你对spm的发布功能应该不会陌生了。spm也像npm一样，有一个公共仓库，我们可以通过`spm plublish`将venus发布到仓库中，与大家共享。

```bash
$ spm publish
        publish: island205/venus@1.0.0
          found: readme in markdown.
        tarfile: venus-1.0.0.tar.gz
        execute: git rev-parse HEAD
           yuan: Authorization required.
           yuan: `spm login` first
```

如果你碰到上面这种情况，你需要登录下。

```bash
$ spm publish
        publish: island205/venus@1.0.0
          found: readme in markdown.
        tarfile: venus-1.0.0.tar.gz
        execute: git rev-parse HEAD
      published: island205/venus@1.0.0
```

接下来我们使用venus编写一个名为pixelegos的网页程序，你可以使用这个程序来生成一些头像的位图。例如，spmjs的头像(这是github为spmjs生成的随机头像)：

![spmjs](https://identicons.github.com/1e5ac2bf13d0dc1b93e8d663f2fdf885.png)

### pixelegos

pixelegos整体的样式如下图：

![pixelegos](http://pic.yupoo.com/island205/D6slHlIX/PrApD.png)

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
5. 顶级标识根据模块系统的基础路径来解析；
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

##### 资源定位

资源定位是Sea.js，或者说模块加载器中非常关键部分。那什么是资源定位呢？

资源定位与模块标识相关，而在Sea.js中有三种模块标识。

###### 普通路径

普通路径与网页中超链接一样，相对于当前页面解析，在Sea.js中，普通路径包有以下几种：

```javascript
// 假设当前页面是 http://example.com/path/to/page/index.html

// 绝对路径是普通路径：
require.resolve('http://cdn.com/js/a');
  // => http://cdn.com/js/a.js

// 根路径是普通路径：
require.resolve('/js/b');
  // => http://example.com/js/b.js

// use 中的相对路径始终是普通路径：
seajs.use('./c');
  // => 加载的是 http://example.com/path/to/page/c.js

seajs.use('../d');
  // => 加载的是 http://example.com/path/to/d.js
```

###### 相对标识

在define的factory中的相对路径（`..` `.`）是相对标识，相对标识相对当前的URI来解析。

```javascript
// File http://example.com/js/b.js
define(function(require) {
    var a = require('./a');
    a.doSomething();
});
// => 加载的是http://example.com/js/a.js
```

这与node模块中相对路径的解析一致。

###### 顶级标识

不以`.`或者'/'开头的模块标识是顶级标识，相对于Sea.js的base路径来解析。

```javascript
// 假设 base 路径是：http://example.com/assets/

// 在模块代码里：
require.resolve('gallery/jquery/1.9.1/jquery');
  // => http://example.com/assets/gallery/jquery/1.9.1/jquery.js
```

> 在node中即是在paths中搜索模块（node_modules文件夹中）。

###### 模块定位小演

使用seajs.use启动模块，如果不是顶级标识或者是绝对路径，就是相对于页面定位；如果是顶级标识，就从Sea.js的模块系统中加载（即base）；如果是绝对路径，直接加载；
之后的模块加载都是在define的factory中，如果是相对路径，就是相对标识，相对当前模块路径加载；如果是绝对路径，直接加载；
由此可见，在Sea.js中，模块的配置被分割成2+x个地方：

- 与页面放在一起；
- 与Sea.js放在一起；
- 通过绝对路径添加更多的模块源。

> 由此可见，Sea.js确实海纳百川。

###### factory的依赖分析

在Sea.js的API中，`define(factory)`，并没有指明模块的依赖项，那Sea.js是如何获得的呢？

这段是Sea.js的源码：

```javascript
/**
 * util-deps.js - The parser for dependencies
 * ref: tests/research/parse-dependencies/test.html
 */

var REQUIRE_RE = /"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^\/\r\n])+\/(?=[^\/])|\/\/.*|\.\s*require|(?:^|[^$])\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g
var SLASH_RE = /\\\\/g

function parseDependencies(code) {
  var ret = []

  code.replace(SLASH_RE, "")
      .replace(REQUIRE_RE, function(m, m1, m2) {
        if (m2) {
          ret.push(m2)
        }
      })

  return ret
}
```
`REQUIRE_RE`这个硕大无比的正则就是关键。推荐使用[regexper](http://www.regexper.com/)来看看这个正则表达式。非native的函数factory我们可以通过的toString()方法获取源码，Sea.js就是使用`REQUIRE_RE`在factory的源码中匹配出该模块的依赖项。

> 从`REQUIRE_RE`这么长的正则来看，这里坑很多；在CommonJS的wrapper方案中可以使用JS语法分析器来获取依赖会更准确。


##### 获取真实的加载路径

1. 在Sea.js中，使用data.cwd来代表当前页面的目录，如果当前页面地址为`http://www.dianping.com/promo/195800`，则cwd为`http://www.dianping.com/promo/`；使用data.base来代表sea.js的加载地址，如果sea.js的路径为`http://i1.dpfile.com/lib/1.0.0/sea.js`，则base为`http://i1.dpfile.com/lib/`。

>  [“当 sea.js 的访问路径中含有版本号或其他东西时，base 不会包含 seajs/x.y.z 字串。 当 sea.js 有多个版本时，这样会很方便”](https://github.com/seajs/seajs/issues/258)。看到这一句，我凌乱了，这Sea.js是多么的人性化！但是我觉得这似乎没有必要。

2. seajs.use是，除了绝对路径，其他都是相对于cwd定位，即如果模块标识为：

- './a'，则真实加载路径为http://www.dianping.com/promo/a.js；
- '/a'，则为http://www.dianping.com/a.js；
- '../a'，则为http://www.dianping.com/a.js；

> 从需求上看，相对页面地址定位在现实生活中并不太适用，如果页面地址或者静态文件的路径稍微变化下，就跪了。

如果模块标识为绝对路径：

- 'https://a.alipayobjects.com/ar/a'，则加载路径就是'https://a.alipayobjects.com/ar/a.js'。

如果模块标识是顶级标识，就基于base来加载：

- 'jquery'，则加载路径为'http://i1.dpfile.com/lib/jquery.js'。

3. 除此之外，就是factory中的模块标识了：

- 'https://a.alipayobjects.com/ar/b'，加载路径为'https://a.alipayobjects.com/ar/b.js'
- '/c'，加载路径为'http://www.dianping.com/c.js'；
- './d'，如果父模块的加载路径是'http://i1.dpfile.com/lib/e.js'，则加载路径为'http://i1.dpfile.com/lib/d.js'

> 在模块系统中使用'/c'绝对路径是什么意思？Sea.js会将其解析为相对页面的模块，有点牛马不相及的感觉。

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

- [seajs](https://github.com/)
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
- [ECMAScript 6 Modules: What Are They and How to Use Them Today](http://www.infoq.com/news/2013/08/es6-modules)
- [aralejs.org/](http://aralejs.org/)
