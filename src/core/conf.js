/**
 * 内核: 配置
 */

module.exports = appInfo => {

    // 读取配置
    appInfo.confRead = function(path)
    {
        let confData = appInfo.conf;
        if( confData ){
            let psx = path.split('.');
            for(let i in psx){
                let key = psx[i];
                if( confData[key] ){
                    if( i == psx.length-1 ){
                        return confData[key]; // 取得
                    }
                    confData = confData[key];
                }
            }
        }
    }



}