/*
* server
*/
const cluster = require('cluster');
const config = require('./config').config()



/*
* 
*/
exports.run = function(initfunc) {

    // console.log("cluster.isMaster: ", cluster.isMaster)
    
    let rsti = config.watch_restart_timeout;
    let do_run = function() {
        require("./app.js")
        initfunc && initfunc();
    }

    if(rsti <= 0) {
        // console.log('rsti <= 0  ./app.js');
        return do_run()
    }

    if (cluster.isWorker) {
        // console.log('!cluster.isMaster  ./app.js');
        return do_run()
    }
    
    var forkWorker = function(){
        var worker = cluster.fork();
        setTimeout(function(){
            worker.kill();
        }, rsti * 1000) // restart
        console.log('worker [%d] has been created.', worker.process.pid);
        return worker;
    };
    
    // cluster 
    forkWorker() // master

    cluster.on('exit', function (worker, code, signal) {
        console.log('worker [%d] died <%s>, after 10s to fork a new one.', worker.process.pid, code||signal);
        setTimeout(forkWorker, 10000)
    });

    cluster.on('online', function(worker){
        // console.log('worker [%d] is running.', worker.process.pid);
    });

}


/*
* 
*/
exports.run_old = function() {

    if(config.watch_restart_timeout <= 0) {
        require("./app.js")
        return
    }

    let fork = require('child_process').fork;
    let workers = [];
    let appsPath = ['./index.js'];

    let createWorker = function(appPath){
        let worker = fork(appPath);
        setTimeout(() => {
            worker.kill()
        }, config.watch_restart_timeout * 1000)
        worker.on('exit',function(){
            if(config.watch_restart_timeout>=10){
                console.log('worker: ' + worker.pid + ' exited');
            }
            delete workers[worker.pid];
            setTimeout(function(){
                createWorker(appPath);
            }, 11000)
        });
        workers[worker.pid] = worker;
        if(config.watch_restart_timeout>=10){
            console.log('create worker:' + worker.pid);
        }  
    };
    // start workers
    for (let i = appsPath.length - 1; i >= 0; i--) {
        createWorker(appsPath[i]);
    }
    // kill worker on parent exit
    process.on('exit',function(){
        for(let pid in workers){
            workers[pid].kill();
        }
    });


}
