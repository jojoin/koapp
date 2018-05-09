/**
 * 监听端口 服务器
 */


const cluster = require('cluster')
    , http = require('http')
    , numCPUs = require('os').cpus().length
    ;


const lib_ctrl = require('./ctrl.js')
    ;



// 启动 http 服务
exports.run = async function (app)
{
return new Promise( async function(resolve, reject){

    // 读取端口配置
    let cnfkey = 'port.listen.http';
    let http_port = app.confRead( cnfkey );
    if( ! http_port ){
        http_port = 9693;
        console.log('Expre need config of http listen port (default '+http_port+'), plase add config to "'+cnfkey+'".');
    }

    // 监听
    let worker_num = app.confRead( 'port.worker.num' ) || numCPUs;

    //if (cluster.isMaster) {


        app.log(`process ${process.pid} listen port ${http_port}`);


    //} else {

        // 工作进程可以共享任何 TCP 连接。
        // 在本例子中，共享的是一个 HTTP 服务器。
        http.createServer(

            lib_ctrl( app ) // 路由分发

        ).listen( http_port );
    //}



});
}

