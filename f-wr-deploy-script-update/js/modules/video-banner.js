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
/******/ 	return __webpack_require__(__webpack_require__.s = 65);
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

/***/ 65:
/***/ (function(module, exports, __webpack_require__) {

var defer = __webpack_require__(2),
	loadYoutubeVideo = __webpack_require__(66),

	getDataAttributes = function(node) {

		var dataAttrRegex = /^data-(.+)$/;            
        var attrs = {};
        $.each(node[0].attributes, function (index, attribute) {
            var match = attribute.name.match(dataAttrRegex);
            if (match) {
                attrs[match[1]] = attribute.value;
            }
        });

        return attrs;
	},

	getService = function(link){
		var href = link.attr('href') || '';
        var params = getDataAttributes(link);

        var ytMatch = href.match(/(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/);
        if (ytMatch) {
            return {type: 'youtube', id: ytMatch[1], params: params};
        }

        return null;
	},

	loadVideo = function(wrapper, service) {
		switch (service.type) {
	        case 'youtube':
	            return loadYoutubeVideo(wrapper, service);
	        default:
	            return false;
	    }
	},

    init = function() {
    	var link = $('.video-preview__button');

    	if(link.length){
    		var service = getService(link);

	    	if (service) {
		        var parent = link.parent();
		        var wrapper = null;

		        if (parent.hasClass('video-preview')) {
		            wrapper = parent;
		        } else {
		            wrapper = $('<div/>').addClass('video-preview').insertBefore(link);
		            wrapper.append(link);
		        }

		        link.on('click', function (event) {
					
		        	event.preventDefault();
		            loadVideo(wrapper, service);
		            
		        });
	    	}
		}
    };
defer(init);

/***/ }),

/***/ 66:
/***/ (function(module, exports, __webpack_require__) {

var extend = __webpack_require__(67),
    createYoutubePlayer = __webpack_require__(68);

var DEFAULT_PARAMS = {
    frameBorder: "0",
    playerVars: {
        rel: 0,
    }
};

function closeDialog() {

}


function loadYoutubeVideo(wrapper, services) {
    var id = services.id;
    var params = services.params;
    var iframeId = 'ytev-'+id;
    var link = null;
    var h,w;
    var windowWidth = window.innerWidth;

    if(windowWidth >= 1500){
        h=720;
        w=1280;
    }
    else if(windowWidth <= 1499 && windowWidth >= 1050){
        h=480;
        w=854;
    }
    else if(windowWidth <= 1049 && windowWidth >= 800){
        h=360;
        w=640;
    }
    else if(windowWidth <= 799 && windowWidth >= 580){
        h=240;
        w=426;
    }
    else{
        h=160;
        w=300;
    }

    link = wrapper.children('a');
    var fallbackParams = {
        width: w ,
        height: h
    };

    var playerParams = $.extend({},
        DEFAULT_PARAMS,
        fallbackParams,
        params,
        {
            videoId: id,
            events: {
                onInit: function () {
                    var dlg = $('<div></div>')
                        .addClass('dialog')
                        .attr('tabindex', '0')
                        .appendTo($('body'));

                    var buttonwrap = $('<button></button>').attr('type', 'button').appendTo(dlg);

                    var box = $('<div></div>').addClass('dialog__box')
                        .appendTo(dlg);

                    var youtube = $('<div/>').attr('id', iframeId).attr(fallbackParams).appendTo(box);

                    dlg.on('click', function (evt) {
                            dlg.remove();
                            $('html').removeClass('no-scroll');
                    });

                    dlg.on('keydown', function (evt) {
                        if (evt.which === 27) {
                            dlg.remove();
                            $('html').removeClass('no-scroll');
                            evt.preventDefault();
                        }
                    });

                    $('body').append(dlg);
                    dlg.focus();
                    wrapper.addClass('video-preview--loading');
                },
                onReady: function (event) {
                    var player = event.target;
                    var iframe = link.siblings('iframe');

                    wrapper.removeClass('video-preview--loading');
                    wrapper.addClass('media--youtube');
                    player.playVideo();

                   
                }
            }
        }
    );

    $('html').addClass('no-scroll');
    createYoutubePlayer(iframeId, playerParams);
}

module.exports = loadYoutubeVideo;

/***/ }),

/***/ 67:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;
var defineProperty = Object.defineProperty;
var gOPD = Object.getOwnPropertyDescriptor;

var isArray = function isArray(arr) {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(arr);
	}

	return toStr.call(arr) === '[object Array]';
};

