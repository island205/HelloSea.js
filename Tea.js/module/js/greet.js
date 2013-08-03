define('/js/greet',['/js/greet/lua', '/js/greet/ruby'], function (require, exports) {
    var lua = require('/js/greet/lua')
    var ruby = require('/js/greet/ruby')
    function helloPython() {
        console.log("Hello,Python")
    }
    function helloJavaScript() {
        console.log("Hello,JavaScript")
    }
    exports.helloPython = helloPython
    exports.helloJavaScript = helloJavaScript
    exports.helloLua = lua.helloLua
    exports.helloRuby = ruby.helloRuby
})
