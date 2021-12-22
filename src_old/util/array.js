/**
 * 数组相关
 */




/**
 * 判断是否在数组中
 */
exports.in = function(ary, item){
    for(var i = ary.length-1; i>=0; i--) {
        if(item===ary[i]) return true;
    };
    return false;
}



/**
 * 去重
 */
exports.unique = function(ary){
    var s=new Set();
    ary.map((item,index)=>{
        s.add(item)
    })
    var temp=[];
    for(var i of s){
        temp.push(i)
    }
    return temp;
}



/**
 * 模式匹配
 */
exports.matchitem = function(val, arr, ptem) {
    for(var i in arr){
        if(val==arr[i]){
            return ptem[i];
        }
    }
    return null;
}


/**
 * 数组查询
 */
exports.select = function(ary, where, single){
    var res = [];
    for(var i=0; i<ary.length; i++){
        var one = ary[i]
          , ok = true;
        for(var w in where){
            if(one[w]!==where[w]){
                ok = false;
                break; // 不满足
            }
        }
        // 满足条件
        if(ok){
            if(single){
                return one;
            }else{
                res.push(one);
            }   
        }
    };
    return single&&res.length==0 ? null : res;
}




/**
 * 取得数组中元素的某个属性 单独返回数组元素
 */
exports.listem = function(ary, key) {
    var reary = []
        , leg = ary.length;
    for(var i=0; i<leg; i++){
        var d = ary[i][key];
        d?reary.push(d):0;
    }
    return reary;
};




/**
 * 两个数组对应关系
 */
exports.mapch = function(data, rows, dk, rk, name, isdel) {
    for(var d in data){
        var li = data[d]
          , kv = li[dk];
        if(isdel) delete li[dk];
        for(var r in rows){
            if(kv==rows[r][rk]){
                li[name] = rows[r];
                // if(del) delete rows[r][rk];
                break;
            }
        }
    }
    if(isdel){
        for(var r in rows){
            delete rows[r][rk];
        }
    }
};



/**
 * 删除数组中元素的某个属性
 */
exports.delitem = function(ary, key) {
    for(var i in ary){
        delete ary[i][key];
    }
};



/**
 * 检查元素的某个属性
 */
exports.ckitem = function(ary, key, value) {
    for(var i in ary){
        if(ary[i][key]==value){
            // 存在
            return true;
        }
    }
    // 不存在
    return false;
};



/**
 * 压平对象
 */
exports.flatObj = function(objary, keys) {
    if( ! Array.isArray(keys) ){
        keys = keys.split(',');
    }
    if( ! Array.isArray(objary) ){
        return flatObjToAry(objary, keys);
    }

    var ass = [];
    for(var i in objary){
        ass.push(flatObjToAry(objary[i], keys));
    }
    return ass;
};
function flatObjToAry(obj, keys) {
    var ary = [];
    for(var i in keys){
        ary.push(obj[keys[i]]);
    }
    return ary;
}





