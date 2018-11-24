import Vue from 'vue'
Vue.component("pay", () => import("/Users/tong.wu/uds/510team/510team.github.io/docs/.vuepress/components/pay.vue"))
import ThemeLayout from '@themeLayout'
import ThemeNotFound from '@themeNotFound'
import { injectMixins } from '@app/util'
import rootMixins from '@app/root-mixins'

injectMixins(ThemeLayout, rootMixins)
injectMixins(ThemeNotFound, rootMixins)

export const routes = [
  {
    name: "v-4f4e77f304b6e",
    path: "/",
    component: ThemeLayout,
    beforeEnter: (to, from, next) => {
      import("/Users/tong.wu/uds/510team/510team.github.io/docs/README.md").then(comp => {
        Vue.component("v-4f4e77f304b6e", comp.default)
        next()
      })
    }
  },
  {
    path: "/index.html",
    redirect: "/"
  },
  {
    name: "v-a802bb93e81fb",
    path: "/foreword/",
    component: ThemeLayout,
    beforeEnter: (to, from, next) => {
      import("/Users/tong.wu/uds/510team/510team.github.io/docs/foreword/README.md").then(comp => {
        Vue.component("v-a802bb93e81fb", comp.default)
        next()
      })
    }
  },
  {
    path: "/foreword/index.html",
    redirect: "/foreword/"
  },
  {
    name: "v-fe8177ca4d6a7",
    path: "/foreword/flow.html",
    component: ThemeLayout,
    beforeEnter: (to, from, next) => {
      import("/Users/tong.wu/uds/510team/510team.github.io/docs/foreword/flow.md").then(comp => {
        Vue.component("v-fe8177ca4d6a7", comp.default)
        next()
      })
    }
  },
  {
    name: "v-b725ff3ee2842",
    path: "/foreword/rollup.html",
    component: ThemeLayout,
    beforeEnter: (to, from, next) => {
      import("/Users/tong.wu/uds/510team/510team.github.io/docs/foreword/rollup.md").then(comp => {
        Vue.component("v-b725ff3ee2842", comp.default)
        next()
      })
    }
  },
  {
    name: "v-066beea62685f",
    path: "/pay/",
    component: ThemeLayout,
    beforeEnter: (to, from, next) => {
      import("/Users/tong.wu/uds/510team/510team.github.io/docs/pay/README.md").then(comp => {
        Vue.component("v-066beea62685f", comp.default)
        next()
      })
    }
  },
  {
    path: "/pay/index.html",
    redirect: "/pay/"
  },
  {
    name: "v-9a990b97541ba",
    path: "/vue/",
    component: ThemeLayout,
    beforeEnter: (to, from, next) => {
      import("/Users/tong.wu/uds/510team/510team.github.io/docs/vue/README.md").then(comp => {
        Vue.component("v-9a990b97541ba", comp.default)
        next()
      })
    }
  },
  {
    path: "/vue/index.html",
    redirect: "/vue/"
  },
  {
    name: "v-e27597a25cf4a",
    path: "/vue/entry.html",
    component: ThemeLayout,
    beforeEnter: (to, from, next) => {
      import("/Users/tong.wu/uds/510team/510team.github.io/docs/vue/entry.md").then(comp => {
        Vue.component("v-e27597a25cf4a", comp.default)
        next()
      })
    }
  },
  {
    name: "v-1eb829cf03692",
    path: "/vue/init.html",
    component: ThemeLayout,
    beforeEnter: (to, from, next) => {
      import("/Users/tong.wu/uds/510team/510team.github.io/docs/vue/init.md").then(comp => {
        Vue.component("v-1eb829cf03692", comp.default)
        next()
      })
    }
  },
  {
    name: "v-d664cb4a3eba9",
    path: "/vue/observer.html",
    component: ThemeLayout,
    beforeEnter: (to, from, next) => {
      import("/Users/tong.wu/uds/510team/510team.github.io/docs/vue/observer.md").then(comp => {
        Vue.component("v-d664cb4a3eba9", comp.default)
        next()
      })
    }
  },
  {
    path: '*',
    component: ThemeNotFound
  }
]