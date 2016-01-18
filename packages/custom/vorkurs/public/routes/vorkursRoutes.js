'use strict';


angular.module('mean.vorkurs').config(['$stateProvider', '$httpProvider', 'jwtInterceptorProvider',
    function ($stateProvider, $httpProvider, jwtInterceptorProvider) {

        jwtInterceptorProvider.tokenGetter = function () {
            return localStorage.getItem('JWT');
        };

        $httpProvider.interceptors.push('jwtInterceptor');

        // states for my app
        $stateProvider
            .state('vorkurs anmeldung', {
                url: '/vorkurs/anmeldung',
                templateUrl: 'vorkurs/views/register.html'
            })
            .state('vorkurs resend', {
                url: '/vorkurs/resend',
                templateUrl: 'vorkurs/views/resend.html'
            })
            .state('vorkurs status', {
                url: '/vorkurs/status/:userToken',
                templateUrl: 'vorkurs/views/status.html'
            })
            .state('vorkurs edit', {
                url: '/vorkurs/edit/:userToken',
                templateUrl: 'vorkurs/views/edit.html'
            });
    }
]);