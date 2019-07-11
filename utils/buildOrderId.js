/*
 * @Description: 生成订单id
 * @Author: lindingfeng
 * @Date: 2019-07-11 18:56:13
*/
const buildOrderId = () => {
  let random = ''
  let date = new Date()
  let dateY = date.getFullYear()
  let dateM = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  let dateD = date.getDay() < 10 ? '0' + date.getDay() : date.getDay()
  for (let i = 0;i < 8;i++) {
    random += Math.floor(Math.random()*10)
  }
  return dateY+dateM+dateD+random
}

module.exports = buildOrderId