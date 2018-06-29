'use strict';

define(function (require) {
    let postMonger = require('postmonger');
    let connection = new postMonger.Session();
    let payload = {};
    let tokens = {};
    let endpoints = {};
    let selectedDaysArray = [];
    let steps = [
        {'key': 'step1', 'label': 'Holiday Check'}
    ];
    let currentStep = steps[0].key;
    let eventDefinitionKey = '';
    let deFields = [];

    $(window).ready(function () {
        connection.trigger('ready');
        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');
        connection.trigger('requestInteractionDefaults');
        connection.trigger('requestTriggerEventDefinition');

        $('#message-block').on('click', function () {
            $('#message-body').toggleClass('is-hidden');
        });

        $('#specificDaysButtons span').on('click', function () {
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

                selectedDaysArray = selectedValues.split(';');

                $('#specificDaysButtons span').each(function () {
                    if (selectedValues.indexOf($(this).val()) !== -1) {
                        $(this).addClass('is-selected is-success');
                    }
                });
                // noinspection JSAnnotator
                if (data.arguments.execute.inArguments[4].holidayDataExtensionName) {
                    // noinspection JSAnnotator
                    $('input#holidaydename').val(data.arguments.execute.inArguments[4].holidayDataExtensionName);
                }
                let selectedDays = selectedDaysArray.join(';');
                let dataExtensionName = $('#dename').val();
                let fieldToUpdate = $('#fieldToUpdate').val();
                let holidayDataExtensionName = $('#holidaydename').val();

                let description = `Send emails only   
                on [${selectedDays}] 
                and update DE [${dataExtensionName}]  
                and field on [${fieldToUpdate}]`;

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

    function onClickedNext() {
        console.log('NEXT-------------------------------------------------------');
        if (currentStep.key === 'step1') {
            save();
        } else {
            connection.trigger('nextStep');
        }
    }

    function onClickedBack() {
        console.log('BACK-------------------------------------------------------');
        connection.trigger('prevStep');
    }

    function onGotoStep(step) {
        console.log('STEP-------------------------------------------------------');
        showStep(step);
        connection.trigger('ready');
    }

    function showStep(step, stepIndex) {
        console.log('SHOW STEP-------------------------------------------------------');
        if (stepIndex && !step) {
            step = steps[stepIndex - 1];
        }

        currentStep = step;

        $('.step').hide();

        switch (currentStep.key) {
            case 'step1':
                $('#step1').show();
                break;
        }
    }

    function save() {
        console.log('SAVE-------------------------------------------------------');
        selectedDaysArray = [];

        $('#specificDaysButtons span.is-selected').each(function () {
            selectedDaysArray.push($(this).html())
        });
        let selectedDays = selectedDaysArray.join(';');
        let dataExtensionName = $('#dename').val();
        let fieldToUpdate = $('#fieldToUpdate').val();
        let holidayDataExtensionName = $('#holidaydename').val();

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

        console.log(JSON.stringify(payload));
        console.log(JSON.stringify(tokens));
        console.log(JSON.stringify(endpoints));

        connection.trigger('updateActivity', payload);
    }

    connection.on('requestedTokens', function (data) {
        if (data.error) {
            console.error(data.error);
        } else {
            tokens = data;
        }
    });

    connection.on('requestedEndpoints', function (data) {
        if (data.error) {
            console.error(data.error);
        } else {
            endpoints = data;
        }
    });

    connection.on('requestedInteractionDefaults', function (data) {
        console.log(JSON.stringify(data));
    });

    connection.on('requestedTriggerEventDefinition', function (data) {
        console.log(JSON.stringify(data));
        $('#eventKey').val(data.eventDefinitionKey);
    });

    connection.on('initActivity', initialize);
    connection.on('clickedNext', onClickedNext);
    connection.on('clickedBack', onClickedBack);
    connection.on('gotoStep', onGotoStep);
});
