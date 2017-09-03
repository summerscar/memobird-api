# 咕咕机后台

[才买的咕咕机,研究了一下简单的玩法](http://summerscar.me/2017/08/29/%E5%92%95%E5%92%95%E6%9C%BA-%E4%B8%80%E5%8F%B0%E6%9C%89%E8%B6%A3%E7%9A%84%E6%89%93%E5%8D%B0%E6%9C%BA/)

## 运行方法

需node.js环境

git clone或下载zip包，在文件夹内安装依赖

```bash
 npm install
```

然后在config.js中填入相关信息（前提是已经向咕咕机官方发邮件获取了appkey）  
PS: ak,设备id，还一个userID(这个不清楚什么意思，我直接填的咕咕ID)

```bash
//运行后台
 npm start / npm run dev
```

项目是koa2默认生成的，默认监听3000端口  浏览器输入 http://localhost:3000/  有画面，那后台就启动成功了

## 调用地址

* 打印文本
  * 请求地址（POST）： http://服务器IP:3000/printText
  * 请求BODY：  ```{content: '需打印的字符'}```

* 打印图片

  >打印图片前必须安装一个GraphicsMagick软件 [地址](http://www.graphicsmagick.org/download.html)
  * 请求地址（POST）： http://服务器IP:3000/printImg
  * 请求BODY：  ```{content: '图片url'}```

* 打印混合内容
  * 请求地址（POST）： http://服务器IP:3000/printMutilContent
  * 请求BODY：
    ```js
    {content: [{type:'text',content:'需打印的字符'},{type:'image',content:'图片地址'}]}
    ```
>本机调用的话ip就是127.0.0.1/localhost,如果调用了没反应检查下后台的console.log

## 推荐的使用方法

很多人推荐IFTTT，我看了下总觉得有点麻烦，我强力推荐[node-red平台](https://bb.goiot.cc/category/7/%E5%85%A5%E9%97%A8-tutorial)用来做监测，详见[上方的博客链接]((http://summerscar.me/2017/08/29/%E5%92%95%E5%92%95%E6%9C%BA-%E4%B8%80%E5%8F%B0%E6%9C%89%E8%B6%A3%E7%9A%84%E6%89%93%E5%8D%B0%E6%9C%BA/))

* eg：定时获取[一言](https://sslapi.hitokoto.cn/)的flow(在node-red右上方import这段代码即可)

```js
[{"id":"c05f930b.68a33","type":"http request","z":"6284656.d09a29c","name":"hitokoto","method":"GET","ret":"obj","url":"https://sslapi.hitokoto.cn/","tls":"","x":431,"y":162,"wires":[["4383a923.5a6698"]]},{"id":"f831778a.769438","type":"inject","z":"6284656.d09a29c","name":"间隔打印","topic":"","payload":"","payloadType":"date","repeat":"14400","crontab":"","once":false,"x":183,"y":150,"wires":[["c05f930b.68a33"]]},{"id":"4383a923.5a6698","type":"function","z":"6284656.d09a29c","name":"处理输入","func":"\nlet text =\n`\n--------------------------------\n               一言\n        \n  ${msg.payload.hitokoto}\n\n                ---${msg.payload.from}\n--------------------------------\n`\nmsg.payload = {content: text}\nreturn msg;","outputs":1,"noerr":0,"x":639,"y":163,"wires":[["c0a30def.29e2c","7aac15b5.09a94c"]]},{"id":"7aac15b5.09a94c","type":"debug","z":"6284656.d09a29c","name":"","active":true,"console":"false","complete":"payload","x":1073,"y":165,"wires":[]},{"id":"c0a30def.29e2c","type":"http request","z":"6284656.d09a29c","name":"修改此处的URL地址","method":"POST","ret":"obj","url":"http://IP:3000/printText","tls":"","x":885,"y":207,"wires":[["7aac15b5.09a94c"]]},{"id":"8e247114.aae1e","type":"comment","z":"6284656.d09a29c","name":"一言","info":"","x":116,"y":90,"wires":[]}]
```

* node-red还自带ui界面（见上方博客），所以很简单就能撸出一个前端界面控制远程打印


另外推荐一个大佬的[微博订阅RSS](https://github.com/DIYgod/Weibo2RSS)，同理，直接用node-red订阅这个RSS然后，调用这个后台接口，还不美滋滋（但我还缺了点那啥，也没什么好订阅的(T_T)）

>推荐一个在线的[node-red平台](https://goiot.cc/)，但存在inject输入指定时间无法触发的bug，后来我还是把node-red架到自己的windows服务器上了

## API的单独的使方法（见router文件夹内index.js的路由）

```JavaScript
const memobird = new Memobird({ak: config.ak,memobirdID: config.memobirdID,useridentifying: config.useridentifying})
memobird.init()
.then(() => memobird.printText(ctx.request.body.content))
.then( res => memobird.status(res.printcontentid, 3000))
.then(printflag => {
console.log('检测完成',printflag === 1 ? '打印完成' : '打印未完成')
})
.catch((err) => {
console.log(err)
})
```
