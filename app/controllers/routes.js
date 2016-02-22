var express = require('express'),
  router = express.Router(),
  api = require('../models/api');

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
    if (Object.keys(req.query).length) {
        api.processCode(req,res);
    } else {
        console.warn('Did not receive code in query');
        return res.status(401).render('error', {error: 'Did not receive authorization code.'});
    }
});

router.get('/accountSummary',function(req,res) {
    if(req.session.token) {
        api.getAcctSummary(res,req.session.token);
    } else {
        return res.status(403).render('error', {error: 'You must grant access to see this page.'});
    }
});

router.get('/logout',function (req, res) {
    console.log('logout request');
    req.session.destroy();
    res.status(200).send('logged out');
});

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