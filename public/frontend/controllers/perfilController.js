/*
 * Created by lina on 9/30/15.
 */

ruedapp.controller('perfilController', ['$scope','$rootScope', '$location', '$http', '$cookies', 'AUTH_EVENTS', 'AuthFactory','oauthFactory',
    function ($scope, $rootScope, $location, $http, $cookies, AUTH_EVENTS, AuthFactory,oauthFactory) {
        /**
         * Definición datepicker
         * @type {Date}
         */

        var today = new Date();
        $scope.minDate = '1900/01/01';
        $scope.maxDate = today;

        $scope.open = function () {
            $scope.status.opened = true;
        };

        $scope.status = {
            opened: false
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.registrar = function () {
            if ($scope.form.$valid) {
                var userInfo = $scope.userInfo;
                var post = {
                    method: 'POST',
                    url: '/usuario',
                    headers: {'Content-Type': 'application/json'},
                    data: JSON.stringify(userInfo)
                };

                $http(post).success(function (data) {
                    console.log("Registró");
                    console.log("data: " + data);
                    window.location.replace('/');

                }).error(function (data) {
                    console.log("Error registro.");
                    console.log("data: " + data);
                });
            }
        };

        $scope.login = function () {
            var credentials = $scope.credentials;
            if ($scope.form.$valid) {
                AuthFactory.login(credentials).then(function () {
                    $rootScope.loggedIn = true;
                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                    $rootScope.provider = "";
                    window.location.replace('#/inicio');
                }, function () {
                    $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                });
            }
        };

        $scope.logout = function () {
            AuthFactory.logout().then(function () {
                $rootScope.loggedIn = false;
                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
                window.location.replace('/');
            }, function () {
                console.error("Error logout.");
            });
        };

        $scope.authenticate = function(provider) {
            oauthFactory.initialize(provider);
            oauthFactory.connect().then(function(){
                $rootScope.loggedIn = true;
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                $rootScope.provider = provider;

            });

        };

        $scope.consultarBicicletasUsuario = function () {
            var get = {
                method: 'GET',
                url: '/usuario/' + $rootScope.globals.currentUser.userId
            };
            $http(get).success(function (data) {
                console.log("Obtuvo usuario");
                console.log("data: " + data);
                $scope.userGlobalId = data;

                get = {
                    method: 'GET',
                    url: '/ciclista/' + $rootScope.globals.currentUser.userId + '/bicicletas'
                };

                $http(get).success(function (data) {
                    console.log("Obtuvo bicicletas");
                    console.log("data: " + data);
                    $scope.bicicletas = data;

                }).error(function (data) {
                    console.log("Error consulta bicicletas");
                    console.log("data: " + data);
                });

            }).error(function (data) {
                console.log("Error obtención ciclista");
                console.log("data: " + data);
            });

        }

        $scope.obtenerAccesoriosBicicleta = function (value) {

            console.log("VALOR: " + value)
            var idBicicleta = value;
            console.log("Id de bicicleta: " + idBicicleta);

            var get = {
                method: 'GET',
                url: '/bicicleta/' + idBicicleta + '/accesorios'
            };

            $http(get).success(function (data) {
                console.log("Recuperó los accesorios de la bicicleta: " + idBicicleta);
                console.log("data: " + data);
                $scope.accesorios = data;

            }).error(function (data) {
                console.log("Error recuperando los accesorios de la bicicleta: " + idBicicleta);
                console.log("data: "+ data);
            });

        }

    }]);
