'use strict';

var config = require('meanio').loadConfig();
var jwt = require('jsonwebtoken'); //https://npmjs.org/package/node-jsonwebtoken

module.exports = function(Vorkurs, app, auth, database, passport) {

  // User routes use users controller
  var vorkurs = require('../controllers/vorkursControllers')(Vorkurs);

  app.route('/api/vorkurs/anmelden')
      .post(vorkurs.register);

  app.route('/api/vorkurs/edit/:token')
      .post(vorkurs.resetpassword);

  app.route('/api/vorkurs/resend/')
      .post(vorkurs.resend);
};
