module.exports = function () {

    var $ = require('../main/jquery');

    $(function () {
        if (typeof CITY_OPTIONS !== 'undefined' && CITY_OPTIONS.defer) {
            for (var i = 0; i < CITY_OPTIONS.defer.length; i++) {
                CITY_OPTIONS.defer[i]();
            }
        }
    });
};
