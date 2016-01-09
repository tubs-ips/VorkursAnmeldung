'use strict';

angular.module('mean.vorkurs').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('vorkurs example page', {
      url: '/vorkurs/example',
      templateUrl: 'vorkurs/views/index.html'
    });
  }
]);
