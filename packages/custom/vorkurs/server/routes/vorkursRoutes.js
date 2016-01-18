'use strict';

module.exports = function (Vorkurs, app) {

    // User routes use users controller
    var vorkurs = require('../controllers/vorkursControllers')(Vorkurs);

    app.route('/api/vorkurs/register')
        .post(vorkurs.register);

    app.route('/api/vorkurs/edit')
        .post(vorkurs.edit);

    app.route('/api/vorkurs/user')
        .post(vorkurs.getUser);

    app.route('/api/vorkurs/resend')
        .post(vorkurs.resend);
};
