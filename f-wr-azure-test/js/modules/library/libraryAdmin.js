var libraryAdmin = (function($) {
    'use strict';

    ////
    /// Instantiate tracking variables
    ////

    var eventArray = [],
        eventID,
        eventList = [],
        ////
        /// Instantiate anchoring variables
        ////
        $modal = $('.modal'),
        $modalDelete = $('.modal--delete'),
        $modalBox = $('.modal__box'),
        $modalBoxDelete = $('.modal__box--delete'),
        $modalClose = $('.modal__close'),
        $modalCloseDelete = $('.modal__close--delete'),
        $calendar = $('.admin-calendar'),
        currentLibrary = $calendar.attr('data-library-id'),
        globalCurrentDate =
            $calendar.attr('data-calendar-date') ||
            $calendar.attr('data-today-date'),
        globalCurrentYear = globalCurrentDate.split('-')[0],
        globalCurrentMonth = globalCurrentDate.split('-')[1],
        recurrenceEquivalence = {
            'Every weekday': 'DWD',
            'Every weekend day': 'DWE',
            'Every day': 'DED',
            'Every week': 'WEW',
        },
        $eventTemplate = $('#event-template'),
        $calendarNavLink = $('.calendarNavLink'),
        jsApi = new Squiz_Matrix_API({ key: '13123496783452586456' }),
        $eventElement,
        // add /_nocache to the current url and reload new url
        noCacheReload = function() {
            var fullUrl = document.location;
            if (fullUrl.pathname.search(/\_nocache/) === -1) {
                document.location =
                    fullUrl.origin +
                    fullUrl.pathname +
                    '/_nocache' +
                    fullUrl.search;
            } else {
                document.location.reload(true);
            }
        },
        // various tweaks to the table html layout
        // and iterate over each Day and build an array of unique Asset IDs, eventArray
        // For each ID in our array, assign a normalised number-class to their
        // respective Days
        // This is used by the CSS to assign unique colors to each Event
        formatCalendar = function() {
            var that,
                theEvent,
                eventArrayLength,
                eventDate,
                eventSpecial,
                eventLabel;

            $calendar
                .find('.eventDate')
                .find('.dateLink')
                .remove();

            // make sure the "root" id is passed to previous/next month links
            $calendarNavLink.each(function() {
                $(this).attr(
                    'href',
                    $(this).attr('href') + '&root=' + currentLibrary
                );
            });

            $eventElement = $calendar.find('.eventDate');

            $eventElement.each(function() {
                that = $(this);
                theEvent = that.find('[data-id]');
                eventID = theEvent.attr('data-id');
                eventDate = theEvent.attr('data-date');
                eventSpecial = theEvent.attr('data-special');
                eventLabel = theEvent.attr('data-label');

                if ($.inArray(eventID, eventArray) < 0) {
                    eventArray.push(eventID);
                }

                that.attr({
                    'data-id': eventID,
                    'data-date': eventDate,
                    'data-special': eventSpecial,
                    'data-label': eventLabel,
                });

                eventArrayLength = eventArray.length;
                for (var i = 0; i < eventArrayLength; i++) {
                    $("[data-id='" + eventArray[i] + "']")
                        .parents('.eventDate')
                        .addClass('event--' + (i + 1));
                }

                theEvent.removeAttr(
                    'data-id data-date data-special data-label'
                );
            });

            $('.calendar').removeClass('calendar--loading');
        }, // end formatCalendar
        parseCalendar = function() {
            // Hover Effect for Days with Events
            $eventElement.hover(
                function() {
                    // get the Asset ID of the Event associated with the hovered Day
                    eventID = $(this).attr('data-id');
                    // and add the `active` class to all Days with the same Asset ID
                    $("[data-id='" + eventID + "']").addClass('hover');
                },
                function() {
                    // and remove the `active` class once hover ends
                    $("[data-id='" + eventID + "']").removeClass('hover');
                }
            );

            // Hover Effect for Days without Events
            $('.unused').hover(
                function() {
                    // add the `active` class to only this Day
                    $(this).addClass('hover');
                },
                function() {
                    // remove the `active` class from only this Day
                    $(this).removeClass('hover');
                }
            );

            // When Days with Events are clicked, initiate the Modal based on the Asset ID
            //$dayElement.click( function() { // needed?  $dayElement === $eventElement
            $calendar.find('.date').click(function(e) {
                var clickCell = $(this),
                    dayToPass = '';

                if ($(e.target).hasClass('event__add-exception')) {
                    showModal(
                        'new modification',
                        clickCell.attr('data-date').split(' ')[0]
                    );

                    return;
                } else if (clickCell[0].hasAttribute('data-id')) {
                    // this may already be set by our `hover` function, but let"s be safe
                    eventID = $(this).attr('data-id');

                    // Pass the Event ID to the Modal and show it
                    showModal(eventID, undefined);

                    return;
                } else {
                    dayToPass = clickCell.find('.dateLink').html();
                    // Just show the default Modal
                    showModal(
                        undefined,
                        parseInt(dayToPass) < 10 ? '0' + dayToPass : dayToPass
                    );
                }

                /*
                // debug for checking attributes of exisitng clicked event
                */
                /*
                jsApi.getAttributes({
                    "asset_id": undefined || eventID,
                    "dataCallback": function (data) {
                        console.log(data);
                    }
                });
                */
            });
        }, // end parseCalendar
        ////
        /// Toggle Hour Selects
        /// @return undefined
        ////
        checkSpecial = function() {
            toggleHourSelects();

            var specialSelect = document.getElementById('modal__box__special');
            specialSelect.addEventListener('change', function() {
                toggleHourSelects();
            });
        },
        ////
        /// Check Special for Times Toggle
        /// @return undefined
        ////
        toggleHourSelects = function() {
            if (
                $('#modal__box__special').val() === 'closed' ||
                $('#modal__box__special').val() === 'open24hours'
            ) {
                $('#modal__box__times select').prop('disabled', true);
            } else {
                $('#modal__box__times select').prop('disabled', false);
            }
        }, // end toggleHourSelects
        ////
        /// Initialise the Modals
        /// @return undefined
        ////
        initModals = function() {
            $modalCloseDelete.click(function() {
                hideDeleteModal();
            });
            $modalClose.click(function() {
                hideModal();
            });

            // When the `Escape` key is pressed, hide the appropriate Modal
            $(document).keyup(function(e) {
                if (e.keyCode === 27) {
                    if ($modalDelete.hasClass('active')) {
                        hideDeleteModal();
                    } else if ($modal.hasClass('active')) {
                        hideModal();
                    }
                }
            });

            $modalBox.on('click', function(e) {
                var thistarget = $(e.target);

                e.preventDefault();

                if (thistarget.hasClass('modal__box__submit')) {
                    $modalBox.addClass('modal__box--loading');
                    $modalBox.off('click');
                    setMetadata();
                }
                if (thistarget.hasClass('modal__box__delete')) {
                    $modalBox.off('click');
                    // pass event id to delete here
                    showDeleteModal(eventID);
                }
            });

            $modalBoxDelete.on('click', function(e) {
                if ($(e.target).hasClass('modal__box__delete-confirm')) {
                    e.preventDefault();
                    // pass event id to delete here
                    deleteEvent(eventID);
                }
            });
        }, // end initModals
        ////
        /// Show the Modal
        /// @param empty || string
        /// @return undefined
        ////
        showModal = function(currentEvent, clickedDay) {
            // If an ID is *not* passed, this initiates creating a new Event
            if (currentEvent === undefined) {
                //clear modal data
                clearModalData(clickedDay, false, null);
            }
            // if the new modification button is used
            else if (currentEvent === 'new modification') {
                clearModalData(clickedDay, true, eventID);
            }
            // If an ID *is* passed then let's grab the relevant data and populate the
            // Modal with that data to modify that Event
            else {
                getModalData(currentEvent);
            }

            // Show the Modal
            $modal.addClass('active');
            // Hide the highlight on Days with this Event ID
            $("[data-id='" + eventID + "']").removeClass('hover');
            // Add the `aria-selected` attribute from respective Days
            $("[data-id='" + eventID + "']").attr('aria-selected', true);
        }, // end showModal
        ////
        /// Hide the Modal
        /// @return undefined
        ////
        hideModal = function() {
            // Hide the Modal
            $modal.removeClass('active');

            // Remove the `aria-selected` attribute from respective Days
            $("[data-id='" + eventID + "']").removeAttr('aria-selected');
        }, // end hideModal
        ////
        /// Show Delete Modal
        /// @return undefined
        ////
        showDeleteModal = function(eventID) {
            $('.modal__box__delete-confirm').prop('disabled', true);

            var request = new XMLHttpRequest(),
                requestURL =
                    '/api/library-opening-times/delete-event-children?root=' +
                    eventID,
                returnObject = {},
                data;

            // Get the fresh data as JSON
            request.open('GET', requestURL, true);

            request.onreadystatechange = function() {
                if (this.readyState === 4) {
                    if (this.status >= 200 && this.status < 400) {
                        //
                        // AJAX SUCCESS
                        //
                        data = JSON.parse(this.responseText);

                        if (Object.keys(data.children).length > 0) {
                            processDeleteExceptions(data);
                        }

                        // Enable the Final Delete button after 0.5 seconds
                        setTimeout(function() {
                            $('.modal__box__delete-confirm').prop(
                                'disabled',
                                false
                            );
                        }, 500);

                        // Push the current Event to the end of the list
                        eventList.push(eventID);
                    } else {
                        //
                        // AJAX ERROR
                        //
                        returnObject = {
                            error: true,
                        };
                    }
                }
            };

            request.send();
            request = null;

            // Show the Delete Modal
            $modalDelete.addClass('active');
        }, // end showDeleteModal
        ////
        /// Hide the Delete Modal
        /// @return undefined
        ////
        hideDeleteModal = function() {
            // Show the Delete Modal
            $modalDelete.removeClass('active');
        }, // end hideDeleteModal
        ////
        /// Fix Day Selects
        /// @return undefined
        ////
        fixDaySelects = function() {
            fixEndDay();

            var startSelect = document.getElementById('modal__box__start-day');
            startSelect.addEventListener('change', function() {
                fixEndDay();
            });
        }, // end fixDaySelects
        ////
        /// Fix End Day
        /// @return undefined
        ////
        fixEndDay = function() {
            var startSelectDay, endSelectDay, selectRange;

            startSelectDay = $('#modal__box__start-day').val();
            endSelectDay = $('#modal__box__end-day').val();
            selectRange = $('#modal__box__start-day option').length;

            if (parseInt(endSelectDay, 10) < parseInt(startSelectDay, 10)) {
                $('#modal__box__end-day option')
                    .filter(function() {
                        return $(this).text() == startSelectDay;
                    })
                    .prop('selected', true);
            }

            $('#modal__box__end-day option').prop('disabled', false);

            for (var i = 1; i <= selectRange; i++) {
                if (i < parseInt(startSelectDay, 10)) {
                    $('#modal__box__end-day option:nth-child(' + i + ')').prop(
                        'disabled',
                        true
                    );
                }
            }
        }, // end fixEndDay
        ////
        /// Fix Hour Selects
        /// @return undefined
        ////
        fixHourSelects = function() {
            fixEndHour();

            var startSelect = document.getElementById('modal__box__start-hour');
            startSelect.addEventListener('change', function() {
                fixEndHour();
            });
        }, // end fixHourSelects
        ////
        /// Fix End Hour
        /// @return undefined
        ////
        fixEndHour = function() {
            var startSelectHour, endSelectHour, selectRange;

            startSelectHour = $('#modal__box__start-hour').val();
            endSelectHour = $('#modal__box__end-hour').val();
            selectRange = $('#modal__box__start-hour option').length;

            // if End Hour is later than Start Hour, then set End Hour to Start
            // Hour, unless End Hour is `00` (denoting ending at midnight)
            if (
                parseInt(endSelectHour, 10) < parseInt(startSelectHour, 10) &&
                parseInt(endSelectHour, 10) != 0
            ) {
                $('#modal__box__end-hour option')
                    .filter(function() {
                        return $(this).text() == startSelectHour;
                    })
                    .prop('selected', true);
            }

            $('#modal__box__end-hour option').prop('disabled', false);

            for (var i = 2; i <= selectRange; i++) {
                if (i <= parseInt(startSelectHour, 10)) {
                    $('#modal__box__end-hour option:nth-child(' + i + ')').prop(
                        'disabled',
                        true
                    );
                }
            }
        }, // end fixEndHour
        ////
        /// Make an AJAX request to an API page with a simple list of Days for a given
        /// month for which there ARE Events
        /// Once that data is received, pass it to parseData()
        ////
        getModalData = function(currentEvent) {
            processData(currentEvent);

            /*
            // requestURL will eventually be a call to an API page with the the
            // SQ_CALENDAR_DATE GET attribute as one of the parameters passed to
            // this API page. This request will ultimately return the number of
            // Days in this Month (as dictated by SQ_CALENDAR_DATE).
            var request      = new XMLHttpRequest(),
                requestURL   = "//www.city.ac.uk/api/library-opening-times/unavailable-days?root=" + currentLibrary + "&SQ_CALENDAR_DATE=" + globalCurrentDate,
                returnObject = {},
                data;

            // Get the fresh data as JSON
            request.open("GET", requestURL, true);

            request.onreadystatechange = function () {

                if (this.readyState === 4) {
                    if (this.status >= 200 && this.status < 400) {

                        //
                        // AJAX SUCCESS
                        //
                        data = JSON.parse(this.responseText);



                    } else {

                        //
                        // AJAX ERROR
                        //
                        returnObject = {
                            "error": true
                        };

                    }
                }

            };

            request.send();
            request = null;
            */
        }, // end getAvailableDays
        // clear the data for the modal and leave to empty state
        clearModalData = function(clickedDay, modification, modParentId) {
            var emptyData = {
                    startDay: clickedDay,
                    endDay: '',
                    startHour: '',
                    startMonth: globalCurrentMonth,
                    startYear: globalCurrentYear,
                    startMinute: '',
                    duration: '',
                    endDay: '',
                    endHour: '',
                    endMinute: '',
                    frequency: '',
                    frequencyIcal: '',
                    label: '',
                    modification: modification,
                    specialTime: '',
                    weekdays: false,
                    weekends: false,
                    legendText: 'You are creating a new Event.',
                    eventType: 'new',
                    deleteButton: false,
                    eventTypeToCreate:
                        modification === true
                            ? 'calendar_event_modification'
                            : 'calendar_event_recurring',
                    parentModificationId:
                        modification === true ? modParentId : '',
                },
                template = populateTemplate(
                    $eventTemplate.html(),
                    emptyData,
                    emptyData.parentModificationId
                );

            injectTemplate(template);
        },
        ////
        /// Process the data that came from getAvailableDays and build an array
        /// of Days on which new Events are available to be created
        /// This is to be used in conjunction with the new Event Modal, in order
        /// to check on which days of the given month the user is able to create
        /// new Events, and to feed into further JavaScript logic to pre-catch
        /// any errors in creating these new (single-day or ranged) Events that
        /// would prevent Matrix from properly creating the Event Asset and
        /// parsing it to create the desired schedule.
        /// @return undefined
        ////
        processData = function(currentEvent) {
            var //getDate = globalCurrentDate,
                //getYear,
                //getMonth,
                //daysInMonth,
                //unavailableDays,
                //availableDays,
                template;

            /*
            // Split getDate into necessary pieces
            getDate = getDate.split("-");
            getYear  = getDate[0];
            getMonth = getDate[1];

            // Get number of Days for this given year, month combination. This
            // used to calculate the *available* Days by diffing this number
            // against *unavailable* Days
            daysInMonth = getDaysInMonth(getYear, getMonth);

            // Grab the array of *unavailable* Days
            unavailableDays = daysData.unavailableDays;

            // And build an array of *available* Days
            availableDays = [];
            for(var i = 1; i <= daysInMonth; i++) {
                if (unavailableDays.indexOf(i.toString()) < 0) {
                    availableDays.push(i);
                }
            }
            */

            // Populate the Template for the Modal and inject our appropriate
            // information
            template = '';

            template += populateTemplate(
                $eventTemplate.html(),
                libraryData[currentEvent],
                currentEvent
            );

            // Then inject our populated Template into the DOM
            injectTemplate(template);
        }, // end processData
        ////
        /// Add results content to item template
        /// @param {String} html
        /// @param {object} item
        /// @return {String} Populated HTML
        ////
        populateTemplate = function(html, data, currentEventID) {
            var optionStartDays = '',
                optionStartHours = '',
                optionStartMinutes = '',
                optionEndDays = '',
                optionEndHours = '',
                optionEndMinutes = '',
                optionSpecials = '',
                optionLabels = '',
                optionRecurrence = '',
                legendText = '',
                eventType = '',
                deleteButton = '',
                ourEvent = '',
                isModification = data.modification,
                arrayMonths = [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December',
                ],
                arrayDays = [
                    '01',
                    '02',
                    '03',
                    '04',
                    '05',
                    '06',
                    '07',
                    '08',
                    '09',
                    '10',
                    '11',
                    '12',
                    '13',
                    '14',
                    '15',
                    '16',
                    '17',
                    '18',
                    '19',
                    '20',
                    '21',
                    '22',
                    '23',
                    '24',
                    '25',
                    '26',
                    '27',
                    '28',
                    '29',
                    '30',
                    '31',
                ],
                arrayHours = [
                    '00',
                    '01',
                    '02',
                    '03',
                    '04',
                    '05',
                    '06',
                    '07',
                    '08',
                    '09',
                    '10',
                    '11',
                    '12',
                    '13',
                    '14',
                    '15',
                    '16',
                    '17',
                    '18',
                    '19',
                    '20',
                    '21',
                    '22',
                    '23',
                ],
                arrayMinutes = [
                    '00',
                    '01',
                    '02',
                    '03',
                    '04',
                    '05',
                    '06',
                    '07',
                    '08',
                    '09',
                    '10',
                    '11',
                    '12',
                    '13',
                    '14',
                    '15',
                    '16',
                    '17',
                    '18',
                    '19',
                    '20',
                    '21',
                    '22',
                    '23',
                    '24',
                    '25',
                    '26',
                    '27',
                    '28',
                    '29',
                    '30',
                    '31',
                    '32',
                    '33',
                    '34',
                    '35',
                    '36',
                    '37',
                    '38',
                    '39',
                    '40',
                    '41',
                    '42',
                    '43',
                    '44',
                    '45',
                    '46',
                    '47',
                    '48',
                    '49',
                    '50',
                    '51',
                    '52',
                    '53',
                    '54',
                    '55',
                    '56',
                    '57',
                    '58',
                    '59',
                ],
                arraySpecials = {
                    '': 'None',
                    closed: 'Closed',
                    open24hours: 'Open 24 Hours',
                },
                arrayLabels = {
                    '': 'None',
                    'bank-holiday': 'Bank Holiday',
                    'christmas-holiday': 'Christmas Holiday',
                    'easter-holiday': 'Easter Holiday',
                    'exam-period': 'Exam Period',
                },
                recurrence = {
                    'Every day': 'Every Day', //DED
                    'Every week': 'Once a Week', //WEW
                    'Every weekday': 'Every Weekday', //DWD
                    'Every weekend day': 'Every Weekend', //DWE
                },
                daysInMonth = getDaysInMonth(data.startYear, data.startMonth),
                currentMonth =
                    arrayMonths[parseInt(globalCurrentDate.split('-')[1]) - 1],
                currentYear = globalCurrentDate.split('-')[0];

            // Process Days
            for (var i = 0; i < daysInMonth; i++) {
                if (arrayDays[i] === data.startDay) {
                    optionStartDays +=
                        '<option selected>' + arrayDays[i] + '</option>';
                } else {
                    optionStartDays += '<option>' + arrayDays[i] + '</option>';
                }
                if (arrayDays[i] === data.endDay) {
                    optionEndDays +=
                        '<option selected>' + arrayDays[i] + '</option>';
                } else {
                    optionEndDays += '<option>' + arrayDays[i] + '</option>';
                }
            }

            // Process Hours
            for (var i = 0; i < arrayHours.length; i++) {
                if (arrayHours[i] === data.startHour) {
                    optionStartHours +=
                        '<option selected>' + arrayHours[i] + '</option>';
                } else {
                    optionStartHours +=
                        '<option>' + arrayHours[i] + '</option>';
                }
                if (arrayHours[i] === data.endHour) {
                    optionEndHours +=
                        '<option selected>' + arrayHours[i] + '</option>';
                } else {
                    optionEndHours += '<option>' + arrayHours[i] + '</option>';
                }
            }

            // Process Minutes
            for (var i = 0; i < arrayMinutes.length; i++) {
                if (arrayMinutes[i] === data.startMinute) {
                    optionStartMinutes +=
                        '<option selected>' + arrayMinutes[i] + '</option>';
                } else {
                    optionStartMinutes +=
                        '<option>' + arrayMinutes[i] + '</option>';
                }
                if (arrayMinutes[i] === data.endMinute) {
                    optionEndMinutes +=
                        '<option selected>' + arrayMinutes[i] + '</option>';
                } else {
                    optionEndMinutes +=
                        '<option>' + arrayMinutes[i] + '</option>';
                }
            }

            // Process Specials
            for (var key in arraySpecials) {
                if (arraySpecials.hasOwnProperty(key)) {
                    if (key === data.specialTime) {
                        optionSpecials +=
                            '<option value="' +
                            key +
                            '" selected>' +
                            arraySpecials[key] +
                            '</option>';
                    } else {
                        optionSpecials +=
                            '<option value="' +
                            key +
                            '">' +
                            arraySpecials[key] +
                            '</option>';
                    }
                }
            }

            // Process Labels
            for (var key in arrayLabels) {
                if (arrayLabels.hasOwnProperty(key)) {
                    if (key === data.label) {
                        optionLabels +=
                            '<option value="' +
                            key +
                            '" selected>' +
                            arrayLabels[key] +
                            '</option>';
                    } else {
                        optionLabels +=
                            '<option value="' +
                            key +
                            '">' +
                            arrayLabels[key] +
                            '</option>';
                    }
                }
            }

            // if modification or not, do various things
            if (isModification) {
                legendText = 'You are editing an exception.';
                eventType = 'exception';
                optionRecurrence +=
                    '<option value="never" selected>' + 'never' + '</option>';
            } else {
                for (var key in recurrence) {
                    if (recurrence.hasOwnProperty(key)) {
                        if (key === data.frequency) {
                            optionRecurrence +=
                                '<option value="' +
                                key +
                                '" selected>' +
                                recurrence[key] +
                                '</option>';
                        } else {
                            optionRecurrence +=
                                '<option value="' +
                                key +
                                '">' +
                                recurrence[key] +
                                '</option>';
                        }
                    }
                }
                legendText =
                    data.legendText || 'You are editing an existing event.';
                eventType = data.eventType || 'existing';
                html = injectContent(html, optionEndDays, '@@END_DAY@@');
            }

            if (data.deleteButton) {
                deleteButton =
                    '<button class="modal__box__delete"><i class="fa  fa-times"></i>Delete Event</button>';
            }

            if (currentEventID === '') {
                ourEvent = '';
            } else {
                ourEvent = currentEventID;
            }

            html = injectContent(
                html,
                data.eventTypeToCreate,
                '@@ASSET_TYPE@@'
            );

            html = injectContent(html, eventType, '@@EVENTTYPE@@');
            html = injectContent(html, legendText, '@@LEGEND@@');

            html = injectContent(html, optionStartDays, '@@START_DAY@@');
            html = injectContent(
                html,
                currentMonth + ' ' + currentYear,
                '@@MONTH_YEAR@@'
            );
            html = injectContent(html, currentYear, '@@YEAR@@');
            html = injectContent(html, currentMonth, '@@MONTH@@');

            html = injectContent(html, optionStartHours, '@@START_HOUR@@');
            html = injectContent(html, optionStartMinutes, '@@START_MINUTE@@');

            html = injectContent(html, optionEndHours, '@@END_HOUR@@');
            html = injectContent(html, optionEndMinutes, '@@END_MINUTE@@');

            html = injectContent(html, optionRecurrence, '@@RECURRENCE@@');

            html = injectContent(html, deleteButton, '@@DELETE_BUTTON@@');

            html = injectContent(html, ourEvent, '@@EVENT_ID@@');

            html = injectContent(html, optionSpecials, '@@SPECIAL@@');

            html = injectContent(html, optionLabels, '@@LABEL@@');

            return html;
        }, // end populateTemplate
        ////
        /// Injects content into template using placeholder
        /// @param {String} originalContent
        /// @param {String} injection
        /// @param {String} placeholder
        /// @return {String} injected content
        ////
        injectContent = function(originalContent, injection, placeholder) {
            var regex = new RegExp(placeholder, 'g');
            return originalContent.replace(regex, injection);
        }, // end injectContent
        ////
        /// Inject Template into DOM
        /// @param {String} template
        /// @return undefined
        ////
        injectTemplate = function(template) {
            $modalBox.html(template);

            // Initialise Fixer Functions
            fixDaySelects();
            fixHourSelects();
            checkSpecial();
        }, // end injectTemplate
        ////
        /// Simple function to return the number of days in a given month, year
        ////
        getDaysInMonth = function(year, month) {
            var date = new Date(year, month - 1, 1),
                result = [];

            while (date.getMonth() === month - 1) {
                result.push(date.getDate());
                date.setDate(date.getDate() + 1);
            }

            return result.length;
        }, // end getDaysInMonth
        // used when submit button is clicked, grab the data from the DOM and pass to matrix to do whatever
        setMetadata = function() {
            var eventData = {
                    assetid: $('.modal__box__event-id').val(),
                    startDay: $('.modal__box__start-day').val(),
                    endDay: $('.modal__box__end-day').val(),
                    startHours: $('.modal__box__start-hour').val(),
                    startMinutes: $('.modal__box__start-minute').val(),
                    endHours: $('.modal__box__end-hour').val(),
                    endMinutes: $('.modal__box__end-minute').val(),
                    specialOpen: $('.modal__box__special').val(),
                    specialPeriod: $('.modal__box__label').val(),
                    frequency: $('.modal__box__recurrence').val(),
                    assetType: $('.modal__box__event-asset-type').val(),
                },
                assetName,
                extraAttr;

            if (eventData.assetType === 'undefined') {
                // change existing event
                setMetadataAttribute(eventData, undefined);
            } else {
                // new event
                // assetName = YYYY MMM DD - DD (FREQUENCY)
                assetName =
                    $('.modal__box__year').val() +
                    ' ' +
                    $('.modal__box__month').val() +
                    ' ' +
                    eventData.startDay;
                if (eventData.endDay !== eventData.startDay) {
                    assetName += ' - ' + eventData.endDay;
                    if (eventData.frequency === 'Every week') {
                        assetName += ' (weekly)';
                    } else if (eventData.frequency === 'Every weekday') {
                        assetName += ' (weekdays)';
                    } else if (eventData.frequency === 'Every weekend') {
                        assetName += ' (weekends)';
                    }
                }

                extraAttr =
                    'frequency=' + recurrenceEquivalence[eventData.frequency];
                extraAttr +=
                    '&stop_date=' +
                    globalCurrentYear +
                    '-' +
                    globalCurrentMonth +
                    '-' +
                    eventData.endDay;
                extraAttr +=
                    '&start_date=' +
                    globalCurrentYear +
                    '-' +
                    globalCurrentMonth +
                    '-' +
                    eventData.startDay;

                // create new event
                jsApi.createAsset({
                    parent_id:
                        eventData.assetType === 'calendar_event_recurring'
                            ? parseInt(currentLibrary)
                            : parseInt(eventData.assetid),
                    type_code: eventData.assetType,
                    asset_name: assetName,
                    link_type: 1,
                    link_value: '',
                    sort_order: 1,
                    is_dependant: 0,
                    is_exclusive: 0,
                    extra_attributes: 1,
                    attributes: extraAttr,
                    dataCallback: function(callBackData) {
                        setMetadataAttribute(eventData, callBackData.id);
                    },
                });
            }
        },
        // sends the actual data to matrix
        setMetadataAttribute = function(data, newAssetID) {
            var workableEventId = newAssetID || data.assetid;
            //
            // Set the attributes for the asset
            //
            jsApi.setMultipleAttributes({
                asset_id: workableEventId,
                field_info: {
                    start_date:
                        globalCurrentYear +
                        '-' +
                        globalCurrentMonth +
                        '-' +
                        data.startDay,
                    stop_date:
                        globalCurrentYear +
                        '-' +
                        globalCurrentMonth +
                        '-' +
                        data.endDay,
                    frequency: recurrenceEquivalence[data.frequency],
                },
                dataCallback: function() {
                    // set the metadata fields for the asset, onceattributes have been set
                    jsApi.setMetadataAllFields({
                        asset_id: workableEventId,
                        field_info: {
                            '469909':
                                globalCurrentYear +
                                '-' +
                                globalCurrentMonth +
                                '-' +
                                data.startDay +
                                ' ' +
                                data.startHours +
                                ':' +
                                data.startMinutes +
                                ':00',
                            '469915':
                                globalCurrentYear +
                                '-' +
                                globalCurrentMonth +
                                '-' +
                                (data.endDay === null
                                    ? data.startDay
                                    : data.endDay) +
                                ' ' +
                                data.endHours +
                                ':' +
                                data.endMinutes +
                                ':00',
                            '469908': data.specialOpen,
                            '469913': data.specialPeriod,
                            '469914':
                                data.endDay === null ||
                                data.startDay === data.endDay
                                    ? true
                                    : false,
                        },
                        dataCallback: function(setMtdCallbackdata) {
                            //console.log(setMtdCallbackdata);

                            // reload page so we don't have to rearrange the DOM and all with the new data
                            // let Matrix do that on page reload
                            jsApi.setAssetStatus({
                                asset_id: workableEventId,
                                status: 16,
                                cascade: 0,
                                dataCallback: function() {
                                    noCacheReload();
                                },
                            });
                        },
                    }); // end setMetadataAllFields
                },
            });
        }, // end setMultipleAttributes
        ////
        /// Process Delete Exception
        /// @return undefined
        ////
        processDeleteExceptions = function(data) {
            var exceptionsList = $('.modal__box--delete__exceptions__list'),
                exception;

            // Create Array of exceptions to confirm deletion
            for (var i = 1; i <= Object.keys(data.children).length; i++) {
                exception = data.children[i];
                exceptionsList.append(
                    '<li data-id="' +
                        exception.id +
                        '">' +
                        exception.startDay +
                        ' ' +
                        exception.times +
                        '</li>'
                );

                eventList.push(exception.id);
            }

            $('.modal__box--delete__exceptions').css('display', 'block');
        }, // end processDeleteExceptions
        ////
        /// "Delete" an Event
        /// Sets an Event to Under Construction
        /// @return undefined
        ////
        deleteEvent = function(eventID) {
            // Trash the Asset and its children
            jsApi.setAssetStatus({
                asset_id: eventID,
                status: 2,
                cascade: 1,
                dataCallback: function() {
                    jsApi.trashAsset({
                        asset_ids: [eventID],
                        dataCallback: function() {
                            noCacheReload();
                        },
                    });
                },
            });
        }, // end deleteEvent
        init = function() {
            formatCalendar();
            parseCalendar();
            initModals();
        }, // end init
        returnObj = {
            init: init,
        };

    //end original var

    //public from here
    return returnObj;
})(jQuery);

//call init fn
libraryAdmin.init();
