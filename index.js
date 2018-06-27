'use strict';

const Path = require('path');
const Pkg = require(Path.join(__dirname, 'package.json'));
const express = require('express');
const sfmc = require('./sfmc-update');

const app = express();

// Register middleware that parses the request payload.
app.use(require('body-parser').raw({
    type: 'application/jwt'
}));

// Route that is called for every contact who reaches the custom split activity
app.post('/activity/execute', (req, res) => {
    verifyToken(req.body, Pkg.options.salesforce.marketingCloud.jwtSecret, (err, decoded) => {
        console.log('DECODED EXECUTE');
        console.log(JSON.stringify(decoded));
        decoded = {
            "inArguments": [
                {"contactIdentifier": "7117"},
                {"dataExtensionName": "NextBusinessDay"},
                {"fieldToUpdate": "NextBusinessDay"},
                {"daysToSendEmailOn": "Tuesday;Wednesday;Thursday"},
                {"holidayDataExtensionName": ""}],
            "outArguments": [],
            "activityObjectID": "fd2668f6-805f-421f-90f4-3e88351d19a9",
            "journeyId": "87eeacd7-4a80-43f3-8943-af5d9f3a0169",
            "activityId": "fd2668f6-805f-421f-90f4-3e88351d19a9",
            "definitionInstanceId": "1087a6b0-52b1-4e96-b16d-982bc21b4469",
            "activityInstanceId": "ae93fa95-9e19-4c73-84c5-adde4e47e49e",
            "keyValue": "7117",
            "mode": 0
        }
        // verification error -> unauthorized request
        if (err) {
            console.error(err);
            return res.status(401).end();
        }

        let subKey = decoded.inArguments[0].contactIdentifier;
        let dataExtensionName = decoded.inArguments[1].dataExtensionName;
        let fieldToUpdate = decoded.inArguments[2].fieldToUpdate;
        let daysToSendEmailOn = decoded.inArguments[3].daysToSendEmailOn;
        let holidayDataExtensionName = decoded.inArguments[4].holidayDataExtensionName;

        if (!req.body.subKey) {
            req.body.subKey = 'SubscriberKey';

        }
        if (!dataExtensionName || !fieldToUpdate || !daysToSendEmailOn || !subKey) {
            return res.status(400).end();
        } else {
            let response = sfmc.updateDataExtension(dataExtensionName, fieldToUpdate, subKey, holidayDataExtensionName);
            console.log('----------------------RESPONSE--------------------------');
            console.log(response.statusCode, res.getBody('utf8'));
            if (response.statusCode === 200) {
                let parsedResponse = JSON.parse(res.getBody('utf8'));
                return res.status(200).json({branchResult: 'forward'});
            } else {
                return res.status(400).end();
            }
        }
    });
});

// Routes for saving, publishing and validating the custom activity. In this case
// nothing is done except decoding the jwt and replying with a success message.
app.post(/\/activity\/(save|publish|validate|stop)/, (req, res) => {
    verifyToken(req.body, Pkg.options.salesforce.marketingCloud.jwtSecret, (err, decoded) => {
        // verification error -> unauthorized request
        console.log('Error' + JSON.stringify(err));
        if (err) return res.status(401).end();

        console.log('Decoded' + JSON.stringify(decoded));
        return res.status(200).json({success: true});
    });
});

// Serve the custom activity's interface, config, etc.
app.use(express.static(Path.join(__dirname, 'public')));

// Start the server and listen on the port specified by Heroku or defaulting to 12345
app.listen(process.env.PORT || 443, () => {
    console.log('Service Cloud custom split backend is now running at port! ' + (process.env.PORT || 443));
});


function verifyToken(body, secret, cb) {
    if (!body) {
        return cb(new Error('JWT is malformed. It is likely due to incorrect ' +
            'JWT token or wrong key in arguments of config.json'));
    }

    require('jsonwebtoken').verify(body.toString("utf8"), secret, {
        algorithm: 'HS256'
    }, cb);
}


