//
// This is to override the touch issues experienced with the node mudule: Box slider. The box slider's carousels
// found on the homepage have issue with the text links found on each of the slides. When clicked / touching these links
// on mobile phones or tablets nothing happens. I suspect the carousel was designed to only contain picture slides
// without text. The module be detault disables some touch events. This code re-instate touch events on the links.
// This code targets two carousels, namely the one at the very top of the home page and a news one at the bottom.
// The latter only loads as a carousel on small view ports
//

var $ = require('./libs/jquery'),
    defer = require('./utils/defer'),
    init = function () {
        var strTouchX, endTouchX;

        // records touch coordinates for determining swipe or touch
        document.addEventListener('touchstart', function (e) {
            strTouchX = e.touches[0].clientX;

            // re-instates controls after being deactivated by bxslider node module
            $('.bx-controls, .bx-has-controls-direction').removeClass(
                'disabled'
            );
        });

        // determines if touch is click or swipe by comparing start touch and end values
        function isTouchClick(endTouchX) {
            return endTouchX === strTouchX ? true : false;
        }

        /**** Home page top slider ****/
        var bannerAnchors = Array.from(
            document.querySelectorAll('.banner-content a')
        );

        for (var i = 0; i < bannerAnchors.length; i++) {
            document
                .getElementsByClassName('banner-content')
                [i].getElementsByTagName('a')[0]
                .addEventListener('touchend', function (e) {
                    e.preventDefault();
                    $('.bx-controls').removeClass('disabled');
                    endTouchX = e.changedTouches[0].pageX;

                    if (isTouchClick(endTouchX)) {
                        // calls isTouchClick function to determine if click or swipe to place
                        location.href = this.href;
                    }
                });
        }

        /**** Home page news slider (only on mobiles) ****/
        var title = document.getElementsByClassName('news-card-content__title');

        for (var i = 0; i < title.length; i++) {
            document
                .getElementsByClassName('news-card-content__title')
                [i].addEventListener('touchend', function (e) {
                    $('.bx-controls').removeClass('disabled');
                    endTouchX = e.changedTouches[0].pageX;

                    if (isTouchClick(endTouchX)) {
                        // calls isTouchClick function to determine if click or swipe to place
                        location.href = this.parentNode.href;
                    }
                });
        }
    };

defer(init);
