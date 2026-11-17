//Author: James Grant
//City University

//buildingTheVision.js

//set up a holder module
CITY.buildingTheVision = (function() {
    var latlng = new google.maps.LatLng(51.527361, -0.102365),
        url =
            'https://www.city.ac.uk/about/campus-map/feeds/locations.json?callback=?',
        //variables
        mapCanvas = document.getElementById('mapCanvas'),
        $freeTextWidget = $('.widget.free-text'),
        $accordion = $('.accordion .ui-accordion-header'),
        mapOptions = {
            zoom: 17,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
        },
        map = new google.maps.Map(mapCanvas, mapOptions),
        init = function(b) {
            $.each(b, function(i, v) {
                processContent(i, v);
                processMarkers(i, v);
                processPolygons(i, v);
            });
        },
        infoWindow,
        processMarkers = function(i, v) {
            if (v.title === 'Mechanical/Electrical Infrastructure Project') {
                return;
            } else {
                if (v.constructionurl) {
                    var latLngBuild = new google.maps.LatLng(
                            parseFloat(v.geoLat),
                            parseFloat(v.geoLong)
                        ),
                        marker = new google.maps.Marker({
                            position: latLngBuild,
                            animation: google.maps.Animation.DROP,
                            title: v.title,
                            icon: v.icon,
                        }),
                        infoSettings,
                        description = unescape(
                            v.description.replace(/\+/g, ' ')
                        ),
                        isBuilding = function(buildingType) {
                            if (buildingType) {
                                infoSettings = {
                                    content:
                                        '<b>' +
                                        v.title +
                                        '</b><br />' +
                                        description +
                                        '<br /><b>Dates:</b> ' +
                                        v.constructionBegins.split(' ')[0] +
                                        ' - ' +
                                        v.constructionFitComplete.split(
                                            ' '
                                        )[0] +
                                        " <br /><a href='" +
                                        v.constructionurl +
                                        "'>More Information...</a>",
                                    maxWidth: 300,
                                };
                            } else {
                                infoSettings = {
                                    content:
                                        '<b>' +
                                        v.title +
                                        '</b><br />' +
                                        description,
                                    maxWidth: 300,
                                };
                            }
                            return infoSettings;
                        };
                    marker.setMap(map);
                    google.maps.event.addListener(
                        marker,
                        'mousedown',
                        function() {
                            if (infoWindow) {
                                infoWindow.close();
                            }
                            infoWindow = new google.maps.InfoWindow(
                                isBuilding(v.projectLocation)
                            );
                            infoWindow.open(map, marker);
                        }
                    );
                }
            }
        },
        //Variable for holding the post formatted lat,lngs
        polygons = [],
        processContent = function(i, v) {
            //Parse all multiple spaces in string
            var string = v.polygon.replace(/\s{2,}/g, ' '),
                polygonBuild = [],
                polygonsBuild = [],
                tmp = '',
                j;
            polygonBuild = string.split(' ');
            //loop through and format the latlng into google valid latlngs
            for (j = 0; j < polygonBuild.length; j += 2) {
                tmp +=
                    'new google.maps.LatLng(' +
                    polygonBuild[j] +
                    ',' +
                    polygonBuild[j + 1] +
                    '),';
            }
            polygonsBuild.push(tmp);
            polygons.push('[' + polygonsBuild + ']');
        },
        processPolygons = function(i, v) {
            var polygon;
            if (v.polygon !== '' && v.constructionurl) {
                polygon = new google.maps.Polygon({
                    paths: eval(polygons[i]),
                    strokeOpacity: 0.8,
                    strokeWeight: 1,
                    fillOpacity: 0.35,
                });
                //Accordian click and show polygon
                $accordion.each(function(l, k) {
                    if ($.trim($(k).text()) === $.trim(v.title)) {
                        $(k).click(function() {
                            polygon.setPath(eval(polygons[i]));
                            polygon.setMap(map);
                            map.setZoom(18);
                            map.setCenter(
                                new google.maps.LatLng(v.geoLat, v.geoLong)
                            );
                            $freeTextWidget
                                .find('.widget-content .hidden')
                                .attr('class', 'visible');
                            //Scroll to the map if below 500 pixels
                            if (window.innerWidth < 500) {
                                $('html, body').animate(
                                    {
                                        scrollTop: $(mapCanvas).offset().top,
                                    },
                                    500
                                );
                            }
                        });
                    }
                });
                //Click events for tools
                widgetButtons(v, polygon);
            }
        },
        widgetButtons = function(v, b) {
            $freeTextWidget.find('.removeButton').click(function() {
                b.setMap(null);
                $freeTextWidget
                    .find('.widget-content .visible')
                    .attr('class', 'hidden');
            });
            $freeTextWidget.find('.newButton').click(function() {
                b.setMap(map);
                $freeTextWidget
                    .find('.widget-content .hidden')
                    .attr('class', 'visible');
            });
        }; //End variables
    $.ajax({
        type: 'GET',
        url: url,
        async: false,
        jsonpCallback: 'jsonCallback',
        contentType: 'application/json',
        dataType: 'jsonp',
        success: function(json) {
            init(json.buildings);
        },
        error: function(e) {
            console.error(e.message);
        },
    });
})(CITY.debug);
