var defer = require('./utils/defer'),
    init = function(){
      var collection = $('.timeline__collection');
      var header = $('.timeline__collection__header');
      $('.timeline__collection__header a').click(function( event ) {
        event.preventDefault();
      });
      
      var openGroup = collection.filter('.open');
      if (openGroup) {
        openGroup.find('.timeline__content').removeClass('collapsed').addClass('expanded').end().find('.timeline__collection__header__icon').removeClass('fa-angle-down').addClass('fa-angle-up');
        header.find('a').attr('aria-selected','true').attr('aria-expanded','true');
      }
  
     var accordion = function () {

        var closeItems = function (item,title) {
              item.find('.timeline__content').fadeOut('slow').removeClass('expanded').addClass('collapsed').find('.timeline__content__block').slideUp('slow');
              item.removeClass('open').addClass('closed').find('.timeline__content').slideUp("slow");
              title.find('a').attr('aria-selected','false').attr('aria-expanded','false');
              title.find('.timeline__collection__header__icon').removeClass('fa-angle-up').addClass('fa-angle-down');
              item.find('.timeline__verical-line-stop').fadeIn('slow');  
            },
            openItems = function (item,title) {
              item.find('.timeline__content').fadeIn('slow').removeClass('collapsed').addClass('expanded').find('.timeline__content__block').slideDown('slow');
              item.removeClass('closed').addClass('open').find('.timeline__content').slideDown("slow");
              title.find('a').attr('aria-selected','true').attr('aria-expanded','true');
              title.find('.timeline__collection__header__icon').removeClass('fa-angle-down').addClass('fa-angle-up');
              item.find('.timeline__verical-line-stop').fadeIn('slow');
            };

        $('.timeline__collection__header').click(function () {
          var title = $(this),
              item = title.parent(),
              isOpen = item.hasClass('open');

          if (isOpen) {
              closeItems(item,title);
          } else {
              openItems(item,title);
          }
        });
                
    };

    accordion();

  };

defer(init);