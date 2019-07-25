const mysql = require('mysql');
const dataBase = require('../config/dataBase');
const connection = mysql.createConnection({
  ...dataBase.mysql
});

// 连接数据库
connection.connect();

/*
 * @description: 获取收货地址列表
 * @author: lindingfeng
 * @date: 2019-07-24 23:30:50
*/
const getAddress = (userId) => {

  return new Promise((resolve, reject) => {

    // 查询登录手机号是否已存在
    connection.query(
      `select * from test.address_list where user_id='${userId}'`,
    (error, results) => {

      if (error) {
        reject(error)
        return
      }

      results.forEach(ele => {
        ele.area = JSON.parse(ele.area)
      });
      resolve(results)

    })

  })

}

/*
 * @description: 获取指定收货地址
 * @author: lindingfeng
 * @date: 2019-07-25 23:33:15
*/
const getAddressInfo = (addressId) => {

  return new Promise((resolve, reject) => {

    // 查询登录手机号是否已存在
    connection.query(
      `select * from test.address_list where id='${addressId}'`,
    (error, results) => {

      if (error) {
        reject(error)
        return
      }

      results[0].area = JSON.parse(results[0].area)
      resolve(results[0])

    })

  })

}

/*
 * @description: 添加收货地址
 * @author: lindingfeng
 * @date: 2019-07-24 22:12:22
*/
const addAddress = (addressInfo) => {

  return new Promise((resolve, reject) => {
    
    const address = `
      '${addressInfo.userId}',
      '${addressInfo.name}',
      '${addressInfo.phone}',
      '${JSON.stringify(addressInfo.area)}',
      '${addressInfo.detail}',
       ${addressInfo.defaultAddress?1:0}
    `

    connection.query(
      `insert into test.address_list(
        user_id,
        name,
        phone,
        area,
        address,
        is_default
      ) values(${address})`,
    (error, results) => {

      if (error) {
        reject(error)
        return
      }

      if (results.affectedRows) {
        resolve()
      }

    })
    
  })

}

module.exports = {
  addAddress,
  getAddress,
  getAddressInfo
}