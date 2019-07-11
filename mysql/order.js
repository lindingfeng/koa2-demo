const mysql = require('mysql');
const dataBase = require('../config/dataBase');
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
      `select * from test.order_list limit ${offset}, ${pageSize}`,
    (error, results) => {
      if (error) {
        reject(error);
        return
      }
      resolve(results)
    })
  })

}

module.exports = {
  getOrderList
}