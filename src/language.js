/**
 * language
 */
const fs = require('fs')
const path = require('path')
const utilfs = require('./util/fs')

const languageDataCache = {}

function loadLanguage(langdir, type) {
    if( languageDataCache[type] ) {
        return languageDataCache[type] 
    }
    var langs = {}
    loadLanguageItem(langs, langdir + '/' + type)
    // console.log(langs)
    languageDataCache[type] = langs
    return langs
}

function loadLanguageItem(langs, dir) {
    const flist = utilfs.scanSync(dir)
    for(let i in flist.files){
        let one = flist.files[i]
        , key = path.basename(one).replace('.js', '')
        , lobj = require(one)
        // console.log('files', i, key, one, lobj)
        langs[key] = lobj
    }
    return flist.folders
}


/**
 * load language
 */
exports.load = async function(paths, cnf, app) {
    let langdir = paths.language
    if( ! fs.statSync(langdir, {throwIfNoEntry: false})) {
        console.log(`[Note] cannot find language dir '${langdir}'.`)
        return
    }
    // start
    let types =  utilfs.scanSync(langdir).folders
    , realuselang = null
    , firstlang = null
    , hasEnUS = null
    , langdirs = {}
    // load
    for(var i in types) {
        var ty = path.basename(types[i])
        if('en_US' == ty) {
            hasEnUS = 'en_US'
        }
        if(firstlang == null){
            firstlang = ty
        }
        if(cnf.lang == ty) {
            realuselang = ty
        }
        langdirs[ty] = types[i]
    }
    // use 
    realuselang = realuselang || hasEnUS || firstlang
    // select
    app.use(async (ctx, next) => {

        let q = ctx.request.query
        , cklang = ctx.cookies.get("lang")
        , requselang = realuselang+""
        if( q.lang ) {
            if(langdirs[q.lang]) {
                ctx.cookies.set("lang", q.lang, {path:"/", maxAge:1000*60*60*24,/**365, httpOnly: true*/})
                requselang = q.lang // change use
            }else{
                if(cnf.debug){
                    console.log(`cannot find language <${q.lang}> from url query lang`)
                }   
            }
        }else if(cklang) {
            if(langdirs[cklang]) {
                requselang = cklang // read use from cookie
            }else{
                ctx.cookies.set('lang','',{signed:false,maxAge:0}) // delete
                if(cnf.debug){
                    console.log(`cannot find language <${cklang}> from url query lang`)
                }   
            }
        }
        // require lang
        // console.log(requselang)
        let langdata = loadLanguage(langdir, requselang)
        // data
        ctx.lang = {
            use: requselang,
            data: langdata,
        } 
        // console.log(ctx.lang)
        // ok next
        await next();
      });
}