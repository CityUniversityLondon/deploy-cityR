//Author: James Grant
//City University

//buildingTheVision.js

//set up a holder module
CITY.capacityPlans = (function () {
    var
    $highcharts = $(".highcharts#capacityPlans"),
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
    calculateMonths = function () {
        for (var i = 0; i < monthShow; i++) {
            if (i > 11 - monthIndex) {
                monthShow -= i;
                i = 0 - monthIndex;
            }
            nextMonths.push(months[monthIndex + i]);
        }
    },
    createSeries = function (i, v) {
        if (parseInt(v.endyear, 10) > yearIndex) {
            var enddate = parseInt(v.enddate, 10);
            enddate += 12;
            v.enddate = enddate;
        }
        if (parseInt(v.endyear, 10) >= yearIndex && (parseInt(v.enddate, 10) >= monthIndex && parseInt(v.endyear, 10) >= yearIndex)) {
            projectNames.push(v.title);
            projectColors.push(v.barcolor);
            if (parseInt(v.startyear, 10) > yearIndex) {
                projectData.push([parseInt(v.startdate - monthIndex + 12, 10), parseInt(v.enddate - monthIndex, 10)]);
            } else if (parseInt(v.startyear, 10) < yearIndex) {
                projectData.push([parseInt(v.startdate - monthIndex - 12, 10), parseInt(v.enddate - monthIndex, 10)]);
            } else {
                projectData.push([parseInt(v.startdate - monthIndex, 10), parseInt(v.enddate - monthIndex, 10)]);
            }
        }
    },
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

    //Calculate the next 12 months
    calculateMonths();

    //Loop through and init the highcharts
    $.each($highcharts, function (i, v) {
        var title = $(this).attr("title"),
        json = "[";
        $.each($(v).find("span.highcharts"), function (i, v) {
            json += $(v).text();
        });
        json += "]";
        json = jQuery.parseJSON(json);
        createChart(json, v, title);
    });
}(CITY.debug));