var isPlainObject = function isPlainObject(obj) {
	if (!obj || toStr.call(obj) !== '[object Object]') {
		return false;
	}

	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) { /**/ }

	return typeof key === 'undefined' || hasOwn.call(obj, key);
};

// If name is '__proto__', and Object.defineProperty is available, define __proto__ as an own property on target
var setProperty = function setProperty(target, options) {
	if (defineProperty && options.name === '__proto__') {
		defineProperty(target, options.name, {
			enumerable: true,
			configurable: true,
			value: options.newValue,
			writable: true
		});
	} else {
		target[options.name] = options.newValue;
	}
};

// Return undefined instead of __proto__ if '__proto__' is not an own property
var getProperty = function getProperty(obj, name) {
	if (name === '__proto__') {
		if (!hasOwn.call(obj, name)) {
			return void 0;
		} else if (gOPD) {
			// In early versions of node, obj['__proto__'] is buggy when obj has
			// __proto__ as an own property. Object.getOwnPropertyDescriptor() works.
			return gOPD(obj, name).value;
		}
	}

	return obj[name];
};

module.exports = function extend() {
	var options, name, src, copy, copyIsArray, clone;
	var target = arguments[0];
	var i = 1;
	var length = arguments.length;
	var deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}
	if (target == null || (typeof target !== 'object' && typeof target !== 'function')) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = getProperty(target, name);
				copy = getProperty(options, name);

				// Prevent never-ending loop
				if (target !== copy) {
					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						setProperty(target, { name: name, newValue: extend(deep, clone, copy) });

					// Don't bring in undefined values
					} else if (typeof copy !== 'undefined') {
						setProperty(target, { name: name, newValue: copy });
					}
				}
			}
		}
	}

	// Return the modified object
	return target;
};


/***/ }),

