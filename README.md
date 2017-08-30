# 咕咕机后台

## 运行方法
需node.js环境  
git clone或下载zip包，文件夹内
```js
 npm install 
```
然后在routers文件夹的index.js的三个路由里面分别填入相关信息
```
new Memobird({ak: '',memobirdID: '',useridentifying: ''})
```
```
 npm start / npm run dev
```
项目是koa2默认生成的默认监听3000端口