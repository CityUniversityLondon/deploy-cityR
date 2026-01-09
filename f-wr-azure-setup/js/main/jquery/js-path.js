module.exports = function () {
    var path = null;
    $('script[src]').each(function () {
        var src = $(this).attr('src'),
            match = src.match(/(.+\/)([0-9]+\.)?CITY_R\.(min\.)?js(\?v=[0-9]+)?$/);

        if (match) {
            path = match[1];
            return false;
        }
    });

    return path;
};