set -e

# 生成静态文件
npm run docs:build

# 进入生成的文件夹
cd docs/.vuepress/dist


git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:510team/510team.github.io.git master
#git push -f git@git.dev.tencent.com:team510/510team.git master
