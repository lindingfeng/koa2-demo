const mysql = require('mysql');
const sha1 = require('sha1');
const dataBase = require('../config/dataBase');
const jwt = require('jsonwebtoken');
const connection = mysql.createConnection({
  ...dataBase.mysql
});

// 连接数据库
connection.connect();

/*
 * @description: 用户登录(用户端与后台系统通用)
 * @author: lindingfeng
 * @date: 2019-07-11 22:40:13
*/
const login = (phone, password, type) => {

  return new Promise((resolve, reject) => {

    // 查询登录手机号是否已存在
    connection.query(
      `select * from lin.user_list where phone='${phone}'`,
    (error, results) => {

      if (error) {
        reject(error)
        return
      }

      // 找到用户
      if (results.length) {

        // 密码正确
        if (results[0].password === sha1(password)) {

          const secretOrPrivateKey = 'lindingfeng'
          const userId = results[0].id
          const token = jwt.sign({ userId }, secretOrPrivateKey, { expiresIn: 60*5 })
          
          // admin登陆
          if (type !== 0) {

            if (
              +results[0].role === 1 ||
              +results[0].role === 2
            ) {

              resolve({
                status: 1,
                userInfo: {
                  role: results[0].role,
                  phone: results[0].phone,
                  avatar: results[0].avatar,
                  token: token
                }
              })

              return
            }

            resolve({
              status: 4,
              tip: '该账户没有权限'
            })

            return
          }

          // 用户登陆
          resolve({
            status: 1,
            token: token
          })

          return
        }

        // 密码错误
        resolve({
          status: 3,
          tip: '密码错误'
        })
        return

      }

      // 未找到用户
      resolve({
        status: 2,
        tip: '未注册手机号'
      })

    })

  })

}

/*
 * @description: 用户注册
 * @author: lindingfeng
 * @date: 2019-07-11 23:40:41
*/
const registered = (phone, password, type = 0) => {

  return new Promise((resolve, reject) => {

    // 查询登录手机号是否已存在
    connection.query(
      `select * from lin.user_list where phone='${phone}'`,
    (error, results) => {

      if (error) {
        reject(error)
        return
      }

      // 用户已注册
      if (results.length) {
        resolve({
          status: 2,
          tip: '已注册手机号'
        })
        return
      }

      // 用户未注册
      const userInfo = `'${phone}', '${sha1(password)}', ${type}`

      connection.query(
        `insert into lin.user_list(
          phone,
          password,
          role
        ) values(${userInfo})`,
      (error, results) => {
        console.log(error, results)
        
        if (error) {
          reject(error)
          return
        }

        if (results.affectedRows) {
          const userId = results.insertId
          const secretOrPrivateKey = 'lindingfeng'
          const token = jwt.sign({ userId }, secretOrPrivateKey, { expiresIn: 60*10 })
          resolve({
            status: 1,
            token: token
          })
          return
        }

        resolve({
          status: 3
        })

      })

    })

  })

}

/*
 * @Description: 修改密码
 * @Author: lindingfeng
 * @Date: 2019-07-12 17:29:03
*/
const changePwd = (phone, old_password, new_password) => {

  return new Promise((resolve, reject) => {

    // 查询修改密码手机号是否已存在
    connection.query(
      `select * from lin.user_list where phone='${phone}'`,
    (error, results) => {

      if (error) {
        reject(error)
        return
      }

      // 找到手机号
      if (results.length) {

        // 验证旧密码正确
        if (results[0].password === sha1(old_password)) {

          if (results[0].password === sha1(new_password)) {
            resolve({
              status: 4,
              tip: '旧密码与新密码不能一样'
            })
            return
          }

          connection.query(
            `update lin.user_list set password='${sha1(new_password)}' where user_id=${results[0].user_id};`,
          (error, results) => {

            if (error) {
              reject(error)
              return
            }

            if (results.affectedRows) {
              console.log(results)
              resolve({
                status: 1,
                tip: '密码修改成功'
              })
            }

            resolve({
              status: 1,
              tip: '密码修改成功'
            })

          })
          return
        }

        resolve({
          status: 2,
          tip: '旧密码错误'
        })
        return
        
      }

      // 未找到手机号
      resolve({
        status: 3,
        tip: '该手机号未注册'
      })

    })

  })

}

module.exports = {
  login,
  registered,
  changePwd
}