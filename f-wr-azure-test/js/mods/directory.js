var Mustache = require("mustache"),
    defer = require("./utils/defer"),
    $moreButton = $(".load-more"),
    query = $moreButton.attr("data-query"),
    perPage = $moreButton.attr("data-per-page"),
    $userList = $(".directory-users"),
    ajaxUrl = "https://www.city.ac.uk/api/search.html",
    $resultMsgDisplayed = $(".directory-results-msg__displayed"),
    startRank,
    ajaxCall = function () {
        startRank = $moreButton.attr("data-start-rank");
        $.ajax({
            "url": ajaxUrl,
            "dataType": "json",
            "data": {
                "collection": "user-directory",
                "form": "json",
                "sort": "metaf",
                "start_rank": startRank,
                "num_ranks": perPage,
                "query": "*" + query + "*"
            },
            "success": function (data) {
                templateData(data);
            }
        }); // end $.ajax
    },
    templateData = function (results) {
        var template =
            "{{#users}}<li class=\"directory-user directory-user--loading\" itemscope itemtype=\"http:\/\/schema.org\/Person\">" +
                "<h4 class=\"directory-user__name\" itemprop=\"name\">{{{title}}} {{{firstName}}} {{{lastName}}}<\/h4>" +
                "<div class=\"row\">" +
                    "<div class=\"col-xs-24 col-md-8\">" +
                        "{{#job}}<span class=\"directory-user__info directory-user__info--job\" itemprop=\"jobTitle\">{{{job}}}<\/span>{{/job}}" +
                    "<\/div>" +
                    "<div class=\"col-xs-24 col-md-8\">" +
                        "{{#tel}}<span class=\"directory-user__info directory-user__info--tel\" itemprop=\"telephone\"><i class=\"fa fa-phone\"></i><a href=\"tel:0044(0)207040{{tel}}\">+44(0) 207 040 {{tel}}<\/a><\/span>{{/tel}}" +
                        "{{#email}}<span class=\"directory-user__info directory-user__info--email\" itemprop=\"email\"><i class=\"fa fa-envelope-o\"></i><a href=\"mailto:{{{email}}}\">{{{email}}}<\/a><\/span>{{/email}}" +
                    "<\/div>" +
                    "<div class=\"col-xs-24 col-md-8\">" +
                        "{{#room}}<span class=\"directory-user__info directory-user__info--room\"><i class=\"fa fa-map-marker\"></i>{{{room}}}<\/span>{{/room}}" +
                        "{{#dep}}<span class=\"directory-user__info directory-user__info--department\"><i class=\"fa fa-building-o\"></i>{{{dep}}}<\/span>{{/dep}}" +
                    "<\/div>" +
                "<\/div>" +
            "<\/li>{{/users}}";
            numberResults = results.total,
            resultsPerPage = results.resultsPerPage,
            numberResultsCut = numberResults < resultsPerPage ? numberResults : resultsPerPage,
            currentEnd = results.currEnd,
            totalDisplay = currentEnd + resultsPerPage,
            renderHTML = "",
            newPath = "";

        if (numberResults !== 0) {

            renderHTML = Mustache.render(template, results);

        }

        appendData(renderHTML, currentEnd, numberResults);


        // need to check if history api is supported here
        // if we're doing the below, we need to make sure that on hash change, the list updates accordingly, otherwise, useless
        //newPath = document.location.origin + document.location.pathname + "?query=" + query + "&start_rank=" + startRank;
        //history.pushState({"start_rank": startRank}, "", newPath);


    },
    appendData = function (htmlToAdd, currentEnd) {

        $userList.children('.loading-fa-icon').remove();
        $userList.append(htmlToAdd);

        // update button data attributes
        $moreButton.attr("data-start-rank", (parseInt(startRank) + 10));

        // update the counter of results at top
        $resultMsgDisplayed.html(currentEnd);

        // disable load more button if not needed
        if (currentEnd === numberResults) {
            $moreButton.remove();
        }

    },
    init = function () {
        $moreButton.on("click", function (event) {
            event.preventDefault();
            $userList.append($('<i class="fa fa-refresh fa-spin loading-fa-icon"></i>'));
            ajaxCall();
        });
    };

defer(init);
