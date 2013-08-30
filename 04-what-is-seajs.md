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