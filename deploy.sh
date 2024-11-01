#确保脚本抛出遇到的错误
set -e

#生成静态文件
npm run build

#进入生成的文件夹，这里是默认的路径，可以自定义
cd .vuepress/dist

#如果是发布到自定义域名
#echo 'www.isunbeam.cn'>CNAME

git init
git add -A
git commit -m 'deploy'

#如果发布到https://<USERNAME>.github.io/<REPO>
#git push -f git@github.com:<USERNAME>/<REPO>.git master:<BranchName>
git push -f https://github.com/foolboys/foolboys.github.io.git master:blogs

cd -

#最后发布的时候执行 bash deploy.sh
