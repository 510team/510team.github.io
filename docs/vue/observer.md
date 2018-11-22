# 数据观测

## What

什么是数据观测？vue 是数据驱动的，数据改变就会导致视图改变。所以要点就是 vue 如何知道数据的变化，数据变化后如何更新对应的视图。

## Why

数据观测是 vue 框架中的一个重要部分，了解其原理有助于提高对 vue 的理解和使用。

## How

由于源码比较复杂，一开始源码不便于理解。所以先通过一个简单的栗子 🌰 来实现。

```js
# watch and auto re-build dist/vue.js
$ npm run dev

# watch and auto re-run unit tests in Chrome
$ npm run dev:test

# build all dist files,including npm packages
$ npm run build
```

通过以上呢我们知道 Vue 的打包命令是 `npm run dev`,那么我们就具体看一下 Vue 中的 `packages.json` 文件的 scripts 脚本

```js
"scripts": {
    "dev": "rollup -w -c scripts/config.js --environment TARGET:web-full-dev",
  },
```

通过上面的脚本呢，知道 Vue 使用的是 Rollup 进行打包的，并且打包的配置文件在 `scripts/config.js` 文件中，此时请记住`TARGET:web-full-dev`，下面会有用到。代码如下：

```js
if (process.env.TARGET) {
  // npm run dev的时候process.env.TARGET=web-full-dev
  module.exports = genConfig(process.env.TARGET);
} else {
  exports.getBuild = genConfig;
  exports.getAllBuilds = () => Object.keys(builds).map(genConfig);
}
```

::: tip
直接看文件的最后呢是因为`module.exports`通常都是在最后，并且通常导出的内容就是供其他地方使用的，方便找到主要的函数。  
process 是 Node 的环境变量，`process.env`返回一个包含用户环境信息的对象。若想进一步学习，请移步[Node Process](https://nodejs.org/docs/latest-v8.x/api/process.html)
:::

上面代码是在文件`scripts/config.js`的最后，用了`if`对`process.env.TARGET`进行了判断，我们也知道`npm run dev`中指明了`TARGET:web-full-dev`，因此`process.env.TARGET==web-full-dev`。接下来就是执行`genConfig('web-full-dev')`(我已经将行参变成了实参)。看一下`genConfig()`方法（这个方法就在`scripts/config.js`内）：

```js
function genConfig(name) {
  // 此时name===web-full-dev

  const opts = builds[name];
  // builds[web-full-dev]===={
  //   entry: resolve("web/entry-runtime-with-compiler.js"),
  //   dest: resolve("dist/vue.js"),
  //   format: "umd",
  //   env: "development",
  //   alias: { he: "./entity-decoder" },
  //   banner
  // },
  const config = {
    input: opts.entry, //这里就是入口文件 opts.entry===resolve("web/entry-runtime-with-compiler.js") 调用了resolve方法
    external: opts.external,
    plugins: [
      replace({
        __WEEX__: !!opts.weex,
        __WEEX_VERSION__: weexVersion,
        __VERSION__: version
      }),
      flow(),
      buble(),
      alias(Object.assign({}, aliases, opts.alias))
    ].concat(opts.plugins || []),
    output: {
      file: opts.dest,
      format: opts.format,
      banner: opts.banner,
      name: opts.moduleName || "Vue"
    }
  };

  if (opts.env) {
    config.plugins.push(
      replace({
        "process.env.NODE_ENV": JSON.stringify(opts.env)
      })
    );
  }

  Object.defineProperty(config, "_name", {
    enumerable: false,
    value: name
  });

  return config;
}
```

有一些说明已经在代码中注释了，并且都将行参变成了实参，那么我们就进一步解释一下:
`const opts = builds[name];`就是定义了一个常量`opts`，这个常量的值是`builds[name]`，那么 builds 是什么呢？看代码（builds 依然在`scripts/config.js`）：

```js
const builds = {
    ...
    // Runtime+compiler development build (Browser)
    "web-full-dev": {
        entry: resolve("web/entry-runtime-with-compiler.js"),
        dest: resolve("dist/vue.js"),
        format: "umd",
        env: "development",
        alias: { he: "./entity-decoder" },
        banner
    },
    ...
};
```

因此就找到了`opts`这个常量的具体的值是什么。由此我们知道了`input:opts.entry===resolve("web/entry-runtime-with-compiler.js")`。此时呢，又调用了`resolve()`方法：
::: tip
由于本章节只是为了找入口文件，因此我们只需要关注 `const config={}`中的`input:opts.entry`
:::

```js
//resolve方法在scripts/config中
// resolve("web/entry-runtime-with-compiler.js")
const resolve = p => {
  // base='web'
  const base = p.split("/")[0];
  if (aliases[base]) {
    // aliases是在文件头部引入的
    // const alias = require("rollup-plugin-alias");
    // alias文件在scripts/alias.js
    // alias = {
    //   vue: resolve("src/platforms/web/entry-runtime-with-compiler"),
    //   compiler: resolve("src/compiler"),
    //   core: resolve("src/core"),
    //   shared: resolve("src/shared"),
    //   web: resolve("src/platforms/web"),
    //   weex: resolve("src/platforms/weex"),
    //   server: resolve("src/server"),
    //   entries: resolve("src/entries"),
    //   sfc: resolve("src/sfc")
    // }
    // aliases[base]===aliases['web']===src/platforms/web
    return path.resolve(aliases[base], p.slice(base.length + 1));
  } else {
    return path.resolve(__dirname, "../", p);
  }
};
```

通过以上文件的逐步解析，最终`opts.entry===src/platforms/web/entry-runtime-with-compiler.js`,因此找到了打包的开始文件。  
到这里呢，还不算真正的完成，因为找入口文件就是为了要看`new Vue()`的时候这个`Vue`到底是个什么，因此呢进入`src/platforms/web/entry-runtime-with-compiler.js`文件，会看到：

```js
...
import Vue from "./runtime/index";
...
```

我们就跟着这个 import 一路寻找，进入`src/platforms/web/runtime/index.js`:

```js
import Vue from "core/index";
...
```

进入`src/core/index.js`:

```js
import Vue from "./instance/index";
...
```

进入 `src/core/instance/index.js`:

```js
import { initMixin } from "./init";
import { stateMixin } from "./state";
import { renderMixin } from "./render";
import { eventsMixin } from "./events";
import { lifecycleMixin } from "./lifecycle";
import { warn } from "../util/index";

function Vue(options) {
  if (process.env.NODE_ENV !== "production" && !(this instanceof Vue)) {
    warn("Vue is a constructor and should be called with the `new` keyword");
  }
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

export default Vue;
```

到这里，终于看到了 Vue 的定义，因此也就找到了 Vue 的根源。Vue 就是一个构造函数。接下来就分析一下 Vue 的初始化。

## 总结

分析了半天呢，其实就是要去解析一下文件的路径，一切以找到 Vue 最初的定义为线索，从而跟着这条线去找，这样才不会走偏。在我们阅读源码的时候呢，不是一开始就要把所有的内容都看的，而是要有一个主线的去找，不必要的内容呢我们先放在一边，等到需要的时候再去抽丝剥茧，这样就会容易很多啦。
