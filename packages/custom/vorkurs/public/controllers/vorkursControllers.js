'use strict';

/* jshint -W098 */
angular.module('mean.vorkurs', ['mean.system', 'ngDialog']) // 'ngDialog'
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
    .controller('VorkursRegController', ['$rootScope', 'Vorkurs', '$meanConfig', '$location',
        function ($rootScope, Vorkurs, $meanConfig, $location) {

            var vm = this;

            vm.sex = $meanConfig.vorkursConfig.sex;

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

            $rootScope.$on('registersuccess', function () {
                $location.path('/vorkurs/status/' + Vorkurs.token).replace();
            });
        }
    ])
    .controller('VorkursResendController', ['$rootScope', 'Vorkurs', 'ngDialog',
        function ($rootScope, Vorkurs, ngDialog) {

            var vm = this;

            vm.user = {};

            // Register the register() function
            vm.resend = function () {
                Vorkurs.resend(this.user);
            };

            $rootScope.$on('resendfailed', function () {
                vm.resendError = Vorkurs.resendError;
            });

            $rootScope.$on('resendsuccess', function () {
                ngDialog.open({
                    template: 'firstDialog',
                    className: 'ngdialog-theme-default ngdialog-theme-custom'
                });
            });
        }
    ])
    .controller('VorkursStatusController', ['$rootScope', 'Vorkurs', '$meanConfig', '$stateParams', '$location',
        function ($rootScope, Vorkurs, $meanConfig, $stateParams, $location) {
            var vm = this;

            vm.token = $stateParams.userToken;

            vm.sex = $meanConfig.vorkursConfig.sex;

            vm.studiengang = $meanConfig.vorkursConfig.studiengang;

            vm.kurs = $meanConfig.vorkursConfig.kurse;

            vm.kurs.abmelden = {
                name: 'Abmelden',
                info: 'Diese Auswahl meldet Sie vom Kurs ab.',
                id: 'abmelden'
            };

            vm.user = {};

            Vorkurs.getUser(vm.token);

            vm.goToEdit = function () {
                $location.path('/vorkurs/edit/' + vm.token).replace();
            };

            $rootScope.$on('usersuccess', function () {
                vm.user.name = Vorkurs.user.name;
                vm.user.email = Vorkurs.user.email;
                vm.user.gruppen = Vorkurs.user.gruppen;
                vm.user.token = Vorkurs.user.token;
                vm.user.studiengang = Vorkurs.user.studiengang;
                vm.user.sex = vm.sex[Vorkurs.user.sex];
                vm.user.kurs = vm.kurs[Vorkurs.user.kurs];
            });

            $rootScope.$on('userfailed', function () {
                vm.userError = Vorkurs.userError;
            });
        }
    ])
    .controller('VorkursEditController', ['$rootScope', 'Vorkurs', '$meanConfig', '$stateParams', '$location',
        function ($rootScope, Vorkurs, $meanConfig, $stateParams, $location) {
            var vm = this;

            vm.token = $stateParams.userToken;

            vm.sex = $meanConfig.vorkursConfig.sex;

            vm.studiengang = $meanConfig.vorkursConfig.studiengang;

            vm.kurs = $meanConfig.vorkursConfig.kurse;

            vm.kurs.abmelden = {
                name: 'Abmelden',
                info: 'Diese Auswahl meldet Sie vom Kurs ab.',
                id: 'abmelden'
            };

            vm.user = {};

            Vorkurs.getUser1(vm.token);

            vm.edit = function () {
                Vorkurs.edit(vm.user);
            };

            $rootScope.$on('editsuccess', function () {
                $location.path('/vorkurs/status/' + vm.token).replace();
            });

            $rootScope.$on('editfailed', function () {
                vm.editError = Vorkurs.editError;
            });

            $rootScope.$on('usersuccess1', function () {
                vm.user.name = Vorkurs.user.name;
                vm.user.email = Vorkurs.user.email;
                vm.user.gruppen = Vorkurs.user.gruppen;
                vm.user.token = Vorkurs.user.token;
                vm.user.studiengang = Vorkurs.user.studiengang;
                vm.user.sex = vm.sex[Vorkurs.user.sex];
                vm.user.kurs = vm.kurs[Vorkurs.user.kurs];
            });

            $rootScope.$on('userfailed1', function () {
                vm.userError = Vorkurs.userError;
            });
        }
    ])
    .config(['$viewPathProvider', function ($viewPathProvider) {
        $viewPathProvider.override('system/views/index.html', 'vorkurs/views/index.html');
    }])
    .factory('resendDialog', function ($dialog) {
        return function () {
            return $dialog.dialog({
                templateUrl: 'products.html'
            });
        };
    });
