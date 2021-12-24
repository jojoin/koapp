/**
 * app
 */
 const Koa = require('koa');
 const app = new Koa();

 // modules
const config = require('./config').config()
const paths = require('./boot').paths()
const language = require('./language')
const viewer = require('./viewer')
const router = require('./router')


/**
 * run
 */
async function start(){
    await language.load(paths, config, app)
    await viewer.load(paths, config, app)
    await router.load(paths, config, app)
} 
start().then()


/**
 * listen
 */
 app.listen(config.http_port, function(){
    // var tt = config.watch_restart_timeout
    console.log(`app listening on port ${config.http_port}!`)
});

// exit event
process.on('exit', function(){
})


