const router = require('koa-router')()
const Memobird = require('../memobird')

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.post('/printText', async (ctx, next) => {
  const memobird = new Memobird({ak: '',memobirdID: '',useridentifying: ''})
  ctx.body = {code:1}
  memobird.init()
  .then(() => memobird.printText(ctx.request.body.content))
  .then( res => memobird.status(res.printcontentid, 3000))
  .then(printflag => {
    console.log('检测完成',printflag === 1 ? '打印完成' : '打印未完成')
  })
  .catch((err) => { 
    console.log(err) 
    ctx.body = err
  })
})

router.post('/printImg', async (ctx, next) => {
  const memobird = new Memobird({ak: '',memobirdID: '',useridentifying: ''})
  ctx.body = {code:1}
  memobird.init() 
  .then( res => memobird.printImg(ctx.request.body.content))
  .then( res => memobird.status(res.printcontentid, 3000))
  .then(printflag => {
    console.log('检测完成',printflag === 1 ? '打印完成' : '打印未完成')
  })
  .catch((err) => { 
    console.log(err) 
    ctx.body = err
  })
})

module.exports = router
