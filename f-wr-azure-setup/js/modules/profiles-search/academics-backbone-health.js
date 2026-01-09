/*jshint devel:true */
/*global Backbone,_ */

// see github.com/addyosmani/backbone.paginator for pagination sauce

/**
 * academics index page in backbone.js
 */
(function (B, M) {

    function l(s) {
        CITY.debug(s);
    }

    // could use require.js to pull all
    // the peices together later
    var

    // our namespace
    APP = {
        collections: {
            academicsCollection: undefined
        },
        views: {
            academicsListView: undefined,
            facetsView: undefined
        },
        router: undefined
    },

    // models
    AcademicModel = B.Model.extend({}),

    //Layout
    doLayout = function() {
        /**
        *   JQuery Styling of the different rendered cards even odd even odd pattern
        */
        for(var i = 0; i < APP.collections.academicsCollection.length; i++) {
            if (i % 2 === 0) {
                $("li.academic:eq("+i+")").addClass("odd");
            }

        }
    },

    // collections

    /*
     * The main collection, paginated with Backbone.Paginator.clientPager
     */
    AcademicsCollection = Backbone.Paginator.clientPager.extend({

        model: AcademicModel,

        initialize: function () {

            // for debug of collection events
            this.on("all", function (eventName) {
                l("academics collection event fired: " + eventName);
            });

        },

        paginator_core: {
            dataType: "json",
            url: "/api/search.json"
        },

        paginator_ui: {
            perPage: 20
        },

        server_api: {
            collection: "academics-matrix",

            // doesn't matter if this is set on subsequent requests, fb deals with it
            landing: "true",
            sort: "metaR"
        },

        /**
         * when filtering (searching) using the paginator library,
         * all properties need to be at the top level. So we
         * flatten them while parsing
         */
        parse: function (response) {

            // our array of results to return
            var retval = [];

            if (! response.response || ! response.response.resultPacket) {
                return retval;
            }

            // loop over each result and flatten (only 1 level at this point) then push into retval
            _.each(response.response.resultPacket.results, function (result) {

                // temp object we later push into retval
                var obj = {};

                // loop over each property and act accordingly
                _.each(result, function (val, key) {

                    // flatten any nested objects
                    if (_.isObject(val)) {

                        _.each(val, function (v, k) { obj[k] = v; });

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
        searchFunnelback: function (query) {

            // really don't think we should be doing this processing here,
            // but if we don't do this data clobbers the server_api options
            // in Paginator.sync
            var server_api = this.server_api,
                data,
                self = this;

            delete server_api.sort;

            data = decodeURIComponent(
                $.param(_.extend(
                    server_api,
                    {"query": query}
                ))
            );

            this.fetch({
                success: function () {
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
    academicTemplate = [
        "<div class=\"image\">",
          "<a href=\"<%= attrs.liveUrl %>\">",
          "<% if (attrs.O) { %>",
            "<img class=\"thumbnail\" src=\"<%= attrs.O %>\">",
          "<% } else { %>",
            "<i class=\"fa fa-user\" />",
          "<% } %>",
          "</a>",
        "</div><!-- /.image -->",

        "<div class=\"who\">",
          "<h2><a href=\"<%= attrs.liveUrl %>\"><%= attrs.title %></a></h2>",
          "<p class=\"job-title\"><% if ((attrs.P).length > 50) { print(attrs.P.substring(0, 50) + '...') } else { print(attrs.P); } %></p>",
          "</div>",
          "<div class=\"meta\">",
          "<% if (attrs.E || attrs.F) { %>",

          "<p class=\"business-unit\"><i class=\"fa fa-building-o\"></i>",

            "",

/*            // loop over comma seperated school strings and turn each into a link
        "<% if (attrs.E) { _.each(attrs.E.split(\",\"), function (school) { school = $.trim(school); %>",

              "<a class=\"filter school\" href=\"#\" data-filter-param=\"E\" data-filter-value=\"<%= school %>\" ",
                "title=\"Find other staff in <%= school %>\" \"><%= school %></a>",

            "<% }); } %>",*/

            // loop over comma seperated department strings and turn each into a link
            "<% if (attrs.F) { _.each(attrs.F.split(\",\"), function (dept) { dept = $.trim(dept); %>",

              // check for empty dept
              "<% if (!dept) return; %>",

              "<a class=\"filter department\" href=\"#\" data-filter-param=\"F\" data-filter-value=\"<%= dept %>\" ",
                "title=\"Find other staff in <%= dept %>\"><%= dept %></a>",

            "<% }); } %>",

          "</p><!--.business-unit-->",

          "<% } %>",

/*          "<% if (attrs.C) { %>",

          "<p class=\"keywords\">",

            "",

            // loop over comma seperated keyword string and turn each into a link
            "<% _.each(attrs.C.split(\",\"), function (keyword) { keyword = $.trim(keyword).substring(0, 60); %>",

              "<a class=\"filter department\" href=\"#\" data-filter-param=\"C\" data-filter-value=\"<%= keyword %>\" ",
                "title=\"Find other staff tagged with <%= keyword %>\" ><i class=\"fa fa-tags\"></i> <%= keyword %></a>",

            "<% }); %>",

          "</p>",

          "<% } %>",*/

        "</div><!-- /.meta -->"
    ].join("\n"),

    // views

    /**
     * The item view is responsible for rendering an individual academic card
     */
    AcademicItemView = M.ItemView.extend({

        tagName: "li",
        className: "academic",

        /**
         * called by ItemView.render
         */
        template: function (modelData) {
            return _.template(academicTemplate, modelData, {variable: "attrs"});
        },

        events: {
            "click .filter": "filterClick"
        },
        /**
         * will route to the search form with filter applied
         */
        filterClick: function (e) {

            var data = $(e.target).data();

            // which filter?
            l(e.target.className + " clicked");

            // route
            APP.router.navigate(
                "search/" + data.filterParam + "/" +
                    encodeURIComponent(data.filterValue)
                    .replace(/%20/g, "+"),
                {trigger: true}
            );

            e.preventDefault();

        }

    }),

    /**
     * The collection view is responsible for rendering the list of academic cards
     */
    AcademicsListView = M.CollectionView.extend({

        // main target div
        el: "#academic-results",

        // the childView class
        itemView: AcademicItemView,

        // flag to help us know if we have done an initial render
        firstRender: true,

        initialize: function () {

            // this needs to bind to the collection pre filtering/fetching
            this.$el.addClass("loading");
            this.$el.empty();
            this.$el.addClass("backbone-ready");

            this.on("render", this.removeSpinners);


        },

        removeSpinners: function () {

            if (this.firstRender) {
                $(".initial-loading-indicator").remove();
                this.firstRender = false;
            }

            this.$el.removeClass("loading");

        }

    }),

    /**
     * facets view
     * handles the switching on / off of the facets and the counters (disabled for profiles)
     */
    FacetsView = B.View.extend({

        el: ".filters",

        facetsFound: null,

        initialize: function () {

            var self = this;

            //self.listenTo(academicsCollection, "reset", self.updateCount);
            self.listenTo(self.collection, "reset", self.updateSelected);

            // need to wait for DOM ready for these
            $(function () {
                self.$filters = self.$el.find(".filter");
                self.facetsFound = self.findFacets();
            });

        },

        /**
         * assumptions: only one active facet at a time
         */
        updateSelected: function () {

            var filterParam, filterValue;

            this.$filters.removeClass("selected");

            if (this.collection.fieldFilterRules && this.collection.fieldFilterRules.length) {

                filterParam = this.collection.fieldFilterRules[0].field;
                filterValue = this.collection.fieldFilterRules[0].value.source; // chrome only??
                this.$filters
                    .filter("[data-filter-param='" + filterParam + "']")
                    .filter("[data-filter-value='" + filterValue + "']")
                    .addClass("selected");

            }

        },

        events: {
            "click .filter": "facetClick"
        },

        facetClick: function (e) {

            var $this = $(e.target),

            newUrl = "search/" + $this.data("filter-param")  + "/" +
                encodeURIComponent($this.data("filter-value"))
                .replace(/%20/g, "+");

            e.preventDefault();

            if ($this.hasClass("selected")) {

                $this.removeClass("selected");
                newUrl = "";

            } else {

                this.$el.find(".filter").removeClass("selected");
                $this.addClass("selected");

            }

            // empty the search box
            APP.views.searchboxView.empty();

            APP.router.navigate(newUrl, {
                trigger: true
            });

        },

        /**
         * returns an array of the params of the filters found on the page
         */
        findFacets: function () {

            var paramsOnPage = [];

            this.$filters.each(function () {
                paramsOnPage.push($(this).data("filter-param"));
            });

            return _.uniq(paramsOnPage);

        }

        /*
         * DISABLED FOR profiles
         *
         * would handle the pagination counter update of the facets
         *
        updateCount: function () {

            var models = this.collection.models;

            _.each(this.$filters, function (filter) {

                var $filter = $(filter);


                // work out how many models fit this filter
                matches = _.filter(models, function (model) {

                    var modelValue = $.trim(model.toJSON().metaData[this.data("filter-param")]),

                    match = modelValue &&
                        modelValue.indexOf(this.data("filter-value")) !== -1;

                    // debug logging

                    if (match) {
                        l("match found on '" + this.data("filter-value") + "'.indexOf('" + modelValue + "') !== -1;");
                    } else {
                        if (modelValue) {
                            l("no match found on '" + this.data("filter-value") + "'.indexOf(" + modelValue + ") !== -1;");
                        }
                    }

                    return match;

                }, $filter);

                $filter.data("number", matches.length);
                $filter.text(
                    $filter.text().replace(/( \([0-9]+\)|$)/, " (" + matches.length + ")")
                );


            });

        }
        */

    }),

    /**
     * Handles the search box input
     */
    SearchboxView = B.View.extend({

        el: "#fb-queryform",

        events: {
            "submit form": "doQuery"
        },

        initialize: function () {

            this.$inputEl = this.$el.find("input");

            //store the size of the input
            this.inputWidth = this.$inputEl.width();

            this.tfView = APP.views.tagFilterView;

        },

        doQuery: function (e) {

            // find out text input
            var searchTerm =  $.trim(this.$inputEl.val());

            e.preventDefault();
            l("search requested for " + searchTerm);

            // validate searchTerm
            if (searchTerm.length === 0) {
                return;
            }

            // remove any tag filters
            APP.views.tagFilterView.removeFilter();

            // route
            APP.router.navigate("search/query/" + searchTerm, {
                trigger: true
            });

        },

        setText: function (text) {
            this.$inputEl.val(text);
        },

        empty: function () {
            this.$inputEl.val("");
        }

    }),

    /**
     * This handles the clickable tag filters
     */
    TagFilterView =  M.ItemView.extend({

        el: ".tag-filters",

        events: {
            "click": function () { this.removeFilter(true); }
        },

        template: function (data) {

            return $("<span />", {
                "class": "tag-filter",
                title: "click to remove this filter",
                html: "tag: " + data.value + "<i class='fa fa-times'></i>"
            });

            /*
            return _.template(
                "<span class='queryfilter'>tag:<%= value %> <i class='fa fa-times'></i></span>",
                data
            );
            */

        },

        // @param route should we reroute after clearing the filter?
        removeFilter: function (route) {

            this.$el.empty();
            this.trigger("render");

            if (route) {

                APP.router.navigate("", {
                    trigger: true
                });

            }

        }

    }),

    /**
     * Responsible for the "x-y of z results" text
     */
    SearchMetaView = M.ItemView.extend({

        el: ".results-summary",

        // catch any of these collection events and update our search meta
        collectionEvents: {
            "sync": "render",
            "reset": "render",
            "sort": "render"
        },

        onRender: function () {
            doLayout();
        },

        template: function (modelData) {

            //APP.collections.academicsCollection.info();
            modelData.info = APP.collections.academicsCollection.information;

            // render with count
            return _.template(
                "<span class='results-totals'><%= info.startRecord %> - <%= info.endRecord %> of <%= info.totalRecords %> results</span>",
                modelData
            );

        }

    }),


    /**
     * Responsible for the "show more" button
     */
    PaginationControlsView = M.ItemView.extend({

        el: ".read-more",

        // catch any of these collection events and update our search meta
        collectionEvents: {
            "sync": "checkIfNeeded",
            "reset": "checkIfNeeded",
            "sort": "checkIfNeeded"
        },

        events: {
            "click .infinite": "showNextPage"
        },

        initialize: function () {

            this.collection.origPerPage = this.collection.paginator_ui.perPage;

        },

        template: function (CollectionData) {

            return _.template(
                "<a class='infinite' href='#'>Show more</a>",
                CollectionData
            );

        },

        checkIfNeeded: function () {

            if (this.collection.information.perPage >
                this.collection.information.totalRecords) {
                this.$el.hide();
            } else {
                this.$el.show();
            }

        },

        /**
         * The basic idea is to increase the amount shown per page (see
         * Paginator.howManyPer)until we have more per page than total
         * results, at which point we hide the button
         *
         */
        showNextPage: function (e) {

            e.preventDefault();

            // shortcut
            var c = this.collection, stats = c.information, newPerPage;

            if (stats.perPage < stats.totalRecords) {

                newPerPage = stats.perPage + c.origPerPage;

                c.howManyPer(newPerPage);

                if (newPerPage >= stats.totalRecords) {
                    this.$el.hide();
                }

            }

        }

    }),

    // router
    MainRouter = B.Router.extend({

        routes: {
            "": "defaultRoute",
            "search/query/:value": "fbSearchRoute",
            "search/:param/:value": "searchRoute"
        },

        initialize: function () {

            // start router only once we have done initial fetch
            // and DOM is ready
            APP.collections.academicsCollection.once("sync", function () {

                l("starting router");
                $(function () {
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
            APP.collections.academicsCollection.fetch({
                success: function () {
                    APP.collections.academicsCollection.pager();
                },
                silent: true
            });

        },

        defaultRoute: function () {

            // clear any filtering
            APP.collections.academicsCollection.setFieldFilter();

            //reset the width of search input el
            APP.views.tagFilterView.removeFilter();

        },

        /**
         * will filter the collection from the url:
         *
         * search/:param/:value
         *
         * where query is the funnelback metadata class
         */
        searchRoute: function (param, value) {

            // replace +s in value
            value = $.trim(value).replace(/\+/g, " ", "gi");

            // search through collection
            APP.collections.academicsCollection.setFieldFilter([{
                field: param,
                type: "pattern",
                value: new RegExp(value)
            }]);

            // if our param does not appear on the page as a facet we
            // want to generate clickable tags in the search box
            if (! _.contains(APP.views.facetsView.facetsFound, param)) {

                APP.views.tagFilterView.model = new B.Model({
                    value: value
                });
                APP.views.tagFilterView.render();

            }

            // and clear out leftover search text
            APP.views.searchboxView.empty();

        },

        /**
         * the /search/query/:value route
         *
         * uses funnelback searching power to fetch matching results and uses
         * those to filter the collection
         *
         * an issue is it requires 2 http requests to funnelback on a page load
         * which is not optimal. The traditional Backbone way of solving this
         * is to bootstrap the initial models. Which in our case would be
         * presenting all results on initial funnelback page load.
         *
         */
        fbSearchRoute: function (value) {

            // search through collection using fb response to query
            APP.collections.academicsCollection.searchFunnelback(
                $.trim(value).replace(/\+/g, " ")
            );

            // update query input text
            APP.views.searchboxView.setText(value);

            //remove tag filters
            APP.views.tagFilterView.removeFilter();

        }

    });

    // start!
    APP.collections.academicsCollection = new AcademicsCollection();
    APP.views.academicsListView = new AcademicsListView({
        collection: APP.collections.academicsCollection
    });
    APP.views.facetsView = new FacetsView({
        collection: APP.collections.academicsCollection
    });
    APP.views.tagFilterView = new TagFilterView();
    APP.views.searchboxView = new SearchboxView();
    APP.views.searchMetaView = new SearchMetaView({
        collection: APP.collections.academicsCollection
    });
    APP.views.paginationControlsView = new PaginationControlsView({
        collection: APP.collections.academicsCollection
    });
    APP.router = new MainRouter();

    // expose for debug
    window.SEARCHAPP = APP;

}(Backbone, Backbone.Marionette));
