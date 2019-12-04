//defaultConfig.js
const config = {
    // 数据库配置
    database: {
        DATABASE: 'qingyun', //数据库名称
        USERNAME: 'root', //mysql用户名
        PASSWORD: '123456', //mysql密码
        PORT: '3306', //mysql端口号
        HOST: 'localhost' //服务器ip
    },
    sessionbase: {
        database: 'qingyun', //数据库名称
        user: 'root', //mysql用户名
        password: '123456', //mysql密码
        port: '3306', //mysql端口号
        host: 'localhost' //服务器ip
    }
}

module.exports = config