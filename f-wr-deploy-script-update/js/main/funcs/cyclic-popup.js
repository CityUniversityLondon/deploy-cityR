module.exports = function () {
    'use strict';

    var $ = require('../jquery');

    return function() {
        $('.cyclic-popup-item__title').click(function() {
            var clickedItemLink = $(this);
            var clickedItem     = $(this).closest('.cyclic-popup-item');
            var popupGroup      = clickedItemLink.closest(".cyclic-popup-group");
            var allPopupItems   = popupGroup.children('.cyclic-popup-item');
            var currentIndex    = 0;
            var noOfPopupItems  = allPopupItems.length;

            allPopupItems.each(function(index, value) {
                if ($(this).get(0) === clickedItem.get(0)) {
                    currentIndex = index;
                }
            });

            function getWidth() {
                var width = $(window).width() * 0.9;

                if (width > 500) {
                    width = 500;
                }
                return width;
            }

            function getNextItem(reverse) {
                if (reverse == false) {
                    if (currentIndex == noOfPopupItems - 1) {
                        currentIndex = 0;
                    }
                    else {
                        currentIndex++;
                    }
                }
                else {
                    if (currentIndex == 0) {
                        currentIndex = noOfPopupItems - 1;
                    }
                    else {
                        currentIndex--;
                    }
                }

                var nextItem = allPopupItems.get(currentIndex);
                return nextItem;
            }

            function setDialogButtons() {
                if (noOfPopupItems > 1) {
                    var buttonsToSet = [
                        {
                            text: 'PREVIOUS',
                            click: function() {
                                $(this).html($(getNextItem(true)).find('.cyclic-popup-item__detail').html());
                            }
                        },
                        {
                            text: 'NEXT',
                            click: function() {
                                $(this).html($(getNextItem(false)).find('.cyclic-popup-item__detail').html());
                            }
                        }
                    ];

                    $('.ui-dialog-content').dialog('option', 'buttons', buttonsToSet);
                }
            }

            $('<div></div>').dialog({
                modal: true,
                draggable: false,
                resizable: false,
                width: getWidth(),

                close: function() {
                    $(this).dialog('destroy')
                },

                create:function() {
                    $(this).closest('.ui-dialog').addClass('cyclic-popup');
                    $(this).html(clickedItem.find('.cyclic-popup-item__detail').html());
                    setDialogButtons();
                },

                open:function () {
                    if (noOfPopupItems > 1) {
                        $(this).parent().find('button:nth-child(2)').focus();
                    }
                    else {
                        $(this).parent().find('.ui-dialog-titlebar-close').focus();
                    }
                }
            });

            $(window).resize(function() {
                $('.ui-dialog-content').dialog('option', 'position', 'center');
                $('.ui-dialog-content').dialog('option', 'width', getWidth());
            });

            $('.ui-widget-overlay').click(function(){
                $('div:ui-dialog:visible').dialog('close');
            });

            return false;
        });
    };
}();
