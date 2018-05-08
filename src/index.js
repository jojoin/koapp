/**
 * web app engine: expre
 */


// 入口


const lib_loader = require('./lib/loader.js')
    , lib_http   = require('./lib/http.js')
    , lib_cluster   = require('./lib/cluster.js')
    ;



// 启动引擎
exports.start = async function (argument)
{
return new Promise( async function(resolve, reject){


    // 开始加载配置等等
    let app_context = await lib_loader.base();

    // 多核
    let is_cluster = lib_cluster.startup( app_context );
    if( ! is_cluster ){

        // 工作线程
        // 启动其它服务
        await lib_loader.run();
        // 启动http服务
        let hp = await lib_http.run( app_context );


    }

    // ok
    resolve( app_context );
});
}


