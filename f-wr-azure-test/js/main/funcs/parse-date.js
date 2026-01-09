/**
 * The non-search twitter APIs return inconsistently-formatted dates, which Date.parse
 * cannot handle in IE. We therefore perform the following transformation:
 * "Wed Apr 29 08:53:31 +0000 2009" => "Wed, Apr 29 2009 08:53:31 +0000"
 *  @param {String} date_str: a string representing a date
 */

module.exports = function (date_str) {
    return Date.parse(date_str.replace(/^([a-z]{3})( [a-z]{3} \d\d?)([0-9 :+]*)( \d{4})$/i, "$1,$2$4$3"));
};
