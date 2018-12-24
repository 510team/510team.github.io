## router-view

router-view 的定义在`src/components/view.js`中：

```js
export default {
    name: "RouterView",
    functional: true,
    props: {
        name: {
            type: String,
            default: "default"
        }
    },
    render(_, { props, children, parent, data }) {
        data.routerView = true;

        const h = parent.$createElement;
        const name = props.name;
        const route = parent.$route; //当前路径
        const cache = parent._routerViewCache || (parent._routerViewCache = {});

        let depth = 0;
        let inactive = false;
        while (parent && parent._routerRoot !== parent) {
            if (parent.$vnode && parent.$vnode.data.routerView) {
                depth++;
            }
            if (parent._inactive) {
                inactive = true;
            }
            parent = parent.$parent;
        }
        data.routerViewDepth = depth;

        if (inactive) {
            return h(cache[name], data, children);
        }

        const matched = route.matched[depth];
        if (!matched) {
            cache[name] = null;
            return h();
        }

        const component = (cache[name] = matched.components[name]);

        data.registerRouteInstance = (vm, val) => {
            const current = matched.instances[name];
            if ((val && current !== vm) || (!val && current === vm)) {
                matched.instances[name] = val;
            }
        };
        (data.hook || (data.hook = {})).prepatch = (_, vnode) => {
            matched.instances[name] = vnode.componentInstance;
        };

        let propsToPass = (data.props = resolveProps(
            route,
            matched.props && matched.props[name]
        ));
        if (propsToPass) {
            propsToPass = data.props = extend({}, propsToPass);
            const attrs = (data.attrs = data.attrs || {});
            for (const key in propsToPass) {
                if (!component.props || !(key in component.props)) {
                    attrs[key] = propsToPass[key];
                    delete propsToPass[key];
                }
            }
        }

        return h(component, data, children);
    }
};
```

我们之前分析过，在 `src/install.js` 中，我们给 Vue 的原型上定义了 \$route:

```js
Object.defineProperty(Vue.prototype, "$route", {
    get() {
        return this._routerRoot._route;
    }
});
```

然后在 VueRouter 的实例执行 router.init 方法的时候，会执行如下逻辑，定义在 `src/index.js` 中：

```js
history.listen(route => {
    this.apps.forEach(app => {
        app._route = route;
    });
});
```

而 history.listen 方法定义在 src/history/base.js 中：

```js
listen (cb: Function) {
  this.cb = cb
}

```

然后在 updateRoute 的时候执行 this.cb:

```js
updateRoute (route: Route) {
  //. ..
  this.current = route
  this.cb && this.cb(route)
  // ...
}

```

也就是我们执行 `transitionTo` 方法最后执行 `updateRoute` 的时候会执行回调，然后会更新所有组件实例的 \_route 值，所以说 \$route 对应的就是当前的路由线路。
`<router-view>` 是支持嵌套的，回到 render 函数，其中定义了 depth 的概念，它表示 `<router-view>` 嵌套的深度。每个 `<router-view>` 在渲染的时候，执行如下逻辑：

```js
data.routerView = true;
// ...
while (parent && parent._routerRoot !== parent) {
    if (parent.$vnode && parent.$vnode.data.routerView) {
        depth++;
    }
    if (parent._inactive) {
        inactive = true;
    }
    parent = parent.$parent;
}

const matched = route.matched[depth];
// ...
const component = (cache[name] = matched.components[name]);
```

`parent._routerRoot` 表示的是根 Vue 实例，那么这个循环就是从当前的 `<router-view>` 的父节点向上找，一直找到根 Vue 实例，在这个过程，如果碰到了父节点也是 `<router-view>`的时候，说明 `<router-view>` 有嵌套的情况，`depth++`。遍历完成后，根据当前线路匹配的路径和 `depth` 找到对应的 `RouteRecord`，进而找到该渲染的组件。
render 函数的最后根据 component 渲染出对应的组件 vonde：
`return h(component, data, children)`

# 总结

1. 安装插件
   混入 beforeCreate 生命周期处理，初始化\_routerRoot，\_router，\_route 等数据
   全局设置 vue 静态访问 router 和 router 和 route，方便后期访问
   完成了 router-link 和 router-view 两个组件的注册，router-link 用于触发路由的变化，router-view 作 为功能组件，用于触发对应路由视图的变化
2. 根据路由配置生成 router 实例
   根据配置数组生成路由配置记录表
   生成监控路由变化的 hsitory 对象
3. 将 router 实例传入根 vue 实例
   根据 beforeCreate 混入，为根 vue 对象设置了劫持字段\_route，用户触发 router-view 的变化
   调用 init()函数，完成首次路由的渲染，首次渲染的调用路径是 调用 history.transitionTo 方法，根据 router 的 match 函数，生成一个新的 route 对象
   接着通过 confirmTransition 对比一下新生成的 route 和当前的 route 对象是否改变，改变的话触发 updateRoute，更新 hsitory.current 属性，触发根组件的\_route 的变化,从而导致组件的调用 render 函数，更新 router-view
   另外一种更新路由的方式是主动触发
   router-link 绑定了 click 方法，触发 history.push 或者 history.replace,从而触发 history.transitionTo
   同时会监控 hashchange 和 popstate 来对路由变化作对用的处理
