const reset = require('../utils')
const Joi = require('joi')
const Sheet = require('../models')
const CATS = new Sheet('cats') // sql操作

// 猫咪列表
const fn_cats_list = async (ctx, next) => {
    const data = await CATS.list()
    ctx.body = reset.success(data)
};

// 猫咪名称
const fn_cats_names = async (ctx, next) => {
    const data = ['金刚', '骨折猫', '蓝猫']
    ctx.body = reset.success(data)
};

// 添加猫咪
const fn_cats_add = async (ctx, next) => {
    let data = ctx.request.body
    let schema = Joi.object().keys({
        name: Joi.string().required(),
        title: Joi.string().required(),
        types: Joi.string().required(),
        poster: Joi.string().required(),
    })
    let result = Joi.validate(data, schema);
    if (result.error) {
        return ctx.body = reset.error(400, result.error.details)
    }
    let reqdata = result.value; //经过验证后的数据

    const { userid } = ctx.session.account
    const rsq = await CATS.create({ ...reqdata, uid: userid || -1, moment: new Date() })
    ctx.body = reset.set(rsq)
};

module.exports = {
    'GET /cats/list': fn_cats_list,
    'POST /cats/add': fn_cats_add
};