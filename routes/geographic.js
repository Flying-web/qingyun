

const reset = require('../utils')
const Joi = require('joi')
const moment = require('moment')

const city =  require('../geographic/city.json')
const province = require('../geographic/province.json')
moment.locale('zh-cn')
// 登陆
const fn_geographic_province = async (ctx, next) => {
    let data = ctx.request.body
    if (ctx.session.account && ctx.session.account.userid) {
        ctx.body = reset.success(ctx.session.account)
    } else {
        ctx.body = reset.error('未登录')
    }
    ctx.body = reset.success(province)
};

// 获取当前登录信息
const fn_geographic_city = async (ctx, next) => {
    let province = ctx.params.province
    if (ctx.session.account && ctx.session.account.userid) {
        ctx.body = reset.success(ctx.session.account)
    } else {
        ctx.body = reset.error('未登录')
    }
    if(province){
        ctx.body = reset.success(city[province])
    } else {
        ctx.body = reset.error('没有cityID')
    }
  
   
};


module.exports = {
    'GET /geographic/province': fn_geographic_province,
    'GET /geographic/city/:province': fn_geographic_city,
};