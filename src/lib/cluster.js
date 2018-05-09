
/**
 * 多线程启动模块
 */

const cluster = require('cluster')
    , numCPUs = require('os').cpus().length
    ;


// 启动多线程服务
exports.startup = function (app)
{
    // 是否禁用
    let not_worker = app.confRead( 'port.worker.enabled' )===false;

    if (cluster.isMaster) {
        if( not_worker ){
            // 主线程监听 继续
            return true; 
        }else{
            forkWorker(); // 创建子线程
        }
    }else{
        if(not_worker){
        }else{
            willKill(); // 是否子线程自杀
            // 子线程 继续
            return true; 
        }
    }


    // 自杀
    function willKill()
    {

        // app.log(`worker ${process.pid} started`);
        // 定时自杀
        let killsec = app.confRead( 'port.worker.expire' );
        // app.log(killsec);
        if( killsec > 0 ){
            setTimeout(x=>{
                process.exit(); //
            }, killsec * 1000);
        }


    }

    // 创建子线程
    function forkWorker()
    {
        // 监听
        let worker_num = app.confRead( 'port.worker.num' ) || numCPUs;    

        let http_port = app.confRead( 'port.listen.http' ) || 9693;

        app.log(`expre cluster ${process.pid} listen on port ${http_port}, ${worker_num} worker starting...`);

        // 衍生工作进程
        for (let i = 0; i < worker_num; i++) {
            cluster.fork();
        }
        // 退出重启
        let delay_time = app.confRead( 'port.worker.delay' ) || 1; 
        cluster.on('exit', (worker, code, signal) => {

            app.log(`worker ${worker.process.pid} exit, after ${delay_time} sec forking...`);

            setTimeout(x=>{
                cluster.fork(); // 重启一个
            }, delay_time * 1000);
        });

    }

}