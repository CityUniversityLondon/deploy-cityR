'use strict';

var $ = require('./libs/jquery');


$(function () {
    $('.banner-toggle').click(function () {
        $('.banner-start-here').toggleClass('open');
    });
});
