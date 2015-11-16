/**
 * Created by Lina8a on 15/11/2015.
 */
(function() {
    var ruedapp = angular.module('ruedapp');
    ruedapp.controller('amigosController', ['$scope', '$rootScope', '$location', '$http',
        function ($scope, $rootScope, $location, $http) {

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
                var get1 = {
                    method: 'GET',
                    url: '/ciclista/' + $rootScope.globals.currentUser.userId + '/amigos'
                };
                $http(get1).success(function (data) {
                    $scope.amigos = data;

                }).error(function (data) {
                    console.log("Error consulta amigos");
                    console.log("data: " + data);
                });

                var get2 = {
                    method: 'GET',
                    url: '/ciclista/' + $rootScope.globals.currentUser.userId + '/no-amigos'
                };
                $http(get2).success(function (data) {
                    $scope.noAmigos = data;

                }).error(function (data) {
                    console.log("Error consulta no amigos");
                    console.log("data: " + data);
                });
            };

            $scope.agregarAmigo = function () {
                $scope.noAmigosSeleccionados.forEach(function (element) {
                    var post = {
                        method: 'POST',
                        url: '/ciclista/' + $rootScope.globals.currentUser.userId + '/amigos/' + element,
                        headers: {'Content-Type': 'application/json'}
                    };

                    $http(post).success(function (data) {
                        console.log("Creó amigo");
                        $scope.consultaAmigosCiclistas();
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
                        url: '/ciclista/' + $rootScope.globals.currentUser.userId + '/amigos/' + element,
                        headers: {'Content-Type': 'application/json'}
                    };

                    $http(del).success(function () {
                        console.log("Eliminó amigo");
                        $scope.consultaAmigosCiclistas();
                        window.location.replace('#/amigos');

                    }).error(function (data) {
                        console.log("Error eliminar amigo.");
                        console.log("data: " + data);
                    });
                });
            }

        }]);
})();