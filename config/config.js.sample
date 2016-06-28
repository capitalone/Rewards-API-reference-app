 /*
File name: config.js
Description: Properties for external rewards reference application.

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

/*
 * Copy this file to config.js and enter your configuration info.
 * config.js should not be under version control since it contains your
 * client_id and client_secret.
 */

var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'rewards-ref-app-mvc'
    },
    port: 3000,
    CLIENT_ID:'', //Replace this with the client id received from the developer portal
    CLIENT_SECRET:'',  //Replace this with the client secret received from the developer portal
    REDIRECT_URI:'http://localhost:3000/authredirect',  //Replace this with the redirect uri entered in the developer portal
    BASE_URI:'https://api-sandbox.capitalone.com',
    SESSION_SECRET: 'This should be changed and not published anywhere!' //Change this to a random string
  },

  test: {
    root: rootPath,
    app: {
      name: 'rewards-ref-app-mvc'
    },
    port: 3000,
  },

  production: {
    root: rootPath,
    app: {
      name: 'rewards-ref-app-mvc'
    },
    port: 3000,
  }
};

module.exports = config[env];
