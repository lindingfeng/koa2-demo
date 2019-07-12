const router = require('koa-router')()
const mysqlUser = require('../mysql/user')
const configStatus = require('../utils/configStatus')

/*
 * @description: 用户登陆
 * @author: lindingfeng
 * @date: 2019-07-11 23:30:12
*/
router.post('/api/login', async (ctx, next) => {

  const { phone, password } = ctx.request.body

  try {
    let ret = await mysqlUser.login(phone, password)

    if (+ret.status === 1) {

      ctx.response.body = configStatus({
        ...ret
      })

    } else if (+ret.status === 2) {

      ctx.response.body = configStatus({}, 1002, '未注册手机号')

    } else if (+ret.status === 3) {

      ctx.response.body = configStatus({}, 1003, '密码错误')

    }

  } catch (err) {
    console.log(err.errno)
  }

})

/*
 * @description: 用户注册
 * @author: lindingfeng
 * @date: 2019-07-11 23:47:47
*/
router.post('/api/registered', async (ctx, next) => {

  const { phone, password } = ctx.request.body

  try {
    let ret = await mysqlUser.registered(phone, password)

    if (+ret.status === 1) {

      ctx.response.body = configStatus({
        ...ret
      })

    } else if (+ret.status === 2) {

      ctx.response.body = configStatus({}, 1004, '手机号已注册')

    }

  } catch (err) {
    console.log(err.errno)
  }

})

/*
 * @Description: 修改密码
 * @Author: lindingfeng
 * @Date: 2019-07-12 17:54:23
*/
router.post('/api/changePwd', async (ctx, next) => {

  const { phone, old_password, new_password } = ctx.request.body

  try {
    let ret = await mysqlUser.changePwd(phone, old_password, new_password)

    if (+ret.status === 1) {

      ctx.response.body = configStatus()

    } else if (+ret.status === 2) {

      ctx.response.body = configStatus({}, 1005, '旧密码错误')

    } else if (+ret.status === 3) {

      ctx.response.body = configStatus({}, 1006, '该手机号未注册')

    }

  } catch (err) {
    console.log(err.errno)
  }

})

module.exports = router