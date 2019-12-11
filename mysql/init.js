
const { query } = require('./index')

/**
 * @description: 创建用户表
 * @param {type} id 主键
 * @param {type} userName 用户名
 * @param {type} password 密码
 * @param {type} usergroup 职位
 * @param {type} signature 签名
 * @param {type} avator 头像
 * @param {type} email 邮箱
 * @param {type} signature 签名
 * @param {type} title 标题
 * @param {type} tags 标签
 * @param {type} notifyCount 通知
 * @param {type} unreadCount 未读
 * @param {type} country 国家
 * @param {type} geographic 地理位置
 * @param {type} address 地址
 * @param {type} phone 电话
 * @param {type} authority 权限
 * @param {type} creatTime 创建时间
 * @return: null
 */
let users =
    `create table if not exists users(
     userid INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL,
     userName VARCHAR(100) NOT NULL,
     password VARCHAR(100) NOT NULL,
     avatar VARCHAR(255) NOT NULL,
     email VARCHAR(100) DEFAULT NULL,
     signature VARCHAR(100) DEFAULT NULL,
     title VARCHAR(100) DEFAULT NULL,
     usergroup VARCHAR(100) DEFAULT NULL,
     tags TEXT(0) DEFAULT NULL,
     notifyCount VARCHAR(40) NOT NULL DEFAULT '0',
     unreadCount VARCHAR(40) NOT NULL DEFAULT '0',
     country VARCHAR(100) DEFAULT NULL,
     geographic TEXT(0) DEFAULT NULL,
     address VARCHAR(100) DEFAULT NULL,
     phone VARCHAR(100) DEFAULT NULL,
     authority VARCHAR(100) NOT NULL DEFAULT 'user',
     creatTime VARCHAR(100) NOT NULL,
     PRIMARY KEY ( userid )
    );`

let posts =
    `create table if not exists posts(
     id INT NOT NULL AUTO_INCREMENT,
     types VARCHAR(100) NOT NULL,
     name VARCHAR(100) NOT NULL,
     title TEXT(0) NOT NULL,
     content TEXT(0) NOT NULL,
     md TEXT(0) NOT NULL,
     uid VARCHAR(40) NOT NULL,
     moment VARCHAR(100) NOT NULL,
     comments VARCHAR(200) NOT NULL DEFAULT '0',
     pv VARCHAR(40) NOT NULL DEFAULT '0',
     avatar VARCHAR(100) NOT NULL,
     poster VARCHAR(255) NOT NULL,
     PRIMARY KEY ( id )
    );`
/**
 * @description: 创建猫咪
 * @param {type} id 主键
 * @param {type} name 猫咪名字
 * @param {type} type 猫咪品种
 * @param {type} title 标题
 * @param {type} content 副标题
 * @param {type} uid 关联用户
 * @param {type} moment 时间
 * @param {type} comments 评论数
 * @param {type} pv 查看数
 * @param {type} poster 封面图
 * @return: null
 */
let cats =
    `create table if not exists cats(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL,
     title TEXT(0) NOT NULL,
     content TEXT(0) NOT NULL,
     uid INT NOT NULL,
     type VARCHAR(100) NOT NULL,
     moment VARCHAR(100) NOT NULL,
     comments VARCHAR(200) NOT NULL DEFAULT '0',
     pv VARCHAR(40) NOT NULL DEFAULT '0',
     poster VARCHAR(255) NOT NULL,
     PRIMARY KEY ( id )
    );`

let comment =
    `create table if not exists comment(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL,
     content TEXT(0) NOT NULL,
     moment VARCHAR(40) NOT NULL,
     postid VARCHAR(40) NOT NULL,
     avator VARCHAR(100) NOT NULL,
     PRIMARY KEY ( id )
    );`

let createTable = function (sql) {
    return query(sql.replace(/[\r\n]/g, ''), [])
}

const initTable = () => {
    // 建表
    createTable(users)
    createTable(posts)
    createTable(comment)
    createTable(cats)
}

module.exports = initTable