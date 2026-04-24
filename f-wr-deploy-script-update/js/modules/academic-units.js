CITY.academicUnits = (function () {
    var init = function () {
        $('.academic-units-slider').bxSlider({
            mode: 'fade',
            pager: false,
            controls: false,
            randomStart: true,
            auto: true,
            adaptiveHeight: true,
            pause: 15000
        });
    };

    return {
        init: init
    };
})();

$(function () {
    CITY.academicUnits.init();
});
