const router = require('koa-router')()
const mime = require('mime')
const fs = require('mz/fs')
const path = require('path')

/*
 * @Description: 返回html模板
 * @Author: lindingfeng
 * @Date: 2019-07-11 19:24:11
*/
router.get('/', async (ctx, next) => {
  const completePath = path.resolve(__dirname, '../public', 'index.html')
  // 查询文件是否存在
  if (fs.existsSync(completePath)) {
    ctx.response.type = mime.getType(completePath)
    ctx.response.body = await fs.readFile(completePath)
  } else {
    // 文件不存在
    ctx.response.status = 404
  }
})

module.exports = router