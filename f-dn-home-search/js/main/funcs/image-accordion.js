module.exports = function () {
    'use strict';

    var $ = require('../jquery');

    return function () {
        $('.image-accordion label').click(function () {
            var labelTarget = $(this).attr('for');
            $('#' + labelTarget).blur();
            $('#' + labelTarget).focus();
        });
        $('.image-accordion input[type="radio"]').change(function () {
            var radioInput = $(this);
            $('.image-accordion input[type="radio"]').removeClass('checked');
            if (this.checked) {
                radioInput.addClass('checked');
            }
        });
    };
}();
