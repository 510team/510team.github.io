<template>
    <div class="pay-wrap">
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
<style>
.pay-wrap {
  display: flex;
  flex-direction: column;
  position: fixed;
  bottom: 80px;
  right: 28px;
  /* width: 100%; */
  /* justify-content: space-around; */
}
.pay-wrap img {
  width: 120px;
  height: 120px;
}
.pay-wrap .block {
  display: block;
  text-align: center;
}
</style>
