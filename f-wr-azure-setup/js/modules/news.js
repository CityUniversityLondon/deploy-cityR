$(function () {

    // src/js/main/funcs/image-creditation.js
    var imageCreditation = CITY.imageCreditation;
    // src/js/main/funcs/custom-ajax.js
    var customAJAX = CITY.customAJAX;

    var form = $("#news-filters");
    var inputs = form.find(":input");
    var contentWrapper = $(".news-card-wrapper");
    var listType = contentWrapper.attr("data-list-type");

    var perPage = null;
    var startRank = null;
    var month = null;
    var year = null;

    var formType = "news-cards";
    var authorID = null;
    var formMediaType = null;

    if (listType == "press-officer") {
        formType = "news-cards-scoped";
        authorID = $(".news-author-info").attr("data-author-id");
    }
    if (listType == "spotlight-on-research") {
        formMediaType = "spotlight-on-research";
    }

    var fixedParams = {
        collection: 'news-city',
        form: formType,
        pagination: true,
        sort: 'date',
        searchterm: true,
        meta_J_orsand: authorID,
        meta_k_orsand: formMediaType
    };

    var hasStaticFilters = form.hasClass('news-filters-static');

    var reload = function (goToFirstPage) {
        var params = $.extend({t: new Date().getTime()}, fixedParams);

        if (goToFirstPage) {
            startRank = 1;
        }

        if (perPage !== null) {
            params['num_ranks'] = perPage;
        }
        if (startRank !== null) {
            params['start_rank'] = startRank;
        }
        if (month !== null) {
            params['meta_m_orsand'] = month;
        }
        if (year !== null) {
            params['meta_M_orsand'] = year;
        }

        inputs.each(function () {
            var input = $(this);
            var name = input.attr('name');
            var value = input.val();

            if (name && name.length > 0 && value && value.length > 0) {
                params[name] = value;
            }
        });

        customAJAX('//www.city.ac.uk/api/search.html', params)
            .done(function (data) {
                contentWrapper.html(data);
                // Re-initalise pagination for the new content
                initPagination();
                // Re-initalise Image Creditations for the new content
                imageCreditation();
                $("html, body").scrollTop($('#content').offset().top);
            });
    };

    var init = function () {
        var options = hasStaticFilters ? {
            isMenu: true
        } : {
            'onselect': function () {
                reload(true);
            }
        };

        $('.news-filters__select').change(function () {
            if (hasStaticFilters) {
                form.submit();
            } else {
                reload(true);
            }
        });

        form.find('.dropdown-select').cityDropdown(options);

        if (!hasStaticFilters) {
            form.find('button').click(function () {
                reload(true);
                return false;
            });
        }

        initPagination();
        initSeriesLinks();
    };

    var initPagination = function () {
        var pagination = $('.pagination');
        perPage = pagination.attr('data-per-page');
        startRank = pagination.attr('data-start-rank');
        month = pagination.attr('data-month');
        year = pagination.attr('data-year');

        pagination.find('a').click(function () {
            startRank = $(this).attr('data-start-rank');
            reload();
            return false;
        });
    };

    var initSeriesLinks = function () {
        var seriesPrefix = 'https://www.city.ac.uk/news/search?meta_i_orsand=',
            seriesName,
            tagsPrefix = 'https://www.city.ac.uk/news/search?all=1&meta_l_orsand=',
            tagsSuffix = '',
            tagsName;
        $('.news-article-series-family').each(function () {
            seriesName = $(this).text().toLowerCase().replace(' ', '-').replace('&', 'and');
            $(this).attr('href', seriesPrefix + seriesName)
        });
        $('.news-article-tag').each(function () {
            tagsName = encodeURIComponent($(this).text());
            $(this).attr('href', tagsPrefix + tagsName + tagsSuffix)
        });
    };

    init();
});
