module.exports = function () {
    'use strict';

    var initWhiteCards = function () {
        if ($(window).width() < 600) {
            $('.white-card').each(function () {
                var box = $(this),
                    content = box.find('.white-card__content');

                if (content.height() > 200) {
                    content.addClass('white-card__content--read-more');
                    var button = $('<div class="white-card__read-more">' +
                        '<div class="white-card__read-more__bg"></div>' +
                        '<a  href="#"><span>read more</span></a>' +
                        '</div>')
                        .click(function (e) {
                            content.removeClass('white-card__content--read-more');
                            button.remove();
                            e.preventDefault();
                        }).appendTo(box);
                }
            });
        }

        $('.white-card .embed-container').videoPreview({allowFullscreen: true});
    };

    return initWhiteCards;
}();