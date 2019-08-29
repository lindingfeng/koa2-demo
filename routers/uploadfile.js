const router = require('koa-router')()
const fs = require('mz/fs')
const path = require('path')
const configStatus = require('../utils/configStatus')
const { uploadUseQiniu } = require('../utils')

router.post('/api/uploadfile', async (ctx, next) => {
  // 获取上传文件
  const file = ctx.request.files.file
  console.log(file)
  // 创建可读流
  const reader = fs.createReadStream(file.path)
  // 设置图片目录
  const filePath = path.join(__dirname, `../public/static/${file.name}`)
  // 创建可写流
  const upStream = fs.createWriteStream(filePath)
  // 可读流通过管道写入可写流
  reader.pipe(upStream)
  // console.log(ctx.request.origin)
  // console.log(`${ctx.request.origin}/static/${file.name}`)
  ctx.response.body = configStatus({
    src: `https://static.lindf.com/static/${file.name}`
  })
})

/*
 * @description: 七牛云上传
 * @author: lindingfeng
 * @date: 2019-08-29 22:41:21
*/
router.post('/api/qiniu', async (ctx, next) => {
  // 获取上传文件
  const file = ctx.request.files.file
  // 创建可读流
  const readableStream = fs.createReadStream(file.path)

  try {
    let ret = await uploadUseQiniu('static', readableStream)
    ctx.response.body = configStatus({
      src: `http://s1.lindf.com/${ret.key}`
    })
  } catch (err) {
    console.log(err.errno)
  }

})

module.exports = router