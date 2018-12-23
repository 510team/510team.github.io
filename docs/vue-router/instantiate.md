# VueRouter 实例化

在看 VueRouter 的实例化代码之前，我们先看一个例子，然后把例子带入解析源码：

```js
// 1. 定义（路由）组件。
// 可以从其他文件 import 进来
const Foo = { template: "<div>foo</div>" };
const Bar = { template: "<div>bar</div>" };

// 2. 定义路由
// 每个路由应该映射一个组件。 其中"component" 可以是
// 通过 Vue.extend() 创建的组件构造器，
// 或者，只是一个组件配置对象。

const routes = [
    { path: "/foo", component: Foo },
    { path: "/bar", component: Bar }
];

// 3. 创建 router 实例，然后传 `routes` 配置
const router = new Router({
    routes // （缩写）相当于 routes: routes
});
```

请牢记上面的例子。

VueRouter 的实现是一个类，源码在`src/index.js`中:

```js
export default class VueRouter {
    //...

    // VueRouter的构造函数，new VueRouter需要做的事情
    constructor(options: RouterOptions = {}) {
        ..构造函数
    }

    match(raw: RawLocation, current?: Route, redirectedFrom?: Location): Route {...}

    get currentRoute(): ?Route {...}

    init(app: any /* Vue component instance */) {
        //初始化
    }

    beforeEach(fn: Function): Function {...}

    beforeResolve(fn: Function): Function {...}

    afterEach(fn: Function): Function {...}

    onReady(cb: Function, errorCb?: Function) {...}

    onError(errorCb: Function) {... }

    push(location: RawLocation, onComplete?: Function, onAbort?: Function) {...}

    replace(location: RawLocation, onComplete?: Function, onAbort?: Function) {...}

    go(n: number) {...}

    back() {...}

    forward() {...}

    getMatchedComponents(to?: RawLocation | Route): Array<any> {...}

    resolve(
        to: RawLocation,
        current?: Route,
        append?: boolean
    ): {
        location: Location,
        route: Route,
        href: string,
        // for backwards compat
        normalizedTo: Location,
        resolved: Route
    } {
        ...
    }

    addRoutes(routes: Array<RouteConfig>) {
        ...
    }
}
```

我们看到 VueRouter 定义了一些属性和方法，那么当执行`new VueRouter`的时候做了哪些事情呢？来看一下构造函数具体内容

```js
// VueRouter的构造函数，new VueRouter需要做的事情
constructor(options: RouterOptions = {}) {
    this.app = null; //表示根Vue实例
    this.apps = []; //保存持有$options.router属性的Vue实例
    this.options = options; //保存传入的路由配置
    this.beforeHooks = [];
    this.resolveHooks = [];
    this.afterHooks = [];
    this.matcher = createMatcher(options.routes || [], this); //路由匹配器

    let mode = options.mode || "hash"; //路由的创建模式
    // 表示浏览器不支持history.pushState的情况下，根据传入的fallback配置参数，决定是否退回到hash模式
    this.fallback =
        mode === "history" &&
        !supportsPushState &&
        options.fallback !== false;
    if (this.fallback) {
        mode = "hash";
    }
    if (!inBrowser) {
        mode = "abstract";
    }
    this.mode = mode;

    switch (mode) {
        //this.history表示路由历史的具体的实现实例，根据this.mode的不同实现不同，它有History基类，然后不同的history实现都是继承History
        case "history":
            this.history = new HTML5History(this, options.base);
            break;
        case "hash":
            this.history = new HashHistory(
                this,
                options.base,
                this.fallback
            );
            break;
        case "abstract":
            this.history = new AbstractHistory(this, options.base);
            break;
        default:
            if (process.env.NODE_ENV !== "production") {
                assert(false, `invalid mode: ${mode}`);
            }
    }
}
```

在构造函数中定义了一些属性，其中：

-   this.app——表示根实例 Vue
-   this.apps——表示\$options.router 属性的 Vue 实例
-   this.options——传入的路由配置
-   this.beforeHooks、this.resolveHooks、this.afterHooks——一些钩子函数
-   this.matcher——路由匹配器
-   this.mode——路由的创建模式，默认为 history
-   this.history——路由历史的具体实现实例，根据不同的 this.mode 实现不同

我们注意到，在构造函数定义属性的时候，有`this.matcher = createMatcher(options.routes || [], this);`这么一步路由匹配的操作，我们就看一下是如何匹配的。`createMatcher`函数在`src/create-matcher.js`中：

## createMatcher

