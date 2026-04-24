/**
 * @projectDescription  This file setsup capacity plans using highcharts.js
 *
 * @author  James Grant
 * @version     0.2
 */

 /*global window, CITY, $, yepnope, console */

//set up a holder module
CITY.capacityPlans = (function () {

    var $highcharts = $(".highcharts"),
        chart,
        months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        //Start of the month to start data on
        monthIndex = new Date().getMonth(),
        yearIndex = new Date().getFullYear(),
        nextYear = yearIndex + 1,
        nextMonths = [],
        monthShow = 12,
        projectNames = [],
        projectColors = [],
        projectData = [],
        /**
        *   @param {} Calculates the next 12 months from the current date, also defines the offset to be used by the chart bars
        */
        calculateMonths = function () {
            for (var i = 0; i < monthShow; i++) {
                if (i > 11 - monthIndex) {
                    monthShow -= i;
                    i = 0 - monthIndex;
                }
                nextMonths.push(months[monthIndex + i]);
            }
        },
        /**
        *   @param {integer, object} Takes the current bar data
        *   @return {undefined}
        */
        createSeries = function (i, v) {
            //Cast dates to seperate object vars
            var splitStart = v.startDate.split("/"),
            splitEnd = v.endDate.split("/"),
            endmonth;
            v.startmonth = splitStart[0] - 1;
            v.endmonth = splitEnd[0] - 1;
            v.startyear = splitStart[1];
            v.endyear = splitEnd[1];

            if (parseInt(v.endyear, 10) > yearIndex) {
                endmonth = parseInt(v.endmonth, 10);
                endmonth += 12;
                v.endmonth = endmonth;
            }
            if (parseInt(v.endyear, 10) >= yearIndex && (parseInt(v.endmonth, 10) >= monthIndex && parseInt(v.endyear, 10) >= yearIndex)) {
                projectNames.push(v.title);
                projectColors.push(v.barcolor);
                if (parseInt(v.startyear, 10) > yearIndex) {
                    projectData.push([parseInt(v.startmonth - monthIndex + 12, 10), parseInt(v.endmonth - monthIndex, 10)]);
                } else if (parseInt(v.startyear, 10) < yearIndex) {
                    projectData.push([parseInt(v.startmonth - monthIndex - 12, 10), parseInt(v.endmonth - monthIndex, 10)]);
                } else {
                    projectData.push([parseInt(v.startmonth - monthIndex, 10), parseInt(v.endmonth - monthIndex, 10)]);
                }
            }
        },
        /**
        *   @param {object, object, string} Makes the current chart and assembles the data for it to use
        *   @return {undefined}
        */
        createChart = function (ajax, container, title) {
            projectData = [];
            projectNames = [];
            projectColors = [];

            $.each(ajax, function (i, v) {
                createSeries(i, v);
            });

            chart = new Highcharts.Chart({
                chart: {
                    renderTo: container,
                    type: "columnrange",
                    inverted: true
                },
                title: {
                    text: title + ": 12 Month Outlook"
                },
                subtitle: {
                    text: yearIndex + " - " + nextYear
                },
                xAxis: {
                    categories: projectNames,
                    showLastLabel: true,
                    endOnTick: true,
                    offset: 50
                },
                yAxis: {
                    showFirstLabel: false,
                    allowDecimals: false,
                    min: -1,
                    max: 11,
                    categories: nextMonths,
                    title: {
                        text: "Months"
                    },
                    labels: {
                        staggerLines: 3,
                        overflow: "justify"
                    }
                },
                plotOptions: {
                    series: {
                        colorByPoint: true,
                        colors: projectColors
                    }
                },
                legend: {
                    enabled: false
                },
                series: [{
                    data: projectData
                }],
                tooltip: {
                    enabled: false
                }
            });
        };//End variables

    $highcharts.addClass("loading");

    //Calculate the next 12 months
    calculateMonths();

    //Loop through and init the highcharts
    $highcharts.each(function (i, v) {

        var $team = $(this),
            $projects = $team.find(".project"),
            title = $team.data("cul-team-title"),
            json = {};

        $projects.each(function () {

            var $self = $(this),
                dataJson = $self.data("cul-project"),
                projectTitle = dataJson.title;

            json[projectTitle] = dataJson;

        });

        createChart(json, v, title);
    });

}(CITY.debug));


