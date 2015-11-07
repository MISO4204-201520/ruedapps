/**
 * Created by Lina8a on 06/11/2015.
 */

ruedapp.controller('configuradorBicicletasController', ['$scope', '$rootScope', '$http', '$cookies',
    function ($scope, $rootScope, $http, $cookies) {
        $scope.pasoConfigurador = 1;

        /**
         * Definición selectable de los distintos pasos del configurador
         */
        $(function () {
            $scope.accesoriosSeleccionados = [];

            var color = $("#ruedapps-selectable-color");
            color.selectable({
                selected: function (event, ui) {
                    //TODO
                }
            });
            color.on("selectableselected", function (event, ui) {
            });

            var tamanio = $("#ruedapps-selectable-tamanio");
            tamanio.selectable({
                selected: function (event, ui) {
                    //TODO
                }
            });
            tamanio.on("selectableselected", function (event, ui) {
            });

            var llantas = $("#ruedapps-selectable-llantas");
            llantas.selectable({
                selected: function (event, ui) {
                    //TODO
                }
            });
            llantas.on("selectableselected", function (event, ui) {
            });

            var sillin = $("#ruedapps-selectable-sillin");
            sillin.selectable({
                selected: function (event, ui) {
                    //TODO
                }
            });
            sillin.on("selectableselected", function (event, ui) {
            });

            var accesorios = $("#ruedapps-selectable-accesorios");
            accesorios.selectable({
                selected: function (event, ui) {
                    $scope.noAmigosSeleccionados.push(ui.selected.value);
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
            //TODO
        }
    }]);