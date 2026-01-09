/**
 * creates and adds a function as the default error handler for jQuery ajax operations
 */
module.exports = function () {

    var $ = require('./jquery'),
        webService = "//webapps.city.ac.uk/matrix/services/jQueryError.php",

        notify = function (event, jqXHR, ajaxSettings, errorThrown) {

            //insert an "image" which has a web service as the src,
            //the web service sends email to ucs-webteam
            $("<img />", {
                src: webService + "?u=" + escape(document.location.href) + "&s=" +
                escape(ajaxSettings.url) + "&t=" + ajaxSettings.type + "&e=" + escape(errorThrown),
                style: "display: none"
            }).appendTo("#footer");

        };

    //register this as a global ajax event handler
    $(function () {
        $(document).ajaxError(notify);
    });
};
