module.exports = function () {



    // we only need this stuff on a desktop sized browser
    var $ = require('../jquery'),
        $body = $('body'),
        $query = $("#search #query"),

        breakpoints = require('./breakpoints'),

        boundDropEvents = false,

        bindMegaDdEvents = function ($megaLinks, $navLis, $drops) {
            if (!boundDropEvents) {

                //attach click, keydown and focus handler
                $megaLinks.on("click keydown focus", function (e) {

                    var $target = $(this),
                        $li = $target.closest("li"),
                        $drop = $li.find(".drop");

                    // if we have bound the event, but are now on smaller width we don't want to
                    // show the mega dropdown
                    if (CITY.getWindowWidth(window) < breakpoints.desktop) {
                        return;
                    }

                    //what type of event was fired?
                    if (e.type === "keydown" && e.keyCode !== 13) {
                        //if a keypress event but button hit wasn't enter
                        return;
                    }

                    if (e.type === "focus") {
                        //always kill all drop downs when a megaLink receives focus then drop out of fn
                        $navLis.removeClass("active");
                        $drops.hide().removeClass("active");
                        return;
                    }

                    //if we are here then the event is either a click or "enter" keypress

                    //remove all active class from all other links
                    $navLis.not($li[0]).removeClass("active");
                    $drops.not($drop[0]).hide().removeClass("active");
                    $li.toggleClass("active");
                    $drop.toggleClass("active");
                    $drop.show();
                    e.preventDefault();
                    e.stopPropagation();

                });

                // on blur of last mega link (search input query will be focussed), close
                // any open drop down
                $query.on("focus", function () {
                    $navLis.removeClass("active");
                    $drops.hide().removeClass("active");
                });

                //don't propogate clicks inside mega menus
                $drops.on("click", function (e) {
                    e.stopPropagation();
                });

                //close any open mega menus when page is clicked
                $body.on("click", function () {
                    $drops.removeClass("active").hide();
                    $navLis.removeClass("active");
                });

                boundDropEvents = true;
            }
        };

    return bindMegaDdEvents;
}();
