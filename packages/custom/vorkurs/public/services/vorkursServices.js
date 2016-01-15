'use strict';

angular.module('mean.vorkurs').factory('Vorkurs', ['$rootScope', '$http', '$location', '$stateParams', '$cookies', '$q', '$timeout',
    function ($rootScope, $http, $location, $stateParams, $cookies, $q, $timeout) {

        var self;

        function escape(html) {
            return String(html)
                .replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
        }

        function b64_to_utf8(str) {
            return decodeURIComponent(escape(window.atob(str)));
        }

        function VorkursKlass() {
            this.token = '';
            self = this;
        }

        VorkursKlass.prototype.onIdentity = function (response) {
            console.log(angular.toJson(response, true));
            this.loginError = {};
            this.registerError = {};
            this.validationError = {};
            if (angular.isObject(response)) {
                console.log(angular.toJson(response, true));

                var encodedUserToken, userToken, destination;
                if (angular.isDefined(response.token)) {
                    localStorage.setItem('JWT', response.token);
                    encodedUserToken = decodeURI(b64_to_utf8(response.token.split('.')[1]));
                    userToken = JSON.parse(encodedUserToken);
                }
                destination = angular.isDefined(response.redirect) ? response.redirect : '/vorkurs/status';
                $cookies.remove('redirect');

                console.log(angular.toJson(destination, true));
                console.log(angular.toJson(encodedUserToken, true));
                console.log(angular.toJson(userToken, true));
                console.log(destination + '/' + userToken.token);
                $location.path(destination + '/' + userToken.token).replace();
            } else {
                this.registerError = [{msg: "Ups das hätte nicht passieren dürfen -- Server Error"}];
            }
        };

        VorkursKlass.prototype.onIdFail = function (response) {
            this.loginError = {};
            this.registerError = {};
            this.validationError = {};
            console.log(angular.toJson(response));
            if (angular.isArray(response)) {
                $location.path(response.redirect);
                this.registerError = response;
                this.validationError = response.msg;
                this.resetpassworderror = response.msg;
            } else {
                this.registerError = [{msg: "Ups das hätte nicht passieren dürfen -- Server Error"}];
            }
            $rootScope.$emit('registerfailed');
        };

        var VorkursObj = new VorkursKlass();

        /*VorkursKlass.prototype.login = function (user) {
         // this is an ugly hack due to mean-admin needs
         var destination = $location.path().indexOf('/login') === -1 ? $location.absUrl() : false;
         $http.post('/api/login', {
         email: user.email,
         password: user.password,
         redirect: $cookies.get('redirect') || destination
         })
         .success(this.onIdentity.bind(this))
         .error(this.onIdFail.bind(this));
         };*/

        VorkursKlass.prototype.register = function (user) {
            $http.post('/api/vorkurs/anmelden/', {
                    name: user.name,
                    email: user.email,
                    emailConfirm: user.emailConfirm,
                    kurs: user.kurs.id,
                    studiengang: user.studiengang,
                    sex: user.sex
                })
                .success(this.onIdentity.bind(this))
                .error(this.onIdFail.bind(this));
        };

        VorkursKlass.prototype.edit = function (user) {
            $http.post('/api/vorkurs/edit' + $stateParams.tokenId, {
                    password: user.password,
                    confirmPassword: user.confirmPassword
                })
                .success(this.onIdentity.bind(this))
                .error(this.onIdFail.bind(this));
        };

        VorkursKlass.prototype.resend = function (user) {
            $http.post('/api/vorkurs/resend', {
                    text: user.email
                })
                .success(function (response) {
                    $rootScope.$emit('forgotmailsent', response);
                })
                .error(this.onIdFail.bind(this));
        };

        return VorkursObj;
    }
]);
