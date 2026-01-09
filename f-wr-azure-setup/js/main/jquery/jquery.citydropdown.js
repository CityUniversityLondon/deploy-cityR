module.exports = function ($) {
    var pageDropdowns = [];
    var closePageDropdowns = function (except) {
        for (var i = 0; i < pageDropdowns.length; i++) {
            pageDropdowns[i].each(function () {
                var pageDropdown = $(this);
                if (!except || except.length != 1 || pageDropdown.get(0) != except.get(0)) {
                    pageDropdown.removeClass('active');
                }
            });
        }
    };

    $('body').click(function () {
        closePageDropdowns(null);
    });

    var init = function (dropdowns, opt) {
        var _opt = $.extend({changeListeners: [], isMenu: false}, opt);

        pageDropdowns.push(dropdowns);

        dropdowns.each(function () {
            var dropdown = $(this);
            dropdown.data('dropdown-options', _opt);

            dropdown.find('a.display').click(function () {
                dropdown.toggleClass('active');
                closePageDropdowns(dropdown);
                return false;
            });

            if (opt && opt.values) {
                setOptions(dropdown, opt.values);
            }

            if (opt && opt.initialValue) {
                select(dropdown, opt.initialValue);
            }
            initOptions(dropdown, true);
        });
    };

    var optionValue = function (dropdown, key) {
        var opt = dropdown.data('dropdown-options');
        return opt ? opt[key] : null;
    };

    var invokeOptionExt = function (dropdown, fkey, a, b, c) {
        var f = optionValue(dropdown, fkey);
        if (f) {
            f(a, b, c);
        }
    };

    var initOptions = function (dropdown, readInputValue) {
        var options = dropdown.find('.options > a');
        dropdown.toggleClass('disabled', options.length < 2);
        if (!dropdown.data('dropdown-options').isMenu) {
            options.click(function () {
                selectAndNotify(dropdown, $(this).attr('data-value'));
                closePageDropdowns(dropdown);
                return false;
            });

            if (readInputValue) {
                var v = dropdown.find('input:hidden').val();
                if (typeof v !== 'undefined') {
                    select(dropdown, v);
                }
            }
        }
    };

    var fireOnSelect = function (dropdown) {
        var opt = dropdown.data('dropdown-options');
        for (var i = 0; i < opt.changeListeners.length; i++) {
            opt.changeListeners[i]();
        }
    };

    var selectAndNotify = function (dropdown, value) {
        select(dropdown, value);
        fireOnSelect(dropdown);
        invokeOptionExt(dropdown, 'onselect', value);
    };

    var select = function (dropdown, value) {
        var link = dropdown.find('a[data-value="' + value + '"]');
        dropdown.find('a.display span').html(link.html());
        link.addClass('selected');
        dropdown.find('a[data-value!="' + value + '"]').removeClass('selected');
        dropdown.removeClass('active');
        dropdown.find('input:hidden').val(value);
    };

    var setOptions = function (dropdown, options, selectedKey) {
        var optionsContainer = dropdown.find('.options');
        optionsContainer.empty();
        var selected = null;
        for (var i = 0; i < options.length; i++) {
            var o = options[i];
            var isSelected = o[0] == selectedKey;
            if (isSelected) {
                selected = o;
            }

            $('<a href="#"></a>').attr('data-value', o[0]).html(o[1]).toggleClass('selected', isSelected).appendTo(optionsContainer);
        }

        if (selected) {
            dropdown.find('a.display span').html(selected[1]);
        }

        initOptions(dropdown, false);
    };

    var value = function (dropdown) {
        return dropdown.find('.options a.selected').attr('data-value');
    };

    var addChangeListener = function (dropdowns, listener) {
        dropdowns.each(function () {
            var dropdown = $(this);
            var opt = dropdown.data('dropdown-options');
            opt.changeListeners.push(listener);
            dropdown.data('dropdown-options', opt);
        });
    };

    $.fn.cityDropdown = function (opt, p1, p2) {
        if (typeof opt === 'string') {
            switch (opt) {
                case 'disable':
                    break;
                case 'enable':
                    break;
                case 'select':
                    select(this, p1);
                    break;
                case 'setOptions':
                    setOptions(this, p1, p2);
                    break;
                case 'value':
                    return value(this);
                case 'change':
                    return addChangeListener(this, p1);
                default:
                    break;
            }
        } else {
            init(this, opt);
        }
        return this;
    };
};
