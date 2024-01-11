const Koa = require('koa')
// 注意require('koa-router')返回的是函数:
// const router = require('koa-router')();
//
const bodyparser = require('koa-bodyparser')
const koaBody = require('koa-body');
const app = new Koa()
const controllers = require('./controllers')
const logger = require('koa-logger')
const server = require('koa-static')
const path = require('path')
const onerror = require('koa-onerror')
// const session = require('koa-session') for  cookie
const session = require('koa-session-minimal') // for mysql
const MysqlStore = require('koa-mysql-session')
const cors = require('koa2-cors')
const reset = require('./utils')
const initTable = require('./mysql/init');
const { getUploadFileExt, getUploadDirName, checkDirExist, getUploadFileName } = require('./utils/upload');
const { sessionbase } = require('./mysql/config')


onerror(app)

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
app.use(session({ key: 'USER_SID', store: new MysqlStore(sessionbase) }));

// app.use(bodyparser()); // 解析post 内容
app.use(koaBody({
    multipart: true, // 支持文件上传
    encoding: 'utf-8',
    formidable: {
        uploadDir: path.join(__dirname, 'public/upload/'), // 设置文件上传目录
        keepExtensions: true,    // 保持文件的后缀
        maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
        onFileBegin: (name, file) => { // 文件上传前的设置
            // console.log(file);
            // 获取文件后缀
            const ext = getUploadFileExt(file.name);
            // 最终要保存到的文件夹目录
            const dir = `public/upload/${getUploadDirName()}`;
            // 检查文件夹是否存在如果不存在则新建文件夹
            checkDirExist(path.join(__dirname, dir));
            // 重新覆盖 file.path 属性
            file.path = `${dir}/${getUploadFileName(ext)}`;

        },
    }
}));
// add router middleware:
// 别忘了加
app.use(controllers())

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});

module.exports = app
