(function($) {
    var pageDropdowns = [];
    var closePageDropdowns = function(except) {
        for (var i = 0; i < pageDropdowns.length; i++) {
            pageDropdowns[i].each(function() {
                var pageDropdown = $(this);
                if (!except || except.length != 1 || pageDropdown.get(0) != except.get(0)) {
                    pageDropdown.removeClass("active");
                }
            });
        }
    };

    $("body").click(function() {
        closePageDropdowns(null);
    });

    var init = function(dropdowns, opt) {
        var _opt = $.extend({ changeListeners: [] }, opt);

        pageDropdowns.push(dropdowns);

        dropdowns.each(function() {
            var dropdown = $(this);
            dropdown.data("dropdown-options", _opt);

            dropdown.find("a.display").click(function() {
                dropdown.toggleClass("active");
                closePageDropdowns(dropdown);
                return false;
            });

            if (opt && opt.values) {
                setOptions(dropdown, opt.values);
            }

            if (opt && opt.initialValue) {
                select(dropdown, opt.initialValue);
            }
            initOptions(dropdown);
        });
    };

    var optionValue = function(dropdown, key) {
        var opt = dropdown.data("dropdown-options");
        return opt ? opt[key] : null;
    };

    var invokeOptionExt = function(dropdown, fkey, a, b, c) {
        var f = optionValue(dropdown, fkey);
        if (f) {
            f(a, b, c);
        }
    };

    var initOptions = function(dropdown) {
        var options = dropdown.find(".options > a");
        dropdown.toggleClass("disabled", options.length < 2);
        options.click(function() {
            selectAndNotify(dropdown, $(this).attr("data-value"));
            closePageDropdowns(dropdown);
            return false;
        });
    };

    var fireOnSelect = function(dropdown) {
        var opt = dropdown.data("dropdown-options");
        for (var i = 0; i < opt.changeListeners.length; i++) {
            opt.changeListeners[i]();
        }
    };

    var selectAndNotify = function(dropdown, value) {
        select(dropdown, value);
        fireOnSelect(dropdown);
        invokeOptionExt(dropdown, "onselect", value);
    };

    var select = function(dropdown, value) {
        var link = dropdown.find('a[data-value="' + value + '"]');
        dropdown.find("a.display span").html(link.html());
        link.addClass("selected");
        dropdown.find('a[data-value!="' + value + '"]').removeClass("selected");
        dropdown.removeClass("active");
    };

    var setOptions = function(dropdown, options, selectedKey) {
        var optionsContainer = dropdown.find(".options");
        optionsContainer.empty();
        var selected = null;
        for (var i = 0; i < options.length; i++) {
            var o = options[i];
            var isSelected = o[0] == selectedKey;
            if (isSelected) {
                selected = o;
            }

            $('<a href="#"></a>')
                .attr("data-value", o[0])
                .html(o[1])
                .toggleClass("selected", isSelected)
                .appendTo(optionsContainer);
        }

        if (selected) {
            dropdown.find("a.display span").html(selected[1]);
        }

        initOptions(dropdown);
    };

    var value = function(dropdown) {
        return dropdown.find(".options a.selected").attr("data-value");
    };

    var addChangeListener = function(dropdowns, listener) {
        dropdowns.each(function() {
            var dropdown = $(this);
            var opt = dropdown.data("dropdown-options");
            opt.changeListeners.push(listener);
            dropdown.data("dropdown-options", opt);
        });
    };

    $.fn.cityDropdown = function(opt, p1, p2) {
        if (typeof opt === "string") {
            switch (opt) {
                case "disable":
                    break;
                case "enable":
                    break;
                case "select":
                    select(this, p1);
                    break;
                case "setOptions":
                    setOptions(this, p1, p2);
                    break;
                case "value":
                    return value(this);
                case "change":
                    return addChangeListener(this, p1);
                default:
                    break;
            }
        } else {
            init(this, opt);
        }
        return this;
    };
})(jQuery);

