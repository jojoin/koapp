/**
 * 实用工具
 */


/**
 * 判断是否为微信访问
 */
exports.isWeChat = function(req)
{
    return req.headers["user-agent"].toLowerCase().match(/micromessenger/);
}



/**
 * 判断手机浏览器访问
 */
exports.isMobileDevice = function(req)
{
    let is_mb = req.headers["user-agent"].toLowerCase().match(/(iphone|ipod|ipad|android)/);
    return is_mb;
}



/**
 * 配置扩展
 */
exports.extendConfig = function(conf, n, v,  reset)
{
    if(v===undefined||v===null){
        return;
    }
    // 强制重置
    if(reset){
        return conf[n] = v;
    }
    if(Array.isArray(conf[n])) {
        conf[n].push(v);
    } else if(conf[n]!==null && typeof conf[n] == 'object') {
        conf[n] = Object.assign(conf[n], v);
    } else {
        conf[n] = v;
    }
}









/**
 * 压缩 html
 */
exports.htmlminify = function(str){
    if(!str) return '';
    return str
        .replace(/<!--[\w\W\r\n]*?-->/gmi, '')
        .replace(/<!\S*!>/gmi, '') // <!libjs!>
        .replace(/[\r\n\t\s]+/g, ' ')
        .replace(/>\s/g, '>')
        .replace(/\s</g, '<')
        .replace(/\]\s*</g, ']<') // tppl
        .replace(/>\s*\[/g, '>[') // tppl
        .replace(/(^\s*)|(\s*$)/g,'') // drop 首尾空格
        ;
}



/**
 * tppl 模板引擎 
 * https://github.com/yangjiePro/tppl
 */
exports.tppl = function(tpl, data)
{
    var fn =  function(d) {
        var i, k = [], v = [];
        for (i in d) {
            k.push(i);
            v.push(d[i]);
        };
        // log(d);
        return (new Function(k, fn.$)).apply(d, v);
    };
    if(!fn.$){
        fn.$ = "_=''";
        var ts = tpl.split(':]')
          , tpls=[]
          ;
        for(var i in ts){
            var li = ts[i].split('[:')
              , l = li[0]
              , r = li[1];
            // log(li);
            fn.$ += (l ? "+'"+l.replace(/\'/g,"\\'").replace(/\r\n|\n|\r/g, "\\n")+"'" : '')
                 +  (r ? (r[0]=='=' 
                        ? '+('+r.substr(1)+')'
                        : ';'+r.replace(/\r\n|\n|\r/g, "")+"_=_")
                     : '');
        }
        fn.$ += ';return _;';
        // log(fn.$);
    }
    return data ? fn(data) : fn;
}



