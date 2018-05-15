function toDou(n) {
    return n < 10 ? '0' + n : n;
}
module.exports = {
    timeDate: function(t) {
        var oDate = new Date();
        oDate.setTime(t * 1000);
        return oDate.getFullYear() + '-' + toDou((oDate.getMonth() + 1)) + '-' + toDou(oDate.getDate()) + ' ' + toDou(oDate.getHours()) + ':' + toDou(oDate.getMinutes()) + ':' + toDou(oDate.getSeconds());
    }
}