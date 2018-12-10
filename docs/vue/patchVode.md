# diff 算法 + patch （2）

## What

patchVode：当 vnode 和 oldVnode 都存在、oldVnode 不是真实节点，并且 vnode 和 oldVnode 是同一节点时，才会调用 patchVnode 进行 patch

UpdataChildren : 更新子节点

## How

1、

```js
//如果 oldVnode 和 vnode 完全一致，则可认为没有变化，return；
if (oldVnode === vnode) {
    return;
}
```

2、

```js
/**
vnode.elm  表示当前虚拟节点对应的真实dom节点的引用
vnode,oldVnode指向同一个真实 DOM 的引用
**/
const elm = (vnode.elm = oldVnode.elm);
```

3、

```js
/**如果新旧 vnode 都是静态的，同时它们的 key 相同（代表同一节点），并且新的 vnode 是 clone 或者是标记了 once（标记 v-once 属性，只渲染一次），那么只需要替换 elm 以及 componentInstance 即可。
 **/
if (
    isTrue(vnode.isStatic) &&
    isTrue(oldVnode.isStatic) &&
    vnode.key === oldVnode.key &&
    (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
) {
    vnode.componentInstance = oldVnode.componentInstance;
    return;
}
```

4、如果 vnode 节点没有 text 文本时：

-   4.1

```js
/**如果 oldNode,vnode 结点均有 children 子节点，则对子节点进行 diff 操作，调用 updateChildren 更新子节点 （_详见：updataChildren_）
 **/
updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly);
```

-   4.2

```js
/**如果只有 vnode 节点存在子节点，那么先清空 elm 的文本内容，然后为当前节点加入子节点
 **/
addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
```

-   4.3

```js
/**如果只有 oldVnode 节点有子节点的时候，则移除所有 elm 的子节点**/
removeVnodes(elm, oldCh, 0, oldCh.length - 1);
```

5、

```js
/**如果 vnode 节点没有 text 文本,但是与 oldVode 节点 text 不一样时，直接替换这段文本
 **/
nodeOps.setTextContent(elm, vnode.text);
```
