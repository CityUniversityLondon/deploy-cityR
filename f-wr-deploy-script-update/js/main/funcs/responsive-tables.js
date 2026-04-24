module.exports = function () {
    'use strict';

    var $ = require('../jquery');

    return function () {
        $(".responsive-table").each(function() {
            var thetable = $(this);
            thetable.find("tbody td").each(function() {
                $(this).attr("data-th", thetable.find("thead th:nth-child("+($(this).index()+1)+")").text());
            });
        });
    };
}();
