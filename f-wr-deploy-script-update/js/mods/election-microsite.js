'use strict';

var $ = require('./libs/jquery'),
    defer = require('./utils/defer'),

    initExpertsIE7 = function () {
        var section = $('.election-microsite__experts--wrapper'),
            experts = $(':not([class*="iwd-listing"]) > .election-microsite__academics__item'),
            info = $('<div class="election-microsite__academics__item__info--ie7"></div>').appendTo(section),

            openInfo = function (expert) {
                var content = expert.find('.info-content').clone();

                info.html('').append(content).addClass('open');
            },

            close = function () {
                info.removeClass('open');
            },


            select = function (expert) {
                var makeSelected = expert && !expert.hasClass('selected');
                close();
                if (makeSelected) {
                    openInfo(expert);
                }
            };

        experts.click(function (evt) {
            evt.preventDefault();
            select($(this));
        });
    },

    initExperts = function () {

        var experts = $(':not([class*="iwd-listing"]) > .election-microsite__academics__item'),
            infoWrapper = $('.election-microsite__experts--info-wrapper'),
            infoImgContainer = $('.election-microsite__experts--info__img'),
            infoTxtContainer = $('.election-microsite__experts--info__txt'),


            close = function () {
                experts.removeClass('selected');
                infoWrapper.removeClass('election-microsite__experts--info-wrapper--open');
            },
            select = function (expert) {
                if (expert.hasClass('selected')) {
                    close();
                } else {
                    experts.removeClass('selected');
                    expert.addClass('selected');
                    infoImgContainer.empty();
                    infoTxtContainer.empty();
                    infoImgContainer.append(expert.find('.image img').clone());
                    var info = expert.find('.info').clone();
                    infoTxtContainer.append(info);
                    infoWrapper.addClass('election-microsite__experts--info-wrapper--open');
                    $('html, body').animate({
                        scrollTop: infoWrapper.offset().top
                    }, 200);
                }
            };

        $('.election-microsite__experts--info__close').click(function (e) {
            e.preventDefault();
            close();
        });

        experts.click(function (evt) {
            evt.preventDefault();
            select($(this));
        });

        //$(window).resize(close);
    },

    init = function () {
        if (!$('html').hasClass('lt-ie8')) {
            initExperts();
        } else {
            initExpertsIE7();
        }
    };

defer(init);
