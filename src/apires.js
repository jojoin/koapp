
exports.load = async function(app) {

    app.use(async (ctx, next) => {
        ctx.apiData = function(data){
            data = data || {}
            data.ret = 0
            ctx.body = data
        }
        ctx.apiError = function(errstr, code){
            ctx.body = {
                ret: code || 1,
                err: errstr || "Error"
            }
        }
        await next()
    })


}
