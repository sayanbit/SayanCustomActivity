const path = require("path");
const packageFile = require(path.join(__dirname, '../package.json'));

let userName = packageFile.options.salesforce.marketingCloud.username;
let password = packageFile.options.salesforce.marketingCloud.password;

module.exports.createRecord = function (deName, deFieldName, deFieldValue, subscriberKey) {
    let body =
        "<Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns=\"http://schemas.xmlsoap.org/soap/envelope/\">" +
        "<Header>" +
        "<Security xmlns=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd\">" +
        "<UsernameToken>" +
        "<Username>USER_NAME</Username>" +
        "<Password>PASSWORD</Password>" +
        "</UsernameToken>" +
        "</Security>" +
        "</Header>" +
        "<Body>" +
        "<UpdateRequest xmlns=\"http://exacttarget.com/wsdl/partnerAPI\">" +
        "<Options>" +
        "<SaveOptions>" +
        "<SaveOption>" +
        "<PropertyName>*</PropertyName>" +
        "<SaveAction>UpdateAdd</SaveAction>" +
        "</SaveOption>" +
        "</SaveOptions>" +
        "</Options>" +
        "<Objects xsi:type=\"DataExtensionObject\">" +
        "<PartnerKey xsi:nil=\"true\">" +
        "</PartnerKey>" +
        "<ObjectID xsi:nil=\"true\">" +
        "</ObjectID>" +
        "<CustomerKey>DATA_EXTENSION_NAME</CustomerKey>" +
        "<Properties>" +
        "<Property>" +
        "<Name>SubscriberKey</Name>" +
        "<Value>SUBSCRIBER_KEY</Value>" +
        "</Property>" +
        "<Property>" +
        "<Name>DATA_EXTENSION_FIELD_NAME</Name>" +
        "<Value>CALCULATED_NEXT_BUSINESS_DAY</Value>" +
        "</Property>" +
        "</Properties>" +
        "</Objects>" +
        "</UpdateRequest>" +
        "</Body>" +
        "</Envelope>";
    return body.replace('USER_NAME', userName).replace('PASSWORD', password)
        .replace('DATA_EXTENSION_NAME', deName)
        .replace('DATA_EXTENSION_FIELD_NAME', deFieldName)
        .replace('CALCULATED_NEXT_BUSINESS_DAY', deFieldValue)
        .replace('SUBSCRIBER_KEY', subscriberKey);
};

module.exports.queryHolidayRecordsGreaterThanToday = function (holidayDataExtensionName, fieldToSearch, date) {
    let body =
        "<Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns=\"http://schemas.xmlsoap.org/soap/envelope/\">" +
        "<Header>" +
        "<Security xmlns=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd\">" +
        "<UsernameToken>" +
        "<Username>USER_NAME</Username>" +
        "<Password>PASSWORD</Password>" +
        "</UsernameToken>" +
        "</Security>" +
        "</Header>" +
        "<Body>" +
        "<RetrieveRequestMsg xmlns=\"http://exacttarget.com/wsdl/partnerAPI\">" +
        "<RetrieveRequest>" +
        "<ObjectType>DataExtensionObject[FETCH_DATA_EXTENSION_NAME]</ObjectType>" +
        "<Properties>FIELD_TO_SEARCH</Properties>" +
        "<Filter xsi:type=\"SimpleFilterPart\">" +
        "<Property>HolidayDate</Property>" +
        "<SimpleOperator>greaterThanOrEqual</SimpleOperator>" +
        "<DateValue>FETCH-FROM_DATE</DateValue>" +
        "</Filter>" +
        "</RetrieveRequest>" +
        "</RetrieveRequestMsg>" +
        "</Body>" +
        "</Envelope>";
    return body
        .replace('USER_NAME', userName)
        .replace('PASSWORD', password)
        .replace('FETCH_DATA_EXTENSION_NAME', holidayDataExtensionName)
        .replace('FIELD_TO_SEARCH', fieldToSearch)
        .replace('FETCH-FROM_DATE', date)
};