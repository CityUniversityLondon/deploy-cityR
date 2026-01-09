/**
 * Create a image Gallery
 *
 * @param {Object} a jquery object representing a single instance of a gallery
 * @param {Boolean} true if the gallery is in a widget, false if in main content body
 * @return {Object || Undefined} returns the galleria jQuery object if
 * successful else undefined - for instance if $gallery is not a jQuery object
 *
 */
module.exports = (function() {
    var $ = require('../jquery'),
        debug = require('../../utils/debug'),
        state = 'not-loaded',
        queue = [],
        create = function(gallery, options) {
            var root = gallery.attr('id').replace('gallery-', ''),
                galleryInner = gallery.find('.gallery-inner');

            $.getJSON('/apis/galleries/galleria-json?root=' + root, function(
                data
            ) {
                //remove loader
                gallery.find('span.loading').hide();
                gallery.css('opacity', '1');
                options.data_source = data;
                galleryInner.galleria(options);
            });

            return galleryInner;
        },
        loadComplete = function() {
            //get id of root from id of gallery div
            state = 'loaded';
            for (var i = 0; i < queue.length; i++) {
                create(queue[i].gallery, queue[i].options);
            }
            queue = [];
        },
        request = function(gallery) {
            var galleryInner = gallery && gallery.find('.gallery-inner');

            if (!galleryInner || galleryInner.length === 0) {
                debug('no gallery found');
            } else {
                var galleriaOptions = {
                    height: 0.5625,
                    lightbox: galleryInner.hasClass('lightbox'),
                    maxScaleRatio: 1,
                    preload: 2,
                    showInfo: galleryInner.hasClass('caption'),
                    imageCrop: false,
                    debug: false,
                    extend: function(/* defined but not used: options */) {
                        if ('city' === gallery.attr('data-theme')) {
                            gallery.prepend(
                                $('<div/>', {
                                    class: 'cg-caption',
                                })
                            );

                            /*loadstart is triggered every time galleria loads an image*/
                            this.bind('loadstart', function(e) {
                                var data = this._data[e.index],
                                    //caption is refound here as it needs to be scoped to this gallery
                                    caption = gallery.find('.cg-caption');

                                if (data.m_caption) {
                                    caption.html(data.m_caption);
                                } else {
                                    caption.html('&nbsp;');
                                }
                            });
                        }
                    },
                };

                if (state === 'loaded') {
                    create(gallery, galleriaOptions);
                } else {
                    if (state === 'not-loaded') {
                        state = 'loading';
                        $.getMultiJsScripts(
                            [
                                'lib/jquery/plugins/galleria/galleria-1.4.2/galleria-1.4.2.min.js',
                                'lib/jquery/plugins/galleria/galleria-1.4.2/themes/classic/galleria.classic.city.min.js',
                            ],
                            loadComplete,
                            true
                        );
                    }

                    gallery.prepend(
                        $(
                            '<div class="loading"><div class="loading__icon"><i class="fa fa-refresh fa-spin"></i></div></span>'
                        )
                    );
                    queue.push({ gallery: gallery, options: galleriaOptions });
                }
            }
        };

    return request;
})();
