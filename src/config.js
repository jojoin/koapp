/**
 * config
 */
const extend = require('extend')
const boot = require('./boot')

var config_cache = null

exports.config = function(){
    if(config_cache){
        return config_cache
    }
    var paths =  boot.paths()
    var config = {
        http_port: 8000,
        watch_restart_timeout: 0, // 0 is not restart
        lang: 'en_US', // zh_CN
        // mysql db
        mysqldb: {
            connectionLimit : 10,
            host     : '127.0.0.1',
            user     : 'root',
            password : '123456',
            database : 'test',
        }    
    }
    
    try{
        let cnf = require(paths.boot + '/config.js')
        extend(true, config, cnf)
    }catch(e){}
    
    try{
        let use = require(paths.boot + '/config.use.js')
        extend(true, config, use)
    }catch(e){}

    // return
    config_cache = config
    return config_cache
}




