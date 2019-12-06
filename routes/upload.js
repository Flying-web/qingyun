

const reset = require('../utils')

// 用户列表
const fn_upload = async (ctx, next) => {
    console.log(ctx.request.files);
    if(ctx.request.files) {
        ctx.body = reset.set('done',ctx.request.files,'',{
            ...ctx.request.files.file,
            thumbUrl: ctx.request.files.path,
            url: ctx.request.files.path,
        })
    } else {
        ctx.body = reset.error('上传出错')
    }
   
};


module.exports = {
    'POST /upload': fn_upload
};