'use strict';

/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(Vorkurs, app, auth, database) {

  app.get('/api/vorkurs/example/anyone', function(req, res, next) {
    res.send('Anyone can access this');
  });

  app.get('/api/vorkurs/example/auth', auth.requiresLogin, function(req, res, next) {
    res.send('Only authenticated users can access this');
  });

  app.get('/api/vorkurs/example/admin', auth.requiresAdmin, function(req, res, next) {
    res.send('Only users with Admin role can access this');
  });

  app.get('/api/vorkurs/example/render', function(req, res, next) {
    Vorkurs.render('index', {
      package: 'vorkurs'
    }, function(err, html) {
      //Rendering a view from the Package server/views
      res.send(html);
    });
  });
};