/***/ 68:
/***/ (function(module, exports) {

var UNLOADED = 'UNLOADED';
var LOADING = 'LOADING';
var LOADED = 'LOADED';

var apiStatus = UNLOADED;

var pendingPlayers = [];

var players = {};

function createPlayer(id, data) {
    if (apiStatus === LOADED || apiStatus === LOADING) {
        initPlayer(id, data);
    } else {
        pendingPlayers.push({ id: id, data: data });
        if (apiStatus === UNLOADED) {
            loadApi();
        }
    }

}

function initPlayer(id, data) {
    if (data && data.events && data.events.onInit) {
        data.events.onInit();
    }

    var player = new YT.Player(id, data);
    players[id] = {player : player, data : data};
}


function loadApi() {
    apiStatus = LOADING;
    window.onYouTubeIframeAPIReady = function () {
        pendingPlayers.forEach(function(pendingPlayers){ initPlayer(pendingPlayers.id, pendingPlayers.data);});
    };

    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

module.exports = createPlayer;

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZjc0NjhmOTM0ZTE4OGE4ZWQ5MTciLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHMvbGlicy9qcXVlcnkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHMvdXRpbHMvZGVmZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHMvdmlkZW8tYmFubmVyLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2RzL3ZpZGVvLXByZXZpZXcteW91dHViZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZXh0ZW5kL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2RzL3lvdXR1YmUtcGxheWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7QUM3REE7QUFDQTtBQUNBO0FBQ0EsMEI7Ozs7Ozs7QUNIQTtBQUNBOztBQUVBLFlBQVksbUJBQU8sQ0FBQyxDQUFnQjs7QUFFcEM7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsdUNBQXVDO0FBQ3ZDLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxHOzs7Ozs7O0FDakJELFlBQVksbUJBQU8sQ0FBQyxDQUFlO0FBQ25DLG9CQUFvQixtQkFBTyxDQUFDLEVBQXlCOztBQUVyRDs7QUFFQSxvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCOztBQUVBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7O0FBRUY7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxZOzs7Ozs7O0FDaEVBLGFBQWEsbUJBQU8sQ0FBQyxFQUFRO0FBQzdCLDBCQUEwQixtQkFBTyxDQUFDLEVBQWtCOztBQUVwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjs7QUFFckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCOztBQUVyQjtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGtDOzs7Ozs7OztBQ3pHYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7O0FBRW5CO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxFQUFFO0FBQ0Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxPQUFPLFlBQVk7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBLDJCQUEyQixrREFBa0Q7O0FBRTdFO0FBQ0EsTUFBTTtBQUNOLDJCQUEyQiw2QkFBNkI7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDcEhBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsNkJBQTZCLHFCQUFxQjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG1CQUFtQjtBQUNuQjs7O0FBR0E7QUFDQTtBQUNBO0FBQ0Esd0RBQXdELHFEQUFxRDtBQUM3Rzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDhCIiwiZmlsZSI6Im1vZHVsZXMvdmlkZW8tYmFubmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNjUpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGY3NDY4ZjkzNGUxODhhOGVkOTE3IiwiLyoqXG4gKiBleHBlY3RzIGpRdWVyeSB0byBiZSBwcm92aWRlZCBieSBDSVRZX1IuanNcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB3aW5kb3cuJDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9qcy9tb2RzL2xpYnMvanF1ZXJ5LmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMSAyIDMgNCA1IDYgNyA4IDkgMTAiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgJCA9IHJlcXVpcmUoJy4uL2xpYnMvanF1ZXJ5Jyk7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKGRlZmVycmVkRnVuY3Rpb24pIHtcbiAgICAgICAgaWYgKHR5cGVvZiBDSVRZICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgJChkZWZlcnJlZEZ1bmN0aW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghd2luZG93LkNJVFlfT1BUSU9OUykge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5DSVRZX09QVElPTlMgPSB7ZGVmZXI6IFtdfTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXdpbmRvdy5DSVRZX09QVElPTlMuZGVmZXIpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuQ0lUWV9PUFRJT05TLmRlZmVyID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBDSVRZX09QVElPTlMuZGVmZXIucHVzaChkZWZlcnJlZEZ1bmN0aW9uKTtcbiAgICAgICAgfVxuICAgIH07XG59KCk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvanMvbW9kcy91dGlscy9kZWZlci5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDEgMiAzIDQgNSA2IDcgOCA5IiwidmFyIGRlZmVyID0gcmVxdWlyZSgnLi91dGlscy9kZWZlcicpLFxuXHRsb2FkWW91dHViZVZpZGVvID0gcmVxdWlyZSgnLi92aWRlby1wcmV2aWV3LXlvdXR1YmUnKSxcblxuXHRnZXREYXRhQXR0cmlidXRlcyA9IGZ1bmN0aW9uKG5vZGUpIHtcblxuXHRcdHZhciBkYXRhQXR0clJlZ2V4ID0gL15kYXRhLSguKykkLzsgICAgICAgICAgICBcbiAgICAgICAgdmFyIGF0dHJzID0ge307XG4gICAgICAgICQuZWFjaChub2RlWzBdLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uIChpbmRleCwgYXR0cmlidXRlKSB7XG4gICAgICAgICAgICB2YXIgbWF0Y2ggPSBhdHRyaWJ1dGUubmFtZS5tYXRjaChkYXRhQXR0clJlZ2V4KTtcbiAgICAgICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgICAgIGF0dHJzW21hdGNoWzFdXSA9IGF0dHJpYnV0ZS52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGF0dHJzO1xuXHR9LFxuXG5cdGdldFNlcnZpY2UgPSBmdW5jdGlvbihsaW5rKXtcblx0XHR2YXIgaHJlZiA9IGxpbmsuYXR0cignaHJlZicpIHx8ICcnO1xuICAgICAgICB2YXIgcGFyYW1zID0gZ2V0RGF0YUF0dHJpYnV0ZXMobGluayk7XG5cbiAgICAgICAgdmFyIHl0TWF0Y2ggPSBocmVmLm1hdGNoKC8oPzpodHRwcz86XFwvXFwvKT8oPzp3d3dcXC4pP3lvdXR1XFwuP2JlKD86XFwuY29tKT9cXC8/LiooPzp3YXRjaHxlbWJlZCk/KD86Lip2PXx2XFwvfFxcLykoW1xcd1xcLV9dKylcXCY/Lyk7XG4gICAgICAgIGlmICh5dE1hdGNoKSB7XG4gICAgICAgICAgICByZXR1cm4ge3R5cGU6ICd5b3V0dWJlJywgaWQ6IHl0TWF0Y2hbMV0sIHBhcmFtczogcGFyYW1zfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuXHR9LFxuXG5cdGxvYWRWaWRlbyA9IGZ1bmN0aW9uKHdyYXBwZXIsIHNlcnZpY2UpIHtcblx0XHRzd2l0Y2ggKHNlcnZpY2UudHlwZSkge1xuXHQgICAgICAgIGNhc2UgJ3lvdXR1YmUnOlxuXHQgICAgICAgICAgICByZXR1cm4gbG9hZFlvdXR1YmVWaWRlbyh3cmFwcGVyLCBzZXJ2aWNlKTtcblx0ICAgICAgICBkZWZhdWx0OlxuXHQgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cdCAgICB9XG5cdH0sXG5cbiAgICBpbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgXHR2YXIgbGluayA9ICQoJy52aWRlby1wcmV2aWV3X19idXR0b24nKTtcblxuICAgIFx0aWYobGluay5sZW5ndGgpe1xuICAgIFx0XHR2YXIgc2VydmljZSA9IGdldFNlcnZpY2UobGluayk7XG5cblx0ICAgIFx0aWYgKHNlcnZpY2UpIHtcblx0XHQgICAgICAgIHZhciBwYXJlbnQgPSBsaW5rLnBhcmVudCgpO1xuXHRcdCAgICAgICAgdmFyIHdyYXBwZXIgPSBudWxsO1xuXG5cdFx0ICAgICAgICBpZiAocGFyZW50Lmhhc0NsYXNzKCd2aWRlby1wcmV2aWV3JykpIHtcblx0XHQgICAgICAgICAgICB3cmFwcGVyID0gcGFyZW50O1xuXHRcdCAgICAgICAgfSBlbHNlIHtcblx0XHQgICAgICAgICAgICB3cmFwcGVyID0gJCgnPGRpdi8+JykuYWRkQ2xhc3MoJ3ZpZGVvLXByZXZpZXcnKS5pbnNlcnRCZWZvcmUobGluayk7XG5cdFx0ICAgICAgICAgICAgd3JhcHBlci5hcHBlbmQobGluayk7XG5cdFx0ICAgICAgICB9XG5cblx0XHQgICAgICAgIGxpbmsub24oJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0XHRcdFx0XG5cdFx0ICAgICAgICBcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0ICAgICAgICAgICAgbG9hZFZpZGVvKHdyYXBwZXIsIHNlcnZpY2UpO1xuXHRcdCAgICAgICAgICAgIFxuXHRcdCAgICAgICAgfSk7XG5cdCAgICBcdH1cblx0XHR9XG4gICAgfTtcbmRlZmVyKGluaXQpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2pzL21vZHMvdmlkZW8tYmFubmVyLmpzXG4vLyBtb2R1bGUgaWQgPSA2NVxuLy8gbW9kdWxlIGNodW5rcyA9IDMiLCJ2YXIgZXh0ZW5kID0gcmVxdWlyZSgnZXh0ZW5kJyksXG4gICAgY3JlYXRlWW91dHViZVBsYXllciA9IHJlcXVpcmUoJy4veW91dHViZS1wbGF5ZXInKTtcblxudmFyIERFRkFVTFRfUEFSQU1TID0ge1xuICAgIGZyYW1lQm9yZGVyOiBcIjBcIixcbiAgICBwbGF5ZXJWYXJzOiB7XG4gICAgICAgIHJlbDogMCxcbiAgICB9XG59O1xuXG5mdW5jdGlvbiBjbG9zZURpYWxvZygpIHtcblxufVxuXG5cbmZ1bmN0aW9uIGxvYWRZb3V0dWJlVmlkZW8od3JhcHBlciwgc2VydmljZXMpIHtcbiAgICB2YXIgaWQgPSBzZXJ2aWNlcy5pZDtcbiAgICB2YXIgcGFyYW1zID0gc2VydmljZXMucGFyYW1zO1xuICAgIHZhciBpZnJhbWVJZCA9ICd5dGV2LScraWQ7XG4gICAgdmFyIGxpbmsgPSBudWxsO1xuICAgIHZhciBoLHc7XG4gICAgdmFyIHdpbmRvd1dpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG5cbiAgICBpZih3aW5kb3dXaWR0aCA+PSAxNTAwKXtcbiAgICAgICAgaD03MjA7XG4gICAgICAgIHc9MTI4MDtcbiAgICB9XG4gICAgZWxzZSBpZih3aW5kb3dXaWR0aCA8PSAxNDk5ICYmIHdpbmRvd1dpZHRoID49IDEwNTApe1xuICAgICAgICBoPTQ4MDtcbiAgICAgICAgdz04NTQ7XG4gICAgfVxuICAgIGVsc2UgaWYod2luZG93V2lkdGggPD0gMTA0OSAmJiB3aW5kb3dXaWR0aCA+PSA4MDApe1xuICAgICAgICBoPTM2MDtcbiAgICAgICAgdz02NDA7XG4gICAgfVxuICAgIGVsc2UgaWYod2luZG93V2lkdGggPD0gNzk5ICYmIHdpbmRvd1dpZHRoID49IDU4MCl7XG4gICAgICAgIGg9MjQwO1xuICAgICAgICB3PTQyNjtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgICAgaD0xNjA7XG4gICAgICAgIHc9MzAwO1xuICAgIH1cblxuICAgIGxpbmsgPSB3cmFwcGVyLmNoaWxkcmVuKCdhJyk7XG4gICAgdmFyIGZhbGxiYWNrUGFyYW1zID0ge1xuICAgICAgICB3aWR0aDogdyAsXG4gICAgICAgIGhlaWdodDogaFxuICAgIH07XG5cbiAgICB2YXIgcGxheWVyUGFyYW1zID0gJC5leHRlbmQoe30sXG4gICAgICAgIERFRkFVTFRfUEFSQU1TLFxuICAgICAgICBmYWxsYmFja1BhcmFtcyxcbiAgICAgICAgcGFyYW1zLFxuICAgICAgICB7XG4gICAgICAgICAgICB2aWRlb0lkOiBpZCxcbiAgICAgICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgICAgIG9uSW5pdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGxnID0gJCgnPGRpdj48L2Rpdj4nKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdkaWFsb2cnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ3RhYmluZGV4JywgJzAnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZFRvKCQoJ2JvZHknKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGJ1dHRvbndyYXAgPSAkKCc8YnV0dG9uPjwvYnV0dG9uPicpLmF0dHIoJ3R5cGUnLCAnYnV0dG9uJykuYXBwZW5kVG8oZGxnKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgYm94ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZGlhbG9nX19ib3gnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZFRvKGRsZyk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHlvdXR1YmUgPSAkKCc8ZGl2Lz4nKS5hdHRyKCdpZCcsIGlmcmFtZUlkKS5hdHRyKGZhbGxiYWNrUGFyYW1zKS5hcHBlbmRUbyhib3gpO1xuXG4gICAgICAgICAgICAgICAgICAgIGRsZy5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGxnLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ2h0bWwnKS5yZW1vdmVDbGFzcygnbm8tc2Nyb2xsJyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGRsZy5vbigna2V5ZG93bicsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChldnQud2hpY2ggPT09IDI3KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGxnLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ2h0bWwnKS5yZW1vdmVDbGFzcygnbm8tc2Nyb2xsJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICQoJ2JvZHknKS5hcHBlbmQoZGxnKTtcbiAgICAgICAgICAgICAgICAgICAgZGxnLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgIHdyYXBwZXIuYWRkQ2xhc3MoJ3ZpZGVvLXByZXZpZXctLWxvYWRpbmcnKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG9uUmVhZHk6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcGxheWVyID0gZXZlbnQudGFyZ2V0O1xuICAgICAgICAgICAgICAgICAgICB2YXIgaWZyYW1lID0gbGluay5zaWJsaW5ncygnaWZyYW1lJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgd3JhcHBlci5yZW1vdmVDbGFzcygndmlkZW8tcHJldmlldy0tbG9hZGluZycpO1xuICAgICAgICAgICAgICAgICAgICB3cmFwcGVyLmFkZENsYXNzKCdtZWRpYS0teW91dHViZScpO1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIucGxheVZpZGVvKCk7XG5cbiAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICApO1xuXG4gICAgJCgnaHRtbCcpLmFkZENsYXNzKCduby1zY3JvbGwnKTtcbiAgICBjcmVhdGVZb3V0dWJlUGxheWVyKGlmcmFtZUlkLCBwbGF5ZXJQYXJhbXMpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxvYWRZb3V0dWJlVmlkZW87XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvanMvbW9kcy92aWRlby1wcmV2aWV3LXlvdXR1YmUuanNcbi8vIG1vZHVsZSBpZCA9IDY2XG4vLyBtb2R1bGUgY2h1bmtzID0gMyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgdG9TdHIgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xudmFyIGRlZmluZVByb3BlcnR5ID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xudmFyIGdPUEQgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuXG52YXIgaXNBcnJheSA9IGZ1bmN0aW9uIGlzQXJyYXkoYXJyKSB7XG5cdGlmICh0eXBlb2YgQXJyYXkuaXNBcnJheSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdHJldHVybiBBcnJheS5pc0FycmF5KGFycik7XG5cdH1cblxuXHRyZXR1cm4gdG9TdHIuY2FsbChhcnIpID09PSAnW29iamVjdCBBcnJheV0nO1xufTtcblxudmFyIGlzUGxhaW5PYmplY3QgPSBmdW5jdGlvbiBpc1BsYWluT2JqZWN0KG9iaikge1xuXHRpZiAoIW9iaiB8fCB0b1N0ci5jYWxsKG9iaikgIT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0dmFyIGhhc093bkNvbnN0cnVjdG9yID0gaGFzT3duLmNhbGwob2JqLCAnY29uc3RydWN0b3InKTtcblx0dmFyIGhhc0lzUHJvdG90eXBlT2YgPSBvYmouY29uc3RydWN0b3IgJiYgb2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZSAmJiBoYXNPd24uY2FsbChvYmouY29uc3RydWN0b3IucHJvdG90eXBlLCAnaXNQcm90b3R5cGVPZicpO1xuXHQvLyBOb3Qgb3duIGNvbnN0cnVjdG9yIHByb3BlcnR5IG11c3QgYmUgT2JqZWN0XG5cdGlmIChvYmouY29uc3RydWN0b3IgJiYgIWhhc093bkNvbnN0cnVjdG9yICYmICFoYXNJc1Byb3RvdHlwZU9mKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0Ly8gT3duIHByb3BlcnRpZXMgYXJlIGVudW1lcmF0ZWQgZmlyc3RseSwgc28gdG8gc3BlZWQgdXAsXG5cdC8vIGlmIGxhc3Qgb25lIGlzIG93biwgdGhlbiBhbGwgcHJvcGVydGllcyBhcmUgb3duLlxuXHR2YXIga2V5O1xuXHRmb3IgKGtleSBpbiBvYmopIHsgLyoqLyB9XG5cblx0cmV0dXJuIHR5cGVvZiBrZXkgPT09ICd1bmRlZmluZWQnIHx8IGhhc093bi5jYWxsKG9iaiwga2V5KTtcbn07XG5cbi8vIElmIG5hbWUgaXMgJ19fcHJvdG9fXycsIGFuZCBPYmplY3QuZGVmaW5lUHJvcGVydHkgaXMgYXZhaWxhYmxlLCBkZWZpbmUgX19wcm90b19fIGFzIGFuIG93biBwcm9wZXJ0eSBvbiB0YXJnZXRcbnZhciBzZXRQcm9wZXJ0eSA9IGZ1bmN0aW9uIHNldFByb3BlcnR5KHRhcmdldCwgb3B0aW9ucykge1xuXHRpZiAoZGVmaW5lUHJvcGVydHkgJiYgb3B0aW9ucy5uYW1lID09PSAnX19wcm90b19fJykge1xuXHRcdGRlZmluZVByb3BlcnR5KHRhcmdldCwgb3B0aW9ucy5uYW1lLCB7XG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxuXHRcdFx0dmFsdWU6IG9wdGlvbnMubmV3VmFsdWUsXG5cdFx0XHR3cml0YWJsZTogdHJ1ZVxuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdHRhcmdldFtvcHRpb25zLm5hbWVdID0gb3B0aW9ucy5uZXdWYWx1ZTtcblx0fVxufTtcblxuLy8gUmV0dXJuIHVuZGVmaW5lZCBpbnN0ZWFkIG9mIF9fcHJvdG9fXyBpZiAnX19wcm90b19fJyBpcyBub3QgYW4gb3duIHByb3BlcnR5XG52YXIgZ2V0UHJvcGVydHkgPSBmdW5jdGlvbiBnZXRQcm9wZXJ0eShvYmosIG5hbWUpIHtcblx0aWYgKG5hbWUgPT09ICdfX3Byb3RvX18nKSB7XG5cdFx0aWYgKCFoYXNPd24uY2FsbChvYmosIG5hbWUpKSB7XG5cdFx0XHRyZXR1cm4gdm9pZCAwO1xuXHRcdH0gZWxzZSBpZiAoZ09QRCkge1xuXHRcdFx0Ly8gSW4gZWFybHkgdmVyc2lvbnMgb2Ygbm9kZSwgb2JqWydfX3Byb3RvX18nXSBpcyBidWdneSB3aGVuIG9iaiBoYXNcblx0XHRcdC8vIF9fcHJvdG9fXyBhcyBhbiBvd24gcHJvcGVydHkuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoKSB3b3Jrcy5cblx0XHRcdHJldHVybiBnT1BEKG9iaiwgbmFtZSkudmFsdWU7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIG9ialtuYW1lXTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZXh0ZW5kKCkge1xuXHR2YXIgb3B0aW9ucywgbmFtZSwgc3JjLCBjb3B5LCBjb3B5SXNBcnJheSwgY2xvbmU7XG5cdHZhciB0YXJnZXQgPSBhcmd1bWVudHNbMF07XG5cdHZhciBpID0gMTtcblx0dmFyIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG5cdHZhciBkZWVwID0gZmFsc2U7XG5cblx0Ly8gSGFuZGxlIGEgZGVlcCBjb3B5IHNpdHVhdGlvblxuXHRpZiAodHlwZW9mIHRhcmdldCA9PT0gJ2Jvb2xlYW4nKSB7XG5cdFx0ZGVlcCA9IHRhcmdldDtcblx0XHR0YXJnZXQgPSBhcmd1bWVudHNbMV0gfHwge307XG5cdFx0Ly8gc2tpcCB0aGUgYm9vbGVhbiBhbmQgdGhlIHRhcmdldFxuXHRcdGkgPSAyO1xuXHR9XG5cdGlmICh0YXJnZXQgPT0gbnVsbCB8fCAodHlwZW9mIHRhcmdldCAhPT0gJ29iamVjdCcgJiYgdHlwZW9mIHRhcmdldCAhPT0gJ2Z1bmN0aW9uJykpIHtcblx0XHR0YXJnZXQgPSB7fTtcblx0fVxuXG5cdGZvciAoOyBpIDwgbGVuZ3RoOyArK2kpIHtcblx0XHRvcHRpb25zID0gYXJndW1lbnRzW2ldO1xuXHRcdC8vIE9ubHkgZGVhbCB3aXRoIG5vbi1udWxsL3VuZGVmaW5lZCB2YWx1ZXNcblx0XHRpZiAob3B0aW9ucyAhPSBudWxsKSB7XG5cdFx0XHQvLyBFeHRlbmQgdGhlIGJhc2Ugb2JqZWN0XG5cdFx0XHRmb3IgKG5hbWUgaW4gb3B0aW9ucykge1xuXHRcdFx0XHRzcmMgPSBnZXRQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpO1xuXHRcdFx0XHRjb3B5ID0gZ2V0UHJvcGVydHkob3B0aW9ucywgbmFtZSk7XG5cblx0XHRcdFx0Ly8gUHJldmVudCBuZXZlci1lbmRpbmcgbG9vcFxuXHRcdFx0XHRpZiAodGFyZ2V0ICE9PSBjb3B5KSB7XG5cdFx0XHRcdFx0Ly8gUmVjdXJzZSBpZiB3ZSdyZSBtZXJnaW5nIHBsYWluIG9iamVjdHMgb3IgYXJyYXlzXG5cdFx0XHRcdFx0aWYgKGRlZXAgJiYgY29weSAmJiAoaXNQbGFpbk9iamVjdChjb3B5KSB8fCAoY29weUlzQXJyYXkgPSBpc0FycmF5KGNvcHkpKSkpIHtcblx0XHRcdFx0XHRcdGlmIChjb3B5SXNBcnJheSkge1xuXHRcdFx0XHRcdFx0XHRjb3B5SXNBcnJheSA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRjbG9uZSA9IHNyYyAmJiBpc0FycmF5KHNyYykgPyBzcmMgOiBbXTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGNsb25lID0gc3JjICYmIGlzUGxhaW5PYmplY3Qoc3JjKSA/IHNyYyA6IHt9O1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBOZXZlciBtb3ZlIG9yaWdpbmFsIG9iamVjdHMsIGNsb25lIHRoZW1cblx0XHRcdFx0XHRcdHNldFByb3BlcnR5KHRhcmdldCwgeyBuYW1lOiBuYW1lLCBuZXdWYWx1ZTogZXh0ZW5kKGRlZXAsIGNsb25lLCBjb3B5KSB9KTtcblxuXHRcdFx0XHRcdC8vIERvbid0IGJyaW5nIGluIHVuZGVmaW5lZCB2YWx1ZXNcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiBjb3B5ICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRcdFx0c2V0UHJvcGVydHkodGFyZ2V0LCB7IG5hbWU6IG5hbWUsIG5ld1ZhbHVlOiBjb3B5IH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIFJldHVybiB0aGUgbW9kaWZpZWQgb2JqZWN0XG5cdHJldHVybiB0YXJnZXQ7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvZXh0ZW5kL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA2N1xuLy8gbW9kdWxlIGNodW5rcyA9IDMiLCJ2YXIgVU5MT0FERUQgPSAnVU5MT0FERUQnO1xudmFyIExPQURJTkcgPSAnTE9BRElORyc7XG52YXIgTE9BREVEID0gJ0xPQURFRCc7XG5cbnZhciBhcGlTdGF0dXMgPSBVTkxPQURFRDtcblxudmFyIHBlbmRpbmdQbGF5ZXJzID0gW107XG5cbnZhciBwbGF5ZXJzID0ge307XG5cbmZ1bmN0aW9uIGNyZWF0ZVBsYXllcihpZCwgZGF0YSkge1xuICAgIGlmIChhcGlTdGF0dXMgPT09IExPQURFRCB8fCBhcGlTdGF0dXMgPT09IExPQURJTkcpIHtcbiAgICAgICAgaW5pdFBsYXllcihpZCwgZGF0YSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcGVuZGluZ1BsYXllcnMucHVzaCh7IGlkOiBpZCwgZGF0YTogZGF0YSB9KTtcbiAgICAgICAgaWYgKGFwaVN0YXR1cyA9PT0gVU5MT0FERUQpIHtcbiAgICAgICAgICAgIGxvYWRBcGkoKTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuXG5mdW5jdGlvbiBpbml0UGxheWVyKGlkLCBkYXRhKSB7XG4gICAgaWYgKGRhdGEgJiYgZGF0YS5ldmVudHMgJiYgZGF0YS5ldmVudHMub25Jbml0KSB7XG4gICAgICAgIGRhdGEuZXZlbnRzLm9uSW5pdCgpO1xuICAgIH1cblxuICAgIHZhciBwbGF5ZXIgPSBuZXcgWVQuUGxheWVyKGlkLCBkYXRhKTtcbiAgICBwbGF5ZXJzW2lkXSA9IHtwbGF5ZXIgOiBwbGF5ZXIsIGRhdGEgOiBkYXRhfTtcbn1cblxuXG5mdW5jdGlvbiBsb2FkQXBpKCkge1xuICAgIGFwaVN0YXR1cyA9IExPQURJTkc7XG4gICAgd2luZG93Lm9uWW91VHViZUlmcmFtZUFQSVJlYWR5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBwZW5kaW5nUGxheWVycy5mb3JFYWNoKGZ1bmN0aW9uKHBlbmRpbmdQbGF5ZXJzKXsgaW5pdFBsYXllcihwZW5kaW5nUGxheWVycy5pZCwgcGVuZGluZ1BsYXllcnMuZGF0YSk7fSk7XG4gICAgfTtcblxuICAgIHZhciB0YWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICB0YWcuc3JjID0gXCJodHRwczovL3d3dy55b3V0dWJlLmNvbS9pZnJhbWVfYXBpXCI7XG4gICAgdmFyIGZpcnN0U2NyaXB0VGFnID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdO1xuICAgIGZpcnN0U2NyaXB0VGFnLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRhZywgZmlyc3RTY3JpcHRUYWcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZVBsYXllcjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9qcy9tb2RzL3lvdXR1YmUtcGxheWVyLmpzXG4vLyBtb2R1bGUgaWQgPSA2OFxuLy8gbW9kdWxlIGNodW5rcyA9IDMiXSwic291cmNlUm9vdCI6IiJ9