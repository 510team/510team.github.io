## 源码结构

跟上一章节讲到的 vuex 一样，vue router 的源码在`src`目录下：

```js
├── components                   // 两个组件router-link和router-view
│   ├── link.js
│   └── view.js
├── create-matcher.js            // route的匹配
├── create-route-map.js          // route的映射
├── history                      // route的三种方式，默认的是hash
│   ├── abstract.js
│   ├── base.js
│   ├── hash.js
│   └── html5.js
├── index.js                     // 定义了VueRouter类，也是VueRouter源码的入口
├── install.js                   // router 的安装 Vue.use(VueRouter)之后执行的install方法
└── util                         // 功能类和功能函数
    ├── async.js
    ├── dom.js
    ├── location.js
    ├── misc.js
    ├── params.js
    ├── path.js
    ├── push-state.js
    ├── query.js
    ├── resolve-components.js
    ├── route.js
    ├── scroll.js
    └── warn.js
```

## vue router 注册

对于路由注册来说，核心就是调用了 Vue.use(VueRouter)，使得 VueRouter 可以使用 Vue。然后 Vue 来调用 VueRouter 的`install`函数。而 install 函数的核心就是给组件混入钩子函数和全局注册两个路由组件。接下来我们就看一下 install 函数主要做了什么事情。先看一下源码（在`src/install.js`中）：
::: tip
这个地方在上一章讲解 vuex 的时候也提到了，Vue 中使用插件就是调用 Vue.use()方法。如果传入的参数有 install 方法，则调用插件的 install 方法，如果传入的参数本身是一个 function，则直接执行。在这里我们不做过多讲解，如果需要可以去读一下 vue 的源码。
:::

### 路由安装

install 函数定义在`src/install.js`中：

```js
export let _Vue;

export function install(Vue) {
    // 为了确保install逻辑只执行了一次，所以用install.installed做已安装的标识
    if (install.installed && _Vue === Vue) return;
    install.installed = true;

    _Vue = Vue; //这么做是因为Vue的插件对Vue依赖，但是用不能单独import vue，因为会增加包的体检

    const isDef = v => v !== undefined;

    const registerInstance = (vm, callVal) => {
        let i = vm.$options._parentVnode;
        if (
            isDef(i) &&
            isDef((i = i.data)) &&
            isDef((i = i.registerRouteInstance))
        ) {
            i(vm, callVal);
        }
    };
    // vue-router安装最重要的一步，就是利用Vue.mixin把beforeCreate和destroyed钩子函数注入到每个组件中
    Vue.mixin({
        beforeCreate() {
            // 判断组件是否存在router对象，该对象只在根组件上有
            if (isDef(this.$options.router)) {
                this._routerRoot = this; //this._routerRoot表示vue自身
                this._router = this.$options.router; //this._router表示VueRouter的router实例，在new Vue的时候传入的
                this._router.init(this); //初始化router
                Vue.util.defineReactive(
                    //把this._route变成响应式对象
                    this,
                    "_route",
                    this._router.history.current
                );
            } else {
                // 用于router-view层级判断
                this._routerRoot =
                    (this.$parent && this.$parent._routerRoot) || this;
            }
            registerInstance(this, this);
        },
        destroyed() {
            registerInstance(this);
        }
    });

    Object.defineProperty(Vue.prototype, "$router", {
        get() {
            return this._routerRoot._router;
        }
    });

    Object.defineProperty(Vue.prototype, "$route", {
        get() {
            return this._routerRoot._route;
        }
    });

    Vue.component("RouterView", View); //定义全局组件router-view
    Vue.component("RouterLink", Link); //定义全局组件router-link

    const strats = Vue.config.optionMergeStrategies;
    // use the same hook merging strategy for route hooks
    strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate =
        strats.created;
}
```

通过以上代码，我们可以看出`install`函数主要做了以下几件事情：

-   利用 Vue.mixin 把 beforeCreate 和 destroyed 钩子函数注入到每个组件中
-   根组件首次进入的时候，初始化路由 this.\_router.init(),然后利用 defineReactive 把 this.\_route 变成响应式对象，this.\_routerRoot 始终指向根组件
-   在 Vue 的原型上定义了$router和$route2 个属性的 get 方法，方便以后的访问
-   注册 router-view 和 router-link 两个组件

在注册完 VueRouter 之后，我们回去创建 VueRouter 的实例。那么我们就看一下 VueRouter 的实例化。
