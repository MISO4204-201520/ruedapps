/*
 * Created by lina on 9/30/15.
 */

ruedapp.controller('inicioController', ['$scope', '$rootScope', '$location', '$http',
    function ($scope, $rootScope, $location, $http) {
        /**
         * Obtención de amigos y usuarios de la plataforma.
         */
        $(function () {
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
                    console.log("Error amigos.");
                    console.log("data: " + data);
                });

            }).error(function (data) {
                console.log("Error obtención id.");
                console.log("data: " + data);
            });
        });

        var planearRecorrido = function () {
            window.location.replace('#/recorridos');
        };

        var enviarMensaje = function () {
            window.location.replace('#/mensaje');
        };

        var agregarAmigo = function () {
            window.location.replace('#/amigos');
        };

    }]);
