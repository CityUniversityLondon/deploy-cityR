module.exports = function () {

    var $menuWrapper = $(".primary-menu-wrapper"),
        $menuToggle  = $(".primary-menu-toggle"),
        $menu        = $(".primary-menu"),

        updateToggleLink = function (toggle, isOpen) {
            toggle.toggleClass("primary-menu__item-toggle--open", isOpen);
            toggle.attr('aria-expanded', isOpen ? 'true' : 'false');
        },

        buildMenu = function () {
            $menu.find("li:has(ul)")
                 .addClass("primary-menu__item--branch")
                 .children(".primary-menu__item-interior")
                 .each(function(index) {
                     $ariaLabel = "show or hide items under " + $(this).find(".primary-menu__item-text").text();
                     $(this).append("<a class='primary-menu__item-toggle' href='#' aria-label='" + $ariaLabel + "'></a>");
                 });

            $menuToggle.attr("aria-label", $menuToggle.find(".primary-menu-toggle__section-name").text() + " menu");
        },

        highlightCurrentPage = function () {
            var pathname = (window.location.href).replace("/_nocache", "").replace("/_recache", "");
            $(".primary-menu .primary-menu__item-link[href$='" + pathname  + "']").addClass("primary-menu__item-link--selected");
        },

        openCurrentSubmenus = function () {
            $menu.find(".primary-menu__submenu").each(function(index) {
                if ($(this).find(".primary-menu__item-link--selected").length > 0) {
                    $(this).show();
                    updateToggleLink($(this).prev().children(".primary-menu__item-toggle"), true);
                }
                else {
                    $(this).hide();
                    updateToggleLink($(this).prev().children(".primary-menu__item-toggle"), false);
                }
            });
        },

        openSubmenu = function ($toggle) {
            updateToggleLink($toggle, true);
            $toggle.parent(".primary-menu__item-interior").next().slideDown("fast", function() {
                closeSameLevelSubmenus($toggle);
            });
        },

        closeSameLevelSubmenus = function ($toggle) {
            var $siblingBranches = $toggle.closest(".primary-menu__item--branch").siblings(".primary-menu__item--branch");

            $.each($siblingBranches, function(index) {
                if ($(this).find(".primary-menu__item-link--selected").length <= 0) {
                    updateToggleLink($(this).find(".primary-menu__item-toggle"), false);
                    $(this).find(".primary-menu__submenu").slideUp("medium");
                }
            });
        },

        closeSubmenu = function ($toggle) {
            var $enclosingMenuItem = $toggle.closest(".primary-menu__item--branch");

            if ($enclosingMenuItem.find(".primary-menu__item-link--selected").length > 0) {
                updateToggleLink($toggle, false);
                $toggle.parent(".primary-menu__item-interior").next().slideUp("fast");
            }
            else {
                updateToggleLink($enclosingMenuItem.find(".primary-menu__item-toggle"), false);
                $enclosingMenuItem.find(".primary-menu__submenu").slideUp("fast");
            }
        },

        initMenu = function () {
            buildMenu();
            highlightCurrentPage();

            $menuToggle.attr('aria-expanded', 'false').click(function() {
                if ($menu.is(":hidden")) {
                    openCurrentSubmenus();
                }

                var setOpen = !$menuToggle.hasClass("primary-menu-toggle--open");

                $menuToggle.toggleClass("primary-menu-toggle--open", setOpen);
                $menuToggle.attr('aria-expanded', setOpen ? 'true' : 'false');

                $menu.slideToggle("fast");
                return false;
            });

            $(".primary-menu__item-toggle").click(function() {
                if ($(this).hasClass("primary-menu__item-toggle--open")) {
                    closeSubmenu($(this));
                }
                else {
                    openSubmenu($(this));
                }
                return false;
            });
        };

    return initMenu();
};

