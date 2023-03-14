
const fs = require('fs')
const boot = require('./boot')

const allInitFileContents = {

    /* app/routes.js */
    "app/routes.js": `module.exports = {

    // page view
    '/': 'VIEW:index',

    // api test
    '/api/data/get': 'api/data/get',
    'POST:/api/data/save': 'api/data/save',

}
    `,

    /* app/controller/index.js */
    "app/controller/index.js": `module.exports = async function(cnf, ctx, next){

    ctx.body = "hollo koappx!"
    
}
    `,

    /* app/controller/api/data/get.js */
    "app/controller/api/data/get.js": `module.exports = async function(cnf, ctx){

    // ctx.apiError(res.err)
    ctx.apiData( {abc: 123} )
    
}
    `,

    /* app/controller/api/data/save.js */
    "app/controller/api/data/save.js": `const util = require('../util')

module.exports = async function(cnf, ctx){

    // ctx.apiError(res.err)
    let postdata = util.parseJsonPostData(ctx)
    console.log(postdata)
    
    ctx.apiData( {abc: 123} )
}
    `,


    /* app/controller/api/util.js */
    "app/controller/api/util.js": `exports.parseJsonPostData = async function(ctx){
    return new Promise((resolve,reject)=>{
        try{
            let postData=''
            ctx.req.addListener('data',(data)=>{
                postData+=data
            })
            ctx.req.on('end', ()=>{
                try{
                postData = JSON.parse(postData)
                }catch(e){}
                resolve(postData)
            })
        }catch(err){
            reject(err)
        }
    })
}
    `,

    /* language/en_US/index.js */
    "language/en_US/index.js": `module.exports = {
    "lang_show": "English",
}
    `,

    /* language/zh_CN/index.js */
    "language/zh_CN/index.js": `module.exports = {
    "lang_show": "简体中文",
}
    `,

    /* app/viewer/index.js */
    "app/viewer/index.js": `
    
exports.components = [
    'html',
    'header',

    'index',

    'footer',
    'tail',
]


exports.datas = async function(cnf, ctx)
{
    // let data_types = await ddd.getTypes()
    
    return {
        // isMobile: types.isMobile(ctx.req),
        // numToThousands: utilnumber.numToThousands,
        title: "Koappx framework"
    }
}

    `,
    

    /* app/component/html/html.html */
    "app/component/html/html.html": `
<!DOCTYPE html>
<html lang="en">
<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <link rel="shortcut icon" href="/cssimg/favicon.ico">

    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <title>[:=this.title||'Koappx v2.0':]</title>

    <!-- twitter share link -->
    [: if(this.twitter){ :]
    [: if(twitter.card){ :]<meta name="twitter:card" content="[:=twitter.card:]"/>[: } :]
    [: if(twitter.title){ :]<meta name="twitter:title" content="[:=twitter.title:]"/>[: } :]
    [: if(twitter.description){ :]<meta name="twitter:description" content="[:=twitter.description:]"/>[: } :]
    [: if(twitter.image){ :]<meta name="twitter:image" content="[:=twitter.image:]"/>[: } :]
    [: } :]

    <link rel="stylesheet" href="/jscss/[:=this.page.name:].css?v=[:=this.page.version:]">


</head>
<body>    
    `,

    /* app/component/html/html.js */
    "app/component/html/html.js": `
/*


// app
var VueAppOrders = {
    data() {
        return {
            xxx:123,
        }
    },
    methods: {
        func(){

        },
    }
}

// mount
Vue.createApp(VueAppOrders).mount('#orders');

*/

function $id(id){
    return document.getElementById(id)
}

function $class(elm, name){
    return elm.getElementsByClassName(name)
}

function getUrlQuery(variable){
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return null;
 }

 function numToThousands(num) {
    return num.toString().replace(/\d+/, function(n) {
       return n.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    });
 };


// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) 
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}


function tableToList(table) {
    if(!table || !table.keys || table.keys.length == 0){
        return [] // 空表
    }
   let list = []
   for(let r in table.rows){
       let row = table.rows[r]
       let obj = {}
       for(let i in table.keys){
           let k = table.keys[i]
           obj[k] = row[i]
       }
       list.push(obj)
   }
   return list
}

function getScrollTop() {  
    var scrollPos;  
    if (window.pageYOffset) {  
    scrollPos = window.pageYOffset; }  
    else if (document.compatMode && document.compatMode != 'BackCompat')  
    { scrollPos = document.documentElement.scrollTop; }  
    else if (document.body) { scrollPos = document.body.scrollTop; }   
    return scrollPos;   
}

function getStyle(obj, attr) 
{ 
    if(obj.currentStyle) 
    { 
        return obj.currentStyle[attr]; 
    } 
    else 
    { 
        return getComputedStyle(obj,false)[attr]; 
    } 
} 

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
}

function setCookie (cname, cvalue, path, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    var path = "path=" + path;
    var ck = cname + "=" + cvalue + "; " + expires + "; " + path
    console.info(ck);
    document.cookie = ck;
    console.info(document.cookie);
}


function delurlquery(url, name) {
    url = url.replace( new RegExp("\\\\?"+name+"=[^&]*", 'ig'), '?')
        .replace(new RegExp("&"+name+"=[^&]*", 'ig'), '&')
        .replace(/[\\?&]+$/ig, '')
    return url
}

function addurlquery(url, k, v) {
    var urls = delurlquery(url, k).split('#')
    , spmk = urls[0].indexOf('?')==-1 ? '?' : '&'
    urls[0] += spmk+k+'='+v
    return urls.join('#')
}



/////////////////////////////////////////////////


function tppl(tpl, data){
    var fn =  function(d) {
        var i, k = [], v = [];
        for (i in d) {
            k.push(i);
            v.push(d[i]);
        };
        return (new Function(k, fn.$)).apply(d, v);
    };
    if(!fn.$){
        var tpls = tpl.split('[:');
        fn.$ = "var $=''";
        for(var t = 0;t < tpls.length;t++){
            var p = tpls[t].split(':]');
            if(t!=0){
                fn.$ += '='==p[0].charAt(0)
                  ? "+("+p[0].substr(1)+")"
                  : ";"+p[0].replace(/\\r\\n/g, '')+"$=$"
            }
            // 支持 <pre> 和 [::] 包裹的 js 代码
            fn.$ += "+'"+p[p.length-1].replace(/\'/g,"\\\\'").replace(/\\r\\n/g, '\\\\n').replace(/\\n/g, '\\\\n').replace(/\\r/g, '\\\\n')+"'";
        }
        fn.$ += ";return $;";
        // log(fn.$);
    }
    return data ? fn(data) : fn;
}


///////////////////////////////////////////////////////


function apicallex(r, okcall, errcall) {
    if( ! r.data ) {
        return errcall && errcall("cannot get data")
    }
    if( r.data.ret > 0 ) {
        return errcall && errcall(r.data.err, r.data)
    }
    okcall && okcall(r.data)
}

function apiget(url, data, okcall, errcall) {
    axios
        .get(url, {
            params: data,
        })
        .then(function(r){
            apicallex(r, okcall, errcall)
        })
        .catch(errcall)
}


function apipost(url, data, okcall, errcall) {
    axios
        .post(url, data)
        .then(function(r){
            apicallex(r, okcall, errcall)
        })
        .catch(errcall)
}

////////////////////////////////////


`,

    /* app/component/html/html.less */
    "app/component/html/html.less": `
/*
@font-face {
    font-family: 'Montserrat';
    src: url('/font/montserrat.woff2?1');
}
*/
*{
    border: none;
    padding: 0;
    margin: 0;
    font-family: Montserrat,sans-serif, '微软雅黑';
    list-style: none;
    text-decoration: none;
    outline: none;
    font-size: 15px; 
}

input, textarea {
    box-sizing: border-box;//
    -webkit-box-sizing: border-box;//
    -moz-box-sizing: border-box;//
}


html {
    background-color: #f6f6f6;
}
body {
    background-color: #f6f6f6;
}

html, body, ol, ul{
    margin: 0; padding: 0;
}

.clear{
    clear: both;
    float: none;
}

.none{
    display: none;
}


/////////////////////////////////////////////////

input, textarea {
    display: block;
    padding: 10px;
    border: 1px solid #bbb;
    margin: 20px 0;
    width: 400px;
}
textarea {
    width: 600px;
    height: 100px;
}
button {
    padding: 10px 15px;
    background-color: salmon;
    color: white;
    font-weight: bold;
    margin: 10px 0;
    cursor: pointer;
    &.blue {
        background-color: rgb(58, 112, 211);
    }
    &.red {
        background-color: rgb(211, 60, 22);
    }
}
    

    `,

    /* app/component/tail/tail.html */
    "app/component/tail/tail.html": `

<!--<script src="/jslib/vue.3.2.22.min.js?v=1"></script>-->
<!--<script src="/jslib/axios.min.js?v=1"></script>-->

<script src="/jscss/[:=page.name:].js?v=[:=this.page.version:]"></script>

</body>
</html>

    `,

    // header footer index
    "app/component/header/header.html": `<div>header</div>`,
    "app/component/header/header.js": `/* header.js */`,
    "app/component/header/header.less": `/* header.less */`,
    "app/component/footer/footer.html": `<div>footer</div>`,
    "app/component/footer/footer.js": `/* footer.js */`,
    "app/component/footer/footer.less": `/* footer.less */`,
    "app/component/index/index.html": `<div>koappx index</div>`,
    "app/component/index/index.js": `/* index.js */`,
    "app/component/index/index.less": `/* index.less */`,

    // config
    "config.js": `module.exports = {
    debug: false,

    http_port: 8009,
    watch_restart_timeout: 0,
    
}`,
    "config.use.js": `module.exports = {
    debug: true,

    http_port: 8009,
    watch_restart_timeout: 0,

}`,


}


