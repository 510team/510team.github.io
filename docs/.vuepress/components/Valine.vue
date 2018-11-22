<template>
    <div id="vcomments"></div>
</template>

<script>
export default {
  name: 'Valine',
  mounted: function(){
    // require window 
    const Valine = require('valine');
    if (typeof window !== 'undefined') {
      this.window = window
      window.AV = require('leancloud-storage')
      
    }
     
    new Valine({
      el: '#vcomments' ,
      appId: 'lktWNW6mwJQqQBjiiIHE9EbR-gzGzoHsz',// your appId
      appKey: 'lUvgf4FUvAMqHSxUtQMb8WtB', // your appKey
      notify:false, 
      verify:false, 
      avatar:'mm', 
      placeholder: '这里可以输入评论' 
    });
  },
}
</script>