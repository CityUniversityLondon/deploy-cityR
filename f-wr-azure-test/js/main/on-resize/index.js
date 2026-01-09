module.exports = function () {

    var $ = require('../jquery'),

        viewportChanged = require('../funcs/viewport-changed'),
        getWindowWidth = require('../funcs/get-window-width'),

        bindMegaDdEvents = require('./bind-mega-events'),

        $window = $(window),
        $body = $("body"),

        $globalNav = $body.find("#global-nav1"),
        $navLis = $globalNav.children("li"),
        $megaLinks = $globalNav.find(".mega"),
        $drops = $globalNav.find(".drop"),


        $responsiveTogglers = $(".responsive-toggler"),
        $togglees = $(".toggle"),
        $utilNav = $("#util-nav"),

        breakpoints = require('./breakpoints'),

        onResize = function () {
            if (viewportChanged()) {
                var newWidth = getWindowWidth(window);

                if (newWidth >= breakpoints.wide) {
                    //big to small?
                    $body.addClass("screen-wide").removeClass("screen-thin screen-medium");

                    // if this is the first time going to desktop size,
                    // we need to bind the event handlers
                    bindMegaDdEvents($megaLinks, $navLis, $drops);

                    // close any openers which were open before width change
                    $responsiveTogglers.removeClass("active");
                    $togglees.removeClass("active");
                    $utilNav.removeClass("hidden");

                } else if (newWidth >= breakpoints.medium) {
                    //small to big?
                    $body.addClass("screen-medium").removeClass("screen-thin screen-wide");
                    $utilNav.addClass("hidden");
                    $drops.removeClass("active").hide();
                    $navLis.removeClass("active");
                } else {
                    $body.addClass("screen-thin").removeClass("screen-medium screen-wide");
                }
            }
        },

        init = function () {
            $window.resize(onResize);
            $window.resize();

            // attach click events on mobile navigation togglers
            $responsiveTogglers.on("click", function (e) {

                var $self = $(this),
                    $toggle = $self.next(".toggle");

                e.preventDefault();
                $self.toggleClass("active");
                $toggle.toggleClass("active");
            });

            // init the global navigation drop downs
            $drops.hide();

            if (getWindowWidth(window) < breakpoints.wide) {
                $utilNav.children("li").clone().appendTo($globalNav);
            }
        };

    return init;
}();