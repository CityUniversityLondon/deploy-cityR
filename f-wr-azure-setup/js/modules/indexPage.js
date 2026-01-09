//indexPage.js
//set up a holder module

CITY.indexPage = (function (CITY, $) {

    var init = function () {

        var
            pageBody = $('html, body'),
            //index search form
            indexForm = $('.index-form'),
            //query input
            indexQuery = $('#index-query', indexForm),
            //results Wrapper
            resultsWrapper = $('#results-wrapper'),
            //results list
            results = resultsWrapper.find('#results'),
            //current query and active filters wrapper
            currentQuery = $('#current-query'),
            activeFilters = $('#active-filters'),
            filteredBy = $('#filtered-by'),
            reloadLink = $('#reload'),
            loader = $('<span/>', {
                'class': 'loader',
                id: 'course-loader',
                text: 'loading...'
            }),
            totalMatching = null,
            noResults = $('<li/>', {
                'class': 'no-results hidden',
                html: '<p>Sorry, your search has resulted in 0 matches. Try selecting fewer filters or <a href="" id="reload">Start Again<span>Refresh Page</span></a>'
            }),
            formsCallback,
            formType = indexForm.attr("id").replace('-form', ''),
            collection = indexForm.find("#collection").val(),
            query = null;


        /**
         * find all checked inputs, adds active filter and attaches click event
         * to active filter to uncheck input and resubmit form
         */
        function checkFilters() {

            indexForm.find(":radio:checked").add(":checkbox:checked", indexForm).not("#all-dates").not(".hidden").each(function () {

                var self = $(this),
                    label = self.parent().text(),
                    activeFilter;

                activeFilter = $('<li class="active-filter"></li>').html('<a href="#" title="remove this filter">' + label + '<span class="close">remove</span></a>').click(function (e) {

                    //removed tick from clicked activeFilter
                    self.attr('checked', false);
                    indexForm.submit();
                    return false;
                });

                activeFilter.appendTo(activeFilters);

            });
        }

        //for parsing events xml
        function eventsResponse(responseText) {

            var title, summary, category, url, duration, iCal, time, day, dayNo, month, year, school, audience, resultsItems = '', node;

            responseText.find("result").each(function () {

                node = $(this);
                title = node.find("title").text();
                iCal = node.find("md[f='B']").text();
                summary = node.find("md[f='c']").text();
                category = node.find("md[f='y']").text();
                url = node.find("live_url").text();
                time = node.find("md[f='J']").text();
                day = node.find("md[f='K']").text();
                dayNo = node.find("md[f='G']").text();
                month = node.find("md[f='H']").text();
                year = node.find("md[f='I']").text();
                school = node.find("md[f='E']").text();
                audience = node.find("md[f='M']").text();
                duration = node.find("md[f='N']").text();

                if (duration === '1' || duration === '0') {
                    duration = '';
                } else {
                    duration = '<span class="duration">' + duration + ' days</span>';
                }

                resultsItems += '<li class="vevent event"><div class="date"><p class="date-month"><abbr class="dtstart" title="' + iCal + '">' + month + ' ' + year + '</abbr></p><p class="date-day-no">' + dayNo + '</p><p class="date-day">' + day + '</p>' + duration + '</div><div class="event-details"><h2><a href="' + url + '" title="' + title + '" class="summary">' + title + '</a></h2><p class="time">' + time + '</p><p class="category">Category: ' + category + '</p><p class="audience">Open to: ' + audience + '</p><p class="event-summary">' + summary + '</p></div></li>';

            });//format results

            //append to results list
            results.html(resultsItems);

        }//end eventsResponse


        //for parsing news xml
        function newsResponse(responseText) {

            var title, summary, category, url, imgUrl, imgTag, pubDate, school, resultsItems = '', node;

            responseText.find("result").each(function () {

                node = $(this);
                title = node.find("title").text();
                if (node.find("md[f='c']").text().length === 0) {
                    summary = '';
                } else {
                    summary = node.find("md[f='c']").text();
                }

                category = node.find("md[f='y']").text();
                url = node.find("live_url").text();
                pubDate = node.find("md[f='d']").text();
                school = node.find("md[f='E']").text();
                imgUrl = node.find("md[f='G']").text();

                if (imgUrl.length === 0) {
                    imgTag = '';
                } else {
                    imgTag = '<img src="' + imgUrl + '"/>';
                }

                resultsItems += '<li class="article">' + imgTag + '<h2><a href="' + url + '" title="' + title + '" class="summary">' + title + '</a></h2><p>' + summary + '</p><p class="pub-date">' + pubDate + '</p></li>';

            });//end parsing loop

            //append to results list
            results.html(resultsItems);

        }//end eventsResponse

        // pre-submit callback
        function showRequest(formData, jqForm, options) {
            // formData is an array; here we use $.param to convert it to a string to display it
            // but the form plugin does this for you automatically when it submits the data

            var newElement, queryString;

            queryString = $.param(formData);
              //if no query passed, remove query from formData object, add landing=true to formData object

            if (!indexQuery.val()) {
                newElement = formData.length;
                formData[0] = {name: "", value: ""};
                formData[newElement] = {name: "landing", value: "true"};
            }

            // jqForm is a jQuery object encapsulating the form element.  To access the
            // DOM element for the form do this:
            // var formElement = jqForm[0];

            //alert('About to submit: \n\n' + queryString);
            //CITY.debug('About to submit: \n\n' + queryString);

            //results.addClass('loading');
            resultsWrapper.addClass('loading').prepend(loader);
            activeFilters.empty('slow');
            currentQuery.addClass('loading');

            //scroll back to top of page
            pageBody.animate({scrollTop: 0}, 'slow');

            //find all checked inputs
            checkFilters();

            //are there any active filters?
            if (activeFilters.children().length >= 1) {
                filteredBy.show();
            } else {
                filteredBy.hide();
            }

            // here we could return false to prevent the form from being submitted;
            // returning anything other than false will allow the form submit to continue
            return true;
        }

        // post-submit callback
        function showResponse(responseText, statusText, xhr, $form) {
            // for normal html responses, the first argument to the success callback
            // is the XMLHttpRequest object's responseText property

            // if the ajaxForm method was passed an Options Object with the dataType
            // property set to 'xml' then the first argument to the success callback
            // is the XMLHttpRequest object's responseXML property

            // if the ajaxForm method was passed an Options Object with the dataType
            // property set to 'json' then the first argument to the success callback
            // is the json data object returned by the server

            //CITY.debug('status: ' + statusText + '\n\nresponseText: \n' + responseText);
            //empty results list

            //results.removeClass('loading');
            resultsWrapper.removeClass('loading');

            results.empty();
            //remove loader span from DOM
            loader.remove();
            //reinstate query attr
            indexQuery.attr("name", "query");

            $(responseText).find("total_matching").each(function () {
                totalMatching = $(this).text();
            });

            //find current query
            if (indexQuery.val().length !== 0) {
                query = indexQuery.val();
            } else {
                query = "All " + formType;
            }

            //no results?
            if ($(responseText).find("result").length === 0) {
                currentQuery.html('No results found for: <strong>' + query + '</strong>');
                noResults.addClass("visible").removeClass("hidden");
                results.append(noResults);
                return;
            }

            //call appropriate response handler
            if (formType === 'events' || formType === 'concerts' || formType === 'careers') {
                eventsResponse($(responseText));
            } else if (formType === 'news') {
                newsResponse($(responseText));
            } else {
                CITY.debug("form type not defined");
            }

            //show results info
            currentQuery.removeClass('loading').html(totalMatching + ' results found for: <strong>' + query + '</strong>');

        } //showResponse

        //handle form submission
        formsCallback = function () {

            var options = {
                beforeSubmit:  showRequest,  // pre-submit callback
                success:       showResponse,  // post-submit callback
                dataType:  'xml',        // 'xml', 'script', or 'json' (expected server response type)
                clearForm: false,       // clear all form fields after successful submit
                resetForm: false,        // reset the form after successful submit
                url: '//www.city.ac.uk/api/search.xml?'
            };

            //this is in here to stop form submission before page is ready

            //attach submit event to all input field except text on click
            indexForm.find('input:checkbox, input:radio').click(function (e) {
                indexForm.submit();
            });

            //initalise form
            indexForm.ajaxForm(options);

        };//end formsCallback

        //begin

        //bail here if not on an index page
        if (indexForm.length === 0) {
            return;
        }

        //reload page if "start again" clicked
        reloadLink.live('click', function () {
            location.reload();
        });

        //click anywhere on event
        $('li', results).live('click', function () {
            window.location = $(this).find("a").attr("href");
            return false;
        });

        //clear checkboxes on page load
        indexForm.find("input").attr("autocomplete", "off");

        //remove submit buttons from filter
        $('.apply-filter', indexForm).remove();

        //secondary accordiion stuff
        indexForm.find('.secondary-filters').hide().after($('<a href="#" class="reveal">Show All...</a>'));

        $('.reveal').live('click', function (e) {

            var clicked = $(e.target), previous = $(e.target).prev();

            if (clicked.hasClass('active')) {
                clicked.removeClass('active').text("Show More...");
                previous.hide();
            } else {
                clicked.addClass('active').text("Show Fewer...");
                previous.show("slow");
            }

            return false;

        });

        //find all checked inputs
        checkFilters();

        //init filters bar
        CITY.initMultiAccordion('h3', indexForm, 1);

        //load JqueryForms
        yepnope({
            load: 'lib/jquery/plugins/jquery.form.js',
            callback: formsCallback
        })

        CITY.searchAutoComplete(indexForm, indexQuery, collection);

    },

        returnObj = {
            init: init
        };

    return returnObj;

}(CITY, jQuery));

//run this
CITY.indexPage.init();
