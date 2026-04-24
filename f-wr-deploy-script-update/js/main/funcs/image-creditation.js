/**
 * Toggle Visibility of Image Credit Component
 */
module.exports = function () {
    'use strict';

    var $ = require('../jquery');

    return function() {
        var $credits = $(".image-credit"),
            $creditItems = $(".credits-items"),
            $scpCreditsTitle = $(".credits-title"),
            creditButtonClass = ".image-credit__button",

            toggleImageCredit = function(node) {
                var state = node.attr("aria-pressed") === "true" ? "false" : "true";
                node.attr("aria-pressed", state);
                node.parent().attr("aria-expanded", state);
            };

        $credits.each(function () {
            $(this).find(creditButtonClass).click(function(event) {
                event.preventDefault();
                toggleImageCredit($(this));
            });
        });

        $scpCreditsTitle.on("click", function () {
            $(this).toggleClass("credits-title--active")
                .next(".credits-items").toggleClass("sr-only");
        });
    };

}();
