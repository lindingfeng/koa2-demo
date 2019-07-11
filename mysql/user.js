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
 * @description: 用户登录
 * @author: lindingfeng
 * @date: 2019-07-11 22:40:13
*/
const login = (phone, password) => {

  return new Promise((resolve, reject) => {

    // 查询登录手机号是否已存在
    connection.query(
      `select * from test.user_list where phone='${phone}'`,
    (error, results) => {

      if (error) {
        reject(error);
        return
      }

      // 找到用户
      if (results.length) {

        // 密码正确
        if (results[0].password === sha1(password)) {
          resolve({
            status: 1,
            token: results[0].token
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
const registered = (phone, password) => {

  return new Promise((resolve, reject) => {

    // 查询登录手机号是否已存在
    connection.query(
      `select * from test.user_list where phone='${phone}'`,
    (error, results) => {

      if (error) {
        reject(error);
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
      const secretOrPrivateKey = 'lindingfeng'
      const token = jwt.sign({ phone, password }, secretOrPrivateKey, { expiresIn: 60*60 })
      const userInfo = `${parseInt(Math.random()*100)}, '${phone}', '${sha1(password)}', '${token}'`

      connection.query(
        `insert into test.user_list values(${userInfo})`,
      (error, results) => {
        
        if (error) {
          reject(error);
          return
        }

        if (results.affectedRows) {
          resolve({
            status: 1,
            token: token
          })
        }

      })

    })

  })

}

module.exports = {
  login,
  registered
}