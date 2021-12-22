


/**
* 深层合并两个对象，override表示是否覆盖前面的属性值
* */
exports.extend = function(tar, get, override){
    if(!tar || !get || typeof get!=='object')
        return;
    if(typeof get!=='object')
        tar = {};
    for(var i in get){
        if(get[i] instanceof Object){
            tar[i] = tar[i] || {};
            exports.extend(tar[i],get[i],override);
        }else if(get[i] instanceof Array){
            if(override || !tar[i])
                tar[i] = get[i];
        }else{
            if(override || !tar[i])
                tar[i] = get[i];
        }
    }
};

/**
 * 对象的深拷贝！
 * */
exports.clone = function(jsonObj){
    var buf;
    if (jsonObj instanceof Array) {
        buf = [];
        var i = jsonObj.length;
        while (i--) {
            buf[i] = arguments.callee(jsonObj[i]);
        }
        return buf;
    }else if (typeof jsonObj == "function"){
        return jsonObj;
    }else if (jsonObj instanceof Object){
        buf = {};
        for (var k in jsonObj) {
            buf[k] = arguments.callee(jsonObj[k]);
        }
        return buf;
    }else{
        return jsonObj;
    }
};