'use strict';


angular.module('mean.vorkurs').config(['$stateProvider', '$httpProvider', 'jwtInterceptorProvider',
  function($stateProvider, $httpProvider, jwtInterceptorProvider) {

    jwtInterceptorProvider.tokenGetter = function() {
      return localStorage.getItem('JWT');
    };

    $httpProvider.interceptors.push('jwtInterceptor');

    // states for my app
      $stateProvider
        .state('vorkurs anmeldung', {
          url: '/vorkurs/anmeldung',
          templateUrl: 'vorkurs/views/anmeldung.html'
        })
        .state('vorkurs anmeldung resend', {
          url: '/vorkurs/resend',
          templateUrl: 'vorkurs/views/resend.html'
        })
        .state('vorkurs anmeldung change', {
          url: '/vorkurs/staus/:tokenId',
          templateUrl: 'vorkurs/views/status.html'
        });
  }
]);