```js
export function createMatcher(
    routes: Array<RouteConfig>, //用户定义的路由配置
    router: VueRouter //new VueRouter返回的实例
): Matcher {
    const { pathList, pathMap, nameMap } = createRouteMap(routes); //创建路由映射表

    function addRoutes(routes) {
        createRouteMap(routes, pathList, pathMap, nameMap);
    }

    function match(
        raw: RawLocation,
        currentRoute?: Route,
        redirectedFrom?: Location
    ): Route {
        // 序列化url
        // eg：/index?user_id=123&user_mobile=13300000000#vuerouter
        // 序列化的结果是:/index
        // hash为：#vuerouter
        // 参数为： user_id:123,user_mobile:'13300000000'
        const location = normalizeLocation(raw, currentRoute, false, router);
        const { name } = location;

        // 如果是命名路由，就判断记录中是否有该命名路由配置
        if (name) {
            const record = nameMap[name];
            if (process.env.NODE_ENV !== "production") {
                warn(record, `Route with name '${name}' does not exist`);
            }
            // 没找到表示没有匹配的路由
            if (!record) return _createRoute(null, location);
            const paramNames = record.regex.keys
                .filter(key => !key.optional)
                .map(key => key.name);

            // 参数处理
            if (typeof location.params !== "object") {
                location.params = {};
            }

            if (currentRoute && typeof currentRoute.params === "object") {
                for (const key in currentRoute.params) {
                    if (
                        !(key in location.params) &&
                        paramNames.indexOf(key) > -1
                    ) {
                        location.params[key] = currentRoute.params[key];
                    }
                }
            }

            if (record) {
                location.path = fillParams(
                    record.path,
                    location.params,
                    `named route "${name}"`
                );
                return _createRoute(record, location, redirectedFrom);
            }
        } else if (location.path) {
            // 非命名路由处理
            location.params = {};
            for (let i = 0; i < pathList.length; i++) {
                // 查找记录
                const path = pathList[i];
                const record = pathMap[path];
                // 如果匹配路由，则创建路由
                if (matchRoute(record.regex, location.path, location.params)) {
                    return _createRoute(record, location, redirectedFrom);
                }
            }
        }
        // no match 没有匹配路由
        return _createRoute(null, location);
    }

    function redirect(record: RouteRecord, location: Location): Route {
        const originalRedirect = record.redirect;
        let redirect =
            typeof originalRedirect === "function"
                ? originalRedirect(createRoute(record, location, null, router))
                : originalRedirect;

        if (typeof redirect === "string") {
            redirect = { path: redirect };
        }

        if (!redirect || typeof redirect !== "object") {
            if (process.env.NODE_ENV !== "production") {
                warn(
                    false,
                    `invalid redirect option: ${JSON.stringify(redirect)}`
                );
            }
            return _createRoute(null, location);
        }

        const re: Object = redirect;
        const { name, path } = re;
        let { query, hash, params } = location;
        query = re.hasOwnProperty("query") ? re.query : query;
        hash = re.hasOwnProperty("hash") ? re.hash : hash;
        params = re.hasOwnProperty("params") ? re.params : params;

        if (name) {
            // resolved named direct
            const targetRecord = nameMap[name];
            if (process.env.NODE_ENV !== "production") {
                assert(
                    targetRecord,
                    `redirect failed: named route "${name}" not found.`
                );
            }
            return match(
                {
                    _normalized: true,
                    name,
                    query,
                    hash,
                    params
                },
                undefined,
                location
            );
        } else if (path) {
            // 1. resolve relative redirect
            const rawPath = resolveRecordPath(path, record);
            // 2. resolve params
            const resolvedPath = fillParams(
                rawPath,
                params,
                `redirect route with path "${rawPath}"`
            );
            // 3. rematch with existing query and hash
            return match(
                {
                    _normalized: true,
                    path: resolvedPath,
                    query,
                    hash
                },
                undefined,
                location
            );
        } else {
            if (process.env.NODE_ENV !== "production") {
                warn(
                    false,
                    `invalid redirect option: ${JSON.stringify(redirect)}`
                );
            }
            return _createRoute(null, location);
        }
    }

    function alias(
        record: RouteRecord,
        location: Location,
        matchAs: string
    ): Route {
        const aliasedPath = fillParams(
            matchAs,
            location.params,
            `aliased route with path "${matchAs}"`
        );
        const aliasedMatch = match({
            _normalized: true,
            path: aliasedPath
        });
        if (aliasedMatch) {
            const matched = aliasedMatch.matched;
            const aliasedRecord = matched[matched.length - 1];
            location.params = aliasedMatch.params;
            return _createRoute(aliasedRecord, location);
        }
        return _createRoute(null, location);
    }

    function _createRoute(
        record: ?RouteRecord,
        location: Location,
        redirectedFrom?: Location
    ): Route {
        if (record && record.redirect) {
            return redirect(record, redirectedFrom || location);
        }
        if (record && record.matchAs) {
            return alias(record, location, record.matchAs);
        }
        return createRoute(record, location, redirectedFrom, router);
    }

    return {
        match,
        addRoutes
    };
}
```

