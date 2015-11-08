/**
 * Created by Lina8a on 06/11/2015.
 */

ruedapp.controller('configuradorBicicletasController', ['$scope', '$rootScope', '$http', '$cookies',
    function ($scope, $rootScope, $http, $cookies) {
        $scope.pasoConfigurador = 1;

        var bicicleta = {};

        bicicleta.accesorios = [];

        /**
         * Definición selectable de los distintos pasos del configurador
         */
        $(function () {
            //$scope.accesoriosSeleccionados = [];

            var color = $("#ruedapps-selectable-color");
            color.selectable({
                selected: function (event, ui) {
                    $(".ui-selected", this).each(function () {
                        console.log($(this).attr('value'));
                        /*$scope.*/bicicleta.color = $(this).attr('value');
                        alert("Color seleccionado: " + bicicleta.color);
                    });
                }
            });
            color.on("selectableselected", function (event, ui) {
            });

            var tamanio = $("#ruedapps-selectable-tamanio");
            tamanio.selectable({
                selected: function (event, ui) {
                    $(".ui-selected", this).each(function () {
                        console.log($(this).attr('value'));
                        /*$scope.*/bicicleta.tamanio = $(this).attr('value');
                    });
                }
            });
            tamanio.on("selectableselected", function (event, ui) {
            });

            var llantas = $("#ruedapps-selectable-llantas");
            llantas.selectable({
                selected: function (event, ui) {
                    $(".ui-selected", this).each(function () {
                        console.log($(this).attr('value'));
                        /*$scope.*/bicicleta.llantas = $(this).attr('value');
                    });
                }
            });
            llantas.on("selectableselected", function (event, ui) {
            });

            var sillin = $("#ruedapps-selectable-sillin");
            sillin.selectable({
                selected: function (event, ui) {
                    $(".ui-selected", this).each(function () {
                        console.log($(this).attr('value'));
                        /*$scope.*/bicicleta.sillin = $(this).attr('value');
                    });
                }
            });
            sillin.on("selectableselected", function (event, ui) {
            });

            var accesorios = $("#ruedapps-selectable-accesorios");
            accesorios.selectable({
                selected: function (event, ui) {
                    $(".ui-selected", this).each(function () {
                        console.log($(this).attr('value'));
                        /*$scope.*/bicicleta.accesorios.push($(this).attr('value'));
                    });
                }
            });
            accesorios.on("accesoriosSeleccionados", function (event, ui) {
            });
        });

        $scope.retroceder = function() {
            if($scope.pasoConfigurador > 1) {
                $scope.pasoConfigurador -= 1;
            }
        }

        $scope.avanzar = function() {
            if($scope.pasoConfigurador < 5) {
                $scope.pasoConfigurador += 1;
            }
        }

        $scope.finalizarConfiguracion = function() {

            /*var bicicleta = {
                color: $scope.colorSeleccionado,
                tamanio: $scope.tamanioSelecionado,
                llantas: $scope.llantasSeleccionadas,
                sillin: $scope.sillinSeleccionado,
                accesorios: $scope.accesoriosSeleccionados
            };*/

            console.log("Bicicleta: " + JSON.stringify(bicicleta));

            //var bicicleta = $scope.bicicleta;

            var post = {
                method: 'POST',
                url: '/bicicleta',
                headers: { 'Content-Type': 'application/json'},
                //data: JSON.stringify(bicicleta)
                data: {
                    color:"Blanco",
                    tamanio: "Pequeña",
                    llantas: "Montaña",
                    sillin: "Carrera",
                    accesorios: ["Pito"]
                }
            };

            $http(post).success(function (data) {
                console.log("Registró");
                console.log("data: "+ data);
                //window.location.replace('/');

            }).error(function (data) {
                console.log("Error registro.");
                console.log("data: "+ data);
            });

        }
    }]);