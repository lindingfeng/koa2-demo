const mysql = require('mysql');
const dataBase = require('../config/dataBase');
const buildOrderId = require('../utils/buildOrderId');
const connection = mysql.createConnection({
  ...dataBase.mysql
});

// 连接数据库
connection.connect();

/*
 * @Description: 查询订单列表
 * @Author: lindingfeng
 * @Date: 2019-07-11 17:54:55
*/
const getOrderList = (pageIndex = 1, pageSize = 10) => {

  const offset = (pageIndex - 1) * pageSize

  return new Promise((resolve, reject) => {
    connection.query(
      `select * from lin.order_list limit ${offset}, ${pageSize}`,
    (error, results) => {
      if (error) {
        reject(error)
        return
      }
      resolve(results)
    })
  })

}

/*
 * @description: 创建订单
 * @author: lindingfeng
 * @date: 2019-07-11 22:05:20
*/
const addOrder = (order_name) => {

  return new Promise((resolve, reject) => {
    
    const orderInfo = `'MySQL', '${buildOrderId()}', '${order_name}'`

    connection.query(
      `insert into lin.order_list(
        type,
        order_id,
        order_name
      ) values(${orderInfo})`,
    (error, results) => {
      if (error) {
        reject(error)
        return
      }
      resolve(results)
    })
    
  })

}

module.exports = {
  getOrderList,
  addOrder
}