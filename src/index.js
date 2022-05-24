/**
 * web app engine: koapp
 */
const boot = require('./boot')
const server = require('./server')
const genesis = require('./genesis')

/**
 * config
 */
 exports.config = require('./config').config
 exports.paths = require('./boot').paths

/**
 * config
 */
 exports.util = function (name) {
    return require(`./util/${name}`)
 }


/**
 * genesis_init
 */
 exports.genesis_init = function() {
    genesis.create()
 }


/**
 * run
 */
exports.run = async function (argument)
{
    
    // console.log(' process.cwd(): ', process.cwd()) // 执行命令时所在的目录
    // console.log(' process.argv: ', path.dirname(process.argv[1])) // 命令行参数
    // console.log(' __dirname: ', __dirname)   // 该index.js所在的目录
    // console.log(' process.execPath: ', process.execPath)	// nodejs
    // console.log(boot.paths())
    // console.log("start koapp!")

    // start
    server.run()

}