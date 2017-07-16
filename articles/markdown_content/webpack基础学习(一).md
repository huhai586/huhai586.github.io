##webpack学习-（webpack基础）


>什么是软件打包(software bundle)：2个或者多个软件应用被集合起来呈现为一个应用，这些被打包的软件共享ui界面，集成各种小功能。

>什么是前端打包(front-end bundle): 将前端资源（js,image,css）汇集到一处(为了易于管理和阅读源代码，源代码通常会分布在多个文件中，在发布的时候就不需要这样了)

>什么是javascript打包: 将所有js程序代码+相关依赖变成一个js文件

>打包工具(bundler)的作用: 查找依赖，编译非css,js(比如scss,coffeeScript,jsx,模块化的JS)编译的作用就是将源代码变成浏览器可以理解的代码，在编译的过程中还可以对代码进行某些‘修饰’（比如自动css前缀，css/js代码压缩，混淆），一般最后输出的就是一个整的css或者JS文件

> 常见的打包工具有webpack, browserify,gulp,grunt,rollup等等

我们为什么需要打包呢，请查看[javascript打包工具是如何工作的](</articles/articles_in_html/javascript 打包工具是如何工作的.html>)

webpack是最近2年火起来的`前端打包`工具，下面是webpack的一个入门基础教程
讲述的内容包括。

1. webpack是什么，它适合用在什么地方呢
2. webpack的`功能`有什么

*本文写作的时候最新版本webpack为3.0*

####webpack是什么，它适合用在什么地方呢
>webpack 是一个现代 JavaScript 应用程序的`模块打包器`(module bundler)。
>>来自https://doc.webpack-china.org/

CommonJS和AMD是用于JavaScript模块管理的两大规范，前者定义的是模块的同步加载，主要用于NodeJS；而后者则是异步加载，通过requirejs等工具适用于前端。随着npm成为主流的JavaScript组件发布平台，越来越多的前端项目也依赖于npm上的项目，或者自身就会发布到npm平台。因此，让前端项目更方便的使用npm上的资源成为一大需求。



![](/assets/article_images/webpack_basic_home_title.jpg)
####webpack的功能有什么
Webpack具有requireJs和browserify的功能(支持commonJS 和AMD规范)，但仍有很多自己的新特性：

1. 对 CommonJS 、 AMD 、ES6的语法做了兼容
2. 对js、`css、图片等资源文件`都支持打包
3. 串联式模块加载器以及插件机制，让其具有更好的灵活性和扩展性，例如提供对CoffeeScript、ES6的支持
4. 有独立的配置文件webpack.config.js
5. 可以将代码切割成不同的chunk，实现按需加载，降低了初始化时间
6. 支持 SourceUrls 和 SourceMaps，易于调试
7. 具有强大的Plugin接口，大多是内部插件，使用起来比较灵活
8. webpack 使用异步 IO 并具有多级缓存。这使得 webpack 很快且在增量编译上更加快

#### 1.1 webpack对requireJS和browserify功能的实现
请参看：

[requireJS AMD异步加载的实现原理](/)

[webpack 对AMD规范是如何实现的]()

[webpack 对CommonJs规范的实现]()

####webpack不适合做什么
####webpack常用拓展插件介绍
1. css相关
2. js相关 



