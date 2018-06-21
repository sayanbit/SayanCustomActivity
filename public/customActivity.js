'use strict';

define(function (require) {
    let Postmonger = require('postmonger');
    let connection = new Postmonger.Session();
    let payload = {};
    let steps = [
        {'key': 'message_only', 'label': 'Holiday Check'}
    ];
    let currentStep = steps[0].key;
    let eventDefinitionKey = '';
    let deFields = [];

    $(window).ready(function () {
        connection.trigger('ready');
        connection.trigger('requestInteraction');
    });

    function initialize(data) {
        if (data) {
            payload = data;
        }
    }

    function onClickedNext() {
        if (currentStep.key === 'idselection') {
            save();
        } else {
            connection.trigger('nextStep');
        }
    }

    function onClickedBack() {
        connection.trigger('prevStep');
    }

    function onGotoStep(step) {
        showStep(step);
        connection.trigger('ready');
    }

    function showStep(step, stepIndex) {
        if (stepIndex && !step) {
            step = steps[stepIndex - 1];
        }

        currentStep = step;

        $('.step').hide();

        switch (currentStep.key) {
            case 'message_only':
                $('#step1').show();
                $('#step1 input').focus();
                break;
        }
    }

    function save() {
        payload['arguments'] = payload['arguments'] || {};
        payload['arguments'].execute = payload['arguments'].execute || {};
        payload['metaData'] = payload['metaData'] || {};
        payload['metaData'].isConfigured = true;

        console.log(JSON.stringify(payload));

        connection.trigger('updateActivity', payload);
    }

    connection.on('initActivity', initialize);
    connection.on('clickedNext', onClickedNext);
    connection.on('clickedBack', onClickedBack);
    connection.on('gotoStep', onGotoStep);
});
