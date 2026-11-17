
CITY.library = (function($) {
    'use strict';


    const libraries = document.querySelectorAll('.opening-times-list > li'),
        formWrapper = document.querySelector('.library-search'),
        dropdowns = formWrapper ? formWrapper.querySelectorAll('.dropdown-select') : [],
        optionSelect = formWrapper ? formWrapper.querySelector('.library-search__content-type') : null,
        optionFields = formWrapper ? formWrapper.querySelectorAll('.search-refine-wrapper input') : [],

        
    selectChange = function(e) {
        const index = e.target.selectedIndex;
        optionFields.forEach(function(field) {
            field.checked = false;
        });
        optionFields[index].checked = true;
    },

    toggleOption = function(e) {
        e.preventDefault();
        const dropdown = e.currentTarget;
        const optionEl = e.target.closest('.option');
      
        dropdown.classList.toggle('active');
      
        if (!optionEl || !dropdown.contains(optionEl)) {
          // clicked outside an actual .option
          return;
        }
      
        const selectedValue = optionEl.dataset.value;
        const text = optionEl.innerHTML;
      
        const options = Array.from(dropdown.querySelectorAll('.option'));
        const inputs  = dropdown.querySelectorAll('input[type="radio"]');
        const display = dropdown.querySelector('.display-span');
      
        inputs.forEach(inp => inp.checked = false);
        const idx = options.indexOf(optionEl);
        if (inputs[idx]) inputs[idx].checked = true;
      
        if (display) display.innerHTML = text;
      
        dropdown.classList.remove('active');
      },

    setupPanel = function(panel, index, panels){
        const prevBtn = panel.querySelector('.opening-times-navigation-previous .calendarNavLink');
        const nextBtn = panel.querySelector('.opening-times-navigation-next .calendarNavLink');

        panel.setAttribute('data-panel-idx', index);

        if(index === 0){
            prevBtn.setAttribute('disabled', true);
        } 
        
        if (index === 3) {
            nextBtn.setAttribute('disabled', true);
        } 

        prevBtn.setAttribute('data-show-panel', index - 1);

        nextBtn.setAttribute('data-show-panel', index + 1);        
        panel.addEventListener('click', e => {
            changePanel(e,panel,index,panels);
        })
    },

    changePanel =  function(e,panel,index,panels) {

        if(e.target.classList.contains('calendarNavLink')) {
            e.preventDefault();
            const showSlide = e.target.getAttribute('data-show-panel');
            panel.classList.remove('opening-times-panel--active','opening-times-panel--fade-in');
            panels[showSlide].classList.add('opening-times-panel--active');
            requestAnimationFrame(() => {
                panels[showSlide].classList.add('opening-times-panel--fade-in');
            });
            
        }
    },

    init = function() {
        if (optionSelect) {
            optionSelect.addEventListener('change', selectChange);
            }
        if (dropdowns.length) {
            dropdowns.forEach(dropdown => {
                dropdown.addEventListener('click', toggleOption);
            });
        }
        libraries.forEach(lib => {
            const panels = lib.querySelectorAll('.opening-times-panel');
            //activate the first week/panel
            panels[0].classList.add('opening-times-panel--active','opening-times-panel--fade-in');
            panels.forEach((panel, index) => {
                setupPanel(panel,index,panels); 
            })
        })
    };

    return {
        init: init,
    };
})($);

//call init fn
CITY.library.init();