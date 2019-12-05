

const reset = require('../utils')
const Joi = require('joi')
const Sheet = require('../models')
const users = new Sheet('users')
const moment = require('moment')
moment.locale('zh-cn')
// 登陆
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
    const rsq = await users.select('userName', `'${reqdata.userName}'`)

    if (rsq.length > 0) {
        if (rsq[0].password === reqdata.password) {
            const tags = rsq[0].tags !=="" ? JSON.parse(rsq[0].tags) : []
            const geographic = rsq[0].geographic !== "" ? JSON.parse(rsq[0].geographic) : {}
            const account = { ...rsq[0], tags, geographic }
            ctx.session.account = account
            ctx.body = reset.success(account)
        } else {
            ctx.body = reset.error('密码错误')
        }
    } else {
        ctx.body = reset.error('此账号未注册')
    }


};

// 获取当前登录信息
const fn_currentUser = async (ctx, next) => {
    let data = ctx.request.body
    if (ctx.session.account && ctx.session.account.userid) {
        ctx.body = reset.success(ctx.session.account)
    } else {
        ctx.body = reset.error('未登录')
    }

};

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
    const rsq = await users.select('userName', `'${reqdata.userName}'`)
    if (rsq.length > 0) {
        return ctx.body = reset.error('此账号已注册')
    } else {
        const create = moment().format('YYYY-MM-DD HH:mm:ss')
        const rsq = await users.insert({
            name: reqdata.userName,
            userName: reqdata.userName,
            password: reqdata.password,
            avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
            creatTime: create
        })
        ctx.body = reset.success(rsq)

    }

    ctx.body = reset.success(data)

}

module.exports = {
    'POST /login/account': fn_login_account,
    'POST /login/signup': fn_login_signup,
    'GET /currentUser': fn_currentUser,
};