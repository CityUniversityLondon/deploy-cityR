module.exports = function () {
    var $ = require('../jquery'),

        screenWidth = -1,
        inMd = true,
        slider = null,
        $w = $(window),

        updateNewsSlider = function () {
            var $homeNews = $('.news-events-strip__news'),
                width = Math.round($w.width());

            if (width !== screenWidth) {
                screenWidth = width;

                var newInMd = screenWidth >= 850;
                if (newInMd !== inMd) {
                    inMd = newInMd;

                    if (inMd) {
                        slider.destroySlider();
                        setTimeout(function () {
                            $homeNews.addClass('row').attr('style', '').children().addClass('col-xs-24 col-md-8').css('width', '');
                        }, 0);
                        slider = null;
                    } else {
                        slider = $homeNews.removeClass('row').children().removeClass('col-xs-24 col-md-8').end().bxSlider({
                            autoHover: true,
                            touchEnabled: true,
                            preventDefaultSwipeX: true,
                            preventDefaultSwipeY: false,
                            adaptiveHeight: true,
                            pager: false,
                            autoControls: false,
                            controls: true,
                            prevText: '<i class="bg fa fa-circle"></i><i class="ic fa fa-chevron-left"></i>',
                            nextText: '<i class="bg fa fa-circle"></i><i class="ic fa fa-chevron-right"></i>'
                        });
                    }
                }
            }
        };

    return function () {
        $w.resize(updateNewsSlider);
        updateNewsSlider();
    };
}();
