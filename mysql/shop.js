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
          '${dayjs().unix()}'
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
           where category_id=${Number(category_id)};
          `,
        (error, results) => {
    
          if (error) {
            reject(error)
            return
          }
  
          if (results.affectedRows) {
            resolve({
              status: 1,
              tip: '分类编辑成功'
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
 * @Description: 删除商品分类
 * @Author: lindingfeng
 * @Date: 2019-08-05 14:48:15
*/
const deleteCategory = (category_ids) => {

  return new Promise((resolve, reject) => {

    connection.query(
      `delete from lin.shop_category_list where category_id in (${category_ids})`,
    (error, results) => {

      if (error) {
        reject(error)
        return
      }

      if (results.affectedRows > 0) {
        resolve({
          status: 1,
          tip: '分类删除成功'
        })
        return
      }

      resolve({
        status: 2,
        tip: '分类删除失败'
      })

    })
    
  })

}

/*
 * @description: 获取商品分类
 * @author: lindingfeng
 * @date: 2019-07-20 15:29:52
*/
const getCategory = (pageIndex = 1, pageSize = 10) => {

  const offset = (pageIndex - 1) * pageSize

  return new Promise((resolve, reject) => {

    connection.query(
      // `select * from lin.shop_category_list limit ${offset}, ${pageSize}`,
      `SELECT SQL_CALC_FOUND_ROWS * FROM lin.shop_category_list ORDER BY create_time DESC limit ${offset}, ${pageSize};
       SELECT FOUND_ROWS() as total;`,
    (error, results) => { 

      if (error) {
        reject(error)
        return
      }

      if (results) {
        results[0].forEach(ele => {
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
  shop_freight,
  shop_status
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
          '${shop_num}',
          '${shop_freight}',
           ${shop_status},
          '${dayjs().unix()}'
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
            shop_freight,
            shop_status,
            create_time
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
        tip: '未找到该分类'
      })

    })
    
  })

}

/*
 * @Description: 编辑商品
 * @Author: lindingfeng
 * @Date: 2019-08-06 18:55:14
*/
const editShop = ({
  shop_id,
  shop_banner,
  shop_name,
  shop_category_id,
  shop_price,
  shop_content,
  shop_num,
  shop_freight,
  shop_status
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

        connection.query(
          `update lin.shop_list set
            shop_banner='${JSON.stringify(shop_banner)}',
            shop_name='${shop_name}',
            shop_category_id=${shop_category_id},
            shop_category='${results[0].category_name}',
            shop_price='${shop_price}',
            shop_content='${shop_content}',
            shop_num='${shop_num}',
            shop_freight='${shop_freight}',
            shop_status=${shop_status}
           where shop_id='${shop_id}';
          `,
        (error, results) => {
    
          if (error) {
            reject(error)
            return
          }
  
          if (results.affectedRows) {
            resolve({
              status: 1,
              tip: '商品编辑成功'
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
 * @Description: 删除商品
 * @Author: lindingfeng
 * @Date: 2019-08-08 10:37:06
*/
const deleteShop = (shop_ids) => {

  return new Promise((resolve, reject) => {

    let shop_id_arr = []
    shop_ids.split(',').forEach(ele => {
      shop_id_arr.push(`'${ele}'`)
    })

    connection.query(
      `delete from lin.shop_list where shop_id in (${shop_id_arr.join(',')})`,
    (error, results) => {
      if (error) {
        reject(error)
        return
      }

      if (results.affectedRows > 0) {
        resolve({
          status: 1,
          tip: '商品删除成功'
        })
        return
      }

      resolve({
        status: 2,
        tip: '商品删除失败'
      })

    })
    
  })

}

/*
 * @description: 上/下架商品
 * @author: lindingfeng
 * @date: 2019-08-07 21:00:27
*/
const editShopStatus = ({
  shop_ids,
  shop_status
}) => {

  return new Promise((resolve, reject) => {

    let sql = ''

    shop_ids.forEach(ele => {
      sql += `update lin.shop_list set shop_status=${shop_status} where shop_id='${ele}';`
    })

    connection.query(
      sql,
    (error, results) => {

      if (error) {
        reject(error)
        return
      }
      // console.log(results)

      if (
        (shop_ids.length > 1 && results.length) ||
        (shop_ids.length === 1 && results.affectedRows)
      ) {
        resolve({
          status: 1,
          tip: '商品上下架成功'
        })
        return
      }

      resolve({
        status: 2,
        tip: '商品上下架失败'
      })

    })
    
  })

}

/*
 * @description: 获取商品列表
 * @author: lindingfeng
 * @date: 2019-07-20 18:16:23
*/
const getShopList = (type, pageIndex = 1, pageSize = 10) => {

  const offset = (pageIndex - 1) * pageSize
  let sql = ''

  if (type && (+type === 0 || +type === 1)) {
    sql += `SELECT SQL_CALC_FOUND_ROWS * FROM lin.shop_list where shop_status=${type} ORDER BY create_time DESC limit ${offset}, ${pageSize};`
  } else {
    sql += `SELECT SQL_CALC_FOUND_ROWS * FROM lin.shop_list ORDER BY create_time DESC limit ${offset}, ${pageSize};`
  }

  sql += `SELECT FOUND_ROWS() as total;`

  return new Promise((resolve, reject) => {

    connection.query(
      sql,
    (error, results) => { 

      if (error) {
        reject(error);
        return
      }

      if (results) {
        results[0].forEach(ele => {
          ele.shop_banner = JSON.parse(ele.shop_banner)
          ele.create_time = dayjs.unix(ele.create_time).format("YYYY-MM-DD HH:mm:ss")
        })
        resolve(results)
      }

    })
    
  })

}

module.exports = {
  addCategory,
  editCategory,
  deleteCategory,
  getCategory,
  addShop,
  editShop,
  deleteShop,
  editShopStatus,
  getShopList
}