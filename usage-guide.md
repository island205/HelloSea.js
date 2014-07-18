# 使用指南

刚才的示例很简单？实际上Sea.js本身小巧而不失灵活，让我们再来深入地了解下如何使用Sea.js!

## 定义模块

Sea.js是[CMD](https://github.com/cmdjs/specification/blob/master/draft/module.md)这个模块系统的一个运行时，Sea.js可以加载的模块，就是CMD规范里所指明的。那我们该如何编写一个CMD模块呢？

Sea.js提供了一个全局方法——`define`，用来定义一个CMD模块。

#### `define(factory)`

```JavaScript
define(function(require, exports, module) {
    // 模块代码
    // 使用require获取依赖模块的接口
    // 使用exports或者module来暴露该模块的对外接口
})
```
`factory`是这样一个函数`function (require?, exports?, module?) {}`，如果模块本身既不依赖其他模块，也不提供接口，`require`、`exports`和`module`都可以省略。但通常会是以下两种形式：

```JavaScript
define(function(require, exports) {
    var Vango = require('vango')
    exports.drawCircle = function () {
        var vango = new Vango(document.body, 100, 100)
        vango.circle(50, 50, 50, {
            fill: true,
            styles:{
                fillStyle:"red"
            }
        })
    }
})
```

或者：

```JavaScript
define(function(require, exports, module) {
    var Vango = require('vango');
    module.exports = {
        drawCircle: function () {
            var vango = new Vango(document.body, 100, 100);
            vango.circle(50, 50, 50, {
                fill: true,
                styles:{
                    fillStyle:"red"
                }
            });
        }
    };
});
```

> **注意**：必须保证参数的顺序，即需要用到require， exports不能省略；在模块中exports对象不可覆盖，如果需要覆盖请使用`module.exports`的形式（这与node的用法一致，在后面的原理介绍会有相关的解释）。你可以使用`module.exports`来export任意的对象（包括字符串、数字等等）。

#### `define(id?, dependencies?, factory)`

**id**：String 模块标识

**dependencies**：Array 模块依赖的模块标识

这种写法属于[Modules/Transport/D](http://wiki.commonjs.org/wiki/Modules/Transport/D)规范。

```JavaScript
define('drawCircle', ['vango'], function(require, exports) {
    var Vango = require('vango');
    exports.drawCircle = function () {
        var vango = new Vango(document.body, 100, 100);
        vango.circle(50, 50, 50, {
            fill: true,
            styles:{
                fillStyle:"red"
            }
        });
    };
})
```

与CMD的`define`没有本质区别，我更情愿把它称作“具名模块”。Sea.js从用于生产的角度来说，必须支持具名模块，因为开发时模块拆得太小，生产环境必须把这些模块文件打包为一个文件，如果模块都是匿名的，那就傻逼了。（[为什么会傻逼？](https://github.com/seajs/seajs/issues/930)）

> 所以Sea.js支持具名模块也是无奈之举。

#### `define(anythingelse)`

除去以上两种形式，在CMD标准中，可以给define传入任意的字符串或者对象，表示接口就是对象或者字符串。不过这只是包含在标准中，在Sea.js并没有相关的实现。

## 配置Sea.js

Sea.js为了能够使用起来更灵活，提供了配置的接口。可配置的内容包括静态服务的位置，简化模块标识或路径。接下来我们来详细地了解下这些内容。

#### seajs.config(config)

**config**：Object，配置键值对。

Sea.js通过`.config`API来进行配置。你甚至可以在多个地方调用seajs.config来配置。Sea.js会mix传入的多个config对象。

```JavaScript
seajs.config({
    alias: {
        'jquery': 'path/to/jquery.js',
        'a': 'path/to/a.js'
    },
    preload: ['seajs-text']
})
```

```JavaScript
seajs.config({
    alias: {
        'underscore': 'path/to/underscore.js',
        'a': 'path/to/biz/a.js'
    },
    preload: ['seajs-combo']
})
```

上面两个配置会合并为：

```JavaScript
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

#### base

**base**：String，在解析绝对路径标识的模块时所使用的base路径。

默认地，在不配置base的情况下，base与sea.js的引用路径。如果引用路径为`http://example.com/assets/sea.js`，则base为`http://example.com/assets/`。

> 在阅读Sea.js这份文档时看到：  
> *当 sea.js 的访问路径中含有版本号时，base 不会包含 seajs/x.y.z 字串。 当 sea.js 有多个版本时，这样会很方便。*  
> 即如果sea.js的引用路径为http://example.com/assets/1.0.0/sea.js，则base仍为http://example.com/assets/。这种方便性，我觉得过了点。

使用base配置，根本上可以分离静态文件的位置，比如使用CDN等等。

```JavaScript
seajs.config({
    base: 'http://g.tbcdn.cn/tcc/'
})
```

> 如果我们有三个CDN域名，如何将静态资源散列到这三个域名上呢？

#### paths

**paths**：Object，如果目录太深，可以使用paths这个配置项来缩写，可以在require时少写些代码。

如果：

```JavaScript
seajs.config({
    base: 'http://g.tbcdn.cn/tcc/',
    paths: {
        'index': 's/js/index'
    }
})
```

则：

```JavaScript
define(function(require, exports, module) {
    // http://g.tbcdn.cn/tcc/s/js/index/switch.js
    var Switch = require('index/switch')
});
```

#### alias

**alias**：Object，本质上看不出和paths有什么区别，区别就在使用的概念上。

```JavaScript
seajs.config({
    alias: {
        'jquery': 'jquery/jquery/1.10.1/jquery'
    }
})
```

然后：

```JavaScript
define(function(require, exports, module) {
    // jquery/jquery/1.10.1/jquery
    var $ = require('jquery');
});
```

> 看出使用概念的区别了么？

#### preload

`preload`配置项可以让你在加载普通模块之前提前加载一些模块。既然所有模块都是在use之后才加载的，preload有何意义？然，看下面这段：

```JavaScript
seajs.config({
    preload: [
        Function.prototype.bind ? '' : 'es5-safe',
        this.JSON ? '' : 'json'
    ]
});
```

preload比较适合用来加载一些核心模块，或者是shim模块。这是一个全局的配置，使用者无需关系核心模块或者是shim模块的加载，把注意力放在核心功能即可。

还有一些别的配置，比如`vars`、`map`等，可以参考[配置](https://github.com/seajs/seajs/issues/262)。

## 使用模块

#### `seajs.use(id)`

Sea.js通过use方法来启动一个模块。

```JavaScript
seajs.use('./main')
```

在这里，`./main`是main模块的id，Sea.js在main模块LOADED之后，执行这个模块。

Sea.js还有另外一种启动模块的方式：

#### seajs.use(ids, callbacks)

```JavaScript
seajs.use('./main', function(main) {
    main.init()
})
```

Sea.js执行ids中的所有模块，然后传递给callback使用。

## 插件

Sea.js官方提供了7个插件，对Sea.js的功能进行了补充。

- seajs-text：用来加载HTML或者模板文件；
- seajs-style：提供了`importStyle`，动态地向页面中插入css；
- seajs-combo：该插件提供了依赖combo的功能，能把多个依赖的模块uri combo，减少HTTP请求；
- seajs-flush：该插件是对seajs-combo的补充，或者是大杀器，可以先hold住前面的模块请求，最后将请求的模块combo成一个url，一次加载hold住的模块；
- seajs-debug：Fiddler用过么？这个插件基本就是提供了这样一种功能，可以通过修改config，将线上文件proxy到本地服务器，便于线上开发调试和排错；
- seajs-log：提供一个seajs.log API，私觉得比较鸡肋；
- seajs-health：目标功能是，分析当前网页的模块健康情况。

由此可见，Sea.js的插件主要是解决一些附加问题，或者是给Sea.js添加一些额外的功能。私觉得有些功能并不合适让Sea.js来处理。

#### 插件机制

总结一下，插件机制大概就是两种：

- 使用Sea.js在加载过程中的事件，注入一些插件代码，修改Sea.js的运行流程，实现插件的功能；
- 给seajs加入一些方法，提供一些额外的功能。

> 私还是觉得Sea.js应该保持纯洁；为了实现插件，在Sea.js中加入的代码，感觉有点不值；combo这种事情，更希望采取别的方式来实现。
> Sea.js应该做好运行时。

## 构建与部署

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

> SPM心很大，SPM囊括yo、bower和grunt这三个工具。

### spm

> spm is a package manager, it is not build tools.

这句话来自github上[spm2](https://github.com/spmjs/spm2)的README文件。`spm是一个包管理工具，不是构建工具！`，它与npm非常相似。

#### spm的包规范

一个spm的模块至少包含：

```bash
-- dist
    -- overlay.js
    -- overlay.min.js
-- package.json
```

##### package.json

在模块中必须提供一个package.json，该文件遵循[Common Module Definition](https://github.com/cmdjs/specification)模块标准。与node的`package.json`兼容。在此基础上添加了两个key。

- family，即是包发布者在spmjs.org上的用户名；
- spm，针对spm的配置。

一个典型的`package.json`文件：

```JSON
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

##### dist

`dist`目录包含了模块必要的模块代码；可能是使用spm-build打包的，当然只要满足两个条件，就是一个spm的包。

#### 安装

`$ npm install spm -g`

安装好了spm，那该如何使用spm呢？让我们从help命令开始：

#### help

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

#### config

我们可以使用`config`来配置用户信息、安装方式以及源。

```bash
; Config username
$ spm config user.name island205

; Or, config default source 
$ spm config source.default.url http://spmjs.org
```

#### search

`spm`是一个包管理工具，与`npm`类似，有自己的源服务器。我们可以使用`search`命令来查看源提供的包。

> 由于`spm`在包规范中加入了`family`的概念，常常想运行`spm install backbone`，发现并没有backbone这个包。原因就是`backbone`是放在`gallery`这族下的。

```bash
$ spm search backbone

  1 result

  gallery/backbone
  keys: model view controller router server client browser
  desc: Give your JS App some Backbone with Models, Views, Collections, and Events.
```

#### install 

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

```bash
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

#### build

`spm`并不是以构建工具为目标，它本身是一个包管理器。所以`spm`将构建的功能以插件的功能提供出来。我们可以通过plugin命令来安装`build`：

```bash
$ spm plugin install build
```

安装好之后，如果你使用的是标准的`spm`包模式，就可以直接运行`spm build`来进行标准的打包。

**SPM2的功能和命令就介绍到这里，更多的命令在之后的实践中介绍。**

### spm与spm2

#### spm与spm2

其实之前介绍的spm是其第二个版本[spm2](https://github.com/spmjs/spm2)。spm的第一个版本可以在[这里](https://github.com/spmjs/spm)找到。

spm与spm2同样都是包管理工具，那它们之间有什么不同呢？

- 从定位上，spm2更加强调该工具是一个CMD包管理工具；
- 从提供的用户接口（cmd命令）spm2比起spm更加规范，作为包管理工具，在使用方式和命令都更趋同于npm；
- 在spm2中，构建命令以插件的方式独立出来，并且分层清晰；Transport和Concat封装成了grunt，便于自定义build方式；基于基础的grunt，构建了一个标准的spm-build工具，用于构建标准的CMD模块；
- 与此类似，deploy和init的功能都是以插件的形式提供的；
- 修改了package.json规范。

为什么作者对spm进行了大量的重构？

之所以进行大量的重构，就是为了保持spm作为包管理工具的特征。如npm一般，只指定最少的规范（package.json），提供包管理的命令，但是这个包如何构建，代码如何压缩并不是spm关心的事情。

只有规则简单合理，只定义接口，不关心具体实现，才有更广的实用性。

> spm本身是从业务需求成长起来的一个包管理工具，spm1更多的是一些需求功能的堆砌，而spm2就是对这些功能的提炼，形成一套适用于业界的工具。

#### apm

apm的全称是：

> Alipay package manager

即支付宝的包管理工具。

apm是基于spm的一套专门为支付宝开发的工具集。我们可以这么看，spm2和apm是spm升级后的两个产物，spm2更加专注于包管理和普适性，而apm更加专注于支付宝业务。由于业务细节和规模的不同，apm可能并不适合其他公司所用，所以需要spm2，而又因为支付宝业务的特殊性和基因，必须apm。

谢谢 @lepture 的指正：

> 不一定要用 apm，只是 apm 把所有要用到的插件都打包好了，同时相应的默认配置也为支付宝做了处理，方便内部员工使用，不用再配置了。
