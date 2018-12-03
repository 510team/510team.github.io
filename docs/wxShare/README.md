> 最近做的项目需要在微信中二次分享，但是这个过程中遇到不少坑，所以记录一下。至于为什么坑多？主要是平时比较粗心，文档看的不够仔细，其实文档已经说的很详细了，我遇到好多的问题都是再仔细看看文档解决的；下面我就按照我的开发顺序写一写，顺便填一下坑；

# 准备，配置

首先要申请一个公众号，而且要是企业公众号！为什么？因为普通账号不支持分享！！！凭啥？！

## 第一步：准备

进入自己的公众号，位置：开发>基本配置；在这里拿到 AppID 和 AppSecret，这两个就是要在后面获取 token 的 api 的参数；需要注意平台不会存储 AppSecret，也不要把 AppSecret 放到前端暴露出来，我们放到 node 里；

IP 白名单也顺便配置一下，就是调用获取 access_token 接口时，需要设置访问来源 IP 为白名单。也就是我们用的 node 服务器 ip；需要注意下的 ip 别获取成内网的 ip！，如果不知道百度搜索 ip 就能查到了；

![](https://user-gold-cdn.xitu.io/2018/12/1/16767d194bbc595f?w=2322&h=884&f=jpeg&s=106932)

然后继续再 公众号设置>功能设置；配置 js 接口安全域名，这里介绍也很详细配置好域名，就可以调用 js 了，还有微信提供的签名文件要放到配置的域名下。

> 但这里有个要注意,签名文件放置的路径要和配置域名路径一样。

![](https://user-gold-cdn.xitu.io/2018/12/1/167686a342aa8c87?w=2590&h=1446&f=jpeg&s=231649)
到这里准备工作完成，剩下的就是撸代码了

## 第二步：代码

### node 代码

我们项目加了一层 node(用的是 thinkjs 框架)，所以生成签名(signature)就直接自己搞定；先来几行代码看一下生成签名的顺序。 `这里主要看一下过程，所以没有列出具体的代码实现，只摘了一部分拼凑一下`

```JavaScript
// 随机数
const noncestr = Math.random().toString(36).substr(2);
// 时间戳
const timestamp = parseInt(new Date().getTime() / 1000);
// url
const url = this.ctx.param('url');
// 微信请求地址
const wx = {
    'appId': 'xxxxxxxxx',
    'appSecret': 'xxxxxxxxxx',
    'tokenUrl': `https://api.weixin.qq.com/cgi-bin/token`,
    'ticketUrl': `https://api.weixin.qq.com/cgi-bin/ticket/getticket`
    }
// 获取并存储token
const accessToken = await this.getDataFromCache(
    ACCESS_TOKEN_KEY,
    this.getAccessToken(wx)
);
// 获取并存储ticket
const ticket = await this.getDataFromCache(
    JS_TICKET_KEY,
    this.getJsTicket(wx, accessToken)
);
// 生成
const signature = generateWXSign({
    'jsapi_ticket': ticket,
    'noncestr': noncestr,
    'timestamp': timestamp,
    'url': url
});
return  { noncestr, timestamp, signature, wx.appId }
```

首先我们要拿到 token，通过 token 再获取 ticket，有了 ticket 就可以根据腾讯的算法得到 signature 了！下面来段根据腾讯提供的算法申请签名的代码；还有不知道 url 有什么乱七八糟的字符，所以 decodeURIComponent 是必须的

> token,ticket 这来货 都有时效 2 小时，操作不好就 bug

再附上两个链接，官方的调试工具：

-   验证 appid 和 appsecret
    url: https://mp.weixin.qq.com/debug?token=2058842911&lang=zh_CN
-   验证 signature 是否正确
    url: https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=jsapisign

```JavaScript
import CryptoJS from 'crypto-js';

const genParamsStr = params => {
    const keys = Object.keys(params);
    return keys
        .sort()
        .reduce((ret, key) => {
            if ( params[key]) {
                ret.push(key + '=' + decodeURIComponent(params[key]));
                return ret;
            }
            return '';
        }, [])
        .join('&');
};

module.exports = {
    generateWXSign(panam) {
        let signParam = genParamsStr(panam);
        return CryptoJS.SHA1(signParam).toString();
    }
};
```

最开始的 noncestr 随机数，timestamp 时间戳，url，这三个值在前端代码中，微信配置部分也是需要的，所以生成 signature 后要一起返回；

到这儿 node 部分就结束了吗？no！此处有一个坑会在下面‘填坑’部分讲一下；

### js 部分

先把最基本的事干了，撸一遍官方文档（https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115 ），再引入腾讯的 js，需要注意官网提供的最新版本，然后支持一下 http，https；

```javascript
<script src="//res.wx.qq.com/open/js/jweixin-1.4.0.js" />
```

现在我们再拿出《[微信 JS-SDK 说明文档](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115)》如下，竟然有 4 个填空题！但我不怕，上面的 node 已经返回了，取到直接填上就好了；
有个要注意 debug 这个参数不管对错，设置 true 都 alert；

```javascript
wx.config({
    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: "", // 必填，公众号的唯一标识
    timestamp: "", // 必填，生成签名的时间戳
    nonceStr: "", // 必填，生成签名的随机串
    signature: "", // 必填，签名
    jsApiList: [] // 必填，需要使用的JS接口列表
});
```

附上一个图

![](https://user-gold-cdn.xitu.io/2018/12/1/16769216457534dc?w=1048&h=818&f=jpeg&s=72210)
虽然要废弃 onMenuShareAppMessage，onMenuShareTimeline 但我还是继续延用了，因为 updateAppMessageShareData 他们竟然。。。报错，查了一下好像是版本问题，但已经是最新的 js 还是报错。没有再继续排查问题，既然 sdk 说‘即将废弃’那就是还没废弃，我就偷懒继续用了；

```javascript
wx.ready(() => {
    // 分享好友
    wx.onMenuShareAppMessage({
        title: share.product_title, // 分享标题
        desc: share.product_description, // 分享描述
        link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: share.product_image_url, // 分享图标
        success: function() {
            console.log("onMenuShareAppMessage： success");
        }
    });
    // 分享朋友圈
    wx.onMenuShareTimeline({
        title: share.product_title, // 分享标题
        link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: share.product_image_url, // 分享图标
        success: function() {
            // 用户点击了分享后执行的回调函数
        }
    });
});
```

附上最后的代码，到这一步分享就已经完成了；后面说一下我遇到坑，或者是我自己犯的错；

## 第三步 坑

> 下面列一下我遇到的问题，希望对看到这篇文章的人有所帮助

1.  获取 token，ticket 报的错误 'invalid ip 221.223.000.000, not in whitelist hint:[]'提示的很明显了白名单没配对，解决简单粘贴提示的 ip 到公众号里面的 ip 白名单就好了；

![](https://user-gold-cdn.xitu.io/2018/12/3/1676fe22ef65d16b?w=1320&h=104&f=jpeg&s=47179)

2. 运行刚写完代码也许有个 'invalid signature' 签名错误，也很简单验证一下就好了，上面部分有附上官方测试工具；

![](https://user-gold-cdn.xitu.io/2018/12/3/1676fe5ddb4e79b5?w=1100&h=140&f=jpeg&s=44764)
截图

![](https://user-gold-cdn.xitu.io/2018/12/3/1676fec8bc2c9aa3?w=1438&h=1272&f=jpeg&s=302763)

3.  Error:invalid url domain ,这个错误就是公众号中设置《JS 接口安全域名》设置问题！先看提供的签名 txt 文件没有放对位置，域名对不对别配着正式环境，再测试环境调用。

![](https://user-gold-cdn.xitu.io/2018/12/3/1676fed9a732c6d9?w=788&h=276&f=jpeg&s=29505)

4. 《JS 接口安全域名》保存不了？找不到问题？仔细看一下图中的红框部分！

![](https://user-gold-cdn.xitu.io/2018/12/3/1676ff80189b1211?w=1582&h=392&f=jpeg&s=167235)

5. 还有个事要注意，也是上面 node 部分没有解释的。线上的服务器一般都是多台（负载均衡），而最开始我们是把 token，ticket 缓存在服务器，这就导致了每次访问其中一台，剩下的服务器存的 token，tichet 失效；ok，那就改了用 redis；
6. 到最后了，还不行吗？那看看公众号，开发>接口权限 这个菜单！！！

![](https://user-gold-cdn.xitu.io/2018/12/3/1677005f8645f13c?w=1612&h=516&f=jpeg&s=97346)

7. 最最后了，还有问题吗？请留言！一起看看 😊

# 总结一下

    主要仔细看文档！很多时候都是忽略了一些细节，导致坑了半天。

    越不可思议的bug，越可能是弱X问题导致的！
