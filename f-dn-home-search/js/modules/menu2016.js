$(function() {
    var $menuWrapper = $(".menu2016-wrapper");
    var $menuToggle  = $(".menu2016-toggle");
    var $menu        = $(".menu2016");

    initMenu();

    $menuToggle.click(function() {
        if ($menu.is(":hidden")) {
            openCurrentSubmenus();
        }

        $(this).toggleClass("menu2016-toggle--open");
        $menu.slideToggle("fast");
        return false;
    });

    $(".menu2016__item-toggle").click(function() {
        if ($(this).hasClass("menu2016__item-toggle--open")) {
            closeSubmenu($(this));
        }
        else {
            openSubmenu($(this));
        }
        return false;
    });

    function initMenu() {
        $menu.hide();
        $menu.find("li").addClass("menu2016__item");
        $menu.find("li:has(ul)").addClass("menu2016__item--branch");
        $menu.find("a").addClass("menu2016__item-link").wrapInner("<span class='menu2016__item-text'></span");
        $menu.find(".menu2016__item--branch").children("a").after("<a class='menu2016__item-toggle' href='#'></a>");

        assignSubmenuLevels();
        highlightCurrentPage();
    }

    function assignSubmenuLevels() {
        $menu.find("ul").each(function(index) {
            $(this).addClass("menu2016__submenu");
            var depth = $(this).parentsUntil($menuWrapper, 'ul').length;
            $(this).addClass('menu2016__submenu--level-' + depth);
        });
    }

    function highlightCurrentPage() {
        //var pathname = (window.location.pathname.match(/[^\/]+$/)[0]);
        //$(".menu2016 .menu2016__item-link[href='" + pathname  + "']").addClass("menu2016__item-link--selected");
        //console.log(pathname);
        var pathname = (window.location.pathname);
        $(".menu2016 .menu2016__item-link[href$='" + pathname  + "']").addClass("menu2016__item-link--selected");

    }

    function openCurrentSubmenus() {
        $menu.find(".menu2016__submenu").each(function(index) {
            if ($(this).find(".menu2016__item-link--selected").length > 0) {
                $(this).show();
                $(this).prev().addClass("menu2016__item-toggle--open");
            }
            else {
                $(this).hide();
                $(this).prev().removeClass("menu2016__item-toggle--open");
            }
        });
    }

    function openSubmenu($toggle) {
        $toggle.addClass("menu2016__item-toggle--open");
        $toggle.next().slideDown("fast", function() {
            closeSameLevelSubmenus($toggle);
        });
    }

    function closeSameLevelSubmenus($toggle) {
        $siblingBranches = $toggle.closest(".menu2016__item--branch").siblings(".menu2016__item--branch");

        $.each($siblingBranches, function(index) {
            if ($(this).find(".menu2016__item-link--selected").length <= 0) {
                $(this).find(".menu2016__item-toggle").removeClass("menu2016__item-toggle--open");
                $(this).find(".menu2016__submenu").slideUp("medium");
            }
        });
    }

    function closeSubmenu($toggle) {
        $enclosingMenuItem = $toggle.closest(".menu2016__item--branch");

        if ($enclosingMenuItem.find(".menu2016__item-link--selected").length > 0) {
            $toggle.removeClass("menu2016__item-toggle--open");
            $toggle.next().slideUp("fast");
        }
        else {
            $enclosingMenuItem.find(".menu2016__item-toggle").removeClass("menu2016__item-toggle--open");
            $enclosingMenuItem.find(".menu2016__submenu").slideUp("fast");
        }
    }
});
