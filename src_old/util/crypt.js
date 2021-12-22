

var crypto = require('crypto');

/**
 * 取 md5 值
 */
exports.md5 = function(data)
{ 
    var Buffer = require("buffer").Buffer;
    var buf = new Buffer(data);
    var str = buf.toString("binary");
    return crypto.createHash("md5").update(str).digest("hex");
}


/**
 * 取 base64 值
 */
exports.base64 = function(data)
{
    var b = new Buffer(data);
    return b.toString('base64');
}
// 解码 new Buffer('SmF2YVNjcmlwdA==', 'base64').toString();


/**
 * 数字压缩
 */


// 数字加密算法
var numziphashchar = "qazxswedcvfrtgbnhyujmkiolpPOIUYTREWQASDFGHJKLMNBVCXZ1234567890";//~!@$%^*()[]{}<>,.;:-_+·'|&?#";

// 数字压缩
exports.ennum = function(num){
    num = parseInt(num)
    if(!num) return false;
    num += "";
    // 循环数字
    var zip = '';
    var one = '';
    for(var i in num){
        one += num[i];
        if(one.length==2){
            push();
        }else if(one==0||one>=6){ // 共62位 9,0 永远不会出现 可用于分割字符
            push();
        }
    }
    push();
    function push(){
        if(one){
            // log(one);
            zip += numziphashchar[parseInt(one)];
            one = '';
        }
    }
    return zip;
}
//var zip = zipnum(65402736);
//log(zip);



// 数字解压缩
exports.denum = function(zip){
    if(!zip) return false;
    var num = '';
    for(var i in zip){
        var c = zip[i];
        var x = numziphashchar.indexOf(c);
        num += x;
    }
    return num;
}
//var num = unzipnum(zip);
//log(num);




/**
 * ASC2 压缩
 */

var asc2ziphashchar = "POIUYTREWQASDFGHJKLMNBVCXZqazxswedcvfrtgbnhyujmkiolp1234567890`~!@#$%^&*()_+-={}|[]\\:\";'<>?,./ ";
var asc2ziphashchar_len = asc2ziphashchar.length;

// ASCII 字符串加密
exports.enasc2 = function(str){
    if(!str) return false;
    str += '';
    var nums = '';
    for(var i in str){
        var s = str[i];
        var x = asc2ziphashchar.indexOf(s);
        if(x==-1){ // 不支持的字符
            return false;
        }else if(x<10){
            x = '0'+x;
        }
        nums += x;
    }
    if(nums[0]=='0'){
        nums = nums.substr(1);
    }
    return nums;
}

// ASCII 字符串解密
exports.deasc2 = function(num)
{
    if(!num) return false;
    num += '';
    var real = '';
    var one = '';
    var num_len = num.length;
    for(var i in num){
        one += num[i];
        // log(i+':'+num[i]);
        if(one.length==2 || i==num_len-1){
            var x = parseInt(one);
            // log(x);
            if(x<asc2ziphashchar_len){
                var s = asc2ziphashchar[x];
                real += s;
            }else{
                return false; // 解密失败
            }
            one = '';
        }
    }
    // log(real);
    return real;
}





/**
 * 加密解密字符串
 * 解密结果前三位和后三位随机
 */
//26+26+10=62-1=61，字符串加密
var keycode = 'MnbHYcv52ur3AZak106xGBhVgJUsjd4Fq987LRytTEoDCpOPNwzXSWmfIKieQ';
var keyxchar = 'l';
function randchar(n){
    n = n || 1;
    var str = '';
    for(var i=0; i<n; i++){
        var ix = Math.floor(Math.random() * 61);
        str += keycode.charAt(ix);
    }
    return str;
}
exports.encrypt = function(str){
    str = str+'';
    var leg = str.length
        ,xAry = keycode.split('')
        ,fixStr = [];
    for(var i=0;i<leg;i++){
        var a = str.charCodeAt(i)
            ,str_i = ''
            ,pro = 100
            ,ary = [];
        for(var k=0;k<pro;k++)
        {
            if(k>0){
                a=(a-ary[k-1])/60;
            }
            ary[k] = a%60;
            if(0==a){ break; }
            str_i += xAry[a%60];
        }
        //console.log(str[i]+'-'+a+'-'+str_i);
        fixStr.push(str_i);
    }
    // console.log(fixStr.join(keyxchar));
    return fixStr.join(keyxchar);
    // return randchar(3)+fixStr.join(keyxchar)+randchar(3);
};


//解密
exports.decrypt = function(instr){
    if(!instr) return null;
    // instr = instr.substr(3,instr.length-6);
    instr = instr+'';
    var strary = instr.split(keyxchar)
        ,leg = strary.length
        ,str = '';
    for(var i=0;i<leg;i++)
    {
        var strMx = 0
            ,fixStr_i = strary[i]
            ,pro = fixStr_i.length;
        for(var k=0;k<pro;k++)
        {
            var cstr_k = fixStr_i[k]
                ,a = keycode.indexOf(cstr_k);
            strMx += a * Math.pow(60,k);
        }
        str += String.fromCharCode(strMx);
    }
    return str;
};