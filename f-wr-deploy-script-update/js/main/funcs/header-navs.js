module.exports = function () {

    var
        $globalNavToggler = $(".global-nav__toggle"),
        $headerSearch = $(".header__search"),
        $headerSearchToggler = $(".header__search__toggle"),
        $globalNavWrapper = $(".global-nav__wrapper"),
        $globalNavDropToggler = $(".global-nav__menu-item__toggle"),
        $utilNav = $(".header__util__audience__button-link"),
        $body = $('body'),
        $compactWidth = 748,
        $stickyHeaderScrollThreshold = 70,
        $lastScrollTop = 0,
        $window = $(window),


        closeMenus = function () {
            $(".header__util__item--active").removeClass("header__util__item--active");
            $(".global-nav__menu-item--active").removeClass("global-nav__menu-item--active");
            $globalNavDropToggler.attr('aria-expanded', 'false');
            $utilNav.attr('aria-expanded', 'false');
        },

        toggleMobileGlobalMenu = function (openMenu) {
            var openSearch = openMenu === 'search' && !$headerSearch.hasClass("header__search--active");
            var openNav = openMenu === 'nav' && !$globalNavWrapper.hasClass("global-nav__wrapper--active");

            $globalNavWrapper.toggleClass("global-nav__wrapper--active", openNav);
            $globalNavToggler.attr('aria-expanded', openNav ? 'true' : 'false');

            $headerSearch.toggleClass("header__search--active", openSearch);
            $headerSearchToggler.attr('aria-expanded', openSearch ? 'true' : 'false');
        },

        initSkipLinks = function () {
            $('#skip-to-query').click(function () {
                setTimeout(function () {
                    toggleMobileGlobalMenu('search');
                    $('#query').focus();
                }, 25);
            });
            $('#skip-to-accessibility').click(function () {
                setTimeout(function () {
                    $('#accessibility').focus();
                }, 25);
            });
        },


        updateTabNavigation = function () {
            if ($window.width() > $compactWidth) {
                $(".global-nav__menu-item__link").each(function() {
                    if ($(this).siblings(".global-nav__menu-item__toggle").length) {
                        $(this).attr("tabindex", -1);
                    }
                });
            }
            else {
                $(".global-nav__menu-item__link").removeAttr("tabindex");
            }
        },

        updateScrollDown = function () {
            var $newScrollTop = $(this).scrollTop();
            $body.toggleClass('scroll-down', ($newScrollTop > $stickyHeaderScrollThreshold) && ($newScrollTop < $lastScrollTop));
            $lastScrollTop = $newScrollTop;
        },

        init = function () {

            initSkipLinks();

            /**
             * Update classname depending on scroll position
             */
            $window.scroll(updateScrollDown);
            updateScrollDown();

            /**
             * With JS enabled, links going to other pages should not be reachable through the tab key,
             * as opposed to toggle links - except when menu is in compact view.
             */
            $window.resize(updateTabNavigation);
            updateTabNavigation();

            closeMenus();

            $utilNav.on("click", function (e) {
                var
                    that = $(this),
                    parent = that.parent("li"),
                    targetIsActive = parent.hasClass("header__util__item--active");

                closeMenus();
                if (!targetIsActive) {
                    parent.addClass("header__util__item--active");
                    that.attr('aria-expanded', 'true');
                }


                e.preventDefault();
                e.stopPropagation();
                return false;
            });

            $body.click(function () {
                closeMenus();
            });

            /**
             * Not perfect as it relies on keyup instead of keydown
             */
            $body.keyup(function (e) {
                if (e.keyCode === 9 &&
                    $('.header__util__item--active,.global-nav__menu-item--active').length > 0 && !$(e.target).is('.header__util__item--active,.header__util__item--active *, .global-nav__menu-item--active, .global-nav__menu-item--active *')) {
                    closeMenus();
                }
            });

            $globalNavDropToggler.on("click", function (e) {
                var
                    that = $(this),
                    parent = that.parents(".global-nav__menu-item"),
                    targetIsActive = parent.hasClass("global-nav__menu-item--active");

                closeMenus();
                if (!targetIsActive) {
                    parent.addClass("global-nav__menu-item--active");
                    that.attr('aria-expanded', 'true');
                }


                e.preventDefault();
                e.stopPropagation();
                return false;
            });

            toggleMobileGlobalMenu('none');
            $globalNavToggler.on("click", function (e) {
                e.preventDefault();
                toggleMobileGlobalMenu('nav');
            });

            $headerSearchToggler.on("click", function (e) {
                e.preventDefault();
                toggleMobileGlobalMenu('search');
            });
        };

    return init();
};

