module.exports = {
    objectAssign: function () {
        var res = undefined;
        Array.prototype.slice.call(arguments).forEach(
            function (arg) {
                if (res === undefined) {
                    res = arg;
                }
                else {
                    for (var attrname in arg) { res[attrname] = arg[attrname]; }
                }
            }
        );
        return res;
    }
}
