/**
 * 内核: 路由
 */

module.exports = app => {


    class Router
    {

        constructor(){
            this.middlewares = []; // 中间件列表
            this.pathary = {GET:[],POST:[]};
            this.pathmap = {GET:{},POST:{}};
        }

        // 添加中间件
        async addMiddleware(middleware){
            this.middlewares.push(middleware);
        }

        // GET 请求
        async get(...arg) {  this.__addPath( 'GET', ...arg ); }
        // POST 请求
        async post(...arg) { this.__addPath( 'POST', ...arg ); }

        // 添加
        async __addPath(method, urlpath, ...middleware_and_control)
        {
            this.pathmap[method] = this.pathmap[method] || {};
            this.pathary[method] = this.pathary[method] || [];
            let routedata = [method, urlpath, ...middleware_and_control];
            if( urlpath.indexOf('/:') == -1 ){
                this.pathmap[method][urlpath] = routedata;
            }else{
                let keys = [];
                let rex = pathRegexp(urlpath, keys);
                this.pathary[method].push([rex, keys, ...routedata] );
            }
        }

        // 输出至上下文
        async __renderForContext( app_context )
        {
            // 结构
            app_context.__router = app_context.__router || {
                GET: {
                    ary: [],
                    map: {},
                },
                POST: {
                    ary: [],
                    map: {},
                }
            };
            // 内容
            app_context.__router.GET.ary.push( ...this.pathary.GET );
            app_context.__router.POST.ary.push( ...this.pathary.POST );
            Object.assign(
                app_context.__router.GET.map,
                this.pathmap.GET
            );
            Object.assign(
                app_context.__router.POST.map,
                this.pathmap.POST
            );
        }


    }

    // 路由基类
    app.Router = Router;

}





/**
 * 将 路径url 解析成 正则对象
 */
function pathRegexp(path, keys, sensitive, strict) {
    if (path instanceof RegExp) return path;
    if (Array.isArray(path)) path = '(' + path.join('|') + ')';
    path = path
        .concat(strict ? '' : '/?')
        .replace(/\/\(/g, '(?:/')
        .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g, function(_, slash, format, key, capture, optional, star){
            //keys.push({ name: key, optional: !! optional });
            keys.push(key);
            slash = slash || '';
            return ''
                + (optional ? '' : slash)
                + '(?:'
                + (optional ? slash : '')
                + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'
                + (optional || '')
                + (star ? '(/*)?' : '');
        })
        .replace(/([\/.])/g, '\\$1')
        .replace(/\*/g, '(.*)');
    return new RegExp('^' + path + '$', sensitive ? '' : 'i');
};


