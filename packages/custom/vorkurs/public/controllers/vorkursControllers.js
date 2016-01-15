'use strict';

/* jshint -W098 */
angular.module('mean.vorkurs', ['mean.system'])
    .controller('VorkursController', ['$scope', 'Global', 'Vorkurs', '$meanConfig',
        function ($scope, Global, Vorkurs, $meanConfig) {
            $scope.global = Global;
            var conf = $meanConfig.vorkursConfig;
            $scope.$watch('conf.emailEnc', function () {
                conf.email = atob(conf.emailEnc);
            });
            $scope.package = conf;
        }
    ])
    .controller('VorkursRegController', ['$rootScope', 'Vorkurs', '$meanConfig',
        function ($rootScope, Vorkurs, $meanConfig) {

            var vm = this;

            vm.sex = {
                frau: 'Frau',
                herr: 'Herr',
                ka: 'keine Angabe'
            };

            vm.studiengang = $meanConfig.vorkursConfig.studiengang;

            vm.kurs = $meanConfig.vorkursConfig.kurse;

            vm.user = {};

            vm.registerForm = Vorkurs.registerForm = true;

            // Register the register() function
            vm.register = function () {
                Vorkurs.register(this.user);
            };

            $rootScope.$on('registerfailed', function () {
                vm.registerError = Vorkurs.registerError;
            });
        }
    ])
    .config(['$viewPathProvider', function ($viewPathProvider) {
        $viewPathProvider.override('system/views/index.html', 'vorkurs/views/index.html');
    }]);
