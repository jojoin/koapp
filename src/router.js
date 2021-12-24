/**
 * route
 */
 const fs = require('fs')
 const extend = require('extend')

 const viewer = require('./viewer')
 const utilfs = require('./util/fs')

 const Router = require('koa-router') // koa-router
 const router = new Router();

 exports.load = async function(paths, cnf, app) {
    var appdir = paths.app
    , routesfile = appdir + "/routes.js"
    , controllerdir = appdir + "/controller"
    , routes = {
        // '/': 'index',
    }
    // config
    try {
        var robj = require(routesfile)
        extend(routes,robj )
    } catch (e) {
        console.log(`[Note] cannot find routes file '${routesfile}'`)
    }
    // console.log(routes)
    // load
    if( ! fs.statSync(controllerdir, {throwIfNoEntry: false})) {
        console.log(`[Note] cannot find controller dir '${controllerdir}'.`)
        return
    }
    // routes
    for(let i in routes){
        var isPost = false
        var isView = false
        var ctrlpath = routes[i]
        if(i.startsWith('POST:')){
            i = i.slice(5) // POST:
            isPost = true
        }
        if(ctrlpath.startsWith('VIEW:')){
            ctrlpath = ctrlpath.slice(5) // VIEW:
            isView = true
        }
        var ctrl
        if(isView){
            ctrl = async function(ctx, next){
                await viewer.render(ctrlpath, paths, cnf, ctx, next) // render page
            }
        }else{
            ctrl = require(controllerdir + '/'+ctrlpath + '.js')
        }
        if (isPost){
            router.post(i, ctrl)
        }else{
            router.get(i, ctrl)
        }
    }
    // use routes
    app.use(router.routes());
    // app.use(router.allowedMethods());
 }
