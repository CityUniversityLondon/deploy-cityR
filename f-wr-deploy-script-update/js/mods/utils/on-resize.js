module.exports = function () {

    var $ = require('../libs/jquery');

    return function (f, runNow) {
        $(window).resize(f);
        if (runNow) {
            f();
        }
    };

}();