'use strict';

angular.module('mean.vorkurs').factory('Vorkurs', ['$rootScope', '$http',
    function ($rootScope, $http) {

        var self;

        function VorkursKlass() {
            this.token = '';
            this.user = {};
            self = this;
        }

        VorkursKlass.prototype.onRegisterFail = function (response) {
            this.loginError = {};
            this.registerError = {};
            this.validationError = {};
            if (angular.isObject(response) && response.hasOwnProperty('data') && angular.isArray(response.data)) {
                this.registerError = response.data;
                this.validationError = response.data.msg;
                this.resetpassworderror = response.data.msg;
            } else {
                this.registerError = [{msg: 'Ups das hätte nicht passieren dürfen -- Server Error'}];
            }
            $rootScope.$emit('registerfailed');
        };

        VorkursKlass.prototype.onResendFail = function (response) {
            this.resendError = {};
            if (angular.isObject(response) && response.hasOwnProperty('data') && angular.isArray(response.data)) {
                this.resendError = response.data;
            } else {
                this.resendError = [{msg: 'Ups das hätte nicht passieren dürfen -- Server Error'}];
            }
            $rootScope.$emit('resendfailed');
        };

        VorkursKlass.prototype.onUserFail = function (response) {
            this.userError = {};
            if (angular.isObject(response) && response.hasOwnProperty('data') && angular.isArray(response.data)) {
                this.userError = response.data;
            } else if (angular.isObject(response) && response.hasOwnProperty('data') && response.data === 'Forbidden') {
                this.userError = [{msg: 'Unbekannter Benutzer'}];
            } else {
                this.userError = [{msg: 'Ups das hätte nicht passieren dürfen -- Server Error'}];
            }
            $rootScope.$emit('userfailed');
        };

        VorkursKlass.prototype.onUserFail1 = function (response) {
            this.userError = {};
            if (angular.isObject(response) && response.hasOwnProperty('data') && angular.isArray(response.data)) {
                this.userError = response.data;
            } else if (angular.isObject(response) && response.hasOwnProperty('data') && response.data === 'Forbidden') {
                this.userError = [{msg: 'Unbekannter Benutzer'}];
            } else {
                this.userError = [{msg: 'Ups das hätte nicht passieren dürfen -- Server Error'}];
            }
            $rootScope.$emit('userfailed1');
        };

        VorkursKlass.prototype.onRegister = function (response) {
            this.token = response.data.token;
            $rootScope.$emit('registersuccess');
        };


        VorkursKlass.prototype.onUser = function (response) {
            this.user = response.data;
            $rootScope.$emit('usersuccess');
        };

        VorkursKlass.prototype.onUser1 = function (response) {
            this.user = response.data;
            $rootScope.$emit('usersuccess1');
        };

        VorkursKlass.prototype.onResend = function (response) {
            $rootScope.$emit('resendsuccess');
        };

        VorkursKlass.prototype.onEdit = function (response) {
            $rootScope.$emit('editsuccess');
        };

        VorkursKlass.prototype.onEditFail = function (response) {
            this.editError = {};
            if (angular.isObject(response) && response.hasOwnProperty('data') && angular.isArray(response.data)) {
                this.editError = response.data;
            } else {
                this.editError = [{msg: 'Ups das hätte nicht passieren dürfen -- Server Error'}];
            }
            $rootScope.$emit('editfailed');
        };

        var VorkursObj = new VorkursKlass();

        VorkursKlass.prototype.getUser = function (token) {
            this.user = undefined;
            $http.post('/api/vorkurs/user', {
                token: token
            }).then(this.onUser.bind(this), this.onUserFail.bind(this));
        };

        VorkursKlass.prototype.getUser1 = function (token) {
            this.user = undefined;
            $http.post('/api/vorkurs/user', {
                token: token
            }).then(this.onUser1.bind(this), this.onUserFail1.bind(this));
        };

        VorkursKlass.prototype.register = function (user) {
            $http.post('/api/vorkurs/register', {
                name: user.name,
                email: user.email,
                emailConfirm: user.emailConfirm,
                kurs: user.kurs.id,
                studiengang: user.studiengang,
                sex: user.sex
            }).then(this.onRegister.bind(this), this.onRegisterFail.bind(this));
        };

        VorkursKlass.prototype.edit = function (user) {
            $http.post('/api/vorkurs/edit', {
                    token: user.token,
                    kurs: user.kurs.id
                })
                // ToDo
                .then(this.onEdit.bind(this), this.onEditFail.bind(this));
        };

        VorkursKlass.prototype.resend = function (user) {
            $http.post('/api/vorkurs/resend', {
                email: user.email,
                emailConfirm: user.emailConfirm
            }).then(this.onResend.bind(this), this.onResendFail.bind(this));
        };

        return VorkursObj;
    }
]);
