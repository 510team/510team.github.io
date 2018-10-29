# 团队博客

博客采用 vuepress 搭建。所有文档编写采用 markdown 语法。项目共两个分支 dev， 和 master。dev 是源文件，master 分支是 vuepress 生成的静态 html，githubpage 会读取 master 的静态文件。

### 起步

本地编写文档命令（dev 分支）

```
 npm run dev
```

根据 markdown 编译生成静态网站

```
npm run docs:build
```

写好了发布文章到服务端.该命令会将编译好的文章发布至 master 分支。（dev 分支）

```
 sh deploy.sh
```
