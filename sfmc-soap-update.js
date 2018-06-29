let FuelSDK = require('fuelsdk-node');
let moment = require('moment');

const Path = require('path');
const Pkg = require(Path.join(__dirname, 'package.json'));

let loginOptions = Pkg.options.salesforce.marketingCloud;

let ET_Client = new FuelSDK(loginOptions.clientId, loginOptions.clientSecret, 's7');

let options = {
    Name: "SDKDataExtension"
    , props: ['Holiday Date', 'Country']
    /* , filter: {
         leftOperand: 'Value',
         operator: 'equals',
         rightOperand: 'Some random text for the value field'
     }*/

};
let deRow = ET_Client.dataExtensionColumn(options);
deRow.objName = 'DataExtensionObject[HolidayList]';

let js = {
    "body": {
        "OverallStatus": "OK",
        "Results": [
            {
                "PartnerKey": "",
                "ObjectID": "",
                "Type": "DataExtensionObject",
                "Properties": {
                    "Property": [
                        {
                            "Name": "Holiday Date",
                            "Value": "6/28/2018 12:00:00 AM"
                        },
                        {
                            "Name": "Country",
                            "Value": "India"
                        }
                    ]
                }
            },
            {
                "PartnerKey": "",
                "ObjectID": "",
                "Type": "DataExtensionObject",
                "Properties": {
                    "Property": [
                        {
                            "Name": "Holiday Date",
                            "Value": "6/29/2018 12:00:00 AM"
                        },
                        {
                            "Name": "Country",
                            "Value": "India"
                        }
                    ]
                }
            }
        ]
    }
}

/*deRow.get(function (err, response) {

});*/

function getArrayOf(result, fieldName, format) {
    let holidayList = [];

    fieldName = fieldName || 'Holiday Date';
    format = format || 'MM/DD/YYYY HH:mm:ss';

    if (result.body && result.body.Results) {
        result.body.Results.forEach(function (value) {
            value.Properties.Property.forEach(function (innerValue) {
                if (innerValue.Name.toLowerCase() === fieldName.toLowerCase()) {
                    holidayList.push(moment.utc(innerValue.Value, format));
                }
            })
        })
    }
    console.log(JSON.stringify(holidayList), moment.max(...holidayList));
}

getArrayOf(js);

