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
