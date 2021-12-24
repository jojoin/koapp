/**
 * viewer
 */
 const fs = require('fs')
 const path = require('path')

 const less = require('less')
 const csso = require('csso')
 const minify = require('html-minifier');
 const UglifyJS = require("uglify-js");


 const extend = require('extend')

 const utilfs = require('./util/fs')
 const utiltppl = require('./util/tppl')
 const utiltype = require('./util/type')

 // data
const allViews = {}



async function readComponentFiles(componentdir, names, ext){
    let files = names.map(function(x){
        var filename = x.indexOf('/')>0 ? 'index' : x
        return `${componentdir}/${x}/${filename}.${ext}`
    })
    // console.log(files)
    return utilfs.readsSync(files, {ignore: true, merge: true})
}


async function compileJsCssTpl(cnf, staticdir, componentdir, vname, view){
    let jscon = await readComponentFiles(componentdir, view.components, 'js')
    if(false == cnf.debug) {
        jscon = UglifyJS.minify(jscon).code
    }
    fs.writeFileSync(`${staticdir}/jscss/${vname}.js`, jscon)
    let lesscon = await readComponentFiles(componentdir, view.components, 'less')
    let csscon = await less.render(lesscon, {rewriteUrls: 'off'})
    if(false == cnf.debug) {
        csscon = csso.minify(csscon).css
    }
    // console.log(csscon)
    fs.writeFileSync(`${staticdir}/jscss/${vname}.css`, csscon.css)
    let htmlcon = await readComponentFiles(componentdir, view.components, 'html')
    // console.log(htmlcon)
    if(false == cnf.debug) {
        htmlcon = minify(htmlcon)
    }
    return htmlcon
}

async function compileOneView(paths, cnf, key, filename){
    let view = require(filename)
    if( ! utiltype.isArray(view.components) ){
        console.log(`[Error] cannot find components setting in viewer '${key}'.`)
        return
    }
    if( ! utiltype.isFunction(view.datas) ){
        console.log(`[Error] cannot find datas setting in viewer '${key}'.`)
        return
    }
    // compile
    fs.mkdirSync(paths.static+'/jscss', {recursive: true})
    var viewcon =  await compileJsCssTpl(cnf, paths.static, paths.app+'/component', key, view)
    // console.log(viewcon)
    // load
    return {
        "datas": view.datas,
        "tmplfunc": utiltppl(viewcon),
    }
}

/**
 * load all page 
 */
 exports.load = async function(paths, cnf, app) {
    var viewerdir = paths.app + '/viewer'
    if( ! fs.statSync(viewerdir, {throwIfNoEntry: false})) {
        console.log(`[Note] cannot find viewer dir '${viewerdir}'.`)
        return
    }
    // scan
    var files = utilfs.scanSync(viewerdir).files
    for(var i in files){
        let one = files[i]
        let key = path.basename(one).replace('.js', '')
        allViews[key] = await compileOneView(paths, cnf, key, one)
    }
 }

/**
 * render one page
 */
 exports.render = async function(name, paths, cnf, ctx, next) {
     var view = allViews[name]
    if( ! view){
        throw `[Error] cannot find viewer <${name}> in 'app/viewer/*' path settings.`
    }
    // if debug 
    if(cnf.debug) {
        // refresh
        let fname = `${paths.app}/viewer/${name}.js`
        view = await compileOneView(paths, cnf, name, fname)
    }
    // data
    let lang = ctx.lang.data
    lang.useset = ctx.lang.use
    var pagadata = {
        title: "koappx page",
        page_name: name,
        lang: lang, // lang use & data
    }
    var data = await view.datas(cnf, ctx)
    extend(true, pagadata, data)
    // tmpl
    let body = ""
    try {
        body = view.tmplfunc(pagadata)
        // console.log(pagadata, body, view.tmplfunc)
    } catch (e) {
        body = e.String()
    }
    ctx.body = body
    //ok
    await next()
 }




