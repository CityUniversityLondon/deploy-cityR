module.exports = function ($) {

    var scrollTo = require('../../utils/scroll-to'),

        init = function (widgets) {
            var w = $(window),
                map = {};

            widgets.each(function () {
                var widget = $(this),
                    contentPanels = widget.find(">div >.content-panel"),

                    id = widget.attr('id') || 'tab',
                    activate = function (anchor) {
                        var match = (anchor.attr('href') || '').match(/^#(.+)$/),
                            newHeader = anchor.parent("h2");
                        if (match) {
                            var params = {},
                                isTab = anchor.parent('li').length > 0,
                                alreadySelected = !isTab && anchor.closest('.tab-panel').hasClass('selected'),
                                contentPanel = anchor.closest('.tab-panel').find('.panel-content');

                            params[id] = alreadySelected ? null : match[1];
                            select(widget, params[id] || false);

                            if (!$.isEmptyObject(newHeader.offset())) {
                                $('html:not(:animated), body:not(:animated)').animate({scrollTop: newHeader.offset().top}, 'slow');
                            }

                            contentPanels.removeAttr('tabindex');

                            if (anchor.parent().hasClass('accordion-toogle')) {
                                contentPanel.attr('tabindex', '0');
                                contentPanel.focus();
                            } else {
                                anchor.focus();
                            }

                            $.bbq.pushState(params);
                        }
                    };

                $('a[href^="#' + id + '="]').each(function () {
                    var anchor = $(this),
                        match = anchor.attr('href').match(/#([a-zA-Z0-9]+)=[a-zA-Z0-9]+/);

                    if (match) {
                        anchor.click(function () {
                            $('html, body').animate({
                                scrollTop: $('#' + id).offset().top
                            }, 200);
                        });
                    }
                });

                map[id] = widget;

                widget.find('>ul a, >.tab-panel >.accordion-toogle a').click(function (e) {
                    activate($(this));
                    e.preventDefault();
                }).keydown(function (e) {
                    if (e.which === 37) {
                        activate($(this).parent().prev().children('a'));
                    } else if (e.which === 39) {
                        activate($(this).parent().next().children('a'));
                    }
                });
            });

            w.on('hashchange', function () {
                var params = $.bbq.getState();
                for (var id in map) {
                    if (map.hasOwnProperty(id)) {
                        select(map[id], params[id] || false);
                    }
                }
            });

            w.trigger("hashchange");
        },

        select = function (widget, id) {
            widget.find('>.tab-panel.default').removeClass('default');
            widget.find('>ul .selected, >.tab-panel.selected').removeClass('selected');

            if (id) {
                var hash = '#' + id;

                widget.find('>ul a[href="' + hash + '"]').addClass('selected');
                widget.find(hash).addClass('selected');
            } else {
                widget.find('>ul li').first().find('a').addClass('selected');
                widget.find('>.tab-panel').first().addClass('default');
            }
        };


    $.fn.accordionTabs = function (opt) {
        init(this, opt);
        return this;
    };
};
