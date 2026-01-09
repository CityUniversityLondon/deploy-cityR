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
/******/ 	return __webpack_require__(__webpack_require__.s = 56);
/******/ })
/************************************************************************/
/******/ ({

/***/ 56:
/***/ (function(module, exports) {

!function () {
    'use strict';
    var mobileNav = function () {
            var container = $('.mobile-nav');

            container.find('.mobile-nav-toggle').click(function (e) {
                e.preventDefault();
                container.toggleClass('open');
            });
        },

        accordion = function () {
            var accordions = $('.accordion'),
                closeItem = function (item) {
                    item.removeClass('open');
                    item.attr('aria-expanded', 'false');
                    item.find('.accordion-content').slideUp("fast");
                    item.find('.fa-minus').removeClass('fa-minus').addClass('fa-plus');
                },
                openItem = function (item) {
                    item.addClass('open');
                    item.attr('aria-expanded', 'true');
                    item.find('.accordion-content').slideDown("fast");
                    item.find('.fa-plus').removeClass('fa-plus').addClass('fa-minus');
                };

            accordions.each(function () {
                var accordion = $(this);

                accordion.find('.accordion-title').click(function () {
                    var title = $(this),
                        item = title.closest('.accordion-item'),
                        isOpen = item.hasClass('open');

                    if (isOpen) {
                        closeItem(item);
                    } else {
                        closeItem(accordion.find('.accordion-item.open'));
                        openItem(item);
                    }
                });
            });
        },

        logFallBack = function () {
            if (!Modernizr.svg) {
                $(".footer-logo img").attr("src", function () {
                    return $(this).attr("src").replace(".svg", ".png");
                });
            }
        },

        imageCredits = function () {
            var $credits = $(".image-credit"),
                $creditItems = $(".credits-items"),
                $scpCreditsTitle = $(".credits-title"),
                creditButtonClass = ".image-credit__button",

                toggleImageCredit = function(node) {
                    var state = node.attr("aria-pressed") === "true" ? "false" : "true";
                    node.attr("aria-pressed", state);
                    node.parent().attr("aria-expanded", state);
                };

            $credits.each(function () {
                $(this).find(creditButtonClass).click(function(event) {
                    event.preventDefault();
                    toggleImageCredit($(this));
                });
            });

            $scpCreditsTitle.on("click", function () {
                $(this).toggleClass("credits-title--active")
                    .next(".credits-items").toggleClass("sr-only");
            });
        },

        init = function () {
            mobileNav();
            accordion();
            logFallBack();
            imageCredits();
        };

    $(init);
}();


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZjc0NjhmOTM0ZTE4OGE4ZWQ5MTciLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2NpdHlzcG9ydC9jaXR5c3BvcnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7OztBQzdEQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2IsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLGFBQWE7O0FBRWI7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsQ0FBQyIsImZpbGUiOiJjaXR5c3BvcnQvY2l0eXNwb3J0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNTYpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGY3NDY4ZjkzNGUxODhhOGVkOTE3IiwiIWZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgdmFyIG1vYmlsZU5hdiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjb250YWluZXIgPSAkKCcubW9iaWxlLW5hdicpO1xuXG4gICAgICAgICAgICBjb250YWluZXIuZmluZCgnLm1vYmlsZS1uYXYtdG9nZ2xlJykuY2xpY2soZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgY29udGFpbmVyLnRvZ2dsZUNsYXNzKCdvcGVuJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBhY2NvcmRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYWNjb3JkaW9ucyA9ICQoJy5hY2NvcmRpb24nKSxcbiAgICAgICAgICAgICAgICBjbG9zZUl0ZW0gPSBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICBpdGVtLnJlbW92ZUNsYXNzKCdvcGVuJyk7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uYXR0cignYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuICAgICAgICAgICAgICAgICAgICBpdGVtLmZpbmQoJy5hY2NvcmRpb24tY29udGVudCcpLnNsaWRlVXAoXCJmYXN0XCIpO1xuICAgICAgICAgICAgICAgICAgICBpdGVtLmZpbmQoJy5mYS1taW51cycpLnJlbW92ZUNsYXNzKCdmYS1taW51cycpLmFkZENsYXNzKCdmYS1wbHVzJyk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBvcGVuSXRlbSA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uYWRkQ2xhc3MoJ29wZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5maW5kKCcuYWNjb3JkaW9uLWNvbnRlbnQnKS5zbGlkZURvd24oXCJmYXN0XCIpO1xuICAgICAgICAgICAgICAgICAgICBpdGVtLmZpbmQoJy5mYS1wbHVzJykucmVtb3ZlQ2xhc3MoJ2ZhLXBsdXMnKS5hZGRDbGFzcygnZmEtbWludXMnKTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBhY2NvcmRpb25zLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBhY2NvcmRpb24gPSAkKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgYWNjb3JkaW9uLmZpbmQoJy5hY2NvcmRpb24tdGl0bGUnKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0aXRsZSA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtID0gdGl0bGUuY2xvc2VzdCgnLmFjY29yZGlvbi1pdGVtJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBpc09wZW4gPSBpdGVtLmhhc0NsYXNzKCdvcGVuJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzT3Blbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2VJdGVtKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2VJdGVtKGFjY29yZGlvbi5maW5kKCcuYWNjb3JkaW9uLWl0ZW0ub3BlbicpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5JdGVtKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBsb2dGYWxsQmFjayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghTW9kZXJuaXpyLnN2Zykge1xuICAgICAgICAgICAgICAgICQoXCIuZm9vdGVyLWxvZ28gaW1nXCIpLmF0dHIoXCJzcmNcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJCh0aGlzKS5hdHRyKFwic3JjXCIpLnJlcGxhY2UoXCIuc3ZnXCIsIFwiLnBuZ1wiKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBpbWFnZUNyZWRpdHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgJGNyZWRpdHMgPSAkKFwiLmltYWdlLWNyZWRpdFwiKSxcbiAgICAgICAgICAgICAgICAkY3JlZGl0SXRlbXMgPSAkKFwiLmNyZWRpdHMtaXRlbXNcIiksXG4gICAgICAgICAgICAgICAgJHNjcENyZWRpdHNUaXRsZSA9ICQoXCIuY3JlZGl0cy10aXRsZVwiKSxcbiAgICAgICAgICAgICAgICBjcmVkaXRCdXR0b25DbGFzcyA9IFwiLmltYWdlLWNyZWRpdF9fYnV0dG9uXCIsXG5cbiAgICAgICAgICAgICAgICB0b2dnbGVJbWFnZUNyZWRpdCA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXRlID0gbm9kZS5hdHRyKFwiYXJpYS1wcmVzc2VkXCIpID09PSBcInRydWVcIiA/IFwiZmFsc2VcIiA6IFwidHJ1ZVwiO1xuICAgICAgICAgICAgICAgICAgICBub2RlLmF0dHIoXCJhcmlhLXByZXNzZWRcIiwgc3RhdGUpO1xuICAgICAgICAgICAgICAgICAgICBub2RlLnBhcmVudCgpLmF0dHIoXCJhcmlhLWV4cGFuZGVkXCIsIHN0YXRlKTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkY3JlZGl0cy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoY3JlZGl0QnV0dG9uQ2xhc3MpLmNsaWNrKGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZUltYWdlQ3JlZGl0KCQodGhpcykpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICRzY3BDcmVkaXRzVGl0bGUub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS50b2dnbGVDbGFzcyhcImNyZWRpdHMtdGl0bGUtLWFjdGl2ZVwiKVxuICAgICAgICAgICAgICAgICAgICAubmV4dChcIi5jcmVkaXRzLWl0ZW1zXCIpLnRvZ2dsZUNsYXNzKFwic3Itb25seVwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIGluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBtb2JpbGVOYXYoKTtcbiAgICAgICAgICAgIGFjY29yZGlvbigpO1xuICAgICAgICAgICAgbG9nRmFsbEJhY2soKTtcbiAgICAgICAgICAgIGltYWdlQ3JlZGl0cygpO1xuICAgICAgICB9O1xuXG4gICAgJChpbml0KTtcbn0oKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2pzL2NpdHlzcG9ydC9jaXR5c3BvcnQuanNcbi8vIG1vZHVsZSBpZCA9IDU2XG4vLyBtb2R1bGUgY2h1bmtzID0gMTMiXSwic291cmNlUm9vdCI6IiJ9