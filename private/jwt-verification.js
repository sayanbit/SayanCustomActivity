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

/**
 * Verifies the encoded string to see if the request is coming from your Marketing cloud instance or not.
 * @return {string} Either true or error based on whether the JWT decoding was successful or not.
 * @param {string} body String Encoded string to be verified
 * @param {string} secret Secret signing key create in Administration > Key Management of marketing cloud
 * @param {string} cb Callback function invoked after verification
 */
'use strict';

module.exports.verifyToken = function (body, secret, cb) {
    if (!body) {
        return cb(new Error('JWT is malformed. It is likely due to incorrect ' +
            'JWT token or wrong key in arguments of config.json'));
    }

    require('jsonwebtoken').verify(body.toString("utf8"), secret, {
        algorithm: 'HS256'
    }, cb);
};

