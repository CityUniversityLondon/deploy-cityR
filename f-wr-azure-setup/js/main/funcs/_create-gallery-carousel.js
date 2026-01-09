/**
 * not used, galleryCarousel = $('.gallery-carousel')
 */
module.exports = function () {

    var $ = require('../jquery');

    return function (galleryCarousel) {


        var mainList = galleryCarousel.find('.gallery-carousel-images');

        mainList.addClass('owl-carousel').append(galleryCarousel.find('script').html());

        var pager = $('<div></div>').addClass('owl-carousel gallery-carousel-thumbs').appendTo(galleryCarousel),
            mainImages = mainList.children(),
            imageCount = mainImages.size(),
            init = function () {
                var mainSlider = mainList.owlCarousel({
                        items: 1,
                        autoHeight: true
                    }),
                    pagerSlider = pager.owlCarousel({
                        margin: 0,
                        items: 10,
                        loop: true,
                        autoWidth: true
                    });

                pager.find('a').click(function () {
                    var newIndex = $(this).parent().attr("data-index");
                    mainSlider.trigger('to.owl.carousel', [newIndex]);
                    return false;
                });
            },
            i = 0;


        mainImages.each(function (index) {
            var mainImage = $(this),
                height = 100,
                w = 0,
                h = 0,
                thumb = $('<div></div>').attr('data-index', index).appendTo(pager),
                a = $('<a></a>').attr('href', '#').css({'display': 'block'}).appendTo(thumb),
                img = $('<img>').css({
                    'margin': 'none',
                    'display': 'block',
                    'width': '100%'
                }).attr('src', mainImage.children('img').attr('src')).appendTo(a).load(function () {
                    i++;
                    w = this.width;
                    h = this.height;
                    thumb.css('width', (w * height / h) + 'px');

                    if (i == imageCount) {
                        init();
                    }
                });
        });

    }
}();