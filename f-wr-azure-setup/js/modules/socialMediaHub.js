socialMediaHub = function() {

    /************************
    * Define template parts *
    ************************/
    var heading_part =
    "<div class='item-heading'>{{fullName}}</div>";

    var image_part =
    "{{#image}}" +
        "<div class='item-media item-media-image'>" +
            "<img class='static' src='{{image}}'>" +
        "</div>" +
    "{{/image}}";

    var video_part =
    "{{#video}}" +
        "<div class='item-media item-media-video embed-container' data-video-iframe-id='youtube-{{video}}' data-video-id='{{video}}'>" +
            "<div class='youtube-preview'>" +
                "<img class='preview' src='{{image}}'>" +
                "<div class='play-button'></div>" +
            "</div>" +
        "</div>" +
    "{{/video}}";

    var text_part =
    "<div class='item-text'>{{{linkedText}}}</div>";

    var footer_part =
    "<div class='item-footer'>" +
        "<a class='screen-name' href='{{account}}'>" +
            "<span class='footer-{{type}}'>{{screenName}}</span>" +
        "</a>" +
        "<a class='elapsed-time' href='{{itemUrl}}'>" +
            "<span>{{elapsedTime}}</span>" +
        "</a>" +
    "</div>";

    /********************************************
    * Define item template - Twitter & Facebook *
    ********************************************/
    var itemTemplate1 =
    "<div id='{{itemRef}}' class='item item-{{type}}'>" +
        heading_part +
        text_part +
        image_part +
        footer_part +
    "</div>";

    /***********************************
    * Define item template - Instagram *
    ***********************************/
    var itemTemplate2 =
    "<div id='{{itemRef}}' class='item item-{{type}}'>" +
        heading_part +
        image_part +
        text_part +
        footer_part +
    "</div>";

    /*********************************
    * Define item template - Youtube *
    *********************************/
    var itemTemplate3 =
    "<div id='{{itemRef}}' class='item item-{{type}}'>" +
        heading_part +
        video_part +
        text_part +
        footer_part +
    "</div>";


    function getHtmlFromJson(jsonText) {
        /***************************************
        * Loop through all items to build wall *
        ***************************************/
        var items = JSON.parse(jsonText);
        var wallItems;
        var screenName;

        for (i = 0; i < items.length; i++) {

            var itemType = items[i].type.toLowerCase();
            var itemTemplate;

            if (itemType == "twitter" || itemType == "facebook") {
                itemTemplate = itemTemplate1;
            }
            else if (itemType == "instagram") {
                itemTemplate = itemTemplate2;
            }
            else {
                itemTemplate = itemTemplate3;
            }

            screenName = (itemType == "twitter" ? "@" + items[i].screenName : items[i].screenName);

            var itemView = {
                itemRef: items[i].itemRef,
                type: itemType,
                image: items[i].imageUrl,
                video: items[i].videoId,
                fullName: items[i].fullName,
                linkedText: items[i].linkedText,
                screenName: screenName,
                account: items[i].accountUrl,
                elapsedTime: items[i].timeElapsed,
                itemUrl: items[i].itemUrl
            }

            wallItems += Mustache.to_html(itemTemplate, itemView);
        }

        return wallItems;
    }

    return{
        getHtmlFromJson:getHtmlFromJson
    }

}();
