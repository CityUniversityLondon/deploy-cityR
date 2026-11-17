module.exports = function () {
    'use strict';

    /**
     * constructor for FeaturedVideo obj
     * @param {String} el - a jQuery selector for the FeaturedVideo container
     * @return {Object} Returns a newa FeaturedVideo obj
     * @constructor
     */
    var $ = require('../libs/jquery'),
        Mustache = require('mustache'),

    /* jshint -W015 */
        template = [
            '<div class="col-md-14">',
            '<div id="yt-video-player" class="yt-video-player">',
            '<div class="embed-wrapper"><div class="embed-container">',
            '<iframe src="//www.youtube.com/embed/{{data.id}}?rel=0" frameborder="0" allowfullscreen></iframe>',
            '</div></div>',
            '</div>',
            '</div>',
            '<div class="col-md-10">',
            '<div class="video-meta">',
            '<h2 class="video-title">{{data.title}}</h2>',
            '<p class="video-description">{{data.description}}</p>',
            '{{#data.views}}<p class="video-views">Views : {{count}}</p>{{/data.views}}',
            '<p class="social-flat-links">',
            '<span class="facebook social-btn"><a href="https://www.facebook.com/dialog/feed?app_id=141996839165515&amp;redirect_uri={{href}}&amp;link={{data.player}}"><i class="fa fa-facebook"></i>Facebook</a></span>',
            '<span class="twitter social-btn"><a href="https://twitter.com/intent/tweet?url={{data.player}}&amp;title={{data.title}}"><i class="fa fa-twitter"></i>Twitter</a></span>',
            '<span class="google social-btn"><a href="https://plus.google.com/share?url={{data.player}}"><i class="fa fa-google-plus"></i>Google +</a></span>',
            '</p>',
            '</div>',
            '<div>'
        ].join("\n"),
    /* jshint +W015 */

        FeaturedVideo = function (el) {
            if (!(this instanceof FeaturedVideo)) {
                return new FeaturedVideo(el);
            }
            this.el = el;
            this.$el = $(el);
            this.player = $("#yt-video-player");
            this.tmpl = template;

            return this;
        };

    /**
     * @method
     * @param {Object} videoDate - updates the featured video
     */
    FeaturedVideo.prototype.update = function (videoData) {
        var newFeatured = Mustache.render(this.tmpl, {data: videoData, href: window.location.href});

        this.$el.addClass("loading").empty().append(newFeatured).removeClass("loading");
    };

    return FeaturedVideo;

}();