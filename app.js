// 导入koa类
const Koa = require('koa')

// 处理静态文件
const static = require('koa-static');

// 处理post请求解析body或表单中的参数
const bodyParser = require('koa-bodyparser')

// 文件上传
const koaBody = require('koa-body')

// node路径模块
const path = require('path')

// 处理跨域
const cors = require('koa2-cors');

// 引入api路由
const indexRouter = require('./routers/index');
const shopRouter = require('./routers/shop');
const orderRouter = require('./routers/order');
const userRouter = require('./routers/user');
const addressRouter = require('./routers/address');
const uploadfileRouter = require('./routers/uploadfile');

// 创建一个Koa对象
const app = new Koa()

// 注册上传插件
app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 200*1024*1024
  }
}))

// koa-bodyparser必须在koa-router之前注册
app.use(bodyParser())

// koa2-cors必须在koa-router之前注册
app.use(cors())

// 一定要是根目录，否则访问不到
app.use(static(path.join(__dirname, './public/')))

// 注册路由
app.use(indexRouter.routes())
app.use(shopRouter.routes())
app.use(orderRouter.routes())
app.use(userRouter.routes())
app.use(addressRouter.routes())
app.use(uploadfileRouter.routes())

app.listen(3000)
console.log(`app started at port 3000 for MySQL...`)