function createAllDir() {

    let btdir = boot.paths().boot
    // console.log(btdir)
    let mkdirs = [
        "app",
        
        "app/component",
        "app/component/html",
        "app/component/header",
        "app/component/index",
        "app/component/footer",
        "app/component/tail",

        "app/controller",
        "app/controller/api",
        "app/controller/api/data",

        "app/model",
        "app/viewer",

        "language",
        "language/en_US",
        "language/zh_CN",

        "static",
        "static/jslib",
        "static/cssimg",
        "static/jscss",
        "static/font",
        "static/image",
    ]
    for(var i in mkdirs) {
        let dir = btdir + "/" + mkdirs[i]
        console.log("> dir: " + dir)
        if(! fs.existsSync(dir)){
            try {
                fs.mkdirSync(dir)
            }catch(e){
                console.log(e)
            }
        }
    }


}


function createFileIfNotExists() {

    let btdir = boot.paths().boot
    // console.log(btdir)

    for(var fn in allInitFileContents) {
        let fcon = allInitFileContents[fn]
        let file = btdir + "/" + fn
        let is_exists = false
        if(fs.existsSync(file)){
            is_exists = true
        }else{
            try {
                fs.writeFileSync(file, fcon)
            }catch(e){
                console.log(e)
            }


        }
        console.log("+ file: " + file + (is_exists ? " [exists]" : ""))
    }





}

/**
 * create
 */
exports.create = function(){

    console.log("\nKoappx genesis project init start ...\n")

    // mkdir
    createAllDir()
    // create file
    createFileIfNotExists()


}