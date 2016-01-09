'use strict';

/* jshint -W098 */
angular.module('mean.vorkurs').controller('VorkursController', ['$scope', 'Global', 'Vorkurs',
  function($scope, Global, Vorkurs) {
    $scope.global = Global;
    $scope.package = {
      name: 'vorkurs'
    };
  }
]);
