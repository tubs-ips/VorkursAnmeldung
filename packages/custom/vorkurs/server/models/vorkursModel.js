'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require('lodash');

var mean = require('meanio');

var sex = {
    values: ['frau', 'herr', 'ka'],
    message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
};

/**
 * Validations
 */
var validateUniqueEmail = function (value, callback) {
    var User = mongoose.model('Vorkurs');
    User.find({
        $and: [{
            email: value
        }, {
            _id: {
                $ne: this._id
            }
        }]
    }, function (err, user) {
        callback(err || user.length === 0);
    });
};

var validateGruppen = function (value, callback) {
    var config = mean.loadConfig();
    var gruppen = config.public.vorkursConfig.gruppen;
    callback(value === [] || _.reduce(value, function (total, item) {
            return total && gruppen.hasOwnProperty(item);
        }, true));
};

var validateKurs = function (value, callback) {
    var config = mean.loadConfig();
    var kurse = config.public.vorkursConfig.kurse;
    callback(value === 'abmelden' || kurse.hasOwnProperty(value));
};

var validateStudiengang = function (value, callback) {
    var config = mean.loadConfig();
    var studiengaenge = config.public.vorkursConfig.studiengang;
    callback(_.find(studiengaenge, function (s) {
            return s === value;
        }) !== undefined);
};

/**
 * Getter
 */
var escapeProperty = function (value) {
    return _.escape(value);
};

/**
 * User Schema
 */

var UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        get: escapeProperty
    },
    sex: {
        type: String,
        required: true,
        enum: sex
    },
    email: {
        type: String,
        required: true,
        unique: true,
        // Regexp to validate emails with more strict rules as added in tests/users.js which also conforms mostly with RFC2822 guide lines
        match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Geben Sie eine valide E-Mail Adresse ein'],
        validate: [validateUniqueEmail, 'E-Mail Adresse wird bereits verwendet']
    },
    gruppen: {
        type: Array,
        validate: [validateGruppen, 'Unbekannte Gruppe']
    },
    kurs: {
        type: String,
        validate: [validateKurs, 'Unbekannter Kurs']
    },
    studiengang: {
        type: String,
        required: true,
        validate: [validateStudiengang, 'Unbekannter Studiengang']
    },
    token: {
        type: String,
        required: true,
        unique: true
    }
});

/**
 * Methods
 */

mongoose.model('Vorkurs', UserSchema);
