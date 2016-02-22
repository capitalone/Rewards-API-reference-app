var uuid = require('uuid');
var config = require('../../config/config');
var request = require('request');

var oauth2 = require('simple-oauth2')({
clientID: config.CLIENT_ID,
clientSecret: config.CLIENT_SECRET,
site: config.OAUTH_URI,
tokenPath: '/oauth/oauth20/token',
authorizationPath: '/oauth/auz/authorize' 
});

var authorization_uri = oauth2.authCode.authorizeURL({
redirect_uri: config.REDIRECT_URI,
scope: 'openid read_rewards_account_info'
});

var exports = module.exports = {};

exports.getAuthURL = function() {
	return authorization_uri;
};

exports.processCode = function(req, res) {
	var code = req.query.code; 
    oauth2.authCode.getToken({ code: code, redirect_uri: config.REDIRECT_URI}, function(error, result) {
        if (error) {
            console.log('Access Token Error', error.message);
            return res.status(403).render('error', {error: 'Invalid authorization code.'});
        }
        token = oauth2.accessToken.create(result);
        req.session.token=token.token.access_token;
        res.render('loading');
    });
};

exports.getAcctSummary = function(app_res,  accessToken) {

    var acctInfo = [];
    var numAccts;
    var acct_req = request.get('https://apiprodmirror.capitalone.com/rewards/accounts', {
        'auth': {'bearer': accessToken}
        }).on('response', onSummaryResponse);

    function onSummaryResponse(res) {
        var dataBody = '';

        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('****Response from rewards summary: ' + chunk + '\n');
            dataBody += chunk;
        });

        res.on('end', function () {
            if (res.statusCode === 200) {
                var accts = JSON.parse(dataBody);
                numAccts = accts.rewardsAccounts.length;
                for(var acctIndex=0; acctIndex < numAccts; acctIndex++ ) {
                    var refId = encodeURIComponent(accts.rewardsAccounts[acctIndex].rewardsAccountReferenceId);
                    exports.getAcctDetail(accessToken, refId, onAcctDetailResponse); 
                }
            } else {
                console.log('Received error: ' + res.statusCode);
                return app_res.status(500).render('error', {error: 'Summary API experienced a problem.'});
            }
        });
    }

    function onAcctDetailResponse(detailRes, data) {
        if (detailRes.statusCode === 200) {
            acctInfo.push(JSON.parse(data));
            if(acctInfo.length === numAccts) {
                app_res.setHeader('cache-control', 'no-cache, no-store, max-age=0, must-revalidate');
                return app_res.render('account-summary', { data: acctInfo});   
            }
        } else {
            console.log('Recieved error: ' + detailRes.statusCode);
            return app_res.status(500).render('error', {error: 'Detail API experienced a problem.'});
        }
    }

    acct_req.on('error', function(e) {
        console.log('error: ');
        console.log(e);
        app_res.send('Error calling API. Please try again.');
    });
};

exports.getAcctDetail = function( accessToken, ref_id, cb) {

    console.log('Retrieving account info for: ' + ref_id);

    var acct_req = request.get('https://apiprodmirror.capitalone.com/rewards/accounts/' + ref_id, {
    'auth': {'bearer': accessToken}
    }).on('response', onDetailResponse);

    function onDetailResponse(res) {
        var dataBody = '';
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('****Response from rewards detail: ' + chunk + '\n');
            dataBody += chunk;
        });
        res.on('end', function () {
            cb(res,dataBody);
            });
        }

       acct_req.on('error', function(e) {
        console.log(e);
    });
};

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