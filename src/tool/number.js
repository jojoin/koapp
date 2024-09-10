
exports.numToThousands = function (num) {
    return num.toString().replace(/\d+/, function(n) {
       return n.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    });
 };
 