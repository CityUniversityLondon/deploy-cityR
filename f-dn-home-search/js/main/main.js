module.exports = (function() {
    var $ = require('./jquery'),
        debug = require('../utils/debug'),
        customAJAX = require('./funcs/custom-ajax'),
        viewportChanged = require('./funcs/viewport-changed'),
        createGallery = require('./funcs/create-gallery'),
        createSlider = require('./funcs/create-slider'),
        getWindowWidth = require('./funcs/get-window-width'),
        initDropdowns = require('./funcs/init-dropdowns'),
        initDynamicGmap = require('./funcs/init-dynamic-map'),
        initAzListing = require('./funcs/az-listing'),
        imageAccordion = require('./funcs/image-accordion'),
        initSeeMore = require('./funcs/init-see-more'),
        imageCreditation = require('./funcs/image-creditation'),
        initPlaceholderHallback = require('./funcs/placeholder-fallback'),
        initImageCarousel = require('./funcs/init-image-carousel'),
        initWhiteCards = require('./funcs/init-white-cards'),
        searchAutoComplete = require('./funcs/search-autocomplete'),
        initNewsEventsStrip = require('./funcs/init-news-events-strip'),
        headerPrimaryNav = require('./funcs/header-primary-nav'),
        headerNavs = require('./funcs/header-navs'),
        footer = require('./funcs/footer'),
        popupDialog = require('./funcs/popup-dialog'),
        scrollTo = require('../utils/scroll-to'),
        responsiveTables = require('./funcs/responsive-tables'),
        cyclicPopup = require('./funcs/cyclic-popup'),
        linkFinder = require('./funcs/link-finder'),
        researchPubs = require('./funcs/research-publications');
        accordion2024 = require('./funcs/accordion-2024');
    /**
     * The main CITY wrapper object
     * @version $Revision: 6291 $ ($Date: 2012-09-05 16:06:30 +0100 (Wed, 05 Sep 2012) $)
     * @author City Web Team
     */
    var CITY = (function(w) {
        'use strict';

        /**
         * The object to hold all loadable scripts, add an object here to allow it's loading in a page
         *
         * Each child object has three properties:
         *   description: a short description of the script
         *           src: the filename of the script
         *       [async]: Whether to load the script asynchronously (assumed false unless given)
         *
         * @var Object
         */
        var scripts = {
                googleMapsApi: {
                    description: 'google maps api',
                    src:
                        'https://maps.googleapis.com/maps/api/js?key=AIzaSyBvg6r1x2ZRKPAsceVaKPlg6tO20QiBDpo&sensor=false',
                },
                flowplayer: {
                    description: 'include flowplayer for pages with videos',
                    src: 'lib/flowplayer/flowplayer-3.2.4.min.js',
                },
                flowplayerEmbed: {
                    description: 'Embed code for flowplayer',
                    src: 'lib/flowplayer/flowplayer.embed-3.0.3.min.js',
                },
                swfobject: {
                    description: 'swfobject for youtube video(s)',
                    src: 'lib/swfobject/swfobject.js',
                },
                highcharts: {
                    description: 'JQuery charting plugin',
                    src: 'lib/jquery/plugins/highcharts/highcharts-4-1-4.js',
                },
                jVectorMap: {
                    description: 'jQuery plugin for SVG world map',
                    src:
                        'lib/jquery/plugins/vector-map/jquery.vector-map.min.js',
                },
                worldMap: {
                    description: 'map svg',
                    src: 'lib/jquery/plugins/vector-map/world-en.js',
                },
                buildingTheVision: {
                    description: 'building the vision specific scripts',
                    src: 'buildingTheVision.js',
                },
                library: {
                    description: 'library site scripts',
                    src: 'library.js',
                },
                location: {
                    description: 'Computer Room site scripts',
                    src: 'location.js',
                },
            },
            /***************************************************************************
             * GLOBAL VARIABLES
             ***************************************************************************/

            /**
             * The location of external scripts (with trailing slash)
             * @var String
             */
            getGitBridgePath = function() {

                // Get the current script element
                const currentScriptPath = document.currentScript;

                // Get the source of the script file
                const currentScriptSrc = currentScriptPath ? currentScriptPath.src : null;
                // regex to extract path between "git_bridge" and "js"
                const matchGitBridgePath = currentScriptSrc.match(/git_bridge\/(.*?)\/js/); 

                    if (matchGitBridgePath && matchGitBridgePath[1]) {
                        const extractedGitBridgePath = matchGitBridgePath[1];
                        return extractedGitBridgePath;
                    } else {
                        return '0004/841405c/main';
                    }
            },


            srcPrefix =
                `https://${document.location.hostname.replace(
                    'citysport.org.uk',
                    'city.ac.uk'
                )}/__data/assets/git_bridge/${getGitBridgePath()}/js/`,
            /**
             * The version number to prepend to the file name, set in page
             * @var String
             */
            version = w.cityVersion || '123456789.',
            /**
             * Lazyload function, injects a <script> element into the page head
             *
             * now proxies to yepnope
             *
             * @param {Object} jsHandle: The Object from CITY.scripts to load
             * @param {String} callback: The name of the callback to be executed after this script has loaded
             */
            load = function(jsHandle, callback) {
                //work out full path
                var path = (function() {
                    var script = scripts[jsHandle];

                    if (/^https?:\/\//.test(script.src)) {
                        return script.src;
                    }

                    return (
                        srcPrefix +
                        (/plugins|lib/.test(script.src) ? '' : 'modules/') +
                        script.src
                    );
                })();

                yepnope({
                    load: path,
                    callback: callback,
                });
            },
            setVersion = function(v) {
                version = v;
            },
            /***************************************************************************
             * USEFUL GLOBAL FUNCTIONS
             ***************************************************************************/

            /**
             * Stuff needed on everypage - explore city, login etc.
             */
            initPage = function() {
                var $body = $('body'),
                    bodyElement = document.querySelector('body'), //Vanilla JS reference to the body tag
                    $form = $body.find('#search, #header__search__form'),
                    $searchForm = $body.find(
                        ".search-form[data-autocomplete-status!='off']"
                    ),
                    $searchFormQuery = $searchForm.find('.search-form__query'),
                    $query = $form.find('#query'),
                    indexForm = $('#fb-queryform'),
                    indexQuery = $('#search-query', indexForm),
                    searchPageAutoCompleteCollection =
                        $body.attr('id') === 'intranet'
                            ? 'staff-intranet-matrix'
                            : 'main-all',
                    $galleries = $('#content').find('.gallery'),
                    azListings = $('.az-single-page'),
                    autoCompleteCollection = $searchForm.attr(
                        'data-collection'
                    ),
                    // navigation

                    $primaryNav = $('#primary-nav'),
                    $secondaryNav = $('#secondary-nav'),
                    $secondaryNavLis = $('#secondary-nav > li'),
                    $carouselObj = $('#promo-area'), //carousel container
                    // UI elements
                    $accordions = $body.find('.accordion'),
                    $responsiveTabs = $body.find('.responsive-tabs'),
                    // misc.
                    currentUrl = $primaryNav.data('url') || '',
                    modifySecNav = currentUrl.indexOf('/my-country/') < 0;

                    
                //end initPage vars

                // svg fallback
                if (!Modernizr.svg) {
                    $('#header__logo img').attr('src', function() {
                        return $(this)
                            .attr('src')
                            .replace('.svg', '.png');
                    });
                }

                headerPrimaryNav();
                headerNavs();
                footer();
                $responsiveTabs.accordionTabs();
                initDropdowns();
                initAzListing(azListings);
                imageAccordion();
                initSeeMore();
                initWhiteCards();
                initNewsEventsStrip();
                createSlider($carouselObj);
                initPlaceholderHallback();
                initImageCarousel();
                popupDialog();
                responsiveTables();
                cyclicPopup();
                // We need to wait for the DOM to be modified before
                // traversing for Image Credits
                imageCreditation();
                researchPubs();
                linkFinder(bodyElement);

                $galleries.each(function() {
                    createGallery($(this));
                });

                //some helper stuff to style primary navigation

                if (currentUrl.indexOf('//www.city.ac.uk/news') >= 0) {
                    $secondaryNav.hide();
                } else if (modifySecNav) {
                    // add secondary-nav-siblings to secondary-nav only if we have some
                    if (
                        $('ol#secondary-nav > li:last > a').length &&
                        $('ol#secondary-nav-siblings').length
                    ) {
                        // if the link to this page isn't in secondary-nav-siblings, just add the siblings
                        if (
                            $('ol#secondary-nav-siblings a')
                                .map(function() {
                                    return this.href;
                                })
                                .toArray()
                                .indexOf(
                                    $('ol#secondary-nav > li:last > a')[0].href
                                ) === -1
                        ) {
                            $('ol#secondary-nav').append(
                                $('<li>').html($('ol#secondary-nav-siblings'))
                            );
                        } else {
                            // otherwise replace the secondary nav completely
                            $('ol#secondary-nav > li:last')
                                .empty()
                                .append($('ol#secondary-nav-siblings'));
                        }
                    }

                    $('ol#primary-nav li, ol#secondary-nav li').removeClass(
                        'selected'
                    );
                    $(
                        'ol#primary-nav a[href="' +
                            currentUrl +
                            '"], ol#secondary-nav a[href="' +
                            currentUrl +
                            '"]'
                    )
                        .parent('li')
                        .addClass('selected');

                    if (
                        $primaryNav.find('.current').length === 0 &&
                        $secondaryNav.find('.selected').length === 0
                    ) {
                        //we are on the home page of the section so hide secondary nav and add helper class
                        $secondaryNav.hide();
                        $primaryNav.addClass('top-level');
                    }

                    //hide secondary level if empty
                    if ($secondaryNavLis.length === 0) {
                        $secondaryNav.hide();
                    } else {
                        //secondary nav is definitely showing, add some classes to help styling

                        //if we have secondary-nav-siblings the prevous li element will be the parent from one level up
                        // e.g. http://www.city.ac.uk/arts-social-sciences/journalism/student-work/city-journalism-student-bylines/january-2012/test-level
                        $('#secondary-nav-siblings')
                            .parent()
                            .prev('li')
                            .addClass('end');

                        // When the current page is part of the breadcrumb its previous sibling reguires a class of "selected-join"
                        // we only want this to happen on direct children of $secondaryNav
                        // e.g http://www.city.ac.uk/arts-social-sciences/journalism/student-work/city-journalism-student-bylines/january-2012
                        $secondaryNav
                            .find('> li.selected')
                            .prev()
                            .addClass('selected-join');

                        if ($secondaryNav.find('.selected').length !== 0) {
                            //add a class of ".parent" to active element in primary nav so we can un-bold it
                            $primaryNav.find('.current').addClass('parent');
                        }
                    }
                }
                
                if($accordions.length > 0) {
                    // initalise any accordions found
                    Array.from($accordions).forEach( accordion => {
                        accordion.children.length && accordion2024(accordion)
                    });
                }

                //set up autocomplete on search box
                searchAutoComplete(
                    $form,
                    $query,
                    searchPageAutoCompleteCollection
                );

                //set up autocomplete on search box on main search page
                searchAutoComplete(
                    indexForm,
                    indexQuery,
                    searchPageAutoCompleteCollection
                );

                //set up autocomplete on search box on intranet main search page
                searchAutoComplete(
                    $searchForm,
                    $searchFormQuery,
                    autoCompleteCollection
                );

                // catch any videos that have been manually input
                $("iframe[src*='youtube']").each(function() {
                    var $element = $(this),
                        vidWidth = $element.outerWidth(),
                        $parent = $element.parent();

                    // don't double wrap an iframe
                    if (!$parent.hasClass('embed-container')) {
                        // for elastic objects, we need 2 (!) wrappers
                        $element.wrap(
                            '<div class="embed-wrapper" style="width:' +
                                vidWidth +
                                'px"><div class="embed-container"></div></div>'
                        );
                    }
                });

                initDynamicGmap($('#dynamic-gmap'));

                // hide/show functionality for unit lists (example on subject area pages)
                $('.unit-lists .unit-lists-title').click(function() {
                    $(this)
                        .parents('.unit-lists')
                        .toggleClass('unit-lists-expanded');
                });

                //hide/show other amount and pass the correct value on City Future Fund page
                if (
                    $('#future-fund-forms').length === 1 ||
                    $('#racing-form').length === 1
                ) {
                    $('#cff-regular-donation input[type=radio]').click(
                        function() {
                            var parentElement = $(this).parent();
                            $('.donate-appeal').show();
                            if (
                                parentElement
                                    .find('.donation-other-option')
                                    .is(':checked')
                            ) {
                                parentElement
                                    .find('.donation-other-amount')
                                    .show()
                                    .find('input')
                                    .attr('name', 'regular_amount');
                            } else {
                                parentElement
                                    .find('.donation-other-amount')
                                    .hide()
                                    .find('input')
                                    .attr('name', '')
                                    .attr('value', '');
                            }
                        }
                    );
                    $('#cff-single-donation input[type=radio]').click(
                        function() {
                            var parentElement = $(this).parent();
                            if (
                                parentElement
                                    .find('.donation-other-option')
                                    .is(':checked')
                            ) {
                                parentElement
                                    .find('.donation-other-amount')
                                    .show()
                                    .find('input')
                                    .attr('name', 'tfa_Amountyouwishtod');
                            } else {
                                parentElement
                                    .find('.donation-other-amount')
                                    .hide()
                                    .find('input')
                                    .attr('name', '')
                                    .attr('value', '');
                            }
                        }
                    );
                }

                $('.media-ribbon .embed-container').videoPreview({
                    showInfo: 0,
                });
                $('.widget-content .embed-container').videoPreview();
                $('.international-london .embed-container').videoPreview();
                $('.social-wall .embed-container').videoPreview();
                $(
                    '.embed-container.embed-container--default-yt-preview'
                ).videoPreview();
            }, //end initPage
            objectSize = function(object) {
                var size = 0,
                    key;

                for (key in object) {
                    if (object.hasOwnProperty(key)) {
                        size += 1;
                    }
                }

                return size;
            },
            /**
             * Finds any vid images on a page and replaces them with either a YouTube iframe or SWFObject for FMS vids
             * @return: Undefined
             */
            videos = function() {
                var $youtubeVids = $('img.youtube'),
                    $fmsVids = $('img.fms'),
                    /*
                     * Replaces an image element with YouTube iFrame
                     * @param: {Object} : $el - jQuery object for youTube images to be replaced
                     * @retun: {Undefined}
                     */
                    embedYoutube = function($youtubeVids) {
                        $youtubeVids.each(function(i, el) {
                            var $el = $(el),
                                vidWidth = 500, // default width
                                vidHeight = 320, // default height
                                videoID = $el.attr('id').replace('vid_', '');

                            $el.replaceWith(
                                '<div class="embed-wrapper"><div class="embed-container"><iframe height=' +
                                    vidHeight +
                                    ' width= ' +
                                    vidWidth +
                                    ' src="//www.youtube.com/embed/' +
                                    videoID +
                                    "?rel=0&wmode=transparent\" frameborder='0' allowfullscreen></iframe></div></div>"
                            );
                        });
                    },
                    /*
                     * Replaces an image element with SWF Object
                     * @param: {Object} : $el - jQuery object for all fms images to be replaced
                     * @retun: {Undefined}
                     */
                    embedFms = function($fmsVids) {
                        var splashImages = {
                            cassStandard:
                                '//s1.city.ac.uk/i/flowplayer-cass.jpg?v=8105',
                            cassRetina: '',
                            cityStandard:
                                '//s1.city.ac.uk/i/flowplayer-city.jpg?v=8105',
                            cityRentina: '',
                        };

                        $fmsVids.each(function(i, el) {
                            var $el = $(el),
                                vidWidth = 687, //default width
                                vidHeight = 419, // default height
                                elId = $el.attr('id'),
                                vidId = elId.replace('vid_', ''),
                                expressInstall =
                                    '//s1.city.ac.uk/js/swfobject/expressInstall.swf',
                                flashtargetversion = '9.0.28',
                                flashvars = null,
                                params = {
                                    allowScriptAccess: 'always',
                                    allowfullscreen: 'true',
                                    wmode: 'transparent',
                                },
                                atts = {
                                    class: 'vidplayer',
                                    id: vidId,
                                },
                                splashImage = CITY.isCass
                                    ? splashImages.cassStandard
                                    : splashImages.cityStandard,
                                swfCallBack = function(e) {
                                    $(e.ref).wrap(
                                        '<div class="embed-wrapper" style="width:' +
                                            vidWidth +
                                            'px"><div class="embed-container"></div></div>'
                                    );
                                };

                            //if video is included in the course description div of a course N page, width needs to be 419
                            if (
                                $el.parents('.course-description').length !== 0
                            ) {
                                vidWidth = 419;
                            }

                            //vids have different sizes depending on the size of the content div and if they are widescreen on square
                            if ($el.hasClass('widescreen')) {
                                vidHeight = vidWidth * 0.61;
                            } else {
                                vidWidth = 500;
                                vidHeight = 320;
                            }

                            if (
                                !swfobject.hasFlashPlayerVersion(
                                    flashtargetversion
                                )
                            ) {
                                //explain why there is no video
                                $el.after(
                                    '<p class="notice-message"><i class="fa fa-exclamation-triangle" style="color : #CCCC00"></i> You need to have flash player ' +
                                        flashtargetversion +
                                        ' or greater installed to see the video.</p>' +
                                        '<p><a href="http://get.adobe.com/flashplayer/">Get Flash Player</a></p>'
                                );
                            } else {
                                //config has to be in a string and key and values have to be "quoted" - nightmare
                                // construct all the variables to pass to the player -
                                // tried to make this a proper json array, didn't work :(
                                // IE doesn't like double quotes here so ignore JSHint error
                                flashvars =
                                    "{'clip': {'provider': 'rtmp'}, 'playlist': [{'url':'" +
                                    splashImage +
                                    "', 'autoPlay': true}, {'url': '" +
                                    vidId.replace('vid_', '') +
                                    "/Hi_bandwidth', 'autoPlay': false, 'scaling': 'fit'}], 'plugins': {'rtmp': {'url': '//s1.city.ac.uk/js/flowplayer/flowplayer.rtmp-3.2.3.swf', 'netConnectionUrl': 'rtmp://media.city.ac.uk/flowplayer', 'objectEncoding': '0', 'proxyType': 'none' }, 'controls': {'url': 'flowplayer.controls.swf'} } }";

                                // initiate the player
                                swfobject.embedSWF(
                                    '//s1.city.ac.uk/js/flowplayer/flowplayer-3.2.6.swf',
                                    elId,
                                    vidWidth,
                                    vidHeight,
                                    '9.0.0',
                                    expressInstall,
                                    { config: flashvars },
                                    params,
                                    false,
                                    swfCallBack
                                );
                            } //end has flash if
                        });
                    };

                if ($youtubeVids.length) {
                    embedYoutube($youtubeVids);
                }
                if ($fmsVids.length) {
                    yepnope({
                        load: scripts.swfobject.src,
                        callback: function() {
                            embedFms($fmsVids);
                        },
                    });
                }
            }, // end videos
            /**
             * This is our yepnope filter
             *
             * splices in the version string we have set up in setVersion
             * prepends the correct s1 domain, where it hasn't been provided
             *
             * N.B. will fail if we have an s1 top level folder containing
             * dots (see comment below)
             *
             */
            yepnopeFilter = function(resource) {
                var loc, lastItem;

                /* If we are loading in an absolute url, don't touch it
                 * this is the regex which fails on a top level folder with dots
                 *
                 * matches:
                 * http://www.external.com/scripts/script.js
                 * www.external.com/scripts/script.js
                 * absolute.with.many.sub.domains.domain.com/scripts/script.js
                 * https://absoulte.with.many.sub.domains.domain.com/scripts/script.js
                 *
                 * doesn't match:
                 * modules/test.js
                 * lib/subdir/script.js
                 * lib/subdir.123/script.js
                 *
                 * will match when we don't want to:
                 * toplevel.with.dots/script.js
                 * lib.v2/jquery/script.js
                 *
                 * I think it's an unlikely issue, but if anyone can tweak the regex
                 * to prevent this please do.
                 *
                 */
                if (/^(https?:\/\/)?([^\/.]+\.)+[^\/]+\//.test(resource.url)) {
                    return resource;
                }

                loc =
                    //already contains s1? - don't add prefix
                    (srcPrefix + resource.url)

                        //split for splicing
                        .split('/');

                resource.url = loc.join('/');

                // if on prod and we are loading a module/.js file
                // we want .min.js rather than .js
                if (
                    /www\.city/.test(resource.url) &&
                    !/js\/lib/.test(resource.url)
                ) {
                    resource.url = resource.url.replace(/js$/, 'min.js');
                }

                return resource;
            },
            /**
             * Initialisation function, called immediately after CITY declaration below
             */
            init = function() {
                debug('CITY ready (we are in ' + document.compatMode + ')');

                yepnope.addFilter(yepnopeFilter);

                initPage();


                //// library home page opening times
                if ($('#library').length !== 0) {

                    yepnope({
                        load: `modules/library/library.js?v=${cityVersion}`,
                        callback: function() {
                            debug('loaded library datepicker');
                        },
                    });
                }
  
                // the following needs domready
                $(function() {
                    // set up any videos on page
                    videos();

                    // mobile browser click delay fix
                    //initFastClickt();
                });
            };
        /**
         *  This literal defines what methods to make publicly accessible
         *  outsite CITY
         */
        return {
            init: init,
            load: load,
            debug: debug,
            setVersion: setVersion,
            searchAutoComplete: searchAutoComplete,
            objectSize: objectSize,
            getWindowWidth: getWindowWidth,
            customAJAX: customAJAX,
            imageCreditation: imageCreditation,
            //this will be useful in modules
            s1Server: srcPrefix,
        };
    })(window); //end CITY

    window.CITY = CITY;

    return CITY;
})();


