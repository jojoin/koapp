/**
 * 加载器，第一启动
 */


/**
    // 路径检查
    console.log('*** path check start ***');
    console.log('***      module.filename  = ' + module.filename);
    console.log('***           __filename  = ' + __filename);
    console.log('***            __dirname  = ' + __dirname);
    console.log('***        process.cwd()  = ' + process.cwd());
    console.log('*** require.main.filename = ' + require.main.filename);
    console.log('*** require.main.path     = ' + require('path').dirname(require.main.filename)); // 入口文件 index.js 路径
    console.log('*** path check end ***');
**/



const path      = require('path')
    , fs        = require('fs')
    , util      = require('util')
    ;

const util_object = require('../util/object.js')
    , app = require('./app.js')
    ;


const dir_main   = path.dirname(require.main.filename)
    , dir_app    = path.join(dir_main, './app')

    , dir_boot   = path.join(__dirname, '../boot') // 引导
    , dir_core   = path.join(__dirname, '../core') // 核心

    ;



// 启动 Loader 基础
exports.base = async function ()
{
return new Promise( async function(resolve, reject){

    // 加载配置等等
    await loadBoot       ( );                // 引导
    await loadConf       ( 'conf' );         // 配置
    await loadCore       ( );                // 核心
    await loadInit       ( 'init' );         // 初始化

    // ok
    resolve( app.Context );

});
}


// 启动 Loader 应用化
exports.run = async function ()
{
return new Promise( async function(resolve, reject){

    // 控制器页面等
    await loadHelp       ( 'help' );         // 帮助
    await loadView       ( 'view' );         // web页面
    await loadControl    ( 'control' );      // 控制器
    await loadRoute      ( 'route' );        // 路由

    // ok
    resolve( app.Context );

});
}




// 加载路由
async function loadRoute ( dir )
{
return new Promise( async function(resolve, reject){
    // 扫描 js 文件，绝对路径
    let files = await scanFile ( path.join(dir_app, './'+dir), 'js', true );

    let whole_router;
    // 加载执行
    files.forEach(function( f ){
        let mod = require(f)
          , name = path.basename(f, '.js');
        // 执行
        let router = mod(app.Context);
        router.__renderForContext(app.Context); // 输出至app上下文
    });

    // app.Context.Log('yangjie');    

    // ok
    resolve();

});
}



// 加载控制器
async function loadControl ( dir )
{
return new Promise( async function(resolve, reject){
    // 扫描 js 文件，绝对路径
    let files = await scanFile ( path.join(dir_app, './'+dir), 'js', true );

    app.Context[dir] = app.Context[dir] || {};

    // 加载执行
    files.forEach(function( f ){
        let mod = require(f)
          , name = path.basename(f, '.js')
          , _class = mod(app.Context)
          , Obj = new _class() // 实例化
          ;
        // 执行 实例化
        Obj.__Class =_class
        app.Context[dir][name] = Obj;
    });
    
    // console.log(app.Context[dir]);

    // ok
    resolve();
});
}


// 加载web页面
async function loadView ( dir )
{
return new Promise( async function(resolve, reject){
    // 扫描 js 文件，绝对路径
    let files = await scanFile ( path.join(dir_app, './'+dir), 'js', true );

    // 加载执行
    files.forEach(function( f ){
        let mod = require(f)
          , name = path.basename(f, '.js');
        // 执行
        mod(app.Context);
    });
    

    // ok
    resolve();
});
}



// 加载初始化
async function loadInit ( dir )
{
return new Promise( async function(resolve, reject){
    // 扫描 js 文件，绝对路径
    let files = await scanFile ( path.join(dir_app, './'+dir), 'js', true );

    // 加载执行
    files.forEach(function( f ){
        let mod = require(f);
        // 执行
        mod(app.Context);
    });
    
    // ok
    resolve();
});
}



// 加载初始化
async function loadHelp( dir )
{
return new Promise( async function(resolve, reject){
    // 扫描 js 文件，绝对路径
    let files = await scanFile ( path.join(dir_app, './'+dir), 'js', true );

    app.Context[dir] = app.Context[dir] || {};

    // 加载执行
    files.forEach(function( f ){
        let mod = require(f)
          , name = path.basename(f, '.js');
        // 执行
        app.Context[dir][name] = mod(app.Context);
    });
    
    // ok
    resolve();
});
}


// 加载所有配置文件
async function loadConf ( dir )
{
return new Promise( async function(resolve, reject){
    // 扫描 js 文件，绝对路径
    let dir_conf = path.join(dir_app, './'+dir)
      , files = await scanFile ( dir_conf, 'js', true )
      , env_files = []
      ;

    // 加载执行环境配置文件
    if( global.EXPRE_ENV ){
        let env_dir = path.join(dir_conf, './'+global.EXPRE_ENV);
        env_files = await scanFile ( env_dir, 'js', true )

    }else{
        // 警告
        console.error('Expre need environment defined, assign global.EXPRE_ENV to \'dev\' or other.');
    }

    app.Context[dir] = app.Context[dir] || {};

    // 加载配置
    files.forEach(function(f){
        let mod = require(f)
          , name = path.basename(f, '.js');
        // 数据get
        app.Context[dir][name] = mod(app.Context);
    });

    // 环境配置扩充覆盖
    env_files.forEach(function(f){
        let mod = require(f)
          , name = path.basename(f, '.js');
        // 扩展对象
        util_object.extend(
            ( app.Context[dir][name] || {}),
            mod(app.Context),
            true // 覆盖
        );
    });

    // ok
    resolve();
});
}



// 加载所有配置文件
async function loadCore ( )
{
return new Promise( async function(resolve, reject){
    // 扫描 js 文件，绝对路径
    let files = await scanFile ( dir_core, 'js', true );

    // 加载执行
    files.forEach(function( f ){
        let mod = require(f);
        // 执行
        mod(app.Context);
    });


    // ok
    resolve();
});
}



// 加载所有配置文件
async function loadBoot ( )
{
return new Promise( async function(resolve, reject){
    // 扫描 js 文件，绝对路径
    let files = await scanFile ( dir_boot, 'js', true );

    // 加载执行
    files.forEach(function( f ){
        let mod = require(f);
        // 执行
        mod(app.Context);
    });


    // ok
    resolve();
});
}







/////////////////////////////////






// 扫描文件  
async function scanFile (dir, ext, ret_absolute)
{
return new Promise( async function(resolve, reject){
    // console.log(dir);
    fs.readdir(dir, function(err, files){
        let file_arr = [];
        if( ! files ){
            return resolve(file_arr);
        }
        files.forEach(function(elm){
            if( elm.indexOf('.') > -1 ){
                if( !ext || '.'+ext.toUpperCase()==path.extname(elm).toUpperCase() ){
                    // 返回全路径
                    if( ret_absolute ){
                        elm = path.join(dir, elm);
                    }
                    // 检查文件后缀名
                    file_arr.push(elm);
                }
            }
        });
        resolve(file_arr);
    });
});
}


// 扫描路径
async function scanDir (dir)
{
return new Promise( async function(resolve, reject){
    // console.log(dir);
    fs.readdir(dir, function(err, files){
        let dir_arr = [];
        if( ! files ){
            return resolve(dir_arr);
        }
        files.forEach(function(elm){
            if( elm.indexOf('.') == -1 ){ // 没有点号 目录
                dir_arr.push(elm);
            }
        });
        resolve(dir_arr);
    });
});
}




