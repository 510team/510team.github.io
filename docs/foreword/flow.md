# Flow

## WHAT

[Flow](https://flow.org/en/)是 js 的静态类型检查器。它可以让你的代码更快、更聪明。由于 VUE 中大量使用了 flow，故我们先来了解一下 flow，以便帮助我们学习 VUE 源码。

## WHY

Javascript 作为一种弱类型的脚本语言，虽然我们在定义的时候不用关心变量的类型，增加了易用性，也变的比较简单，但是往往在使用的时候会因为赋值或者传值的类型的错误，而造成预期之外的结果，
增加了我们检查代码的工作量，从而有了 Flow 的产生。有了类型检查器，即方便我们自己的调用，也方便其他人阅读自己的代码，增加了代码的可读性以及团队协作性。

## HOW

接下来我们就学习一下如何使用 Flow。由于我们是在学习 VUE 源码的时候学习 Flow 的，因此本章节只讲解使如何在自己的现有项目中使用 Flow 以及 Flow 的基本用法。

### 安装 Flow

首先全局安装 Flow

```js
npm install flow -g
```

进入到需要使用 flow 的项目跟目录，执行命令，使项目变成一个 Flow 的项目

```js
flow init
```

此时，项目中会多了一个.flowconfig 的文件。

要使用 Flow，还要依赖 Babel

```js
npm install babel-cli babel-preset-flow -D
```

安装后，创建.babelrc 文件，增加如下内容：

```js
{
    "presets":["flow"]
}
```

这样我们就可以正常的使用 flow 来检测类型了。

### 基本用法

Flow 不需要任何代码修改就能进行类型检查，最小化开发者的工作量。
通过一个简单的例子说明一下：

```js
//@flow
//第一行的注释是必须写的，不然Flow是无法做检测的
//这样也方便开发，再不需要类型检测的时候，删除掉第一行代码即可
function add(a, b) {
    return a + b;
}
console.log(add("hello", "world")); //正确
console.log(add(1, 2)); //正确
console.log(add(true, false)); //错误
```

在 Javascript 中，string 以及 number 类型是可以进行拼接的，而 boolean 类型无法进行拼接，所以最后一行代码会报错。

::: tip
Flow 是不会做类型的隐式转换的
:::

Flow 进行类型检测需要执行

```js
flow check
```

### 类型检测

Flow 可以对 js 中的数据类型：Boolean、Null、Undefined、Number、String、Symbol 以及 Object 进行检测。

使用原始类型：

```js
const method = (x: number, y: string, z: boolean) => {};
method(3.13, "hello", true); //正确
method(3); //错误
```

#### 也许类型

在类型前加问号：?string,?number,也许类型是可以为 null 或者 void 的

```js
const method = (value: ?string) => {};
method("bar"); // 正确!
method(undefined); // 正确!
method(null); // 正确!
method(); // 正确!
method(2); //错误
```

#### 可选的类型

问号？在属性名称后面，可以被 void 完全忽略，但是不能是 null

```js
const method = (value?: string) => {};
method("bar"); // 正确!
method(undefined); // 正确!
method(null); // 错误!
method(); // 正确!
```

#### 可选的函数参数

该参数不能为 null

```js
const method = (value?: string) => {};
method("bar"); // Works!
method(undefined); // Works!
method(null); // Error!
method(); // Works!
```

#### 混合类型 mixed

虽然是混合类型，但是在使用的时候依然要判断传入的参数到底是哪种类型，否则会引起错误

```js
const method = (value: mixed) => {
    // 正确的
    if (typeof value === "string") {
        return "" + value;
    } else {
        return "";
    }
};
const methodSpe = (value: mixed) => {
    //错误的
    return "" + value;
};
```

#### 接口类型

接口类型可以理解为是自定义的一个类型，以后使用的时候要根据这个自定义的接口类型规则来使用

```js
interface Serializable {
    // 这个地方的 number 不能用 Number,如果用Number的话，就需要new Number()
    // serialize(): number;
    // 使用 Array 也需要写清楚数组中值的类型
    serialize(): Array<number>;
}

class Foo {
    serialize() {
        return [2];
    }
}

class Bar {
    serialize() {
        return "[Bar]";
    }
}
const foo: Serializable = new Foo(); // Works!
const bar: Serializable = new Bar(); // error!
```

Flow 的使用方法呢，总体来讲就是提前定义一下变量的类型，以便以后使用的时候做判断。如果想要知道 Flow 中的各个类型具体是怎么检测的呢，请移步[Flow 官网](https://flow.org/en/docs/types)

## Flow 在 VUE 中的使用

```js
flow
├── compiler.js       # 编译相关
├── component.js      # 组件数据结构
├── global-api.js     # Global API 结构
├── modules.js        # 第三方库定义
├── options.js        # 选项相关
├── ssr.js            # 服务端渲染相关
├── vnode.js          # 虚拟 node 相关
```
