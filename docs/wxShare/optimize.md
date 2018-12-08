> 着手优化我最先想到的是，打包，加载，速度，渲染，用户体验；所以我的也从这几个词开始入手。本次优化主要做了三件事，代码（vue），懒加载，骨架屏；还有很多会继续做。。。

# 代码

### 打包 webpack

> 现在虽然开发是按照模块化开发，webpack 也是遵循的模块打包的，但是打包是按照模块打包了吗？

webpack 先简单说一下！webpack 本就是分块打包，所以不用过多注意。（JS 引入了相同的库和模块，这时候将公共的库抽成一个 JS 文件，就用 CommonsChunkPlugin）

-   上代码！！！优化前

    ![](https://user-gold-cdn.xitu.io/2018/12/6/16782a1d37a1b329?w=342&h=261&f=png&s=24169)

    由于平时的不注意，代码中大量的组件引用都是用这种方式；

    可这样就导致了首屏展示或第一次加载中，不用的组件也打包到了入口 js 中（app.js）;得到的结果就是首屏 js 越来越大，加载时间也就长了；

-   优化

    很简单，改成异步就好；

![](https://user-gold-cdn.xitu.io/2018/12/6/16782adb86faaa40?w=438&h=291&f=png&s=29059)

其实在 router 中就已经使用了！

![](https://user-gold-cdn.xitu.io/2018/12/6/16782b018ca86256?w=573&h=183&f=png&s=26062)

修改完成后打包，就可以看到效果；

1. js 文件明显增加了
2. 页面中 head 标签中 同样增加了 js 引入；
3. 这里需要注意的是 js 引入放到 head 中会不会影响优化？其实不会的，因为引入的 script 标签中加了 async 属性使其变成了异步；

    ![](https://user-gold-cdn.xitu.io/2018/12/6/16782b28a7be3c41?w=1590&h=1634&f=png&s=564645)

    head 标签

    ![](https://user-gold-cdn.xitu.io/2018/12/6/16782bbb1a866ebc?w=570&h=162&f=png&s=66336)

### 代码

1. 增加了 v-if 的使用，特别是针对所有不是频繁切换组件和 dom；而这么做是因为 v-if 和 v-show 的区别；v-if 是“true”条件渲染，v-show 是什么条件都渲染
2. 组件异步加载，也就打包部分的讲到的；但是判断组件是否异步，就需要根据首屏展示的 dom 结构自行选择，不是所有组件适合异步加载；
3. 为了评分也在图片上，加上 alt 的默认参数；

### 骨架屏

骨架屏就很简单了，按照使用页面的结果编写就 ok 了；

有个插件：[vue-content-loader](https://github.com/egoist/vue-content-loader) 也可以在线编辑骨架屏；

但当前项目用了 ssr，首屏的骨架屏就鸡肋了！so 我就在第二屏及以后加上了骨架屏，而第三屏正好是一张特别大的详情图片，关键设计没有切成若干小图，是一大张，长，长长，长长长的详情图片！严重影响了页面的 loading 速度

### 懒加载

懒加载做了一个组件，而代码是直接拿 vue-lazy-component 组件的；方便修改和调试；

-   vue-lazy-component 代码

    主要用了原生的 IntersectionObserver（交叉观察器）构造函数；

```js
var io = new IntersectionObserver(callback, option);
```

-   IntersectionObserver 函数

    解释：监听目标元素与视口产生一个交叉区

    介绍直接代码

```js
let io = null;
// 回调函数
var callback = function(entries) {
    if (
        // 正在交叉
        entries[0].isIntersecting ||
        // 交叉率大于0
        entries[0].intersectionRatio
    ) {
        // 在组件销毁前取消观察-销毁方法
        io.unobserve(this.$el);
    }
};
// 观察视口与组件容器的交叉情况
io = new window.IntersectionObserver(callback, {
    // 容器窗口，滚动的父元素
    root: this.viewport,
    // 可以在父级（root）影响范围 扩展或缩小，类似css的margin～
    rootMargin,
    // 触发回调的位置，“%”单位， [0, 0.25, 0.5, 0.75, 1]就表示当目标元素 0%、25%、50%、75%、100% 可见时，会触发回调函数。
    threshold: [0, Number.MIN_VALUE, 0.01]
});
// 观察对象-挂载方法
this.io.observe(this.$el);
```
