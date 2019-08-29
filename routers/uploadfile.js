const router = require('koa-router')()
const fs = require('mz/fs')
const path = require('path')
const qiniu = require('qiniu')
const configStatus = require('../utils/configStatus')

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

router.post('/api/qiniu', async (ctx, next) => {
  // 获取上传文件
  const file = ctx.request.files.file
  // 创建可读流
  const readableStream = fs.createReadStream(file.path)
  
  //需要填写你的 Access Key 和 Secret Key
  qiniu.conf.ACCESS_KEY = '07cNA0MRmRdC0saj02AeoG_UJOwUSlkonrFWP_EK'
  qiniu.conf.SECRET_KEY = '4WPSaPhzGe9Cjmh1os8rwZ6dUYVz8NgxDRXuk2mN'
  // const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

  //要上传的空间
  const bucket ='static'
  console.log(bucket)
  const config = new qiniu.conf.Config()
  // console.log(config)
  config.zone = qiniu.zone.Zone_z2

  //上传到七牛后保存的文件名
  const key = ''

  const options = {
    scope: `${bucket}:'6666.jpg'`
  }

  //构建上传策略函数
  function uptoken(bucket, key) {
    let putPolicy = new qiniu.rs.PutPolicy(options)
    return putPolicy.uploadToken()
  }

  //生成上传 Token
  const token = uptoken(bucket, key)

  //构造上传函数
  function uploadFile(uptoken, key, readableStream) {
    console.log(readableStream)
    let formUploader = new qiniu.form_up.FormUploader(config)
    let extra = new qiniu.form_up.PutExtra()
    formUploader.putStream(uptoken, key, readableStream, extra,
      (respErr, respBody, respInfo) => {
        if (respErr) {
          throw respErr
        }
        if (respInfo.statusCode == 200) {
          console.log(respBody)
        } else {
          console.log(respInfo.statusCode)
          console.log(respBody)
        }
    })
  }
  
  //调用uploadFile上传
  uploadFile(token, key, readableStream)

})

module.exports = router