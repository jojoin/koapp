/**
 * json 格式数据接口
 */

const querystring = require('querystring');
const util = require('util');
const eutil = require('./util.js');


// 配置
let conf = {
    'retmsg': {}, // 错误消息
    'missmust': null, // 缺失必须参数的处理
};



// 设置
exports.set = function(name, value, isadd)
{
    eutil.extendConfig(conf, name, value, isadd);
}



// 输出数据
exports.renderData = function(res, data)
{
    let render = {
        'ret': 0,
        'data': data||null,
    }
    if(data) render['data'] = data;
    res.end(JSON.stringify(render));
}


// 输出错误
exports.renderError = function(res, errcode=1, msg='', data=null)
{
    let is_add
      , text = conf.retmsg[errcode+''] || ''
      ;
    if(msg.charAt(0)=='+'){
        is_add = true;
        msg = msg.substr(1);
    }
    let render = {
        'ret': errcode,
        'msg': is_add ? text+msg : (msg||text) ,
    }
    if(data) render['data'] = data;
    
    res.end(JSON.stringify(render));
}


// 检查输入参数
exports.checkInput = function(req, res, must=[], other={}, opt={})
{
    // 查看 url 参数
    let pm = Object.assign({},
        req.url.key,
        req.url.query
    );

    if( !opt.post ){
        return check(pm);
    }

    // 获取post数据
    return new Promise(function(resolve, reject){
        let postData = '';
        req.on('data', function(chunk){
            postData += chunk;
        });
        req.on('end', function(){
            let post = querystring.parse(postData);
            resolve(check(
                Object.assign(pm, post)
            ));
        });
    });

    // 检查必传参数
    function check(pm){
        let resdata = {};
        // 检查必须参数
        must = must || [];
        for(let i in must){
            let one = must[i];
            if(pm[one]===undefined){
                if(conf.missmust){ // 外部处理
                    conf.missmust(req, res, one);
                }
                return false; // 检查失败
            }
            resdata[one] = pm[one];
        }
        // 设置默认参数
        other = other || {};
        for(let i in other){
            if(pm[i]===undefined){
                resdata[i] = other[i];
            }else{
                resdata[i] = pm[i];
            }
        }
        return resdata;
    }
}




//////////////// 库函数 ////////////////

// 如数据表一样 压缩 json数据
// datalist = []
// 仅支持两层压缩！
exports.tableZip = function( datalist )
{
    let ziplist = [];

    if( datalist.length > 0 ){
        // 获得表头
        let line1 = datalist[0]
        ,   fields = [];
        for(let i in line1){
            let v = line1[i];
            if( typeof v == 'object' ){ // 第二层
                let fd2 = [];
                for(let f in v){
                    fd2.push(f);
                }
                fd2.push( i ); // 末尾追加 第二层的 总 key
                fields.push(fd2);
            }else{
                fields.push(i);
            }
        }
        ziplist.push(fields);
        // 解析数据行
        for(let k in datalist){
            let li = datalist[k]
            ,   dataline = [];
            for(let j in li){
                let v = li[j];
                if( typeof v == 'object' ){ // 第二层
                    let dt2 = [];
                    for(let z in v){
                        dt2.push(v[z]);
                    }
                    dataline.push(dt2);
                }else{
                    dataline.push(v);
                }
            }
            ziplist.push(dataline);
        }
    } 
    return ziplist; 
}





//////////////// 帮助函数 ////////////////





// 解析逗号分隔的id列表
exports.inputParseIdList = function(str)
{
    let ids = str.split(',');
    var idlist = [];
    for(let i in ids){
        var one = parseInt(ids[i]);
        if( one > 0 ){
            idlist.push(one);
        }
    }
    return idlist;
}



