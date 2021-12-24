/**
 * boot
 */
const path = require('path')


/**
 * cache
 */
var cache_paths = null

/**
 * 
 * @returns 
 */
function paths() {
    if(cache_paths){
        return cache_paths
    }
    var boot = path.dirname(process.argv[1])
    cache_paths = {
        boot: boot,
        app: boot + "/app",
        static: boot + "/static",
        language: boot + "/language",
    }
    return cache_paths
}


/** */
exports.paths = paths