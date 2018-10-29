module.exports = {
    title: "菜鸟教你一步一步读Vue源码",
    description: "菜鸟教你一步一步读Vue源码",
    base: "/",
    themeConfig: {
        displayAllHeaders: true, // 默认值：false
        nav: [{ text: "首页", link: "/" }],
        sidebar: [
            {
                title: "指南",
                collapsable: false,
                children: [["/flow", "flow"]]
            }
        ]
    }
};
