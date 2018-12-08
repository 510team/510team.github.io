import Vue from 'vue'
Vue.component("pay", () => import("/Users/zilong.hao/haozilong/document/510team/docs/.vuepress/components/pay.vue"))
import ThemeLayout from '@themeLayout'
import ThemeNotFound from '@themeNotFound'
import { injectMixins } from '@app/util'
import rootMixins from '@app/root-mixins'

injectMixins(ThemeLayout, rootMixins)
injectMixins(ThemeNotFound, rootMixins)

export const routes = [
  {
    name: "v-a9bf7d5e55cd9",
    path: "/",
    component: ThemeLayout,
    beforeEnter: (to, from, next) => {
      import("/Users/zilong.hao/haozilong/document/510team/docs/README.md").then(comp => {
        Vue.component("v-a9bf7d5e55cd9", comp.default)
        next()
      })
    }
  },
  {
    path: "/index.html",
    redirect: "/"
  },
  {
    name: "v-687d8f343e7d",
    path: "/foreword/",
    component: ThemeLayout,
    beforeEnter: (to, from, next) => {
      import("/Users/zilong.hao/haozilong/document/510team/docs/foreword/README.md").then(comp => {
        Vue.component("v-687d8f343e7d", comp.default)
        next()
      })
    }
  },
  {
    path: "/foreword/index.html",
    redirect: "/foreword/"
  },
  {
    name: "v-344dcce82309b",
    path: "/foreword/flow.html",
    component: ThemeLayout,
    beforeEnter: (to, from, next) => {
      import("/Users/zilong.hao/haozilong/document/510team/docs/foreword/flow.md").then(comp => {
        Vue.component("v-344dcce82309b", comp.default)
        next()
      })
    }
  },
  {
    name: "v-939cef71b32d1",
    path: "/foreword/rollup.html",
    component: ThemeLayout,
    beforeEnter: (to, from, next) => {
      import("/Users/zilong.hao/haozilong/document/510team/docs/foreword/rollup.md").then(comp => {
        Vue.component("v-939cef71b32d1", comp.default)
        next()
      })
    }
  },
  {
    name: "v-954469e96d468",
    path: "/pay/",
    component: ThemeLayout,
    beforeEnter: (to, from, next) => {
      import("/Users/zilong.hao/haozilong/document/510team/docs/pay/README.md").then(comp => {
        Vue.component("v-954469e96d468", comp.default)
        next()
      })
    }
  },
  {
    path: "/pay/index.html",
    redirect: "/pay/"
  },
  {
    name: "v-4ab437ac2171d",
    path: "/vue/",
    component: ThemeLayout,
    beforeEnter: (to, from, next) => {
      import("/Users/zilong.hao/haozilong/document/510team/docs/vue/README.md").then(comp => {
        Vue.component("v-4ab437ac2171d", comp.default)
        next()
      })
    }
  },
  {
    path: "/vue/index.html",
    redirect: "/vue/"
  },
  {
    name: "v-c829241e9bdc7",
    path: "/vue/entry.html",
    component: ThemeLayout,
    beforeEnter: (to, from, next) => {
      import("/Users/zilong.hao/haozilong/document/510team/docs/vue/entry.md").then(comp => {
        Vue.component("v-c829241e9bdc7", comp.default)
        next()
      })
    }
  },
  {
    name: "v-fd2638fcbc917",
    path: "/vue/init.html",
    component: ThemeLayout,
    beforeEnter: (to, from, next) => {
      import("/Users/zilong.hao/haozilong/document/510team/docs/vue/init.md").then(comp => {
        Vue.component("v-fd2638fcbc917", comp.default)
        next()
      })
    }
  },
  {
    name: "v-11fed63f62447",
    path: "/vue/observer.html",
    component: ThemeLayout,
    beforeEnter: (to, from, next) => {
      import("/Users/zilong.hao/haozilong/document/510team/docs/vue/observer.md").then(comp => {
        Vue.component("v-11fed63f62447", comp.default)
        next()
      })
    }
  },
  {
    name: "v-e593d8a1de0e8",
    path: "/wxShare/",
    component: ThemeLayout,
    beforeEnter: (to, from, next) => {
      import("/Users/zilong.hao/haozilong/document/510team/docs/wxShare/README.md").then(comp => {
        Vue.component("v-e593d8a1de0e8", comp.default)
        next()
      })
    }
  },
  {
    path: "/wxShare/index.html",
    redirect: "/wxShare/"
  },
  {
    name: "v-415dab1e1157d",
    path: "/wxShare/optimize.html",
    component: ThemeLayout,
    beforeEnter: (to, from, next) => {
      import("/Users/zilong.hao/haozilong/document/510team/docs/wxShare/optimize.md").then(comp => {
        Vue.component("v-415dab1e1157d", comp.default)
        next()
      })
    }
  },
  {
    path: '*',
    component: ThemeNotFound
  }
]