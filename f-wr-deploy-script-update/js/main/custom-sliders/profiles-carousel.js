module.exports = {
    id: '#profiles-carousel',
    options: function () {
        return {
            auto: false,
            autoControls: false,
            controls: true,
            pager: true,
            infiniteLoop: false,
            responsive: true,
            slideWidth: 330,
            slideMargin: 0,
            adaptiveHeight: false,
            hideControlOnEnd: true,
            maxSlides: 1,
            prevText: "<i class=\"fa fa-angle-left\"></i>",
            nextText: "<i class=\"fa fa-angle-right\"></i>"
        };
    }
};