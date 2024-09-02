/*
* server
*/
 const config = require('./config').config()

/*
* 
*/
exports.run = function() {

    if(config.watch_restart_timeout <= 0) {
        require("./app.js")
        return
    }

    let fork = require('child_process').fork;
    let workers = [];
    let appsPath = ['./app.js'];

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
            }, 1000)
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
