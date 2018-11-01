module.exports = {
  title: "菜鸟教你一步一步读Vue源码",
  description: "菜鸟教你一步一步读Vue源码",
  base: "/",
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
      }
    ]
  },
  markdown: {
    lineNumbers: true
  }
};
