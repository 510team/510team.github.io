module.exports = {
  title: "菜鸟教你一步一步读Vue源码",
  description: "菜鸟教你一步一步读Vue源码",
  base: "/",
  head: [
    ["link", { rel: "icon", href: `/favicon.ico` }],
    ["meta", { name: "theme-color", content: "#3eaf7c" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    [
      "meta",
      { name: "apple-mobile-web-app-status-bar-style", content: "black" }
    ]
  ],

  themeConfig: {
    displayAllHeaders: true, // 默认值：false
    nav: [{ text: "首页", link: "/" }],
    sidebar: [
      {
        title: "前情提要",
        collapsable: false,
        children: [
          ["/foreword/", "介绍"],
          ["/foreword/flow", "Flow"],
          ["/foreword/rollup", "Rollup"]
        ]
      },
      {
        title: "Vue",
        collapsable: false,
        children: [
          ["/vue/", "介绍"],
          ["/vue/entry", "查找入口文件"],
          ["/vue/observer", "数据观测"]
        ]
      }
    ]
  },
  markdown: {
    lineNumbers: true
  }
};
