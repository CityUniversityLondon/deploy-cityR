var $ = require('../libs/jquery'),
    defer = require('../utils/defer'),

    debug = require('../../utils/debug'),

    FeaturedVideo = require('./featured-video'),
    VideoList = require('./video-list'),


    onLoad = function (isV3, data) {
        var fv = new FeaturedVideo("#yt-featured-video"),
            vl = new VideoList("#yt-videos-list", fv),

            items = data.items;


        vl.buildList(isV3, items);
    },

    init = function () {
        var ytModule = $(".yt-module, #yt-module"),
            ytUrl = ytModule.data("yt-playlist");

        if (!ytUrl) {
            debug("Needs a YouTube playlist");
        } else {
            var isV3 = ytUrl.indexOf('/youtube/v3/') >= 0;

            $.ajax({
                url: ytUrl,
                dataType: "jsonp",
                success: onLoad.bind(null, isV3),

                complete: function () {
                    $("#yt-featured-video").removeClass("component-loading").children('.loading-fa-icon').remove();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    debug(jqXHR, textStatus, errorThrown);
                }
            });
        }
    };


defer(init);

