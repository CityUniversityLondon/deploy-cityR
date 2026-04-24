module.exports = function () {
    "use strict";

    var $ = require('./jquery'),
        debug = require('../utils/debug'),

        createGallery = require('./funcs/create-gallery'),
        downloadFileTypes = require('./funcs/download-file-types'),
        viewportChanged = require('./funcs/viewport-changed'),
        /**
         * object to hold google maps markers
         */
        googleMapsMarkers = {},

        /**
         * overlay pane for map
         */
        mapOverlayPane = null,
        /**
         *
         * What needs to happen after a bxslider carousel has finished loading:
         * 1. inject controls into @widget. finds default bxslider controls, replace with font awesome icons and append in widget
         * 2. add scrollable class to widget content
         * 3. remove loading spinner
         * @param jQuery widget: a jquery wrapped .widget (needed for widget controls)
         * @param string middleButtonText: what to write on the middle button (defaults to "All") (needed for widget controls)
         * @param string allLink: the "all" middle button href (needed for widget controls)
         */
        afterBxSliderLoaded = function (widget, allLink, middleButtonText) {

            var leftWidgetButton = "<i class=\" fa fa-caret-left\"></i>",
                rightWidgetButton = "<i class=\" fa fa-caret-right\"></i>",
            // carousel controls
                previousButton = widget.find(".bx-prev"),
                nextButton = widget.find(".bx-next"),
                inputMiddleButtonText = middleButtonText ? middleButtonText : "All";

            previousButton.empty().append(leftWidgetButton);
            nextButton.empty().append(rightWidgetButton);
            //add the "all" button between previous and next buttons if it is needed
            if (allLink) {
                previousButton.after("<a href=\"" + allLink + "\" class=\"bx-all\" >" + inputMiddleButtonText + "</a>");
            }
            widget.find(".bx-controls-direction").appendTo(widget);
            widget.children('h2').addClass('controls-direction');

            //add class
            widget.find(".widget-content").addClass("scrollable");

            //remove widget loading spinner
            widget.removeClass("widget-loading").children('.loading-fa-icon').remove();

        },

        /**
         * news widget
         */
        initNews = function () {

            var newsWidget = $("#news-widget"),
                newsList = newsWidget.find("#news-results"),
                allLink = "//www.city.ac.uk/news",
                showAmount = 3;

            //reformat the content into column sizes based on determined size, if there are more than showAmount items
            if ($("#news-results > .article").size() > showAmount) {
                //set up sortable
                newsList.wrapChildren({
                    childElem: ".article",
                    sets: showAmount
                });
                //launch bxslider
                newsList.bxSlider({
                    auto: false,
                    autoControls: false,
                    pause: 15000,
                    autoHover: true,
                    touchEnabled: false,
                    pager: false,
                    infiniteLoop: false,
                    hideControlOnEnd: true,
                    adaptiveHeight: true,
                    onSliderLoad: function () {
                        afterBxSliderLoaded(newsWidget, allLink);
                    }
                });
            }
            else {
                //remove widget loading spinner, case where the carousel isn't needed
                newsWidget.removeClass("widget-loading").children('.loading-fa-icon').remove();
            }
        },

        /**
         * events widget
         */
        initEvents = function () {

            var eventsWidget = $("#events-widget"),
                eventsList = $("#events-results"),
                allLink = "//www.city.ac.uk/events",
                showAmount = 3;

            //click anywhere on event
            $(".vevent", eventsList).click(function () {
                window.location = $(this).find("a").attr("href");
                return false;
            });

            if ($("#events-results > .vevent").size() > showAmount) {
                //sort the children into groups of showAmount
                eventsList.wrapChildren({
                    childElem: ".event",
                    sets: showAmount
                });
                eventsList.bxSlider({
                    auto: false,
                    autoControls: false,
                    pause: 15000,
                    autoHover: true,
                    touchEnabled: false,
                    pager: false,
                    infiniteLoop: false,
                    hideControlOnEnd: true,
                    adaptiveHeight: true,
                    onSliderLoad: function () {
                        afterBxSliderLoaded(eventsWidget, allLink);
                    }
                });
            }
            else {
                //remove widget loading spinner, case where the carousel isn't needed
                eventsWidget.removeClass("widget-loading").children('.loading-fa-icon').remove();
            }

        },//end initEvents

        initFlickr = function () {

            var $widget = $("#flickr-widget"),
                $slideWrapper = $widget.find("ul"),
                loadedOtherPics,
                bxSliderCallback = function () {

                    debug("flickr callback...");

                    $(".widget-content", $widget).each(function () {

                        //find the ul
                        var firstdiv = $("ul div:first-child", this),
                        //ul = $("ul", this), defined not used
                            thisJq = $(this),
                            height = firstdiv.height(),
                            width = firstdiv.width();

                        //add classes
                        thisJq.addClass("scrollable");

                        //add css to .widget-content
                        thisJq.stop().animate({
                            "min-height": height
                        });
                        thisJq.css("width", width);

                        //remove loading icon when the content is ready
                        $widget.removeClass("widget-loading").children('.loading-fa-icon').remove();

                    });

                    afterBxSliderLoaded($widget);

                };

            //attach an event to init the rest of the pics
            $widget.mouseenter(function () {

                //we only want to run this once
                if (loadedOtherPics) {
                    return;
                }

                loadedOtherPics = true;

                //translate all the span.imageurl"s into actual images
                //(saves some rendering time)
                $("a .imageurl", $widget).each(function () {

                    var thisJq = $(this),
                        text = thisJq.text(),
                        imgTag = "<img src=\"" + text + "\" alt=\"\">";

                    thisJq.parent().text("").prepend(imgTag);

                });

                $("p .imageurl", $widget).each(function () {
                    var thisJq = $(this),
                        text = thisJq.text(),
                        styleAttr = "background-image: url(" + text + ");";

                    thisJq.parent().attr("style", styleAttr);
                    thisJq.remove();

                });

            });

            //set up scrollable
            $slideWrapper.bxSlider({
                auto: false,
                autoControls: false,
                pause: 15000,
                autoHover: true,
                touchEnabled: false,
                pager: false,
                infiniteLoop: false,
                hideControlOnEnd: true,
                adaptiveHeight: true,
                minSlides: 1,
                maxSlides: 4,
                slideWidth: 330,
                slideMargin: 0,
                onSliderLoad: function () {
                    bxSliderCallback();
                }
            });

        },//end initFlickr

        /**
         * courses widget
         */
        initCourses = function () {

            var $widget = $("#courses-widget"),
                widgetContent = $widget.find(".widget-content");

            widgetContent.accordion({
                heightStyle: "content",
                collapsible: true,
                active: false,
                animate: false,
                icons: {
                    "header": "ui-icon-triangle-1-s",
                    "headerSelected": "ui-icon-triangle-1-n"
                },
                create: function () {
                    afterBxSliderLoaded($widget);
                }
            });

        },//end initCourses

        /**
         * testimonials widget
         */
        initTestimonials = function () {
            var $testimonialsWidget = $("#testimonials-widget"),
                widgetContent = $testimonialsWidget.find(".widget-content"),
                testimonialsList = widgetContent.find("ul"),
                bxSliderCallback;

            //check there is more than 1 testimonials and if so, start the carousel
            if ($("li", testimonialsList).length < 2) {
                debug("Less than 2 testimonials, no need for carousel");
                $testimonialsWidget.removeClass("widget-loading").addClass("widget-one-item").children('.loading-fa-icon').remove();
                return;
            }

            bxSliderCallback = function () {
                //add controls
                afterBxSliderLoaded($testimonialsWidget);
                $testimonialsWidget.removeClass("widget-loading").children('.loading-fa-icon').remove();
            };

            //initialise bxslider
            testimonialsList.bxSlider({
                auto: false,
                autoControls: false,
                pause: 15000,
                slideMargin: 10,
                autoHover: true,
                touchEnabled: false,
                pager: false,
                infiniteLoop: false,
                hideControlOnEnd: true,
                adaptiveHeight: true,
                onSliderLoad: function () {
                    bxSliderCallback();
                }
            });

        },//end initTestimonials

        /**
         * profiles widget
         */
        initProfiles = function () {

            var $profilesWidget = $("#profiles-widget"),
                widgetContent = $profilesWidget.find(".widget-content"),
                profilesList = widgetContent.find("ul"),
                bxSliderCallback;//end vars

            //check there is more than 1 testimonials and if so, start the carousel
            if ($("li", profilesList).length < 2) {
                debug("Less than 2 testimonials, no need for carousel");
                $profilesWidget.removeClass("widget-loading").children('.loading-fa-icon').remove();
                return;
            }

            bxSliderCallback = function () {
                //add controls
                afterBxSliderLoaded($profilesWidget);
                $profilesWidget.removeClass("widget-loading").children('.loading-fa-icon').remove();
            };

            //initialise bxslider
            profilesList.bxSlider({
                auto: false,
                autoControls: false,
                pause: 15000,
                autoHover: true,
                touchEnabled: false,
                pager: false,
                infiniteLoop: false,
                hideControlOnEnd: true,
                adaptiveHeight: true,
                onSliderLoad: function () {
                    bxSliderCallback();
                }
            });

        },//end profilesWidgets

        /**
         * spotlight on research widget
         */
        initSpotlightResearch = function () {

            var $spotlightResearchWidget = $("#spotlight-research-widget"),
                widgetContent = $spotlightResearchWidget.find(".widget-content"),
                spotlightResearchList = widgetContent.find("ul"),
                bxSliderCallback;//end vars

            //check there is more than 1 spotlight on research items and if so, start the carousel
            if ($("li", spotlightResearchList).length < 2) {
                debug("Less than 2 spotlight on research, no need for carousel");
                $spotlightResearchWidget.removeClass("widget-loading").addClass("widget-one-item").children('.loading-fa-icon').remove();
                return;
            }

            bxSliderCallback = function () {
                //add controls
                afterBxSliderLoaded($spotlightResearchWidget);
                $spotlightResearchWidget.removeClass("widget-loading").children('.loading-fa-icon').remove();
            };

            //initialise bxslider
            spotlightResearchList.bxSlider({
                auto: false,
                autoControls: false,
                pause: 15000,
                autoHover: true,
                touchEnabled: false,
                pager: false,
                infiniteLoop: false,
                hideControlOnEnd: true,
                adaptiveHeight: true,
                onSliderLoad: function () {
                    bxSliderCallback();
                }
            });

        },//end initSpotlightResearch

        /**
         * RSS widget
         */
        initRss = function () {

            var $widget = $("#rss-widget"),
                widgetContent = $widget.find(".widget-content"),
                items = widgetContent.find(".items"); //end vars

            if (items.children().length > 1) {
                //load up bxslider
                items.bxSlider({
                    auto: false,
                    autoControls: false,
                    pause: 15000,
                    autoHover: true,
                    touchEnabled: false,
                    pager: false,
                    infiniteLoop: false,
                    hideControlOnEnd: true,
                    adaptiveHeight: true,
                    onSliderLoad: function () {
                        afterBxSliderLoaded($widget);
                    }
                });

            } else {
                //don't load the bxslider carousel , just show widget
                $widget.removeClass("widget-loading").children('.loading-fa-icon').remove();
            }

        },

        /**
         * Call to action widget
         */
        initCallToAction = function () {

            var start_date = $("#start_date").val(),
                end_date = $("#end_date").val(),
                sd = new Date(),
                ed = new Date(),
                cd,
                splitDate = function (dt, idt) {

                    var dateArray = dt.split("/"),
                        endofArray = dateArray[2].split(" ");

                    idt.setFullYear(endofArray[0]);
                    idt.setMonth(dateArray[1] - 1);
                    idt.setDate(dateArray[0]);

                    return idt;

                };

            sd = splitDate(start_date, sd);
            ed = splitDate(end_date, ed);

            //current date
            cd = new Date();

            if (ed >= cd && sd <= cd) {

                //Show the on date
                $("#content_on_date").attr("class", "widget-content cta-widget-show");
                $("#content_out_of_date").attr("class", "cta-widget-hide");

            } else {

                //Show out of date
                $("#content_out_of_date").attr("class", "widget-content cta-widget-show");
                $("#content_on_date").attr("class", "cta-widget-hide");
            }

        },

        /**
         * initiates an image gallery widget
         *
         * @return {object || undefined} returns the galleria jQuery object if
         * successful else undefined - for instance if $gallery is not a jQuery object
         *
         */
        initGallery = function () {

            var $gallery = $("#gallery-widget .gallery");
            return createGallery($gallery, true);

        },

        initFreeText = function () {
            $("div.free-text a").unbind("click").click(function () {
            });
        },

        /**
         * The master widget initialiser, calls all the other init{map,events...} functions
         */
        initWidgets = function () {

            var widgets = {
                    "events": {
                        f: initEvents
                    },
                    "news": {
                        f: initNews
                    },
                    "flickr": {
                        f: initFlickr
                    },
                    "courses": {
                        f: initCourses
                    },
                    "testimonials": {
                        f: initTestimonials
                    },
                    "rss": {
                        f: initRss
                    },
                    "gallery": {
                        f: initGallery
                    },
                    "cta": {
                        f: initCallToAction
                    },
                    "freetext": {
                        f: initFreeText
                    },
                    "profiles": {
                        f: initProfiles
                    },
                    "spotlight-research": {
                        f: initSpotlightResearch
                    }
                },

                id;


            //loop through each widget type and init if present
            for (id in widgets) {
                if (widgets.hasOwnProperty(id)) {
                    //bail here if the widget is not present
                    if ($("#" + id + "-widget").length === 0) {
                        debug("no " + id + " widget");
                    } else if (typeof widgets[id].f !== "function") {
                        debug("can't find init func of " + id + " widget");
                    } else {
                        //run the init
                        debug("running init func of " + id + " widget");
                        widgets[id].f.apply();
                    }
                }
            }
        };

    return initWidgets;

}();
