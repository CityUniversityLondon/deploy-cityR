module.exports = function () {

    init = function () {

        $(".link--goto").click(function() {
            $('html,body').scrollTop(0);
            return false;
        });
    };

    return init();
};

