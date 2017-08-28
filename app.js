const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const moment = require('moment')
const axios = require('axios')
const config= require('./config')
const Memobird = require('./memobird')

const index = require('./routes/index')
const users = require('./routes/users')

const memobird = new Memobird({ak: '786f78a1ea2f43beba7ba2b68949ae34',memobirdID: '290c93e55b890d8a',useridentifying: '929019'})
let text = 
`
多行
文本
测试
`
memobird.init()
//.then(() => memobird.printText(text))
.then(res => memobird.printImg('./images/GitHub-Mark.png'))
.then( res => memobird.status(res.printcontentid, 3000))
.then( res => { console.log(res.printflag === 1 ? '打印完成' : '打印未完成') })
.catch((err) => { console.log(err) })




// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

module.exports = app
