/**
 * Init see popup
 */
module.exports = function () {
    'use strict';

    var $ = require('../jquery');

    return function() {
        var anchors = $("a[data-popup-dialog]");

        anchors.each(function () {
            var anchor = $(this);

            anchor.click(function (e) {
            e.preventDefault();
            var link = $(e.currentTarget).attr('href');

            $('#'+anchor.attr('data-popup-dialog')).dialog({
                modal: true,
                title: anchor.attr('title'),
                width: 800,
                height: 500,
                draggable: false,
                resizable: false,
                buttons: [
                    {
                        text: "Cancel",
                        click: function() {
                            $( this ).dialog( "close" );
                        }
                    },
                    {
                        text: "Accept",
                        click: function() {
                            window.location = link;
                            $( this ).dialog( "close" );
                        }
                    }
                ]

            });
        });
    });
  };

}();
