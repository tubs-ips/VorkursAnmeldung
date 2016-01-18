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
    striptags = require('striptags'),
    URLSafeBase64 = require('urlsafe-base64');

var kurse = function () {
    return Object.getOwnPropertyNames(config.public.vorkursConfig.kurse);
};

var gruppen = function () {
    return Object.getOwnPropertyNames(config.public.vorkursConfig.gruppen);
};

var studiengaenge = function () {
    return Object.keys(config.public.vorkursConfig.studiengang).map(function (k) {
        return config.public.vorkursConfig.studiengang[k]
    });
};

/**
 * Send reset password email
 */
function sendMail(mailOptions) {
    var transport = nodemailer.createTransport(config.mailer);
    transport.sendMail(mailOptions, function (err, response) {
        if (err) return err;
        return response;
    });
}


module.exports = function (Vorkurs) {
    return {
        /**
         * Create user
         */
        register: function (req, res, next) {
            // because we set our user.provider to local our models/user.js validation will always be true
            req.assert('name', 'Sie müssen einen Namen angeben.').notEmpty();
            req.assert('name', 'Der Name darf keine HTML oder ähnliche Tags enthalten.').equals(striptags(req.body.name));
            req.assert('email', 'Sie müssen eine valide E-Mail Adresse angeben.').isEmail();
            req.assert('emailConfirm', 'Beide Email Adressen müssen sich gleichen.').equals(req.body.email);
            req.assert('kurs', 'Sie müssen eine valide Kurs-ID angeben.').isIn(kurse());
            req.assert('studiengang', 'Sie müssen einen valieden Studengang angeben.').isIn(studiengaenge());
            req.assert('sex', 'Unbekanntes Geschlecht').isIn(['frau', 'herr', 'ka']);

            var errors = req.validationErrors();
            if (errors) {
                return res.status(400).send(errors);
            }

            var token = URLSafeBase64.encode(crypto.randomBytes(42));


            var user = new User(req.body);
            user.token = token;

            //ToDo Gruppen einstellen
            user.gruppen = config.public.vorkursConfig.kurse[user.kurs].gruppen[0][0].id;

            user.save(function (err) {
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

                var payload = {};

                payload.token = token;

                res.status(200).json(payload);
            });
        },

        /**
         * Callback for forgot token link
         */
        resend: function (req, res, next) {
            req.assert('email', 'Sie müssen eine valide E-Mail Adresse angeben.').isEmail();
            req.assert('emailConfirm', 'Beide Email Adressen müssen sich gleichen.').equals(req.body.email);

            var errors = req.validationErrors();
            if (errors) {
                return res.status(400).send(errors);
            }

            User.findOne({
                email: req.body.email
            }, function (err, user) {
                if (err || !user) {
                    return res.sendStatus(200);
                }
                var token = user.token;
                var mailOptions = {
                    to: user.email,
                    from: config.emailFrom,
                    sender: config.emailFrom,
                    replyTo: config.emailFrom
                };
                mailOptions = templates.resend_mail(user, req, token, config, mailOptions);
                sendMail(mailOptions);

                return res.sendStatus(200);
            })
        },

        getUser: function (req, res, next) {
            req.assert('token', 'Das Token darf nicht leer sein.').notEmpty();

            var errors = req.validationErrors();
            if (errors) {
                return res.status(400).send(errors);
            }

            User.findOne({
                token: req.body.token
            }, function (err, user) {
                if (err || !user) {
                    return res.sendStatus(403);
                }

                user._id = undefined;
                user.__v = undefined;

                return res.status(200).json(user);
            })
        },

        edit: function (req, res, next) {
            var k = kurse().slice();
            k.push('abmelden');

            req.assert('token', 'Das Token darf nicht leer sein.').notEmpty();
            req.assert('kurs', 'Sie müssen eine valide Kurs-ID angeben.').isIn(k);

            var errors = req.validationErrors();
            if (errors) {
                return res.status(400).send(errors);
            }

            User.findOne({
                token: req.body.token
            }, function (err, user) {
                if (err || !user) {
                    return res.sendStatus(403);
                }

                user.kurs = req.body.kurs;

                //ToDo Gruppen einstellen
                if (config.public.vorkursConfig.kurse.hasOwnProperty(user.kurs)) {
                    user.gruppen = config.public.vorkursConfig.kurse[user.kurs].gruppen[0][0].id;
                } else {
                    user.gruppen = [];
                }

                user.save(function (err) {
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
                });

                return res.sendStatus(200);
            })
        }
    };
};

