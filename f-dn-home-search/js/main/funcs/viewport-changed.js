/**
 * returns true if the viewport size has changed -
 * useful in responsive layout, see
 * snook.ca/archives/javascript/ie6_fires_onresize
 */
module.exports = function (w) {

    return function () {

        var debug = require('../../utils/debug'),
            changed = false,
            docEl = w.document.documentElement,
            coolOff = 20, //further calls within this window get
        //the same return value
            now = Date.now ? Date.now() : (function () {
                return new Date().valueOf();
            }());

        //set up a holder object (if it doesn't exist)
        w.viewport = w.viewport || {};

        //these need zeroing before we begin (if not already set)
        w.viewport.dimensions = w.viewport.dimensions || {height: null, width: null};

        //need to handle the situation where many calls to this
        //function happen in quick succession
        if (w.viewport.timeStamp && now - w.viewport.timeStamp < coolOff) {
            debug("within window, returning " + w.viewport.storedResult);
            return w.viewport.storedResult;
        }

        //store the time of this call
        w.viewport.timeStamp = now;

        //have we changed viewport size?
        if (w.viewport.dimensions.width !== docEl.clientWidth ||
            w.viewport.dimensions.height !== docEl.clientHeight) {
            changed = true;
        }

        //store new dimensions
        w.viewport.dimensions.height = docEl.clientHeight;
        w.viewport.dimensions.width = docEl.clientWidth;

        //store this result in case of a re-call within coolOff
        w.viewport.storedResult = changed;

        debug("viewport changed: " + changed);

        return changed;
    }
}(window);
