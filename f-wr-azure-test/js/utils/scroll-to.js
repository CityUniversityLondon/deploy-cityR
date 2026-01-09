module.exports = function (element) {
    'use strict';

    if (element && !$.isEmptyObject(element.offset())) {
        $('html:not(:animated), body:not(:animated)').animate({scrollTop: Math.max(0, element.offset().top - 85)}, 'slow');
    }
};
