/**
 * 时间帮助
 */



// ms : 是否返回毫秒
exports.time = function(ms)
{
    let msval = new Date().getTime();
    return ms ? msval : parseInt(msval/1000);
}