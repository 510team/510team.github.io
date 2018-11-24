<template>
    <div class="pay-wrap-component">
        <div>
            <span class="block">支付宝</span>
            <img width="200" src="/alipay.jpeg">

        </div>
        <div>
            <span class="block">微信</span>
            <img width="200" src="/wechatpay.png">

        </div>
    </div>
</template>
<script>
export default {
    
}
</script>
<style >
.pay-wrap-component {
  display: flex;
  width: 100%;
  justify-content: space-around;
}
.pay-wrap-component img {
  width: 200px;
  height: 200px;
}
.pay-wrap-component .block {
  display: block;
  text-align: center;
}
</style>
