/**
 * Sends a message to the browser console (Gecko, Webkit) or into the <body> (IE)
 * @param {String} message: the message to print out
 */

module.exports = function (message) {

    var debug = function (message) {
            if (debug.debugLevel > 0 || location.search.match("debug")) {
                try {
                    //for Safari, Chrome, Firefox(w/ firebug)
                    w.console.log(message);
                } catch (e) {
                    try {
                        //for Opera
                        opera.postError.apply(opera, message);
                    } catch (e1) {
                    }
                }
            }
        };

    debug.debugLevel = 0;

    return debug;
};
