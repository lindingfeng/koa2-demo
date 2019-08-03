/*
 * @description: 判断数据类型是否为数组
 * @author: lindingfeng
 * @date: 2019-08-02 23:09:03
*/
export const isObject = (data) => {
  return Object.prototype.toString.call(obj) === '[Object Object]'
}

/*
 * @description: 判断数据类型是否为数组
 * @author: lindingfeng
 * @date: 2019-08-02 23:09:03
*/
export const isArray = (data) => {
  return Array.isArray(data)
}

/*
 * @description: 验证价格的正确性(含小数点)
 * @author: lindingfeng
 * @date: 2019-08-02 23:09:03
*/
export const verifyFloatPrice = (data) => {
  return /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(data)
}

/*
 * @description: 验证数量(0到~)
 * @author: lindingfeng
 * @date: 2019-08-02 23:09:03
*/
export const verifyFloatPrice = (data) => {
  return /^([0]{1}|[1-9]{1}[0-9]*)$/.test(data)
}