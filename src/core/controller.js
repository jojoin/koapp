/**
 * 内核: 配置
 */

module.exports = app => {


    class Controller
    {

        constructor(){
            let that = this;
            this.ctx = {
            };
        }

        // 设置请求环境
        async __setReqRes(req, res, urlobj)
        {
            this.ctx.req = req;
            this.ctx.res = res;
            this.ctx.url = urlobj;
        }

        // 初始化
        async initialize()
        {

        }

        // 结束请求，返回内容
        set body( stuff ){
            let res = this.ctx.res;
            // 输出
            if( !res || stuff === null || stuff === undefined ){
                return;
            }
            if( typeof stuff == 'object' ){
                stuff = JSON.stringify(stuff); // json 字符串
            }
            res.writeHead(200);
            res.end( stuff );
        }


    }

    // 控制器基类
    app.Controller = Controller;

}