const BASE_URL = 'https://www.exacttargetapis.com';
let UPDATE_URL = '/hub/v1/dataevents/key:DE_ID/rows/SubscriberKey:SUB_KEY';

let request = require('sync-request');
const Path = require('path');
const Pkg = require(Path.join(__dirname, 'package.json'));

let authResponse = '';


module.exports.updateDataExtension = function (dataExtensionKey, fieldToUpdate, subKey, holidayDataExtensionName, daysToSendEmailOn) {
    let jsonBody = {
        "values": {}
    };
    let accessToken = getAccessToken();
    jsonBody.values[fieldToUpdate] = checkBusinessDay(holidayDataExtensionName, daysToSendEmailOn);
    console.log('BODY: ',
        JSON.stringify(jsonBody),
        BASE_URL + UPDATE_URL.replace(/DE_ID/g, dataExtensionKey).replace(/SUB_KEY/g, subKey),
        "Bearer " + accessToken);
    let res;
    res = request('PUT', BASE_URL + UPDATE_URL.replace(/DE_ID/g, dataExtensionKey).replace(/SUB_KEY/g, subKey),
        {
            json: jsonBody,
            headers: {
                "Authorization": "Bearer " + accessToken
            }
        }
    );
    return res;

};

function checkBusinessDay(holidayDataExtensionName, daysToSendEmailOn) {
    const daysArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let thisDate = new Date();
    let currentDay = daysArray[thisDate.getDay()];
    while (daysToSendEmailOn.indexOf(currentDay) === -1) {
        thisDate.setHours(thisDate.getHours() + 24);
        currentDay = daysArray[thisDate.getDay()];
    }
    return thisDate.toISOString();
    //let dateArray = [thisDate.getFullYear(), thisDate.getMonth() + 1, thisDate.getDate()];
    //return dateArray.join('-');
}

function getAccessToken() {
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
    console.log(response.getBody("utf8"));
    return JSON.parse(response.getBody("utf8")).accessToken;
}