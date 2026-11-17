CITY.profiles = (function () {
    var fbCollection = "profiles",
        fbForm = "profiles",
        $contentWrapper = $("#content"),
        $displayFilters,
        $subfamilyChoice = $(".subfamily-choice"),
        $fbProfilesWwrapperResultsOl = $("#fb-profiles-wrapper #results-wrapper ol"),
        hashString,
        hashStringDeparam,
        familyType = $("#fb-profiles-wrapper").attr("data-family"),
        metaCList,
        removeFilter = function () {
            //update the hash when filters are used
            $contentWrapper.on(
                "click",
                ".display-filters a",
                function (e) {
                    $.bbq.removeState($(this).parent("li").attr("data-filter").split("=")[0]);
                    //prevent the a link from working and removing the entire hash
                    e.preventDefault();
                }
            );
        },
        hashChanged = function (event) {
            /**
             * ajax call to funnelback
             * @param {event} bbq augmented event object, not passed on page load
             * @return undefined
            */
            $fbProfilesWwrapperResultsOl.addClass("js-load-hide").append($('<i class="fa fa-refresh fa-spin loading-fa-icon"></i>'));
            hashString = $.param.fragment();
            hashStringDeparam = $.deparam(hashString);

            if (hashString === "" && event === undefined) {
                //case where page is loaded and the hash is empty
                $fbProfilesWwrapperResultsOl.hide().fadeIn(800).removeClass("js-load-hide").children('.loading-fa-icon').remove();
            }
            else {
                //cases: hash empty and not page load, hash not empty and page load, hash not empty and not page load
                //ajax call to funnelback. call returns the filtered profiles, the callback function removes the current profiles and replaces them with result from the call
                $.ajax({
                    url: "/api/search.html?" + hashString + "&collection=" + fbCollection + "&form=" + fbForm + "&meta_B_orsand=" + familyType + "&simpleResults=true&sort=metaK&bustCache=" + Math.random(),
                    success: function (data) {

                        //replace the current list of results with the results from the ajax call
                        $fbProfilesWwrapperResultsOl.empty().append(data).hide().fadeIn(800).removeClass("js-load-hide");

                        //remove all sub filters
                        $displayFilters.find("li").remove();
                        $.each(hashStringDeparam, function (key, value) {
                            //check if this is the family parameter or not
                            if (key === "meta_C_orsand") {
                                //turn the value of meta_C into an array and loop over it
                                metaCList = value.replace("[", "").replace(/"/g, "").replace("]", "").split(",");
                                $.each(metaCList, function (index, value) {
                                    $subfamilyChoice.find("li a[class=\"" + value.replace(/ /g, "-") + "\"]").addClass("active").append("<span class=\"remove-filter\"><i class=\"fa fa-times\"><\/i><span class=\"visuallyhidden\">remove filter<\/span><\/span>");
                                    //highlight the selected filter everywhere on the page. This needs to be done here, as it needs to happen after the new profiles have been added to the page
                                    $fbProfilesWwrapperResultsOl.find(".subfamily a[data-filter=\"meta_C_orsand=['" + value + "']\"]").addClass("active").append("<span class=\"remove-filter\"><i class=\"fa fa-times\"></i><span class=\"visuallyhidden\" remove filter<\/span><\/span>");
                                });
                            }
                            else {
                                $displayFilters.append("<li data-filter=" + key + "><a href=\"#\">" + value.replace(/"/g,"") + "<span class=\"remove-filter\"><i class=\"fa fa-times\"><\/i><span class=\"visuallyhidden\">remove filter<\/span><\/span><\/a><\/li>");
                                //highlight the selected filters everywhere on the page
                                $fbProfilesWwrapperResultsOl.find(".tag-list a[data-filter=\"" + key + "=" + value + "\"]").addClass("active").append("<span class=\"remove-filter\"><i class=\"fa fa-times\"></i><span class=\"visuallyhidden\" remove filter<\/span><\/span>");
                            }
                        });
                    }
                });
            }
        },

        updateHash = function () {
            /**
             * grab all filter links, hijack click event, update url hash and call updateFilter (if we\'re using non sub-family filters)
             * specify \'a\' tags inside the \'on\' function to allow delegation of the click event
             * @param
             * @return false
            */
            $contentWrapper.on(
                "click",
                ".tag-list a, .subfamily-choice a",
                function (e) {

                    var el = $(this),
                        metaChash = $.deparam.fragment(),
                        queryStringArray = [],
                        newMetaCParam,
                        filterQueryAttribute,
                        filterQueryAttrValue,
                        filterQuery,
                        query;

                    if (el.parents("ul:eq(0)").hasClass("tag-list")) {

                        // we've just clicked a tag / filter in a user profile (under the .tag-list ul)
                        filterQuery = el.attr("data-filter");
                        filterQueryAttribute = filterQuery.split("=")[0];
                        filterQueryAttrValue = filterQuery.split("=")[1];

                        // check if the filter has already been used. If it has, remove it from the hash, else, add it to the hash
                        if (el.hasClass("active")) {
                            if (el.parent("li").hasClass("subfamily")) {
                                // this the subfamily filter
                                query = el.attr("data-family-filter");
                                queryStringArray = metaChash.meta_C_orsand.replace("[", "").replace("]", "").split(",");
                                queryStringArray.splice($.inArray("\"" + query + "\"", queryStringArray), 1).join(",");
                                newMetaCParam = "meta_C_orsand=[" + queryStringArray + "]";
                                $.bbq.pushState(newMetaCParam);
                                $subfamilyChoice.find("a." + query).removeClass("active").find(".remove-filter").remove();

                            }
                            else {
                                // this any other type of filter
                                $.bbq.removeState(filterQuery.split("=")[0]);
                            }
                            el.removeClass("active").find(".remove-filter").remove();
                        }
                        else {
                            $.bbq.pushState(filterQuery);
                        }
                    }

                    else {

                        //we've just clicked a subfamily filter (under the .subfamily-choice ul)
                        query = el.attr("data-family-filter");
                        //check if the filter clicked has already been used. If it has, remove it from the hash, else, add it to the hash
                        if (el.hasClass("active")) {

                            //remove the clicked filter from the hash and only this filter
                            queryStringArray = metaChash.meta_C_orsand.replace("[","").replace("]","").split(",");
                            queryStringArray.splice($.inArray("\"" + query + "\"", queryStringArray), 1).join(",");
                            el.removeClass("active").find(".remove-filter").remove();
                            if (queryStringArray.length === 0) {
                                newMetaCParam = "meta_C_orsand=";
                            }
                            else {
                                newMetaCParam = "meta_C_orsand=[" + queryStringArray + "]";
                            }
                        }
                        //add the clicked filter to the hash, but do not touch the other filters
                        else {
                            //check if the parameter is empty of not
                            if (metaChash.meta_C_orsand === undefined || metaChash.meta_C_orsand.replace("[","").replace("]","").split(",")[0] === ""){
                                queryStringArray = "\"" + query + "\"";
                            }
                            //else add the filter to the existing list of filters
                            else {
                                queryStringArray = metaChash.meta_C_orsand.replace("[","").replace("]","").split(",");
                                queryStringArray.push("\"" + query + "\"");
                                queryStringArray.join(",");
                            }
                            newMetaCParam = "meta_C_orsand=[" + queryStringArray + "]";
                        }
                        $.bbq.pushState(newMetaCParam);
                    }
                    e.preventDefault();
                }
            );

        }; //end var declaration

    //create the list of filters ul
    $("#results-wrapper").before("<ul class=\"display-filters\"><\/ul>");
    $displayFilters = $(".display-filters");
    //call hashChanged here to make sure
    //attach click events to filters
    updateHash();
    hashChanged();
    //call remove filters watch. can we move this elsewhere??
    removeFilter();
    // watch the hash and call hasChanged when it is modified
    $(window).on("hashchange", function (event) {
        hashChanged(event);
    });

}(CITY.debug));
