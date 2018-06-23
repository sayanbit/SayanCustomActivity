'use strict';

const Path = require('path');
const Pkg = require(Path.join(__dirname, 'package.json'));
const express = require('express');

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
        // verification error -> unauthorized request
        if (err) {
            console.error(err);
            return res.status(401).end();
        }

        if (parseInt(Math.random() * 100) % 2 === 0) {
            return res.status(200).json({branchResult: 'is_working'});
        } else {
            return res.status(200).json({branchResult: 'is_holiday'});
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

// Start the server and listen on the port specified by heroku or defaulting to 12345
app.listen(process.env.PORT || 443, () => {
    console.log('Service Cloud custom split backend is now running at port! ' + process.env.PORT || 443);
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


