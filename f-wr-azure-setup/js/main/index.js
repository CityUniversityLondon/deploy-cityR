
var CITY = require('./main'),
    deferred = require('./deferred'),
    initJsFailureNotifier = require('./js-error-notifier'),
    initWidgets = require('./widgets'),
    initOnResize = require('./on-resize'),
    initCustomSliders = require('./custom-sliders');

CITY.init();
initJsFailureNotifier();
deferred();
initOnResize();
initWidgets();
initCustomSliders();
