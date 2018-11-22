import Vue from 'vue'
Vue.component("Valine", () => import("/Users/tong.wu/uds/510team/510team.github.io/docs/.vuepress/components/Valine.vue"))
import ThemeLayout from '@themeLayout'
import ThemeNotFound from '@themeNotFound'
import { injectMixins } from '@app/util'
import rootMixins from '@app/root-mixins'

injectMixins(ThemeLayout, rootMixins)
injectMixins(ThemeNotFound, rootMixins)

export const routes = [
  {
    name: "v-f3a6d587c0368",
    path: "/",
    component: ThemeLayout,
    beforeEnter: (to, from, next) => {
      import("/Users/tong.wu/uds/510team/510team.github.io/docs/README.md").then(comp => {
        Vue.component("v-f3a6d587c0368", comp.default)
        next()
      })
    }
  },
  {
    path: "/index.html",
    redirect: "/"
  },
  {
    name: "v-9ef5567b8b71f",
    path: "/foreword/",
    component: ThemeLayout,
    beforeEnter: (to, from, next) => {
      import("/Users/tong.wu/uds/510team/510team.github.io/docs/foreword/README.md").then(comp => {
        Vue.component("v-9ef5567b8b71f", comp.default)
        next()
      })
    }
  },
  {
    path: "/foreword/index.html",
    redirect: "/foreword/"
  },
  {
    name: "v-19414ad558ee3",
    path: "/foreword/flow.html",
    component: ThemeLayout,
    beforeEnter: (to, from, next) => {
      import("/Users/tong.wu/uds/510team/510team.github.io/docs/foreword/flow.md").then(comp => {
        Vue.component("v-19414ad558ee3", comp.default)
        next()
      })
    }
  },
  {
    name: "v-5e4066b3d2202",
    path: "/foreword/rollup.html",
    component: ThemeLayout,
    beforeEnter: (to, from, next) => {
      import("/Users/tong.wu/uds/510team/510team.github.io/docs/foreword/rollup.md").then(comp => {
        Vue.component("v-5e4066b3d2202", comp.default)
        next()
      })
    }
  },
  {
    name: "v-7430d03196e61",
    path: "/vue/",
    component: ThemeLayout,
    beforeEnter: (to, from, next) => {
      import("/Users/tong.wu/uds/510team/510team.github.io/docs/vue/README.md").then(comp => {
        Vue.component("v-7430d03196e61", comp.default)
        next()
      })
    }
  },
  {
    path: "/vue/index.html",
    redirect: "/vue/"
  },
  {
    name: "v-3acc243b768c",
    path: "/vue/entry.html",
    component: ThemeLayout,
    beforeEnter: (to, from, next) => {
      import("/Users/tong.wu/uds/510team/510team.github.io/docs/vue/entry.md").then(comp => {
        Vue.component("v-3acc243b768c", comp.default)
        next()
      })
    }
  },
  {
    name: "v-87a004806b069",
    path: "/vue/init.html",
    component: ThemeLayout,
    beforeEnter: (to, from, next) => {
      import("/Users/tong.wu/uds/510team/510team.github.io/docs/vue/init.md").then(comp => {
        Vue.component("v-87a004806b069", comp.default)
        next()
      })
    }
  },
  {
    name: "v-9416537621734",
    path: "/vue/observer.html",
    component: ThemeLayout,
    beforeEnter: (to, from, next) => {
      import("/Users/tong.wu/uds/510team/510team.github.io/docs/vue/observer.md").then(comp => {
        Vue.component("v-9416537621734", comp.default)
        next()
      })
    }
  },
  {
    path: '*',
    component: ThemeNotFound
  }
]