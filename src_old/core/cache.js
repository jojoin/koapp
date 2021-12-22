/**
 * 缓存类  支持 cluster
 */


const cluster = require('cluster')


const util_string = require('../util/string.js')



const expire_key = '__sdf3k4j5h65h__'
const msg_origin = 'expre_cache_cluster'



/**
 * 内核: 配置
 */

module.exports = app => {








class Cache{


    constructor(config={}){
        this._data = {}
        this._config = Object.assign({
            flesh_timeout: 37 * 1000
        }, config)

        this.__init()
    }


    //////////////////////////////

    __init(){
        this.__fleshAllData()
    }


    __fleshAllData(){
        for(let k in this._data){
            let res = this._data[k]
            this.__checkoutLiveValue(k, res)
        }
        // console.log(this._config);
        // set time out
        let self = this;
        setTimeout(function(){
            self.__fleshAllData()
        }, self._config.flesh_timeout)
    }


    __checkoutLiveValue(k, v){
        if( v[expire_key] ){
            if( v[expire_key]  <  new Date().getTime()  ){
                this.del(k) // delete expire value
            }else{
                return v['val']
            }
        }else{
            return v
        }
    }



    //////////////////////////////


    set(key, val, ttl){
        if(ttl>0){ // expire time
            val = {
                'val': val
            }
            val[expire_key] = new Date().getTime() + ttl*1000
        }
        this._data[key] = val
    }


    get(key){
        let self = this
        return new Promise( async function(resolve, reject){
            let res = self._data[key]
            if( res ){
                resolve( self.__checkoutLiveValue(key, res) )
            }else{
                resolve( )
            }
        });

    }


    del(key){
        delete this._data[key]
    }


    clear(){
        this._data = {}
    }

}






////////////////////////////////////////////////////




class CacheWorker{


    get(key){
        return new Promise( async function(resolve, reject){

            let is_ret
            let msgId = new Date().getTime() + util_string.randStr(8)

            this.__message('get',{
                'key': key
            }) 

            process.on('message', function(msg) {
                if (msg.origin && msg.origin === msg_origin) {
                    if (msg.id = msgId) {
                        resolve( msg.value )
                        is_ret = true
                    }
                }
            });

            /*/ time out
            setTimeout(function(){
                if( ! is_ret ){
                    resolve()
                }
            }, 1000)*/
        });
    }


    set(key, val, ttl){
        this.__message('set',{
            'key': key,
            'val': val,
            'ttl': ttl,
        }) 
    }


    del(key){
        this.__message('del',{
            'key': key,
        }) 
    }


    clear(){
        this.__message('clear',{

        }) 
    }


    /////////////



    __message(action, args ){

        var msg = Object.assign({
            origin: msg_origin,
            action: action,
            /*key: args.key,
            id: args.id,
            ttl: args.ttl,
            value: args.value*/
        }, args);

        return process.send(msg);
    }




}




////////////////////////////////////////////////////





function masterProxy(cacheClient){

    if (cluster.isMaster) {

        cluster.on('fork', function(worker) {

          worker.on('message', async function(msg) {

            if (msg.origin && msg.origin === msg_origin) {
              switch(msg.action)
              {
                case 'get':
                  msg.value = await cacheClient.get(msg.key)
                  worker.send(msg)
                  break
                case 'set':
                  cacheClient.set(msg.key, msg.value, msg.ttl)
                  // worker.send(msg)
                  break
                case 'del':
                  cacheClient.del(msg.key)
                  // worker.send(msg)
                  break
                case 'clear':
                  cacheClient.clear()
                  // worker.send(msg)
                  break
              }
            }
          });
        });
      }
    

}








///////////////////////////////////////////////////



if (cluster.isMaster) {


    const cacheClient = new Cache()

    masterProxy(cacheClient) // 通信代理

    app.cache = cacheClient


}else{


    app.cache = new CacheWorker()


}








}


