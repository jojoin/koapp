/**
 * 系统帮助
 */



// 解析通用命令行参数
// .... port 80 -h width 160
exports.parseSimpleCmdArgv = function(argv){
    argv = argv || process.argv;
    argv = argv.slice(2);
    let resobj = {};
    for(let i=0; i<argv.length;){
        if(argv[i].charAt(0)=='-'){
            resobj[argv[i]] = true;
            i += 1;
        }else{
            if(i+1<argv.length){
                resobj[argv[i]] = argv[1+i];
            }
            i += 2;
        }
    }
    return resobj;
}