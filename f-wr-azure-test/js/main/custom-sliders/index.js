module.exports = function () {

    var $ = require('../jquery'),

        sliders = [
            require('./profiles-carousel'),
            require('./stat-carousel')
        ],

        create = function (data) {
            var $carouselWrapper = $(data.id),
                $carousel = $carouselWrapper.find(".bxslider"),
                slideCount = $carousel.children().length;

            $carouselWrapper.removeClass("carousel-loading");
            if (slideCount > 1) {
                $carousel.bxSlider(data.options(slideCount));
            }
        },

        init = function () {
            for (var i = 0; i < sliders.length; i++) {
                create(sliders[i]);
            }
        };

    return init;
}();