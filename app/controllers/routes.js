 /*
File name: routes.js
Description: Routes for external rewards reference application.

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

var express = require('express'),
  router = express.Router(),
  api = require('../models/api');
  util = require('../models/util');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/auth', function (req, res) {
    res.redirect(api.getAuthURL());
});

router.get('/authredirect',function(req,res) {
    if (!Object.keys(req.query).length) {
        return res.status(401).render('error', {error: 'Did not receive authorization code.'});
    }
    var code = req.query.code; 
    api.processCode(code, function(err, token) {
        if(err){
            return res.status(403).render('error', {error: 'Invalid authorization code.'});
        }
        req.session.token=token;
        res.render('loading');
    });
});

router.get('/accountSummary',function(req,res) {
    var acctInfo = [];
    var numAccts;
    if(!req.session.token) { 
        return res.status(403).render('error', {error: 'You must grant access to see this page.'});
    }
    api.getAcctSummary(req.session.token, function(err, accts) {
        if(err) {
            return res.status(500).render('error', {error: err});
        }
        numAccts = accts.rewardsAccounts.length;
        for(var acctIndex=0; acctIndex < numAccts; acctIndex++ ) {
            var refId = encodeURIComponent(accts.rewardsAccounts[acctIndex].rewardsAccountReferenceId);
            api.getAcctDetail(req.session.token, refId, onDetailResponse);
        }

        function onDetailResponse(err, acct_detail) {
            if(err) { 
                return res.status(500).render('error', {error: err});
            }
            acctInfo.push(acct_detail);
            if(acctInfo.length === numAccts) {
                util.renderHTML(acctInfo, function(err, summaryDisplay, detailDispaly, name) {
                    return res.render('account-summary', { summary: summaryDisplay, detail: detailDispaly, name: name}); 
                });
            }
        }
    });
});        

router.get('/logout',function (req, res) {
    req.session.destroy();
    res.status(200).send('logged out');
});