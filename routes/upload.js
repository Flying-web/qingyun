

const reset = require('../utils')

// 用户列表
const fn_upload = async (ctx, next) => {
    if (ctx.request.files) {
        ctx.body = reset.set('done',  {
            lastModifiedDate: ctx.request.files.file.lastModifiedDate,
            name: ctx.request.files.file.name,
            size: ctx.request.files.file.size,
            type: ctx.request.files.file.type,
            path: 'http://localhost:3000/' + ctx.request.files.file.path,
        }, '')
    } else {
        ctx.body = reset.error('上传出错')
    }

};


module.exports = {
    'POST /upload': fn_upload
};