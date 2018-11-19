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

let a = [
    {
        "restHost": "rest.s7.exacttarget.com",
        "stackKey": "S7",
        "stackHost": "mc.s7.exacttarget.com",
        "ssoUrl": "https://mc.s7.exacttarget.com/cloud/tools/SSO.aspx?env=default&legacy=1&sk=S7",
        "fuelapiRestHost": "https://www-mc-s7.exacttargetapis.com/"
    },
    {
        "token": "0XjdjgEG1hnnBU3MKtrSN7F2ZOrjdMfaI1sMSMSCc-aNSGh5x6_9kh0hfweU7HECpw4BYwxDf4ajuVPpALZwtnRQ7pjN2oAAhJ9LDdbVZNOj_JR0sSlwfyCYzdUkRx6AzPekFbajVMDm1oroImIiucXkAKMjWip-totGZn8BhfmH4zVBqpBrM-5mUKOBoRmUamQ84mxdrVJDrr2OeoDB206CvWa-8vFzYmt2ng8RY0STxMKtyLr2mOgxkxdXoXrqU",
        "fuel2token": "7g8SaGCUuGmk5PHrvmmhtY4G",
        "expires": 1529673227944,
        "stackKey": "S7"
    },
    {
        "activityObjectID": "b164fb54-c904-46f4-95c7-c23643628cc3",
        "interactionId": "e0fc0b94-f69e-44ae-bfe3-f83011543a7c",
        "originalDefinitionId": "e0fc0b94-f69e-44ae-bfe3-f83011543a7c",
        "interactionKey": "7169bc47-283e-9422-c28b-af4ab7b95a3c",
        "interactionVersion": "1",
        "isPublished": false
    },
    {
        "name": "msholidaycheck",
        "version": "1.0.0",
        "description": "Holiday Check Package",
        "main": "index.js",
        "scripts": {
            "test": "echo \"Error: no test specified\" && exit 1",
            "start": "node ikbndex.js"
        },
        "keywords": [
            "sfmc",
            "holiday check"
        ],
        "author": "Manjit Singh",
        "license": "ISC",
        "dependencies": {
            "body-parser": "^1.18.3",
            "express": "^4.16.3",
            "jsonwebtoken": "^8.3.0"
        },
        "options": {
            "salesforce": {
                "marketingCloud": {
                    "jwtSecret": "customblackoutactivity",
                    "clientId": "11111111",
                    "clientSecret": "111111111",
                    "defaultTimeZone": "Eastern Standard Time",
                    "defaultDateFormat": "MM/DD/YYYY",
                    "marketingCloudInstance": "s10",
                    "username": "",
                    "password": "@1"
                }
            }
        }
    },
    {
        "email": ["{{Event.DEAudience-08480b1b-43e0-6c67-b0c0-a8c0cd15dd8b.\"EmailAddress\"}}"],
        "mobileNumber": [],
        "transactionKeys": null,
        "properties": {"analyticsTracking": {"enabled": false, "analyticsType": "google", "urlDomainsToTrack": []}}
    },
    {
        "isVisibleInPicker": false,
        "type": "EmailAudience",
        "iconUrl": "/images/icon-data-extension.svg",
        "sourceApplicationExtensionId": "97e942ee-6914-4d3d-9e52-37ecb71f79ed",
        "dataExtensionId": "b5c29a1b-c958-e811-bf07-38eaa791d005",
        "name": null,
        "mode": 1,
        "eventDefinitionKey": "DEAudience-08480b1b-43e0-6c67-b0c0-a8c0cd15dd8b",
        "deUsageDataReturned": null,
        "category": "Audience",
        "metaData": {"criteriaDescription": "", "scheduleFlowMode": "runOnce", "runOnceScheduleMode": "onPublish"},
        "arguments": {"useHighWatermark": false},
        "configurationArguments": {"unconfigured": false}
    },
    {
        "token": "0XjdjgEG1hnnBU3MKtrSN7OqyK1iQ3TS4vHAnigKI7XtDjCW-loLhR7NaKnMOR5CU6b1js1jYifWIvb1iB5e-yfdR5F3C7RbeETS67A3j_bDwGG2dqDOCP2hAAVTBi5bu2Ep9mn6LtBg1akg2kVHBFVI5iN-L7jk2RIV_A-5rWp6sJkqI6FOBiQNCdLYhVEiLsgUjOIlaNf37drZHQp1HM194G9rZrfUyB3UfwO4aQGlZEpAn8FKHRzvtg0zgpzxc",
        "fuel2token": "7e3Ozif2FKfo3lQ8ZieC7mDU",
        "expires": 1530039094467,
        "stackKey": "S7"
    },
    {
        "accessToken": "72CMZrL3w8WQm2qMbV1b6GVI",
        "expiresIn": 3453
    },
    {
        "inArguments": [
            {"contactIdentifier": "10002"},
            {"dataExtensionName": "XXXXXXXXXXXXXXXXx"},
            {"fieldToUpdate": "YYYYYYYYYYYYYYY"},
            {"daysToSendEmailOn": "Tuesday;Wednesday;Thursday;Friday;Saturday"}
        ],
        "outArguments": [],
        "activityObjectID": "a1d3a853-b9d6-452e-bd98-454fe97557f2",
        "journeyId": "ef3269f1-72d7-4fdd-bd04-7cd654db9f2c",
        "activityId": "a1d3a853-b9d6-452e-bd98-454fe97557f2",
        "definitionInstanceId": "d14b14dd-77c0-4216-8e73-b75c76bfb53a",
        "activityInstanceId": "73aec5cc-211d-4399-b3e6-44ec5c8b4ecf",
        "keyValue": "10002",
        "mode": 0
    }
];

let x = {
    "argument": {
        "execute": {
            "inArguments": [
                {
                    "contactIdentifier": "{{Contact.Key}}"
                },
                {
                    "intKey": "{{Interaction.EVENT_KEY.SubscriberKey}}"
                },
                {
                    "eventKey": "{{Event.EVENT_KEY.SubscriberKey}}"
                }
            ],
            "outArguments": [],
            //"url": "https://ms-holiday-check.herokuapp.com/activity/execute",
            "verb": "POST",
            "body": "",
            "useJwt": true,
            "header": "",
            "format": "json",
            "timeout": 90000,
            "customerKey": "hellomanjitsinghholidayactivity"
        }
    },
    arguments: {
        isSubscriber: "",
        lastHolidayDate: "",
        subscriberKey: ""
    }
};


