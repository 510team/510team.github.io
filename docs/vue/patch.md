# diff 算法 + patch （1）

## What

-   diff 算法：一种对比新、旧虚拟节点的算法
-   patch：打补丁，把新旧节点的差异，应该到 DOM 上

## Why

数据更新时，渲染得到新的 Virtual DOM，与上一次得到的 Virtual DOM 进行 diff，记录下所有需要在 DOM 上进行的变更，然后在 patch 过程中应用到 DOM 上，实现 UI 的同步更新。

## Foreword

Virtual DOM 可以看做一棵模拟了 DOM 树的 JavaScript 树，用 JS 对象表示 DOM 结构，可以根据虚拟 DOM 树构建出真实的 DOM 树

比如 dom 是这样的：

```js
<div>
        <p>123</p>
</div>
```

对应的 virtual DOM（伪代码,实际复杂很多）：

```js
var Vnode = {
    tag: "div",
    children: [{ tag: "p", text: "123" }]
};
```

## How

-   #### Vue 的 diff 算法是基于 snabbdom 改造过来的，复杂度为 O(n)

> 比较只会在同层级进行, 不会跨层级比较。<br/>
> 递归地进行同级 vnode 的 diff，最终实现整个 DOM 树的更新

-   #### Diff 流程

    1、

    ```js
    /**如果 vnode 不存在，但是 oldVnode 存在，说明是需要销毁旧节点
     **/
    if (isUndef(vnode)) {
        if (isDef(oldVnode)) invokeDestroyHook(oldVnode);
        return;
    }
    ```

    2、

    ```js
    /**如果 vnode 存在，但是 oldVnode 不存在，说明是需要创建新节点
     **/
    createElm(vnode, insertedVnodeQueue);
    ```

    3、当 vnode 和 oldVnode 都存在时：

    -   3.1 (_详见：patchVode_)

    ```js
    /**当 oldVnode 不是真实节点，并且 vnode 和 oldVnode 是同一节点时，则调用 patchVnode 进行 patch，即直接修改现有的节点
     **/
    if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
    }
    ```

    -   3.2 如果 oldVnode 是真实节点，或 vnode 和 oldVnode 不是同一节点，则找到 oldVnode.elm 的父节点，根据 vnode 创建一个真实的 DOM 节点，并插入到该父节点中的 oldVnode.elm 位置。

    4、最后返回 vnode.elm
