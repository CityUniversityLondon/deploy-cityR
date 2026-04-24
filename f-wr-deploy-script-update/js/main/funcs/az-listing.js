module.exports = function () {

    var $ = require('../jquery');

    return function (azListings) {

        azListings.each(function () {
            var me = $(this),
                letters = me.find('.letter-list a'),
                letterGroups = me.find('.letter-group'),

                select = function (anchor) {
                    letters.filter('[href!="' + anchor + '"]').removeClass('selected');
                    letters.filter('[href="' + anchor + '"]').addClass('selected');


                    if (anchor) {
                        var name = anchor.substr(1);

                        letterGroups.filter('[name!="' + name + '"]').addClass('unselected').removeClass('selected');
                        letterGroups.filter('[name="' + name + '"]').removeClass('unselected').addClass('selected');
                    } else {
                        letterGroups.removeClass('unselected').removeClass('selected');
                    }
                };


            letterGroups.find('.go-up').click(function (e) {
                    e.preventDefault();
                    select(false);
                })
                .children('span').html('Show all').end()
                .children('i').removeClass('fa-arrow-circle-o-up').addClass('fa-reply');

            letters.click(function (e) {
                select($(this).attr('href'));
                e.preventDefault();
            });
        });
    };
}();
