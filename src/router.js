/*
* route
*/
const fs = require('fs')
const extend = require('extend')

const viewer = require('./viewer')
const utilfs = require('./util/fs')

const Router = require('koa-router') // koa-router
const router = new Router();

exports.load = async function(paths, cnf, app) {
    let appdir = paths.app
    , routesfile = appdir + "/routes.js"
    , controllerdir = appdir + "/controller"
    , routes = {
        // '/': 'index',
    }
    // config
    try {
        let robj = require(routesfile)
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
    function doOneRoute(name, ctrlpath, isPost, isView) {
        // console.log(name, ctrlpath, isPost, isView)
        let ctrl
        if(isView){
            ctrl = async function(ctx, next){
                await viewer.render(ctrlpath, paths, cnf, ctx, next) // render page
            }
        }else{
            let ctrlfunc = require(controllerdir + '/'+ctrlpath + '.js')
            ctrl = async function(ctx, next){
                await ctrlfunc(cnf, ctx, next)
            }
        }
        if (isPost){
            router.post(name, ctrl)
        }else{
            router.get(name, ctrl)
        }
    }
    
    for(let i in routes){
        let isPost = false
        let isView = false
        let ctrlpath = routes[i]
        if(i.startsWith('POST:')){
            i = i.slice(5) // POST:
            isPost = true
        }
        if(ctrlpath.startsWith('VIEW:')){
            ctrlpath = ctrlpath.slice(5) // VIEW:
            isView = true
        }
        if(false==i.startsWith('/')) {
            console.error("------------\n[Routes] Error: route key must start with '/' symbol: [" + i+ "]\n------------\n")
            throw true
        }
        doOneRoute(i, ctrlpath, isPost, isView)
    }

    // use routes
    app.use(router.routes());

    // app.use(router.allowedMethods());

}
