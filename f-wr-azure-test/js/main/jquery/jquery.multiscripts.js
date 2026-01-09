/**
 * from:
 * http://stackoverflow.com/questions/11803215/how-to-include-multiple-js-files-using-jquery-getscript-method
 * */
module.exports = function ($) {
    var jsPath = require('./js-path');

    $.getMultiJsScripts = function (list, cb, forceXdomain) {
        var path = jsPath(),
            i = 0,
            fetch = function() {
                if (i < list.length) {
                    $.ajax({
                        url: path + list[i++],
                        dataType: "script",
                        success: fetch,
                        cache: false,
                        crossDomain: forceXdomain || false
                    });
                } else {
                    cb();
                }
            };

        fetch();
    };

};
