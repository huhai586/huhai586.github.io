##javascript 打包工具是怎么工作的


首先，什么是javascript 打包工具，javascript bundler把你的代码及相关依赖放入一个js文件里面
，现在已经有很多打包工具了比如[browserify](http://browserify.org/)和[webpack](https://webpack.github.io/)

为什么我们需要这个东西呢，主要问题是js代码对依赖的处理比较弱，javascript没有一个标准在代码里面去处理依赖。
没有\`import\`或者\`require\`，（现在有ES6标准的import标准了，但是没有被普遍的被浏览器支持）

如何使用JavaScript import和export？如何让别人能访问你的代码，或者你导入别人提供的代码？唯一的方法一直是通过全局变量。
例如，如果你想使用jQuery：
```$xslt
<script src="//code.jquery.com/jquery-1.12.0.min.js"></script>
<script>
// `$` global variable available here
</script>
```
你想项目代码可能是这么组织的（分成多个小的js文件）
```$xslt
<script src="//code.jquery.com/jquery-1.12.0.min.js"></script>
<script src="/js/foo.js"></script>
<script src="/js/bar.js"></script>
<script src="/js/foobar.js"></script>
<script>
// Here goes some code
</script>
```

在script标签里面你能使用所有的依赖，但是问题来了，如果foo.js依赖bar.js呢？
我们就需要调整script加载的顺序，这下就变糟糕了

* 使用全局变量，使我们需要尽量避免的
* 你需要小心的调整script的顺序
* 代码将变的越来越难以维护（因为有复杂的依赖越来越多）

这种情况在其它环境是怎么解决的呢？[Node.js自己的模块系统](https://nodejs.org/api/modules.html),使用了require()
和exports来解决这问题（[基于commonjs modules模块草案](http://wiki.commonjs.org/wiki/Modules/1.1)）
这就是我们经常看到“commonjs”的原因

我们能否参照node，在前端也实现require和export呢？
```$xslt
<script>
var $ = require('jquery')
var foo = require('./js/foo')
var bar = require('./js/bar')
var foobar = require('./js/foobar')
</script>
```
看起来不错，但是有一个技术限制： require()需要被`同步`实现，但是http是可以异步的，为了解决问题，我们
就将所有的代码及其依赖放在一个文件里面，在内存里面加载，当我想要用的时候，就用require。

>Note：把所有的code放入一个文件，也可以减少http请求问题(不包括http/2，因为http/2能一条TCP连接发送多个请求，
但是http/2还没有被广泛的支持)

>Note:  commonJS不是唯一的模块加载方法，,还有其它的，比如AMD，[webpck也支持AMD方式](https://webpack.github.io/docs/amd.html)加载
AMD是可以异步加载的，本文章主要注意力放在require()和exports

现在我们知道了javascript 打包器做什么和为什么要这样做了，但是它是怎么做的呢？最后的打包文件看起来是怎么样的，
它怎么完成了对依赖的处理？下面是一个伪代码来说明。
```$xslt
// common code for implementing require()/exports
var dependencies = {} // loaded modules
var modules = {} // code of your dependencies
// require function
var require = function (module) {
 if (!dependencies[module]) {
   // module not loaded, let’s load it
   var exports = {}
   modules[module](exports)
   // now in `exports` we have the things made “public”
   dependencies[module] = exports
 }
 return dependencies[module]
}
// dependendencies
modules['jquery'] = function (exports) {
  // code of jquery
}
modules['foo'] = function (exports) {
  // code of bar.js
  exports.helloWorld = function () {
    console.log('hello world')
  }
}
modules['bar'] = function (exports) {
  // code of bar.js
}
// etc…
// here goes the code of your "entry file".
// Which is the entry point of your code
// For example:
var $ = require('jquery')
var foo = require('foo')
var bar = require('bar')
foo.helloWorld()
```
在这段代码里面，很多require的特性没有被覆盖到，但是阐述了require的主要特点
除此之外，javascript打包器还能帮我们做其它有趣的事情

* 我们能使用require加载npm包（因为require/exports 在node.JS也已经被同样的定义了，它们能主动去查找node_modules里面
的依赖）

* 因为require和exports在node中被同样实现，行为是相同的。所以我们能够写跨平台的代码，也就是最近比较兴起的前端同构，
，你还可以轻松检测代码在哪个平台中运行，并且在每种情况下执行不同的操作,比如typeof window！=='undefined'可以使用AJAX，在Node.js.中就使用http核心模块。
* 在打包过程中，javascript打包器可以转义你的代码，比如ES6->ES5
* 还可以移除没有被使用的代码

>webpack走的更远，你不仅可以require你的javascript代码，还可以require静态资源，比如css或者images，还可以
对这些静态资源执行转换（使用loaders）,比如
```$xslt
require("!style!css!less!bootstrap/less/bootstrap.less");
```
让我们开始使用javascript打包器吧


参考连接：
[How JavaScript bundlers work][1]

[1]: https://medium.com/@gimenete/how-javascript-bundlers-work-1fc0d0caf2da "How JavaScript bundlers work
"