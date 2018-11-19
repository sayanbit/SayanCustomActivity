/*
 * Copyright (c) 2018.  Caterpillar
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

"use strict";

const path = require("path");
const cache = require("./cache");
const packageFile = require(path.join(__dirname, '../package.json'));
const moment = require('moment');
const axios = require('axios');
const parser = require('xml2json');


const loginOptions = packageFile.options.salesforce.marketingCloud;
const API_URL = 'https://webservice.s7.exacttarget.com/Service.asmx';

const SUCCESS_STATUS_CODE = 200;
const DAY_OF_WEEK_FORMAT = "dddd";
let expressResponse;
const schema = require(path.join(__dirname, '../schema/schema-body.js'));

const options = {
    object: false,
    reversible: false,
    coerce: false,
    sanitize: true,
    trim: true,
    arrayNotation: true,
    alternateTextNode: false
};

module.exports.updateDataExtension = function (blackoutDE, blackoutDEHolidayField, blackoutDESubscriberField,
                                               subscriberKey, holidayDE, holidayDEField,
                                               daysToSendEmailOn, response) {

    const todayDateUTC = moment.utc().format(loginOptions.defaultDateFormat);
    expressResponse = response;

    // Only get holidays starting today. Default 2500 holidays will be fetched.

    let body = schema.queryHolidayRecordsGreaterThanToday(holidayDE, holidayDEField, todayDateUTC);
    return axios.post(API_URL, body, {
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(function (response) {
        console.log(response.body);
        if (response === undefined || response === null) {
            expressResponse.send('Error creating DE Row, please make sure your credentials and DE name is correct.');
        } else {
            _parseHolidayServiceResponse(response.data, holidayDEField);
        }
    }).then(function (holidayList) {
        let isHoliday = true;

        // Get current day from date i.e. Monday / Tuesday etc
        let currentDayOfWeek = todayDateUTC.format(DAY_OF_WEEK_FORMAT);
        let temporaryDate = todayDateUTC;

        //Run this loop until you get a desired day when the email is to be sent and
        // that day is not in the holiday list
        while (daysToSendEmailOn.indexOf(currentDayOfWeek) === -1 || isHoliday === true) {

            temporaryDate = temporaryDate.add('1', 'days');

            //Find the day again after incrementing
            currentDayOfWeek = temporaryDate.format(DAY_OF_WEEK_FORMAT);
            if (holidayList.length > 0) {
                isHoliday = holidayList.includes(temporaryDate.format(loginOptions.defaultDateFormat));
            }
        }
        let body = schema.createRecord(blackoutDE, blackoutDEHolidayField,
            temporaryDate.format(loginOptions.defaultDateFormat), subscriberKey);

        return axios.post(API_URL, body, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }).then(function () {

    }).catch(reason => {
        console.log('Error in while updating.js: ', reason);
        return expressResponse.status(400).end();
    });

};

let _parseHolidayServiceResponse = function (response, fieldName) {
    const todayDateUTC = moment.utc().format(loginOptions.defaultDateFormat);
    let result = JSON.parse(parser.toJson(xml, options));
    console.log(todayDateUTC);
    if (cache.get(todayDateUTC)) {
        return cache.get(todayDateUTC);
    } else {
        let holidayList = [];
        fieldName = fieldName || 'Holiday Date';

        if (result["soap:Envelope"][0]["soap:Body"][0]["RetrieveResponseMsg"][0]
            && result["soap:Envelope"][0]["soap:Body"][0]["RetrieveResponseMsg"][0]["Results"][0]) {
            let holidays = result["soap:Envelope"][0]["soap:Body"][0]["RetrieveResponseMsg"][0]["Results"][0];

            holidays.forEach(function (value) {
                value.Property.forEach(function (innerValue) {
                    if (innerValue.Name[0].toLowerCase() === fieldName.toLowerCase()) {
                        let receivedDate = moment.utc(innerValue.Value[0], loginOptions.defaultDateFormat);
                        holidayList.push(receivedDate.format(loginOptions.defaultDateFormat));
                    }
                })
            })
        }
        //Cache the holiday response so that we do not have to make call out again and again.
        cache.set(todayDateUTC, holidayList);
        return holidayList;
    }
};