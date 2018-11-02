# Rollup

## What

Rollup 是一个 Javascript 的模块打包器，可以将小块代码编译成大块复杂的代码，例如 library 或应用程序。  
Rollup 对代码模板使用新的标准化格式，这些标准都包含在 Javascript 的 ES6 版本中，而不是以前的特殊解决方案，如 CommonJS 和 AMD。ES6 模块可以使你自由、无缝的使用你最喜爱的 library 中那些最有用独立函数，而你的项目不必携带其他未使用的代码。ES6 模块最终还是要由浏览器原生实现，但当前 Rollup 可以是你提前体验。
总之，目前就只需要知道 Rollup 是打包代码的构建工具就好。

## Why

如果在开发的时候，将项目拆分成小的单独文件，那么这样既简单又方便后期的维护。但是，Javascript 以往并没有将次功能作为语言的核心功能，因此才出现了打包工具。

## When

目前前端打包工具有 Webpack、Rollup 等，那么我们在项目中改如何进行选择呢。是使用 webpack，还是 Rollup 呢，那么我们就需要清楚一下这两个工具的定位。
| Webpack | Rollup |
| --------|:------:|
|模块化管理工具和打包管理工具。可以将按需加载的模块进行代码分割|模块化工具，不支持代码拆分和模块化的热更新|

因此，可以这么区分 Webpack 和 Rollup：
::: tip
对于应用使用 Webpack，对于类库使用 Rollup

需要代码拆分(Code Splitting)，或者很多静态资源需要处理，再或者构建的项目需要引入很多 CommonJS 模块的依赖时，使用 webpack

代码库是基于 ES6 模块，而且希望代码能够被其他人直接使用，使用 Rollup
:::

## How

安装 Rollup

```js
npm install rollup -D
```

在项目根目录下新建一个 rollup.config.js，然后添加如下代码

```js
export default {
    input: "./rollup/main.js", //input是打包文件的入口文件
    output: {
        file: "./dist/js/rollup.main.min.js",
        /*
        output.format 生成包的格式，有如下格式：
        1. amd -- 异步模块定义，用于像RequestJS这样的模块加载器。
        2. cjs -- CommonJS, 适用于Node或Browserify/webpack
        3. es -- 将软件包保存为ES模块文件。
        4. iife -- 一个自动执行的功能，适合作为 <script>标签这样的。
        5. umd -- 通用模块定义，以amd, cjs, 和 iife 为一体
        */
        format: "iife"
    }
};
```

在项目根目录下新建 rollup 文件夹

```js
mkdir rollup
```

然后新建 a.js 文件

```js
const a = name => {
    const temp = `Hello,${name}`;
    return temp;
};
const b = name => {
    const temp = `Later,${name}`;
    return temp;
};
export { a, b };
```

新建 b.js 文件

```js
const addArray = arr => {
    const result = arr.reduce((a, b) => a + b, 0);
    return result;
};
export default addArray;

// array.reduce(function(total, currentValue, currentIndex, arr), initialValue)
//function(total,currentValue, index,arr)
// total	必需。初始值, 或者计算结束后的返回值。
// currentValue	必需。当前元素
// currentIndex	可选。当前元素的索引
// arr	可选。当前元素所属的数组对象。
//initialValue 可选。传递给函数的初始值
```

新建 main.js 文件

```js
import { a } from "./a";
import addArray from "./b";

const res1 = a("testRollup");
const res2 = addArray([1, 2, 3, 4, 5]);

console.log(res1, re2s);
```

然后我们执行命令：

```js
rollup - c;
```

:::tip
在上面代码中打包的命令直接用了 rollup -c，其实我们也可以在 package.json 添加脚本：

```js
"scripts":{
    "build":"rollup -c"
}
```

那么我们在打包的时候，只要执行

```js
npm run build
```

即可
:::

对文件进行打包，最终会在项目的根目录下生成文件 dist/js/rollup.main.min.js,代码如下：

