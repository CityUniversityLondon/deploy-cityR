module.exports = function () {
    'use strict';

    var $ = require('../jquery');

    return function(inputURL, inputData, inputType) {
        var promise = $.ajax({
            url: inputURL,
            data: inputData,
            type: (inputType ? inputType : 'get')
        })
        .done( function(responseData, status, xhr) {
            // Pre-determined Logic for Success
            // (this will run before any `.done()` or `.fail()` where `customAJAX()` is called)
            // console.log('Success');
        })
        .fail( function(xhr, status, err) {
            // Pre-determined Logic for Failure
            // (this will run before any `.done()` or `.fail()` where `customAJAX()` is called)
            // console.log('Failure');
        });
        return promise;
    };

}();
