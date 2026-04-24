/**
 * @projectDescription The entire events section in one APP
 * Dependancies: Backbone, Backbone Marionette
 *
 * @author  Lawrence Naman lawrence.naman@gmail.com, James Grant sbbj513
 * @version     0.2
 */
/*global window, CITY, $, yepnope, console, Backbone,_ */

CITY.events = (function(window) {
    var /*
         * sets up single event page
         * @return Undefined
        */
        eventN = function() {
            var /**
             * sets up showing/hidding booking form
             * @return Undefined
             */
                initBookingForm = function() {
                    var $bookingForm = $("#booking-form"),
                        $bookingOpener = $(".event-book"),
                        ajaxFormOptions,
                        //shows form, scrolls page to form
                        showForm = function() {
                            $bookingForm.addClass("show");

                            $("html, body").animate(
                                {
                                    scrollTop: $bookingForm.offset().top
                                },
                                500
                            );
                        };

                    $bookingOpener.on("click", function(e) {
                        e.preventDefault();
                        showForm();
                    });

                    // if a form does not redirect to a thank you page or throws an error because of captcha on reload
                    // we need to show the thank you message or show the form again
                    if ($bookingForm.find(".wFormThankYou").length || $bookingForm.find(".errorMessage").length) {
                        showForm();
                    }

                    ajaxFormOptions = {
                        // target element(s) to be updated with server response
                        target: $bookingForm,

                        //pre-submit callback
                        beforeSubmit: function(formData) {
                            //debug
                            var queryString = $.param(formData);

                            CITY.debug("About to submit: " + queryString);

                            $(".primaryAction", $bookingForm)
                                .attr("value", "")
                                .attr("disabled", "disabled")
                                .addClass("submitting");

                            return true;
                        },

                        // post-submit callback
                        success: function(responseText, statusText) {
                            var $response;

                            CITY.debug("form submission resulted in: " + statusText);

                            //append just the #content (minus h1)
                            $response = $(responseText)
                                .find("#content")
                                .find("h1")
                                .remove()
                                .end();
                            $bookingForm.empty().append($response);
                        },

                        //where to post to
                        url: "/forms/rest/responses/processor",

                        //self exlpanatory
                        type: "post",
                        clearForm: false,
                        resetForm: false
                    };
                },
                /**
             * sets up related events carousel
             * @return Undefined
             */
                initRelatedEventsCarousel = function() {
                    var $relatedEvents = $("#related-events"),
                        $relatedEventsItems = $relatedEvents.find("ul");

                    if ($relatedEvents) {
                        $relatedEventsItems.bxSlider({
                            slideWidth: 320,
                            minSlides: 1,
                            maxSlides: 3,
                            slideMargin: 30,
                            moveSlides: 1,
                            infiniteLoop: false,
                            nextText: '<i class="fa fa-caret-right"></i>',
                            prevText: '<i class="fa fa-caret-left"></i>',
                            touchEnabled: true,
                            preventDefaultSwipeY: true,
                            adaptiveHeight: false,
                            pager: false,
                            hideControlOnEnd: true,
                            responsive: true
                        });
                    }
                };

            initBookingForm();
            initRelatedEventsCarousel();
        },
        // see github.com/addyosmani/backbone.paginator for pagination sauce

        /**
         * events calendar index page in backbone.js
         * @param {Object} B - global Backbone object
         * @param {Object} M - global Backbone Mariotte object
         */
        eventsCalendar = function(B, M) {
            function l(s) {
                CITY.debug(s);
            }

            // could use require.js to pull all
            // the peices together later
            var // model
                CalendarModel = B.Model.extend({}),
                // are we on the homepage?
                isEventsHome = $(".events-home").length ? true : false,
                /*
             * The main collection
             */
                CalendarCollection = Backbone.Collection.extend({
                    model: CalendarModel,

                    url: function() {
                        var url = "/api/search.json?collection=city-events&meta_P_orsand=%22Yes%22&landing=true&sort=adate&_=1373022367687";
                        var dept = $("div.event-calendar-wrap").data("department");
                        var category = $("div.event-calendar-wrap").data("category");

                        // If department data attribute is set, append to url
                        if (dept != undefined) {
                            url += "&meta_F_orsand=%22" + dept + "%22";
                        }
                        if (category != undefined) {
                            url += "&meta_y_orsand=%22" + category + "%22";
                        }

                        if (window.location.search) {
                            var schoolMatch = window.location.search.match(/[\?&](meta_E_orsand=[^&]+)(&|$)/);
                            if (schoolMatch) {
                                url += "&" + schoolMatch[1];
                            }
                            console.log(url);
                        }

                        return url;
                    },

                    parse: function(response) {
                        // our array of results to return
                        var retval = [];
                        if (!response.response || !response.response.resultPacket) {
                            return retval;
                        }
                        // loop over each result and flatten (only 1 level at this point) then push into retval
                        _.each(response.response.resultPacket.results, function(result) {
                            // temp object we later push into retval
                            var obj = {};
                            // loop over each property and act accordingly
                            _.each(result, function(val, key) {
                                // flatten any nested objects
                                if (_.isObject(val)) {
                                    _.each(val, function(v, k) {
                                        obj[k] = v;
                                    });
                                } else if (_.isArray(val)) {
                                    if (!val.length) {
                                        return;
                                    }
                                    obj[key] = val;
                                } else {
                                    obj[key] = val;
                                }
                            });
                            retval.push(obj);
                        });
                        return retval;
                    }
                }),
                /**
             * works out the number of days in a month see http://dzone.com/snippets/determining-number-days-month
             * @param Number : iMonth - remember this is zero based so January is 0
             * @param Number : iYear - which year?
             * @return Date : date obj for last day of the month
             */
                daysInMonth = function(iMonth, iYear) {
                    return 32 - new Date(iYear, iMonth, 32).getDate();
                },
                /**
             * transforms a native JS date object to a custom object that can be used to produce funnelback friendly date string e.g. 16May2013
             * @param {Object} : date object
             * @return {Object} : containing day, month, year
             */
                dateToFbDate = function(date) {
                    this.months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    this.dday = "";
                    this.dmonth = "";
                    this.dyear = "";

                    if (!date instanceof Date) {
                        return;
                    }

                    this.dday = date.getDate().toString(10);
                    this.dmonth = this.months[date.getMonth()];
                    this.dyear = date.getFullYear().toString(10);

                    if (this.dday.length === 1) {
                        this.dday = "0" + this.dday;
                    }

                    return {
                        dday: this.dday,
                        dmonth: this.dmonth,
                        dyear: this.dyear,
                        dateString: this.dday + "-" + this.dmonth + "-" + this.dyear
                    };
                },
                /**
             * takes a date object and finds the end date of the week, which will evaluate to next saturday
             * @param {Date} : Date object
             * @return {Date} : returns Date on end of week
             */
                endOfWeek = function(date) {
                    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 6 - date.getDay());
                },
                /* jshint -W015 */
                linksTemplate = [
                    '<ul class="clearfix filter-list">',
                    '<li><a class="calendar-link filter" id="reset" href="/<%= attrs.pathname %>/calendar#reset/reset" data-param=\'reset\' data-href="reset">All upcoming events</a></li>',
                    '<li><a class="calendar-link filter" href="/<%= attrs.pathname %>/calendar#show/equalTo/<%= attrs.fbToday.dateString %>" data-param=\'show/equalTo\' href=\'\' data-href="<%= attrs.fbToday.dateString %>">Today</a></li>',
                    '<li><a class="calendar-link filter" href="/<%= attrs.pathname %>/calendar#show/max/<%= attrs.weekEnd.dateString %>" data-param=\'show/max\' href=\'\' data-href="<%= attrs.weekEnd.dateString %>">This week</a></li>',
                    '<li><a class="calendar-link filter" href="/<%= attrs.pathname %>/calendar#show/max/<%= attrs.fbEndOfMonth.dateString %>" data-param=\'show/max\' href=\'\' data-href="<%= attrs.fbEndOfMonth.dateString %>">This month</a></li>',
                    "</ul>"
                ].join("\n"),
                /* jshint -W015 */

                LinksView = M.ItemView.extend({
                    //The element to attach to
                    el: $("#calendar-links"),
                    /**
                 * initializes this view
                 * @return {Undefined}
                 */
                    initialize: function() {
                        _.bindAll(this, "render");

                        //Render the objects view
                        this.render();
                    },
                    /**
                 * renders this view
                 * @return {Undefined}
                 */

                    template: function() {
                        this.noOfDaysFromNow = new Date();
                        this.today = new Date();
                        this.endOfMonthObj = new Date(
                            this.today.getFullYear(),
                            this.today.getMonth(),
                            daysInMonth(this.today.getMonth(), this.today.getFullYear())
                        );
                        this.fbEndOfMonth = dateToFbDate(this.endOfMonthObj);
                        this.fbToday = dateToFbDate(this.today);
                        this.weekEnd = dateToFbDate(endOfWeek(this.today));
                        //Get the pathname absolutely to bypass nocache url problem
                        this.pathname = window.location.pathname.split("/")[1];

                        return _.template(linksTemplate, this, { variable: "attrs" });
                    }
                }),
                /**
             * builds the calendar and upcoming links and handles their actions
             * @param {Object} : jQuery Selector object
             * @return {Undefined}
             */
                CalendarView = Backbone.View.extend({
                    //The element to attach to
                    el: $("#calendar"),

                    /**
                 * initializes this view
                 * @return {Undefined}
                 */
                    initialize: function() {
                        _.bindAll(this, "render");

                        //Render the objects view
                        this.render();
                    },
                    /**
                 * renders this view
                 * @return {Undefined}
                 */
                    render: function() {
                        $(this.el).append(this.calendarBuild(this.$el));
                    },

                    calendarBuild: function(calendarObj) {
                        var escapeThis = this,
                            i = 0;

                        this.calendar = calendarObj;
                        this.fbUrl =
                            "/api/search.json?collection=city-events&sort=adate&meta_P_orsand=%22Yes%22&form=calendar&date=all&landing=true";
                        this.noOfDaysFromNow = new Date();
                        this.today = new Date();
                        this.endOfMonthObj = new Date(
                            this.today.getFullYear(),
                            this.today.getMonth(),
                            daysInMonth(this.today.getMonth(), this.today.getFullYear())
                        );

                        this.fbEndOfMonth = dateToFbDate(this.endOfMonthObj);
                        this.fbToday = dateToFbDate(this.today);
                        this.noOfDaysFromNow.setDate(this.noOfDaysFromNow.getDate() + 365);
                        this.results = this.collection.models;
                        this.resultsLength = this.results.length;
                        this.eventDates = [];

                        for (i; i < this.resultsLength; i++) {
                            if (this.results[i].attributes.d) {
                                //turn this into a date, reset time (for comparison purposes) then push to array
                                this.eventDates.push(
                                    $.datepicker
                                        .parseDate("yy-mm-dd", this.results[i].attributes.d)
                                        .setHours(0, 0, 0, 0)
                                );
                            }
                        }

                        // init Datepicker
                        this.calendar.datepicker({
                            onSelect: function(e, dateObj) {
                                if (isEventsHome) {
                                    var months = [
                                            "Jan",
                                            "Feb",
                                            "Mar",
                                            "Apr",
                                            "May",
                                            "Jun",
                                            "Jul",
                                            "Aug",
                                            "Sep",
                                            "Oct",
                                            "Nov",
                                            "Dec"
                                        ],
                                        newUrl =
                                            "/calendar#show/equalTo/" +
                                            dateObj.currentDay +
                                            "-" +
                                            months[dateObj.currentMonth] +
                                            "-" +
                                            dateObj.currentYear;
                                    window.location.href += newUrl;
                                }
                            },

                            maxDate: this.noOfDaysFromNow,
                            minDate: 0,
                            beforeShowDay: function(date) {
                                // set hours to 0,0,0,0 for comparison purposes
                                // we only need to compare the day/month/year, not the time
                                if ($.inArray(date.setHours(0, 0, 0, 0), escapeThis.eventDates) !== -1) {
                                    //CITY.debug("true");
                                    return [true, "selectable"];
                                } else {
                                    //CITY.debug("false");
                                    return [false];
                                }
                            }
                        });

                        calendarObj
                            .removeClass("component-loading")
                            .children(".loading-fa-icon")
                            .remove();
                    }
                }),
                // start!
                //Global namespace to app
                APP = window.EventsAPP;

            APP.collections.calendarCollection = new CalendarCollection();
            APP.collections.calendarCollection.fetch({
                success: function() {
                    APP.views.linksView = new LinksView({
                        collection: APP.collections.calendarCollection
                    });
                    APP.views.calendarView = new CalendarView({
                        collection: APP.collections.calendarCollection
                    });
                }
            });

            if ($(".event-calendar-wrap").length) {
                eventsIndex(Backbone, Backbone.Marionette);
            }
        }, // end events-calendar
        /**
         * events calendar index page in backbone.js
         */
        eventsIndex = function(B, M) {
            function l(s) {
                CITY.debug(s);
            }

            // could use require.js to pull all
            // the peices together later
            var // models
                EventsModel = B.Model.extend({}),
                // cache some selectors for reuse
                cachedElements = {
                    $body: $("html, body"),
                    $filters: $(".filters"),
                    $summary: $("#fb-summary")
                },
                /*
             * scrolls screen to results if we are on a small screen
            */
                scrollToResults = function() {
                    if (!cachedElements.$body.hasClass("screen-thin")) {
                        return;
                    }

                    cachedElements.$body.animate(
                        {
                            scrollTop: cachedElements.$summary.offset().top
                        },
                        400
                    );
                },
                // collections

                /*
             * The main collection, paginated with Backbone.Paginator.clientPager
             */
                EventsCollection = Backbone.Paginator.clientPager.extend({
                    model: EventsModel,

                    initialize: function() {
                        // for debug of collection events
                        this.on("all", function(eventName) {
                            l("events collection event fired: " + eventName);
                        });
                    },

                    paginator_core: {
                        dataType: "json",
                        url: "/api/search.json"
                    },

                    paginator_ui: {
                        perPage: 100
                    },

                    server_api: {
                        collection: "city-events",
                        landing: "true",
                        sort: "adate",
                        meta_P_orsand: "Yes",

                        // If department data attribute is set, then add further query parameter
                        meta_F_orsand: function() {
                            var dept = $("div.event-calendar-wrap").data("department");
                            if (dept != undefined) {
                                return "%22" + $("div.event-calendar-wrap").data("department") + "%22";
                            }
                        },
                        meta_y_orsand: function() {
                            var dept = $("div.event-calendar-wrap").data("category");
                            if (dept != undefined) {
                                return "%22" + $("div.event-calendar-wrap").data("category") + "%22";
                            }
                        }
                    },

                    /**
                 * when filtering (searching) using the paginator library,
                 * all properties need to be at the top level. So we
                 * flatten them while parsing
                 */
                    parse: function(response) {
                        // our array of results to return
                        var retval = [];

                        if (!response.response || !response.response.resultPacket) {
                            return retval;
                        }

                        // loop over each result and flatten (only 1 level at this point) then push into retval
                        _.each(response.response.resultPacket.results, function(result) {
                            // temp object we later push into retval
                            var obj = {};
                            // loop over each property and act accordingly
                            _.each(result, function(val, key) {
                                // flatten any nested objects
                                if (_.isObject(val)) {
                                    _.each(val, function(v, k) {
                                        obj[k] = v;
                                    });
                                } else if (_.isArray(val)) {
                                    if (!val.length) {
                                        return;
                                    }
                                    obj[key] = val;
                                } else {
                                    obj[key] = val;
                                }
                            });
                            retval.push(obj);
                        });
                        return retval;
                    },

                    /**
                 * search funnelback and use the results to filter this collection
                 */
                    searchFunnelback: function(query) {
                        // really don't think we should be doing this processing here,
                        // but if we don't do this data clobbers the server_api options
                        // in Paginator.sync
                        var data = decodeURIComponent($.param(_.extend(this.server_api, { query: query }))),
                            self = this;

                        this.fetch({
                            success: function() {
                                // we're going against the way Paginator works a bit here,
                                // so we need to manually do these steps
                                self.sortedAndFilteredModels = self.models.slice();
                                self.info();
                            },
                            data: data
                        });
                    }
                }),
                // Templates
                /* jshint -W015 */
                eventTemplate = [
                    '<div class="event-top cf">',
                    '<div class="date">',
                    '<p class="date-month"><% var eventMonth = data.H.substring(0, 3); %><%= eventMonth %></p>',
                    '<p class="date-day-no"><%= data.G %></p>',
                    '<p class="date-day"><%= data.K %></p>',
                    "</div>",
                    '<div class="event-details">',
                    '<h2 itemprop="name" class="event-title"><a href="',
                    "<% if (data.Y) { %>",
                    "<%= data.Y %>",
                    "<% } else { %>",
                    "<%= data.liveUrl %>",
                    '<% } %>"',
                    'class="summary url" itemprop="url"><%= data.title %></a></h2>',
                    '<time itemprop="startDate" datetime="<%= data.B %>z" class="event-time"><i class="fa fa-clock-o"></i>',
                    "<% if (data.Q) { %>",
                    "<%= data.Q %><%= data.U %>",
                    "<% } else { %>",
                    "<%= data.J %>",
                    "<% } %>",
                    "</time>",
                    "<% if (data.y) { %>",
                    '<p class="event-category"><i class="fa fa-tag"></i> <%= data.y %></p>',
                    "<% } %>",
                    "<% if (data.M) { %>",
                    '<p class="event-audience"><i class="fa fa-users"></i> <%= data.M %></p>',
                    "<% } %>",
                    "</div>",
                    "</div>",
                    '<p class="event-summary" itemprop="description"><%= data.c %></p>'
                ].join("\n"),
                /* jshint +W015 */

                // views

                /**
             * The item view is responsible for rendering an individual event
             */
                EventItemView = M.ItemView.extend({
                    tagName: "li",
                    className: "event vevent",
                    attributes: {
                        itemtype: "http://schema.org/Event",
                        itemscope: ""
                    },
                    /**
                 * called by ItemView.render
                 */
                    template: function(modelData) {
                        //l(modelData);
                        return _.template(eventTemplate, modelData, { variable: "data" });
                    } /* not used ....yet? ,

                events: {
                    "click .filter": "filterClick",
                },*/

                    /**
                 * will route to the search form with filter applied
                 */
                    /*filterClick: function (e) {

                    var data = $(e.target).data();

                    // which filter?
                    l(e.target.className + " clicked");

                    // route
                    APP.router.navigate(
                        data.filterParam + "/" + encodeURIComponent(data.filterValue).replace(/%20/g, "+"),
                        {trigger: true}
                    );

                    e.preventDefault();

                }*/
                }),
                /**
             * The collection view is responsible for rendering the list of academic cards
             */
                EventsListView = M.CollectionView.extend({
                    // main target div
                    el: "#events-results",

                    // the childView class
                    itemView: EventItemView,

                    // flag to help us know if we have done an initial render
                    firstRender: true,

                    initialize: function() {
                        // this needs to bind to the collection pre filtering/fetching
                        this.$el.empty();
                        this.$el.addClass("backbone-ready");
                        this.$el.show();

                        this.on("render", this.removeSpinners);
                    },

                    removeSpinners: function() {
                        this.$el
                            .removeClass("component-loading")
                            .children(".loading-fa-icon")
                            .remove();
                    }
                }),
                /**
             * day links view
             * handles the clicking of "today", "this week", "this month" filters
             */
                LinksActionView = B.View.extend({
                    el: "#calendar-links",

                    events: {
                        "click li a": "filterClick"
                    },

                    filterClick: function(e) {
                        var $this = $(e.target),
                            newUrl = $this.data("param") + "/" + $this.data("href"),
                            isSelected = $this.hasClass("selected");

                        e.preventDefault();

                        //Removes all selected classes from the hyperlinks
                        cachedElements.$filters.find("a").removeClass("selected");

                        if ($this.data("href") === "reset" || isSelected) {
                            newUrl = "clear";
                        } else {
                            $this.addClass("selected");
                        }

                        APP.router.navigate(newUrl, {
                            trigger: true
                        });

                        scrollToResults();
                    }
                }),
                /**
             * Category filters view
             * handles the clicking of a category link on the page
             */
                CatLinksActionView = B.View.extend({
                    el: "#categories",

                    events: {
                        "click li a": "filterClick"
                    },

                    filterClick: function(e) {
                        var $this = $(e.target),
                            newUrl = $this.attr("href"),
                            isSelected = $this.hasClass("selected");

                        e.preventDefault();

                        //Removes all selected classes from the hyperlinks
                        $(".filters")
                            .find("a")
                            .removeClass("selected");

                        if ($this.data("href") === "reset" || isSelected) {
                            newUrl = "clear";
                        } else {
                            $this.addClass("selected");
                        }

                        APP.router.navigate(newUrl, {
                            trigger: true
                        });

                        scrollToResults();
                    }
                }),
                /**
             * facets view
             * handles the calendar
             */
                FacetsView = B.View.extend({
                    el: "#calendar",

                    events: {
                        "mousedown td a": "facetClick"
                    },

                    facetClick: function(e) {
                        var $this = $(e.target),
                            months = [
                                "Jan",
                                "Feb",
                                "Mar",
                                "Apr",
                                "May",
                                "Jun",
                                "Jul",
                                "Aug",
                                "Sep",
                                "Oct",
                                "Nov",
                                "Dec"
                            ],
                            newUrl =
                                "show/equalTo/" +
                                encodeURIComponent($this.text()) +
                                "-" +
                                months[encodeURIComponent($this.parent().data("month"))] +
                                "-" +
                                $this.parent().data("year");

                        e.preventDefault();

                        APP.router.navigate(newUrl, {
                            trigger: true
                        });

                        scrollToResults();
                    }
                }),
                /**
             * Responsible for the "x-y of z results" text
             */
                SearchMetaView = M.ItemView.extend({
                    el: ".results-summary",

                    // catch any of these collection events and update our search meta
                    collectionEvents: {
                        sync: "render",
                        reset: "render",
                        sort: "render"
                    },

                    template: function(modelData) {
                        modelData.info = APP.collections.eventsCollection.information;

                        // render with count
                        return _.template(
                            "<span class='results-totals'><%= info.startRecord %> - <%= info.endRecord %> of <%= info.totalRecords %> results</span>",
                            modelData
                        );
                    }
                }),
                // router
                MainRouter = B.Router.extend({
                    routes: {
                        clear: "defaultRoute",
                        "show/:param/:value": "showRoute",
                        "search/:param/:value": "searchRoute"
                    },

                    initialize: function() {
                        // start router only once we have done initial fetch
                        // and DOM is ready
                        APP.collections.eventsCollection.once("sync", function() {
                            l("starting router");
                            $(function() {
                                B.history.start({
                                    // N.B. we can't use pushstate because matrix will
                                    // try and resolve any url backbone generates on
                                    // next load (boo!)
                                    //
                                    // a solution could be some Apache rewriting, at
                                    // the expense of flexibility / ease of maintainence
                                    // (if we really want this)
                                    //
                                    // pushState: true,

                                    root: window.location.pathname
                                });
                            });
                        });

                        // always want to init collection
                        APP.collections.eventsCollection.fetch({
                            success: function() {
                                APP.collections.eventsCollection.pager();
                            },
                            silent: true
                        });
                    },

                    defaultRoute: function() {
                        //Remove exisiting notifications
                        $(".no-results").remove();

                        //Removes all selected classes from the hyperlinks
                        $(".filters")
                            .find("a")
                            .removeClass("selected");
                        //Adds reset as selected filter
                        $("#reset").addClass("selected");

                        // clear any filtering
                        APP.collections.eventsCollection.setFieldFilter();
                    },

                    /**
                 * will filter the collection from the url for category filtering
                 *
                 * search/:value
                 *
                 */
                    searchRoute: function(param, value) {
                        //Remove exisiting notifications
                        $(".no-results").remove();

                        value = value
                            .replace("+", " ")
                            .match(/[\w ]/g)
                            .join("");

                        APP.collections.eventsCollection.setFieldFilter([
                            {
                                field: param,
                                type: "equalTo",
                                value: value
                            }
                        ]);

                        //If no values are available notify people
                        if (!APP.collections.eventsCollection.length) {
                            $("#events-results").append(
                                '<li class="no-results"><h2>No upcoming events of this type</h2><p class="cta soft-cta"><a class="reset" href="#clear">Reset filters</a></p></li>'
                            );
                        }

                        //Re adds it to the appropriate one
                        $.each($("#category-select").find("a"), function(k, v) {
                            if (
                                $(v)
                                    .data("href")
                                    .replace("+", " ")
                                    .match(/[\w ]/g)
                                    .join("") === value
                            ) {
                                $(v).addClass("selected");
                            }
                        });
                    },

                    /**
                 * will filter the collection from the url for date filtering
                 *
                 * show/:param/:value
                 *
                 */
                    showRoute: function(param, value) {
                        //Split the date request for parsing
                        var values = value.split("-");

                        $(".no-results").remove();

                        // search through collection
                        APP.collections.eventsCollection.setFieldFilter([
                            {
                                field: "G",
                                type: param,
                                value: values[0]
                            },
                            {
                                field: "H",
                                type: "pattern",
                                value: values[1]
                            },
                            {
                                field: "I",
                                type: param,
                                value: values[2]
                            }
                        ]);

                        //Removes all selected classes from the hyperlinks
                        cachedElements.$filters.find("a").removeClass("selected");

                        //Re adds it to the appropriate one
                        $.each($("#calendar-links").find("a"), function(k, v) {
                            if ($(v).data("href") === value || $(v).data("param") === param) {
                                $(v).addClass("selected");
                            }
                        });

                        //If no values are available notify people
                        if (!APP.collections.eventsCollection.length) {
                            $("#events-results").append(
                                '<li class="no-results"><h2>No events for this period are availiable to show</h2><p class="cta soft-cta"><a class="reset" href="#clear">Reset filters</a></p></li>'
                            );
                        }
                    }
                }),
                // start!
                //namespace to window
                APP = window.EventsAPP;

            // collection
            APP.collections.eventsCollection = new EventsCollection();

            // views
            APP.views.searchMetaView = new SearchMetaView({
                collection: APP.collections.eventsCollection
            });

            APP.views.eventsListView = new EventsListView({
                collection: APP.collections.eventsCollection
            });

            APP.views.facetsView = new FacetsView({
                collection: APP.collections.eventsCollection
            });

            APP.views.linksActionView = new LinksActionView();

            APP.views.catLinksActionView = new CatLinksActionView();

            // router
            APP.router = new MainRouter();
        }, //end events-index
        /*
         * branches according to type of page - eventN, event homepage or event calendar
         * @return Undefined
        */
        init = function() {
            // Global namespace declared for backbone usage
            var APP = {
                collections: {
                    calendarCollection: undefined,
                    eventsCollection: undefined
                },
                views: {
                    linksView: undefined,
                    categoryView: undefined,
                    linksActionView: undefined,
                    calendarView: undefined,
                    eventsListView: undefined,
                    facetsView: undefined
                },
                router: undefined
            };

            //namespace to window
            window.EventsAPP = APP;

            if ($("#calendar").length) {
                eventsCalendar(Backbone, Backbone.Marionette);
            }

            if ($(".single-event").length) {
                eventN();
            }

            if ($(".events-home").length) {
                $("#primary-nav-toggler").addClass("events-home-title");
            }
        };
    // end vars

    return {
        init: init
    };
})(window); //end CITY.events

CITY.events.init();
