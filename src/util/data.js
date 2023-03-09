/**
 * 对象列表转成table
 */
 exports.listToTable = function(list) {
    let table = {keys:[], rows:[]}
    if(list.length == 0){
        return table
    }
    let keys = {}
    for(let k in list[0]){
        table.keys.push(k)
        keys[k] = true
    }
    for(let i in list){
        let one = list[i]
        let row = []
        for(let k in keys){
            row.push(one[k])
        }
        table.rows.push(row)
    }
    return table
}

/**
 * table转成对象列表
 */
 exports.tableToList = function(table) {
     if(!table || !table.keys || table.keys.length == 0){
         return [] // 空表
     }
    let list = []
    for(let r in table.rows){
        let row = table.rows[r]
        let obj = {}
        for(let i in table.keys){
            let k = table.keys[i]
            obj[k] = row[i]
        }
        list.push(obj)
    }
    return list
}

