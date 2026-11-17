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
/******/ 	return __webpack_require__(__webpack_require__.s = 69);
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

/***/ 4:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */

/*global define: false Mustache: true*/

(function defineMustache (global, factory) {
  if (typeof exports === 'object' && exports && typeof exports.nodeName !== 'string') {
    factory(exports); // CommonJS
  } else if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
  } else {
    global.Mustache = {};
    factory(global.Mustache); // script, wsh, asp
  }
}(this, function mustacheFactory (mustache) {

  var objectToString = Object.prototype.toString;
  var isArray = Array.isArray || function isArrayPolyfill (object) {
    return objectToString.call(object) === '[object Array]';
  };

  function isFunction (object) {
    return typeof object === 'function';
  }

  /**
   * More correct typeof string handling array
   * which normally returns typeof 'object'
   */
  function typeStr (obj) {
    return isArray(obj) ? 'array' : typeof obj;
  }

  function escapeRegExp (string) {
    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
  }

  /**
   * Null safe way of checking whether or not an object,
   * including its prototype, has a given property
   */
  function hasProperty (obj, propName) {
    return obj != null && typeof obj === 'object' && (propName in obj);
  }

  /**
   * Safe way of detecting whether or not the given thing is a primitive and
   * whether it has the given property
   */
  function primitiveHasOwnProperty (primitive, propName) {  
    return (
      primitive != null
      && typeof primitive !== 'object'
      && primitive.hasOwnProperty
      && primitive.hasOwnProperty(propName)
    );
  }

  // Workaround for https://issues.apache.org/jira/browse/COUCHDB-577
  // See https://github.com/janl/mustache.js/issues/189
  var regExpTest = RegExp.prototype.test;
  function testRegExp (re, string) {
    return regExpTest.call(re, string);
  }

  var nonSpaceRe = /\S/;
  function isWhitespace (string) {
    return !testRegExp(nonSpaceRe, string);
  }

  var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };

  function escapeHtml (string) {
    return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap (s) {
      return entityMap[s];
    });
  }

  var whiteRe = /\s*/;
  var spaceRe = /\s+/;
  var equalsRe = /\s*=/;
  var curlyRe = /\s*\}/;
  var tagRe = /#|\^|\/|>|\{|&|=|!/;

  /**
   * Breaks up the given `template` string into a tree of tokens. If the `tags`
   * argument is given here it must be an array with two string values: the
   * opening and closing tags used in the template (e.g. [ "<%", "%>" ]). Of
   * course, the default is to use mustaches (i.e. mustache.tags).
   *
   * A token is an array with at least 4 elements. The first element is the
   * mustache symbol that was used inside the tag, e.g. "#" or "&". If the tag
   * did not contain a symbol (i.e. {{myValue}}) this element is "name". For
   * all text that appears outside a symbol this element is "text".
   *
   * The second element of a token is its "value". For mustache tags this is
   * whatever else was inside the tag besides the opening symbol. For text tokens
   * this is the text itself.
   *
   * The third and fourth elements of the token are the start and end indices,
   * respectively, of the token in the original template.
   *
   * Tokens that are the root node of a subtree contain two more elements: 1) an
   * array of tokens in the subtree and 2) the index in the original template at
   * which the closing tag for that section begins.
   */
  function parseTemplate (template, tags) {
    if (!template)
      return [];

    var sections = [];     // Stack to hold section tokens
    var tokens = [];       // Buffer to hold the tokens
    var spaces = [];       // Indices of whitespace tokens on the current line
    var hasTag = false;    // Is there a {{tag}} on the current line?
    var nonSpace = false;  // Is there a non-space char on the current line?

    // Strips all whitespace tokens array for the current line
    // if there was a {{#tag}} on it and otherwise only space.
    function stripSpace () {
      if (hasTag && !nonSpace) {
        while (spaces.length)
          delete tokens[spaces.pop()];
      } else {
        spaces = [];
      }

      hasTag = false;
      nonSpace = false;
    }

    var openingTagRe, closingTagRe, closingCurlyRe;
    function compileTags (tagsToCompile) {
      if (typeof tagsToCompile === 'string')
        tagsToCompile = tagsToCompile.split(spaceRe, 2);

      if (!isArray(tagsToCompile) || tagsToCompile.length !== 2)
        throw new Error('Invalid tags: ' + tagsToCompile);

      openingTagRe = new RegExp(escapeRegExp(tagsToCompile[0]) + '\\s*');
      closingTagRe = new RegExp('\\s*' + escapeRegExp(tagsToCompile[1]));
      closingCurlyRe = new RegExp('\\s*' + escapeRegExp('}' + tagsToCompile[1]));
    }

    compileTags(tags || mustache.tags);

    var scanner = new Scanner(template);

    var start, type, value, chr, token, openSection;
    while (!scanner.eos()) {
      start = scanner.pos;

      // Match any text between tags.
      value = scanner.scanUntil(openingTagRe);

      if (value) {
        for (var i = 0, valueLength = value.length; i < valueLength; ++i) {
          chr = value.charAt(i);

          if (isWhitespace(chr)) {
            spaces.push(tokens.length);
          } else {
            nonSpace = true;
          }

          tokens.push([ 'text', chr, start, start + 1 ]);
          start += 1;

          // Check for whitespace on the current line.
          if (chr === '\n')
            stripSpace();
        }
      }

      // Match the opening tag.
      if (!scanner.scan(openingTagRe))
        break;

      hasTag = true;

      // Get the tag type.
      type = scanner.scan(tagRe) || 'name';
      scanner.scan(whiteRe);

      // Get the tag value.
      if (type === '=') {
        value = scanner.scanUntil(equalsRe);
        scanner.scan(equalsRe);
        scanner.scanUntil(closingTagRe);
      } else if (type === '{') {
        value = scanner.scanUntil(closingCurlyRe);
        scanner.scan(curlyRe);
        scanner.scanUntil(closingTagRe);
        type = '&';
      } else {
        value = scanner.scanUntil(closingTagRe);
      }

      // Match the closing tag.
      if (!scanner.scan(closingTagRe))
        throw new Error('Unclosed tag at ' + scanner.pos);

      token = [ type, value, start, scanner.pos ];
      tokens.push(token);

      if (type === '#' || type === '^') {
        sections.push(token);
      } else if (type === '/') {
        // Check section nesting.
        openSection = sections.pop();

        if (!openSection)
          throw new Error('Unopened section "' + value + '" at ' + start);

        if (openSection[1] !== value)
          throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
      } else if (type === 'name' || type === '{' || type === '&') {
        nonSpace = true;
      } else if (type === '=') {
        // Set the tags for the next time around.
        compileTags(value);
      }
    }

    // Make sure there are no open sections when we're done.
    openSection = sections.pop();

    if (openSection)
      throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);

    return nestTokens(squashTokens(tokens));
  }

  /**
   * Combines the values of consecutive text tokens in the given `tokens` array
   * to a single token.
   */
  function squashTokens (tokens) {
    var squashedTokens = [];

    var token, lastToken;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      if (token) {
        if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
          lastToken[1] += token[1];
          lastToken[3] = token[3];
        } else {
          squashedTokens.push(token);
          lastToken = token;
        }
      }
    }

    return squashedTokens;
  }

  /**
   * Forms the given array of `tokens` into a nested tree structure where
   * tokens that represent a section have two additional items: 1) an array of
   * all tokens that appear in that section and 2) the index in the original
   * template that represents the end of that section.
   */
  function nestTokens (tokens) {
    var nestedTokens = [];
    var collector = nestedTokens;
    var sections = [];

    var token, section;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      switch (token[0]) {
        case '#':
        case '^':
          collector.push(token);
          sections.push(token);
          collector = token[4] = [];
          break;
        case '/':
          section = sections.pop();
          section[5] = token[2];
          collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
          break;
        default:
          collector.push(token);
      }
    }

    return nestedTokens;
  }

  /**
   * A simple string scanner that is used by the template parser to find
   * tokens in template strings.
   */
  function Scanner (string) {
    this.string = string;
    this.tail = string;
    this.pos = 0;
  }

  /**
   * Returns `true` if the tail is empty (end of string).
   */
  Scanner.prototype.eos = function eos () {
    return this.tail === '';
  };

  /**
   * Tries to match the given regular expression at the current position.
   * Returns the matched text if it can match, the empty string otherwise.
   */
  Scanner.prototype.scan = function scan (re) {
    var match = this.tail.match(re);

    if (!match || match.index !== 0)
      return '';

    var string = match[0];

    this.tail = this.tail.substring(string.length);
    this.pos += string.length;

    return string;
  };

  /**
   * Skips all text until the given regular expression can be matched. Returns
   * the skipped string, which is the entire tail if no match can be made.
   */
  Scanner.prototype.scanUntil = function scanUntil (re) {
    var index = this.tail.search(re), match;

    switch (index) {
      case -1:
        match = this.tail;
        this.tail = '';
        break;
      case 0:
        match = '';
        break;
      default:
        match = this.tail.substring(0, index);
        this.tail = this.tail.substring(index);
    }

    this.pos += match.length;

    return match;
  };

  /**
   * Represents a rendering context by wrapping a view object and
   * maintaining a reference to the parent context.
   */
  function Context (view, parentContext) {
    this.view = view;
    this.cache = { '.': this.view };
    this.parent = parentContext;
  }

  /**
   * Creates a new context using the given view with this context
   * as the parent.
   */
  Context.prototype.push = function push (view) {
    return new Context(view, this);
  };

  /**
   * Returns the value of the given name in this context, traversing
   * up the context hierarchy if the value is absent in this context's view.
   */
  Context.prototype.lookup = function lookup (name) {
    var cache = this.cache;

    var value;
    if (cache.hasOwnProperty(name)) {
      value = cache[name];
    } else {
      var context = this, intermediateValue, names, index, lookupHit = false;

      while (context) {
        if (name.indexOf('.') > 0) {
          intermediateValue = context.view;
          names = name.split('.');
          index = 0;

          /**
           * Using the dot notion path in `name`, we descend through the
           * nested objects.
           *
           * To be certain that the lookup has been successful, we have to
           * check if the last object in the path actually has the property
           * we are looking for. We store the result in `lookupHit`.
           *
           * This is specially necessary for when the value has been set to
           * `undefined` and we want to avoid looking up parent contexts.
           *
           * In the case where dot notation is used, we consider the lookup
           * to be successful even if the last "object" in the path is
           * not actually an object but a primitive (e.g., a string, or an
           * integer), because it is sometimes useful to access a property
           * of an autoboxed primitive, such as the length of a string.
           **/
          while (intermediateValue != null && index < names.length) {
            if (index === names.length - 1)
              lookupHit = (
                hasProperty(intermediateValue, names[index]) 
                || primitiveHasOwnProperty(intermediateValue, names[index])
              );

            intermediateValue = intermediateValue[names[index++]];
          }
        } else {
          intermediateValue = context.view[name];

          /**
           * Only checking against `hasProperty`, which always returns `false` if
           * `context.view` is not an object. Deliberately omitting the check
           * against `primitiveHasOwnProperty` if dot notation is not used.
           *
           * Consider this example:
           * ```
           * Mustache.render("The length of a football field is {{#length}}{{length}}{{/length}}.", {length: "100 yards"})
           * ```
           *
           * If we were to check also against `primitiveHasOwnProperty`, as we do
           * in the dot notation case, then render call would return:
           *
           * "The length of a football field is 9."
           *
           * rather than the expected:
           *
           * "The length of a football field is 100 yards."
           **/
          lookupHit = hasProperty(context.view, name);
        }

        if (lookupHit) {
          value = intermediateValue;
          break;
        }

        context = context.parent;
      }

      cache[name] = value;
    }

    if (isFunction(value))
      value = value.call(this.view);

    return value;
  };

  /**
   * A Writer knows how to take a stream of tokens and render them to a
   * string, given a context. It also maintains a cache of templates to
   * avoid the need to parse the same template twice.
   */
  function Writer () {
    this.cache = {};
  }

  /**
   * Clears all cached templates in this writer.
   */
  Writer.prototype.clearCache = function clearCache () {
    this.cache = {};
  };

  /**
   * Parses and caches the given `template` according to the given `tags` or
   * `mustache.tags` if `tags` is omitted,  and returns the array of tokens
   * that is generated from the parse.
   */
  Writer.prototype.parse = function parse (template, tags) {
    var cache = this.cache;
    var cacheKey = template + ':' + (tags || mustache.tags).join(':');
    var tokens = cache[cacheKey];

    if (tokens == null)
      tokens = cache[cacheKey] = parseTemplate(template, tags);

    return tokens;
  };

  /**
   * High-level method that is used to render the given `template` with
   * the given `view`.
   *
   * The optional `partials` argument may be an object that contains the
   * names and templates of partials that are used in the template. It may
   * also be a function that is used to load partial templates on the fly
   * that takes a single argument: the name of the partial.
   *
   * If the optional `tags` argument is given here it must be an array with two
   * string values: the opening and closing tags used in the template (e.g.
   * [ "<%", "%>" ]). The default is to mustache.tags.
   */
  Writer.prototype.render = function render (template, view, partials, tags) {
    var tokens = this.parse(template, tags);
    var context = (view instanceof Context) ? view : new Context(view);
    return this.renderTokens(tokens, context, partials, template);
  };

  /**
   * Low-level method that renders the given array of `tokens` using
   * the given `context` and `partials`.
   *
   * Note: The `originalTemplate` is only ever used to extract the portion
   * of the original template that was contained in a higher-order section.
   * If the template doesn't use higher-order sections, this argument may
   * be omitted.
   */
  Writer.prototype.renderTokens = function renderTokens (tokens, context, partials, originalTemplate) {
    var buffer = '';

    var token, symbol, value;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      value = undefined;
      token = tokens[i];
      symbol = token[0];

      if (symbol === '#') value = this.renderSection(token, context, partials, originalTemplate);
      else if (symbol === '^') value = this.renderInverted(token, context, partials, originalTemplate);
      else if (symbol === '>') value = this.renderPartial(token, context, partials, originalTemplate);
      else if (symbol === '&') value = this.unescapedValue(token, context);
      else if (symbol === 'name') value = this.escapedValue(token, context);
      else if (symbol === 'text') value = this.rawValue(token);

      if (value !== undefined)
        buffer += value;
    }

    return buffer;
  };

  Writer.prototype.renderSection = function renderSection (token, context, partials, originalTemplate) {
    var self = this;
    var buffer = '';
    var value = context.lookup(token[1]);

    // This function is used to render an arbitrary template
    // in the current context by higher-order sections.
    function subRender (template) {
      return self.render(template, context, partials);
    }

    if (!value) return;

    if (isArray(value)) {
      for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
        buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate);
      }
    } else if (typeof value === 'object' || typeof value === 'string' || typeof value === 'number') {
      buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate);
    } else if (isFunction(value)) {
      if (typeof originalTemplate !== 'string')
        throw new Error('Cannot use higher-order sections without the original template');

      // Extract the portion of the original template that the section contains.
      value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender);

      if (value != null)
        buffer += value;
    } else {
      buffer += this.renderTokens(token[4], context, partials, originalTemplate);
    }
    return buffer;
  };

  Writer.prototype.renderInverted = function renderInverted (token, context, partials, originalTemplate) {
    var value = context.lookup(token[1]);

    // Use JavaScript's definition of falsy. Include empty arrays.
    // See https://github.com/janl/mustache.js/issues/186
    if (!value || (isArray(value) && value.length === 0))
      return this.renderTokens(token[4], context, partials, originalTemplate);
  };

  Writer.prototype.renderPartial = function renderPartial (token, context, partials) {
    if (!partials) return;

    var value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
    if (value != null)
      return this.renderTokens(this.parse(value), context, partials, value);
  };

  Writer.prototype.unescapedValue = function unescapedValue (token, context) {
    var value = context.lookup(token[1]);
    if (value != null)
      return value;
  };

  Writer.prototype.escapedValue = function escapedValue (token, context) {
    var value = context.lookup(token[1]);
    if (value != null)
      return mustache.escape(value);
  };

  Writer.prototype.rawValue = function rawValue (token) {
    return token[1];
  };

  mustache.name = 'mustache.js';
  mustache.version = '3.0.0';
  mustache.tags = [ '{{', '}}' ];

  // All high-level mustache.* functions use this writer.
  var defaultWriter = new Writer();

  /**
   * Clears all cached templates in the default writer.
   */
  mustache.clearCache = function clearCache () {
    return defaultWriter.clearCache();
  };

  /**
   * Parses and caches the given template in the default writer and returns the
   * array of tokens it contains. Doing this ahead of time avoids the need to
   * parse templates on the fly as they are rendered.
   */
  mustache.parse = function parse (template, tags) {
    return defaultWriter.parse(template, tags);
  };

  /**
   * Renders the `template` with the given `view` and `partials` using the
   * default writer. If the optional `tags` argument is given here it must be an
   * array with two string values: the opening and closing tags used in the
   * template (e.g. [ "<%", "%>" ]). The default is to mustache.tags.
   */
  mustache.render = function render (template, view, partials, tags) {
    if (typeof template !== 'string') {
      throw new TypeError('Invalid template! Template should be a "string" ' +
                          'but "' + typeStr(template) + '" was given as the first ' +
                          'argument for mustache#render(template, view, partials)');
    }

    return defaultWriter.render(template, view, partials, tags);
  };

  // This is here for backwards compatibility with 0.4.x.,
  /*eslint-disable */ // eslint wants camel cased function name
  mustache.to_html = function to_html (template, view, partials, send) {
    /*eslint-enable*/

    var result = mustache.render(template, view, partials);

    if (isFunction(send)) {
      send(result);
    } else {
      return result;
    }
  };

  // Export the escaping function so that the user may override it.
  // See https://github.com/janl/mustache.js/issues/244
  mustache.escape = escapeHtml;

  // Export these mainly for testing, but also for advanced usage.
  mustache.Scanner = Scanner;
  mustache.Context = Context;
  mustache.Writer = Writer;

  return mustache;
}));


