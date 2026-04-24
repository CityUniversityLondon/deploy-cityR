module.exports = function () {
    'use strict';

    var $ = require('../jquery');

    return function () {
        $('.image-carousel').each(function () {
            var carousel = $(this);
            var slides = carousel.children();
            slides.each(function (i) {
                $(this).attr('data-index', i);
            }).wrapAll('<div></div>');

            var updateActive = function (slideElement, oldIndex, newIndex) {
                carousel.find('.image-carouse__item--active').removeClass('image-carouse__item--active');
                carousel.find('.image-carouse__item[data-index="' + newIndex + '"]').addClass('image-carouse__item--active')
            };

            var slider = null;

            var options = {
                controls: true,
                touchEnabled: true,
                preventDefaultSwipeX: true,
                preventDefaultSwipeY: false,
                nextText: '<span><span class="sr-only">Go to next slide</span><span class="fa fa-chevron-right" aria-hidden="true"></span></span>',
                prevText: '<span><span class="sr-only">Go to previous slide</span><span class="fa fa-chevron-left" aria-hidden="true"></span></span>',
                pager: false,
                moveSlides: 1,
                slideWidth: 0,
                firstSlideMargin: 0,
                onSlideBefore: updateActive,
                onSlideAfter: updateActive,
                onSliderLoad: function (currentIndex) {
                    carousel.find('.bx-controls a').attr('role', 'button');

                    if (parseInt(carousel.find('.image-carouse__item').css('width')) !== options.slideWidth) {
                        setTimeout(update, 0);
                    } else {
                        carousel.find('.image-carouse__item[data-index="' + currentIndex + '"]').addClass('image-carouse__item--active');
                        carousel.find('.image-carouse__item').css({
                            'margin-left': options.firstSlideMargin + 'px',
                            'margin-right': (-options.firstSlideMargin) + 'px'
                        });
                    }
                }
            };

            var update = function () {
                var width = carousel.width();
                if (Modernizr.mq('(min-width: 600px)')) {
                    options.maxSlides = 2;
                    options.slideWidth = Math.round(.5 * (20 + width));
                    options.firstSlideMargin = .25 * width - 5;
                } else {
                    options.maxSlides = 1;
                    options.slideWidth = width;
                    options.firstSlideMargin = 0;
                }


                if (slider === null) {
                    slider = carousel.children().bxSlider(options);
                } else {
                    slider.reloadSlider(options);
                }
            };

            $(window).resize(update);
        });
    };
}();
