module.exports = function () {

    var state = 'not-loaded',

        callbacks = [],

        loadComplete = function () {
            state = 'loaded';
            for (var i = 0; i < callbacks.length; i++) {
                callbacks[i]();
            }
        },

        checkLoadComplete = function () {
            if (google.visualization && google.visualization.DataTable) {
                loadComplete();
            } else {
                setTimeout(checkLoadComplete, 100);
            }
        },

        load = function () {
            state = 'loading';

            google.load('visualization', '1.0', {
                'packages': ['corechart'], callback: function () {
                }
            });
            google.setOnLoadCallback(checkLoadComplete);
        },

        onInit = function (f) {
            if (state === 'loaded') {
                f();
            } else {
                callbacks.push(f);
                if (state === 'not-loaded') {
                    load();
                }
            }
        };

    return {
        onInit: onInit
    };
}();
