# 实战

## venus-in-cmd

Venus是一个javascript类库，是一个canvas的wrapper，为了学习spm，我们使用cmd的模式来重构这个类库。

### 安装spm-init

spm提供了初始cmd模块的脚手架，我们可以使用下面的命令来安装这个脚手架：

```bash
$ spm plugin install init
```

### 初始化一个cmd项目

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

### 编写cmd模块

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
        // Browser
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
            // Browser
            root.Vango = factory();
        }
    })(this, function() {
        // Factory for build Vango
        // return Vango
    })
})
```

#### UMD

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

### 构建

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

> 这是Sea.js的默认约定，打包后的模块文件其中的一个define即为该包的主模块（ID 和路径相匹配的那一个），也就是说，你通过`require('island205/venus/1.0.0/venus')`，虽然Sea.js加载的是整个打包的模块，但是会把的一个factory的exports作为venus暴露的接口。

### 发布

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

## pixelegos

pixelegos完成后的样子：

![pixelegos](http://pic.yupoo.com/island205/D7v3BdKT/Aiuue.jpg)

### 准备

创建一个名为`pixelegos`的文件夹，初始化一个npm项目：

```bash
$ mkdir pixelegos && cd pixelegos && npm init

```

在目录中多了一个packege.json文件，在这个文件中包含了一些pixelegos的信息，之后还会保存一些node module和spm的配置。

### 安装依赖

本项目中需要依赖的cmd模块包括`backbone`、`seajs`、`venus`、`zepto`。我们运行下面的命令安装这些依赖:

```bash
$ spm install seajs/seajs gallery/backbone zepto/zepto island205/venus
```

在`pixelegos`目录下增加了一个`sea-modules`目录，上面的cmd依赖都安装在这个目录中，由于backone依赖于underscore，spm自动安装了依赖。

```bash
├── gallery
│   ├── backbone
│   │   └── 1.0.0
│   │       ├── backbone-debug.js
│   │       ├── backbone.js
│   │       └── package.json
│   └── underscore
│       └── 1.4.4
│           ├── package.json
│           ├── underscore-debug.js
│           └── underscore.js
├── island205
│   └── venus
│       └── 1.0.0
│           ├── package.json
│           ├── venus-debug.js
│           └── venus.js
├── seajs
│   └── seajs
│       └── 2.1.1
│           ├── package.json
│           ├── sea-debug.js
│           ├── sea.js
│           └── sea.js.map
└── zepto
    └── zepto
        └── 1.0.0
            ├── package.json
            ├── zepto-debug.js
            └── zepto.js
```

### 开始

新建一些html、css、js文件，结构如下：

```bash
├── index.css
├── index.html
├── js
│   ├── canvas.js
│   ├── config.js
│   ├── menu.js
│   ├── pixelegos.js
│   └── tool.js
├── package.json
└── sea-modules
    ├── gallery
    ├── island205
    ├── seajs
    └── zepto
```

给index.html添加如下内容：

```html
<!DOCTYPE HTML>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title></title>
    <meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' name='viewport' />
    <meta name="viewport" content="width=device-width" />
    <link rel="stylesheet" href="/index.css" />
    <script type="text/javascript" src="/sea-modules/seajs/seajs/2.1.1/sea-debug.js"></script>
    <script type="text/javascript" src="/config.js"></script>
    <script type="text/javascript">
        seajs.use('/js/pixelegos')
    </script>
</head>
<body>
</body>
</html>
```

其中，config.js在开发时用来配置alias，pixelegos作为整个程序的启动模块。

```javascript
// config.js
seajs.config({
    alias: {
        '$': 'zepto/zepto/1.0.0/zepto',
        "backbone": "gallery/backbone/1.0.0/backbone",
        "venus": "island205/venus/1.0.0/venus"
    }
})
```

```javascript
// pixelegos.js
define(function (require, exports, module) {
    var Menu = require('./menu')
    var Tool = require('./tool')
    var Canvas = require('./canvas')
    var $ = require('$')

    $(function() {
        var menu = new Menu()
        var tool = new Tool()
        var canvas = new Canvas()
        tool.on('select', function(color) {
            canvas.color = color
        })
        tool.on('erase', function() {
            canvas.color = 'white'
        })
    })
})
```

在其他js文件中分别基于backbone实现一些pixelegos的组件。例如：

```javascript
// menu.js
define(function (require, exports, module) {
    var Backbone = require('backbone')
    var $ = require('$')

    var Menu = Backbone.View.extend({
        el: $('header'),
        show: false,
        events: {
            'click .menu-trigger': 'toogle'
        },
        initialize: function() {
            this.menu = this.$el.next()
            this.render()
        },
        toogle: function(e) {
            e.preventDefault()
            this.show = ! this.show
            this.render()
        },
        render: function() {
            if (this.show) {
                this.menu.css('height', 172)
            } else {
                this.menu.css('height', 0)
            }
        }
    })

    module.exports = Menu
})
```
menu.js依赖于backbone和$（在config.js将zepto alias为了$），实现了顶部的菜单。

### 当当当当

当当当当，巴拉巴拉，我们敲敲打打完成了pixelegos得功能，我们已经可以画出那只Octocat了！

### 构建发布

终于来到了我们的重点，关于cmd模块的构建。

> 有童靴觉得spm提供出来的构建工具很难用，搞不懂。我用下来确实些奇怪的地方，等我慢慢到来吧。

spm为自定义构建提供了两个工具:

- grunt-cmd-transport：将cmd模块转换成具名模块，即将`define(function (require, exports, module) {})`转换为`define(id, deps, function(require, exports, module) {})`，可基于package.json中的spm配置来替换被alias掉的路径等等。本身还可以将css或者html文件转换为cmd包。
- grunt-cmd-concat：根据依赖树，将多个具名的cmd模块打包到一起。

接下来就是用这些工具将我们零散的js打包成一个名为pixelegos.js的文件。

#### grunt

grunt是目前JavaScript最炙手可热的构建工具，我们先来安装下：

```javascript
" 在全部安装grunt的命令行接口
$ npm install grunt-cli -g

