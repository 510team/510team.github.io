import Vue from 'vue'
Vue.component("pay", () => import("/Users/xiaogai.li/Documents/510team/510team.github.io/docs/.vuepress/components/pay.vue"))
import ThemeLayout from '@themeLayout'
import ThemeNotFound from '@themeNotFound'
import { injectMixins } from '@app/util'
import rootMixins from '@app/root-mixins'

injectMixins(ThemeLayout, rootMixins)
injectMixins(ThemeNotFound, rootMixins)

export const routes = [
  {
    name: "v-7b91df5d73aa",
    path: "/",
    component: ThemeLayout,
    beforeEnter: (to, from, next) => {
      import("/Users/xiaogai.li/Documents/510team/510team.github.io/docs/README.md").then(comp => {
        Vue.component("v-7b91df5d73aa", comp.default)
        next()
      })
    }
  },
  {
    path: "/index.html",
    redirect: "/"
  },
  {
    name: "v-5455596505143",
    path: "/foreword/",
    component: ThemeLayout,
    beforeEnter: (to, from, next) => {
      import("/Users/xiaogai.li/Documents/510team/510team.github.io/docs/foreword/README.md").then(comp => {
        Vue.component("v-5455596505143", comp.default)
        next()
      })
    }
  },
  {
    path: "/foreword/index.html",
    redirect: "/foreword/"
  },
  {
    name: "v-b092a8230cbfa",
    path: "/foreword/flow.html",
    component: ThemeLayout,
    beforeEnter: (to, from, next) => {
      import("/Users/xiaogai.li/Documents/510team/510team.github.io/docs/foreword/flow.md").then(comp => {
        Vue.component("v-b092a8230cbfa", comp.default)
        next()
      })
    }
  },
  {
    name: "v-f5d5090a54609",
    path: "/foreword/rollup.html",
    component: ThemeLayout,
    beforeEnter: (to, from, next) => {
      import("/Users/xiaogai.li/Documents/510team/510team.github.io/docs/foreword/rollup.md").then(comp => {
        Vue.component("v-f5d5090a54609", comp.default)
        next()
      })
    }
  },
  {
    name: "v-a7db60abd7512",
    path: "/pay/",
    component: ThemeLayout,
    beforeEnter: (to, from, next) => {
      import("/Users/xiaogai.li/Documents/510team/510team.github.io/docs/pay/README.md").then(comp => {
        Vue.component("v-a7db60abd7512", comp.default)
        next()
      })
    }
  },
  {
    path: "/pay/index.html",
    redirect: "/pay/"
  },
  {
    name: "v-613f3514acc1c",
    path: "/vue/",
    component: ThemeLayout,
    beforeEnter: (to, from, next) => {
      import("/Users/xiaogai.li/Documents/510team/510team.github.io/docs/vue/README.md").then(comp => {
        Vue.component("v-613f3514acc1c", comp.default)
        next()
      })
    }
  },
  {
    path: "/vue/index.html",
    redirect: "/vue/"
  },
  {
    name: "v-62328644003b5",
    path: "/vue/entry.html",
    component: ThemeLayout,
    beforeEnter: (to, from, next) => {
      import("/Users/xiaogai.li/Documents/510team/510team.github.io/docs/vue/entry.md").then(comp => {
        Vue.component("v-62328644003b5", comp.default)
        next()
      })
    }
  },
  {
    name: "v-d64b2fef63941",
    path: "/vue/init.html",
    component: ThemeLayout,
    beforeEnter: (to, from, next) => {
      import("/Users/xiaogai.li/Documents/510team/510team.github.io/docs/vue/init.md").then(comp => {
        Vue.component("v-d64b2fef63941", comp.default)
        next()
      })
    }
  },
  {
    name: "v-ef870d08dd6ce",
    path: "/vue/observer.html",
    component: ThemeLayout,
    beforeEnter: (to, from, next) => {
      import("/Users/xiaogai.li/Documents/510team/510team.github.io/docs/vue/observer.md").then(comp => {
        Vue.component("v-ef870d08dd6ce", comp.default)
        next()
      })
    }
  },
  {
    name: "v-aa9bdca8e14fc",
    path: "/vue/patch.html",
    component: ThemeLayout,
    beforeEnter: (to, from, next) => {
      import("/Users/xiaogai.li/Documents/510team/510team.github.io/docs/vue/patch.md").then(comp => {
        Vue.component("v-aa9bdca8e14fc", comp.default)
        next()
      })
    }
  },
  {
    name: "v-aab0a5df33767",
    path: "/wxShare/",
    component: ThemeLayout,
    beforeEnter: (to, from, next) => {
      import("/Users/xiaogai.li/Documents/510team/510team.github.io/docs/wxShare/README.md").then(comp => {
        Vue.component("v-aab0a5df33767", comp.default)
        next()
      })
    }
  },
  {
    path: "/wxShare/index.html",
    redirect: "/wxShare/"
  },
  {
    path: '*',
    component: ThemeNotFound
  }
]