# Sea.js 是什么？

起初被看作是一门玩具语言的JavaScript，最近已经发生了很大的变化。变化之一就是从HTML中的`<script>`标签转向了模块化。

## 模块化

模块就是一团黑乎乎的东西，有份文档会教你如何使用这团东西，你只知道它的接口，但不知道它内部是如何运作的，但这个模块能满足你的需求。

过程、函数、类都可以称作为模块，它们有一个共同的特点就是封装了功能，供外界调用。对于特定的语言，模块所指的东西各有不同。

### Python 中的模块

>  基本上就是一个包含了所有你定义的函数和变量的文件。

定义 Python 的模块：

```Python
#!/usr/bin/env python
#greet.py

def hello_python():
    print "Hello,Python"

def hello_javascript():
    print "Hello,JavaScript"
```

使用 Python 模块：

```Python
#!/usr/bin/env python
#use_greet.py

import greet

#call greet module's func
#print "Hello,Python"
greet.hello_python()
```

greet.py 的模块中有两个方法，把它们 import 到 use_greet.py 中，就可以使用了。

Python还提供了另外一种引入模块的方法：

```Python
#!/usr/bin/env python
#use_greet.py

from greet import hello_python

#call greet module's func
#print "Hello,Python"
hello_python()
```

可以引入模块特定的 API。

> 这在后面我们提到 ECMAScript 6 中的模块特性与之有相似的地方。

## JavaScript 的模块化

那 JavaScript 有模块化吗？有，而且是与它是一样的，看下面的例子：

```JavaScript
//greet.js
function helloPython(){
    document.write("Hello,Python");
}
function helloJavaScript(){
    document.write("Hello,JavaScript");
}

//use-greet.js
helloJavaScript();
```

```html
<!DOCTYPE html>
<!--index.html-->
<script src="./greet.js"></script>
<script src="./usegreet.js"></script>
```

在浏览器中打开 index.html：

> Hello,JavaScript

可以看到，JavaScript 这种通过全局共享的方式确实可以实现模块化，你只需要在 HTML 中引入需要使用的模块脚本即可。

但这样的模块化有两个很实在的问题：

1. 必须通过全局变量共享模块，命名冲突了怎么办？
2. 依赖的文件必须手动地使用 script 标签引入到页面中。

### Node.js 的模块化

这些问题如何解决呢？我们要不再来看一下 Node.js 的模块。你应该知道Node.js，现在它是火得不行！

```JavaScript
//greet.js
exports.helloPython = function() {
    console.log("Hello,Python");
}
exports.helloJavaScript = function() {
    console.log("Hello,JavaScript");
}

//use-greet.js
var greet = require("./greet");
greet.helloJavaScript();
```

运行`node use-greet.js`，控制台会打印：

> Hello,JavaScript

Node.js 把 JavaScript 移植到了服务端的开发中，Node.js 通过 exports 和 require 来实现了代码的模块化组织。在一个 Node.js 的模块文件中，我们可以使用 exports 把对外的接口暴露出来，其他模块可以使用 require 函数加载其他文件，获得这些接口，从而使用模块提供出来的功能，而不关心其实现。在 [npmjs.org](https://www.npmjs.org/) 上已经有上万的 Node.js 开源模块了！

## ECMA 标准草案

Node.js模块化的组织方案是Server端的实现，并不能直接在浏览器中使用。JavaScript原生并没有支持`exports`和`require`关键字。ECMAScript6标准草案harmony已经考虑到了这种模块化的需求。举个例子：

```JavaScript
// Define a module
module 'greet' {
    export function helloPython() {
        console.log("Hello,Python")
    }
    export function helloJavaScript() {
        console.log("Hello,JavaScript")
    }
}

//Use module
import {helloPython, helloJavaScript} from 'greet'
helloJavaScript()

//Or 
module Greet from 'greet'
Greet.helloJavaScript()

//Or remote module
module Greet from 'http://bodule.org/greet.js'
Greet.helloJavaScript()
```

可以到这里查看更多的[例子](http://wiki.ecmascript.org/doku.php?id=harmony:modules_examples)。

参考[es6-module-transpiler](http://square.github.io/es6-module-transpiler/)和[es6-module-loader](https://github.com/ModuleLoader/es6-module-loader)这两个项目。

不过该标准还处于草案阶段，没有主流的浏览器所支持，那我们该怎么办？恩，已经有一些先行者了。

## LABjs

[LABjs](https://github.com/getify/LABjs)是一个动态的脚本加载类库，替代难看的，低性能的`<script>`标签。该类库可以并行地加载多个脚本，可按照需求顺序执行依赖的代码，这样在保证依赖的同时大大提高的脚本的加载速度。

LABjs已经三岁了，其作者getify声称，由于社区里大家更喜欢使用AMD模式，随在2012年7月25号停止对该类库的更新。但LABjs绝对是JavaScript在浏览器端模块化的鼻祖，在脚本加载方面做了大量的工作。

## RequireJS

与 LABjs 不同的地方在于，[RequireJS](http://requirejs.org/) 是一个动态的模块加载器。其作者 James Burke 曾是 Dojo 核心库 loader 和 build system 的开发者。2009年随着 JavaScript 代码加载之需要，在 Dojo XDloader 的开发经验基础之上，它开始了新项目 RunJS。后更名为RequireJS，在 AMD 模块提案指定方面，他起到了重要的作用。James 从XDloader 到 RunJS 再到 RequireJS 一直在思考着该如何实现一个 module wrapper，让更多的JavaScript代码、更多的 Node 模块等等可以在浏览器环境中无痛使用。

## Sea.js

Sea.js 相对于前两者就比较年轻，2010年玉伯发起了这个开源项目，Sea.js 遵循 CMD 规范，与 RequireJS 类似，同样做为模块加载器。那我们如何使用 Sea.js 来封装刚才的示例呢？

```JavaScript
//greet.js
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

//use-greet.js
sea.use("greet", function (Greet) {
    greet.helloJavaScript();
});
```
