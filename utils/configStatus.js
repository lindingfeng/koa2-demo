/*
 * @Description: 生成response数据
 * @Author: lindingfeng
 * @Date: 2019-07-11 18:56:13
*/
const configStatus = (
  data = {},
  errCode = 0,
  errStr = '成功'
) => {
  let response = {
    _data: {
      ...data
    },
    _errCode: errCode || 0,
    _errStr: errStr || '成功'
  }
  return response
}

module.exports = configStatus