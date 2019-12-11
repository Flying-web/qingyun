

const reset = require('../utils')
const Joi = require('joi')
const Sheet = require('../models')
const users = new Sheet('users')
// 用户列表
const fn_user_list = async (ctx, next) => {
    const data = await users.list()
    ctx.body = reset.success(data)
};

// 更新用户信息
const fn_user_update = async (ctx, next) => {
    let data = ctx.request.body
    if (ctx.session.account && ctx.session.account.userid) {
        ctx.body = reset.success(ctx.session.account)
    } else {
        ctx.body = reset.error('未登录')
    }
    let schema = Joi.object().keys({
        address: Joi.string(),
        group: Joi.string(),
        email: Joi.string(),
        name: Joi.string(),
        phone: Joi.string(),
        country: Joi.string(),
        geographic: Joi.object(),
    })
    let result = Joi.validate(data, schema);
    if (result.error) {
        return ctx.body = reset.error('', result.error.details)
    }
    let reqdata = result.value; //经过验证后的数据
    let updateData = { ...reqdata, geographic: JSON.stringify(reqdata.geographic),usergroup: reqdata.group }
    delete updateData['group']
    const rsq = await users.update('userid', ctx.session.account.userid, updateData)

    ctx.session.account = { ...ctx.session.account, ...reqdata }
    ctx.body = reset.success(ctx.session.account)
};
// 更新头像
const fn_user_updateAvatar = async (ctx, next) => {
    let data = ctx.request.body
    if (ctx.session.account && ctx.session.account.userid) {
        ctx.body = reset.success(ctx.session.account)
    } else {
        ctx.body = reset.error('未登录')
    }
    let schema = Joi.object().keys({
        avatar: Joi.string().required()
    })
    let result = Joi.validate(data, schema);
    if (result.error) {
        return ctx.body = reset.error(3, result.error.details)
    }
    let reqdata = result.value; //经过验证后的数据
    const rsq = await users.update('userid', ctx.session.account.userid, reqdata)

    ctx.session.account = { ...ctx.session.account, ...reqdata }
    ctx.body = reset.success(ctx.session.account)
};
// 更新标签
const fn_user_updateTags = async (ctx, next) => {
    let data = ctx.request.body
    if (ctx.session.account && ctx.session.account.userid) {
        ctx.body = reset.success(ctx.session.account)
    } else {
        ctx.body = reset.error('未登录')
    }
    let schema = Joi.object().keys({
        tags: Joi.string().required()
    })
    let result = Joi.validate(data, schema);
    if (result.error) {
        return ctx.body = reset.error('', result.error.details)
    }
    let reqdata = result.value; //经过验证后的数据
    const rsq = await users.update('userid', ctx.session.account.userid, reqdata)
    if(reqdata.tags.length > 200){
        ctx.body = reset.error('超过限制')
        return
    }
    ctx.session.account = { ...ctx.session.account, tags: JSON.parse(reqdata.tags) }
    ctx.body = reset.success(ctx.session.account)
};
module.exports = {
    'GET /user/list': fn_user_list,
    'POST /user/update': fn_user_update,
    'POST /user/updateAvatar': fn_user_updateAvatar,
    'POST /user/updateTags': fn_user_updateTags,
};