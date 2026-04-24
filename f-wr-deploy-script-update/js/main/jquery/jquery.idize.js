/*
 * jQuery plugin to wrap elements
 *
 * http://jsbin.com/idize
 *
 */

module.exports = function ($) {

    $.fn.wrapChildren = function (options) {

        options = $.extend({
            childElem: undefined,
            sets: 1,
            wrapper: 'div'
        }, options || {});

        if (options.childElem === undefined) {
            return this;
        } else {
            return this.each(function () {
                var elems = $(this).children(options.childElem);
                var arr = [];

                elems.each(function (i, value) {
                    arr.push(value);
                    if (((i + 1) % options.sets === 0) || (i === elems.length - 1)) {
                        var set = $(arr);
                        arr = [];
                        set.wrapAll(document.createElement(options.wrapper));
                    }
                });
            });
        }
    }

};
