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
/******/ 	return __webpack_require__(__webpack_require__.s = 60);
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

/***/ 60:
/***/ (function(module, exports, __webpack_require__) {

// $ = require('./libs/jquery');
var onResize = __webpack_require__(61),
    composeFunctions = __webpack_require__(62),
    defer = __webpack_require__(2),
    charts = __webpack_require__(63),

    initAccordions = function () {
        $('.course__accordion').accordion({
            heightStyle: "content",
            collapsible: true,
            active: false,
            animate: false,
            activate: function (event, ui) {
                if (!$.isEmptyObject(ui.newHeader.offset())) {
                    $('html:not(:animated), body:not(:animated)').animate({scrollTop: ui.newHeader.offset().top}, 'slow');
                }
            }
        });
    },

    initApplyDialog = function () {
        $('a[href="#apply-dialog"]').click(function (e) {
            e.preventDefault();

            $('#apply-dialog').dialog({
                modal: true,
                autoOpen: true,
                dialogClass: "apply-dialog",
                title: "How to Apply",
                width: "60%",
                height: 500,
                draggable: false,
                resizable: false
            });
        });
    },

    initEntries = function () {
        $('.course__entries select').change(function (e) {
            location.href = $(this).find('option:selected').attr('data-url');
        });
    },

    initTestimonials = function () {

        var w = $('.course__profiles').width(),
            n = $('.course__profiles__item').length;

        if (n > 0) {
            var fitAllWidth = w / n,
                controls = n > 1,
                minWidth = Math.max(300, fitAllWidth),
                maxSlides = Math.max(1, Math.floor(w / minWidth)),
                width = w / maxSlides;

            $('.course__profiles .items').bxSlider({
                pager: false,
                controls: controls,
                nextText: '<i class="fa fa-chevron-right"></i>',
                prevText: '<i class="fa fa-chevron-left"></i>',
                adaptiveHeight: true,
                slideMargin: 0,
                touchEnabled: false
            });
        }

    },

    testimonialsBackgroundColor = function () {
        // Get title text colour of selected list item, i.e. nested in aria-hidden="false"
        var selectedItemColor = $('li.course__profiles__item:not([aria-hidden*="true"]) .course__profiles__item__text__title').css("color");

        // Apply selected text colour to testimonials wrapper background
        $('.course__testimonials__wrapper').css("background", selectedItemColor);
    },

    initAssessment = function () {
        var container = document.getElementById('course-assessment-chart');

        if (container) {
            var data = new google.visualization.DataTable(),
                options = {
                    chartArea: {
                        top: 10,
                        bottom: 30,
                        width: 300,
                        height: 300
                    },
                    animation: {duration: 1000, "startup": true},
                    tooltip: {text: 'percentage'},
                    title: 'Assessment',
                    pieHole: 0.5,
                    colors: ['#253e52', '#3f1561', '#e3a02d', '#3986ac']
                },
                chart = new google.visualization.PieChart(container);

            data.addColumn('string', 'Type');
            data.addColumn('number', '%');

            $('.course__assessment__list li').each(function () {
                var li = $(this);
                data.addRow([li.attr('data-label'), parseFloat(li.attr('data-value'))]);
            });

            return function () {
                chart.draw(data, options);
            };
        } else {
            return false;
        }
    },

    initMenu = function () {
        var menu = $('.course__menu'),
            toggle = menu.find('.course__menu__title a'),
            content = menu.find('.course__menu__content');

        toggle.click(function (e) {
            e.preventDefault();
            $(this).text(function(i, v){
               return v == 'Hide' ? 'Show' : 'Hide'
            });
            content.slideToggle();
        });
    },

    initEmployment = function () {
        var wrapper = $('.course__employment');
        if (wrapper.length) {
            var valuesStr = wrapper.attr('data-values') || (wrapper.attr('data-value') + ";0;0"),
                values = valuesStr.split(';').map(function (v) {
                    return parseFloat(v || '0');
                }),
                total = values.reduce(function (acc, v) {
                    return acc + v
                }),
                valueOther = Math.max(0, 100 - total),
                data = new google.visualization.DataTable(),
                options = {
                    backgroundColor: 'transparent',
                    height: '100%',
                    chartArea: {backgroundColor: 'transparent', top: '5%', height: '90%', width: '90%'},
                    animation: {duration: 1000, "startup": true},
                    legend: 'none',
                    pieSliceText: 'none',
                    tooltip: {text: 'percentage'},
                    pieHole: 0.85,
                    slices: {
                        0: {color: '#a22833'},
                        1: {color: '#db6363'},
                        2: {color: '#d99898'},
                        3: {color: '#d9d9d9'}
                    }
                },
                chart = new google.visualization.PieChart(document.getElementById('course-destinations-employment-chart'));

            data.addColumn('string', 'Type');
            data.addColumn('number', '%');
            data.addRow(['In employment', values[0]]);
            data.addRow(['Work and study', values[1]]);
            data.addRow(['Further study', values[2]]);
            data.addRow(['Unemployed', valueOther]);

            return function () {
                chart.draw(data, options);
            };
        } else {
            return false;
        }
    },


    initDestinations = function () {
        return initEmployment();
    },

    initCharts = function () {
        charts.onInit(function () {
            onResize(composeFunctions(initAssessment(), initDestinations()), true);
        });
    },

    initReadMore = function () {
        if ($(window).width() < 600) {
            $('.course__white-box').each(function () {
                var box = $(this),
                    content = box.find('.course__white-box__content');

                if (content.height() > 100) {
                    content.addClass('course__white-box__content--read-more');
                    var button = $('<div class="course__white-box__read-more">' +
                        '<div class="course__white-box__read-more__bg"></div>' +
                        '<a  href="#"><span>read more</span></a>' +
                        '</div>')
                        .click(function (e) {
                            content.removeClass('course__white-box__content--read-more');
                            button.remove();
                            e.preventDefault();
                        }).appendTo(box);
                }
            });

        }
    },

    initKisWidget = function () {
        var widget = $('#unistats-widget-frame');

        if (widget.length > 0) {
            var wrapper = $('.course__kis'),
                update = function () {
                    var src = widget.attr('src'),
                        currentHorizontal = src.indexOf('horizontal') >= 0,
                        neededHorizontal = $(window).width() > 635;

                    if (currentHorizontal !== neededHorizontal) {
                        var nextSrc = neededHorizontal ? src.replace(/vertical/, 'horizontal') : src.replace(/horizontal/, 'vertical'),
                            nextStyle = neededHorizontal ? {width: '615px', height: '150px'} : {
                                    width: '190px',
                                    height: '500px'
                                };

                        widget.attr('src', nextSrc);
                        widget.css(nextStyle);
                        wrapper.toggleClass('course__kis--vertical', !neededHorizontal);
                    }
                };
            onResize(update, true);
        }
    },

    init = function () {
        initKisWidget();
        initAccordions();
        initEntries();
        initTestimonials();
        initCharts();
        initReadMore();
        initApplyDialog();
        initMenu();
        testimonialsBackgroundColor();
    };

defer(init);

// Change testimonial wrapper background colour when user scrolls through items
$(".course__testimonials__wrapper").click(function() {
    testimonialsBackgroundColor();
})


/***/ }),

