

const reset = require('../utils')
const Joi = require('joi')
const Sheet = require('../models')
const USEERS = new Sheet('users') // SQL 操作
const moment = require('moment')
moment.locale('zh-cn')

const DEFAULTAVATAR = '/api/public/upload/2019126/default.jpg'

const getAvatar = () => {
    const i = 9
    const c = Math.round(Math.random() * 9)
    console.log(c)
    return `/api/public/upload/avatar/avatar${c}.jpeg`
}

const GUEST = {
    avatar: DEFAULTAVATAR,
    authority: 'guest',
    userid: -1,
    userName: 'guest',
    name: '游客',
    creatTime: '',
    geographic: null,
    group: null,
    country: null,
    address: null,
    phone: null,
    title: '游客模式-体验完整功能请注册',
    notifyCount: 0,
    unreadCount: 0,
    email: null,
}

/**
 * @description: 登陆
 * @param {string} userName - 用户名
 * @param {string} password - 密码
 * @param {string} type - 登录类型 [account]
 * @return: ok || error
 */
const fn_login_account = async (ctx, next) => {
    let data = ctx.request.body
    // console.log(data)
    let schema = Joi.object().keys({
        userName: Joi.string().required().label('用户名').error(() => '用户名必填'),
        password: Joi.string().required().label('密码').error(() => '密码必填'),
        type: Joi.string()
    })
    let result = Joi.validate(data, schema);
    if (result.error) {
        return ctx.body = reset.error(3, result.error.details)
    }
    let reqdata = result.value; //经过验证后的数据
    const rsq = await USEERS.select('userName', `'${reqdata.userName}'`)
    if (rsq.length > 0) {
        const [user] = rsq
        if (user.password === reqdata.password) {
            const account = { ...user, geographic: JSON.parse(user.geographic), tags: JSON.parse(user.tags) }
            ctx.session.account = account
            ctx.body = reset.success(account)
        } else {
            ctx.body = reset.error('密码错误')
        }
    } else {
        ctx.body = reset.error('此账号未注册')
    }
};


/**
 * @description: 获取当前登录信息
 * @param {type} sessionid
 * @return: currentuser
 */
const fn_currentUser = async (ctx, next) => {
    let data = ctx.request.body
    if (ctx.session.account && ctx.session.account.userid && ctx.session.account.userid !== -1) {
        console
        const [user] = await USEERS.select('userid', `'${ctx.session.account.userid}'`)
        const account = { ...user, geographic: JSON.parse(user.geographic), tags: JSON.parse(user.tags), group: user.usergroup }
        delete account['usergroup']
        ctx.session.account = account
        ctx.body = reset.success(account)
    } else { //guest
        GUEST.avatar = getAvatar()
        ctx.session.account = ctx.session.account || GUEST
        console.log(ctx.session.account)
        ctx.body = reset.success(ctx.session.account)
    }
};
const fn_currentRouter = async (ctx, next) => {

    ctx.body = reset.success([
        {
            path: '/',
            redirect: '/welcome',

        },
        {
            path: '/welcome',
            name: '欢迎',
            icon: 'smile',
            component: './Welcome',

        },
        {
            path: '/listcardlist',
            name: '猫展厅',
            icon: 'smile',
            component: './ListCardList',

        },
    ])
}

/**
 * @description: 注册
 * @param {string} userName - 用户名
 * @param {string} password - 密码
 * @param {string} confirm  - 二次确认
 * @return: data
 */
const fn_login_signup = async (ctx, next) => {
    let data = ctx.request.body
    // console.log(data)
    let schema = Joi.object().keys({
        userName: Joi.string().required().min(3).max(15).label('用户名'),
        password: Joi.string().required().min(3).max(12).label('密码'),
        confirm: Joi.string().required().min(3).max(12).label('密码2')
    })
    let result = Joi.validate(data, schema);
    if (result.error) {
        return ctx.body = reset.error(result.error.details[0].message, result.error.details)
    }
    let reqdata = result.value; //经过验证后的数据
    const rsq = await USEERS.select('userName', `'${reqdata.userName}'`)
    if (rsq.length > 0) {
        return ctx.body = reset.error('此账号已注册')
    } else {
        const create = moment().format('YYYY-MM-DD HH:mm:ss')
        const rsq = await USEERS.insert({
            name: reqdata.userName,
            userName: reqdata.userName,
            password: reqdata.password,
            avatar: DEFAULTAVATAR,
            creatTime: create
        })
        const [user] = await USEERS.select('userName', `'${reqdata.userName}'`)
        ctx.session.account = user
        ctx.body = reset.success(rsq)
    }
    ctx.body = reset.success(data)
}

module.exports = {
    'POST /login/account': fn_login_account,
    'POST /login/signup': fn_login_signup,
    'GET /currentUser': fn_currentUser,
    'GET /currentRouter': fn_currentRouter,
};