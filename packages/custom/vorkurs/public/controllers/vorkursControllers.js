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
    .controller('VorkursRegController', ['$rootScope', '$scope', 'Vorkurs', '$meanConfig', '$location',
        function ($rootScope, $scope, Vorkurs, $meanConfig, $location) {
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

            if ($rootScope.registerfailied === undefined) {
                $rootScope.registerfailied = $rootScope.$on('registerfailed', function () {
                    vm.registerError = Vorkurs.registerError;
                });
            }

            if ($rootScope.registersuccess === undefined) {
                $rootScope.registersuccess = $rootScope.$on('registersuccess', function () {
                    $location.path('/vorkurs/status/' + Vorkurs.token).replace();
                });
            }

        }
    ])
    .controller('VorkursResendController', ['$rootScope', '$scope', 'Vorkurs', 'ngDialog',
        function ($rootScope, $scope, Vorkurs, ngDialog) {
            var vm = this;

            vm.user = {};

            // Register the register() function
            vm.resend = function () {
                Vorkurs.resend(this.user);
            };

            if ($rootScope.resendfailed == undefined) {
                $rootScope.resendfailed = $rootScope.$on('resendfailed', function () {
                    vm.resendError = Vorkurs.resendError;
                });
            }

            if ($rootScope.resendsuccess === undefined) {
                $rootScope.resendsuccess = $rootScope.$on('resendsuccess', function () {
                    ngDialog.open({
                        template: 'firstDialog',
                        className: 'ngdialog-theme-default ngdialog-theme-custom'
                    });
                });
            }
        }
    ])
    .controller('VorkursStatusController', ['$rootScope', '$scope', 'Vorkurs', '$meanConfig', '$stateParams', '$location',
        function ($rootScope, $scope, Vorkurs, $meanConfig, $stateParams, $location) {
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

            if ($rootScope.usersuccess === undefined) {
                $rootScope.usersuccess = $rootScope.$on('usersuccess', function () {
                    vm.user.name = Vorkurs.user.name;
                    vm.user.email = Vorkurs.user.email;
                    vm.user.gruppen = Vorkurs.user.gruppen;
                    vm.user.token = Vorkurs.user.token;
                    vm.user.studiengang = Vorkurs.user.studiengang;
                    vm.user.sex = vm.sex[Vorkurs.user.sex];
                    vm.user.kurs = vm.kurs[Vorkurs.user.kurs];
                });
            }

            if ($rootScope.userfailed === undefined) {
                $rootScope.userfailed = $rootScope.$on('userfailed', function () {
                    vm.userError = Vorkurs.userError;
                });
            }
        }
    ])
    .controller('VorkursEditController', ['$rootScope', '$scope', 'Vorkurs', '$meanConfig', '$stateParams', '$location',
        function ($rootScope, $scope, Vorkurs, $meanConfig, $stateParams, $location) {
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



            if ($rootScope.editsuccess === undefined) {
                $rootScope.editsuccess = $rootScope.$on('editsuccess', function () {
                    $location.path('/vorkurs/status/' + vm.token).replace();
                });
            }

            if ($rootScope.editfailed === undefined) {
                $rootScope.editfailed = $rootScope.$on('editfailed', function () {
                    vm.editError = Vorkurs.editError;
                });
            }

            if ($rootScope.usersuccess1 === undefined) {
                $rootScope.usersuccess1 = $rootScope.$on('usersuccess1', function () {
                    vm.user.name = Vorkurs.user.name;
                    vm.user.email = Vorkurs.user.email;
                    vm.user.gruppen = Vorkurs.user.gruppen;
                    vm.user.token = Vorkurs.user.token;
                    vm.user.studiengang = Vorkurs.user.studiengang;
                    vm.user.sex = vm.sex[Vorkurs.user.sex];
                    vm.user.kurs = vm.kurs[Vorkurs.user.kurs];
                });
            }

            if ($rootScope.userfailed1 === undefined) {
                $rootScope.userfailed1 = $rootScope.$on('userfailed1', function () {
                    vm.userError = Vorkurs.userError;
                });
            }
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
