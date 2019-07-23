const router = require('koa-router')()
const jwt = require('jsonwebtoken');
const mysqlShop = require('../mysql/shop')
const configStatus = require('../utils/configStatus')

/*
 * @description: 添加商品分类
 * @author: lindingfeng
 * @date: 2019-07-20 14:49:21
*/
router.post('/api/addCategory', async (ctx, next) => {

  const { shopCategory } = ctx.request.body

  try {
    let ret = await mysqlShop.addCategory(shopCategory)
    if (+ret.status === 1) {
      ctx.response.body = configStatus()
    } else if (+ret.status === 2) {
      ctx.response.body = configStatus({}, 1008, '该分类已存在')
    }
  } catch (err) {
    console.log(err)
  }

})

/*
 * @description: 获取商品分类
 * @author: lindingfeng
 * @date: 2019-07-20 15:32:52
*/
router.post('/api/getCategory', async (ctx, next) => {

  try {
    let ret = await mysqlShop.getCategory()
    ctx.response.body = configStatus({
      categoryList: ret
    })
  } catch (err) {
    console.log(err)
  }

})

/*
 * @description: 添加商品
 * @author: lindingfeng
 * @date: 2019-07-20 17:22:18
*/
router.post('/api/addShop', async (ctx, next) => {

  const shopInfo = ctx.request.body

  try {
    let ret = await mysqlShop.addShop({
      ...shopInfo
    })
    if (+ret.status === 1) {
      ctx.response.body = configStatus()
    }else if (+ret.status === 2) {
      ctx.response.body = configStatus({}, 1009, '未找到该商品id对应的分类')
    }
  } catch (err) {
    console.log(err)
  }

})

/*
 * @description: 获取商品列表
 * @author: lindingfeng
 * @date: 2019-07-20 18:17:27
*/
router.post('/api/getShopList', async (ctx, next) => {

  // const { token } = ctx.request.body
  // const secretOrPrivateKey = 'lindingfeng'
  // let verifyToken
  // let tokenStatus = '登录态有效'

  // try {
  //   verifyToken = jwt.verify(token, secretOrPrivateKey)
  //   // console.log(verifyToken)
  // } catch (err) {
  //   // console.log(err.message === 'jwt expired', 'true表示token已过期')
  //   if (err.message === 'jwt expired') {
  //     tokenStatus = '登录态失效'
  //   }
  // }

  try {
    let ret = await mysqlShop.getShopList()
    ctx.response.body = configStatus({
      shopList: ret
    })
  } catch (err) {
    console.log(err)
  }

})

module.exports = router