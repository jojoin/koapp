/**
 * 文件系统辅助处理
 */

var path = require('path');


/**
 * 入口文件路径
 */
var cache_cwp = path.dirname(process.argv[1]);
exports.cwp = function(){
    return cache_cwp;
}


/**
 * 入口文件所在路径 与目标路径混合
 */
exports.cwp_join = function(pb, pt){
    pt = pt || '';
    return path.join(cache_cwp, pb, pt);
}