/***/ 61:
/***/ (function(module, exports, __webpack_require__) {

module.exports = function () {

    var $ = __webpack_require__(0);

    return function (f, runNow) {
        $(window).resize(f);
        if (runNow) {
            f();
        }
    };

}();

/***/ }),

/***/ 62:
/***/ (function(module, exports) {

module.exports = function () {

    var expand = function (expanded, list) {
            for (var i = 0; i < list.length; i++) {
                var item = list[i];

                if (typeof item === 'function') {
                    expanded.push(item);
                } else if (item && item.constructor === Array) {
                    expand(expanded, item);
                }
            }
        },

        compose = function () {
            var expanded = [];
            expand(expanded, arguments);
            return function () {
                for (var i = 0; i < expanded.length; i++) {
                    expanded[i]();
                }
            };
        };

    return compose
}();

/***/ }),

/***/ 63:
/***/ (function(module, exports) {

module.exports = function () {

    var state = 'not-loaded',

        callbacks = [],

        loadComplete = function () {
            state = 'loaded';
            for (var i = 0; i < callbacks.length; i++) {
                callbacks[i]();
            }
        },

        checkLoadComplete = function () {
            if (google.visualization && google.visualization.DataTable) {
                loadComplete();
            } else {
                setTimeout(checkLoadComplete, 100);
            }
        },

        load = function () {
            state = 'loading';

            google.load('visualization', '1.0', {
                'packages': ['corechart'], callback: function () {
                }
            });
            google.setOnLoadCallback(checkLoadComplete);
        },

        onInit = function (f) {
            if (state === 'loaded') {
                f();
            } else {
                callbacks.push(f);
                if (state === 'not-loaded') {
                    load();
                }
            }
        };

    return {
        onInit: onInit
    };
}();


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZjc0NjhmOTM0ZTE4OGE4ZWQ5MTciLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHMvbGlicy9qcXVlcnkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHMvdXRpbHMvZGVmZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHMvY291cnNlLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2RzL3V0aWxzL29uLXJlc2l6ZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvdXRpbHMvY29tcG9zZS1mdW5jdGlvbnMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL3V0aWxzL2NoYXJ0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBLDBCOzs7Ozs7O0FDSEE7QUFDQTs7QUFFQSxZQUFZLG1CQUFPLENBQUMsQ0FBZ0I7O0FBRXBDO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLHVDQUF1QztBQUN2QyxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsRzs7Ozs7OztBQ2pCRDtBQUNBLGVBQWUsbUJBQU8sQ0FBQyxFQUFtQjtBQUMxQyx1QkFBdUIsbUJBQU8sQ0FBQyxFQUE0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QXNCO0FBQ2pEO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDIiwiZmlsZSI6Im1vZHVsZXMvY291cnNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNjApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGY3NDY4ZjkzNGUxODhhOGVkOTE3IiwiLyoqXG4gKiBleHBlY3RzIGpRdWVyeSB0byBiZSBwcm92aWRlZCBieSBDSVRZX1IuanNcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB3aW5kb3cuJDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9qcy9tb2RzL2xpYnMvanF1ZXJ5LmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMSAyIDMgNCA1IDYgNyA4IDkgMTAiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgJCA9IHJlcXVpcmUoJy4uL2xpYnMvanF1ZXJ5Jyk7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKGRlZmVycmVkRnVuY3Rpb24pIHtcbiAgICAgICAgaWYgKHR5cGVvZiBDSVRZICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgJChkZWZlcnJlZEZ1bmN0aW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghd2luZG93LkNJVFlfT1BUSU9OUykge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5DSVRZX09QVElPTlMgPSB7ZGVmZXI6IFtdfTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXdpbmRvdy5DSVRZX09QVElPTlMuZGVmZXIpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuQ0lUWV9PUFRJT05TLmRlZmVyID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBDSVRZX09QVElPTlMuZGVmZXIucHVzaChkZWZlcnJlZEZ1bmN0aW9uKTtcbiAgICAgICAgfVxuICAgIH07XG59KCk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvanMvbW9kcy91dGlscy9kZWZlci5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDEgMiAzIDQgNSA2IDcgOCA5IiwiLy8gJCA9IHJlcXVpcmUoJy4vbGlicy9qcXVlcnknKTtcbnZhciBvblJlc2l6ZSA9IHJlcXVpcmUoJy4vdXRpbHMvb24tcmVzaXplJyksXG4gICAgY29tcG9zZUZ1bmN0aW9ucyA9IHJlcXVpcmUoJy4uL3V0aWxzL2NvbXBvc2UtZnVuY3Rpb25zJyksXG4gICAgZGVmZXIgPSByZXF1aXJlKCcuL3V0aWxzL2RlZmVyJyksXG4gICAgY2hhcnRzID0gcmVxdWlyZSgnLi4vdXRpbHMvY2hhcnRzJyksXG5cbiAgICBpbml0QWNjb3JkaW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCgnLmNvdXJzZV9fYWNjb3JkaW9uJykuYWNjb3JkaW9uKHtcbiAgICAgICAgICAgIGhlaWdodFN0eWxlOiBcImNvbnRlbnRcIixcbiAgICAgICAgICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxuICAgICAgICAgICAgYWN0aXZlOiBmYWxzZSxcbiAgICAgICAgICAgIGFuaW1hdGU6IGZhbHNlLFxuICAgICAgICAgICAgYWN0aXZhdGU6IGZ1bmN0aW9uIChldmVudCwgdWkpIHtcbiAgICAgICAgICAgICAgICBpZiAoISQuaXNFbXB0eU9iamVjdCh1aS5uZXdIZWFkZXIub2Zmc2V0KCkpKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJ2h0bWw6bm90KDphbmltYXRlZCksIGJvZHk6bm90KDphbmltYXRlZCknKS5hbmltYXRlKHtzY3JvbGxUb3A6IHVpLm5ld0hlYWRlci5vZmZzZXQoKS50b3B9LCAnc2xvdycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGluaXRBcHBseURpYWxvZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCgnYVtocmVmPVwiI2FwcGx5LWRpYWxvZ1wiXScpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICQoJyNhcHBseS1kaWFsb2cnKS5kaWFsb2coe1xuICAgICAgICAgICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICAgICAgICAgIGF1dG9PcGVuOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRpYWxvZ0NsYXNzOiBcImFwcGx5LWRpYWxvZ1wiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiBcIkhvdyB0byBBcHBseVwiLFxuICAgICAgICAgICAgICAgIHdpZHRoOiBcIjYwJVwiLFxuICAgICAgICAgICAgICAgIGhlaWdodDogNTAwLFxuICAgICAgICAgICAgICAgIGRyYWdnYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgcmVzaXphYmxlOiBmYWxzZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBpbml0RW50cmllcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCgnLmNvdXJzZV9fZW50cmllcyBzZWxlY3QnKS5jaGFuZ2UoZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGxvY2F0aW9uLmhyZWYgPSAkKHRoaXMpLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLmF0dHIoJ2RhdGEtdXJsJyk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBpbml0VGVzdGltb25pYWxzID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHZhciB3ID0gJCgnLmNvdXJzZV9fcHJvZmlsZXMnKS53aWR0aCgpLFxuICAgICAgICAgICAgbiA9ICQoJy5jb3Vyc2VfX3Byb2ZpbGVzX19pdGVtJykubGVuZ3RoO1xuXG4gICAgICAgIGlmIChuID4gMCkge1xuICAgICAgICAgICAgdmFyIGZpdEFsbFdpZHRoID0gdyAvIG4sXG4gICAgICAgICAgICAgICAgY29udHJvbHMgPSBuID4gMSxcbiAgICAgICAgICAgICAgICBtaW5XaWR0aCA9IE1hdGgubWF4KDMwMCwgZml0QWxsV2lkdGgpLFxuICAgICAgICAgICAgICAgIG1heFNsaWRlcyA9IE1hdGgubWF4KDEsIE1hdGguZmxvb3IodyAvIG1pbldpZHRoKSksXG4gICAgICAgICAgICAgICAgd2lkdGggPSB3IC8gbWF4U2xpZGVzO1xuXG4gICAgICAgICAgICAkKCcuY291cnNlX19wcm9maWxlcyAuaXRlbXMnKS5ieFNsaWRlcih7XG4gICAgICAgICAgICAgICAgcGFnZXI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xzOiBjb250cm9scyxcbiAgICAgICAgICAgICAgICBuZXh0VGV4dDogJzxpIGNsYXNzPVwiZmEgZmEtY2hldnJvbi1yaWdodFwiPjwvaT4nLFxuICAgICAgICAgICAgICAgIHByZXZUZXh0OiAnPGkgY2xhc3M9XCJmYSBmYS1jaGV2cm9uLWxlZnRcIj48L2k+JyxcbiAgICAgICAgICAgICAgICBhZGFwdGl2ZUhlaWdodDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzbGlkZU1hcmdpbjogMCxcbiAgICAgICAgICAgICAgICB0b3VjaEVuYWJsZWQ6IGZhbHNlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIHRlc3RpbW9uaWFsc0JhY2tncm91bmRDb2xvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gR2V0IHRpdGxlIHRleHQgY29sb3VyIG9mIHNlbGVjdGVkIGxpc3QgaXRlbSwgaS5lLiBuZXN0ZWQgaW4gYXJpYS1oaWRkZW49XCJmYWxzZVwiXG4gICAgICAgIHZhciBzZWxlY3RlZEl0ZW1Db2xvciA9ICQoJ2xpLmNvdXJzZV9fcHJvZmlsZXNfX2l0ZW06bm90KFthcmlhLWhpZGRlbio9XCJ0cnVlXCJdKSAuY291cnNlX19wcm9maWxlc19faXRlbV9fdGV4dF9fdGl0bGUnKS5jc3MoXCJjb2xvclwiKTtcblxuICAgICAgICAvLyBBcHBseSBzZWxlY3RlZCB0ZXh0IGNvbG91ciB0byB0ZXN0aW1vbmlhbHMgd3JhcHBlciBiYWNrZ3JvdW5kXG4gICAgICAgICQoJy5jb3Vyc2VfX3Rlc3RpbW9uaWFsc19fd3JhcHBlcicpLmNzcyhcImJhY2tncm91bmRcIiwgc2VsZWN0ZWRJdGVtQ29sb3IpO1xuICAgIH0sXG5cbiAgICBpbml0QXNzZXNzbWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb3Vyc2UtYXNzZXNzbWVudC1jaGFydCcpO1xuXG4gICAgICAgIGlmIChjb250YWluZXIpIHtcbiAgICAgICAgICAgIHZhciBkYXRhID0gbmV3IGdvb2dsZS52aXN1YWxpemF0aW9uLkRhdGFUYWJsZSgpLFxuICAgICAgICAgICAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICAgIGNoYXJ0QXJlYToge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiAxMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvdHRvbTogMzAsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogMzAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAzMDBcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uOiB7ZHVyYXRpb246IDEwMDAsIFwic3RhcnR1cFwiOiB0cnVlfSxcbiAgICAgICAgICAgICAgICAgICAgdG9vbHRpcDoge3RleHQ6ICdwZXJjZW50YWdlJ30sXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnQXNzZXNzbWVudCcsXG4gICAgICAgICAgICAgICAgICAgIHBpZUhvbGU6IDAuNSxcbiAgICAgICAgICAgICAgICAgICAgY29sb3JzOiBbJyMyNTNlNTInLCAnIzNmMTU2MScsICcjZTNhMDJkJywgJyMzOTg2YWMnXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY2hhcnQgPSBuZXcgZ29vZ2xlLnZpc3VhbGl6YXRpb24uUGllQ2hhcnQoY29udGFpbmVyKTtcblxuICAgICAgICAgICAgZGF0YS5hZGRDb2x1bW4oJ3N0cmluZycsICdUeXBlJyk7XG4gICAgICAgICAgICBkYXRhLmFkZENvbHVtbignbnVtYmVyJywgJyUnKTtcblxuICAgICAgICAgICAgJCgnLmNvdXJzZV9fYXNzZXNzbWVudF9fbGlzdCBsaScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBsaSA9ICQodGhpcyk7XG4gICAgICAgICAgICAgICAgZGF0YS5hZGRSb3coW2xpLmF0dHIoJ2RhdGEtbGFiZWwnKSwgcGFyc2VGbG9hdChsaS5hdHRyKCdkYXRhLXZhbHVlJykpXSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjaGFydC5kcmF3KGRhdGEsIG9wdGlvbnMpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBpbml0TWVudSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG1lbnUgPSAkKCcuY291cnNlX19tZW51JyksXG4gICAgICAgICAgICB0b2dnbGUgPSBtZW51LmZpbmQoJy5jb3Vyc2VfX21lbnVfX3RpdGxlIGEnKSxcbiAgICAgICAgICAgIGNvbnRlbnQgPSBtZW51LmZpbmQoJy5jb3Vyc2VfX21lbnVfX2NvbnRlbnQnKTtcblxuICAgICAgICB0b2dnbGUuY2xpY2soZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICQodGhpcykudGV4dChmdW5jdGlvbihpLCB2KXtcbiAgICAgICAgICAgICAgIHJldHVybiB2ID09ICdIaWRlJyA/ICdTaG93JyA6ICdIaWRlJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb250ZW50LnNsaWRlVG9nZ2xlKCk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBpbml0RW1wbG95bWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHdyYXBwZXIgPSAkKCcuY291cnNlX19lbXBsb3ltZW50Jyk7XG4gICAgICAgIGlmICh3cmFwcGVyLmxlbmd0aCkge1xuICAgICAgICAgICAgdmFyIHZhbHVlc1N0ciA9IHdyYXBwZXIuYXR0cignZGF0YS12YWx1ZXMnKSB8fCAod3JhcHBlci5hdHRyKCdkYXRhLXZhbHVlJykgKyBcIjswOzBcIiksXG4gICAgICAgICAgICAgICAgdmFsdWVzID0gdmFsdWVzU3RyLnNwbGl0KCc7JykubWFwKGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KHYgfHwgJzAnKTtcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICB0b3RhbCA9IHZhbHVlcy5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgdikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWNjICsgdlxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIHZhbHVlT3RoZXIgPSBNYXRoLm1heCgwLCAxMDAgLSB0b3RhbCksXG4gICAgICAgICAgICAgICAgZGF0YSA9IG5ldyBnb29nbGUudmlzdWFsaXphdGlvbi5EYXRhVGFibGUoKSxcbiAgICAgICAgICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICBjaGFydEFyZWE6IHtiYWNrZ3JvdW5kQ29sb3I6ICd0cmFuc3BhcmVudCcsIHRvcDogJzUlJywgaGVpZ2h0OiAnOTAlJywgd2lkdGg6ICc5MCUnfSxcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uOiB7ZHVyYXRpb246IDEwMDAsIFwic3RhcnR1cFwiOiB0cnVlfSxcbiAgICAgICAgICAgICAgICAgICAgbGVnZW5kOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgICAgIHBpZVNsaWNlVGV4dDogJ25vbmUnLFxuICAgICAgICAgICAgICAgICAgICB0b29sdGlwOiB7dGV4dDogJ3BlcmNlbnRhZ2UnfSxcbiAgICAgICAgICAgICAgICAgICAgcGllSG9sZTogMC44NSxcbiAgICAgICAgICAgICAgICAgICAgc2xpY2VzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAwOiB7Y29sb3I6ICcjYTIyODMzJ30sXG4gICAgICAgICAgICAgICAgICAgICAgICAxOiB7Y29sb3I6ICcjZGI2MzYzJ30sXG4gICAgICAgICAgICAgICAgICAgICAgICAyOiB7Y29sb3I6ICcjZDk5ODk4J30sXG4gICAgICAgICAgICAgICAgICAgICAgICAzOiB7Y29sb3I6ICcjZDlkOWQ5J31cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY2hhcnQgPSBuZXcgZ29vZ2xlLnZpc3VhbGl6YXRpb24uUGllQ2hhcnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvdXJzZS1kZXN0aW5hdGlvbnMtZW1wbG95bWVudC1jaGFydCcpKTtcblxuICAgICAgICAgICAgZGF0YS5hZGRDb2x1bW4oJ3N0cmluZycsICdUeXBlJyk7XG4gICAgICAgICAgICBkYXRhLmFkZENvbHVtbignbnVtYmVyJywgJyUnKTtcbiAgICAgICAgICAgIGRhdGEuYWRkUm93KFsnSW4gZW1wbG95bWVudCcsIHZhbHVlc1swXV0pO1xuICAgICAgICAgICAgZGF0YS5hZGRSb3coWydXb3JrIGFuZCBzdHVkeScsIHZhbHVlc1sxXV0pO1xuICAgICAgICAgICAgZGF0YS5hZGRSb3coWydGdXJ0aGVyIHN0dWR5JywgdmFsdWVzWzJdXSk7XG4gICAgICAgICAgICBkYXRhLmFkZFJvdyhbJ1VuZW1wbG95ZWQnLCB2YWx1ZU90aGVyXSk7XG5cbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY2hhcnQuZHJhdyhkYXRhLCBvcHRpb25zKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuXG5cbiAgICBpbml0RGVzdGluYXRpb25zID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gaW5pdEVtcGxveW1lbnQoKTtcbiAgICB9LFxuXG4gICAgaW5pdENoYXJ0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2hhcnRzLm9uSW5pdChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBvblJlc2l6ZShjb21wb3NlRnVuY3Rpb25zKGluaXRBc3Nlc3NtZW50KCksIGluaXREZXN0aW5hdGlvbnMoKSksIHRydWUpO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgaW5pdFJlYWRNb3JlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPCA2MDApIHtcbiAgICAgICAgICAgICQoJy5jb3Vyc2VfX3doaXRlLWJveCcpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBib3ggPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICBjb250ZW50ID0gYm94LmZpbmQoJy5jb3Vyc2VfX3doaXRlLWJveF9fY29udGVudCcpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGNvbnRlbnQuaGVpZ2h0KCkgPiAxMDApIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGVudC5hZGRDbGFzcygnY291cnNlX193aGl0ZS1ib3hfX2NvbnRlbnQtLXJlYWQtbW9yZScpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgYnV0dG9uID0gJCgnPGRpdiBjbGFzcz1cImNvdXJzZV9fd2hpdGUtYm94X19yZWFkLW1vcmVcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY291cnNlX193aGl0ZS1ib3hfX3JlYWQtbW9yZV9fYmdcIj48L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8YSAgaHJlZj1cIiNcIj48c3Bhbj5yZWFkIG1vcmU8L3NwYW4+PC9hPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicpXG4gICAgICAgICAgICAgICAgICAgICAgICAuY2xpY2soZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50LnJlbW92ZUNsYXNzKCdjb3Vyc2VfX3doaXRlLWJveF9fY29udGVudC0tcmVhZC1tb3JlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLmFwcGVuZFRvKGJveCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBpbml0S2lzV2lkZ2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgd2lkZ2V0ID0gJCgnI3VuaXN0YXRzLXdpZGdldC1mcmFtZScpO1xuXG4gICAgICAgIGlmICh3aWRnZXQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdmFyIHdyYXBwZXIgPSAkKCcuY291cnNlX19raXMnKSxcbiAgICAgICAgICAgICAgICB1cGRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzcmMgPSB3aWRnZXQuYXR0cignc3JjJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50SG9yaXpvbnRhbCA9IHNyYy5pbmRleE9mKCdob3Jpem9udGFsJykgPj0gMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5lZWRlZEhvcml6b250YWwgPSAkKHdpbmRvdykud2lkdGgoKSA+IDYzNTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudEhvcml6b250YWwgIT09IG5lZWRlZEhvcml6b250YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXh0U3JjID0gbmVlZGVkSG9yaXpvbnRhbCA/IHNyYy5yZXBsYWNlKC92ZXJ0aWNhbC8sICdob3Jpem9udGFsJykgOiBzcmMucmVwbGFjZSgvaG9yaXpvbnRhbC8sICd2ZXJ0aWNhbCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTdHlsZSA9IG5lZWRlZEhvcml6b250YWwgPyB7d2lkdGg6ICc2MTVweCcsIGhlaWdodDogJzE1MHB4J30gOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzE5MHB4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogJzUwMHB4J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWRnZXQuYXR0cignc3JjJywgbmV4dFNyYyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aWRnZXQuY3NzKG5leHRTdHlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB3cmFwcGVyLnRvZ2dsZUNsYXNzKCdjb3Vyc2VfX2tpcy0tdmVydGljYWwnLCAhbmVlZGVkSG9yaXpvbnRhbCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgb25SZXNpemUodXBkYXRlLCB0cnVlKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBpbml0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpbml0S2lzV2lkZ2V0KCk7XG4gICAgICAgIGluaXRBY2NvcmRpb25zKCk7XG4gICAgICAgIGluaXRFbnRyaWVzKCk7XG4gICAgICAgIGluaXRUZXN0aW1vbmlhbHMoKTtcbiAgICAgICAgaW5pdENoYXJ0cygpO1xuICAgICAgICBpbml0UmVhZE1vcmUoKTtcbiAgICAgICAgaW5pdEFwcGx5RGlhbG9nKCk7XG4gICAgICAgIGluaXRNZW51KCk7XG4gICAgICAgIHRlc3RpbW9uaWFsc0JhY2tncm91bmRDb2xvcigpO1xuICAgIH07XG5cbmRlZmVyKGluaXQpO1xuXG4vLyBDaGFuZ2UgdGVzdGltb25pYWwgd3JhcHBlciBiYWNrZ3JvdW5kIGNvbG91ciB3aGVuIHVzZXIgc2Nyb2xscyB0aHJvdWdoIGl0ZW1zXG4kKFwiLmNvdXJzZV9fdGVzdGltb25pYWxzX193cmFwcGVyXCIpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgIHRlc3RpbW9uaWFsc0JhY2tncm91bmRDb2xvcigpO1xufSlcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2pzL21vZHMvY291cnNlLmpzXG4vLyBtb2R1bGUgaWQgPSA2MFxuLy8gbW9kdWxlIGNodW5rcyA9IDIiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcblxuICAgIHZhciAkID0gcmVxdWlyZSgnLi4vbGlicy9qcXVlcnknKTtcblxuICAgIHJldHVybiBmdW5jdGlvbiAoZiwgcnVuTm93KSB7XG4gICAgICAgICQod2luZG93KS5yZXNpemUoZik7XG4gICAgICAgIGlmIChydW5Ob3cpIHtcbiAgICAgICAgICAgIGYoKTtcbiAgICAgICAgfVxuICAgIH07XG5cbn0oKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9qcy9tb2RzL3V0aWxzL29uLXJlc2l6ZS5qc1xuLy8gbW9kdWxlIGlkID0gNjFcbi8vIG1vZHVsZSBjaHVua3MgPSAyIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgZXhwYW5kID0gZnVuY3Rpb24gKGV4cGFuZGVkLCBsaXN0KSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGl0ZW0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgZXhwYW5kZWQucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW0gJiYgaXRlbS5jb25zdHJ1Y3RvciA9PT0gQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgZXhwYW5kKGV4cGFuZGVkLCBpdGVtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgY29tcG9zZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBleHBhbmRlZCA9IFtdO1xuICAgICAgICAgICAgZXhwYW5kKGV4cGFuZGVkLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGV4cGFuZGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGV4cGFuZGVkW2ldKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfTtcblxuICAgIHJldHVybiBjb21wb3NlXG59KCk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvanMvdXRpbHMvY29tcG9zZS1mdW5jdGlvbnMuanNcbi8vIG1vZHVsZSBpZCA9IDYyXG4vLyBtb2R1bGUgY2h1bmtzID0gMiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIHN0YXRlID0gJ25vdC1sb2FkZWQnLFxuXG4gICAgICAgIGNhbGxiYWNrcyA9IFtdLFxuXG4gICAgICAgIGxvYWRDb21wbGV0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHN0YXRlID0gJ2xvYWRlZCc7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrc1tpXSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGNoZWNrTG9hZENvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKGdvb2dsZS52aXN1YWxpemF0aW9uICYmIGdvb2dsZS52aXN1YWxpemF0aW9uLkRhdGFUYWJsZSkge1xuICAgICAgICAgICAgICAgIGxvYWRDb21wbGV0ZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGNoZWNrTG9hZENvbXBsZXRlLCAxMDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzdGF0ZSA9ICdsb2FkaW5nJztcblxuICAgICAgICAgICAgZ29vZ2xlLmxvYWQoJ3Zpc3VhbGl6YXRpb24nLCAnMS4wJywge1xuICAgICAgICAgICAgICAgICdwYWNrYWdlcyc6IFsnY29yZWNoYXJ0J10sIGNhbGxiYWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBnb29nbGUuc2V0T25Mb2FkQ2FsbGJhY2soY2hlY2tMb2FkQ29tcGxldGUpO1xuICAgICAgICB9LFxuXG4gICAgICAgIG9uSW5pdCA9IGZ1bmN0aW9uIChmKSB7XG4gICAgICAgICAgICBpZiAoc3RhdGUgPT09ICdsb2FkZWQnKSB7XG4gICAgICAgICAgICAgICAgZigpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFja3MucHVzaChmKTtcbiAgICAgICAgICAgICAgICBpZiAoc3RhdGUgPT09ICdub3QtbG9hZGVkJykge1xuICAgICAgICAgICAgICAgICAgICBsb2FkKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgb25Jbml0OiBvbkluaXRcbiAgICB9O1xufSgpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvanMvdXRpbHMvY2hhcnRzLmpzXG4vLyBtb2R1bGUgaWQgPSA2M1xuLy8gbW9kdWxlIGNodW5rcyA9IDIiXSwic291cmNlUm9vdCI6IiJ9