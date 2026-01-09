/*jslint sloppy: true, maxerr: 50, indent: 4 */
/*global window, jQuery, Highcharts, $, CITY, setTimeout */

//location.js
//scripts specific to location assets

//set up a holder module
CITY.location = (function (CITY, $, w) {

    var

        // single lab or big table?
        $labs = $('#labs'),
        $lab = $('#content .lab'),

        // the webapps processed php feed
        src  = "//" + w.location.host.replace('www', 'webapps') +
                "/matrix/services/labstats.php?",

        // matches "2012-01-12T15:21:32+00:00"
        dateRegex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})[+\-](\d{2}):(\d{2})$/,

        // one minute in milliseconds
        delay = 60000,

        // config option - pie or column set at init
        chartType = null,

        // placeholder for Highcharts object
        chart,

        // placeholder for any vars to be parse as part of ajax call
        ajaxData,

        /**
           * parses the JSON data from labstats api
           * @param {object} JSON object
           * @return {object} contatining parsed data
           *
         */
        parseData = function (data) {
            var available = [],
                inUse = [],
                i,
                lab,
                categories = [],
                date = [],
                chartData = {};

            if (chartType === 'pie') {

                for (i in data) {
                    if (typeof data[i] !== 'function') {
                        lab = data[i];
                        categories.push(lab.name);
                        available.push(lab.available);
                        inUse.push(lab.inUse);
                    }
                }
            } else {

                for (i in data) {
                    if (typeof data[i] !== 'function') {
                        lab = data[i];
                        categories.push('<a href="' + String(lab.asset ? lab.asset.url : '') + '">' + lab.name + '</a>');
                        available.push(lab.available);
                        inUse.push(lab.inUse);
                    }
                }
            }

            if ('object' === typeof data[0] && 'string' === typeof data[0].last_updated) {
                date = dateRegex.exec(data[0].last_updated);
            }

            chartData.lab = lab;
            chartData.available = available;
            chartData.inUse = inUse;
            chartData.categories = categories;
            chartData.date = date;

            return (chartData);

        },//parseData

        /**
         * gets JSON data from labstats api
         * @param {string} the labstats id for room
         * @return {object} JSON object
         *
         */
        getData = function () {

            $.ajax({
                url : src,
                cache: false,
                crossDomain : true,
                data : ajaxData,
                dataType : "jsonp",
                success : function (data) {
                    var chartData = parseData(data);

                    if (chartType === 'pie') {
                        paintPieChart(chartData);
                    } else {
                        paintColumnChart(chartData);
                    }
                }
            });
        },

        /**
           * recursive hotness
           * called by chart load event - borrowed from
           * http://www.erichynds.com/javascript/a-recursive-settimeout-pattern/
           *
         */
        loopsiloop = function () {
            setTimeout(function () {
                chart.showLoading("loading real time data");
                $.ajax({
                    url : src,
                    cache: false,
                    crossDomain : true,
                    data : ajaxData,
                    dataType : "jsonp",
                    success: function (data) {
                        //parse new data
                        var chartData = parseData(data);

                        if (chartType === 'pie') {
                            //update series
                            chart.series[0].setData([
                                ['Available', chartData.lab.available],
                                ['Busy', chartData.lab.inUse]
                            ]);
                        } else {
                            //update column series
                            chart.series[0].setData(chartData.available, false);
                            chart.series[1].setData(chartData.inUse);
                        }
                        //update subtitle
                        chart.setTitle(null, { text: 'Updated at <b>' + chartData.date[4] + ':' + chartData.date[5] +  '</b> today'});
                        chart.hideLoading();
                        delay = 60000;
                    },
                    error: function () {
                        // do some error handling.
                        //up the delay
                        delay = 100000;
                    },
                    complete: function () {
                        loopsiloop(); // recurse, if you'd like.
                    }
                });
            }, delay);
        },

        /**
        * adds a bar chart to a page
        *
        * @param {object} json object returned from ajax call
        * @return {object} the highchart object
        *
        */
        paintColumnChart = function (chartData) {
            chart = new Highcharts.Chart({
                chart: {
                    renderTo: $labs.attr('id'),
                    defaultSeriesType: 'bar',
                    height: 600,
                    events : {
                        load: loopsiloop()
                    }
                },
                credits: {
                    enabled: false,
                    text: 'Created by Mayes, Kennedy & Company',
                    href: 'http://mayeskennedy.com'
                },
                exporting: {
                    enabled: false
                },
                legend: {
                    align: 'right'
                },
                series: [{
                    name: 'Available',
                    data: chartData.available
                }, {
                    name: 'Busy',
                    data: chartData.inUse
                }],
                subtitle: {
                    text: 'Updated at <b>' + chartData.date[4] + ':' + chartData.date[5] +  '</b> today ',
                    y : 40
                },
                title: {
                    text: 'Computer Room Availability'
                },
                tooltip: {
                    formatter: function () {

                        return '<b>' + this.x + '</b><br/>' +
                            this.series.name + ': ' + this.y + '<br/>' +
                            'Total: ' + this.point.stackTotal;
                            //String('object' === typeof data[this.point.x].asset && '' !== data[this.point.x].asset.thumbnail.url ?
                            //'<image xlink:href="' + data[this.point.x].asset.thumbnail.url +
                            //'" alt="' + data[this.point.x].asset.thumbnail.alt +
                            //'" title="' + data[this.point.x].asset.thumbnail.title + '" />':'');
                    }
                },
                xAxis: {
                    categories: chartData.categories
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'No. of Computers'
                    }
                }
            }); //end chart
        }, //end paintColumnChart

        /**
         * adds a pie chart to a page, called only once after inital call to getData
         *
         * @param {object} json object returned from ajax call
         * @return {object} the highchart object
         *
         */
        paintPieChart = function (chartData) {

            chart = new Highcharts.Chart({
                chart: {
                    renderTo: $lab.attr('id'),
                    events : {
                        load: loopsiloop()
                    }
                },
                credits: {
                    enabled: false,
                    text: 'Created by Mayes, Kennedy & Company',
                    href: 'http://mayeskennedy.com'
                },
                exporting: {
                    enabled: false
                },
                legend: {
                    layout: 'vertical',
                    x: 100,
                    y: 70
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        dataLabels: {
                            formatter: function () {
                                return '<b>' + this.point.name + '</b>: ' + this.point.y;
                            }
                        }
                    }
                },
                series: [{
                    type: 'pie',
                    name: 'Computer availability',
                    data: [
                        ['Available', chartData.lab.available],
                        ['Busy', chartData.lab.inUse]
                    ]
                }],
                subtitle: {
                    text: 'Updated at <b>' + chartData.date[4] + ':' + chartData.date[5] +  '</b> today ',
                    y : 40
                },
                title: {
                    text: 'Computer availability'
                },
                tooltip: {
                    formatter: function () {
                        return '<b>' + this.point.name + '</b>: ' + this.point.y;
                    }
                }
            });
        }, //end paintChart fn

        /**
         * initialises location page - decides if we want a column or pie chart
         *
         *
         */
        init = function () {

            // if there is a lab div on the page, init high charts etc.
            // this is the case on an individual lab page
            if ($lab.length) {

                chartType = 'pie';
                ajaxData = "id=" + $lab.attr('id').replace('lab-', '');
                // CITY.load('highcharts', getPieData);

            }

            // is there the big all lab chart $labs
            else if ($labs.length) {

                chartType = 'column';

                // check if we are on the page displaying the cass rooms
                if (/cass-rooms/.test(w.location.pathname)) {
                    ajaxData = "cass-rooms";
                }

                // check if we are on the page displaying the law rooms
                else if (/law-rooms/.test(w.location.pathname)) {
                    ajaxData = "law-rooms";
                }

                // check if we are on the page displaying the health rooms
                else if (/health-rooms/.test(w.location.pathname)) {
                    ajaxData = "health-rooms";
                }


            }

            CITY.load('highcharts', getData);

        };

    //expose
    return {
        init: init
    };

}(CITY, jQuery, window));

//run this
CITY.location.init();