" 安装需要用的grunt task
$ npm install grunt grunt-cmd-concat grunt-cmd-transport grunt-contrib-concat grunt-contrib-jshint grunt-contrib-uglify  --dev-save
```

整个打包的流程为：

1. 将业务代码transport成cmd的具名模块
2. concat所有的文件到一个文件pixelegos.js
4. uglify

#### 编写Gruntfile.js文件

第一步先把js文件夹中的业务js转换成具名模块：

```javascript
transport : {
    options: {
        idleading: '/dist/',
        alias: '<%= pkg.spm.alias %>',
        debug: false
    },
    app:{
        files:[{
            cwd: 'js/',
            src: '**/*',
            dest: '.build'
        }]
    }
}
```

这是一些transport的配置，即将js/中的js transport到.build中间文件夹中。


接下来，将.build中的文件合并到一起（包含sea-modules中的依赖项。）：

```javascript
concat : {
    options : {
        include : 'all'
    },
    app: {
        files: [
            {
                expand: true,
                cwd: '.build/',
                src: ['pixelegos.js'],
                dest: 'dist/',
                ext: '.js'
            }
        ]
    }
}
```

这里我们只对pixelegos.js进行concat，因为它是app的入口文件，将`include`配置成`all`，只需要concat这个文件，就能将所有的依赖项打包到一起。`include`还可以配置成其他值：

- self，相当于不做concat，只是copy该文件
- relative，只concat通过想对路径依赖的模块

既然我们已经transport和concat好了文件，那我们直接使用整个文件就行了，于是我们的发布页面可写成：

```javascript
<!DOCTYPE HTML>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title></title>
    <meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' name='viewport' />
    <meta name="viewport" content="width=device-width" />
    <link rel="stylesheet" href="/index.css" />
    <script type="text/javascript" src="/sea-modules/seajs/seajs/2.1.1/sea.js"></script>
    <script type="text/javascript">
        seajs.use('/dist/pixelegos')
    </script>
</head>
<body>
...
</body>
</html>
```

当我运行index-product.html时我遇到了坑。在backbone包中并没有指明$依赖的具体包，导致打包后的js无法找到$.js文件。原本以为backbone中的$会被业务级的配置所替换，但是事实并非如此。如何解决？

我们必须使用seajs.config接口提供一个dom的engine，在js/中创建engine.js文件：

```javascript
// engine.js
seajs.config({
    alias: {
        '$': 'zepto/zepto/1.0.0/zepto'
    }
})
```

接下来把这个文件和pixelegos.js concat在一起：

```javascript
normalconcat: {
    app: {
        src: ['js/engine.js', 'dist/pixelegos.js'],
        dest: 'dist/pixelegos.js'
    }
}
```

由于grunt-contrib-concat和grunt-cmd-concat产生了task name的冲突，可以通过grunt.renameTask来修改task名。

下一步，uglify！

```javascript
uglify : {
    app : {
        files: [
            {
                expand: true,
                cwd: 'dist/',
                src: ['**/*.js', '!**/*-debug.js'],
                dest: 'dist/',
                ext: '.js'
            }
        ]
    }
}
```

大功告成，完整的Gruntfile.js如下:

```javascript
module.exports = function (grunt) {
    grunt.initConfig({
        pkg : grunt.file.readJSON("package.json"),
        transport : {
            options: {
                idleading: '/dist/',
                alias: '<%= pkg.spm.alias %>',
                debug: false
            },
            app:{
                files:[{
                    cwd: 'js/',
                    src: '**/*',
                    dest: '.build'
                }]
            }
        },
        concat : {
            options : {
                include : 'all'
            },
            app: {
                files: [
                    {
                        expand: true,
                        cwd: '.build/',
                        src: ['pixelegos.js'],
                        dest: 'dist/',
                        ext: '.js'
                    }
                ]
            }
        },
        normalconcat: {
            app: {
                src: ['js/engine.js', 'dist/pixelegos.js'],
                dest: 'dist/pixelegos.js'
            }
        },
        uglify : {
            app : {
                files: [
                    {
                        expand: true,
                        cwd: 'dist/',
                        src: ['**/*.js', '!**/*-debug.js'],
                        dest: 'dist/',
                        ext: '.js'
                    }
                ]
            }
        },
        clean:{
            app:['.build', 'dist']
        }
    })

     grunt.loadNpmTasks('grunt-cmd-transport')
     grunt.loadNpmTasks('grunt-contrib-concat')
     grunt.renameTask('concat', 'normalconcat')
     grunt.loadNpmTasks('grunt-cmd-concat')
     grunt.loadNpmTasks('grunt-contrib-uglify')
     grunt.loadNpmTasks('grunt-contrib-clean')

     grunt.registerTask('build', ['clean', 'transport:app', 'concat:app', 'normalconcat:app', 'uglify:app'])
     grunt.registerTask('default', ['build'])
}
```

## 总结

我们使用spm将一个非cmd模块venus转成了标准的cmd模块venus-in-cmd，然后我们用它结合多个cmd模块构建了一个简单的网页程序。很有成就，有没有！接下来我们要进入hard模式了，我们来看看，Sea.js是如何实现的？只有了解了它的内部是如何运作的，在使用它的过程才能游刃有余！
