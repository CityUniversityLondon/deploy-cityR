/*
 * This is custom Javascript to override unwanted text / characters printed by React on the following URL
 * https://researchcentres.city.ac.uk/software-reliability/publications/_nocache
 * A React solution wasn't found to stop the text being printed.
 *
 */

module.exports = (function () {
    'use strict';

    var $ = require('../jquery');
    return function () {

        //checks if ID exists: publications-search-react
        if($('#publications-search-react').length){
            var string ='"},"staticData":false,"fixedProperties":{"divisions":"IICSWR"}}';
            $('#content').html($('#content').html().replace(string,''));
        }
    };
})();
