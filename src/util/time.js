/**
 * 获取当前时间戳
 * @param {*} ms 是否返回毫秒
 * @returns 
 */
exports.current = function(ms) {
    let c = parseInt(new Date().getTime())
    return ms ? c :  parseInt(c / 1000)
}


