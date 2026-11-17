/**
 * creates dynamic google maps
 * @return: Undefined
 */
module.exports = function () {

    var $ = require('../jquery'),

        onLoad = function (dynamicMap) {
            var iii,
                currentMarker,
                marker,
                centerMarker,
                gmap,
                labelBox,
                infoWindow,
                gmapData,
                userMapCenter,
                locationRootNode = dynamicMap.attr("data-locations-node"),
                computedSize = new google.maps.Size(36, 43),
                infoWindowOffSet = new google.maps.Size(0, -30),
                gmapColourOptions = [
                    {
                        featureType: "landscape",
                        stylers: [
                            {
                                saturation: -60
                            },
                            {
                                lightness: 65
                            },
                            {
                                visibility: "on"
                            }
                        ]
                    },
                    {
                        featureType: "poi",
                        stylers: [
                            {
                                saturation: -40
                            },
                            {
                                lightness: 40
                            },
                            {
                                visibility: "simplified"
                            }
                        ]
                    },
                    {
                        featureType: "road.highway",
                        stylers: [
                            {
                                saturation: -80
                            },
                            {
                                lightness: 40
                            },
                            {
                                visibility: "simplified"
                            }
                        ]
                    },
                    {
                        featureType: "road.arterial",
                        stylers: [
                            {
                                saturation: -60
                            },
                            {
                                lightness: 40
                            },
                            {
                                visibility: "on"
                            }
                        ]
                    },
                    {
                        featureType: "road.local",
                        stylers: [
                            {
                                saturation: -60
                            },
                            {
                                lightness: 40
                            },
                            {
                                visibility: "on"
                            }
                        ]
                    },
                    {
                        featureType: "transit",
                        stylers: [
                            {
                                saturation: -60
                            },
                            {
                                lightness: 40
                            },
                            {
                                visibility: "simplified"
                            }
                        ]
                    },
                    {
                        featureType: "administrative.province",
                        stylers: [
                            {
                                visibility: "off"
                            }
                        ]
                    },
                    {
                        featureType: "water",
                        elementType: "labels",
                        stylers: [
                            {
                                visibility: "on"
                            },
                            {
                                lightness: -10
                            },
                            {
                                saturation: 10
                            }
                        ]
                    },
                    {
                        featureType: "water",
                        elementType: "geometry",
                        stylers: [
                            {
                                lightness: -10
                            },
                            {
                                saturation: 10
                            }
                        ]
                    },
                    {
                        featureType: "transit.station",
                        stylers: [
                            {
                                saturation: 30
                            },
                            {
                                lightness: -10
                            },
                            {
                                visibility: "on"
                            }
                        ]
                    }
                ],
                attachClickEvent = function (map, marker, labeledBox, description) {

                    // on click on a marker, set the content of infowindow and open it
                    //also center the map on that marker
                    google.maps.event.addListener(marker, "click", function () {
                        infoWindow.setContent("<span class=\"marker-description\">" + description + "<\/span>");
                        infoWindow.setPosition(marker.position);
                        infoWindow.open(map);
                        map.panTo(marker.position);
                    });
                },
                placeCenterMarker = function (map, marker) {
                    // the marker for the center of the map
                    centerMarker = new google.maps.Marker({
                        icon: {
                            url: marker.icon
                        },
                        map: map,
                        visible: true,
                        position: new google.maps.LatLng(marker.latitude, marker.longitude),
                        title: marker.name
                    });

                    centerMarker.setZIndex(180);

                    google.maps.event.addListener(centerMarker, "click", function () {
                        infoWindow.setContent("<span class=\"marker-title\">" + centerMarker.title + "<\/span><span class=\"marker-description\">" + marker.description + "<\/span>");
                        infoWindow.setPosition(centerMarker.position);
                        infoWindow.open(map);
                    });
                },
                placeAllMarker = function (markers) {
                    for (iii = 0; iii < markers.length; iii++) {

                        currentMarker = markers[iii];

                        // define a new marker
                        marker = new google.maps.Marker({
                            icon: {
                                url: currentMarker.icon
                            },
                            map: gmap,
                            visible: true,
                            position: new google.maps.LatLng(currentMarker.latitude, currentMarker.longitude),
                            title: currentMarker.name
                        });

                        // set a label for each marker
                        // uses google map plugin
                        labelBox = new InfoBox({
                            content: marker.title,
                            position: marker.position,
                            pane: "mapPane",
                            closeBoxURL: "",
                            disableAutoPan: true,
                            boxStyle: {
                                width: "auto"
                            }
                        });

                        labelBox.open(gmap);
                        attachClickEvent(gmap, marker, labelBox, (currentMarker.description + "&nbsp;"));
                    }
                };

            // call the google maps location api in matrix to get the data on the markers and the initial map parameters
            $.ajax({
                url: "//www.city.ac.uk/api/google-map-locations?root=" + locationRootNode,
                dataType: "json"
            }).done(function (data) {
                if (data !== null) {

                    // map and markers data
                    gmapData = data;

                    // create the map
                    gmap = new google.maps.Map(document.getElementById("dynamic-gmap"), {
                        scrollwheel: false,
                        streetViewControl: false,
                        zoom: gmapData.loadOptions.zoom,
                        center: new google.maps.LatLng(gmapData.loadOptions.latitude, gmapData.loadOptions.longitude),
                        styles: gmapColourOptions
                    });

                    // create a new info window
                    infoWindow = new google.maps.InfoWindow({pixelOffset: infoWindowOffSet});

                    // create all the markers except the central one
                    // add a label to each of them
                    placeAllMarker(gmapData.markers);

                    // add a marker for the center of the map
                    placeCenterMarker(gmap, gmapData.centerMarker);

                    // on resizing the map, make sure we keep the current center position
                    google.maps.event.addDomListener(window, "resize", function () {
                        userMapCenter = gmap.getCenter();
                        google.maps.event.trigger(gmap, "resize");
                        gmap.setCenter(userMapCenter);
                    });

                }
            });
        };

    return function (dynamicMap) {
        if (dynamicMap.length > 0) {
            $.getMultiJsScripts(['lib/google/map/infobox-packed-1.1.9.js'], onLoad.bind(null, dynamicMap));
        }
    };

}();