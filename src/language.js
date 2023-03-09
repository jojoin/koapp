/**
 * language
 */
const fs = require('fs')
const path = require('path')
const utilfs = require('./util/fs')

var languageDataCache = {}

function loadLanguage(langdir, type) {
    let cache_key = type+'_'
    // console.log(languageDataCache)
    // console.log('[[[[[[[[[[[[[[[[')
    // for(let i in languageDataCache) {
    //     console.log(i, languageDataCache[i].index.lang_show)
    // }
    // console.log(']]]]]]]]]]]]]]]]')
    let cache = languageDataCache[cache_key]
    if( cache ) {
        // console.log('return languageDataCache', type, cache_key, cache.index.lang_show)
        return  cache
    }
    
    let langs = {}
    loadLanguageItem(langs, langdir + '/' + type)
    // console.log('loadLanguage', langdir + '/' + type, type, cache_key, langs.index.lang_show)
    languageDataCache[cache_key] = langs
    // console.log('------------------')
    // for(let i in languageDataCache) {
    //     console.log(i, languageDataCache[i].index.lang_show)
    // }
    // console.log('------------------')
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
    for(let i in types) {
        let ty = path.basename(types[i])
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
        ctx.loadLang = function(lang_name) {
            // require lang
            // console.log('reloadLanguage', lang_name)
            let langdata = loadLanguage(langdir, lang_name)
            // data
            return {
                use: lang_name,
                data: langdata,
            }
        }
        // console.log(' ctx.loadLang(requselang)', requselang)
        ctx.lang = ctx.loadLang(requselang)
        // console.log(ctx.lang)
        // ok next
        await next();
      });
}