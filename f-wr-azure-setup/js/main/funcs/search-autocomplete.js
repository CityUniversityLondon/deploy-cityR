/**
 * adds autocomplete functionality to the main search bar, using jQuery UI
 * @param: {Object} form - jQuery object for form to run autoSuggest on
 * @param: {Object} input - jQuery object for input elements to run autoSuggest on
 * @param: {String} collection - the name of the Funnelback collection to query
 * @retun: {Undefined}
 */
module.exports = function () {
    'use strict';

    var $ = require('../jquery'),

        arrayDuplicateZapper = function (myArray) {
            var myUniqueArray = [];
            $.each(myArray, function (i, el) {
                if ($.inArray(el, myUniqueArray) === -1) myUniqueArray.push(el);
            });
            return myUniqueArray;
        };

    return function (form, input, collection) {
        input.autocomplete({

            source: function (request, response) {
                var fbcollection = collection || "main-all";
                $.ajax({
                    url: "/api/suggest.json?collection=" + fbcollection + "&fmt=json",
                    dataType: "json",
                    data: {
                        partial_query: request.term
                    },
                    success: function (data) {
                        data = arrayDuplicateZapper(data);
                        response($.map(data, function (item) {
                            return {
                                label: item
                            };
                        }));
                    }
                }); //end $.ajax

            }, //end source function

            minLength: 2,
            delay: 20,

            //when you have selected something
            "select": function (event, ui) {
                //close the drop down
                //need to create a dummy assignment, to please jslint
                //close is still performed
                var c = this.close;
                //make sure on click the selected value replaces the type value
                $(this).val(ui.item.value);
                form.submit();
            },

            //show the drop down
            open: function () {
                $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
            },

            //close the drop down
            close: function () {
                $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
            }

        });
    };

}();
