/**
 * Init see more widget
 */
module.exports = function () {
    'use strict';

    var $ = require('../jquery');

    return function() {
        var widgets = $(".see-more");

        widgets.each(function () {
            var widget = $(this);
            var toggle = widget.find('.see-more__toggle');
            var toggleLabel = toggle.find('.see-more__toggle__label');
            if (toggleLabel.length === 0) {
                toggleLabel = toggle;
            }

            var content = widget.find('.see-more__content');
            var showText = toggle.html();
            var hideText = toggle.attr('data-hide-text') || 'Hide';
            toggle.click(function (e) {
                e.preventDefault();
                if (widget.hasClass('see-more--active')) {
                    toggleLabel.html(showText);
                    widget.removeClass('see-more--active');
                    content.slideUp();
                } else {
                    widget.addClass('see-more--active');
                    toggleLabel.html(hideText);
                    content.slideDown();
                }
            });
        });
    };

}();
