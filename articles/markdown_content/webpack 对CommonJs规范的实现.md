##webpack 对CommonJs规范的实现


CommonJS是服务器端模块的规范，Node.js采用了这个规范。webpack打包工具能让网页兼容commonJS，那么它是怎么做到的呢？

要想让[commonJS规范](http://nodejs.cn/api/modules.html#modules_module_require_id)在浏览器上生效，那么我们就需要对这个规范在client上实现一遍(需要我们要重新定义module 和require)


>commonJs规范网址:http://nodejs.cn/api/modules.html#modules_module_require_id

下面是测试代码

exports_1.js
```$xslt
/**
 * Created by huhai on 2017/7/16.
 */
const name="我是第一"
module.exports= {
  name: name,
  showName: function(){
    console.log("name is: ",this.name)
  }
}
```

exports_2.js
```$xslt
/**
 * Created by huhai on 2017/7/16.
 */
const name="我是第二"
module.exports= {
  name: name,
  showName: function(){
    console.log("name is: ",this.name)
  }
}
```

main.js

```$xslt
/**
 * Created by huhai on 2017/7/16.
 */
let ONE = require('./exports_1')
let TWO = require('./exports_2')

console.log(ONE,TWO)
```

经过webpack bundle之后，生成的代码为

```$xslt
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {
debugger
/**
 * Created by huhai on 2017/7/16.
 */
let ONE = __webpack_require__(1);
let TWO = __webpack_require__(2);

console.log(ONE, TWO);

/***/ }),
/* 1 */
/***/ (function(module, exports) {

/**
 * Created by huhai on 2017/7/16.
 */
const name = "我是第一";
module.exports = {
  name: name,
  showName: function () {
    console.log("name is: ", this.name);
  }
};

/***/ }),
/* 2 */
/***/ (function(module, exports) {

/**
 * Created by huhai on 2017/7/16.
 */
const name = "我是第二";
module.exports = {
  name: name,
  showName: function () {
    console.log("name is: ", this.name);
  }
};

/***/ })
/******/ ]);
```

在这段代码里面最重要的是

```$xslt
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
                    // webpack缓存了每个对象的module.exports
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
                    // 
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
```
通过这段代码
```$xslt
modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
```
巧妙的将模块内部的modle.exports 带出来了

然后
```$xslt
return module.exports;
```
自此webpack 对require功能在client中实现了

由于client和node运行的环境不一样，所以不能完全对commonJS规范在client实现
，比如运行node的fs.readFile的话，就会直接报错，可以使用各种loader在node端来实现readFile





