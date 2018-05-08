/**
 * 内核: 配置
 */

module.exports = app => {


    class Controller
    {

        constructor(){
            let that = this;
            this.ctx = {
                set body( stuff ){
                    that.__render(stuff); // 输出
                }
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

        // 结束请求，输出检查内容
        async __render(text)
        {
            let res = this.ctx.res;
            // 输出
            if( text === null || text === undefined ){
                return;
            }
            if( typeof text == 'object' ){
                text = JSON.stringify(text); // json 字符串
            }
            res.writeHead(200);
            res.end( text );

        }

    }

    // 控制器基类
    app.Controller = Controller;

}