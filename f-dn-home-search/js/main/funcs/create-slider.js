/*
 * sets up a carousel on a page
 * @param carouselObj : Object
 *
 */
module.exports = function () {
    'use strict';

    var $ = require('../jquery'),
        debug = require('../../utils/debug');

    return function ($carouselObj) {
        if ($carouselObj.length !== 0) {
            $carouselObj.append($('#main-carousel-slides').html());

            var numSlides = $carouselObj.children().length,
                $promoWrapper = $carouselObj.parents("#promo-wrapper"),
                overrideControls = numSlides > 1 ? {} : {
                    auto: false,
                    autoControls: false,
                    touchEnabled: false,
                    controls: false,
                    pager: false
                },
                // options for the home carousel
                sliderOptions = ($promoWrapper.attr("data-carousel-type") !== "home") ? {} : {
                    autoHover: true,
                    touchEnabled: true,
                    preventDefaultSwipeX: true,
                    preventDefaultSwipeY: false,
                    buildPager: function (index) {
                        return '<span class="fa fa-circle" aria-hidden="true"></span><span class="sr-only">Go to slide ' + (index + 1) + '</span>';
                    },
                    startText: '<span class="bg fa fa-circle" aria-hidden="true"></span><span class="ic fa fa-play"></span><span class="sr-only">Play slides</span>',
                    stopText: '<span class="bg fa fa-circle" aria-hidden="true"></span><span class="ic fa fa-pause"></span><span class="sr-only">Stop slides</span>',
                    prevText: '<span class="bg fa fa-circle" aria-hidden="true"></span><span class="ic fa fa-chevron-left"></span><span class="sr-only">Previous slide</span>',
                    nextText: '<span class="bg fa fa-circle" aria-hidden="true"></span><span class="ic fa fa-chevron-right"></span><span class="sr-only">Next slide</span>'
                },
                clearingOptions = ($promoWrapper.attr("data-carousel-type") !== "clearing") ? {} : {
                    auto: false,
                    controls: false,
                    pager: false,
                    autoControls: false,
                    autoStart: false
                },
                initSlider = function () {
                    var options = $.extend({
                        auto: true,
                        autoControls: true,
                        pause: 15000,
                        autoHover: true,
                        touchEnabled: false,
                        preventDefaultSwipeX: false,
                        preventDefaultSwipeY: false,
                        startText: "<span class=\"visuallyhidden\">Start slider</span><span class=\"fa fa-play\"></span>",
                        stopText: "<span class=\"visuallyhidden\">Pause slider</span><span class=\"fa fa-pause\"></span>",
                        nextText: "<span class=\"visuallyhidden\">Next slide</span><span class=\"fa fa-caret-right\"></span>",
                        prevText: "<span class=\"visuallyhidden\">Previous slide</span><span class=\"fa fa-caret-left\"></span>",
                        controls: true,
                        adaptiveHeight: true,
                        onSliderLoad: function (e) {
                            if (numSlides < 2) {
                                $promoWrapper.addClass("promo-wrapper--single");
                            }
                        }
                    }, sliderOptions, overrideControls, clearingOptions);

                    $promoWrapper.removeClass("carousel-loading");
                    $promoWrapper.find(".loading-fa-icon").remove();
                    $promoWrapper.find(".bxslider").show();
                    $carouselObj.bxSlider(options);
                    $promoWrapper.find(".bx-controls").show();
                };

            //set up slider
            if (numSlides > 0) {
                debug("more than 0 slides, need carousel. NumSlides =" + numSlides);
                initSlider($carouselObj);
            }
        }
    };
}();
