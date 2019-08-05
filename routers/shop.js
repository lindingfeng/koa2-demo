const router = require('koa-router')()
const jwt = require('jsonwebtoken');
const mysqlShop = require('../mysql/shop')
const configStatus = require('../utils/configStatus')

/*
 * @description: 添加商品分类
 * @author: lindingfeng
 * @date: 2019-07-20 14:49:21
*/
router.post('/api/operationCategory', async (ctx, next) => {

  const { 
    category_id,
    category_name,
    category_icon,
    category_status
   } = ctx.request.body

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
    category_ids
  } = ctx.request.body

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
    pageIndex,
    pageSize
   } = ctx.request.body

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

  const { 
    pageIndex,
    pageSize
   } = ctx.request.body

  try {
    let ret = await mysqlShop.getShopList(pageIndex, pageSize)
    ctx.response.body = configStatus({
      shopList: ret[0],
      total: ret[1][0].total
    })
  } catch (err) {
    console.log(err)
  }

})

module.exports = router