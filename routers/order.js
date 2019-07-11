const router = require('koa-router')()
const mysqlOrder = require('../mysql/order')
const configStatus = require('../utils/configStatus')

/*
 * @Description: 获取订单列表
 * @Author: lindingfeng
 * @Date: 2019-07-11 19:15:45
*/
router.post('/api/getOrderList', async (ctx, next) => {
  
  const { pageIndex = 1, pageSize = 10 } = ctx.request.body

  try {
    let ret = await mysqlOrder.getOrderList(pageIndex, pageSize)
    ctx.response.body = configStatus({
      orderList: ret
    })
  } catch (err) {
    console.log(err.errno)
  }

})

/*
 * @description: 创建订单
 * @author: lindingfeng
 * @date: 2019-07-11 22:05:20
*/
router.post('/api/addOrder', async (ctx, next) => {

  const { order_name } = ctx.request.body

  try {
    await mysqlOrder.addOrder(order_name)
    ctx.response.body = configStatus()
  } catch (err) {
    console.log(err.errno)
  }

})

module.exports = router