CITY.stratplan = (function (d) {

    var facts = $("dl[class*='hp-fact']"),
        chartFacts = $(".hp-fact-chart dt");

    d(facts);

    //need accordion style behaviour for hp facts
    if (facts.length) {

        facts.find("dd").hide();

        facts.each(function () {

            var fact = $(this);

            $("<dt />", {
                "class": "hideshow",
                click: function () {
                    fact.find("dd").slideToggle();
                }
            }).append($("<span />", {
                text: "►"
            })).insertAfter(fact.find("dt"));

        });

    }

    //need high charts on hp
    if (chartFacts.length) {

        yepnope({
            load: "lib/highcharts/highcharts.js",
            callback: function () {

                chartFacts.each(function () {

                    var factData = $(this).text().split("/"),
                        factDataNum = [],
                        colours = ["#c91e25", "silver"];

                    $.each(factData, function (i, el) {
                        factDataNum.push({
                            y: parseInt(el, 10),
                            color: colours[i]
                        });
                    });

                    new Highcharts.Chart({

                        chart: {
                            renderTo: this,
                            type: "pie",
                            spacingTop: 0,
                            spacingBottom: 0,
                            height: 200
                        },
                        title: {
                            text: null
                        },
                        plotOptions: {
                            pie: {
                                shadow: false,
                                dataLabels: {
                                    enabled: false
                                },
                                animation: false
                            }
                        },
                        tooltip: {
                            enabled: false
                        },
                        credits: {
                            enabled: false
                        },
                        series: [{
                            data: factDataNum,
                            innerSize: "40%"
                        }]
                    });

                });

            }
        });

    }

}(CITY.debug));