module.exports = function () {

    var Cookies = require("js-cookie"),
        messageConfig = {
            "frequency": 1,
            "delay": 7e3
        };

        return function ($) {

            if (Math.random() < messageConfig.frequency) {

                var $container = $("#container"),
                    newHTML,
                    $msgWrapper,
                    createMsg = function () {

                        newHTML =
                            "<div class=\"survey-message survey-message--study\">" +
                                "<h2 class=\"survey-message__title\">Help us improve this site<\/h2>" +
                                "<div class=\"survey-message__content\">" +
                                    "<p>Do you have 5 minutes?. Please take part in our online survey and help us improve the website.<\/p>" +
                                "<\/div>" +
                                "<div class=\"survey-message__action\">" +
                                    "<p class=\"survey-message__accept\"><a href=\"http://ows.io/cm/g405g700\">Take this survey<\/a><\/p>" +
                                    "<p class=\"survey-message__refuse\">No thanks<\/p>" +
                                "<\/div>" +
                            "<\/div>";

                        $(newHTML).appendTo($container).hide().fadeIn(1200);

                        $msgWrapper = $(".survey-message");
                        $acceptBtn = $(".survey-message__accept");
                        $refuseBtn = $(".survey-message__refuse");

                    },

                    cookies = function () {

                        if (!Cookies.get("cookiestudysurvey")) {

                            createMsg();

                            $refuseBtn.on("click", function () {
                                Cookies.set('cookiestudysurvey', '1', {expires: 365});
                                $msgWrapper.fadeOut();
                            });

                            $acceptBtn.on("click", function () {
                                Cookies.set('cookiestudysurvey', '1', {expires: 365});
                            });

                        }

                    };

                window.setTimeout(cookies, messageConfig.delay);
            }

        };
}();
