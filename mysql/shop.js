const mysql = require('mysql');
const dataBase = require('../config/dataBase');
const uuidv1 = require('uuid/v1');
const dayjs = require('dayjs');
const connection = mysql.createConnection({
  ...dataBase.mysql
});

// 连接数据库
connection.connect();

/*
 * @description: 添加商品分类
 * @author: lindingfeng
 * @date: 2019-07-20 14:49:21
*/
const addCategory = ({
  category_name,
  category_icon,
  category_status
}) => {

  return new Promise((resolve, reject) => {

    connection.query(
      `select * from lin.shop_category_list where category_name='${category_name}'`,
    (error, results) => { 

      if (error) {
        reject(error)
        return
      }

      if (results.length) {
        resolve({
          status: 2,
          tip: '该分类已存在'
        })
        return
      }

      connection.query(
        `insert into lin.shop_category_list(
          category_name,
          category_icon,
          category_status,
          create_time
        ) values(
          '${category_name}',
          '${category_icon}',
           ${category_status},
           ${dayjs().unix()}
        )`,
      (error, results) => {
  
        if (error) {
          reject(error)
          return
        }

        if (results.affectedRows) {
          resolve({
            status: 1,
            tip: '分类添加成功'
          })
        }
  
      })

    })
    
  })

}

/*
 * @description: 编辑商品分类
 * @author: lindingfeng
 * @date: 2019-07-20 14:49:21
*/
const editCategory = ({
  category_id,
  category_name,
  category_icon,
  category_status
}) => {

  return new Promise((resolve, reject) => {

    connection.query(
      `select * from lin.shop_category_list where category_id='${category_id}'`,
    (error, results) => { 

      if (error) {
        reject(error)
        return
      }

      if (results.length) {

        connection.query(
          `update lin.shop_category_list set
            category_name='${category_name}',
            category_icon='${category_icon}',
            category_status=${category_status}
            where category_id=${Number(category_id)};`,
        (error, results) => {
    
          if (error) {
            reject(error)
            return
          }
  
          if (results.affectedRows) {
            resolve({
              status: 1,
              tip: '分类添加成功'
            })
          }
    
        })
        return
      }

      resolve({
        status: 2,
        tip: '未找到该分类'
      })

    })
    
  })

}

/*
 * @description: 获取商品分类
 * @author: lindingfeng
 * @date: 2019-07-20 15:29:52
*/
const getCategory = () => {

  return new Promise((resolve, reject) => {

    connection.query(
      `select * from lin.shop_category_list`,
    (error, results) => { 

      if (error) {
        reject(error)
        return
      }

      if (results) {
        results.forEach(ele => {
          ele.create_time = dayjs.unix(ele.create_time).format("YYYY-MM-DD HH:mm:ss")
        })
        resolve(results)
      }

    })
    
  })

}

/*
 * @description: 添加商品
 * @author: lindingfeng
 * @date: 2019-07-20 17:02:48
*/

const addShop = ({
  shop_banner,
  shop_name,
  shop_category_id,
  shop_price,
  shop_content,
  shop_num,
  shop_freight
}) => {

  return new Promise((resolve, reject) => {

    connection.query(
      `select * from lin.shop_category_list where category_id=${shop_category_id}`,
    (error, results) => { 

      if (error) {
        reject(error)
        return
      }
      
      // 找到商品分类
      if (results.length) {

        const shopInfo = `
          '${uuidv1().replace(/-/g, '')}',
          '${JSON.stringify(shop_banner)}',
          '${shop_name}',
           ${shop_category_id},
          '${results[0].category_name}',
          '${shop_price}',
          '${shop_content}',
           ${shop_num},
          '${shop_freight}'
        `
        connection.query(
          `insert into lin.shop_list(
            shop_id,
            shop_banner,
            shop_name,
            shop_category_id,
            shop_category,
            shop_price,
            shop_content,
            shop_num,
            shop_freight
          ) values(
            ${shopInfo}
          )`,
        (error, results) => {

          if (error) {
            reject(error)
            return
          }

          if (results.affectedRows) {
            resolve({
              status: 1,
              tip: '商品添加成功'
            })
          }

        })
        return
      }

      resolve({
        status: 2,
        tip: '未找到该商品id对应的分类'
      })

    })
    
  })

}

/*
 * @description: 获取商品列表
 * @author: lindingfeng
 * @date: 2019-07-20 18:16:23
*/
const getShopList = () => {

  return new Promise((resolve, reject) => {

    connection.query(
      `select * from lin.shop_list`,
    (error, results) => { 

      if (error) {
        reject(error);
        return
      }

      if (results) {
        results.forEach(ele => {
          ele.shop_banner = JSON.parse(ele.shop_banner)
        })
        resolve(results)
      }

    })
    
  })

}

module.exports = {
  addCategory,
  editCategory,
  getCategory,
  addShop,
  getShopList
}