```js
(function() {
    "use strict";

    const a = name => {
        const temp = `Hello,${name}`;
        return temp;
    };

    const addArray = arr => {
        const result = arr.reduce((a, b) => a + b, 0);
        return result;
    };

    // array.reduce(function(total, currentValue, currentIndex, arr), initialValue)
    //function(total,currentValue, index,arr)
    // total	必需。初始值, 或者计算结束后的返回值。
    // currentValue	必需。当前元素
    // currentIndex	可选。当前元素的索引
    // arr	可选。当前元素所属的数组对象。
    //initialValue 可选。传递给函数的初始值

    const res1 = a("testRollup");
    const res2 = addArray([1, 2, 3, 4, 5]);

    console.log(res1, re2s);
})();
```

此时我们可以发现，在 rollup/a.js 中的 b 函数没有被用到，那么在打包的时候也不会被打包进来。

:::tip
此时我们可以发现，打包的时候会把我们用到的代码原封不动的打包起来，如果最开始是 ES6 写的，那么打包的时候是不会将我们的代码进行转化的，那么旧的浏览器如果不支持 ES6 语法，也就无法执行我们的代码。如果想要兼容性高一点，那么就要使用插件了。
:::

提高打包的代码的兼容性

```js
npm install babel-core babel-preset-env babel-plugin-external-helpers babel-plugin-transform-runtime babel-preset-stage-2 babel-register rollup-plugin-babel -D
```

在.babelrc 文件中(如果没有，请先新建)添加代码：

```js
{
  "presets": [
    [
      "env",
      {
        "modules": false,
        "targets": {
          "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
        }
      }
    ],
    "stage-2"
  ],
  "plugins": ["transform-runtime", "external-helpers"]
}
```

在 rollup.config.js，添加代码：

```js
import babel from "rollup-plugin-babel";

export default {
    input: "./rollup/main.js",
    output: {
        file: "./dist/js/rollup.main.min.js",
        /* 
        output.format 生成包的格式，有如下格式：
        1. amd -- 异步模块定义，用于像RequestJS这样的模块加载器。
        2. cjs -- CommonJS, 适用于Node或Browserify/webpack
        3. es -- 将软件包保存为ES模块文件。
        4. iife -- 一个自动执行的功能，适合作为 <script>标签这样的。
        5. umd -- 通用模块定义，以amd, cjs, 和 iife 为一体 
    */
        format: "iife"
    },
    // iife打包后的只能在现代浏览器中正常工作，如果兼容旧版本浏览器就要添加插件
    // npm i babel-core babel-preset-env
    // babel-plugin-external-helpers babel-plugin-transform-runtime
    // babel-preset-stage-2 babel-register rollup-plugin-babel -D
    plugins: [
        babel({
            exclude: "node_modules/**" // 排除node_module下的所有文件
        })
    ]
};

// scripts中的一些命令解析 -c===--config 指的就是config.js配置文件  -w===--watch
```

这样执行在执行打包命令，最后打包后的代码就会变成：

```js
(function() {
    "use strict";

    function a(name) {
        var temp = "Hello," + name;
        return temp;
    }

    var addArray = function addArray(arr) {
        var result = arr.reduce(function(a, b) {
            return a + b;
        }, 0);
        return result;
    };

    // array.reduce(function(total, currentValue, currentIndex, arr), initialValue)
    //function(total,currentValue, index,arr)
    // total	必需。初始值, 或者计算结束后的返回值。
    // currentValue	必需。当前元素
    // currentIndex	可选。当前元素的索引
    // arr	可选。当前元素所属的数组对象。
    //initialValue 可选。传递给函数的初始值

    var res1 = a("testRollup");
    var res2 = addArray([1, 2, 3, 4, 5]);

    console.log(res1, re2s);
})();
```

就这样，转译之后的代码，就可以兼容 IE9 之前的浏览器了。  
我们只需要知道 Rollup 的基本用法，知道入口以及出口在哪里即可，这样方便我们在 VUE 中寻找到入口文件。如果想要进一步学习，可以移步[rollup 官网](https://www.rollupjs.com/guide/zh)哦。  
这里我们也提供一下[webpack 官网](https://www.webpackjs.com/concepts/entry-points/)地址，以供大家学习。  
还有一个在别人那里看到的[rollup 学习](https://www.cnblogs.com/tugenhua0707/p/8179686.html)地址，大家也可以参考一下。