`createMatcher`首先执行的是`const { pathList, pathMap, nameMap } = createRouteMap(routes)`来获取 pathList, pathMap, nameMap.

-   pathList-----route 的所有 path
-   pathMap------route 上的所有 path 对应的一个 map
-   nameMap------route 上的所有 name 对应该的一个 map

这三个是如何生成的呢？看一下`createRouteMap`函数，定义在`src/create-route-map`中：

```js
export function createRouteMap(
    routes: Array<RouteConfig>,
    oldPathList?: Array<string>,
    oldPathMap?: Dictionary<RouteRecord>,
    oldNameMap?: Dictionary<RouteRecord>
): {
    pathList: Array<string>, //存储所有的path
    pathMap: Dictionary<RouteRecord>, //path->RouteRecord的映射关系
    nameMap: Dictionary<RouteRecord> //name->RouteRecord的映射关系
} {
    // 创建映射表
    // the path list is used to control path matching priority
    const pathList: Array<string> = oldPathList || [];
    // $flow-disable-line
    const pathMap: Dictionary<RouteRecord> = oldPathMap || Object.create(null);
    // $flow-disable-line
    const nameMap: Dictionary<RouteRecord> = oldNameMap || Object.create(null);

    // 遍历路由配置，为每个配置添加路由记录
    routes.forEach(route => {
        addRouteRecord(pathList, pathMap, nameMap, route);
    });

    // ensure wildcard routes are always at the end 确保通配符在最后
    for (let i = 0, l = pathList.length; i < l; i++) {
        if (pathList[i] === "*") {
            pathList.push(pathList.splice(i, 1)[0]);
            l--;
            i--;
        }
    }

    return {
        pathList,
        pathMap,
        nameMap
    };
}
```

`createRouteMap`主要是给路由创建一张路由映射表，主要是循环调用了`addRouteRecord`函数，我们来看一下是如何创建映射表的，`addRouteRecord`定义在`src/addRouteRecord`中：

```js
function addRouteRecord(
    pathList: Array<string>,
    pathMap: Dictionary<RouteRecord>,
    nameMap: Dictionary<RouteRecord>,
    route: RouteConfig,
    parent?: RouteRecord,
    matchAs?: string
) {
    // 获得路由配置下的属性
    const { path, name } = route;
    // path === "/foo"
    // name === null
    // ...

    // pathToRegexpOptions默认是false
    const pathToRegexpOptions: PathToRegexpOptions =
        route.pathToRegexpOptions || {};

    // 格式化url，去掉结尾的/，以及加上parent的/
    // normalizedPath==="/foo"
    const normalizedPath = normalizePath(
        path,
        parent,
        pathToRegexpOptions.strict
    );

    if (typeof route.caseSensitive === "boolean") {
        pathToRegexpOptions.sensitive = route.caseSensitive;
    }

    //  创建routerecord RouteRecord是一个树型结构
    const record: RouteRecord = {
        path: normalizedPath, //path是规范化后的路径
        regex: compileRouteRegex(normalizedPath, pathToRegexpOptions), //利用了path-to-regexp库，把path解析成一个正则表达式的扩展
        components: route.components || { default: route.component },
        instances: {}, //组件的实例
        name,
        parent, //父的RouteRecord
        matchAs,
        redirect: route.redirect,
        beforeEnter: route.beforeEnter,
        meta: route.meta || {},
        props:
            route.props == null
                ? {}
                : route.components
                ? route.props
                : { default: route.props }
    };

    if (route.children) {
        // 递归路由配置的children属性，添加路由记录
        // 递归调用addRouteRecord
    }

    // 如果路由有别名，给别名也添加路由记录
    if (route.alias !== undefined) {
        //   如果有别名，递归调用addRouteRecord
    }

    // 更新映射表
    if (!pathMap[record.path]) {
        // 给pathlist和pathmap添加数据
        pathList.push(record.path);
        pathMap[record.path] = record;
    }

    // 命名路由添加记录
    if (name) {
        if (!nameMap[name]) {
            // 给namemap添加数据
            nameMap[name] = record;
        } else if (process.env.NODE_ENV !== "production" && !matchAs) {
            warn(
                false,
                `Duplicate named routes definition: ` +
                    `{ name: "${name}", path: "${record.path}" }`
            );
        }
    }
}
```

