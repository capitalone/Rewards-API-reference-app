 /*
File name: api.js
Description: API calls for external rewards reference application.

Copyright 2016 Capital One Services, LLC
 
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
 
    http://www.apache.org/licenses/LICENSE-2.0
 
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

var uuid = require('uuid');
var config = require('../../config/config');
var request = require('request');

var oauth2 = require('simple-oauth2')({
    clientID: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET,
    site: config.BASE_URI,
    tokenPath: '/oauth2/token',
    authorizationPath: '/oauth2/authorize',
    headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent':'curl/7.43.0'
            }
});

var authorization_uri = oauth2.authCode.authorizeURL({
    redirect_uri: config.REDIRECT_URI,
    scope: 'read_rewards_account_info'
});

var exports = module.exports = {};

// Return the authorization endpoint uri
exports.getAuthURL = function() {
	return authorization_uri;
};

// Exchange access code for bearer token
exports.processCode = function(code, cb) {
    oauth2.authCode.getToken({ code: code, redirect_uri: config.REDIRECT_URI}, function(error, result) {
        if (error) {
            return cb('Invalid authorization code. Please try logging in again.');
        }
        token = oauth2.accessToken.create(result);
        return cb(null, token.token.access_token);
    });
};

// Call rewards summary API endpoint
exports.getAcctSummary = function(accessToken, cb) {

    var acct_req = request
    .get(config.BASE_URI + '/rewards/accounts', {'auth': {'bearer': accessToken}, 'headers':{'User-Agent':'curl/7.43.0'}})
    .on('error', function(err) {
        return cb(err);
    })
    .on('response', onSummaryResponse);

    function onSummaryResponse(res) {
        var dataBody = '';
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('****Response from rewards summary: ' + chunk + '\n');
            dataBody += chunk;
        });

        res.on('end', function () {
            if (res.statusCode === 403) {
                return cb('Access denied due to customer or account standing. Please login to online account for more information.');
            }
            if (res.statusCode !== 200) {
                return cb('Summary API experienced a problem. Please try logging in again.');               
            }
            return cb(null, JSON.parse(dataBody));
        });
    }
};

// Call rewards details API endpoint
exports.getAcctDetail = function( accessToken, ref_id, cb) {

    var acct_req = request.get(config.BASE_URI + '/rewards/accounts/' + ref_id, {'auth': {'bearer': accessToken}, 'headers':{'User-Agent':'curl/7.43.0'}})
    .on('error', function(err) {
        return cb(err);
    })
    .on('response', onDetailResponse);

    function onDetailResponse(res) {
        var dataBody = '';
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('****Response from rewards detail: ' + chunk + '\n');
            dataBody += chunk;
        });
        res.on('end', function () {
            if (res.statusCode !== 200) {
                return cb('Detail API experienced a problem. Please try logging in again.');               
            }
            return cb(null, JSON.parse(dataBody));
        });
    }
};
