<template>
    <div v-if="1">
        <div class="valine" id="vcomments"></div>
    </div>
</template>

<script>
export default {
  name: 'Valine',
  computed: {
    data () {
      console.log(this.$page)
      return this.$page.frontmatter
    }
  },
  mounted: function () {
    // require window
    const Valine = require('valine')
    if (typeof window !== 'undefined') {
      this.window = window
      window.AV = require('leancloud-storage')
    }

    new Valine({
      el: '#vcomments',
      appId: 'lktWNW6mwJQqQBjiiIHE9EbR-gzGzoHsz', // your appId
      appKey: 'lUvgf4FUvAMqHSxUtQMb8WtB', // your appKey
      notify: false,
      verify: false,
      avatar: 'mm',
      placeholder: '欢迎留言与我分享您的想法...'
    })
  },
  watch: {
    '$route' (to, from) {
      if (to.path !== from.path) {
        this.$router.go(0)
      }
    }
  }
}
</script>
<style>
.valine {
  max-width: 740px;
  margin: 0 auto;
  padding: 2rem 2.5rem;
}
</style>