`addRouteRecord`定义了映射表的结构。

```js
//  创建routerecord RouteRecord是一个树型结构
const record: RouteRecord = {
    path: normalizedPath, //path是规范化后的路径
    regex: compileRouteRegex(normalizedPath, pathToRegexpOptions), //利用了path-to-regexp库，把path解析成一个正则表达式的扩展
    components: route.components || { default: route.component },
    instances: {}, //组件的实例
    name,
    parent, //父的RouteRecord
    matchAs,
    redirect: route.redirect,
    beforeEnter: route.beforeEnter,
    meta: route.meta || {},
    props:
        route.props == null
            ? {}
            : route.components
            ? route.props
            : { default: route.props }
};
```

`addRouteRecord`将 path 加入到`pathList`中，然后判断是否已经有 path 的映射表，如果没有，就创建 path 的映射，如果 route 中有命名路由并且没有创建过 name 的映射的时候就创建的 name 的映射。如果 route 有 children，然后递归调用`addRouteRecord`，如果路由有别名，也递归调用`addRouteRecord`。  
再回到`createMatcher`函数，刚开始就是获取到了`pathList`、`pathMap`、`nameMap`，然后定义了一些函数，最后返回：
`return { match, addRoutes }`。`match`和`addRoutes`就是两个方法。我们具体看一下这两个方法分别做了什么。

## addRoutes

```js
// 动态添加路由的时候用的
function addRoutes(routes) {
    createRouteMap(routes, pathList, pathMap, nameMap);
}
```

`addRoutes`其实就是调用了我们边讲到的`createRouteMap`函数，也就是更新了`pathList`、`pathMap`、`nameMap`这三个值，因此`addRoutes`这个方法就是为了动态生成路由的时候用到的。

## match

```js
function match(
    raw: RawLocation,
    currentRoute?: Route,
    redirectedFrom?: Location
): Route {
    // 序列化url
    // eg：/index?user_id=123&user_mobile=13300000000#vuerouter
    // 序列化的结果是:/index
    // hash为：#vuerouter
    // 参数为： user_id:123,user_mobile:'13300000000'
    const location = normalizeLocation(raw, currentRoute, false, router);
    const { name } = location;

    // 如果是命名路由，就判断记录中是否有该命名路由配置
    if (name) {
        const record = nameMap[name];
        if (process.env.NODE_ENV !== "production") {
            warn(record, `Route with name '${name}' does not exist`);
        }
        // 没找到表示没有匹配的路由
        if (!record) return _createRoute(null, location);
        const paramNames = record.regex.keys
            .filter(key => !key.optional)
            .map(key => key.name);

        // 参数处理
        if (typeof location.params !== "object") {
            location.params = {};
        }

        if (currentRoute && typeof currentRoute.params === "object") {
            for (const key in currentRoute.params) {
                if (!(key in location.params) && paramNames.indexOf(key) > -1) {
                    location.params[key] = currentRoute.params[key];
                }
            }
        }

        if (record) {
            location.path = fillParams(
                record.path,
                location.params,
                `named route "${name}"`
            );
            return _createRoute(record, location, redirectedFrom);
        }
    } else if (location.path) {
        // 非命名路由处理
        location.params = {};
        for (let i = 0; i < pathList.length; i++) {
            // 查找记录
            const path = pathList[i];
            const record = pathMap[path];
            // 如果匹配路由，则创建路由
            if (matchRoute(record.regex, location.path, location.params)) {
                return _createRoute(record, location, redirectedFrom);
            }
        }
    }
    // no match 没有匹配路由
    return _createRoute(null, location);
}
```

`match`首先根据传入的 `raw` 和`currentRoute`将 url 进行了序列化,返回新的 location。调用了`normalizeLocation`方法，该方法定义在`src/util/location.js`,这里就不贴源码了，可以自己去看。  
`match`返回会根据返回的 location 进行处理，处理了有 name 和有 path 的两种不同情况。如果匹配到了就会调用`_createRoute`生成一条新的路径进行返回。这个返回的路径就是匹配到 Route，这个对 Route 的切换以及组件的渲染会有很大的意义。
