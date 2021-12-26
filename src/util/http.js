const http = require("http")
const https = require("https")
const querystring = require("querystring")


exports.json = function(url, querys) {
    let qsstr = ""
    if( querys ) {
        qsstr = "?" + querystring.stringify(querys)
    }
    let http_obj = url.startsWith('https://') ? https : http
    return new Promise( (ok, err) => {
        // console.log(url + qsstr)
        http_obj.get(url + qsstr, (res) => {
            var str = ''
            res.on('data', (part) => {
                var sstr = part.toString()
                str += sstr
                // console.log(sstr)
            })
            res.on('end', () =>  {
                try{
                    // console.log(str)
                    var data = JSON.parse(str)
                    // console.log(data)
                    ok(data)
                }catch(e){
                    // console.log(e)
                    // console.log(str.substr(0, 260))
                    err("res str is not json: "+str)
                }
            })
        })
    })
}