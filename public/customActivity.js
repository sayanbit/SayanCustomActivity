/*
 * Copyright (c) 2018.  Manjit Singh
 *
 * Permission to use, copy, modify, and/or distribute this software inside for any purpose with or without fee is hereby
 * granted, provided that the above copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS
 * SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL
 * THE  AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT,
 * NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 */

'use strict';

let connection = new Postmonger.Session();
let payload = {};
let selectedDaysArray = [];

$(window).ready(function () {
    connection.trigger('ready');
    connection.trigger('requestTriggerEventDefinition');

    $('#message-block').on('click', function () {
        $('#message-body').toggleClass('is-hidden');
    });

    $('#sendOnSpecificDays span').on('click', function () {
        $(this).toggleClass('is-selected is-success');
    })
});

function initialize(data) {
    console.log('INIT-------------------------------------------------------');
    if (data) {
        console.log(data);
        payload = data;

        // noinspection JSAnnotator
        if (data.arguments.execute.inArguments && data.arguments.execute.inArguments.length !== 0) {
            // noinspection JSAnnotator
            $('input#dename').val(data.arguments.execute.inArguments[1].dataExtensionName);
            // noinspection JSAnnotator
            $('input#fieldToUpdate').val(data.arguments.execute.inArguments[2].fieldToUpdate);
            // noinspection JSAnnotator
            let selectedValues = data.arguments.execute.inArguments[3].daysToSendEmailOn;

            $('#sendOnSpecificDays span').each(function () {
                if (selectedValues.indexOf(this.innerHTML) !== -1) {
                    $(this).addClass('is-selected is-success');
                }
            });
            // noinspection JSAnnotator
            if (data.arguments.execute.inArguments[4].holidayDataExtensionName) {
                // noinspection JSAnnotator
                $('input#holidaydename').val(data.arguments.execute.inArguments[4].holidayDataExtensionName);
            }
            let selectedDays = selectedValues;
            let dataExtensionName = $('#dename').val();
            let fieldToUpdate = $('#fieldToUpdate').val();
            let holidayDataExtensionName = $('#holidaydename').val();
            let holidayDataExtensionFieldName = $('#holidayDataExtensionFieldName').val();

            let description = `Send emails only   
                on [${selectedDays}] 
                and update DE [${dataExtensionName}] attribute 
                [${fieldToUpdate}] with next business day`;

            if (holidayDataExtensionName) {
                description += ` and excluding holidays from ${holidayDataExtensionName} DE`;
            }
            if (selectedDaysArray.length > 0 || selectedDays || dataExtensionName || fieldToUpdate) {
                $('#description').text(description);
                $('#criteria').removeClass('is-hidden');

            } else {
                $('#criteria').addClass('is-hidden');
            }
        }
    }
}

function save() {
    console.log('SAVE-------------------------------------------------------');
    selectedDaysArray = [];

    $('#sendOnSpecificDays span.is-selected').each(function () {
        selectedDaysArray.push($(this).html())
    });
    let selectedDays = selectedDaysArray.join(';');
    let dataExtensionName = $('#dename').val();
    let fieldToUpdate = $('#fieldToUpdate').val();
    let holidayDataExtensionName = $('#holidaydename').val();
    let holidayDataExtensionFieldName = $('#holidayDataExtensionFieldName').val();

    payload['arguments'] = payload['arguments'] || {};
    payload['arguments'].execute = payload['arguments'].execute || {};
    payload['metaData'] = payload['metaData'] || {};
    payload['metaData'].isConfigured = true;
    payload.arguments.execute.inArguments = JSON.parse(
        JSON.stringify(payload.arguments.execute.inArguments)
            .replace(/EVENT_KEY/g, $('#eventKey').val()));

    payload.arguments.execute.inArguments[1].dataExtensionName = dataExtensionName;
    payload.arguments.execute.inArguments[2].fieldToUpdate = fieldToUpdate;
    payload.arguments.execute.inArguments[3].daysToSendEmailOn = selectedDays;
    payload.arguments.execute.inArguments[4].holidayDataExtensionName = holidayDataExtensionName;
    payload.arguments.execute.inArguments[4].holidayDataExtensionFieldName = holidayDataExtensionFieldName;

    console.log(JSON.stringify(payload));

    connection.trigger('updateActivity', payload);
}

connection.on('requestedTriggerEventDefinition', function (data) {
    console.log(JSON.stringify(data));
    $('#eventKey').val(data.eventDefinitionKey);
});

connection.on('initActivity', initialize);
connection.on('clickedNext', save);

