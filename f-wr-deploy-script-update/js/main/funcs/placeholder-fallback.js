// fallback for browsers that don't understand placeholder attribute

module.exports = function () {

    var $ = require('../jquery'),
        Modernizr = window.Modernizr;


    return function () {
        if (Modernizr && !Modernizr.input.placeholder) {
            var inputs = $("[placeholder]");

            inputs.focus(function () {
                var input = $(this);
                if (input.val() === input.attr("placeholder")) {
                    input.val("");
                    input.removeClass("placeholder");
                }
            }).blur(function () {
                var input = $(this);
                if (input.val() === "" || input.val() === input.attr("placeholder")) {
                    input.addClass("placeholder");
                    input.val(input.attr("placeholder"));
                }
            }).blur();

            inputs.parents("form").submit(function () {
                $(this).find("[placeholder]").each(function () {
                    var input = $(this);
                    if (input.val() === input.attr("placeholder")) {
                        input.val("");
                    }
                });
            });
        }
    };

}();