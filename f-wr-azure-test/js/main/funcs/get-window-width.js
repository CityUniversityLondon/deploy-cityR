/**
 * gets window width
 * @param: {Object} - window object
 * @return: {Number} - window width
 */
module.exports = function () {
    var $ = require('../jquery');

    return function (w) {
        return Math.round($(w).width());
    };
}();