module.exports = {
    id: '#statistic-carousel',
    options: function (n) {
        return {
            auto: false,
            autoControls: false,
            controls: true,
            pager: false,
            infiniteLoop: false,
            responsive: true,
            slideWidth: 300,
            slideMargin: 60,
            adaptiveHeight: true,
            hideControlOnEnd: true,
            minSlides: 1,
            moveSlides: 1,
            maxSlides: (n >= 3) ? 3 : 2,
            prevText: "<i class=\" fa fa-caret-left\"></i>",
            nextText: "<i class=\" fa fa-caret-right\"></i>"
        };
    }
};