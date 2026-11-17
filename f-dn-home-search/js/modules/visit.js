/*** instructions for the jslint parser */
/*global CITY, google, jQuery, window, console, document */
/*** end instructions for the jslint parser */

//unitN.js

//set up a holder module
CITY.visit = (function(CITY, $) {
    // == PROPERTIES ==

    var /**
         * this object holds the properties and methods we want to return later
         * @var {Object}
         */
        returnObj = {},
        /**
         * data source - relative to handle production and test environments
         * @var {String}
         */
        dataSrc = 'https://www.city.ac.uk/about/campus-map/feeds/locations',
        /**
         * Create a LatLng object containing the coordinate for the center of the map
         * @var {Object}
         */
        latlng = new google.maps.LatLng(51.527761, -0.103283),
        /**
         * jQuery object for map canvas
         * @var {Object}
         */
        $mapContainer = $('#map-container'),
        /**
         * an object literal containing the properties we want to pass to the map
         * @var {Object}
         */
        mapOptions = {
            zoom: 17,
            key: 'AIzaSyBvg6r1x2ZRKPAsceVaKPlg6tO20QiBDpo',
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            streetViewControl: true,
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            },
            navigationControl: true,
        },
        /**
         * Call the constructor, thereby initializing the map  as soon as possible
         * @var {Object}: Google maps Map object
         */
        map = new google.maps.Map(
            document.getElementById('map-canvas'),
            mapOptions
        ),
        searchBox = $('#map-search'),
        /**
         * initlaise infoWindow
         * @var {Object}: Google maps InfoWindow object
         */
        infoWindow = new google.maps.InfoWindow({
            maxWidth: 400,
        }),
        /* points = [
     new google.maps.LatLng(51.527701, -0.102509),
     new google.maps.LatLng(51.521870, -0.090356)
     ];

     for (var i = 0; i < points.length; i++) {
     marker = new google.maps.Marker({
     position: points[i],
     animation: google.maps.Animation.DROP

     });
     }

     marker.setMap(map);
     map.panTo(marker.position);
     /**
     * cityLayers object literal containing skeleton options for City related things - parsing the xml file adds to this
     * it is where we keep arrays of markers to use when clearing/setting things on the map
     * @var {Object}:
     */
        cityLayers = {
            // array to hold each google marker object - for each University location
            bigMarkersArray: [],
            //arrray to hold building google marker objects - they never got removed from map
            bigBuildingsArray: [],

            buildingsObj: {},

            buildings: {
                toggler: null,
                markersArray: [],
                zoomLevel: 17,
                list: '',
            },
            libraries: {
                toggler: $('#toggle-libraries'),
                markersArray: [],
                zoomLevel: 17,
                list: '',
            },
            accommodation: {
                toggler: null,
                markersArray: [],
                zoomLevel: 17,
                list: '',
            },
            lectureTheatres: {
                toggler: null,
                markersArray: [],
                zoomLevel: 17,
                list: '',
            },
            studentCentre: {
                toggler: $('#toggle-studentCentre'),
                markersArray: [],
                zoomLevel: 17,
                list: '',
            },
            sports: {
                toggler: null,
                markersArray: [],
                zoomLevel: 17,
                list: '',
            },
            computerLabs: {
                toggler: $('#toggle-computerLabs'),
                markersArray: [],
                zoomLevel: 17,
                list: '',
            },
        },
        /**
         * kmlLayers object - kml files containing useful third party location information
         * @var {Object}:
         */
        kmlLayers = {
            cycleHire: {
                src: 'http://webapps.city.ac.uk/matrix/maps/cycle-hire.php',
                toggler: $('#cycle-hire'),
                preserveViewport: true,
            },
            bikes: {
                src: 'http://webapps.city.ac.uk/matrix/maps/cycle-parking.kml',
                toggler: $('#bikes'),
                preserveViewport: true,
            },
            atms: {
                src: 'http://webapps.city.ac.uk/matrix/maps/atms.kml',
                toggler: $('#cash-points'),
                preserveViewport: true,
            },
        },
        // == METHODS ==

        /**
         * rRemoves the overlays from the map, but keeps them in the array
         * @param {Array} markersArray: a collections of markers
         * @return {Undefined}
         */
        clearOverlays = function(markersArray) {
            var i;

            if (markersArray) {
                for (i in markersArray) {
                    if (
                        markersArray.hasOwnProperty(i) &&
                        typeof markersArray[i] !== 'function'
                    ) {
                        markersArray[i].setMap(null);
                    }
                }
            }
        },
        /**
         * the hashChange handler - listens for hash changes and then does cool stuff
         * @param {Object} e: the window hashchange event
         * @return {Undefined}
         */
        hashChange = function(e) {
            var state = e.getState(),
                x,
                i,
                el,
                ii,
                ee,
                marker;

            //loop over each marker in hash
            $.each(state, function(el, i) {
                //no active marker - means an info window was closed
                if (el === '0') {
                    infoWindow.close();
                    return;
                }

                //loop over  bigBuildingsArray to find marker
                $.each(cityLayers.buildingsObj, function(ee, ii) {
                    if (el === ee) {
                        marker = ii;
                        //open infoWindow for this marker
                        //clear all overlays first
                        clearOverlays(cityLayers.bigMarkersArray);
                        //make marker visible
                        marker.setVisible(true);
                        //set infoWindow content
                        infoWindow.setContent(marker.infoHtml);
                        //open the infoWindow centered on the marker
                        infoWindow.open(map, marker);
                        //pan map to marker position
                        map.panTo(marker.position);
                        //add marker to map
                        marker.setMap(map);
                    }
                });
            });
        },
        /**
         * the updateHash called when a marker, infoWindow or marker link is clicked - updates hash
         * @param {Object || String} caller: the marker, marker link or infoWindow firing the event
         * @return {Undefined}
         */
        updateHash = function(caller) {
            var state = {},
                callerId = '';

            if (!caller) {
                return;
            }

            if (typeof caller === 'string') {
                //a marker link was clicked
                callerId = caller;
                state[callerId] = 1;
            } else if (caller.hasOwnProperty('id')) {
                //a marker was clicked
                callerId = caller.id;
                state[callerId] = 1;
            } else {
                //an infoWindow was closed
                state['0'] = 1;
            }
            //push state - setting merge_mode to 2 means params argument completely replaces current state
            $.bbq.pushState(state, 2);
        },
        /**
         * Shows any overlays currently in the array
         * @param {Array} markersArray: a collection of markers
         * @return {Undefined}
         */
        showOverlays = function(markersArray) {
            var i;

            if (markersArray) {
                for (i in markersArray) {
                    if (
                        markersArray.hasOwnProperty(i) &&
                        typeof markersArray[i] !== 'function'
                    ) {
                        markersArray[i].setMap(map);
                    }
                }
            }
        },
        /**
         * creates a new category of place in CityLayers object
         * @param {String} name: the new name of the category ?
         * @return {Undefined}
         */
        newCategory = function(name) {
            this.toggler = null;
            this.markersArray = [];
            this.zoomLevel = 17;
        },
        /**
         *  loop through each kmllayer adding checked behaviour
         * @param {Object} object: Config object for KML
         * @return {?}
         */
        initKmlLayers = function(object) {
            $.each(object, function() {
                var toggler = this.toggler,
                    overlay = new google.maps.KmlLayer(this.src, {
                        preserveViewport: this.preserveViewport,
                    });

                toggler.click(function(e) {
                    toggler.toggleClass('enabled');
                    overlay.setMap(toggler.hasClass('enabled') ? map : null);
                    return false;
                }); //end click fn
            }); //end each
        }, //end initKmlLayers
        /**
         *  creates individual markers, builds a corresponding filter item, binds a infoWindow to marker with html
         * @param {Object} markerConfig: an object containing various marker configuration options
         * @return {Object} marker - google maps marker
         */
        createMarker = function(markerConfig) {
            var listId = '#' + markerConfig.category,
                listItem,
                marker,
                $li,
                $a,
                markerId,
                prefixHtml,
                html = '';

            //build html for infoWindow

            //if has link
            if (markerConfig.linkHref.length !== 0) {
                html =
                    '<div id="info-window" style="min-height: 100px;"><h3><a href="' +
                    markerConfig.linkHref +
                    '">' +
                    markerConfig.name +
                    '</a></h3>';
            } else {
                html =
                    '<div id="info-window" style="min-height: 100px;"><h3>' +
                    markerConfig.name +
                    '</h3>';
            }

            //test to see if has a buildingPrefix
            if (markerConfig.buildingPrefix.length !== 0) {
                html +=
                    '<p class="building-prefix"><strong>Rooms beginning: ' +
                    markerConfig.buildingPrefix +
                    '</strong></p>';
                markerConfig.buildingPrefix =
                    '(' + markerConfig.buildingPrefix + ')';
            }

            //add description and close div element
            html += markerConfig.description + '</div>';

            //create google maps marker
            marker = new google.maps.Marker({
                map: markerConfig.map,
                position: markerConfig.point,
                icon: markerConfig.icon,
                animation: google.maps.Animation.DROP,
            });

            //add a new property to the google maps marker object so we can id markers
            marker.set('id', markerConfig.id);
            //add a new property of inHtml to populate infoWindow
            marker.set('infoHtml', html);

            //attach event listener for marker click to handle infoWindow
            google.maps.event.addListener(marker, 'click', function(e) {
                //closure in a loop shizzle - I find this hard to get my head around - returning a closure seems to help
                return updateHash(marker);
            });

            //create list element
            $li = $('<li />', {
                id: 'building-' + markerConfig.id,
                class: 'building',
            });

            //create a element with click handler to open infoWindow
            $a = $('<a />', {
                href: '#',
                html:
                    '<span>' +
                    markerConfig.name +
                    ' ' +
                    markerConfig.buildingPrefix +
                    '</span>',
                click: function(e) {
                    updateHash(
                        $(e.target)
                            .parents('li')
                            .attr('id')
                            .replace('building-', '')
                    );
                    return false;
                },
                css: {
                    background:
                        'transparent url(' +
                        markerConfig.icon +
                        '?v=1123) no-repeat left center',
                },
            });

            //add li item to list
            $li.append($a).appendTo(listId);

            return marker;
        }, //end fn.createMarker
        // Deletes all markers in the array by removing references to them
        //commented out to keep JSLint happy as this function is not currently used
        deleteOverlays = function(markersArray) {
            var i;

            if (markersArray) {
                for (i in markersArray) {
                    if (typeof markersArray[i] !== 'function') {
                        markersArray[i].setMap(null);
                    }
                }
                markersArray.length = 0;
            }
        },
        findChildText = function(node, name) {
            var value = '';
            node.children().each(function() {
                if (this.nodeName == name) {
                    value = $(this).text();
                    return false;
                }
                return true;
            });
            return value;
        },
        /**
         * parses locations xml and creates markers
         * @param {Object} xml: xml returned from Ajax request
         * @param {String} textStatus: standard ajax reposnse
         * @param {Object} textStatus: standard ajax reposnse
         * @return {?}
         */
        parseXml = function(xml, textStatus, jqXHR) {
            var index = 0,
                $self,
                marker,
                markerConfig = {},
                searchTags = [],
                searchIds = {};

            $(xml)
                .find('item')
                .each(function() {
                    $self = $(this);

                    markerConfig.index = index + 1;
                    markerConfig.name = $self.find('title').text();
                    markerConfig.linkHref = $self.find('link').text();
                    markerConfig.description = $self.find('description').text();
                    markerConfig.icon = findChildText($self, 'CUL:icon');
                    markerConfig.category = $self.find('category').text();
                    markerConfig.id = $self.find('guid').text();
                    //markerConfig.isPolygon = $self.find("[nodeName='georss:polygon']");
                    //with whitespace trimmed
                    markerConfig.buildingPrefix = findChildText(
                        $self,
                        'CUL:buildingPrefix'
                    ).replace(/^\s+|\s+$/g, '');
                    markerConfig.hexColour = findChildText(
                        $self,
                        'CUL:hexColour'
                    ).replace(/^\s+|\s+$/g, '');
                    markerConfig.geoLat = findChildText($self, 'geo:lat');
                    markerConfig.geoLong = findChildText($self, 'geo:long');
                    markerConfig.point = new google.maps.LatLng(
                        parseFloat(markerConfig.geoLat),
                        parseFloat(markerConfig.geoLong)
                    );

                    //call createmarker fn
                    marker = createMarker(markerConfig);

                    if (markerConfig.category !== 'buildings') {
                        //add returned marker to big array
                        cityLayers.bigMarkersArray.push(marker);
                    } else {
                        //add marker to buldings array
                        cityLayers.bigBuildingsArray.push(marker);
                    }
                    //all markers go in here
                    cityLayers.buildingsObj[marker.id] = marker;
                    searchTags.push(markerConfig.name);
                    searchIds[markerConfig.name] = markerConfig.id;

                    //add returned marker to category array (if cat exisits)
                    if (cityLayers[markerConfig.category]) {
                        cityLayers[markerConfig.category].markersArray.push(
                            marker
                        );
                    } else {
                        cityLayers[markerConfig.category] = newCategory(
                            markerConfig.category
                        );
                    }
                }); //end iteration

            searchBox
                .autocomplete({
                    source: searchTags,
                    select: function(e) {
                        setTimeout(function() {
                            var selected = searchBox.val();
                            searchBox.blur();
                            if (selected in searchIds) {
                                updateHash(searchIds[selected]);
                            }
                        }, 0);
                    },
                })
                .focusin(function() {
                    searchBox.attr('value', '');
                });
            $('#vs-button').click(function() {
                searchBox.focus();
            });

            //clear marker when infoWIndow closed
            google.maps.event.addListener(infoWindow, 'closeclick', function() {
                updateHash(infoWindow);
            });

            //so all markers in the buildingsArray initalially
            showOverlays(cityLayers.bigBuildingsArray);

            $mapContainer
                .removeClass('loading')
                .children('.loading-fa-icon')
                .remove();

            // Bind an event to window.onhashchange that, when the history state changes,
            $(window).bind('hashchange', hashChange);

            // Since the event is only triggered when the hash changes, we need to trigger
            // the event now, to handle the hash the page may have loaded with.
            $(window).trigger('hashchange');
        }, //end parse xml,
        loadXml = function() {
            //get locations.xml
            $.ajax({
                type: 'GET',
                url: dataSrc,
                dataType: 'xml',
                success: parseXml,
            });
        },
        /**
         * init fn
         * @return {Undefined}
         */
        init = function() {
            $mapContainer
                .addClass('loading')
                .append(
                    $('<i class="fa fa-refresh fa-spin loading-fa-icon"></i>')
                );
            initKmlLayers(kmlLayers);

            loadXml();

            //initalise accordion for filter
            $('#filter').accordion({
                collapsible: true,
                autoHeight: false,
                clearStyle: true,
                active: false,
            });

            //scroll journey planner
            $('#journey-link').bind('click', function(e) {
                e.preventDefault();
                $('html, body').animate(
                    {
                        scrollTop: $('#journey-planner').offset().top,
                    },
                    1000
                );
            });
        };
    //END VARS

    //expose the bits we want to
    returnObj = {
        init: init,
        cityLayers: cityLayers,
        infoWindow: infoWindow,
        map: map,
    };

    return returnObj;
})(CITY, jQuery);

//run this
CITY.visit.init();
