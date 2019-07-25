const router = require('koa-router')()
const jwt = require('jsonwebtoken');
const mysqlAddress = require('../mysql/address')
const configStatus = require('../utils/configStatus')

/*
 * @description: 获取收货地址列表
 * @author: lindingfeng
 * @date: 2019-07-24 23:30:50
*/
router.post('/api/getAddress', async (ctx, next) => {
  
  const { token } = ctx.request.body
  const secretOrPrivateKey = 'lindingfeng'
  let verifyToken

  try {
    verifyToken = jwt.verify(token, secretOrPrivateKey)
  } catch (err) {
    console.log('------', err.message === 'jwt expired'?'token已过期':'', '------')
    if (err.message === 'jwt expired') {
      ctx.response.body = configStatus({}, '1010', '登录态已失效')
      return
    }
  }

  try {
    let ret = await mysqlAddress.getAddress(verifyToken.userId)
    ctx.response.body = configStatus({
      addressList: ret
    })
  } catch (err) {
    console.log(err)
  }

})

/*
 * @description: 获取指定收货地址
 * @author: lindingfeng
 * @date: 2019-07-25 23:34:31
*/
router.post('/api/getAddressInfo', async (ctx, next) => {
  
  const { token, addressId } = ctx.request.body
  const secretOrPrivateKey = 'lindingfeng'
  let verifyToken

  try {
    verifyToken = jwt.verify(token, secretOrPrivateKey)
  } catch (err) {
    console.log('------', err.message === 'jwt expired'?'token已过期':'', '------')
    if (err.message === 'jwt expired') {
      ctx.response.body = configStatus({}, '1010', '登录态已失效')
      return
    }
  }

  if (!addressId) {
    ctx.response.body = configStatus({}, '1011', '地址ID不能为空')
    return
  }

  try {
    let ret = await mysqlAddress.getAddressInfo(addressId)
    ctx.response.body = configStatus({
      addressInfo: ret
    })
  } catch (err) {
    console.log(err)
  }

})

/*
 * @description: 添加收货地址
 * @author: lindingfeng
 * @date: 2019-07-24 22:12:05
*/
router.post('/api/addAddress', async (ctx, next) => {
  
  const { token } = ctx.request.body
  const addressInfo = {
    ...ctx.request.body
  }
  const secretOrPrivateKey = 'lindingfeng'
  let verifyToken

  try {
    verifyToken = jwt.verify(token, secretOrPrivateKey)
    addressInfo.userId = verifyToken.userId
  } catch (err) {
    console.log('------', err.message === 'jwt expired'?'token已过期':'', '------')
    if (err.message === 'jwt expired') {
      ctx.response.body = configStatus({}, '1010', '登录态已失效')
      return
    }
  }

  try {
    await mysqlAddress.addAddress(addressInfo)
    ctx.response.body = configStatus()
  } catch (err) {
    console.log(err.errno)
  }

})

module.exports = router