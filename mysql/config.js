//defaultConfig.js
const NODE_ENV = process.env.NODE_ENV
// console.log(NODE_ENV,NODE_ENV =='dev'? 'localhost':'172.21.0.2')
const config = {
    // 数据库配置
    database: {
        DATABASE: 'qingyun', //数据库名称
        USERNAME: 'root', //mysql用户名
        PASSWORD:  NODE_ENV =='development'? '123456':'920918zyz', //mysql密码
        PORT: '3306', //mysql端口号
        HOST: NODE_ENV =='development'? 'localhost':'172.21.0.2' //服务器ip
    },
    sessionbase: {
        database: 'qingyun', //数据库名称
        user: 'root', //mysql用户名
        password: NODE_ENV =='development'? '123456':'920918zyz', //mysql密码
        port: '3306', //mysql端口号
        host: NODE_ENV =='development'? 'localhost':'172.21.0.2' //服务器ip
    }
}


module.exports = config