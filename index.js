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
    console.log(req.body);
    verifyToken(req.body, Pkg.options.salesforce.marketingCloud.jwtSecret, (err, decoded) => {
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
    console.log(JSON.stringify(req));
    verifyToken(req.body, Pkg.options.salesforce.marketingCloud.jwtSecret, (err, decoded) => {
        // verification error -> unauthorized request
        console.log(JSON.stringify(err));
        if (err) return res.status(401).end();

        console.log('-----------------------------');
        console.log(JSON.stringify(decoded));
        return res.status(200).json({success: true});
    });
});

// Serve the custom activity's interface, config, etc.
app.use(express.static(Path.join(__dirname, 'public')));

// Start the server and listen on the port specified by heroku or defaulting to 12345
app.listen(process.env.PORT || 4000, () => {
    console.log('Service Cloud custom split backend is now running!');
});


function verifyToken(body, secret, cb) {
    if (!body) {
        return cb(new Error('invalid jwtdata'));
    }

    require('jsonwebtoken').verify(body.toString('utf8'), secret, {
        algorithm: 'HS256'
    }, cb);
}


