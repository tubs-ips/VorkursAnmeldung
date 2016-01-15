'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  User = mongoose.model('Vorkurs'),
  async = require('async'),
  config = require('meanio').loadConfig(),
  crypto = require('crypto'),
  nodemailer = require('nodemailer'),
  templates = require('../template'),
  _ = require('lodash'),
  jwt = require('jsonwebtoken'), //https://npmjs.org/package/node-jsonwebtoken
  striptags = require('striptags'),
  URLSafeBase64 = require('urlsafe-base64');

var kurse = function() {
    return Object.getOwnPropertyNames(config.public.vorkursConfig.kurse);
};

var gruppen = function() {
    return Object.getOwnPropertyNames(config.public.vorkursConfig.gruppen);
};

var studiengaenge = function() {
    return Object.keys(config.public.vorkursConfig.studiengang).map(function(k) { return config.public.vorkursConfig.studiengang[k] });
};

/**
 * Send reset password email
 */
function sendMail(mailOptions) {
    var transport = nodemailer.createTransport(config.mailer);
    transport.sendMail(mailOptions, function(err, response) {
        console.log(err);
        console.log(response);
        if (err) return err;
        return response;
    });
}



module.exports = function(Vorkurs) {

    //console.log(Vorkurs.events);

    return {
        /**
         * Create user
         */
        register: function(req, res, next) {
            // because we set our user.provider to local our models/user.js validation will always be true
            req.assert('name', 'Sie müssen einen Namen angeben.').notEmpty();
            req.assert('name', 'Der Name darf keine HTML oder ähnliche Tags enthalten.').equals(striptags(req.body.name));
            req.assert('email', 'Sie müssen eine valide E-Mail Adresse angeben.').isEmail();
            req.assert('emailConfirm', 'Beide Email Adressen müssen sich gleichen.').equals(req.body.email);
            req.assert('kurs', 'Sie müssen eine valide Kurs-ID angeben.').
                isIn(kurse());
            req.assert('studiengang', 'Sie müssen einen valieden Studengang angeben.').isIn(studiengaenge());
            req.assert('sex', 'Unbekanntes Geschlecht').isIn(['frau','herr', 'ka']);

            var errors = req.validationErrors();
            if (errors) {
                return res.status(400).send(errors);
            }

            var token = URLSafeBase64.encode(crypto.randomBytes(42));


            var user = new User(req.body);
            user.token = token;

            //ToDo Gruppen einstellen
            user.gruppen = [config.public.vorkursConfig.kurse[user.kurs].gruppen[0][0].id];

            user.save(function(err) {
                if (err) {
                    switch (err.code) {
                        case 11000:
                        case 11001:
                        res.status(400).json([{
                            msg: 'Email bereits in Benutzung',
                            param: 'email'
                        }]);
                        break;
                        default:
                        var modelErrors = [];

                        if (err.errors) {

                            for (var x in err.errors) {
                                modelErrors.push({
                                    param: x,
                                    msg: err.errors[x].message,
                                    value: err.errors[x].value
                                });
                            }

                            res.status(400).json(modelErrors);
                        }
                    }
                    return res.status(400);
                }

                var mailOptions = {
                    to: user.email,
                    from: config.emailFrom,
                    sender: config.emailFrom,
                    replyTo: config.emailFrom
                };

                mailOptions = templates.registration_mail(user, req, token, config, mailOptions);
                sendMail(mailOptions);

                console.log(mailOptions);

                var payload = {};

                payload.redirect = "/vorkurs/status/" + token;

                console.log(payload);

                var escaped = JSON.stringify(payload);
                escaped = encodeURI(escaped);

                console.log(escaped);

                res.status(200).json(payload);
            });
        },
        /**
         * Send User
         */
        me: function(req, res) {
            if (!req.user || !req.user.hasOwnProperty('_id')) return res.send(null);

            User.findOne({
                _id: req.user._id
            }).exec(function(err, user) {

                if (err || !user) return res.send(null);


                var dbUser = user.toJSON();
                var id = req.user._id;

                delete dbUser._id;
                delete req.user._id;

                var eq = _.isEqual(dbUser, req.user);
                if (eq) {
                    req.user._id = id;
                    return res.json(req.user);
                }

                var payload = user;
                var escaped = JSON.stringify(payload);
                escaped = encodeURI(escaped);
                var token = jwt.sign(escaped, config.secret, { expiresInMinutes: 60*5 });
                res.json({ token: token });
               
            });
        },

        /**
         * Find user by id
         */
        user: function(req, res, next, id) {
            User.findOne({
                _id: id
            }).exec(function(err, user) {
                if (err) return next(err);
                if (!user) return next(new Error('Failed to load User ' + id));
                req.profile = user;
                next();
            });
        },

        /**
         * Resets the password
         */

        resetpassword: function(req, res, next) {
            User.findOne({
                resetPasswordToken: req.params.token,
                resetPasswordExpires: {
                    $gt: Date.now()
                }
            }, function(err, user) {
                if (err) {
                    return res.status(400).json({
                        msg: err
                    });
                }
                if (!user) {
                    return res.status(400).json({
                        msg: 'Token invalid or expired'
                    });
                }
                req.assert('password', 'Password must be between 8-20 characters long').len(8, 20);
                req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
                var errors = req.validationErrors();
                if (errors) {
                    return res.status(400).send(errors);
                }
                user.password = req.body.password;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;
                user.save(function(err) {

                    MeanUser.events.publish({
                        action: 'reset_password',
                        user: {
                            name: user.name
                        }
                    });

                    req.logIn(user, function(err) {
                        if (err) return next(err);
                        return res.send({
                            user: user
                        });
                    });
                });
            });
        },

        /**
         * Callback for forgot password link
         */
        resend: function(req, res, next) {
            async.waterfall([

                function(done) {
                    crypto.randomBytes(20, function(err, buf) {
                        var token = buf.toString('hex');
                        done(err, token);
                    });
                },
                function(token, done) {
                    User.findOne({
                        $or: [{
                            email: req.body.text
                        }, {
                            username: req.body.text
                        }]
                    }, function(err, user) {
                        if (err || !user) return done(true);
                        done(err, user, token);
                    });
                },
                function(user, token, done) {
                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
                    user.save(function(err) {
                        done(err, token, user);
                    });
                },
                function(token, user, done) {
                    var mailOptions = {
                        to: user.email,
                        from: config.emailFrom
                    };
                    mailOptions = templates.forgot_password_email(user, req, token, mailOptions);
                    sendMail(mailOptions);
                    done(null, user);
                }
            ],
            function(err, user) {

                var response = {
                    message: 'Mail successfully sent',
                    status: 'success'
                };
                if (err) {
                    response.message = 'User does not exist';
                    response.status = 'danger';

                }
                MeanUser.events.publish({
                    action: 'forgot_password',
                    user: {
                        name: req.body.text
                    }
                });
                res.json(response);
            });
        }
    };
}

