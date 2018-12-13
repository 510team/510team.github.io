---
prev: false
next: ./patchVnode
---

# diff 算法 与 patch （第一部分）

## What

-   diff 算法：一种对比新、旧虚拟节点的算法
-   patch：打补丁，把新旧节点的差异，应该到 DOM 上

## Why

数据更新时，渲染得到新的 Virtual DOM，与上一次得到的 Virtual DOM 进行 diff，记录下所有需要在 DOM 上进行的变更，然后在 patch 过程中应用到 DOM 上，实现 UI 的同步更新。

## Foreword

#### 1、Virtual DOM 可以看做一棵模拟了 DOM 树的 JavaScript 树，用 JS 对象表示 DOM 结构，可以根据虚拟 DOM 树构建出真实的 DOM 树

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

#### 2、Vue 的 diff 算法是基于 snabbdom 改造过来的，复杂度为 O(n)

::: tip 比较只会在同层级进行, 不会跨层级比较。
递归地进行同级 vnode 的 diff，最终实现整个 DOM 树的更新
:::

```js
<!-- 之前 -->
<div>           <!-- 层级1 -->
  <p>            <!-- 层级2 -->
    <b> aoy </b>   <!-- 层级3 -->
    <span>diff</Span>
  </P>
</div>
```

```js
<!-- 之后 -->
<div>            <!-- 层级1 -->
  <p>             <!-- 层级2 -->
      <b> aoy </b>        <!-- 层级3 -->
  </p>
  <span>diff</Span>     <!-- 层级2 -->
</div>
```

我们可能期望将`<span>`直接移动到`<p>`的后边，这是最优的操作。但是实际的 diff 操作是移除`<p>`里的`<span>`，再创建一个新的`<span>`插到`<p>`的后边。因为新加的`<span>`在层级 2，旧的在层级 3，属于不同层级的比较。

## How

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

    -   3.1 (_详见 patch 重点：[patchVnode](/vue/patchVnode.html)_)

    ```js
    /**当 oldVnode 不是真实节点，并且 vnode 和 oldVnode 值得比较时，则调用 patchVnode 进行 patch，即直接修改现有的节点
     **/
    if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
    }
    ```

    -   3.2 如果 oldVnode 是真实节点，或 vnode 和 oldVnode 不值得比较，则找到 oldVnode.elm 的父节点，根据 vnode 创建一个真实的 DOM 节点，并插入到该父节点中的 oldVnode.elm 位置。

    ```js
    const oldElm = oldVnode.elm;
    const parentElm = nodeOps.parentNode(oldElm);

    // create new node
    createElm(
        vnode,
        insertedVnodeQueue,
        // extremely rare edge case: do not insert if old element is in a
        // leaving transition. Only happens when combining transition +
        // keep-alive + HOCs. (#4590)
        oldElm._leaveCb ? null : parentElm,
        nodeOps.nextSibling(oldElm)
    );
    ```

    4、最后返回 vnode.elm

    ```js
    return vnode.elm;
    ```

    <br/>

::: tip 注释
[查看 vue 相关源码](https://github.com/510team/vue-resource-analysis/blob/master/src/core/vdom/patch.js)
:::
