const jwt = require('jsonwebtoken')

/*
 * @description: 判断数据类型是否为数组
 * @author: lindingfeng
 * @date: 2019-08-02 23:09:03
*/
const isObject = (data) => {
  return Object.prototype.toString.call(obj) === '[Object Object]'
}

/*
 * @description: 判断数据类型是否为数组
 * @author: lindingfeng
 * @date: 2019-08-02 23:09:03
*/
const isArray = (data) => {
  return Array.isArray(data)
}

/*
 * @description: 验证价格的正确性(含小数点)
 * @author: lindingfeng
 * @date: 2019-08-02 23:09:03
*/
const verifyFloatPrice = (data) => {
  return /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(data)
}

/*
 * @description: 验证数量(0到~)
 * @author: lindingfeng
 * @date: 2019-08-02 23:09:03
*/
const verifyNumber = (data) => {
  return /^([0]{1}|[1-9]{1}[0-9]*)$/.test(data)
}

/*
 * @description: 校验token的有效性
 * @author: lindingfeng
 * @date: 2019-08-09 23:40:24
*/
const verifyToken = (token) => {
  try {
    jwt.verify(token, 'lindingfeng')
    return true
  } catch (err) {
    // console.log('------', err.message === 'jwt expired'?'token已过期':'', '------')
    // if (err.message === 'jwt expired') {
    //   tokenStatus = 2
    // }
    return false
  }
}

/*
 * @Description: 生成随机字符串
 * @Author: lindingfeng
 * @Date: 2019-08-28 14:50:47
*/
const buildRamStr = (len = 8) => {
  let str = ''
  let someStr = [
    'a','b','c','d','e','f','g','h','i','j','k',
    '0','1','2','3','4','5','6','7','8','9',
    'A','B','C','D','E','F','G','H','I','J','K'
  ]
  for (let i=0;i<len;i++) {
    let idx = Math.ceil(Math.random() * someStr.length - 1)
    str += someStr[idx]
  }
  return str
}

module.exports = {
  isObject,
  isArray,
  verifyFloatPrice,
  verifyNumber,
  verifyToken,
  buildRamStr
}
