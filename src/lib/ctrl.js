/**
 * 控制器
 */



const url = require('url');


const controllers = {};



module.exports = app => {




    // 控制器 分发
    function distribute (req, res)
    {

        // 解析
        let urlobj = url.parse(req.url, true);
        let pathname  = urlobj.pathname
          , anm = pathname.length-1
          ;
        if( anm > 0 && pathname[anm] == '/' ){
            pathname = pathname.substr(0, anm);
        }
        // console.log( pathname );
        // console.log( app.__router );
        
        // 检查路由
        let method = req.method.toUpperCase()
            // 是否找到无参数的路由
          , route_obj = app.__router[method].map[ pathname ] || null
          , url_path_param = {}
          ;
        // 查找有参数的路由
        if( ! route_obj ){
            let route_ary = app.__router[method].ary;
            for(let i in route_ary){
                let li = route_ary[i]
                  , rex = li[0]
                  , keys = li[1]
                  ;
                let args = rex.exec(pathname); //正则匹配
                if(args){  // 匹配完成
                    // 第一个值为匹配到的整个url，后面才是匹配的的值
                    for(let n=0; n<keys.length; n++){
                        url_path_param[keys[n]] = args[n+1]; //url内的参数 如 :uid
                    }
                    route_obj = [ ...li ];
                    route_obj.shift(); // 去掉多余参数
                    route_obj.shift();
                    break;
                }
            }
        }


        // 控制器处理函数
        let ctrlFunc; 

        // 找到匹配的路径
        if( route_obj ){
            // 等待数据获取完成
            ctrlFunc = route_obj[ route_obj.length-1 ];
        }else if( app.routeNotFind ){
            // 自定义 404
            ctrlFunc = app.routeNotFind;
        }


        // 处理
        if( ctrlFunc ){

            // 创建实例化控制器
            urlobj.param = url_path_param; // url参数
            let newReqObject = new app.Controller();
            newReqObject.__setReqRes(req, res, urlobj);
            newReqObject.initialize();

            // 执行
            ctrlFunc.call( newReqObject );

        // 无处理器
        }else{

            let notfind = '404 not find: '+urlobj.href;
            // app.log(notfind);
            res.end(notfind);
        }
        

    }



    // 创建控制器









    return distribute;


}