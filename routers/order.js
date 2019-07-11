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

module.exports = router