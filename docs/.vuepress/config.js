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
        nav: [
            { text: "首页", link: "/" },
            {
                text: "GitHub",
                link: "https://github.com/510team"
            }
        ],
        sidebar: [
            {
                title: "捐赠",
                collapsable: false,
                children: [["/pay/", "喝杯咖啡"]]
            },
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
                    ["/vue/init", "初始化"],
                    ["/vue/observer", "数据观测"],
                    ["/vue/patch", "diff算法与patch"]
                ]
            },
            {
                title: "Vuex",
                collapsable: false,
                children: [
                    ["/vuex/", "vuex介绍"],
                    ["/vuex/source", "vuex源码分析"]
                ]
            },
            {
                title: "番外篇",
                collapsable: false,
                children: [
                    ["/wxShare/", "微信分享"],
                    ["/wxShare/optimize", "部分优化"]
                ]
            },
            {
                title: "每周新闻",
                collapsable: false,
                children: [["/weeklyReport/", "2018-12-17"]]
            }
        ],
        pages: [
            {
                path: "/vue/patchVnode",
                title: "patchVnode",
                frontmatter: {}
            },
            {
                path: "/vue/updateChildren",
                title: "UpdateChildren",
                frontmatter: {}
            }
        ]
    },

    markdown: {
        lineNumbers: true
    }
};
