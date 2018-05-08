/**
 * string 工具
 */



/**
 * 返回随机字符串
 */
var allchars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
exports.randStr = function(n){
    n = n || 1;
    var res = "";
    for(var i = 0; i < n ; i ++) {
        var id = Math.ceil(Math.random()*61);
        res += allchars[id];
    }
    return res;
}








/**
 * 多个字符分割字符串
 */
exports.splits = function(str){
    var xl = []
      , dstr = [str];
    for(var s in arguments){
        var one = arguments[s];
        if(one instanceof Array){
            for(var o in one){
                deal(one[o]);
            }
        }else{
            deal(one);
        }
    }
    function deal(x){
        var res = [];
        for(var d in dstr){
            res = res.concat(dstr[d].split(x));
        }
        dstr = res;
    }
    // 滤掉空字符串
    return dstr.filter(function(d){return d});
}
// var str = "123 abc,#$%   QET,!!!";
// log(str.splits(' ',','));



/**
 * 替换所有的字符串
 */
exports.replaceAll = function(str, s1, s2){ 
    return str.replace(new RegExp(s1,"gm"),s2); 
}


