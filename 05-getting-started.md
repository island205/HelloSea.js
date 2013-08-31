## 小试身手

还记得jQuery如何使用的么？Sea.js也是如此。例子在[这里](https://github.com/Bodule/HelloSea.js/blob/master/getting-started)可以找到，用[anywhere](https://github.com/JacksonTian/anywhere)起个静态服务来看看。

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