CITY.youtubePreview = (function() {
    var init = function(callback) {
        $(".embed-container[data-video-id]")
            .not("[data-video-id-ready]")
            .each(function() {
                var container = $(this);
                var imgGroup = container.find(".youtube-preview");
                container.attr("data-video-id-ready", 1);

                var videoId = container.attr("data-video-id");
                var src =
                    "https://www.youtube.com/embed/" + videoId + "?rel=0&autoplay=1&enablejsapi=1&wmode=transparent";
                var iframeId = container.attr("data-video-iframe-id");

                imgGroup.click(function() {
                    $("<iframe></iframe>")
                        .attr("id", iframeId)
                        .attr("src", src)
                        .attr("frameborder", 0)
                        .attr("allowfullscreen", 1)
                        .appendTo(container);
                    if (callback) {
                        callback();
                    }
                });
            });
    };

    return {
        init: init
    };
})();

CITY.tileLayout = (function() {
    var isPreview = typeof tileLayoutPreview !== "undefined";

    var pageLoadListeners = [];

    var wrapper = $(".tile-wrapper .tile-listing");
    var loadMoreButton = $(".tile-wrapper .read-more");
    var isIE7 = $("html").hasClass("lt-ie8");

    var resultsPerPage = 12;
    var currentFilter = null;
    var currentPage = -1;
    var busy = false;

    var inBootstrapMD = function() {
        var el = $("<div></div>");
        el.appendTo($("body"));

        el.addClass("hidden-md hidden-lg"); // (768px - 991px) + (992px+)
        var md = el.is(":hidden");
        el.remove();
        return md;
    };

    var resultData = function(data) {
        var results = [];
        var md = function(item, key) {
            return item && item.metaData && item.metaData.hasOwnProperty(key) ? item.metaData[key] : null;
        };

        if (data && data.response && data.response.resultPacket && data.response.resultPacket.results) {
            var a = data.response.resultPacket.results;
            for (var i = 0; i < a.length; i++) {
                var item = a[i];
                results.push({
                    id: md(item, "i"),
                    type: md(item, "X"),
                    heading: md(item, "H"),
                    resource: md(item, "R"),
                    resource2: md(item, "P"),
                    date: md(item, "D"),
                    title: md(item, "T"),
                    content: md(item, "C"),
                    link: md(item, "L"),
                    linklabel: md(item, "M"),
                    username: md(item, "U"),
                    userhandle: md(item, "W"),
                    live: md(item, "A") === "yes"
                });
            }
        }
        return results;
    };

    var processResults = (function() {
        var mainTmpl =
            '<div class="col-md-12 tile tile-type-{{type}} {{^live}}tile-preview{{/live}}" data-tile-id="{{id}}"><div class="tile-canvas"><div class="tile-content">{{> content}}</div></div></div>';
        Mustache.parse(mainTmpl);
        var templates = {};

        $("[id^='tmpl-tile-type-']").each(function() {
            var t = $(this).html();
            Mustache.parse(t);
            templates[
                $(this)
                    .attr("id")
                    .substr(15)
            ] = t;
        });

        return function(data) {
            var results = resultData(data);

            var output = "";
            for (var i = 0; i < results.length; i++) {
                var item = results[i];
                if (templates.hasOwnProperty(item.type)) {
                    output += Mustache.render(mainTmpl, item, { content: templates[item.type] });
                }
            }
            return output;
        };
    })();

    var fireReloadEvent = function() {
        for (var i = 0; i < pageLoadListeners.length; i++) {
            pageLoadListeners[i]();
        }
    };

    var query = function(nextPage) {
        if (!busy) {
            busy = true;
            var page = nextPage ? currentPage + 1 : 0;

            var params = {
                collection: "start-here-cards",
                sort: "metaS",
                z: new Date().getTime(),
                start_rank: 1 + page * resultsPerPage,
                num_ranks: resultsPerPage,
                meta_A_orsand: ""
            };

            if (isPreview) {
                params["preview"] = "yes";
            }

            if (currentFilter) {
                for (var key in currentFilter) {
                    if (currentFilter.hasOwnProperty(key)) {
                        params["meta_" + key + "_orsand"] = '"' + currentFilter[key] + '"';
                    }
                }
            }

            var url = "https://www.city.ac.uk/api/search.json";
            $.get(url, params)
                .done(function(data) {
                    var html = processResults(data);
                    if (nextPage) {
                        wrapper.append(html);
                        loadMoreButton.toggle(html.length > 0);
                    } else {
                        wrapper.html(html);
                        loadMoreButton.show();
                    }

                    CITY.youtubePreview.init(fireReloadEvent);

                    currentPage = page;

                    var order = 0;
                    wrapper.find(".tile").each(function() {
                        var tile = $(this);
                        var o = tile.attr("data-tile-order");
                        if (typeof o === typeof undefined || o === false) {
                            tile.attr("data-tile-order", order);
                        }

                        order++;
                    });

                    fireReloadEvent();
                })
                .always(function() {
                    busy = false;
                });
        }
    };

    var initTileLoader = function() {
        $(".read-more").click(function() {
            query(true);
            return false;
        });
    };

    var initYouTube = function() {
        if (!isIE7) {
            var players = {};
            var registerVideos = function() {
                players = {};
                $(".tile-type-youtube iframe").each(function() {
                    var iframe = $(this);
                    var id = iframe.attr("id");

                    players[id] = new YT.Player(this, {
                        events: {
                            onStateChange: function(event) {
                                if (event.data === YT.PlayerState.PLAYING) {
                                    videoPlayed(id, iframe, true);
                                } else if (
                                    event.data === YT.PlayerState.PAUSED ||
                                    event.data === YT.PlayerState.ENDED
                                ) {
                                    videoPlayed(id, iframe, false);
                                }
                            }
                        }
                    });
                });
            };

            var videoPlayed = function(id, iframe, on) {
                var iframeTile = iframe.closest(".tile");
                var iframeTileId = iframeTile.attr("data-tile-id");

                if (inBootstrapMD()) {
                    iframeTile.toggleClass("col-md-24", on).toggleClass("col-md-12", !on);

                    if (on) {
                        var iframeTileFound = false;
                        var atLeft = true;
                        var previous = null;
                        var moveToSpot = null;

                        wrapper.find(".tile").each(function() {
                            var tile = $(this);
                            if (tile.attr("data-tile-id") === iframeTileId) {
                                iframeTileFound = true;
                                moveToSpot = iframeTile;
                                return previous != null; // nothing will be done if previous is null (meaning none or wide tile)
                            } else if (!iframeTileFound) {
                                if (tile.hasClass("col-md-12")) {
                                    atLeft = !atLeft;
                                    previous = tile;
                                } else {
                                    previous = null; // if tile is expanded, we will not move it anyway
                                }
                                return true;
                            } else {
                                if (tile.hasClass("col-md-24")) {
                                    moveToSpot = tile; // if tiles after iframeTile are 24 columns wide, previous tile will be moved after them;
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                        });

                        if (!atLeft && previous) {
                            // in the right column and previous is 12 columns wide
                            previous.insertAfter(moveToSpot);
                        }
                    } else {
                        var iframeTileOrder = iframeTile.attr("data-tile-order");
                        for (var i = 0; i < iframeTileOrder; i++) {
                            var selector = '[data-tile-order="' + i + '"]';
                            var isAfter = iframeTile.nextAll(selector).length !== 0;
                            if (isAfter) {
                                wrapper.find(selector).insertBefore(iframeTile);
                            }
                        }
                    }
                }
            };

            pageLoadListeners.push(registerVideos);
            registerVideos();
        }
    };

    var initContainer = function() {
        if (!isIE7) {
            wrapper.html("");
        }
        wrapper.removeClass("static");
    };

    var init = function() {
        initContainer();
        if (!isIE7) {
            initTileLoader();
        }
    };

    var filter = function(params) {
        currentFilter = params;
        query(false);
    };

    return {
        init: init,
        initYouTube: initYouTube,
        filter: filter,
        isIE7: isIE7
    };
})();

CITY.tileLayout.init();

CITY.starthere = (function(tileLayout) {
    var resetLink = $(".filter-reset a");

    var hierarchy = {
        All: [["All", "All subjects"]],
        "Cass Business School": [
            ["All", "All subjects"],
            ["Accounting and Finance", "Accounting and Finance"],
            ["Actuarial Science", "Actuarial Science"],
            ["Business and Management", "Business and Management"],
            ["Finances", "Finance"]
        ],
        "School of Arts & Social Sciences": [
            ["All", "All subjects"],
            ["Cultural and Creative Industries", "Cultural and Creative Industries"],
            ["Economics", "Economics"],
            ["International Politics", "International Politics"],
            ["Journalism", "Journalism"],
            ["Music", "Music"],
            ["Psychology", "Psychology"],
            ["Sociology and Criminology", "Sociology and Criminology"]
        ],
        "School of Health Sciences": [
            ["All", "All subjects"],
            ["Nursing", "Nursing"],
            ["Midwifery", "Midwifery"],
            ["Optometry", "Optometry"],
            ["Radiography", "Radiography"],
            ["Speech and Language Communication Sciences", "Speech and Language Communication Sciences"]
        ],
        "The City Law School": [["All", "All subjects"]],
        "School of Mathematics, Computer Science & Engineering": [
            ["All", "All subjects"],
            ["Computing", "Computing"],
            ["Mathematics", "Mathematics"],
            ["Civil Engineering", "Civil Engineering"],
            ["Mechanical Engineering and Aeronautics", "Mechanical Engineering and Aeronautics"],
            ["Electrical and Electronic Engineering", "Electrical and Electronic Engineering"]
        ]
    };

    var school = $("#dropdown-school");
    var subject = $("#dropdown-subject");

    var filterChanged = function() {
        var params = {
            E: school.cityDropdown("value") || "All",
            F: subject.cityDropdown("value") || "All"
        };

        updateAndSave(params);
    };

    var values = function() {
        return {
            school: school.cityDropdown("value") || "All",
            subject: subject.cityDropdown("value") || "All"
        };
    };

    var updateAndSave = function(params) {
        if (localStorage && JSON) {
            localStorage.setItem("start-here-filter", JSON.stringify(params));
        }

        update(params);
    };

    var update = function(params) {
        var resetDisabled = !params || params.E === "All";
        resetLink.toggleClass("disabled", resetDisabled);
        tileLayout.filter(params);
    };

    var init = function() {
        if (!tileLayout.isIE7) {
            if (localStorage && JSON) {
                var params = JSON.parse(localStorage.getItem("start-here-filter"));
            }

            school.cityDropdown({
                initialValue: params ? params.E : null,
                onselect: function(value) {
                    subject.cityDropdown("setOptions", hierarchy[value], "All");
                    filterChanged();
                }
            });

            subject.cityDropdown({
                values: params && params.E in hierarchy ? hierarchy[params.E] : null,
                initialValue: params && params.E in hierarchy && params ? params.F : null,
                onselect: filterChanged
            });

            resetLink.click(function() {
                school.cityDropdown("select", "All");
                subject.cityDropdown("setOptions", hierarchy["All"], "All");
                updateAndSave({ E: "All", F: "All" });
                return false;
            });

            update(params);
        }
    };

    return {
        init: init,
        values: values
    };
})(CITY.tileLayout);

CITY.starthere.init();

function onYouTubeIframeAPIReady() {
    CITY.tileLayout.initYouTube();
}
