/**
 * 内核: 打印
 */

module.exports = appInfo => {


    let hascnf = ( appInfo.conf && appInfo.conf.log ) || appInfo.conf.log;


    ////////////////


    appInfo.log = function (...arg)
    {
        if( isNotEnable() )
            return;
        // 仅打印
        console.log(...arg);
    }


    appInfo.log.tag = function (tag, ...arg)
    {
        if( isNotEnable() )
            return;
        // 检查 tag 过滤
        if( hascnf && typeof hascnf.allow_tag == 'Object'
            && hascnf.allow_tag.indexOf(tag) == -1 // 不是允许的打印
        ){
            return;
        }

        // 打印
        process.stdout.write('['+tag+']')
        console.log(...arg);
    }


    /////////////////////////////


    // 检查是否[不允许]打印
    function isNotEnable(){
        if( hascnf && hascnf.enable === false ){
            return true;
        }
    }
}








