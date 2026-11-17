/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 74);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports) {

/**
 * expects jQuery to be provided by CITY_R.js
 */
module.exports = window.$;

/***/ }),

/***/ 2:
/***/ (function(module, exports, __webpack_require__) {

module.exports = function () {
    'use strict';

    var $ = __webpack_require__(0);

    return function (deferredFunction) {
        if (typeof CITY !== 'undefined') {
            $(deferredFunction);
        } else {
            if (!window.CITY_OPTIONS) {
                window.CITY_OPTIONS = {defer: []};
            } else if (!window.CITY_OPTIONS.defer) {
                window.CITY_OPTIONS.defer = [];
            }
            CITY_OPTIONS.defer.push(deferredFunction);
        }
    };
}();

/***/ }),

/***/ 74:
/***/ (function(module, exports, __webpack_require__) {

var defer = __webpack_require__(2),

    init = function() {

        function initShortCourses() {
            var dropdownBlock = $('#shortcourse-dropdown');
            var dropdown = $('#shortcourse-dropdown select');
            var dropdownOptions = $('#shortcourse-dropdown option');
            var isCPD = ($('.shortcourse--cpd')[0]);

            updateStaticData();
            updateDynamicData();
            checkEmptyTestimonials();
            initTutorSlider();
    
            dropdown.change(function() {
                updateDynamicData();
            });
    
            function updateStaticData() {
                var selectedOption = dropdown.find(':selected');
    
                // remove dropdownBlock if dropdown is empty or if it only contains hidden dummy
                if (dropdownOptions.length == 0) {
                    dropdownBlock.remove();
                }
                else if (dropdownOptions.length == 1) {
                    if (selectedOption.data('startdatevis') == 'hide-date') {
                        dropdownBlock.remove();
                    }
                }
            }
    
            function updateDynamicData() {
                var selectedOption = dropdown.find(':selected');
                var deadlineFurther = 'No deadline, subject to availability';

                // Use Moment.js package to format date
                // var bookingDeadlineFormatted = moment(selectedOption.data('bookingdeadline')).format('ddd D MMM YYYY');
    
                $('#dynamic-subtext').html(selectedOption.data('startdatesubtext'));

                // If no presentation listings at all
                if (!(selectedOption.data()) || selectedOption.data().startdatevis == 'hide-date') {
                    $('.start-date').css('display', 'none');
                    $('#dynamic-deadline-further').hide();
                    $("span[id^='dynamic-']").html('<span>To be confirmed</span>');
                    $('.shortcourse-keyinfo h2').css('border-bottom', '1px solid');
                    $('#not-set').html('<p>Dates and fees to be confirmed</p>');
                } else if (selectedOption.data('register') == 'yes') {
                    $('#dynamic-deadline-further').hide();
                    $("span[id^='dynamic-']").html('<span>To be confirmed</span>');
                    $('.shortcourse-keyinfo h2').css('border-bottom', '1px solid');
                    $('#not-set').html('<p>Dates and fees to be confirmed</p>');
                } else {
                    // $('#dynamic-deadline').hide().html(deadlineFurther).fadeIn();
                }
    
                // if storelink exists, display appropriate action button
                if (selectedOption.data('storelink') != null && selectedOption.data('storelink').trim() != '') {
                    var linkText = (selectedOption.data('register') == 'yes' ? 'Register interest <span><i class="fa fa-chevron-circle-right" /></span>' : 'Book now <span><i class="fa fa-chevron-circle-right" /></span>');
    
                    var storelink = selectedOption.data('storelink');
                    if (storelink.slice(-1) == '/') {
                        storelink = storelink.slice(0, -1);
                    }
                    $('#dynamic-action').html('<p class="cta hard-cta"><a href=' + storelink + '>' + linkText + '</a></p>');
                }
                else {
                    $('#dynamic-action').empty();
                }
    
                if (isCPD) { // key info - cpd courses
                    if (selectedOption.data('duration') == null || selectedOption.data('duration') == '') {
                       $('#cpd-duration-row').hide();
                    }
                    else {
                        $('#dynamic-duration').html(selectedOption.data('duration'));
                        $('#cpd-duration-row').show();
                    }
    
                    if (selectedOption.data('time') == null || selectedOption.data('time') == '') {
                       $('#cpd-time-row').hide();
                    }
                    else {
                        $('#dynamic-time').html(selectedOption.data('time'));
                        $('#cpd-time-row').show();
                    }
    
                    if (selectedOption.data('location') == null || selectedOption.data('location') == '') {
                       $('#cpd-location-row').hide();
                    }
                    else {
                        $('#dynamic-location').html(selectedOption.data('location'));
                        $('#cpd-location-row').show();
                    }
    
                    if (selectedOption.data('applyuntil') != null && selectedOption.data('applyuntil') != '') {
                       $('#dynamic-applyuntil').hide().html(selectedOption.data('applyuntil')).fadeIn();
                    }

                } else { // key info - short courses
                    $('#dynamic-duration').hide().html(selectedOption.data('duration')).fadeIn();
                    $('#dynamic-time').hide().html(selectedOption.data('time')).fadeIn();
                }

                // If days exist, print. If not, hide row
                if (selectedOption.data('days')) {
                    $('#days').show();
                    $('#dynamic-days').hide().html(selectedOption.data('days')).fadeIn();
                } else {
                    $('#days').hide();
                }
                $('#dynamic-code').hide().html(selectedOption.data('code')).fadeIn();
                $('#dynamic-fees').hide().html(selectedOption.data('fees')).fadeIn();
                $('#dynamic-location').hide().html(selectedOption.data('location')).fadeIn();

                // If deadline override metadata exists, print this data value instead of other fields
                if (selectedOption.data('bookingdeadlineoverride')) {
                    $('.row#booking-deadline').show();
                    $('#dynamic-deadline-further').hide();
                    $('#dynamic-deadline').hide().html(selectedOption.data('bookingdeadlineoverride')).fadeIn();
                } else {
                    $('.row#booking-deadline').hide();
                }
    
            }
    
            function checkEmptyTestimonials() {
                var thing = $('.shortcourse-testimonials').find('.course__profiles__item');
                if (thing.length == 0) {
                    $('.shortcourse-testimonials').addClass('shortcourse-testimonials--empty').removeClass('shortcourse-testimonials');
                }
                $('.shortcourse-testimonials-block').show();
                // Bug fix: define initial carousel dimensions otherwise won't load correctly
                $('.bx-viewport').css('height','auto');
                $('.course__profiles__item.course__profiles__item').css({
                    'width': '100vw',
                    'max-width': '1200px'
                });
            }
    
            function initTutorSlider() {
                var w = $('.shortcourse-tutor-profiles').width();
                var n = $('.shortcourse-tutor').length;
    
                if (n > 1) {
                    var fitAllWidth = w / n,
                        controls = n > 1,
                        minWidth = Math.max(300, fitAllWidth),
                        maxSlides = Math.max(1, Math.floor(w / minWidth)),
                        width = w / maxSlides;
    
                    $('.shortcourse-tutor-items').bxSlider({
                        pager: false,
                        controls: controls,
                        nextText: '<i class="fa fa-chevron-right"></i>',
                        prevText: '<i class="fa fa-chevron-left"></i>',
                        adaptiveHeight: true,
                        slideMargin: 0,
                        touchEnabled: false
                    });
    
                    $('.shortcourse-tutor-wrapper').addClass('shortcourse-tutor-selection');
                }
            }
    
        }
    
        initShortCourses()
    }

defer(init);

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZjc0NjhmOTM0ZTE4OGE4ZWQ5MTciLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHMvbGlicy9qcXVlcnkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHMvdXRpbHMvZGVmZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHMvc2hvcnRDb3Vyc2VzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7QUM3REE7QUFDQTtBQUNBO0FBQ0EsMEI7Ozs7Ozs7QUNIQTtBQUNBOztBQUVBLFlBQVksbUJBQU8sQ0FBQyxDQUFnQjs7QUFFcEM7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsdUNBQXVDO0FBQ3ZDLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxHOzs7Ozs7O0FDakJELFlBQVksbUJBQU8sQ0FBQyxDQUFlOztBQUVuQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhOztBQUViO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsaUJBQWlCLE9BQU87QUFDeEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCOztBQUVyQjtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQSxZIiwiZmlsZSI6Im1vZHVsZXMvc2hvcnRDb3Vyc2VzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNzQpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGY3NDY4ZjkzNGUxODhhOGVkOTE3IiwiLyoqXG4gKiBleHBlY3RzIGpRdWVyeSB0byBiZSBwcm92aWRlZCBieSBDSVRZX1IuanNcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB3aW5kb3cuJDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9qcy9tb2RzL2xpYnMvanF1ZXJ5LmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMSAyIDMgNCA1IDYgNyA4IDkgMTAiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgJCA9IHJlcXVpcmUoJy4uL2xpYnMvanF1ZXJ5Jyk7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKGRlZmVycmVkRnVuY3Rpb24pIHtcbiAgICAgICAgaWYgKHR5cGVvZiBDSVRZICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgJChkZWZlcnJlZEZ1bmN0aW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghd2luZG93LkNJVFlfT1BUSU9OUykge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5DSVRZX09QVElPTlMgPSB7ZGVmZXI6IFtdfTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXdpbmRvdy5DSVRZX09QVElPTlMuZGVmZXIpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuQ0lUWV9PUFRJT05TLmRlZmVyID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBDSVRZX09QVElPTlMuZGVmZXIucHVzaChkZWZlcnJlZEZ1bmN0aW9uKTtcbiAgICAgICAgfVxuICAgIH07XG59KCk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvanMvbW9kcy91dGlscy9kZWZlci5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDEgMiAzIDQgNSA2IDcgOCA5IiwidmFyIGRlZmVyID0gcmVxdWlyZSgnLi91dGlscy9kZWZlcicpLFxuXG4gICAgaW5pdCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGZ1bmN0aW9uIGluaXRTaG9ydENvdXJzZXMoKSB7XG4gICAgICAgICAgICB2YXIgZHJvcGRvd25CbG9jayA9ICQoJyNzaG9ydGNvdXJzZS1kcm9wZG93bicpO1xuICAgICAgICAgICAgdmFyIGRyb3Bkb3duID0gJCgnI3Nob3J0Y291cnNlLWRyb3Bkb3duIHNlbGVjdCcpO1xuICAgICAgICAgICAgdmFyIGRyb3Bkb3duT3B0aW9ucyA9ICQoJyNzaG9ydGNvdXJzZS1kcm9wZG93biBvcHRpb24nKTtcbiAgICAgICAgICAgIHZhciBpc0NQRCA9ICgkKCcuc2hvcnRjb3Vyc2UtLWNwZCcpWzBdKTtcblxuICAgICAgICAgICAgdXBkYXRlU3RhdGljRGF0YSgpO1xuICAgICAgICAgICAgdXBkYXRlRHluYW1pY0RhdGEoKTtcbiAgICAgICAgICAgIGNoZWNrRW1wdHlUZXN0aW1vbmlhbHMoKTtcbiAgICAgICAgICAgIGluaXRUdXRvclNsaWRlcigpO1xuICAgIFxuICAgICAgICAgICAgZHJvcGRvd24uY2hhbmdlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHVwZGF0ZUR5bmFtaWNEYXRhKCk7XG4gICAgICAgICAgICB9KTtcbiAgICBcbiAgICAgICAgICAgIGZ1bmN0aW9uIHVwZGF0ZVN0YXRpY0RhdGEoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGVjdGVkT3B0aW9uID0gZHJvcGRvd24uZmluZCgnOnNlbGVjdGVkJyk7XG4gICAgXG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGRyb3Bkb3duQmxvY2sgaWYgZHJvcGRvd24gaXMgZW1wdHkgb3IgaWYgaXQgb25seSBjb250YWlucyBoaWRkZW4gZHVtbXlcbiAgICAgICAgICAgICAgICBpZiAoZHJvcGRvd25PcHRpb25zLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGRyb3Bkb3duQmxvY2sucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGRyb3Bkb3duT3B0aW9ucy5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWRPcHRpb24uZGF0YSgnc3RhcnRkYXRldmlzJykgPT0gJ2hpZGUtZGF0ZScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRyb3Bkb3duQmxvY2sucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICBmdW5jdGlvbiB1cGRhdGVEeW5hbWljRGF0YSgpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZWN0ZWRPcHRpb24gPSBkcm9wZG93bi5maW5kKCc6c2VsZWN0ZWQnKTtcbiAgICAgICAgICAgICAgICB2YXIgZGVhZGxpbmVGdXJ0aGVyID0gJ05vIGRlYWRsaW5lLCBzdWJqZWN0IHRvIGF2YWlsYWJpbGl0eSc7XG5cbiAgICAgICAgICAgICAgICAvLyBVc2UgTW9tZW50LmpzIHBhY2thZ2UgdG8gZm9ybWF0IGRhdGVcbiAgICAgICAgICAgICAgICAvLyB2YXIgYm9va2luZ0RlYWRsaW5lRm9ybWF0dGVkID0gbW9tZW50KHNlbGVjdGVkT3B0aW9uLmRhdGEoJ2Jvb2tpbmdkZWFkbGluZScpKS5mb3JtYXQoJ2RkZCBEIE1NTSBZWVlZJyk7XG4gICAgXG4gICAgICAgICAgICAgICAgJCgnI2R5bmFtaWMtc3VidGV4dCcpLmh0bWwoc2VsZWN0ZWRPcHRpb24uZGF0YSgnc3RhcnRkYXRlc3VidGV4dCcpKTtcblxuICAgICAgICAgICAgICAgIC8vIElmIG5vIHByZXNlbnRhdGlvbiBsaXN0aW5ncyBhdCBhbGxcbiAgICAgICAgICAgICAgICBpZiAoIShzZWxlY3RlZE9wdGlvbi5kYXRhKCkpIHx8IHNlbGVjdGVkT3B0aW9uLmRhdGEoKS5zdGFydGRhdGV2aXMgPT0gJ2hpZGUtZGF0ZScpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnN0YXJ0LWRhdGUnKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAgICAgICAgICAgICAgICAgICAkKCcjZHluYW1pYy1kZWFkbGluZS1mdXJ0aGVyJykuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAkKFwic3BhbltpZF49J2R5bmFtaWMtJ11cIikuaHRtbCgnPHNwYW4+VG8gYmUgY29uZmlybWVkPC9zcGFuPicpO1xuICAgICAgICAgICAgICAgICAgICAkKCcuc2hvcnRjb3Vyc2Uta2V5aW5mbyBoMicpLmNzcygnYm9yZGVyLWJvdHRvbScsICcxcHggc29saWQnKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnI25vdC1zZXQnKS5odG1sKCc8cD5EYXRlcyBhbmQgZmVlcyB0byBiZSBjb25maXJtZWQ8L3A+Jyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzZWxlY3RlZE9wdGlvbi5kYXRhKCdyZWdpc3RlcicpID09ICd5ZXMnKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJyNkeW5hbWljLWRlYWRsaW5lLWZ1cnRoZXInKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICQoXCJzcGFuW2lkXj0nZHluYW1pYy0nXVwiKS5odG1sKCc8c3Bhbj5UbyBiZSBjb25maXJtZWQ8L3NwYW4+Jyk7XG4gICAgICAgICAgICAgICAgICAgICQoJy5zaG9ydGNvdXJzZS1rZXlpbmZvIGgyJykuY3NzKCdib3JkZXItYm90dG9tJywgJzFweCBzb2xpZCcpO1xuICAgICAgICAgICAgICAgICAgICAkKCcjbm90LXNldCcpLmh0bWwoJzxwPkRhdGVzIGFuZCBmZWVzIHRvIGJlIGNvbmZpcm1lZDwvcD4nKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyAkKCcjZHluYW1pYy1kZWFkbGluZScpLmhpZGUoKS5odG1sKGRlYWRsaW5lRnVydGhlcikuZmFkZUluKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgICAgIC8vIGlmIHN0b3JlbGluayBleGlzdHMsIGRpc3BsYXkgYXBwcm9wcmlhdGUgYWN0aW9uIGJ1dHRvblxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZE9wdGlvbi5kYXRhKCdzdG9yZWxpbmsnKSAhPSBudWxsICYmIHNlbGVjdGVkT3B0aW9uLmRhdGEoJ3N0b3JlbGluaycpLnRyaW0oKSAhPSAnJykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbGlua1RleHQgPSAoc2VsZWN0ZWRPcHRpb24uZGF0YSgncmVnaXN0ZXInKSA9PSAneWVzJyA/ICdSZWdpc3RlciBpbnRlcmVzdCA8c3Bhbj48aSBjbGFzcz1cImZhIGZhLWNoZXZyb24tY2lyY2xlLXJpZ2h0XCIgLz48L3NwYW4+JyA6ICdCb29rIG5vdyA8c3Bhbj48aSBjbGFzcz1cImZhIGZhLWNoZXZyb24tY2lyY2xlLXJpZ2h0XCIgLz48L3NwYW4+Jyk7XG4gICAgXG4gICAgICAgICAgICAgICAgICAgIHZhciBzdG9yZWxpbmsgPSBzZWxlY3RlZE9wdGlvbi5kYXRhKCdzdG9yZWxpbmsnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0b3JlbGluay5zbGljZSgtMSkgPT0gJy8nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9yZWxpbmsgPSBzdG9yZWxpbmsuc2xpY2UoMCwgLTEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICQoJyNkeW5hbWljLWFjdGlvbicpLmh0bWwoJzxwIGNsYXNzPVwiY3RhIGhhcmQtY3RhXCI+PGEgaHJlZj0nICsgc3RvcmVsaW5rICsgJz4nICsgbGlua1RleHQgKyAnPC9hPjwvcD4nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQoJyNkeW5hbWljLWFjdGlvbicpLmVtcHR5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgICAgIGlmIChpc0NQRCkgeyAvLyBrZXkgaW5mbyAtIGNwZCBjb3Vyc2VzXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZE9wdGlvbi5kYXRhKCdkdXJhdGlvbicpID09IG51bGwgfHwgc2VsZWN0ZWRPcHRpb24uZGF0YSgnZHVyYXRpb24nKSA9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAkKCcjY3BkLWR1cmF0aW9uLXJvdycpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNkeW5hbWljLWR1cmF0aW9uJykuaHRtbChzZWxlY3RlZE9wdGlvbi5kYXRhKCdkdXJhdGlvbicpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNjcGQtZHVyYXRpb24tcm93Jykuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZE9wdGlvbi5kYXRhKCd0aW1lJykgPT0gbnVsbCB8fCBzZWxlY3RlZE9wdGlvbi5kYXRhKCd0aW1lJykgPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgJCgnI2NwZC10aW1lLXJvdycpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNkeW5hbWljLXRpbWUnKS5odG1sKHNlbGVjdGVkT3B0aW9uLmRhdGEoJ3RpbWUnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjY3BkLXRpbWUtcm93Jykuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZE9wdGlvbi5kYXRhKCdsb2NhdGlvbicpID09IG51bGwgfHwgc2VsZWN0ZWRPcHRpb24uZGF0YSgnbG9jYXRpb24nKSA9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAkKCcjY3BkLWxvY2F0aW9uLXJvdycpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNkeW5hbWljLWxvY2F0aW9uJykuaHRtbChzZWxlY3RlZE9wdGlvbi5kYXRhKCdsb2NhdGlvbicpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNjcGQtbG9jYXRpb24tcm93Jykuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZE9wdGlvbi5kYXRhKCdhcHBseXVudGlsJykgIT0gbnVsbCAmJiBzZWxlY3RlZE9wdGlvbi5kYXRhKCdhcHBseXVudGlsJykgIT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgJCgnI2R5bmFtaWMtYXBwbHl1bnRpbCcpLmhpZGUoKS5odG1sKHNlbGVjdGVkT3B0aW9uLmRhdGEoJ2FwcGx5dW50aWwnKSkuZmFkZUluKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7IC8vIGtleSBpbmZvIC0gc2hvcnQgY291cnNlc1xuICAgICAgICAgICAgICAgICAgICAkKCcjZHluYW1pYy1kdXJhdGlvbicpLmhpZGUoKS5odG1sKHNlbGVjdGVkT3B0aW9uLmRhdGEoJ2R1cmF0aW9uJykpLmZhZGVJbigpO1xuICAgICAgICAgICAgICAgICAgICAkKCcjZHluYW1pYy10aW1lJykuaGlkZSgpLmh0bWwoc2VsZWN0ZWRPcHRpb24uZGF0YSgndGltZScpKS5mYWRlSW4oKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBJZiBkYXlzIGV4aXN0LCBwcmludC4gSWYgbm90LCBoaWRlIHJvd1xuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZE9wdGlvbi5kYXRhKCdkYXlzJykpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2RheXMnKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICQoJyNkeW5hbWljLWRheXMnKS5oaWRlKCkuaHRtbChzZWxlY3RlZE9wdGlvbi5kYXRhKCdkYXlzJykpLmZhZGVJbigpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQoJyNkYXlzJykuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAkKCcjZHluYW1pYy1jb2RlJykuaGlkZSgpLmh0bWwoc2VsZWN0ZWRPcHRpb24uZGF0YSgnY29kZScpKS5mYWRlSW4oKTtcbiAgICAgICAgICAgICAgICAkKCcjZHluYW1pYy1mZWVzJykuaGlkZSgpLmh0bWwoc2VsZWN0ZWRPcHRpb24uZGF0YSgnZmVlcycpKS5mYWRlSW4oKTtcbiAgICAgICAgICAgICAgICAkKCcjZHluYW1pYy1sb2NhdGlvbicpLmhpZGUoKS5odG1sKHNlbGVjdGVkT3B0aW9uLmRhdGEoJ2xvY2F0aW9uJykpLmZhZGVJbigpO1xuXG4gICAgICAgICAgICAgICAgLy8gSWYgZGVhZGxpbmUgb3ZlcnJpZGUgbWV0YWRhdGEgZXhpc3RzLCBwcmludCB0aGlzIGRhdGEgdmFsdWUgaW5zdGVhZCBvZiBvdGhlciBmaWVsZHNcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWRPcHRpb24uZGF0YSgnYm9va2luZ2RlYWRsaW5lb3ZlcnJpZGUnKSkge1xuICAgICAgICAgICAgICAgICAgICAkKCcucm93I2Jvb2tpbmctZGVhZGxpbmUnKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICQoJyNkeW5hbWljLWRlYWRsaW5lLWZ1cnRoZXInKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICQoJyNkeW5hbWljLWRlYWRsaW5lJykuaGlkZSgpLmh0bWwoc2VsZWN0ZWRPcHRpb24uZGF0YSgnYm9va2luZ2RlYWRsaW5lb3ZlcnJpZGUnKSkuZmFkZUluKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnJvdyNib29raW5nLWRlYWRsaW5lJykuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNoZWNrRW1wdHlUZXN0aW1vbmlhbHMoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRoaW5nID0gJCgnLnNob3J0Y291cnNlLXRlc3RpbW9uaWFscycpLmZpbmQoJy5jb3Vyc2VfX3Byb2ZpbGVzX19pdGVtJyk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaW5nLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5zaG9ydGNvdXJzZS10ZXN0aW1vbmlhbHMnKS5hZGRDbGFzcygnc2hvcnRjb3Vyc2UtdGVzdGltb25pYWxzLS1lbXB0eScpLnJlbW92ZUNsYXNzKCdzaG9ydGNvdXJzZS10ZXN0aW1vbmlhbHMnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJCgnLnNob3J0Y291cnNlLXRlc3RpbW9uaWFscy1ibG9jaycpLnNob3coKTtcbiAgICAgICAgICAgICAgICAvLyBCdWcgZml4OiBkZWZpbmUgaW5pdGlhbCBjYXJvdXNlbCBkaW1lbnNpb25zIG90aGVyd2lzZSB3b24ndCBsb2FkIGNvcnJlY3RseVxuICAgICAgICAgICAgICAgICQoJy5ieC12aWV3cG9ydCcpLmNzcygnaGVpZ2h0JywnYXV0bycpO1xuICAgICAgICAgICAgICAgICQoJy5jb3Vyc2VfX3Byb2ZpbGVzX19pdGVtLmNvdXJzZV9fcHJvZmlsZXNfX2l0ZW0nKS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAnd2lkdGgnOiAnMTAwdncnLFxuICAgICAgICAgICAgICAgICAgICAnbWF4LXdpZHRoJzogJzEyMDBweCdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIGZ1bmN0aW9uIGluaXRUdXRvclNsaWRlcigpIHtcbiAgICAgICAgICAgICAgICB2YXIgdyA9ICQoJy5zaG9ydGNvdXJzZS10dXRvci1wcm9maWxlcycpLndpZHRoKCk7XG4gICAgICAgICAgICAgICAgdmFyIG4gPSAkKCcuc2hvcnRjb3Vyc2UtdHV0b3InKS5sZW5ndGg7XG4gICAgXG4gICAgICAgICAgICAgICAgaWYgKG4gPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmaXRBbGxXaWR0aCA9IHcgLyBuLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbHMgPSBuID4gMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbldpZHRoID0gTWF0aC5tYXgoMzAwLCBmaXRBbGxXaWR0aCksXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXhTbGlkZXMgPSBNYXRoLm1heCgxLCBNYXRoLmZsb29yKHcgLyBtaW5XaWR0aCkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGggPSB3IC8gbWF4U2xpZGVzO1xuICAgIFxuICAgICAgICAgICAgICAgICAgICAkKCcuc2hvcnRjb3Vyc2UtdHV0b3ItaXRlbXMnKS5ieFNsaWRlcih7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlcjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sczogY29udHJvbHMsXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0VGV4dDogJzxpIGNsYXNzPVwiZmEgZmEtY2hldnJvbi1yaWdodFwiPjwvaT4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJldlRleHQ6ICc8aSBjbGFzcz1cImZhIGZhLWNoZXZyb24tbGVmdFwiPjwvaT4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWRhcHRpdmVIZWlnaHQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBzbGlkZU1hcmdpbjogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdWNoRW5hYmxlZDogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgXG4gICAgICAgICAgICAgICAgICAgICQoJy5zaG9ydGNvdXJzZS10dXRvci13cmFwcGVyJykuYWRkQ2xhc3MoJ3Nob3J0Y291cnNlLXR1dG9yLXNlbGVjdGlvbicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgfVxuICAgIFxuICAgICAgICBpbml0U2hvcnRDb3Vyc2VzKClcbiAgICB9XG5cbmRlZmVyKGluaXQpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2pzL21vZHMvc2hvcnRDb3Vyc2VzLmpzXG4vLyBtb2R1bGUgaWQgPSA3NFxuLy8gbW9kdWxlIGNodW5rcyA9IDYiXSwic291cmNlUm9vdCI6IiJ9