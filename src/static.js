/**
 * static
 */

const koaStatic = require('koa-static')


/**
 * server
 */
 exports.server = async function(paths, config, app) {
    app.use(koaStatic(paths.static))
 }