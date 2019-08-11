const router = require('koa-router')()
const mysqlShop = require('../mysql/shop')
const configStatus = require('../utils/configStatus')
const { verifyToken } = require('../utils')

/*
 * @description: 添加/编辑商品分类
 * @author: lindingfeng
 * @date: 2019-07-20 14:49:21
*/
router.post('/api/operationCategory', async (ctx, next) => {

  const {
    token,
    category_id,
    category_name,
    category_icon,
    category_status
  } = ctx.request.body

  if (!verifyToken(token)) {
    ctx.response.body = configStatus({}, 1010, '未登录或登录态已失效')
    return
  }

  if (!category_name || !category_icon || !category_status) {
    ctx.response.body = configStatus({}, 1012, '请完善分类信息')
    return
  }

  if (category_id) {
    try {
      let ret = await mysqlShop.editCategory({
        category_id,
        category_name,
        category_icon,
        category_status
      })
      if (+ret.status === 1) {
        ctx.response.body = configStatus()
      } else if (+ret.status === 2) {
        ctx.response.body = configStatus({}, 1013, '未找到该分类')
      }
    } catch (err) {
      console.log(err)
    }
    return
  }

  try {
    let ret = await mysqlShop.addCategory({
      category_name,
      category_icon,
      category_status
    })
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
 * @Description: 删除商品分类
 * @Author: lindingfeng
 * @Date: 2019-08-05 15:28:31
*/
router.post('/api/deleteCategory', async (ctx, next) => {

  const { 
    token,
    category_ids
  } = ctx.request.body

  if (!verifyToken(token)) {
    ctx.response.body = configStatus({}, 1010, '未登录或登录态已失效')
    return
  }

  if (!category_ids) {
    ctx.response.body = configStatus({}, 1014, '分类id不能为空')
  }

  try {
    let ret = await mysqlShop.deleteCategory(category_ids)
    if (+ret.status === 1) {
      ctx.response.body = configStatus()
    } else if (+ret.status === 2) {
      ctx.response.body = configStatus({}, 1015, '分类删除失败')
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

  const {
    token,
    pageIndex,
    pageSize
  } = ctx.request.body

  if (!verifyToken(token)) {
    ctx.response.body = configStatus({}, 1010, '未登录或登录态已失效')
    return
  }

  try {
    let ret = await mysqlShop.getCategory(pageIndex, pageSize)
    ctx.response.body = configStatus({
      categoryList: ret[0],
      total: ret[1][0].total
    })
  } catch (err) {
    console.log(err)
  }

})

/*
 * @description: 添加/编辑商品
 * @author: lindingfeng
 * @date: 2019-07-20 17:22:18
*/
router.post('/api/operationShop', async (ctx, next) => {

  const { 
    token,
    shop_id,
    shop_category_id,
    shop_name,
    shop_banner,
    shop_price,
    shop_content,
    shop_num,
    shop_freight,
    shop_status
  } = ctx.request.body

  if (!verifyToken(token)) {
    ctx.response.body = configStatus({}, 1010, '未登录或登录态已失效')
    return
  }

  if (
    !shop_category_id || !shop_name || !shop_banner.length || !shop_price ||
    !shop_content || !shop_num || !shop_freight || !shop_status
  ) {
    ctx.response.body = configStatus({}, 1016, '商品信息不完整')
  }

  if (shop_id) {
    try {
      let ret = await mysqlShop.editShop({
        ...ctx.request.body
      })
      if (+ret.status === 1) {
        ctx.response.body = configStatus()
      }else if (+ret.status === 2) {
        ctx.response.body = configStatus({}, 1009, '未找到对应的商品分类')
      }
    } catch (err) {
      console.log(err)
    }
    return
  }

  try {
    let ret = await mysqlShop.addShop({
      ...ctx.request.body
    })
    if (+ret.status === 1) {
      ctx.response.body = configStatus()
    }else if (+ret.status === 2) {
      ctx.response.body = configStatus({}, 1009, '未找到对应的商品分类')
    }
  } catch (err) {
    console.log(err)
  }

})

/*
 * @Description: 删除商品
 * @Author: lindingfeng
 * @Date: 2019-08-08 10:43:50
*/
router.post('/api/deleteShop', async (ctx, next) => {

  const {
    token,
    shop_ids
  } = ctx.request.body

  if (!verifyToken(token)) {
    ctx.response.body = configStatus({}, 1010, '未登录或登录态已失效')
    return
  }

  if (!shop_ids) {
    ctx.response.body = configStatus({}, 1014, '商品id不能为空')
  }

  try {
    let ret = await mysqlShop.deleteShop(shop_ids)
    if (+ret.status === 1) {
      ctx.response.body = configStatus()
    } else if (+ret.status === 2) {
      ctx.response.body = configStatus({}, 1019, '商品删除失败')
    }
  } catch (err) {
    console.log(err)
  }

})

/*
 * @description: 上/下架商品
 * @author: lindingfeng
 * @date: 2019-08-07 21:00:27
*/
router.post('/api/editShopStatus', async (ctx, next) => {

  const {
    token,
    shop_ids,
    shop_status
  } = ctx.request.body

  if (!verifyToken(token)) {
    ctx.response.body = configStatus({}, 1010, '未登录或登录态已失效')
    return
  }

  if (!shop_ids || !shop_status) {
    ctx.response.body = configStatus({}, 1018, '商品信息不完整')
  }

  try {
    let ret = await mysqlShop.editShopStatus({
      shop_ids: shop_ids.split(','),
      shop_status
    })
    if (+ret.status === 1) {
      ctx.response.body = configStatus()
    }else if (+ret.status === 2) {
      ctx.response.body = configStatus({}, 1017, '商品状态操作失败')
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

  const {
    token,
    type,
    pageIndex,
    pageSize
  } = ctx.request.body

  if (!verifyToken(token)) {
    ctx.response.body = configStatus({}, 1010, '未登录或登录态已失效')
    return
  }

  try {
    let ret = await mysqlShop.getShopList(type, pageIndex, pageSize)
    ctx.response.body = configStatus({
      shopList: ret[0],
      total: ret[1][0].total
    })
  } catch (err) {
    console.log(err)
  }

})

module.exports = router