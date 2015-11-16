/*
 * Created by lina on 9/30/15.
 */
(function() {
    var ruedapp = angular.module('ruedapp');
    ruedapp.controller('directorioController', ['$scope', '$rootScope', '$http', '$cookies', 'leafletData',
        function ($scope, $rootScope, $http, $cookies, leafletData) {

            $scope.categorias = null;
            $scope.serviciosPorCategoria = null;
            $scope.categoriaSeleccionada = null;
            $scope.ubicacionServicio = null;

            var mainMarker = {
                lat: 4.711245,
                lng: -74.077608,
                focus: true,
                message: "Arrastrame para indicar tu ubicación",
                draggable: true
            };

            angular.extend($scope, {
                bogota: {
                    lat: 4.711245,
                    lng: -74.077608,
                    zoom: 11
                },
                markers: {
                    mainMarker: angular.copy(mainMarker)
                },
                position: {
                    lat: 4.711245,
                    lng: -74.077608
                },
                events: { // or just {} //all events
                    markers: {
                        enable: ['dragend']
                        //logic: 'emit'
                    }
                }
            });

            $scope.$on("leafletDirectiveMarker.dragend", function (event, args) {
                //$scope.position.lat = args.model.lat;
                //$scope.position.lng = args.model.lng;
                console.log("Prueba: " + args.model.lat + ", " + args.model.lng);
                $scope.ubicacionServicio = args.model.lat + ", " + args.model.lng;
            });

            $scope.registrarCategoria = function () {

                if ($scope.form.$valid) {
                    var categoria = $scope.categoria;
                    var post = {
                        method: 'POST',
                        url: '/categoria',
                        headers: {'Content-Type': 'application/json'},
                        data: JSON.stringify(categoria)
                    };

                    $http(post).success(function (data) {
                        console.log("Registró");
                        console.log("data: " + data);
                        window.location.replace('#/inicio');

                    }).error(function (data) {
                        console.log("Error registro.");
                        console.log("data: " + data);
                    });
                }

            };

            $scope.retornarCategorias = function () {

                var get = {
                    method: 'GET',
                    url: '/categoria'
                };

                $http(get).success(function (data) {
                    console.log("Recuperó todas las categorías");
                    console.log("data: " + data);
                    $scope.categorias = data;

                }).error(function (data) {
                    console.log("Error recuperando las categorías.");
                    console.log("data: " + data);
                });

            };

            $scope.seleccionarCategoria = function (value) {
                console.log("Se va a adicionar la categoria " + value.id + " a la sesión");
                $cookies.put('idCategoriaSeleccionada', value.id);
            };

            $scope.retornarServiciosPorCategoria = function () {

                var idCategoria = $cookies.get('idCategoriaSeleccionada');
                console.log("Id de la categoría en sesión:  " + idCategoria);

                var get = {
                    method: 'GET',
                    url: '/categoria/' + idCategoria + '/servicio'
                };

                $http(get).success(function (data) {
                    console.log("Recuperó todos los servicios de la categoria: " + idCategoria);
                    console.log("data: " + data);
                    $scope.serviciosPorCategoria = data;

                }).error(function (data) {
                    console.log("Error recuperando los servicios de la categoria: " + idCategoria);
                    console.log("data: " + data);
                });

            };

            $scope.registrarServicio = function () {

                var idCategoria = $cookies.get('idCategoriaSeleccionada');
                console.log("Categoría a la cual se le va a adicionar un servicio: " + idCategoria);

                if ($scope.form.$valid) {
                    var servicio = $scope.servicio;
                    var ubicacionServicio = $scope.ubicacionServicio;

                    console.log("Ubicacion: " + ubicacionServicio);

                    var latLng = ubicacionServicio.split(",");
                    var latitud = latLng[0];
                    var longitud = latLng[1];

                    servicio.ubicacion = {
                        nombre: servicio.nombre,
                        latitud: latitud,
                        longitud: longitud
                    };

                    console.log(servicio);

                    var post = {
                        method: 'POST',
                        url: '/categoria/' + idCategoria + '/servicio',
                        headers: {'Content-Type': 'application/json'},
                        data: JSON.stringify(servicio)
                    };

                    $http(post).success(function (data) {
                        console.log("Registró");
                        console.log("data: " + data);
                        window.location.replace('#/categoria/servicios');

                    }).error(function (data) {
                        console.log("Error registro.");
                        console.log("data: " + data);
                    });
                }

            }

        }]);
})();