/*global window, CITY, jQuery */

//var options = new Array();
//options['key'] = '1319678258';
//var js_api = new Squiz_Matrix_API(options);

/*
 * module pattern
 *
 *
 */
var libraryAdmin = (function($) {
    'use strict';
    var //private attributes
        jsApi, // placeholder for Matrix JS API
        jsOptions = [], // placeholder for API config
        $addException = $('.add-exception'),
        $startDates = $('.start-full-date'),
        $openStatus = $('.open-status'),
        $libraryId = $('#notice-text').attr('data-libraryid'),
        extraAttributes,
        newLi,
        newStartDate,
        newFullDate,
        newEndDate,
        //private methods
        /**
         *  set the current library's metadata 'notice message' field to the user textarea input. Used for special message on opening hours
         * @return {?} ?
         *
         */
        setNoticeMessage = function() {
            var $noticeMessage = $('#notice-text textarea'),
                $noticeTextActionButton = $('#notice-text .action-button');

            $noticeTextActionButton.hide();
            $noticeMessage.after(
                '<img class="ajax-loader-notice" src="https://libraryservices.city.ac.uk/__data/assets/git_bridge/0004/841405/main/i/ajax-loader-small-red.gif">'
            );
            jsApi.setMetadataAllFields({
                asset_id: $libraryId,
                field_info: {
                    126957: $noticeMessage.val(),
                },
                dataCallback: function() {
                    $('#notice-text .ajax-loader-notice').remove();
                    $noticeTextActionButton.show();
                },
            });
        },
        /**
         * init fn
         * @return {?} ?
         *
         */
        init = function() {
            // set up JS API
            jsOptions.key = '1319678258';
            jsApi = new Squiz_Matrix_API(jsOptions);

            $addException.click(function() {
                var addExceptionButton = $(this);

                addExceptionButton
                    .siblings('.open-date')
                    .toggleClass('exception-container');
                addExceptionButton
                    .siblings('.closed-date')
                    .toggleClass('exception-container');
                addExceptionButton.toggleClass('add-exception-show');
            });

            //toggle hide/show commands when using the open/close/open 24h dropdown
            $openStatus.change(function() {
                var clickedEl = $(this),
                    clickedElParentContainer = clickedEl.parent(
                        '.recurring-container'
                    ),
                    currentDayItem = clickedEl.parents(
                        '.edit-opening-times-item'
                    );

                if (clickedEl.val() === 'open') {
                    currentDayItem.children('.closed-date').addClass('hide');
                    currentDayItem.children('.open-date').removeClass('hide');
                    clickedElParentContainer
                        .removeClass('recurring-closed')
                        .addClass('recurring-open');
                    clickedElParentContainer
                        .children('.day-details')
                        .removeClass('hide');
                } else if (clickedEl.val() === 'twentyfour') {
                    currentDayItem.children('.closed-date').addClass('hide');
                    currentDayItem.children('.open-date').removeClass('hide');
                    clickedElParentContainer
                        .removeClass('recurring-closed')
                        .addClass('recurring-open');
                    clickedElParentContainer
                        .children('.day-details')
                        .addClass('hide');
                } else {
                    currentDayItem.children('.closed-date').removeClass('hide');
                    currentDayItem.children('.open-date').addClass('hide');
                    clickedElParentContainer
                        .removeClass('recurring-open')
                        .addClass('recurring-closed');
                    clickedElParentContainer
                        .children('.day-details')
                        .addClass('hide');
                }
            });

            //update the opeing hours for the individual days (open/closed/open 24h)
            $('.recurring-container .action-button').click(function() {
                var assetsToDelete = [],
                    open24Hours,
                    newStartDateOpen,
                    newEndDateOpen,
                    changedOpeningTimesDetails,
                    $actionButton = $(this),
                    $editOpeningTimesItem = $actionButton.parents(
                        '.edit-opening-times-item'
                    ),
                    $recurringContainer = $editOpeningTimesItem.children(
                        '.recurring-container'
                    ),
                    $openStatusSelect = $recurringContainer.find(
                        '.open-status'
                    ),
                    eventCalendartoEdit = $recurringContainer.attr('id');

                $actionButton.fadeOut('slow');
                $editOpeningTimesItem.find('.ajax-loader').fadeIn('slow');
                $recurringContainer.siblings('.admin-error').remove();

                if ($openStatusSelect.val() === 'close') {
                    //find all exceptions for case when library is opened and remove them
                    $editOpeningTimesItem
                        .find('.open-exceptions li')
                        .each(function(i) {
                            assetsToDelete[i] = $(this).attr('id');
                        });
                    jsApi.trashAsset({
                        asset_ids: assetsToDelete,
                        dataCallback: function() {
                            //set event calendar to under construction as library is closed
                            jsApi.setAssetStatus({
                                asset_id: eventCalendartoEdit,
                                status: 2,
                                cascade: 0,
                                dataCallback: function(data) {
                                    if (data.error) {
                                        $recurringContainer
                                            .after(
                                                "<p class='admin-error'>There was an error changing the status of the library to 'closed' for this day. Please try again.</p>"
                                            )
                                            .hide()
                                            .show('slow');
                                    }
                                    $editOpeningTimesItem
                                        .find('.ajax-loader')
                                        .fadeOut('slow');
                                    $actionButton.fadeIn('slow');
                                },
                            });
                        },
                    });
                } else {
                    changedOpeningTimesDetails = $editOpeningTimesItem.find(
                        '.year, .month, .day, .day-details .open-start-hours, .day-details .open-start-minutes, .day-details .open-end-hours, .day-details .open-end-minutes'
                    );
                    newStartDateOpen =
                        changedOpeningTimesDetails[0].textContent +
                        '-' +
                        changedOpeningTimesDetails[1].textContent +
                        '-' +
                        changedOpeningTimesDetails[2].textContent +
                        ' ' +
                        changedOpeningTimesDetails[3].value +
                        ':' +
                        changedOpeningTimesDetails[4].value +
                        ':' +
                        '00';
                    newEndDateOpen =
                        changedOpeningTimesDetails[0].textContent +
                        '-' +
                        changedOpeningTimesDetails[1].textContent +
                        '-' +
                        changedOpeningTimesDetails[2].textContent +
                        ' ' +
                        changedOpeningTimesDetails[5].value +
                        ':' +
                        changedOpeningTimesDetails[6].value +
                        ':' +
                        '00';

                    //set flag to indicate if the library is opened 24h
                    if ($openStatusSelect.val() === 'twentyfour') {
                        open24Hours = 'yes';
                    } else {
                        open24Hours = 'no';
                    }

                    //Set the main library opening hours: the libray is generally opened, so update the recurring event calendar's times and make sure it is live.
                    jsApi.setMetadataAllFields({
                        asset_id: eventCalendartoEdit,
                        field_info: {
                            469909: newStartDateOpen,
                            469915: newEndDateOpen,
                            469908: open24Hours,
                        },
                        dataCallback: function(data) {
                            if (!data.success) {
                                $recurringContainer
                                    .after(
                                        "<p class='admin-error'>There was an error updating the times for this day. Please try again.</p>"
                                    )
                                    .hide()
                                    .show('slow');
                            }
                            //set event calendar to live as library is opened
                            jsApi.setAssetStatus({
                                asset_id: eventCalendartoEdit,
                                status: 16,
                                cascade: 0,
                                dataCallback: function() {
                                    //find all exceptions for the case when library is closed and remove them
                                    $editOpeningTimesItem
                                        .find('.closed-exceptions li')
                                        .each(function(i) {
                                            assetsToDelete[i] = $(this).attr(
                                                'id'
                                            );
                                        });
                                    jsApi.trashAsset({
                                        asset_ids: assetsToDelete,
                                        dataCallback: function() {
                                            $editOpeningTimesItem
                                                .find('.ajax-loader')
                                                .fadeOut('slow');
                                            $actionButton.fadeIn('slow');
                                        },
                                    });
                                },
                            });
                        },
                    });
                }
            });

            //library is opened, change opening hours for a specific date
            $('.change-exception').click(function() {
                var addExceptionButton = $(this),
                    $clickedOpen = addExceptionButton.parent(
                        '.open-change-exception'
                    ),
                    $editOpeningTimesItem = addExceptionButton.parents(
                        '.edit-opening-times-item'
                    ),
                    $openDate = $clickedOpen.find(
                        '.start-full-date, .start-hours, .start-minutes, .end-hours, .end-minutes'
                    ),
                    $dayOfTheWeek = $clickedOpen
                        .parent('.open-date')
                        .siblings('.recurring-open')
                        .children('.week-day')
                        .text(),
                    is24Hours = $clickedOpen
                        .children('.24h-selector')
                        .is(':checked'),
                    newFullDate,
                    newEndDate,
                    set24hFlag;

                addExceptionButton.fadeOut('slow');
                $editOpeningTimesItem.find('.ajax-loader').fadeIn('slow');
                $editOpeningTimesItem.find('.admin-error').remove();

                //recurring times should change on this date, add a recurring calendar modification asset
                if (is24Hours === true) {
                    set24hFlag = 'yes';
                } else {
                    set24hFlag = 'no';
                }

                newFullDate =
                    $($openDate[0])
                        .val()
                        .split('-')[2] +
                    '-' +
                    $($openDate[0])
                        .val()
                        .split('-')[1] +
                    '-' +
                    $($openDate[0])
                        .val()
                        .split('-')[0];
                newStartDate =
                    newFullDate +
                    ' ' +
                    $($openDate[1]).val() +
                    ':' +
                    $($openDate[2]).val() +
                    ':' +
                    '00';
                newEndDate =
                    newFullDate +
                    ' ' +
                    $($openDate[3]).val() +
                    ':' +
                    $($openDate[4]).val() +
                    ':' +
                    '00';
                extraAttributes = 'start_date=' + newFullDate;

                jsApi.createAsset({
                    parent_id: $clickedOpen
                        .parents('.edit-opening-times-item')
                        .find('.recurring-container')
                        .attr('id'),
                    type_code: 'calendar_event_modification',
                    asset_name: $dayOfTheWeek,
                    link_type: 1,
                    link_value: '',
                    sort_order: 1,
                    is_dependant: 0,
                    is_exclusive: 0,
                    extra_attributes: 1,
                    attributes: extraAttributes,
                    dataCallback: function(data) {
                        if (!data.error) {
                            jsApi.setMetadataAllFields({
                                asset_id: data.id,
                                field_info: {
                                    469909: newStartDate,
                                    469915: newEndDate,
                                    469908: set24hFlag,
                                },
                                dataCallback: function(data2) {
                                    if (data2.success) {
                                        jsApi.setAssetStatus({
                                            asset_id: data.id,
                                            status: 16,
                                            cascade: 0,
                                            dataCallback: function(data3) {
                                                if (!data3.error) {
                                                    if (is24Hours === false) {
                                                        newLi =
                                                            '<li id="' +
                                                            data.id +
                                                            '" class="exception-item"><span class="event-container add-event">' +
                                                            'Opened on ' +
                                                            $dayOfTheWeek.substring(
                                                                0,
                                                                $dayOfTheWeek.length -
                                                                    1
                                                            ) +
                                                            ' <span class="open-full-day">' +
                                                            $(
                                                                $openDate[0]
                                                            ).val() +
                                                            '</span><span class="extra-content"> from </span><span class="open-start">' +
                                                            $(
                                                                $openDate[1]
                                                            ).val() +
                                                            ':' +
                                                            $(
                                                                $openDate[2]
                                                            ).val() +
                                                            '</span><span class="extra-content"> to </span><span class="open-end">' +
                                                            $(
                                                                $openDate[3]
                                                            ).val() +
                                                            ':' +
                                                            $(
                                                                $openDate[4]
                                                            ).val() +
                                                            '</span></span><span class="remove-date"> remove</span></li>';
                                                    } else {
                                                        newLi =
                                                            '<li id="' +
                                                            data.id +
                                                            '" class="exception-item"><span class="event-container add-event">' +
                                                            'Opened on ' +
                                                            $dayOfTheWeek.substring(
                                                                0,
                                                                $dayOfTheWeek.length -
                                                                    1
                                                            ) +
                                                            ' <span class="open-full-day">' +
                                                            $(
                                                                $openDate[0]
                                                            ).val() +
                                                            '</span><span class="extra-content"> for 24 hours</span><span class="remove-date"> remove</span></li>';
                                                    }
                                                    $clickedOpen
                                                        .siblings(
                                                            '.open-exceptions'
                                                        )
                                                        .append(newLi)
                                                        .hide()
                                                        .fadeIn('slow');
                                                } else {
                                                    jsApi.trashAsset({
                                                        asset_ids: data.id,
                                                    });
                                                    $editOpeningTimesItem.append(
                                                        "<p class='admin-error'>There was an error creating this exception, please try again. <br />(note for developer: status change error, asset " +
                                                            data.id +
                                                            ' created and moved to trash)</p>'
                                                    );
                                                }
                                                $clickedOpen
                                                    .children(
                                                        '.start-full-date'
                                                    )
                                                    .val('dd-mm-yyyy');
                                                $editOpeningTimesItem
                                                    .find('.ajax-loader')
                                                    .fadeOut('slow');
                                                addExceptionButton.fadeIn(
                                                    'slow'
                                                );
                                            },
                                        });
                                    } else {
                                        jsApi.trashAsset({
                                            asset_ids: data.id,
                                        });
                                        $editOpeningTimesItem.append(
                                            "<p class='admin-error'>There was an error creating this exception, please try again. <br />(note for developer: metadata set error, asset " +
                                                data.id +
                                                ' created and moved to trash)</p>'
                                        );
                                        $clickedOpen
                                            .children('.start-full-date')
                                            .val('dd-mm-yyyy');
                                        $editOpeningTimesItem
                                            .find('.ajax-loader')
                                            .fadeOut('slow');
                                        addExceptionButton.fadeIn('slow');
                                    }
                                },
                            });
                        } else {
                            $editOpeningTimesItem.append(
                                "<p class='admin-error'>There was an error creating this exception. Please try again.</p>"
                            );
                            $clickedOpen
                                .children('.start-full-date')
                                .val('dd-mm-yyyy');
                            $editOpeningTimesItem
                                .find('.ajax-loader')
                                .fadeOut('slow');
                            addExceptionButton.fadeIn('slow');
                        }
                    },
                });
            });

            // library is opened, close it on a specific date
            $('.close-exception').click(function() {
                var addExceptionButton = $(this),
                    $clickedOpen = addExceptionButton.parent(
                        '.open-del-exception'
                    ),
                    $openDate = $clickedOpen.find('.start-full-date'),
                    $editOpeningTimesItem = addExceptionButton.parents(
                        '.edit-opening-times-item'
                    ),
                    $dayOfTheWeek = $clickedOpen
                        .parent('.open-date')
                        .siblings('.recurring-open')
                        .children('.week-day')
                        .text();

                addExceptionButton.fadeOut('slow');
                $editOpeningTimesItem.find('.ajax-loader').fadeIn('slow');
                $editOpeningTimesItem.find('.admin-error').remove();

                //if library should be closed on this date, add a recurring calendar cancellation asset
                newStartDate =
                    $openDate.val().split('-')[2] +
                    '-' +
                    $openDate.val().split('-')[1] +
                    '-' +
                    $openDate.val().split('-')[0];
                extraAttributes = 'start_date=' + newStartDate;
                jsApi.createAsset({
                    parent_id: $clickedOpen
                        .parents('.edit-opening-times-item')
                        .find('.recurring-container')
                        .attr('id'),
                    type_code: 'calendar_event_cancellation',
                    asset_name: $dayOfTheWeek,
                    link_type: 1,
                    link_value: '',
                    sort_order: 1,
                    is_dependant: 0,
                    is_exclusive: 0,
                    extra_attributes: 1,
                    attributes: extraAttributes,
                    dataCallback: function(data) {
                        if (!data.error) {
                            jsApi.setAssetStatus({
                                asset_id: data.id,
                                status: 16,
                                cascade: 0,
                                dataCallback: function(data2) {
                                    if (!data2.error) {
                                        newLi =
                                            '<li id="' +
                                            data.id +
                                            '" class="exception-item"><span class="event-container add-event">' +
                                            'Closed on ' +
                                            $dayOfTheWeek.substring(
                                                0,
                                                $dayOfTheWeek.length - 1
                                            ) +
                                            ' <span class="open-full-day">' +
                                            newStartDate +
                                            '</span></span><span class="remove-date"> remove</span></li>';
                                        $clickedOpen
                                            .siblings('.open-exceptions')
                                            .append(newLi)
                                            .hide()
                                            .fadeIn('slow');
                                    } else {
                                        jsApi.trashAsset({
                                            asset_ids: data.id,
                                        });
                                        $editOpeningTimesItem.append(
                                            "<p class='admin-error'>There was an error creating this exception, please try again. <br />(note for developer: status change error, asset " +
                                                data.id +
                                                ' created and moved to trash)</p>'
                                        );
                                    }
                                    $clickedOpen
                                        .children('.start-full-date')
                                        .val('dd-mm-yyyy');
                                    $editOpeningTimesItem
                                        .find('.ajax-loader')
                                        .fadeOut('slow');
                                    addExceptionButton.fadeIn('slow');
                                },
                            });
                        } else {
                            $editOpeningTimesItem.append(
                                "<p class='admin-error'>There was an error creating this exception. Please try again.</p>"
                            );
                            $clickedOpen
                                .children('.start-full-date')
                                .val('dd-mm-yyyy');
                            $editOpeningTimesItem
                                .find('.ajax-loader')
                                .fadeOut('slow');
                            addExceptionButton.fadeIn('slow');
                        }
                    },
                });
            });

            // library is closed, open it with hours on a specific date
            $('.open-exception').click(function() {
                var addExceptionButton = $(this),
                    $editOpeningTimesItem = addExceptionButton.parents(
                        '.edit-opening-times-item'
                    ),
                    $clickedOpen = addExceptionButton.parent(
                        '.closed-create-exception'
                    ),
                    $openDate = $clickedOpen.find(
                        '.start-full-date, .start-hours, .start-minutes, .end-hours, .end-minutes'
                    ),
                    $dayOfTheWeek = $clickedOpen
                        .parent('.closed-date')
                        .siblings('.recurring-closed')
                        .children('.week-day')
                        .text();

                addExceptionButton.fadeOut('slow');
                $editOpeningTimesItem.find('.ajax-loader').fadeIn('slow');
                $editOpeningTimesItem.find('.admin-error').remove();

                //if exception is new and library should open on specific date, create a single calendar event
                newFullDate =
                    $($openDate[0])
                        .val()
                        .split('-')[2] +
                    '-' +
                    $($openDate[0])
                        .val()
                        .split('-')[1] +
                    '-' +
                    $($openDate[0])
                        .val()
                        .split('-')[0];
                newStartDate =
                    newFullDate +
                    ' ' +
                    $($openDate[1]).val() +
                    ':' +
                    $($openDate[2]).val() +
                    ':' +
                    '00';
                newEndDate =
                    newFullDate +
                    ' ' +
                    $($openDate[3]).val() +
                    ':' +
                    $($openDate[4]).val() +
                    ':' +
                    '00';
                extraAttributes =
                    'start_date=' + newStartDate + '&end_date=' + newEndDate;

                jsApi.createAsset({
                    parent_id: $clickedOpen
                        .parents('.edit-opening-times-item')
                        .find('.recurring-container')
                        .attr('id'),
                    type_code: 'calendar_event_single',
                    asset_name: $dayOfTheWeek,
                    link_type: 1,
                    link_value: '',
                    sort_order: 1,
                    is_dependant: 0,
                    is_exclusive: 0,
                    extra_attributes: 1,
                    attributes: extraAttributes,
                    dataCallback: function(data) {
                        if (!data.error) {
                            jsApi.setMetadataAllFields({
                                asset_id: data.id,
                                field_info: {
                                    469909: newStartDate,
                                    469915: newEndDate,
                                },
                                dataCallback: function(data2) {
                                    if (!data2.error) {
                                        jsApi.setAssetStatus({
                                            asset_id: data.id,
                                            status: 16,
                                            cascade: 0,
                                            dataCallback: function(data3) {
                                                if (!data3.error) {
                                                    newLi =
                                                        '<li id="' +
                                                        data.id +
                                                        '" class="exception-item"><span class="event-container add-event">' +
                                                        'Opened on ' +
                                                        $dayOfTheWeek.substring(
                                                            0,
                                                            $dayOfTheWeek.length -
                                                                1
                                                        ) +
                                                        ' <span class="open-full-day">' +
                                                        $($openDate[0]).val() +
                                                        '</span><span class="extra-content"> from </span><span class="open-start">' +
                                                        $($openDate[1]).val() +
                                                        ':' +
                                                        $($openDate[2]).val() +
                                                        '</span><span class="extra-content"> to </span><span class="open-end">' +
                                                        $($openDate[3]).val() +
                                                        ':' +
                                                        $($openDate[4]).val() +
                                                        '</span></span><span class="remove-date"> remove</span></li>';
                                                    $clickedOpen
                                                        .siblings(
                                                            '.closed-exceptions'
                                                        )
                                                        .append(newLi)
                                                        .hide()
                                                        .fadeIn('slow');
                                                } else {
                                                    jsApi.trashAsset({
                                                        asset_ids: data.id,
                                                    });
                                                    $editOpeningTimesItem.append(
                                                        "<p class='admin-error'>There was an error creating this exception, please try again. <br />(note for developer: status change error, asset " +
                                                            data.id +
                                                            ' created and moved to trash)</p>'
                                                    );
                                                }
                                                $clickedOpen
                                                    .children(
                                                        '.start-full-date'
                                                    )
                                                    .val('dd-mm-yyyy');
                                                $editOpeningTimesItem
                                                    .find('.ajax-loader')
                                                    .fadeOut('slow');
                                                addExceptionButton.fadeIn(
                                                    'slow'
                                                );
                                            },
                                        });
                                    } else {
                                        jsApi.trashAsset({
                                            asset_ids: data.id,
                                        });
                                        $editOpeningTimesItem.append(
                                            "<p class='admin-error'>There was an error creating this exception, please try again. <br />(note for developer: metadata set error, asset " +
                                                data.id +
                                                ' created and moved to trash)</p>'
                                        );
                                        $clickedOpen
                                            .children('.start-full-date')
                                            .val('dd-mm-yyyy');
                                        $editOpeningTimesItem
                                            .find('.ajax-loader')
                                            .fadeOut('slow');
                                        addExceptionButton.fadeIn('slow');
                                    }
                                },
                            });
                        } else {
                            $editOpeningTimesItem.append(
                                "<p class='admin-error'>There was an error creating this exception. Please try again.</p>"
                            );
                            $clickedOpen
                                .children('.start-full-date')
                                .val('dd-mm-yyyy');
                            $editOpeningTimesItem
                                .find('.ajax-loader')
                                .fadeOut('slow');
                            addExceptionButton.fadeIn('slow');
                        }
                    },
                });
            });

            //remove exceptions when using the remove link
            $('.remove-date').live('click', function() {
                var removeButton = $(this),
                    eventWrapper = removeButton.parents(
                        '.edit-opening-times-item'
                    ),
                    liWrapper = removeButton.parent('.exception-item');

                removeButton.fadeOut('slow');
                eventWrapper.find('.ajax-loader').fadeIn('slow');
                eventWrapper.find('.admin-error').remove();

                if (
                    liWrapper.attr('id') !== 'undefined' &&
                    liWrapper.attr('id') !== ''
                ) {
                    jsApi.trashAsset({
                        asset_ids: liWrapper.attr('id'),
                        dataCallback: function(data) {
                            if (data.error) {
                                eventWrapper.append(
                                    "<p class='admin-error'>There was an error removing this exception. Please try again.</p>"
                                );
                            }
                            liWrapper.fadeOut('slow').remove();
                            eventWrapper.find('.ajax-loader').fadeOut('slow');
                        },
                    });
                } else {
                    liWrapper.fadeOut('slow').remove();
                    eventWrapper.find('.ajax-loader').fadeOut('slow');
                }
            });

            // live events
            $startDates.datepicker({
                dateFormat: 'dd-mm-yy',
                beforeShowDay: function(date) {
                    var $self = $(this),
                        today = $self.parents('li').data('library-day'), //set the currentDay var to this day - will be overwritten on each loop
                        days = [
                            'Monday',
                            'Tuesday',
                            'Wednesday',
                            'Thursday',
                            'Friday',
                            'Saturday',
                            'Sunday',
                        ],
                        Sunday = 0,
                        Monday = 1,
                        Tuesday = 2,
                        Wednesday = 3,
                        Thursday = 4,
                        Friday = 5,
                        Saturday = 6,
                        allDays = [
                            [Monday],
                            [Tuesday],
                            [Wednesday],
                            [Thursday],
                            [Friday],
                            [Saturday],
                            [Sunday],
                        ], // array of days
                        closedDays = [],
                        day = date.getDay(),
                        i,
                        ii;

                    //build array of closed days
                    //loop over each day of the week and check if it matches the li day
                    for (i = 0; i < days.length; i += 1) {
                        if (days[i] !== today) {
                            //if today doesn't match = add to currentClosedDays Array
                            closedDays.push(allDays[i]);
                        }
                    }
                    for (ii = 0; ii < closedDays.length; ii += 1) {
                        if (day === closedDays[ii][0]) {
                            return [false];
                        }
                    }
                    return [true];
                },
            });
            $('#notice-text .action-button').click(function() {
                setNoticeMessage();
            });
        }, //end init
        //anything in here is public
        returnObj = {
            init: init,
        };

    //end original var

    //public from here
    return returnObj;
})(jQuery);

//call init fn
libraryAdmin.init();
