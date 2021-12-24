

exports.isArray = function(arg) {
    return Object.prototype.toString.call(arg) == '[object Array]';
}
    
exports.isObject = function(arg) {
    return Object.prototype.toString.call(arg) == '[object Object]';
}

exports.isFunction = function(arg) {
    return Object.prototype.toString.call(arg).endsWith('Function]')
}
    