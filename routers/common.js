const router = require('koa-router')()
const axios = require('axios')
const sha1 = require('sha1')
const configStatus = require('../utils/configStatus')
const { buildRamStr } = require('../utils')

/*
 * @Description: 微信jssdk签名
 * @Author: lindingfeng
 * @Date: 2019-08-28 16:02:54
*/
router.post('/api/getWxSign', async (ctx, next) => {

  const {
    url
  } = ctx.request.body

  let nonceStr = buildRamStr(16)
  let timestamp = parseInt(new Date() / 1000)
  let signature = ''
  let access_token_data = await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxa8c250966f9dda3f&secret=6b92e246287ab25b64aa58ca7e6cfe38`)
  let jsapi_ticket_data = await axios.get(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token_data.data.access_token}&type=jsapi`)
  let signStr = `jsapi_ticket=${jsapi_ticket_data.data.ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url || 'https://www.lindf.com/jssdk.html'}`
  // console.log(access_token_data.data)
  // console.log(jsapi_ticket_data.data)
  // console.log(signStr)
  signature = sha1(signStr)
  // console.log(signature)
  ctx.response.body = configStatus({
    signInfo: {
      appId: 'wxa8c250966f9dda3f',
      timestamp,
      nonceStr,
      signature
    },
  })

})

module.exports = router