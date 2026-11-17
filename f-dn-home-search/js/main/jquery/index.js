module.exports = function () {

    require('./lib/jquery.min');
    require('./lib/jquery-ui.min');
    require('./lib/jquery.ba-bbq.min');
    require('bxslider/dist/jquery.bxslider.js');

    require('./jquery.idize')(window.jQuery);
    require('./jquery.citydropdown')(window.jQuery);
    require('./jquery.accordion-tabs')(window.jQuery);
    require('./jquery.youtubepreview')(window.jQuery);
    require('./jquery.multiscripts')(window.jQuery);

    return window.jQuery;
}();