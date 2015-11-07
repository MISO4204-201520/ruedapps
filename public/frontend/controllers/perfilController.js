/*
 * Created by lina on 9/30/15.
 */

ruedapp.controller('perfilController', ['$scope', '$rootScope', '$location', '$http', '$cookies', 'AUTH_EVENTS', 'AuthFactory',
    function ($scope, $rootScope, $location, $http, $cookies, AUTH_EVENTS, AuthFactory) {
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

        /**
         * Definición selectable amigos
         */
        $scope.llenarSelectableAmigos = function () {
            $scope.amigosSeleccionados = [];

            var amigos = $("#ruedapps-selectable-amigos");
            amigos.selectable({
                selected: function (event, ui) {
                    $scope.amigosSeleccionados.push(ui.selected.value);
                }
            });
        };

        /**
         * Definición selectable ciclistas (no amigos)
         */
        $scope.llenarSelectableCiclistas = function () {
            $scope.noAmigosSeleccionados = [];

            var ciclistas = $("#ruedapps-selectable-ciclistas");
            ciclistas.selectable({
                selected: function (event, ui) {
                    $scope.noAmigosSeleccionados.push(ui.selected.value);
                }
            });
        };

        /**
         * Obtención de amigos y ciclistas de la plataforma.
         */
        $scope.consultaAmigosCiclistas = function () {
            var get = {
                method: 'GET',
                url: '/ciclista/' + $rootScope.globals.currentUser.userId
            };

            $http(get).success(function (data) {
                console.log("Obtuvo usuario");
                console.log("data: " + data);
                $scope.userGlobalId = data;

                var get1 = {
                    method: 'GET',
                    url: '/ciclista/' + $scope.userGlobalId + '/amigos'
                };
                $http(get1).success(function (data) {
                    $scope.amigos = data;

                }).error(function (data) {
                    console.log("Error consulta amigos");
                    console.log("data: " + data);
                });

                var get2 = {
                    method: 'GET',
                    url: '/ciclista/' + $scope.userGlobalId + '/no-amigos'
                };
                $http(get2).success(function (data) {
                    $scope.noAmigos = data;

                }).error(function (data) {
                    console.log("Error consulta no amigos");
                    console.log("data: " + data);
                });

            }).error(function (data) {
                console.log("Error obtención ciclista");
                console.log("data: " + data);
            });
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

        $scope.editarPerfil = function () {
            if ($scope.form.$valid) {
                var userInfo = $scope.userInfo;
                var put = {
                    method: 'PUT',
                    url: '/usuario',
                    headers: {'Content-Type': 'application/json'},
                    data: JSON.stringify(userInfo)
                };

                $http(put).success(function () {
                    console.log("Modificó");
                    window.location.replace('/');

                }).error(function (data) {
                    console.log("Error registro.");
                    console.log("data: " + data);
                });
            }
        };

        $scope.agregarAmigo = function () {
            $scope.noAmigosSeleccionados.forEach(function (element) {
                var post = {
                    method: 'POST',
                    url: '/ciclista/' + $scope.userGlobalId + '/amigos/' + element,
                    headers: {'Content-Type': 'application/json'}
                };

                $http(post).success(function () {
                    console.log("Creó amigo");
                    window.location.replace('#/amigos');

                }).error(function (data) {
                    console.log("Error creación amigo.");
                    console.log("data: " + data);
                });
            });
        };

        $scope.eliminarAmigo = function () {
            $scope.amigosSeleccionados.forEach(function (element) {
                var del = {
                    method: 'DELETE',
                    url: '/ciclista/' + $scope.userGlobalId + '/amigos/' + element,
                    headers: {'Content-Type': 'application/json'}
                };

                $http(del).success(function () {
                    console.log("Eliminó amigo");
                    window.location.replace('#/amigos');

                }).error(function (data) {
                    console.log("Error eliminar amigo.");
                    console.log("data: " + data);
                });
            });
        }
    }]);