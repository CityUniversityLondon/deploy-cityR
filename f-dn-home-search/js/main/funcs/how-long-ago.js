/**
 * converts a Date object into "about 1 hour ago" twitter style
 * @param {Date} date: the js date object to translate
 */
module.exports = function (date) {

    //helpful constants
    var minute = 60000,
        hour = minute * 60,
        day = hour * 24,
        week = day * 7,
        month = day * 30, // approx ( note the "about..." )

    //vars needed here
        now = new Date().getTime(),
        this_epoch = date.getTime(),
        diff = now - this_epoch,
        return_string = "about ",
        temp;

    if (diff < minute) {
        return return_string + "1 minute ago";
    } else if (diff < hour) {
        temp = Math.ceil(diff / minute);
        return return_string + temp + " minutes ago";
    } else if (diff < day) {
        temp = Math.ceil(diff / hour);
        return return_string + temp + " hours ago";
    } else if (diff < week) {
        temp = Math.ceil(diff / day);
        return return_string + temp + " days ago";
    } else if (diff < month) {
        temp = Math.ceil(diff / week);
        return return_string + temp + " weeks ago";
    } else {
        temp = Math.ceil(diff / month);
        return return_string + temp + " months ago";
    }
};