/**
 * Initialise Dropdowns
 */
module.exports = function () {
    "use strict";

    var $ = require("../jquery");
    var contentWrapper = $(".city-health__container");
    var loading        = $(".city-health__loading");
    var form           = $(".city-health__form");
    var inputs         = form.find("input");

    var fixPagination = function() {
        $(".city-health__pagination--all a").click( function(e) {
            e.preventDefault();
            var page = $(this).attr("href").split("result_314729_result_page=")[1];
            reload({
                "result_314729_result_page": page
            })
        });
        $(".city-health__pagination--filtered a").click( function(e) {
            e.preventDefault();
            var page = $(this).attr("href").split("current_result_page=")[1].split("&")[0];
            reload({
                "current_result_page": page
            })
        });
    }

    var reload = function(fixedParams) {
        var params = $.extend({t: new Date().getTime()}, fixedParams);

        inputs.each(function () {
            var input = $(this);
            var name = input.attr("name");
            var value = input.val();

            if (name && name.length > 0 && value && value.length > 0) {
                params[name] = value;
            }
        });

        contentWrapper.css("display", "none");
        loading.css("display", "inline-block");

        $.get("//www.city.ac.uk/api/city-health-courses/_nocache", params, function(data) { })
            .done( function(data) {
                contentWrapper.html(data);
            })
            .always( function(data) {
                contentWrapper.css("display", "block");
                loading.css("display", "none");
                fixPagination();
            });
    };

    return function() {
        $(".city-health__form .dropdown-select").cityDropdown({
            "onselect": function() {
                reload();
            }
        });
        fixPagination();
    };

}();
