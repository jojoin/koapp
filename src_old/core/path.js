/**
 * 内核: 配置
 */


const path = require('path')



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



module.exports = app => {


    class Path{

        constructor(){

        }

        // 当前程序入口路径
        get pwd () {
            if( ! this._main_path ){
                this._main_path = path.dirname(require.main.filename)
            }
            return this._main_path
        }


    }



    // 路径 类
    app.path = new Path()

}