/***/ }),

/***/ 69:
/***/ (function(module, exports, __webpack_require__) {

var Mustache = __webpack_require__(4),
    defer = __webpack_require__(2),
    $moreButton = $(".load-more"),
    query = $moreButton.attr("data-query"),
    perPage = $moreButton.attr("data-per-page"),
    $userList = $(".directory-users"),
    ajaxUrl = "https://www.city.ac.uk/api/search.html",
    $resultMsgDisplayed = $(".directory-results-msg__displayed"),
    startRank,
    ajaxCall = function () {
        startRank = $moreButton.attr("data-start-rank");
        $.ajax({
            "url": ajaxUrl,
            "dataType": "json",
            "data": {
                "collection": "user-directory",
                "form": "json",
                "sort": "metaf",
                "start_rank": startRank,
                "num_ranks": perPage,
                "query": "*" + query + "*"
            },
            "success": function (data) {
                templateData(data);
            }
        }); // end $.ajax
    },
    templateData = function (results) {
        var template =
            "{{#users}}<li class=\"directory-user directory-user--loading\" itemscope itemtype=\"http:\/\/schema.org\/Person\">" +
                "<h4 class=\"directory-user__name\" itemprop=\"name\">{{{title}}} {{{firstName}}} {{{lastName}}}<\/h4>" +
                "<div class=\"row\">" +
                    "<div class=\"col-xs-24 col-md-8\">" +
                        "{{#job}}<span class=\"directory-user__info directory-user__info--job\" itemprop=\"jobTitle\">{{{job}}}<\/span>{{/job}}" +
                    "<\/div>" +
                    "<div class=\"col-xs-24 col-md-8\">" +
                        "{{#tel}}<span class=\"directory-user__info directory-user__info--tel\" itemprop=\"telephone\"><i class=\"fa fa-phone\"></i><a href=\"tel:0044(0)207040{{tel}}\">+44(0) 207 040 {{tel}}<\/a><\/span>{{/tel}}" +
                        "{{#email}}<span class=\"directory-user__info directory-user__info--email\" itemprop=\"email\"><i class=\"fa fa-envelope-o\"></i><a href=\"mailto:{{{email}}}\">{{{email}}}<\/a><\/span>{{/email}}" +
                    "<\/div>" +
                    "<div class=\"col-xs-24 col-md-8\">" +
                        "{{#room}}<span class=\"directory-user__info directory-user__info--room\"><i class=\"fa fa-map-marker\"></i>{{{room}}}<\/span>{{/room}}" +
                        "{{#dep}}<span class=\"directory-user__info directory-user__info--department\"><i class=\"fa fa-building-o\"></i>{{{dep}}}<\/span>{{/dep}}" +
                    "<\/div>" +
                "<\/div>" +
            "<\/li>{{/users}}";
            numberResults = results.total,
            resultsPerPage = results.resultsPerPage,
            numberResultsCut = numberResults < resultsPerPage ? numberResults : resultsPerPage,
            currentEnd = results.currEnd,
            totalDisplay = currentEnd + resultsPerPage,
            renderHTML = "",
            newPath = "";

        if (numberResults !== 0) {

            renderHTML = Mustache.render(template, results);

        }

        appendData(renderHTML, currentEnd, numberResults);


        // need to check if history api is supported here
        // if we're doing the below, we need to make sure that on hash change, the list updates accordingly, otherwise, useless
        //newPath = document.location.origin + document.location.pathname + "?query=" + query + "&start_rank=" + startRank;
        //history.pushState({"start_rank": startRank}, "", newPath);


    },
    appendData = function (htmlToAdd, currentEnd) {

        $userList.children('.loading-fa-icon').remove();
        $userList.append(htmlToAdd);

        // update button data attributes
        $moreButton.attr("data-start-rank", (parseInt(startRank) + 10));

        // update the counter of results at top
        $resultMsgDisplayed.html(currentEnd);

        // disable load more button if not needed
        if (currentEnd === numberResults) {
            $moreButton.remove();
        }

    },
    init = function () {
        $moreButton.on("click", function (event) {
            event.preventDefault();
            $userList.append($('<i class="fa fa-refresh fa-spin loading-fa-icon"></i>'));
            ajaxCall();
        });
    };

defer(init);


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZjc0NjhmOTM0ZTE4OGE4ZWQ5MTciLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHMvbGlicy9qcXVlcnkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHMvdXRpbHMvZGVmZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL211c3RhY2hlL211c3RhY2hlLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2RzL2RpcmVjdG9yeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBLDBCOzs7Ozs7O0FDSEE7QUFDQTs7QUFFQSxZQUFZLG1CQUFPLENBQUMsQ0FBZ0I7O0FBRXBDO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLHVDQUF1QztBQUN2QyxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsRzs7Ozs7OztBQ2pCRDtBQUNBLDhCQUE4QixVQUFVO0FBQ3hDO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQixHQUFHLFVBQVUsSUFBMEM7QUFDdkQsSUFBSSxpQ0FBTyxDQUFDLE9BQVMsQ0FBQyxvQ0FBRSxPQUFPO0FBQUE7QUFBQTtBQUFBLG9HQUFDLENBQUM7QUFDakMsR0FBRztBQUNIO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxvQ0FBb0M7QUFDcEM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGVBQWU7QUFDZixjQUFjO0FBQ2QsY0FBYztBQUNkLGdCQUFnQjtBQUNoQixlQUFlO0FBQ2YsZ0JBQWdCO0FBQ2hCLGdCQUFnQjtBQUNoQixnQkFBZ0I7QUFDaEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QiwyQkFBMkI7O0FBRTNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MsU0FBUztBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxzQkFBc0I7QUFDdEIsb0JBQW9CO0FBQ3BCLG9CQUFvQjtBQUNwQix1QkFBdUIsb0JBQW9CLEtBQUs7QUFDaEQseUJBQXlCOztBQUV6QjtBQUNBLHdCQUF3QixNQUFNO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDBEQUEwRDtBQUMxRDs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUFtRCxpQkFBaUI7QUFDcEU7O0FBRUE7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPLHFCQUFxQjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPLHdDQUF3QztBQUMvQztBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4Q0FBOEMsZUFBZTtBQUM3RDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4Q0FBOEMsZUFBZTtBQUM3RDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0VBQWtFLFdBQVcsVUFBVSxTQUFTLEtBQUssb0JBQW9CO0FBQ3pIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhDQUE4QyxlQUFlO0FBQzdEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLGlEQUFpRCxpQkFBaUI7QUFDbEU7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBdUIsTUFBTTs7QUFFN0I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxDQUFDOzs7Ozs7OztBQ3pxQkQsZUFBZSxtQkFBTyxDQUFDLENBQVU7QUFDakMsWUFBWSxtQkFBTyxDQUFDLENBQWU7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsU0FBUyxFQUFFO0FBQ1gsS0FBSztBQUNMO0FBQ0E7QUFDQSxlQUFlLFFBQVE7QUFDdkIseUVBQXlFLFFBQVEsSUFBSSxZQUFZLElBQUksV0FBVztBQUNoSDtBQUNBO0FBQ0EsMkJBQTJCLE1BQU0sd0ZBQXdGLE1BQU0sVUFBVSxNQUFNO0FBQy9JO0FBQ0E7QUFDQSwyQkFBMkIsTUFBTSxnSkFBZ0osS0FBSyxvQkFBb0IsS0FBSyxlQUFlLE1BQU07QUFDcE8sMkJBQTJCLFFBQVEsMElBQTBJLFFBQVEsTUFBTSxRQUFRLGVBQWUsUUFBUTtBQUMxTjtBQUNBO0FBQ0EsMkJBQTJCLE9BQU8scUdBQXFHLE9BQU8sVUFBVSxPQUFPO0FBQy9KLDJCQUEyQixNQUFNLDJHQUEyRyxNQUFNLFVBQVUsTUFBTTtBQUNsSztBQUNBO0FBQ0EscUJBQXFCLFFBQVE7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7OztBQUdBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2Qix3QkFBd0I7OztBQUdyRCxLQUFLO0FBQ0w7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUEiLCJmaWxlIjoibW9kdWxlcy9kaXJlY3RvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA2OSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgZjc0NjhmOTM0ZTE4OGE4ZWQ5MTciLCIvKipcbiAqIGV4cGVjdHMgalF1ZXJ5IHRvIGJlIHByb3ZpZGVkIGJ5IENJVFlfUi5qc1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IHdpbmRvdy4kO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2pzL21vZHMvbGlicy9qcXVlcnkuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAxIDIgMyA0IDUgNiA3IDggOSAxMCIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciAkID0gcmVxdWlyZSgnLi4vbGlicy9qcXVlcnknKTtcblxuICAgIHJldHVybiBmdW5jdGlvbiAoZGVmZXJyZWRGdW5jdGlvbikge1xuICAgICAgICBpZiAodHlwZW9mIENJVFkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAkKGRlZmVycmVkRnVuY3Rpb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCF3aW5kb3cuQ0lUWV9PUFRJT05TKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LkNJVFlfT1BUSU9OUyA9IHtkZWZlcjogW119O1xuICAgICAgICAgICAgfSBlbHNlIGlmICghd2luZG93LkNJVFlfT1BUSU9OUy5kZWZlcikge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5DSVRZX09QVElPTlMuZGVmZXIgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIENJVFlfT1BUSU9OUy5kZWZlci5wdXNoKGRlZmVycmVkRnVuY3Rpb24pO1xuICAgICAgICB9XG4gICAgfTtcbn0oKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9qcy9tb2RzL3V0aWxzL2RlZmVyLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMSAyIDMgNCA1IDYgNyA4IDkiLCIvKiFcbiAqIG11c3RhY2hlLmpzIC0gTG9naWMtbGVzcyB7e211c3RhY2hlfX0gdGVtcGxhdGVzIHdpdGggSmF2YVNjcmlwdFxuICogaHR0cDovL2dpdGh1Yi5jb20vamFubC9tdXN0YWNoZS5qc1xuICovXG5cbi8qZ2xvYmFsIGRlZmluZTogZmFsc2UgTXVzdGFjaGU6IHRydWUqL1xuXG4oZnVuY3Rpb24gZGVmaW5lTXVzdGFjaGUgKGdsb2JhbCwgZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIGV4cG9ydHMgJiYgdHlwZW9mIGV4cG9ydHMubm9kZU5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgZmFjdG9yeShleHBvcnRzKTsgLy8gQ29tbW9uSlNcbiAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoWydleHBvcnRzJ10sIGZhY3RvcnkpOyAvLyBBTURcbiAgfSBlbHNlIHtcbiAgICBnbG9iYWwuTXVzdGFjaGUgPSB7fTtcbiAgICBmYWN0b3J5KGdsb2JhbC5NdXN0YWNoZSk7IC8vIHNjcmlwdCwgd3NoLCBhc3BcbiAgfVxufSh0aGlzLCBmdW5jdGlvbiBtdXN0YWNoZUZhY3RvcnkgKG11c3RhY2hlKSB7XG5cbiAgdmFyIG9iamVjdFRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbiAgdmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIGlzQXJyYXlQb2x5ZmlsbCAob2JqZWN0KSB7XG4gICAgcmV0dXJuIG9iamVjdFRvU3RyaW5nLmNhbGwob2JqZWN0KSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgfTtcblxuICBmdW5jdGlvbiBpc0Z1bmN0aW9uIChvYmplY3QpIHtcbiAgICByZXR1cm4gdHlwZW9mIG9iamVjdCA9PT0gJ2Z1bmN0aW9uJztcbiAgfVxuXG4gIC8qKlxuICAgKiBNb3JlIGNvcnJlY3QgdHlwZW9mIHN0cmluZyBoYW5kbGluZyBhcnJheVxuICAgKiB3aGljaCBub3JtYWxseSByZXR1cm5zIHR5cGVvZiAnb2JqZWN0J1xuICAgKi9cbiAgZnVuY3Rpb24gdHlwZVN0ciAob2JqKSB7XG4gICAgcmV0dXJuIGlzQXJyYXkob2JqKSA/ICdhcnJheScgOiB0eXBlb2Ygb2JqO1xuICB9XG5cbiAgZnVuY3Rpb24gZXNjYXBlUmVnRXhwIChzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoL1tcXC1cXFtcXF17fSgpKis/LixcXFxcXFxeJHwjXFxzXS9nLCAnXFxcXCQmJyk7XG4gIH1cblxuICAvKipcbiAgICogTnVsbCBzYWZlIHdheSBvZiBjaGVja2luZyB3aGV0aGVyIG9yIG5vdCBhbiBvYmplY3QsXG4gICAqIGluY2x1ZGluZyBpdHMgcHJvdG90eXBlLCBoYXMgYSBnaXZlbiBwcm9wZXJ0eVxuICAgKi9cbiAgZnVuY3Rpb24gaGFzUHJvcGVydHkgKG9iaiwgcHJvcE5hbWUpIHtcbiAgICByZXR1cm4gb2JqICE9IG51bGwgJiYgdHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgKHByb3BOYW1lIGluIG9iaik7XG4gIH1cblxuICAvKipcbiAgICogU2FmZSB3YXkgb2YgZGV0ZWN0aW5nIHdoZXRoZXIgb3Igbm90IHRoZSBnaXZlbiB0aGluZyBpcyBhIHByaW1pdGl2ZSBhbmRcbiAgICogd2hldGhlciBpdCBoYXMgdGhlIGdpdmVuIHByb3BlcnR5XG4gICAqL1xuICBmdW5jdGlvbiBwcmltaXRpdmVIYXNPd25Qcm9wZXJ0eSAocHJpbWl0aXZlLCBwcm9wTmFtZSkgeyAgXG4gICAgcmV0dXJuIChcbiAgICAgIHByaW1pdGl2ZSAhPSBudWxsXG4gICAgICAmJiB0eXBlb2YgcHJpbWl0aXZlICE9PSAnb2JqZWN0J1xuICAgICAgJiYgcHJpbWl0aXZlLmhhc093blByb3BlcnR5XG4gICAgICAmJiBwcmltaXRpdmUuaGFzT3duUHJvcGVydHkocHJvcE5hbWUpXG4gICAgKTtcbiAgfVxuXG4gIC8vIFdvcmthcm91bmQgZm9yIGh0dHBzOi8vaXNzdWVzLmFwYWNoZS5vcmcvamlyYS9icm93c2UvQ09VQ0hEQi01NzdcbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9qYW5sL211c3RhY2hlLmpzL2lzc3Vlcy8xODlcbiAgdmFyIHJlZ0V4cFRlc3QgPSBSZWdFeHAucHJvdG90eXBlLnRlc3Q7XG4gIGZ1bmN0aW9uIHRlc3RSZWdFeHAgKHJlLCBzdHJpbmcpIHtcbiAgICByZXR1cm4gcmVnRXhwVGVzdC5jYWxsKHJlLCBzdHJpbmcpO1xuICB9XG5cbiAgdmFyIG5vblNwYWNlUmUgPSAvXFxTLztcbiAgZnVuY3Rpb24gaXNXaGl0ZXNwYWNlIChzdHJpbmcpIHtcbiAgICByZXR1cm4gIXRlc3RSZWdFeHAobm9uU3BhY2VSZSwgc3RyaW5nKTtcbiAgfVxuXG4gIHZhciBlbnRpdHlNYXAgPSB7XG4gICAgJyYnOiAnJmFtcDsnLFxuICAgICc8JzogJyZsdDsnLFxuICAgICc+JzogJyZndDsnLFxuICAgICdcIic6ICcmcXVvdDsnLFxuICAgIFwiJ1wiOiAnJiMzOTsnLFxuICAgICcvJzogJyYjeDJGOycsXG4gICAgJ2AnOiAnJiN4NjA7JyxcbiAgICAnPSc6ICcmI3gzRDsnXG4gIH07XG5cbiAgZnVuY3Rpb24gZXNjYXBlSHRtbCAoc3RyaW5nKSB7XG4gICAgcmV0dXJuIFN0cmluZyhzdHJpbmcpLnJlcGxhY2UoL1smPD5cIidgPVxcL10vZywgZnVuY3Rpb24gZnJvbUVudGl0eU1hcCAocykge1xuICAgICAgcmV0dXJuIGVudGl0eU1hcFtzXTtcbiAgICB9KTtcbiAgfVxuXG4gIHZhciB3aGl0ZVJlID0gL1xccyovO1xuICB2YXIgc3BhY2VSZSA9IC9cXHMrLztcbiAgdmFyIGVxdWFsc1JlID0gL1xccyo9LztcbiAgdmFyIGN1cmx5UmUgPSAvXFxzKlxcfS87XG4gIHZhciB0YWdSZSA9IC8jfFxcXnxcXC98PnxcXHt8Jnw9fCEvO1xuXG4gIC8qKlxuICAgKiBCcmVha3MgdXAgdGhlIGdpdmVuIGB0ZW1wbGF0ZWAgc3RyaW5nIGludG8gYSB0cmVlIG9mIHRva2Vucy4gSWYgdGhlIGB0YWdzYFxuICAgKiBhcmd1bWVudCBpcyBnaXZlbiBoZXJlIGl0IG11c3QgYmUgYW4gYXJyYXkgd2l0aCB0d28gc3RyaW5nIHZhbHVlczogdGhlXG4gICAqIG9wZW5pbmcgYW5kIGNsb3NpbmcgdGFncyB1c2VkIGluIHRoZSB0ZW1wbGF0ZSAoZS5nLiBbIFwiPCVcIiwgXCIlPlwiIF0pLiBPZlxuICAgKiBjb3Vyc2UsIHRoZSBkZWZhdWx0IGlzIHRvIHVzZSBtdXN0YWNoZXMgKGkuZS4gbXVzdGFjaGUudGFncykuXG4gICAqXG4gICAqIEEgdG9rZW4gaXMgYW4gYXJyYXkgd2l0aCBhdCBsZWFzdCA0IGVsZW1lbnRzLiBUaGUgZmlyc3QgZWxlbWVudCBpcyB0aGVcbiAgICogbXVzdGFjaGUgc3ltYm9sIHRoYXQgd2FzIHVzZWQgaW5zaWRlIHRoZSB0YWcsIGUuZy4gXCIjXCIgb3IgXCImXCIuIElmIHRoZSB0YWdcbiAgICogZGlkIG5vdCBjb250YWluIGEgc3ltYm9sIChpLmUuIHt7bXlWYWx1ZX19KSB0aGlzIGVsZW1lbnQgaXMgXCJuYW1lXCIuIEZvclxuICAgKiBhbGwgdGV4dCB0aGF0IGFwcGVhcnMgb3V0c2lkZSBhIHN5bWJvbCB0aGlzIGVsZW1lbnQgaXMgXCJ0ZXh0XCIuXG4gICAqXG4gICAqIFRoZSBzZWNvbmQgZWxlbWVudCBvZiBhIHRva2VuIGlzIGl0cyBcInZhbHVlXCIuIEZvciBtdXN0YWNoZSB0YWdzIHRoaXMgaXNcbiAgICogd2hhdGV2ZXIgZWxzZSB3YXMgaW5zaWRlIHRoZSB0YWcgYmVzaWRlcyB0aGUgb3BlbmluZyBzeW1ib2wuIEZvciB0ZXh0IHRva2Vuc1xuICAgKiB0aGlzIGlzIHRoZSB0ZXh0IGl0c2VsZi5cbiAgICpcbiAgICogVGhlIHRoaXJkIGFuZCBmb3VydGggZWxlbWVudHMgb2YgdGhlIHRva2VuIGFyZSB0aGUgc3RhcnQgYW5kIGVuZCBpbmRpY2VzLFxuICAgKiByZXNwZWN0aXZlbHksIG9mIHRoZSB0b2tlbiBpbiB0aGUgb3JpZ2luYWwgdGVtcGxhdGUuXG4gICAqXG4gICAqIFRva2VucyB0aGF0IGFyZSB0aGUgcm9vdCBub2RlIG9mIGEgc3VidHJlZSBjb250YWluIHR3byBtb3JlIGVsZW1lbnRzOiAxKSBhblxuICAgKiBhcnJheSBvZiB0b2tlbnMgaW4gdGhlIHN1YnRyZWUgYW5kIDIpIHRoZSBpbmRleCBpbiB0aGUgb3JpZ2luYWwgdGVtcGxhdGUgYXRcbiAgICogd2hpY2ggdGhlIGNsb3NpbmcgdGFnIGZvciB0aGF0IHNlY3Rpb24gYmVnaW5zLlxuICAgKi9cbiAgZnVuY3Rpb24gcGFyc2VUZW1wbGF0ZSAodGVtcGxhdGUsIHRhZ3MpIHtcbiAgICBpZiAoIXRlbXBsYXRlKVxuICAgICAgcmV0dXJuIFtdO1xuXG4gICAgdmFyIHNlY3Rpb25zID0gW107ICAgICAvLyBTdGFjayB0byBob2xkIHNlY3Rpb24gdG9rZW5zXG4gICAgdmFyIHRva2VucyA9IFtdOyAgICAgICAvLyBCdWZmZXIgdG8gaG9sZCB0aGUgdG9rZW5zXG4gICAgdmFyIHNwYWNlcyA9IFtdOyAgICAgICAvLyBJbmRpY2VzIG9mIHdoaXRlc3BhY2UgdG9rZW5zIG9uIHRoZSBjdXJyZW50IGxpbmVcbiAgICB2YXIgaGFzVGFnID0gZmFsc2U7ICAgIC8vIElzIHRoZXJlIGEge3t0YWd9fSBvbiB0aGUgY3VycmVudCBsaW5lP1xuICAgIHZhciBub25TcGFjZSA9IGZhbHNlOyAgLy8gSXMgdGhlcmUgYSBub24tc3BhY2UgY2hhciBvbiB0aGUgY3VycmVudCBsaW5lP1xuXG4gICAgLy8gU3RyaXBzIGFsbCB3aGl0ZXNwYWNlIHRva2VucyBhcnJheSBmb3IgdGhlIGN1cnJlbnQgbGluZVxuICAgIC8vIGlmIHRoZXJlIHdhcyBhIHt7I3RhZ319IG9uIGl0IGFuZCBvdGhlcndpc2Ugb25seSBzcGFjZS5cbiAgICBmdW5jdGlvbiBzdHJpcFNwYWNlICgpIHtcbiAgICAgIGlmIChoYXNUYWcgJiYgIW5vblNwYWNlKSB7XG4gICAgICAgIHdoaWxlIChzcGFjZXMubGVuZ3RoKVxuICAgICAgICAgIGRlbGV0ZSB0b2tlbnNbc3BhY2VzLnBvcCgpXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNwYWNlcyA9IFtdO1xuICAgICAgfVxuXG4gICAgICBoYXNUYWcgPSBmYWxzZTtcbiAgICAgIG5vblNwYWNlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIG9wZW5pbmdUYWdSZSwgY2xvc2luZ1RhZ1JlLCBjbG9zaW5nQ3VybHlSZTtcbiAgICBmdW5jdGlvbiBjb21waWxlVGFncyAodGFnc1RvQ29tcGlsZSkge1xuICAgICAgaWYgKHR5cGVvZiB0YWdzVG9Db21waWxlID09PSAnc3RyaW5nJylcbiAgICAgICAgdGFnc1RvQ29tcGlsZSA9IHRhZ3NUb0NvbXBpbGUuc3BsaXQoc3BhY2VSZSwgMik7XG5cbiAgICAgIGlmICghaXNBcnJheSh0YWdzVG9Db21waWxlKSB8fCB0YWdzVG9Db21waWxlLmxlbmd0aCAhPT0gMilcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHRhZ3M6ICcgKyB0YWdzVG9Db21waWxlKTtcblxuICAgICAgb3BlbmluZ1RhZ1JlID0gbmV3IFJlZ0V4cChlc2NhcGVSZWdFeHAodGFnc1RvQ29tcGlsZVswXSkgKyAnXFxcXHMqJyk7XG4gICAgICBjbG9zaW5nVGFnUmUgPSBuZXcgUmVnRXhwKCdcXFxccyonICsgZXNjYXBlUmVnRXhwKHRhZ3NUb0NvbXBpbGVbMV0pKTtcbiAgICAgIGNsb3NpbmdDdXJseVJlID0gbmV3IFJlZ0V4cCgnXFxcXHMqJyArIGVzY2FwZVJlZ0V4cCgnfScgKyB0YWdzVG9Db21waWxlWzFdKSk7XG4gICAgfVxuXG4gICAgY29tcGlsZVRhZ3ModGFncyB8fCBtdXN0YWNoZS50YWdzKTtcblxuICAgIHZhciBzY2FubmVyID0gbmV3IFNjYW5uZXIodGVtcGxhdGUpO1xuXG4gICAgdmFyIHN0YXJ0LCB0eXBlLCB2YWx1ZSwgY2hyLCB0b2tlbiwgb3BlblNlY3Rpb247XG4gICAgd2hpbGUgKCFzY2FubmVyLmVvcygpKSB7XG4gICAgICBzdGFydCA9IHNjYW5uZXIucG9zO1xuXG4gICAgICAvLyBNYXRjaCBhbnkgdGV4dCBiZXR3ZWVuIHRhZ3MuXG4gICAgICB2YWx1ZSA9IHNjYW5uZXIuc2NhblVudGlsKG9wZW5pbmdUYWdSZSk7XG5cbiAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgdmFsdWVMZW5ndGggPSB2YWx1ZS5sZW5ndGg7IGkgPCB2YWx1ZUxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgY2hyID0gdmFsdWUuY2hhckF0KGkpO1xuXG4gICAgICAgICAgaWYgKGlzV2hpdGVzcGFjZShjaHIpKSB7XG4gICAgICAgICAgICBzcGFjZXMucHVzaCh0b2tlbnMubGVuZ3RoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbm9uU3BhY2UgPSB0cnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRva2Vucy5wdXNoKFsgJ3RleHQnLCBjaHIsIHN0YXJ0LCBzdGFydCArIDEgXSk7XG4gICAgICAgICAgc3RhcnQgKz0gMTtcblxuICAgICAgICAgIC8vIENoZWNrIGZvciB3aGl0ZXNwYWNlIG9uIHRoZSBjdXJyZW50IGxpbmUuXG4gICAgICAgICAgaWYgKGNociA9PT0gJ1xcbicpXG4gICAgICAgICAgICBzdHJpcFNwYWNlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gTWF0Y2ggdGhlIG9wZW5pbmcgdGFnLlxuICAgICAgaWYgKCFzY2FubmVyLnNjYW4ob3BlbmluZ1RhZ1JlKSlcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGhhc1RhZyA9IHRydWU7XG5cbiAgICAgIC8vIEdldCB0aGUgdGFnIHR5cGUuXG4gICAgICB0eXBlID0gc2Nhbm5lci5zY2FuKHRhZ1JlKSB8fCAnbmFtZSc7XG4gICAgICBzY2FubmVyLnNjYW4od2hpdGVSZSk7XG5cbiAgICAgIC8vIEdldCB0aGUgdGFnIHZhbHVlLlxuICAgICAgaWYgKHR5cGUgPT09ICc9Jykge1xuICAgICAgICB2YWx1ZSA9IHNjYW5uZXIuc2NhblVudGlsKGVxdWFsc1JlKTtcbiAgICAgICAgc2Nhbm5lci5zY2FuKGVxdWFsc1JlKTtcbiAgICAgICAgc2Nhbm5lci5zY2FuVW50aWwoY2xvc2luZ1RhZ1JlKTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3snKSB7XG4gICAgICAgIHZhbHVlID0gc2Nhbm5lci5zY2FuVW50aWwoY2xvc2luZ0N1cmx5UmUpO1xuICAgICAgICBzY2FubmVyLnNjYW4oY3VybHlSZSk7XG4gICAgICAgIHNjYW5uZXIuc2NhblVudGlsKGNsb3NpbmdUYWdSZSk7XG4gICAgICAgIHR5cGUgPSAnJic7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZSA9IHNjYW5uZXIuc2NhblVudGlsKGNsb3NpbmdUYWdSZSk7XG4gICAgICB9XG5cbiAgICAgIC8vIE1hdGNoIHRoZSBjbG9zaW5nIHRhZy5cbiAgICAgIGlmICghc2Nhbm5lci5zY2FuKGNsb3NpbmdUYWdSZSkpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVW5jbG9zZWQgdGFnIGF0ICcgKyBzY2FubmVyLnBvcyk7XG5cbiAgICAgIHRva2VuID0gWyB0eXBlLCB2YWx1ZSwgc3RhcnQsIHNjYW5uZXIucG9zIF07XG4gICAgICB0b2tlbnMucHVzaCh0b2tlbik7XG5cbiAgICAgIGlmICh0eXBlID09PSAnIycgfHwgdHlwZSA9PT0gJ14nKSB7XG4gICAgICAgIHNlY3Rpb25zLnB1c2godG9rZW4pO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnLycpIHtcbiAgICAgICAgLy8gQ2hlY2sgc2VjdGlvbiBuZXN0aW5nLlxuICAgICAgICBvcGVuU2VjdGlvbiA9IHNlY3Rpb25zLnBvcCgpO1xuXG4gICAgICAgIGlmICghb3BlblNlY3Rpb24pXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbm9wZW5lZCBzZWN0aW9uIFwiJyArIHZhbHVlICsgJ1wiIGF0ICcgKyBzdGFydCk7XG5cbiAgICAgICAgaWYgKG9wZW5TZWN0aW9uWzFdICE9PSB2YWx1ZSlcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuY2xvc2VkIHNlY3Rpb24gXCInICsgb3BlblNlY3Rpb25bMV0gKyAnXCIgYXQgJyArIHN0YXJ0KTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ25hbWUnIHx8IHR5cGUgPT09ICd7JyB8fCB0eXBlID09PSAnJicpIHtcbiAgICAgICAgbm9uU3BhY2UgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnPScpIHtcbiAgICAgICAgLy8gU2V0IHRoZSB0YWdzIGZvciB0aGUgbmV4dCB0aW1lIGFyb3VuZC5cbiAgICAgICAgY29tcGlsZVRhZ3ModmFsdWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIE1ha2Ugc3VyZSB0aGVyZSBhcmUgbm8gb3BlbiBzZWN0aW9ucyB3aGVuIHdlJ3JlIGRvbmUuXG4gICAgb3BlblNlY3Rpb24gPSBzZWN0aW9ucy5wb3AoKTtcblxuICAgIGlmIChvcGVuU2VjdGlvbilcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5jbG9zZWQgc2VjdGlvbiBcIicgKyBvcGVuU2VjdGlvblsxXSArICdcIiBhdCAnICsgc2Nhbm5lci5wb3MpO1xuXG4gICAgcmV0dXJuIG5lc3RUb2tlbnMoc3F1YXNoVG9rZW5zKHRva2VucykpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbWJpbmVzIHRoZSB2YWx1ZXMgb2YgY29uc2VjdXRpdmUgdGV4dCB0b2tlbnMgaW4gdGhlIGdpdmVuIGB0b2tlbnNgIGFycmF5XG4gICAqIHRvIGEgc2luZ2xlIHRva2VuLlxuICAgKi9cbiAgZnVuY3Rpb24gc3F1YXNoVG9rZW5zICh0b2tlbnMpIHtcbiAgICB2YXIgc3F1YXNoZWRUb2tlbnMgPSBbXTtcblxuICAgIHZhciB0b2tlbiwgbGFzdFRva2VuO1xuICAgIGZvciAodmFyIGkgPSAwLCBudW1Ub2tlbnMgPSB0b2tlbnMubGVuZ3RoOyBpIDwgbnVtVG9rZW5zOyArK2kpIHtcbiAgICAgIHRva2VuID0gdG9rZW5zW2ldO1xuXG4gICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgaWYgKHRva2VuWzBdID09PSAndGV4dCcgJiYgbGFzdFRva2VuICYmIGxhc3RUb2tlblswXSA9PT0gJ3RleHQnKSB7XG4gICAgICAgICAgbGFzdFRva2VuWzFdICs9IHRva2VuWzFdO1xuICAgICAgICAgIGxhc3RUb2tlblszXSA9IHRva2VuWzNdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNxdWFzaGVkVG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgIGxhc3RUb2tlbiA9IHRva2VuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHNxdWFzaGVkVG9rZW5zO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvcm1zIHRoZSBnaXZlbiBhcnJheSBvZiBgdG9rZW5zYCBpbnRvIGEgbmVzdGVkIHRyZWUgc3RydWN0dXJlIHdoZXJlXG4gICAqIHRva2VucyB0aGF0IHJlcHJlc2VudCBhIHNlY3Rpb24gaGF2ZSB0d28gYWRkaXRpb25hbCBpdGVtczogMSkgYW4gYXJyYXkgb2ZcbiAgICogYWxsIHRva2VucyB0aGF0IGFwcGVhciBpbiB0aGF0IHNlY3Rpb24gYW5kIDIpIHRoZSBpbmRleCBpbiB0aGUgb3JpZ2luYWxcbiAgICogdGVtcGxhdGUgdGhhdCByZXByZXNlbnRzIHRoZSBlbmQgb2YgdGhhdCBzZWN0aW9uLlxuICAgKi9cbiAgZnVuY3Rpb24gbmVzdFRva2VucyAodG9rZW5zKSB7XG4gICAgdmFyIG5lc3RlZFRva2VucyA9IFtdO1xuICAgIHZhciBjb2xsZWN0b3IgPSBuZXN0ZWRUb2tlbnM7XG4gICAgdmFyIHNlY3Rpb25zID0gW107XG5cbiAgICB2YXIgdG9rZW4sIHNlY3Rpb247XG4gICAgZm9yICh2YXIgaSA9IDAsIG51bVRva2VucyA9IHRva2Vucy5sZW5ndGg7IGkgPCBudW1Ub2tlbnM7ICsraSkge1xuICAgICAgdG9rZW4gPSB0b2tlbnNbaV07XG5cbiAgICAgIHN3aXRjaCAodG9rZW5bMF0pIHtcbiAgICAgICAgY2FzZSAnIyc6XG4gICAgICAgIGNhc2UgJ14nOlxuICAgICAgICAgIGNvbGxlY3Rvci5wdXNoKHRva2VuKTtcbiAgICAgICAgICBzZWN0aW9ucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICBjb2xsZWN0b3IgPSB0b2tlbls0XSA9IFtdO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICcvJzpcbiAgICAgICAgICBzZWN0aW9uID0gc2VjdGlvbnMucG9wKCk7XG4gICAgICAgICAgc2VjdGlvbls1XSA9IHRva2VuWzJdO1xuICAgICAgICAgIGNvbGxlY3RvciA9IHNlY3Rpb25zLmxlbmd0aCA+IDAgPyBzZWN0aW9uc1tzZWN0aW9ucy5sZW5ndGggLSAxXVs0XSA6IG5lc3RlZFRva2VucztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBjb2xsZWN0b3IucHVzaCh0b2tlbik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5lc3RlZFRva2VucztcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHNpbXBsZSBzdHJpbmcgc2Nhbm5lciB0aGF0IGlzIHVzZWQgYnkgdGhlIHRlbXBsYXRlIHBhcnNlciB0byBmaW5kXG4gICAqIHRva2VucyBpbiB0ZW1wbGF0ZSBzdHJpbmdzLlxuICAgKi9cbiAgZnVuY3Rpb24gU2Nhbm5lciAoc3RyaW5nKSB7XG4gICAgdGhpcy5zdHJpbmcgPSBzdHJpbmc7XG4gICAgdGhpcy50YWlsID0gc3RyaW5nO1xuICAgIHRoaXMucG9zID0gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdGFpbCBpcyBlbXB0eSAoZW5kIG9mIHN0cmluZykuXG4gICAqL1xuICBTY2FubmVyLnByb3RvdHlwZS5lb3MgPSBmdW5jdGlvbiBlb3MgKCkge1xuICAgIHJldHVybiB0aGlzLnRhaWwgPT09ICcnO1xuICB9O1xuXG4gIC8qKlxuICAgKiBUcmllcyB0byBtYXRjaCB0aGUgZ2l2ZW4gcmVndWxhciBleHByZXNzaW9uIGF0IHRoZSBjdXJyZW50IHBvc2l0aW9uLlxuICAgKiBSZXR1cm5zIHRoZSBtYXRjaGVkIHRleHQgaWYgaXQgY2FuIG1hdGNoLCB0aGUgZW1wdHkgc3RyaW5nIG90aGVyd2lzZS5cbiAgICovXG4gIFNjYW5uZXIucHJvdG90eXBlLnNjYW4gPSBmdW5jdGlvbiBzY2FuIChyZSkge1xuICAgIHZhciBtYXRjaCA9IHRoaXMudGFpbC5tYXRjaChyZSk7XG5cbiAgICBpZiAoIW1hdGNoIHx8IG1hdGNoLmluZGV4ICE9PSAwKVxuICAgICAgcmV0dXJuICcnO1xuXG4gICAgdmFyIHN0cmluZyA9IG1hdGNoWzBdO1xuXG4gICAgdGhpcy50YWlsID0gdGhpcy50YWlsLnN1YnN0cmluZyhzdHJpbmcubGVuZ3RoKTtcbiAgICB0aGlzLnBvcyArPSBzdHJpbmcubGVuZ3RoO1xuXG4gICAgcmV0dXJuIHN0cmluZztcbiAgfTtcblxuICAvKipcbiAgICogU2tpcHMgYWxsIHRleHQgdW50aWwgdGhlIGdpdmVuIHJlZ3VsYXIgZXhwcmVzc2lvbiBjYW4gYmUgbWF0Y2hlZC4gUmV0dXJuc1xuICAgKiB0aGUgc2tpcHBlZCBzdHJpbmcsIHdoaWNoIGlzIHRoZSBlbnRpcmUgdGFpbCBpZiBubyBtYXRjaCBjYW4gYmUgbWFkZS5cbiAgICovXG4gIFNjYW5uZXIucHJvdG90eXBlLnNjYW5VbnRpbCA9IGZ1bmN0aW9uIHNjYW5VbnRpbCAocmUpIHtcbiAgICB2YXIgaW5kZXggPSB0aGlzLnRhaWwuc2VhcmNoKHJlKSwgbWF0Y2g7XG5cbiAgICBzd2l0Y2ggKGluZGV4KSB7XG4gICAgICBjYXNlIC0xOlxuICAgICAgICBtYXRjaCA9IHRoaXMudGFpbDtcbiAgICAgICAgdGhpcy50YWlsID0gJyc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAwOlxuICAgICAgICBtYXRjaCA9ICcnO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIG1hdGNoID0gdGhpcy50YWlsLnN1YnN0cmluZygwLCBpbmRleCk7XG4gICAgICAgIHRoaXMudGFpbCA9IHRoaXMudGFpbC5zdWJzdHJpbmcoaW5kZXgpO1xuICAgIH1cblxuICAgIHRoaXMucG9zICs9IG1hdGNoLmxlbmd0aDtcblxuICAgIHJldHVybiBtYXRjaDtcbiAgfTtcblxuICAvKipcbiAgICogUmVwcmVzZW50cyBhIHJlbmRlcmluZyBjb250ZXh0IGJ5IHdyYXBwaW5nIGEgdmlldyBvYmplY3QgYW5kXG4gICAqIG1haW50YWluaW5nIGEgcmVmZXJlbmNlIHRvIHRoZSBwYXJlbnQgY29udGV4dC5cbiAgICovXG4gIGZ1bmN0aW9uIENvbnRleHQgKHZpZXcsIHBhcmVudENvbnRleHQpIHtcbiAgICB0aGlzLnZpZXcgPSB2aWV3O1xuICAgIHRoaXMuY2FjaGUgPSB7ICcuJzogdGhpcy52aWV3IH07XG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnRDb250ZXh0O1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgY29udGV4dCB1c2luZyB0aGUgZ2l2ZW4gdmlldyB3aXRoIHRoaXMgY29udGV4dFxuICAgKiBhcyB0aGUgcGFyZW50LlxuICAgKi9cbiAgQ29udGV4dC5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uIHB1c2ggKHZpZXcpIHtcbiAgICByZXR1cm4gbmV3IENvbnRleHQodmlldywgdGhpcyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHZhbHVlIG9mIHRoZSBnaXZlbiBuYW1lIGluIHRoaXMgY29udGV4dCwgdHJhdmVyc2luZ1xuICAgKiB1cCB0aGUgY29udGV4dCBoaWVyYXJjaHkgaWYgdGhlIHZhbHVlIGlzIGFic2VudCBpbiB0aGlzIGNvbnRleHQncyB2aWV3LlxuICAgKi9cbiAgQ29udGV4dC5wcm90b3R5cGUubG9va3VwID0gZnVuY3Rpb24gbG9va3VwIChuYW1lKSB7XG4gICAgdmFyIGNhY2hlID0gdGhpcy5jYWNoZTtcblxuICAgIHZhciB2YWx1ZTtcbiAgICBpZiAoY2FjaGUuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgIHZhbHVlID0gY2FjaGVbbmFtZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBjb250ZXh0ID0gdGhpcywgaW50ZXJtZWRpYXRlVmFsdWUsIG5hbWVzLCBpbmRleCwgbG9va3VwSGl0ID0gZmFsc2U7XG5cbiAgICAgIHdoaWxlIChjb250ZXh0KSB7XG4gICAgICAgIGlmIChuYW1lLmluZGV4T2YoJy4nKSA+IDApIHtcbiAgICAgICAgICBpbnRlcm1lZGlhdGVWYWx1ZSA9IGNvbnRleHQudmlldztcbiAgICAgICAgICBuYW1lcyA9IG5hbWUuc3BsaXQoJy4nKTtcbiAgICAgICAgICBpbmRleCA9IDA7XG5cbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBVc2luZyB0aGUgZG90IG5vdGlvbiBwYXRoIGluIGBuYW1lYCwgd2UgZGVzY2VuZCB0aHJvdWdoIHRoZVxuICAgICAgICAgICAqIG5lc3RlZCBvYmplY3RzLlxuICAgICAgICAgICAqXG4gICAgICAgICAgICogVG8gYmUgY2VydGFpbiB0aGF0IHRoZSBsb29rdXAgaGFzIGJlZW4gc3VjY2Vzc2Z1bCwgd2UgaGF2ZSB0b1xuICAgICAgICAgICAqIGNoZWNrIGlmIHRoZSBsYXN0IG9iamVjdCBpbiB0aGUgcGF0aCBhY3R1YWxseSBoYXMgdGhlIHByb3BlcnR5XG4gICAgICAgICAgICogd2UgYXJlIGxvb2tpbmcgZm9yLiBXZSBzdG9yZSB0aGUgcmVzdWx0IGluIGBsb29rdXBIaXRgLlxuICAgICAgICAgICAqXG4gICAgICAgICAgICogVGhpcyBpcyBzcGVjaWFsbHkgbmVjZXNzYXJ5IGZvciB3aGVuIHRoZSB2YWx1ZSBoYXMgYmVlbiBzZXQgdG9cbiAgICAgICAgICAgKiBgdW5kZWZpbmVkYCBhbmQgd2Ugd2FudCB0byBhdm9pZCBsb29raW5nIHVwIHBhcmVudCBjb250ZXh0cy5cbiAgICAgICAgICAgKlxuICAgICAgICAgICAqIEluIHRoZSBjYXNlIHdoZXJlIGRvdCBub3RhdGlvbiBpcyB1c2VkLCB3ZSBjb25zaWRlciB0aGUgbG9va3VwXG4gICAgICAgICAgICogdG8gYmUgc3VjY2Vzc2Z1bCBldmVuIGlmIHRoZSBsYXN0IFwib2JqZWN0XCIgaW4gdGhlIHBhdGggaXNcbiAgICAgICAgICAgKiBub3QgYWN0dWFsbHkgYW4gb2JqZWN0IGJ1dCBhIHByaW1pdGl2ZSAoZS5nLiwgYSBzdHJpbmcsIG9yIGFuXG4gICAgICAgICAgICogaW50ZWdlciksIGJlY2F1c2UgaXQgaXMgc29tZXRpbWVzIHVzZWZ1bCB0byBhY2Nlc3MgYSBwcm9wZXJ0eVxuICAgICAgICAgICAqIG9mIGFuIGF1dG9ib3hlZCBwcmltaXRpdmUsIHN1Y2ggYXMgdGhlIGxlbmd0aCBvZiBhIHN0cmluZy5cbiAgICAgICAgICAgKiovXG4gICAgICAgICAgd2hpbGUgKGludGVybWVkaWF0ZVZhbHVlICE9IG51bGwgJiYgaW5kZXggPCBuYW1lcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChpbmRleCA9PT0gbmFtZXMubGVuZ3RoIC0gMSlcbiAgICAgICAgICAgICAgbG9va3VwSGl0ID0gKFxuICAgICAgICAgICAgICAgIGhhc1Byb3BlcnR5KGludGVybWVkaWF0ZVZhbHVlLCBuYW1lc1tpbmRleF0pIFxuICAgICAgICAgICAgICAgIHx8IHByaW1pdGl2ZUhhc093blByb3BlcnR5KGludGVybWVkaWF0ZVZhbHVlLCBuYW1lc1tpbmRleF0pXG4gICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGludGVybWVkaWF0ZVZhbHVlID0gaW50ZXJtZWRpYXRlVmFsdWVbbmFtZXNbaW5kZXgrK11dO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpbnRlcm1lZGlhdGVWYWx1ZSA9IGNvbnRleHQudmlld1tuYW1lXTtcblxuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIE9ubHkgY2hlY2tpbmcgYWdhaW5zdCBgaGFzUHJvcGVydHlgLCB3aGljaCBhbHdheXMgcmV0dXJucyBgZmFsc2VgIGlmXG4gICAgICAgICAgICogYGNvbnRleHQudmlld2AgaXMgbm90IGFuIG9iamVjdC4gRGVsaWJlcmF0ZWx5IG9taXR0aW5nIHRoZSBjaGVja1xuICAgICAgICAgICAqIGFnYWluc3QgYHByaW1pdGl2ZUhhc093blByb3BlcnR5YCBpZiBkb3Qgbm90YXRpb24gaXMgbm90IHVzZWQuXG4gICAgICAgICAgICpcbiAgICAgICAgICAgKiBDb25zaWRlciB0aGlzIGV4YW1wbGU6XG4gICAgICAgICAgICogYGBgXG4gICAgICAgICAgICogTXVzdGFjaGUucmVuZGVyKFwiVGhlIGxlbmd0aCBvZiBhIGZvb3RiYWxsIGZpZWxkIGlzIHt7I2xlbmd0aH19e3tsZW5ndGh9fXt7L2xlbmd0aH19LlwiLCB7bGVuZ3RoOiBcIjEwMCB5YXJkc1wifSlcbiAgICAgICAgICAgKiBgYGBcbiAgICAgICAgICAgKlxuICAgICAgICAgICAqIElmIHdlIHdlcmUgdG8gY2hlY2sgYWxzbyBhZ2FpbnN0IGBwcmltaXRpdmVIYXNPd25Qcm9wZXJ0eWAsIGFzIHdlIGRvXG4gICAgICAgICAgICogaW4gdGhlIGRvdCBub3RhdGlvbiBjYXNlLCB0aGVuIHJlbmRlciBjYWxsIHdvdWxkIHJldHVybjpcbiAgICAgICAgICAgKlxuICAgICAgICAgICAqIFwiVGhlIGxlbmd0aCBvZiBhIGZvb3RiYWxsIGZpZWxkIGlzIDkuXCJcbiAgICAgICAgICAgKlxuICAgICAgICAgICAqIHJhdGhlciB0aGFuIHRoZSBleHBlY3RlZDpcbiAgICAgICAgICAgKlxuICAgICAgICAgICAqIFwiVGhlIGxlbmd0aCBvZiBhIGZvb3RiYWxsIGZpZWxkIGlzIDEwMCB5YXJkcy5cIlxuICAgICAgICAgICAqKi9cbiAgICAgICAgICBsb29rdXBIaXQgPSBoYXNQcm9wZXJ0eShjb250ZXh0LnZpZXcsIG5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxvb2t1cEhpdCkge1xuICAgICAgICAgIHZhbHVlID0gaW50ZXJtZWRpYXRlVmFsdWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBjb250ZXh0ID0gY29udGV4dC5wYXJlbnQ7XG4gICAgICB9XG5cbiAgICAgIGNhY2hlW25hbWVdID0gdmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKVxuICAgICAgdmFsdWUgPSB2YWx1ZS5jYWxsKHRoaXMudmlldyk7XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG5cbiAgLyoqXG4gICAqIEEgV3JpdGVyIGtub3dzIGhvdyB0byB0YWtlIGEgc3RyZWFtIG9mIHRva2VucyBhbmQgcmVuZGVyIHRoZW0gdG8gYVxuICAgKiBzdHJpbmcsIGdpdmVuIGEgY29udGV4dC4gSXQgYWxzbyBtYWludGFpbnMgYSBjYWNoZSBvZiB0ZW1wbGF0ZXMgdG9cbiAgICogYXZvaWQgdGhlIG5lZWQgdG8gcGFyc2UgdGhlIHNhbWUgdGVtcGxhdGUgdHdpY2UuXG4gICAqL1xuICBmdW5jdGlvbiBXcml0ZXIgKCkge1xuICAgIHRoaXMuY2FjaGUgPSB7fTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhcnMgYWxsIGNhY2hlZCB0ZW1wbGF0ZXMgaW4gdGhpcyB3cml0ZXIuXG4gICAqL1xuICBXcml0ZXIucHJvdG90eXBlLmNsZWFyQ2FjaGUgPSBmdW5jdGlvbiBjbGVhckNhY2hlICgpIHtcbiAgICB0aGlzLmNhY2hlID0ge307XG4gIH07XG5cbiAgLyoqXG4gICAqIFBhcnNlcyBhbmQgY2FjaGVzIHRoZSBnaXZlbiBgdGVtcGxhdGVgIGFjY29yZGluZyB0byB0aGUgZ2l2ZW4gYHRhZ3NgIG9yXG4gICAqIGBtdXN0YWNoZS50YWdzYCBpZiBgdGFnc2AgaXMgb21pdHRlZCwgIGFuZCByZXR1cm5zIHRoZSBhcnJheSBvZiB0b2tlbnNcbiAgICogdGhhdCBpcyBnZW5lcmF0ZWQgZnJvbSB0aGUgcGFyc2UuXG4gICAqL1xuICBXcml0ZXIucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24gcGFyc2UgKHRlbXBsYXRlLCB0YWdzKSB7XG4gICAgdmFyIGNhY2hlID0gdGhpcy5jYWNoZTtcbiAgICB2YXIgY2FjaGVLZXkgPSB0ZW1wbGF0ZSArICc6JyArICh0YWdzIHx8IG11c3RhY2hlLnRhZ3MpLmpvaW4oJzonKTtcbiAgICB2YXIgdG9rZW5zID0gY2FjaGVbY2FjaGVLZXldO1xuXG4gICAgaWYgKHRva2VucyA9PSBudWxsKVxuICAgICAgdG9rZW5zID0gY2FjaGVbY2FjaGVLZXldID0gcGFyc2VUZW1wbGF0ZSh0ZW1wbGF0ZSwgdGFncyk7XG5cbiAgICByZXR1cm4gdG9rZW5zO1xuICB9O1xuXG4gIC8qKlxuICAgKiBIaWdoLWxldmVsIG1ldGhvZCB0aGF0IGlzIHVzZWQgdG8gcmVuZGVyIHRoZSBnaXZlbiBgdGVtcGxhdGVgIHdpdGhcbiAgICogdGhlIGdpdmVuIGB2aWV3YC5cbiAgICpcbiAgICogVGhlIG9wdGlvbmFsIGBwYXJ0aWFsc2AgYXJndW1lbnQgbWF5IGJlIGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIHRoZVxuICAgKiBuYW1lcyBhbmQgdGVtcGxhdGVzIG9mIHBhcnRpYWxzIHRoYXQgYXJlIHVzZWQgaW4gdGhlIHRlbXBsYXRlLiBJdCBtYXlcbiAgICogYWxzbyBiZSBhIGZ1bmN0aW9uIHRoYXQgaXMgdXNlZCB0byBsb2FkIHBhcnRpYWwgdGVtcGxhdGVzIG9uIHRoZSBmbHlcbiAgICogdGhhdCB0YWtlcyBhIHNpbmdsZSBhcmd1bWVudDogdGhlIG5hbWUgb2YgdGhlIHBhcnRpYWwuXG4gICAqXG4gICAqIElmIHRoZSBvcHRpb25hbCBgdGFnc2AgYXJndW1lbnQgaXMgZ2l2ZW4gaGVyZSBpdCBtdXN0IGJlIGFuIGFycmF5IHdpdGggdHdvXG4gICAqIHN0cmluZyB2YWx1ZXM6IHRoZSBvcGVuaW5nIGFuZCBjbG9zaW5nIHRhZ3MgdXNlZCBpbiB0aGUgdGVtcGxhdGUgKGUuZy5cbiAgICogWyBcIjwlXCIsIFwiJT5cIiBdKS4gVGhlIGRlZmF1bHQgaXMgdG8gbXVzdGFjaGUudGFncy5cbiAgICovXG4gIFdyaXRlci5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gcmVuZGVyICh0ZW1wbGF0ZSwgdmlldywgcGFydGlhbHMsIHRhZ3MpIHtcbiAgICB2YXIgdG9rZW5zID0gdGhpcy5wYXJzZSh0ZW1wbGF0ZSwgdGFncyk7XG4gICAgdmFyIGNvbnRleHQgPSAodmlldyBpbnN0YW5jZW9mIENvbnRleHQpID8gdmlldyA6IG5ldyBDb250ZXh0KHZpZXcpO1xuICAgIHJldHVybiB0aGlzLnJlbmRlclRva2Vucyh0b2tlbnMsIGNvbnRleHQsIHBhcnRpYWxzLCB0ZW1wbGF0ZSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIExvdy1sZXZlbCBtZXRob2QgdGhhdCByZW5kZXJzIHRoZSBnaXZlbiBhcnJheSBvZiBgdG9rZW5zYCB1c2luZ1xuICAgKiB0aGUgZ2l2ZW4gYGNvbnRleHRgIGFuZCBgcGFydGlhbHNgLlxuICAgKlxuICAgKiBOb3RlOiBUaGUgYG9yaWdpbmFsVGVtcGxhdGVgIGlzIG9ubHkgZXZlciB1c2VkIHRvIGV4dHJhY3QgdGhlIHBvcnRpb25cbiAgICogb2YgdGhlIG9yaWdpbmFsIHRlbXBsYXRlIHRoYXQgd2FzIGNvbnRhaW5lZCBpbiBhIGhpZ2hlci1vcmRlciBzZWN0aW9uLlxuICAgKiBJZiB0aGUgdGVtcGxhdGUgZG9lc24ndCB1c2UgaGlnaGVyLW9yZGVyIHNlY3Rpb25zLCB0aGlzIGFyZ3VtZW50IG1heVxuICAgKiBiZSBvbWl0dGVkLlxuICAgKi9cbiAgV3JpdGVyLnByb3RvdHlwZS5yZW5kZXJUb2tlbnMgPSBmdW5jdGlvbiByZW5kZXJUb2tlbnMgKHRva2VucywgY29udGV4dCwgcGFydGlhbHMsIG9yaWdpbmFsVGVtcGxhdGUpIHtcbiAgICB2YXIgYnVmZmVyID0gJyc7XG5cbiAgICB2YXIgdG9rZW4sIHN5bWJvbCwgdmFsdWU7XG4gICAgZm9yICh2YXIgaSA9IDAsIG51bVRva2VucyA9IHRva2Vucy5sZW5ndGg7IGkgPCBudW1Ub2tlbnM7ICsraSkge1xuICAgICAgdmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICB0b2tlbiA9IHRva2Vuc1tpXTtcbiAgICAgIHN5bWJvbCA9IHRva2VuWzBdO1xuXG4gICAgICBpZiAoc3ltYm9sID09PSAnIycpIHZhbHVlID0gdGhpcy5yZW5kZXJTZWN0aW9uKHRva2VuLCBjb250ZXh0LCBwYXJ0aWFscywgb3JpZ2luYWxUZW1wbGF0ZSk7XG4gICAgICBlbHNlIGlmIChzeW1ib2wgPT09ICdeJykgdmFsdWUgPSB0aGlzLnJlbmRlckludmVydGVkKHRva2VuLCBjb250ZXh0LCBwYXJ0aWFscywgb3JpZ2luYWxUZW1wbGF0ZSk7XG4gICAgICBlbHNlIGlmIChzeW1ib2wgPT09ICc+JykgdmFsdWUgPSB0aGlzLnJlbmRlclBhcnRpYWwodG9rZW4sIGNvbnRleHQsIHBhcnRpYWxzLCBvcmlnaW5hbFRlbXBsYXRlKTtcbiAgICAgIGVsc2UgaWYgKHN5bWJvbCA9PT0gJyYnKSB2YWx1ZSA9IHRoaXMudW5lc2NhcGVkVmFsdWUodG9rZW4sIGNvbnRleHQpO1xuICAgICAgZWxzZSBpZiAoc3ltYm9sID09PSAnbmFtZScpIHZhbHVlID0gdGhpcy5lc2NhcGVkVmFsdWUodG9rZW4sIGNvbnRleHQpO1xuICAgICAgZWxzZSBpZiAoc3ltYm9sID09PSAndGV4dCcpIHZhbHVlID0gdGhpcy5yYXdWYWx1ZSh0b2tlbik7XG5cbiAgICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICBidWZmZXIgKz0gdmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ1ZmZlcjtcbiAgfTtcblxuICBXcml0ZXIucHJvdG90eXBlLnJlbmRlclNlY3Rpb24gPSBmdW5jdGlvbiByZW5kZXJTZWN0aW9uICh0b2tlbiwgY29udGV4dCwgcGFydGlhbHMsIG9yaWdpbmFsVGVtcGxhdGUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGJ1ZmZlciA9ICcnO1xuICAgIHZhciB2YWx1ZSA9IGNvbnRleHQubG9va3VwKHRva2VuWzFdKTtcblxuICAgIC8vIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCB0byByZW5kZXIgYW4gYXJiaXRyYXJ5IHRlbXBsYXRlXG4gICAgLy8gaW4gdGhlIGN1cnJlbnQgY29udGV4dCBieSBoaWdoZXItb3JkZXIgc2VjdGlvbnMuXG4gICAgZnVuY3Rpb24gc3ViUmVuZGVyICh0ZW1wbGF0ZSkge1xuICAgICAgcmV0dXJuIHNlbGYucmVuZGVyKHRlbXBsYXRlLCBjb250ZXh0LCBwYXJ0aWFscyk7XG4gICAgfVxuXG4gICAgaWYgKCF2YWx1ZSkgcmV0dXJuO1xuXG4gICAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgICBmb3IgKHZhciBqID0gMCwgdmFsdWVMZW5ndGggPSB2YWx1ZS5sZW5ndGg7IGogPCB2YWx1ZUxlbmd0aDsgKytqKSB7XG4gICAgICAgIGJ1ZmZlciArPSB0aGlzLnJlbmRlclRva2Vucyh0b2tlbls0XSwgY29udGV4dC5wdXNoKHZhbHVlW2pdKSwgcGFydGlhbHMsIG9yaWdpbmFsVGVtcGxhdGUpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIGJ1ZmZlciArPSB0aGlzLnJlbmRlclRva2Vucyh0b2tlbls0XSwgY29udGV4dC5wdXNoKHZhbHVlKSwgcGFydGlhbHMsIG9yaWdpbmFsVGVtcGxhdGUpO1xuICAgIH0gZWxzZSBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgIGlmICh0eXBlb2Ygb3JpZ2luYWxUZW1wbGF0ZSAhPT0gJ3N0cmluZycpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHVzZSBoaWdoZXItb3JkZXIgc2VjdGlvbnMgd2l0aG91dCB0aGUgb3JpZ2luYWwgdGVtcGxhdGUnKTtcblxuICAgICAgLy8gRXh0cmFjdCB0aGUgcG9ydGlvbiBvZiB0aGUgb3JpZ2luYWwgdGVtcGxhdGUgdGhhdCB0aGUgc2VjdGlvbiBjb250YWlucy5cbiAgICAgIHZhbHVlID0gdmFsdWUuY2FsbChjb250ZXh0LnZpZXcsIG9yaWdpbmFsVGVtcGxhdGUuc2xpY2UodG9rZW5bM10sIHRva2VuWzVdKSwgc3ViUmVuZGVyKTtcblxuICAgICAgaWYgKHZhbHVlICE9IG51bGwpXG4gICAgICAgIGJ1ZmZlciArPSB2YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgYnVmZmVyICs9IHRoaXMucmVuZGVyVG9rZW5zKHRva2VuWzRdLCBjb250ZXh0LCBwYXJ0aWFscywgb3JpZ2luYWxUZW1wbGF0ZSk7XG4gICAgfVxuICAgIHJldHVybiBidWZmZXI7XG4gIH07XG5cbiAgV3JpdGVyLnByb3RvdHlwZS5yZW5kZXJJbnZlcnRlZCA9IGZ1bmN0aW9uIHJlbmRlckludmVydGVkICh0b2tlbiwgY29udGV4dCwgcGFydGlhbHMsIG9yaWdpbmFsVGVtcGxhdGUpIHtcbiAgICB2YXIgdmFsdWUgPSBjb250ZXh0Lmxvb2t1cCh0b2tlblsxXSk7XG5cbiAgICAvLyBVc2UgSmF2YVNjcmlwdCdzIGRlZmluaXRpb24gb2YgZmFsc3kuIEluY2x1ZGUgZW1wdHkgYXJyYXlzLlxuICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vamFubC9tdXN0YWNoZS5qcy9pc3N1ZXMvMTg2XG4gICAgaWYgKCF2YWx1ZSB8fCAoaXNBcnJheSh2YWx1ZSkgJiYgdmFsdWUubGVuZ3RoID09PSAwKSlcbiAgICAgIHJldHVybiB0aGlzLnJlbmRlclRva2Vucyh0b2tlbls0XSwgY29udGV4dCwgcGFydGlhbHMsIG9yaWdpbmFsVGVtcGxhdGUpO1xuICB9O1xuXG4gIFdyaXRlci5wcm90b3R5cGUucmVuZGVyUGFydGlhbCA9IGZ1bmN0aW9uIHJlbmRlclBhcnRpYWwgKHRva2VuLCBjb250ZXh0LCBwYXJ0aWFscykge1xuICAgIGlmICghcGFydGlhbHMpIHJldHVybjtcblxuICAgIHZhciB2YWx1ZSA9IGlzRnVuY3Rpb24ocGFydGlhbHMpID8gcGFydGlhbHModG9rZW5bMV0pIDogcGFydGlhbHNbdG9rZW5bMV1dO1xuICAgIGlmICh2YWx1ZSAhPSBudWxsKVxuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyVG9rZW5zKHRoaXMucGFyc2UodmFsdWUpLCBjb250ZXh0LCBwYXJ0aWFscywgdmFsdWUpO1xuICB9O1xuXG4gIFdyaXRlci5wcm90b3R5cGUudW5lc2NhcGVkVmFsdWUgPSBmdW5jdGlvbiB1bmVzY2FwZWRWYWx1ZSAodG9rZW4sIGNvbnRleHQpIHtcbiAgICB2YXIgdmFsdWUgPSBjb250ZXh0Lmxvb2t1cCh0b2tlblsxXSk7XG4gICAgaWYgKHZhbHVlICE9IG51bGwpXG4gICAgICByZXR1cm4gdmFsdWU7XG4gIH07XG5cbiAgV3JpdGVyLnByb3RvdHlwZS5lc2NhcGVkVmFsdWUgPSBmdW5jdGlvbiBlc2NhcGVkVmFsdWUgKHRva2VuLCBjb250ZXh0KSB7XG4gICAgdmFyIHZhbHVlID0gY29udGV4dC5sb29rdXAodG9rZW5bMV0pO1xuICAgIGlmICh2YWx1ZSAhPSBudWxsKVxuICAgICAgcmV0dXJuIG11c3RhY2hlLmVzY2FwZSh2YWx1ZSk7XG4gIH07XG5cbiAgV3JpdGVyLnByb3RvdHlwZS5yYXdWYWx1ZSA9IGZ1bmN0aW9uIHJhd1ZhbHVlICh0b2tlbikge1xuICAgIHJldHVybiB0b2tlblsxXTtcbiAgfTtcblxuICBtdXN0YWNoZS5uYW1lID0gJ211c3RhY2hlLmpzJztcbiAgbXVzdGFjaGUudmVyc2lvbiA9ICczLjAuMCc7XG4gIG11c3RhY2hlLnRhZ3MgPSBbICd7eycsICd9fScgXTtcblxuICAvLyBBbGwgaGlnaC1sZXZlbCBtdXN0YWNoZS4qIGZ1bmN0aW9ucyB1c2UgdGhpcyB3cml0ZXIuXG4gIHZhciBkZWZhdWx0V3JpdGVyID0gbmV3IFdyaXRlcigpO1xuXG4gIC8qKlxuICAgKiBDbGVhcnMgYWxsIGNhY2hlZCB0ZW1wbGF0ZXMgaW4gdGhlIGRlZmF1bHQgd3JpdGVyLlxuICAgKi9cbiAgbXVzdGFjaGUuY2xlYXJDYWNoZSA9IGZ1bmN0aW9uIGNsZWFyQ2FjaGUgKCkge1xuICAgIHJldHVybiBkZWZhdWx0V3JpdGVyLmNsZWFyQ2FjaGUoKTtcbiAgfTtcblxuICAvKipcbiAgICogUGFyc2VzIGFuZCBjYWNoZXMgdGhlIGdpdmVuIHRlbXBsYXRlIGluIHRoZSBkZWZhdWx0IHdyaXRlciBhbmQgcmV0dXJucyB0aGVcbiAgICogYXJyYXkgb2YgdG9rZW5zIGl0IGNvbnRhaW5zLiBEb2luZyB0aGlzIGFoZWFkIG9mIHRpbWUgYXZvaWRzIHRoZSBuZWVkIHRvXG4gICAqIHBhcnNlIHRlbXBsYXRlcyBvbiB0aGUgZmx5IGFzIHRoZXkgYXJlIHJlbmRlcmVkLlxuICAgKi9cbiAgbXVzdGFjaGUucGFyc2UgPSBmdW5jdGlvbiBwYXJzZSAodGVtcGxhdGUsIHRhZ3MpIHtcbiAgICByZXR1cm4gZGVmYXVsdFdyaXRlci5wYXJzZSh0ZW1wbGF0ZSwgdGFncyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJlbmRlcnMgdGhlIGB0ZW1wbGF0ZWAgd2l0aCB0aGUgZ2l2ZW4gYHZpZXdgIGFuZCBgcGFydGlhbHNgIHVzaW5nIHRoZVxuICAgKiBkZWZhdWx0IHdyaXRlci4gSWYgdGhlIG9wdGlvbmFsIGB0YWdzYCBhcmd1bWVudCBpcyBnaXZlbiBoZXJlIGl0IG11c3QgYmUgYW5cbiAgICogYXJyYXkgd2l0aCB0d28gc3RyaW5nIHZhbHVlczogdGhlIG9wZW5pbmcgYW5kIGNsb3NpbmcgdGFncyB1c2VkIGluIHRoZVxuICAgKiB0ZW1wbGF0ZSAoZS5nLiBbIFwiPCVcIiwgXCIlPlwiIF0pLiBUaGUgZGVmYXVsdCBpcyB0byBtdXN0YWNoZS50YWdzLlxuICAgKi9cbiAgbXVzdGFjaGUucmVuZGVyID0gZnVuY3Rpb24gcmVuZGVyICh0ZW1wbGF0ZSwgdmlldywgcGFydGlhbHMsIHRhZ3MpIHtcbiAgICBpZiAodHlwZW9mIHRlbXBsYXRlICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCB0ZW1wbGF0ZSEgVGVtcGxhdGUgc2hvdWxkIGJlIGEgXCJzdHJpbmdcIiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ2J1dCBcIicgKyB0eXBlU3RyKHRlbXBsYXRlKSArICdcIiB3YXMgZ2l2ZW4gYXMgdGhlIGZpcnN0ICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnYXJndW1lbnQgZm9yIG11c3RhY2hlI3JlbmRlcih0ZW1wbGF0ZSwgdmlldywgcGFydGlhbHMpJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlZmF1bHRXcml0ZXIucmVuZGVyKHRlbXBsYXRlLCB2aWV3LCBwYXJ0aWFscywgdGFncyk7XG4gIH07XG5cbiAgLy8gVGhpcyBpcyBoZXJlIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eSB3aXRoIDAuNC54LixcbiAgLyplc2xpbnQtZGlzYWJsZSAqLyAvLyBlc2xpbnQgd2FudHMgY2FtZWwgY2FzZWQgZnVuY3Rpb24gbmFtZVxuICBtdXN0YWNoZS50b19odG1sID0gZnVuY3Rpb24gdG9faHRtbCAodGVtcGxhdGUsIHZpZXcsIHBhcnRpYWxzLCBzZW5kKSB7XG4gICAgLyplc2xpbnQtZW5hYmxlKi9cblxuICAgIHZhciByZXN1bHQgPSBtdXN0YWNoZS5yZW5kZXIodGVtcGxhdGUsIHZpZXcsIHBhcnRpYWxzKTtcblxuICAgIGlmIChpc0Z1bmN0aW9uKHNlbmQpKSB7XG4gICAgICBzZW5kKHJlc3VsdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICB9O1xuXG4gIC8vIEV4cG9ydCB0aGUgZXNjYXBpbmcgZnVuY3Rpb24gc28gdGhhdCB0aGUgdXNlciBtYXkgb3ZlcnJpZGUgaXQuXG4gIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vamFubC9tdXN0YWNoZS5qcy9pc3N1ZXMvMjQ0XG4gIG11c3RhY2hlLmVzY2FwZSA9IGVzY2FwZUh0bWw7XG5cbiAgLy8gRXhwb3J0IHRoZXNlIG1haW5seSBmb3IgdGVzdGluZywgYnV0IGFsc28gZm9yIGFkdmFuY2VkIHVzYWdlLlxuICBtdXN0YWNoZS5TY2FubmVyID0gU2Nhbm5lcjtcbiAgbXVzdGFjaGUuQ29udGV4dCA9IENvbnRleHQ7XG4gIG11c3RhY2hlLldyaXRlciA9IFdyaXRlcjtcblxuICByZXR1cm4gbXVzdGFjaGU7XG59KSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9tdXN0YWNoZS9tdXN0YWNoZS5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDEgNCIsInZhciBNdXN0YWNoZSA9IHJlcXVpcmUoXCJtdXN0YWNoZVwiKSxcbiAgICBkZWZlciA9IHJlcXVpcmUoXCIuL3V0aWxzL2RlZmVyXCIpLFxuICAgICRtb3JlQnV0dG9uID0gJChcIi5sb2FkLW1vcmVcIiksXG4gICAgcXVlcnkgPSAkbW9yZUJ1dHRvbi5hdHRyKFwiZGF0YS1xdWVyeVwiKSxcbiAgICBwZXJQYWdlID0gJG1vcmVCdXR0b24uYXR0cihcImRhdGEtcGVyLXBhZ2VcIiksXG4gICAgJHVzZXJMaXN0ID0gJChcIi5kaXJlY3RvcnktdXNlcnNcIiksXG4gICAgYWpheFVybCA9IFwiaHR0cHM6Ly93d3cuY2l0eS5hYy51ay9hcGkvc2VhcmNoLmh0bWxcIixcbiAgICAkcmVzdWx0TXNnRGlzcGxheWVkID0gJChcIi5kaXJlY3RvcnktcmVzdWx0cy1tc2dfX2Rpc3BsYXllZFwiKSxcbiAgICBzdGFydFJhbmssXG4gICAgYWpheENhbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHN0YXJ0UmFuayA9ICRtb3JlQnV0dG9uLmF0dHIoXCJkYXRhLXN0YXJ0LXJhbmtcIik7XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICBcInVybFwiOiBhamF4VXJsLFxuICAgICAgICAgICAgXCJkYXRhVHlwZVwiOiBcImpzb25cIixcbiAgICAgICAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgICAgICAgICAgXCJjb2xsZWN0aW9uXCI6IFwidXNlci1kaXJlY3RvcnlcIixcbiAgICAgICAgICAgICAgICBcImZvcm1cIjogXCJqc29uXCIsXG4gICAgICAgICAgICAgICAgXCJzb3J0XCI6IFwibWV0YWZcIixcbiAgICAgICAgICAgICAgICBcInN0YXJ0X3JhbmtcIjogc3RhcnRSYW5rLFxuICAgICAgICAgICAgICAgIFwibnVtX3JhbmtzXCI6IHBlclBhZ2UsXG4gICAgICAgICAgICAgICAgXCJxdWVyeVwiOiBcIipcIiArIHF1ZXJ5ICsgXCIqXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInN1Y2Nlc3NcIjogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZURhdGEoZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pOyAvLyBlbmQgJC5hamF4XG4gICAgfSxcbiAgICB0ZW1wbGF0ZURhdGEgPSBmdW5jdGlvbiAocmVzdWx0cykge1xuICAgICAgICB2YXIgdGVtcGxhdGUgPVxuICAgICAgICAgICAgXCJ7eyN1c2Vyc319PGxpIGNsYXNzPVxcXCJkaXJlY3RvcnktdXNlciBkaXJlY3RvcnktdXNlci0tbG9hZGluZ1xcXCIgaXRlbXNjb3BlIGl0ZW10eXBlPVxcXCJodHRwOlxcL1xcL3NjaGVtYS5vcmdcXC9QZXJzb25cXFwiPlwiICtcbiAgICAgICAgICAgICAgICBcIjxoNCBjbGFzcz1cXFwiZGlyZWN0b3J5LXVzZXJfX25hbWVcXFwiIGl0ZW1wcm9wPVxcXCJuYW1lXFxcIj57e3t0aXRsZX19fSB7e3tmaXJzdE5hbWV9fX0ge3t7bGFzdE5hbWV9fX08XFwvaDQ+XCIgK1xuICAgICAgICAgICAgICAgIFwiPGRpdiBjbGFzcz1cXFwicm93XFxcIj5cIiArXG4gICAgICAgICAgICAgICAgICAgIFwiPGRpdiBjbGFzcz1cXFwiY29sLXhzLTI0IGNvbC1tZC04XFxcIj5cIiArXG4gICAgICAgICAgICAgICAgICAgICAgICBcInt7I2pvYn19PHNwYW4gY2xhc3M9XFxcImRpcmVjdG9yeS11c2VyX19pbmZvIGRpcmVjdG9yeS11c2VyX19pbmZvLS1qb2JcXFwiIGl0ZW1wcm9wPVxcXCJqb2JUaXRsZVxcXCI+e3t7am9ifX19PFxcL3NwYW4+e3svam9ifX1cIiArXG4gICAgICAgICAgICAgICAgICAgIFwiPFxcL2Rpdj5cIiArXG4gICAgICAgICAgICAgICAgICAgIFwiPGRpdiBjbGFzcz1cXFwiY29sLXhzLTI0IGNvbC1tZC04XFxcIj5cIiArXG4gICAgICAgICAgICAgICAgICAgICAgICBcInt7I3RlbH19PHNwYW4gY2xhc3M9XFxcImRpcmVjdG9yeS11c2VyX19pbmZvIGRpcmVjdG9yeS11c2VyX19pbmZvLS10ZWxcXFwiIGl0ZW1wcm9wPVxcXCJ0ZWxlcGhvbmVcXFwiPjxpIGNsYXNzPVxcXCJmYSBmYS1waG9uZVxcXCI+PC9pPjxhIGhyZWY9XFxcInRlbDowMDQ0KDApMjA3MDQwe3t0ZWx9fVxcXCI+KzQ0KDApIDIwNyAwNDAge3t0ZWx9fTxcXC9hPjxcXC9zcGFuPnt7L3RlbH19XCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJ7eyNlbWFpbH19PHNwYW4gY2xhc3M9XFxcImRpcmVjdG9yeS11c2VyX19pbmZvIGRpcmVjdG9yeS11c2VyX19pbmZvLS1lbWFpbFxcXCIgaXRlbXByb3A9XFxcImVtYWlsXFxcIj48aSBjbGFzcz1cXFwiZmEgZmEtZW52ZWxvcGUtb1xcXCI+PC9pPjxhIGhyZWY9XFxcIm1haWx0bzp7e3tlbWFpbH19fVxcXCI+e3t7ZW1haWx9fX08XFwvYT48XFwvc3Bhbj57ey9lbWFpbH19XCIgK1xuICAgICAgICAgICAgICAgICAgICBcIjxcXC9kaXY+XCIgK1xuICAgICAgICAgICAgICAgICAgICBcIjxkaXYgY2xhc3M9XFxcImNvbC14cy0yNCBjb2wtbWQtOFxcXCI+XCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJ7eyNyb29tfX08c3BhbiBjbGFzcz1cXFwiZGlyZWN0b3J5LXVzZXJfX2luZm8gZGlyZWN0b3J5LXVzZXJfX2luZm8tLXJvb21cXFwiPjxpIGNsYXNzPVxcXCJmYSBmYS1tYXAtbWFya2VyXFxcIj48L2k+e3t7cm9vbX19fTxcXC9zcGFuPnt7L3Jvb219fVwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwie3sjZGVwfX08c3BhbiBjbGFzcz1cXFwiZGlyZWN0b3J5LXVzZXJfX2luZm8gZGlyZWN0b3J5LXVzZXJfX2luZm8tLWRlcGFydG1lbnRcXFwiPjxpIGNsYXNzPVxcXCJmYSBmYS1idWlsZGluZy1vXFxcIj48L2k+e3t7ZGVwfX19PFxcL3NwYW4+e3svZGVwfX1cIiArXG4gICAgICAgICAgICAgICAgICAgIFwiPFxcL2Rpdj5cIiArXG4gICAgICAgICAgICAgICAgXCI8XFwvZGl2PlwiICtcbiAgICAgICAgICAgIFwiPFxcL2xpPnt7L3VzZXJzfX1cIjtcbiAgICAgICAgICAgIG51bWJlclJlc3VsdHMgPSByZXN1bHRzLnRvdGFsLFxuICAgICAgICAgICAgcmVzdWx0c1BlclBhZ2UgPSByZXN1bHRzLnJlc3VsdHNQZXJQYWdlLFxuICAgICAgICAgICAgbnVtYmVyUmVzdWx0c0N1dCA9IG51bWJlclJlc3VsdHMgPCByZXN1bHRzUGVyUGFnZSA/IG51bWJlclJlc3VsdHMgOiByZXN1bHRzUGVyUGFnZSxcbiAgICAgICAgICAgIGN1cnJlbnRFbmQgPSByZXN1bHRzLmN1cnJFbmQsXG4gICAgICAgICAgICB0b3RhbERpc3BsYXkgPSBjdXJyZW50RW5kICsgcmVzdWx0c1BlclBhZ2UsXG4gICAgICAgICAgICByZW5kZXJIVE1MID0gXCJcIixcbiAgICAgICAgICAgIG5ld1BhdGggPSBcIlwiO1xuXG4gICAgICAgIGlmIChudW1iZXJSZXN1bHRzICE9PSAwKSB7XG5cbiAgICAgICAgICAgIHJlbmRlckhUTUwgPSBNdXN0YWNoZS5yZW5kZXIodGVtcGxhdGUsIHJlc3VsdHMpO1xuXG4gICAgICAgIH1cblxuICAgICAgICBhcHBlbmREYXRhKHJlbmRlckhUTUwsIGN1cnJlbnRFbmQsIG51bWJlclJlc3VsdHMpO1xuXG5cbiAgICAgICAgLy8gbmVlZCB0byBjaGVjayBpZiBoaXN0b3J5IGFwaSBpcyBzdXBwb3J0ZWQgaGVyZVxuICAgICAgICAvLyBpZiB3ZSdyZSBkb2luZyB0aGUgYmVsb3csIHdlIG5lZWQgdG8gbWFrZSBzdXJlIHRoYXQgb24gaGFzaCBjaGFuZ2UsIHRoZSBsaXN0IHVwZGF0ZXMgYWNjb3JkaW5nbHksIG90aGVyd2lzZSwgdXNlbGVzc1xuICAgICAgICAvL25ld1BhdGggPSBkb2N1bWVudC5sb2NhdGlvbi5vcmlnaW4gKyBkb2N1bWVudC5sb2NhdGlvbi5wYXRobmFtZSArIFwiP3F1ZXJ5PVwiICsgcXVlcnkgKyBcIiZzdGFydF9yYW5rPVwiICsgc3RhcnRSYW5rO1xuICAgICAgICAvL2hpc3RvcnkucHVzaFN0YXRlKHtcInN0YXJ0X3JhbmtcIjogc3RhcnRSYW5rfSwgXCJcIiwgbmV3UGF0aCk7XG5cblxuICAgIH0sXG4gICAgYXBwZW5kRGF0YSA9IGZ1bmN0aW9uIChodG1sVG9BZGQsIGN1cnJlbnRFbmQpIHtcblxuICAgICAgICAkdXNlckxpc3QuY2hpbGRyZW4oJy5sb2FkaW5nLWZhLWljb24nKS5yZW1vdmUoKTtcbiAgICAgICAgJHVzZXJMaXN0LmFwcGVuZChodG1sVG9BZGQpO1xuXG4gICAgICAgIC8vIHVwZGF0ZSBidXR0b24gZGF0YSBhdHRyaWJ1dGVzXG4gICAgICAgICRtb3JlQnV0dG9uLmF0dHIoXCJkYXRhLXN0YXJ0LXJhbmtcIiwgKHBhcnNlSW50KHN0YXJ0UmFuaykgKyAxMCkpO1xuXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgY291bnRlciBvZiByZXN1bHRzIGF0IHRvcFxuICAgICAgICAkcmVzdWx0TXNnRGlzcGxheWVkLmh0bWwoY3VycmVudEVuZCk7XG5cbiAgICAgICAgLy8gZGlzYWJsZSBsb2FkIG1vcmUgYnV0dG9uIGlmIG5vdCBuZWVkZWRcbiAgICAgICAgaWYgKGN1cnJlbnRFbmQgPT09IG51bWJlclJlc3VsdHMpIHtcbiAgICAgICAgICAgICRtb3JlQnV0dG9uLnJlbW92ZSgpO1xuICAgICAgICB9XG5cbiAgICB9LFxuICAgIGluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICRtb3JlQnV0dG9uLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgJHVzZXJMaXN0LmFwcGVuZCgkKCc8aSBjbGFzcz1cImZhIGZhLXJlZnJlc2ggZmEtc3BpbiBsb2FkaW5nLWZhLWljb25cIj48L2k+JykpO1xuICAgICAgICAgICAgYWpheENhbGwoKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuZGVmZXIoaW5pdCk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9qcy9tb2RzL2RpcmVjdG9yeS5qc1xuLy8gbW9kdWxlIGlkID0gNjlcbi8vIG1vZHVsZSBjaHVua3MgPSA0Il0sInNvdXJjZVJvb3QiOiIifQ==