const Koa = require('koa')
// 注意require('koa-router')返回的是函数:
// const router = require('koa-router')();
const bodyparser = require('koa-bodyparser')
const app = new Koa()
const controllers = require('./controllers')
const logger = require('koa-logger')
const server = require('koa-static')
const path = require('path')
// const session = require('koa-session') for  cookie
const session = require('koa-session-minimal') // for mysql
const MysqlStore = require('koa-mysql-session')
const cors = require('koa2-cors')
const reset = require('./utils')
const initTable = require('./mysql/init');
const {sessionbase} = require('./mysql/config')



// 初始化数据表
initTable()

const handler = async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        console.log(err)
        ctx.response.status = err.statusCode || err.status || 500;
        ctx.response.body = reset.error(err.message)
    }
};

app.use(handler); // 处理错误
app.use(logger()) // 打印日志
// 跨域设置
/**
 * 
 * {
 *    origin: function (ctx) {
 *        if (ctx.url === '/test') {
 *            return "*"; // 允许来自所有域名请求
 *        }
 *        return 'http://localhost:8080'; // 这样就能只允许 http://localhost:8080 这个域名的请求了
 *    },
 *    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
 *    maxAge: 5,
 *    credentials: true,
 *    allowMethods: ['GET', 'POST', 'DELETE'],
 *    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
 *}
*/
app.use(cors())

app.use(server(path.join(__dirname))) // 加载静态资源

app.keys = ['session'];
// const CONFIG = {
//     key: 'koa:sess',   //cookie key (default is koa:sess)
//     maxAge: 86400000,  // cookie的过期时间 maxAge in ms (default is 1 days)
//     overwrite: true,  //是否可以overwrite    (默认default true)
//     httpOnly: true, //cookie是否只有服务器端可以访问 httpOnly or not (default true)
//     signed: true,   //签名默认true
//     rolling: false,  //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
//     renew: false,  //(boolean) renew session when session is nearly expired,
// };
app.use(session({key: 'USER_SID',store: new MysqlStore(sessionbase)}));

app.use(bodyparser()); // 解析post 内容
// add router middleware:
// 别忘了加
app.use(controllers())

app.listen(3000)
console.log('ap start at port 3000')