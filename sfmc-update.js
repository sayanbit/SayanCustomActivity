const BASE_URL = 'https://www.exacttargetapis.com';
let UPDATE_URL = '/hub/v1/dataevents/key:DE_ID/rows/SubscriberKey:SUB_KEY';

let request = require('sync-request');
let FuelSDK = require('fuelsdk-node');
const Path = require('path');
const moment = require('moment');
const Pkg = require(Path.join(__dirname, 'package.json'));

const loginOptions = Pkg.options.salesforce.marketingCloud;
const ET_Client = new FuelSDK(loginOptions.clientId, loginOptions.clientSecret, loginOptions.marketingCloudInstance);
const defaultDateFormat = loginOptions.defaultDateFormat;
let accessToken = null;
let holidayListCache = {};

function getAccessToken() {
    if (accessToken) return accessToken;
    let response = request('POST', 'https://auth.exacttargetapis.com/v1/requestToken',
        {
            json: {
                "clientId":
                Pkg.options.salesforce.marketingCloud.clientId,
                "clientSecret":
                Pkg.options.salesforce.marketingCloud.clientSecret
            }
        }
    );
    console.log('TOKEN: ', response.getBody("utf8"));
    accessToken = JSON.parse(response.getBody("utf8")).accessToken;
    return accessToken;
}

function parseHolidayList(result, fieldName, format) {
    let holidayList = [];

    fieldName = fieldName || 'Holiday Date';
    format = format || defaultDateFormat;

    if (result.body && result.body.Results) {
        result.body.Results.forEach(function (value) {
            value.Properties.Property.forEach(function (innerValue) {
                if (innerValue.Name.toLowerCase() === fieldName.toLowerCase()) {
                    holidayList.push(moment.utc(innerValue.Value, format).format(defaultDateFormat));
                }
            })
        })
    }
    let todayDateUTC = moment.utc().format(defaultDateFormat);
    //TO clear all previous values
    holidayListCache = [];
    //Cache the holiday response so that we do not have to make call out again and again.
    holidayListCache[todayDateUTC] = holidayList;

    return holidayList;
}

module.exports.updateDataExtension = function (dataExtensionKey, fieldToUpdate, subKey, holidayDataExtensionName, daysToSendEmailOn, res) {
    // Only get holidays starting today. Default 2500 holidays will be fetched.
    let datTodayDate = moment.utc().subtract('1000', 'days').format(defaultDateFormat);
    holidayDataExtensionName = holidayDataExtensionName || 'HolidayList';

    let options = {
        Name: "SDKDataExtension"
        , props: ['Holiday Date', 'Country']
        , filter: {
            leftOperand: 'Holiday Date',
            operator: 'greaterThan',
            rightOperand: datTodayDate
        }

    };

    let deRow = ET_Client.dataExtensionColumn(options);
    deRow.objName = `DataExtensionObject[${holidayDataExtensionName}]`; //Default: HolidayList
    let deRowRead = new Promise(function (resolve, reject) {
        let todayDateUTC = moment.utc().format(defaultDateFormat);
        if (holidayListCache[todayDateUTC]) {
            resolve(holidayListCache[todayDateUTC])
        }
        else {
            deRow.get(function (err, response) {
                if (err) {
                    reject(err);
                } else {
                    let parsedHolidays = parseHolidayList(response);
                    resolve(parsedHolidays);
                }
            })
        }
    });

    deRowRead.then(function (holidayListResponse) {
        let thisDate = moment.utc();
        let isHoliday = true;
        let currentDay = thisDate.format('dddd');

        console.log(thisDate.format(defaultDateFormat));

        console.log('sfmc-update', 'Holiday List', JSON.stringify(holidayListResponse));

        while (daysToSendEmailOn.indexOf(currentDay) === -1 || isHoliday === true) {

            thisDate = thisDate.add('1', 'days');
            currentDay = thisDate.format('dddd');
            console.log(currentDay, thisDate.format(defaultDateFormat), isHoliday);
            if (holidayListResponse.length > 0) {
                isHoliday = holidayListResponse.includes(thisDate.format(defaultDateFormat));
                console.log(isHoliday);
            }
        }

        console.log('sfmc-update', 'Holiday List', thisDate.format(defaultDateFormat));

        let jsonBody = {
            "values": {}
        };
        jsonBody.values[fieldToUpdate] = thisDate.format(defaultDateFormat);

        let updateResponse = request('PUT', BASE_URL + UPDATE_URL.replace(/DE_ID/g, dataExtensionKey).replace(/SUB_KEY/g, subKey),
            {
                json: jsonBody,
                headers: {
                    "Authorization": "Bearer " + getAccessToken()
                }
            }
        );

        console.log(JSON.stringify(updateResponse));
        if (updateResponse.statusCode === 200) {
            let parsedResponse = JSON.parse(updateResponse.getBody('utf8'));
            console.log('parsedResponse', updateResponse.getBody('utf8'));
            return res.status(200).json({branchResult: 'forward'});
        } else {
            return res.status(400).end();
        }
    }).catch(reason => {
        console.log('Error in sfmc-update.js: ', reason);
        return res.status(400).end();
    });
    return deRow;
};