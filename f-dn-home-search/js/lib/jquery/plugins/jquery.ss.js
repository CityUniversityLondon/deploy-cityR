/**
 * jQuery SS (Stateful-Scrolling)
 *
 * @author Simon Mayes <Simon.Mayes@mayeskennedy.co.uk>
 * @copyright Mayes, Kennedy & Company 2012. All Rights Reserved.
 * @license MIT License. See LICENSE file.
 */
(function($) {'use strict';
    var
    // -- VARIABLES
    settings = {
        // selector for form
        form : '#ss-form',
        // selector for results target
        results : '#ss-results',
        // selector for results item
        resultsItem : '#ss-results-target .results-item',
        // results working class
        workingClass : 'ss-working',
        // selector for pagination
        pagination : '#ss-pagination',
        // selector for pagination next
        paginationNext : '#ss-pagination a.next',
        // selector for next
        nextId : 'ss-next',
        // custom page selector
        pageClass : 'page',
        // scroll totop s
        scrollToTopId : 'ss-top',
        // form serialize callback
        formSerializeCallback : null,
        // alternative action
        action : null,
        // initial load callback
        initialLoadCallback : null,
        // before load callback
        beforeLoadCallback : null,
        // after load callback
        afterLoadCallback : null,
        // after draw callback
        afterDrawCallback: null
    }, // end settings
    state = [], // array to log state
    inProgress = false, // toggle to prevent concurrent ajax requests
    autoscroll = false, // the autoscroll on initial load,
    $this,
    // -- METHODS
    methods = {
        init : function(options) {
            settings = $.extend(settings, options);
            if(false === checkDependencies.call(this)) {
                return false;
            }
            hijackForm.call(this);
            attachEvents.call(this);
            hijackPagination.call(this);
            drawExtras.call(this);
            var hash = window.location.hash.replace(/^#/, '');
            if(hash) {
                populateForm.call(this);
                if('function' === typeof settings.initialLoadCallback) {
                    var params = settings.initialLoadCallback.call(this, hash);
                    if(false !== params) {
                        processInitialLoad(params);
                    }
                } else {
                    $(settings.results).empty();
                    $('#' + settings.nextId).hide();
                    processHashChange();
                }
            }
            return this;
        } // end init
    }, // end methods
    // -- FUNCTIONS
    checkDependencies = function() {
        if('object' !== typeof $.bbq) {
            $.error('jQuery.ss requires jQuery.bbq');
            return false;
        }
        if(!(1 === this.length && 'form' === this.get(0).tagName.toLowerCase() && 'string' === typeof this.attr('id'))) {
            $.error('jQuery.ss must be attached to a single form with an id');
            return false;
        }
        var method = this.attr('method');
        if('string' === typeof method && 'get' !== method.toLowerCase()) {
            $.error('jQuery.ss requires the form method to be GET');
            return false;
        }
        // Okay. We have everything!
        return true;
    }, // end checkDependencies
    hijackForm = function() {
        settings.form = '#' + this.attr('id');
        this.submit(function() {
            var serialize = $(this).serialize();
            if('function' === typeof settings.formSerializeCallback) {
                serialize = settings.formSerializeCallback.call(this, serialize);
            }
            var hash = '#' + serialize;
            if(hash !== window.location.hash) {
                state = [];
                $(settings.results).empty();
                $('#' + settings.nextId).hide();
                $.bbq.pushState(hash);
            }
            // prevent bubbling/ default etc.
            return false;
        });
        this.find('input[type=checkbox], input[type=radio], input[type=button], button').click(function() {
            $(settings.form).submit();
        });
    }, // end hijackForm
    attachEvents = function() {
        $(window).bind('scroll', processScroll);
        $(window).bind('hashchange', processHashChange);
    }, // end attachEvents
    hijackPagination = function() {
        $(settings.results).after($('<a/>', {
            id : settings.nextId,
            html : 'Load more',
            href : $(settings.paginationNext).length ? $(settings.paginationNext).attr('href') : 'javascript:;',
            click : function() {
                var query = fetchQueryStr($(this).attr('href'));
                if(false === query) {
                    // error thrown by fetchSearchStr already
                    return false;
                }
                $.bbq.pushState('#' + query);
                // prevent bubbling/ default etc.
                return false;
            },
            style : $(settings.paginationNext).is(':visible') ? null : 'display:none;'
        }));
        $(settings.pagination).remove();
    }, // end hijackPagination
    drawExtras = function() {
        $(document.body).append($('<a/>', {
            id : settings.scrollToTopId,
            html : '<span>Scroll to top</span>',
            style:'position:fixed',
            click: function() {
                $("html, body").animate({ scrollTop: 0 }, "slow");
            }
        }));
    }, // end drawExtras
    populateForm = function() {
        var hash = $.deparam.fragment();
        $(settings.form).find('input[type=checkbox], input[type=radio]').attr('checked', false);
        $(settings.form).find('input[type=text], input[type=password]').val('');
        $(settings.form).find('textarea').text('');
        $(settings.form).find('select option').attr('selected', false);

        $(settings.form).find('input').each(function() {
            if($(this).attr('name') in hash) {
                switch($(this).attr('type').toLowerCase()) {
                    case 'checkbox':
                    case 'radio':
                        if(hash[$(this).attr('name')] == $(this).val()) {
                            $(this).attr('checked', false);
                            $(this).click();
                            // allow users to bind
                        }
                        break;
                    default:
                        $(this).val(hash[$(this).attr('name')]);
                        $(this).change();
                    // allow users to bind
                }
            }
        });
        $(settings.form).find('select').each(function() {
            var $select = $(this);
            if($select.attr('name') in hash) {
                $select.find('option').attr('selected', false);
                $select.find('option').each(function() {
                    if(hash[$select.attr('name')] == $(this).val()) {
                        $(this).attr('selected', true);
                    }
                });
            }
        });
        $(settings.form).find('textarea').each(function() {
            if($(this).attr('name') in $.deparam.fragment()) {
                $(this).html(hash[$(this).attr('name')]);
            }
        });
    }, // end populateForm
    processResponse = function(data, textStatus, jqXHR) {
        if('function' === typeof settings.afterLoadCallback) {
            settings.afterLoadCallback.call($this);
        } else {
            afterLoad();
        }
        data = data.replace(/(<body[^>]*>)/i, '$1<div>').replace(/(<\/body>)/i, '</div>$1');
        $(settings.results).append($('<div/>', {
            'class' : settings.pageClass,
            hash : window.location.hash,
            html : $(settings.results, data).html()
            //style : 'clear:both;'
        }));
        if ('function' == typeof settings.afterDrawCallback) {
            settings.afterDrawCallback.call($this);
        }
        if($(settings.paginationNext, data).length) {
            $('#' + settings.nextId).show().attr('href', $(settings.paginationNext, data).attr('href'));
        } else {
            $('#' + settings.nextId).hide();
        }
        if(autoscroll) {
            autoscroll = false;
            $(window).scrollTop($(settings.results).find('div.' + settings.pageClass + ':last').offset().top);
        }
    }, // end processResponse
    processInitialLoad = function(params) {
        inProgress = true;
        autoscroll = true;
        $(settings.results).empty();
        $('#' + settings.nextId).hide();
        $.ajax({
            url : 'string' === typeof settings.action ? settings.action : $(settings.form).attr('action'),
            data : params,
            success : function(data, textStatus, jqXHR) {
                data = data.replace(/(<body[^>]*>)/i, '$1<div>').replace(/(<\/body>)/i, '</div>$1');
                $(settings.results).append($(settings.results, data).html());
                inProgress = false;
                processHashChange();
            },
            error : function(jqXHR, textStatus, errorThrown) {
                $.error('AJAX failed with "' + textStatus + '" in jQuery.ss');
            },
            complete : function(jqXHR, textStatus) {
                // enable the UI
                inProgress = false;
                // push the new hash on the state array
            },
            dataType : 'html'
        });
    }, // end processInitialLoad
    processScroll = function() {
        if($('#' + settings.nextId).is(':visible') && $(window).scrollTop() + $(window).height() >= $('#' + settings.nextId).offset().top) {
            // if scrolled to pagination next, simulate click
            $('#' + settings.nextId).click();
        } else {
            // if elsewhere update hash with current position
            $(settings.results).find('.' + settings.pageClass).each(function() {
                var bottom = $(window).scrollTop() + $(window).height();
                if(bottom >= $(this).offset().top && bottom <= ($(this).offset().top + $(this).height())) {
                    $.bbq.pushState($(this).attr('hash'));
                    return;
                }
            });
        }
        if($(window).scrollTop() > $(settings.results).offset().top) {
            $('#' + settings.scrollToTopId).show();
        } else {
            $('#' + settings.scrollToTopId).hide();
        }
    }, // end processScroll
    processHashChange = function() {
        if(inProgress) {// prevent concurrent requests
            return;
        }

        var hash = window.location.hash;
        if(0 <= $.inArray(hash, state)) {// we've had this state before
            // sit back, relax and...
            return;
        }

        // disable the UI
        inProgress = true;
        if('function' === typeof settings.beforeLoadCallback) {
            settings.beforeLoadCallback.call($this);
        } else {
            beforeLoad();
        }
        // continue if new state
        $.ajax({
            url : 'string' === typeof settings.action ? settings.action : $(settings.form).attr('action'),
            data : hash.replace(/^#/, ''),
            success : processResponse,
            error : function(jqXHR, textStatus, errorThrown) {
                $.error('AJAX failed with "' + textStatus + '" in jQuery.ss');
            },
            complete : function(jqXHR, textStatus) {
                // enable the UI
                inProgress = false;

                // push the new hash on the state array
                if('success' === textStatus) {
                    state.push(hash);
                }
            },
            dataType : 'html'
        });
        // end ajax
        // prevent bubbling/ default etc.
        return false;
    }, // end processHashChange
    /**
     * fetchQueryStr is used to extract the query string from a URL
     */
    fetchQueryStr = function(url) {
        var query;
        if(null !== ( query = /\?(.+)$/.exec(url))) {
            // find query string in url
            return query[1];
        } else {
            // no idea. bail.
            $.error('No query string "' + url + '" somewhere in jQuery.ss');
            return false;
        }
    }, //end fetchQueryStr
    /**
     * beforeLoad is called before any ajax call inorder to add "waiting" animation to the UI
     */
    beforeLoad = function() {
        $(settings.form).find('input, select, button').attr('disabled', true);
        $('#' + settings.nextId).addClass(settings.workingClass);
        $(settings.results).addClass(settings.workingClass);
    }, //end beforeLoad
    /**
     * afterLoad is called after any ajax call inorder to remove "waiting" animation to the UI
     */
    afterLoad = function() {
        $(settings.form).find('input, select, button').attr('disabled', false);
        $('#' + settings.nextId).removeClass(settings.workingClass);
        if('' === $(settings.results).text()) {
            $(settings.results).removeClass(settings.workingClass);
        }
    };
    //end afterLoad

    $.fn.ss = function(method) {
        $this = this;
        if(methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if( typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.ss');
        }
    };
    // end $.fn.ss
})(jQuery);