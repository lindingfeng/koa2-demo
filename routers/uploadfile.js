const router = require('koa-router')()
const fs = require('mz/fs')
const path = require('path')
const configStatus = require('../utils/configStatus')

router.post('/api/uploadfile', async (ctx, next) => {
  // 获取上传文件
  const file = ctx.request.files.file
  // 创建可读流
  const reader = fs.createReadStream(file.path)
  // 设置图片目录
  const filePath = path.join(__dirname, `../public/static/${file.name}`)
  // 创建可写流
  const upStream = fs.createWriteStream(filePath)
  // 可读流通过管道写入可写流
  reader.pipe(upStream)
  ctx.response.body = configStatus({
    src: `http://${ctx.request.host}/static/${file.name}`
  })
})

module.exports = router