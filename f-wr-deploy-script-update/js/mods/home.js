var $ = require('./libs/jquery'),
    defer = require('./utils/defer'),

    screenWidth = -1,
    inMd = true,
    slider = null,
    $w = $(window),

    updateNewsSlider = function () {
        var $homeNews = $('.home-news'),
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
                        prevText: '<span class="bg fa fa-circle" aria-hidden="true"></span><span class="ic fa fa-chevron-left" aria-label="previous slide"></span>',
                        nextText: '<span class="bg fa fa-circle" aria-hidden="true"></span><span class="ic fa fa-chevron-right" aria-label="next slide"></span>'
                    });
                }
            }
        }
    },
    init = function () {
        $('.home-course-finder .dropdown-select').cityDropdown();
        $('.home-news-events .submenu .dropdown-select').cityDropdown({isMenu: true});
        $('.home-media-ribbon .embed-container').videoPreview({controls: 1, showInfo: 0});

        $w.resize(updateNewsSlider);
        updateNewsSlider();
    }; // end variables


defer(init);
