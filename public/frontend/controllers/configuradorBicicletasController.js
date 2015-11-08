/**
 * Created by Lina8a on 06/11/2015.
 */

ruedapp.controller('configuradorBicicletasController', ['$scope', '$rootScope', '$http', '$cookies',
    function ($scope, $rootScope, $http, $cookies) {
        $scope.pasoConfigurador = 1;

        $scope.bicicleta = {};
        $scope.bicicleta.accesorios = [];

        $scope.alertas = []

        $scope.cerrarAlerta = function (index) {
            $scope.alertas.splice(index, 1);
        };

        function adicionarAlerta(alertaTipo, alertaTexto) {
            $scope.alertas.push({type: alertaTipo, msg: alertaTexto});
        }

        /**
         * Definición selectable de los distintos pasos del configurador
         */
        $(function () {

            var color = $("#ruedapps-selectable-color");
            color.selectable({
                selected: function (event, ui) {
                    $(".ui-selected", this).each(function () {
                        console.log($(this).attr('value'));
                        $scope.bicicleta.color = $(this).attr('value');
                        //alert("Color seleccionado: " + $scope.bicicleta.color);
                        adicionarAlerta("success", "Color seleccionado: " + $scope.bicicleta.color);
                    });
                }
            });

            var tamanio = $("#ruedapps-selectable-tamanio");
            tamanio.selectable({
                selected: function (event, ui) {
                    $(".ui-selected", this).each(function () {
                        console.log($(this).attr('value'));
                        $scope.bicicleta.tamanio = $(this).attr('value');
                        //alert("Tamaño seleccionado: " + $scope.bicicleta.tamanio);
                        adicionarAlerta("success", "Tamaño seleccionado: " + $scope.bicicleta.tamanio);
                    });
                }
            });

            var llantas = $("#ruedapps-selectable-llantas");
            llantas.selectable({
                selected: function (event, ui) {
                    $(".ui-selected", this).each(function () {
                        console.log($(this).attr('value'));
                        $scope.bicicleta.llantas = $(this).attr('value');
                        //alert("Tipo llantas seleccionadas: " + $scope.bicicleta.llantas);
                        adicionarAlerta("success", "Tipo llantas seleccionadas: " + $scope.bicicleta.llantas);
                    });
                }
            });

            var sillin = $("#ruedapps-selectable-sillin");
            sillin.selectable({
                selected: function (event, ui) {
                    $(".ui-selected", this).each(function () {
                        console.log($(this).attr('value'));
                        $scope.bicicleta.sillin = $(this).attr('value');
                        //alert("Tipo sillin seleccionado: " + $scope.bicicleta.sillin);
                        adicionarAlerta("success", "Tipo sillin seleccionado: " + $scope.bicicleta.sillin);
                    });
                }
            });

            var accesorios = $("#ruedapps-selectable-accesorios");
            accesorios.selectable({
                selected: function (event, ui) {
                    $(".ui-selected", this).each(function () {
                        var accesorio = $(this).attr('value');
                        console.log(accesorio);
                        console.log($.inArray(accesorio, $scope.bicicleta.accesorios))
                        if ($.inArray(accesorio, $scope.bicicleta.accesorios) > -1) {
                            alert("Ya seleccionó el accesorio: " + accesorio);
                        } else {
                            $scope.bicicleta.accesorios.push(accesorio);
                        }
                    });
                }
            });
        });

        $scope.retroceder = function() {
            if($scope.pasoConfigurador > 1) {
                $scope.pasoConfigurador -= 1;
            }
        }

        $scope.avanzar = function() {
            if($scope.pasoConfigurador < 5) {
                if ($scope.pasoConfigurador == 1) {
                    if ($scope.bicicleta.color) {
                        $scope.pasoConfigurador += 1;
                    } else {
                        //alert("Aún no ha seleccionado un color");
                        adicionarAlerta("danger", "Aún no ha seleccionado un color");
                    }
                }
                if ($scope.pasoConfigurador == 2) {
                    if ($scope.bicicleta.tamanio) {
                        $scope.pasoConfigurador += 1;
                    } else {
                        //alert("Aún no ha seleccionado un tamaño");
                        adicionarAlerta("danger", "Aún no ha seleccionado un tamaño");
                    }
                }
                if ($scope.pasoConfigurador == 3) {
                    if ($scope.bicicleta.llantas) {
                        $scope.pasoConfigurador += 1;
                    } else {
                        //alert("Aún no ha seleccionado un tipo de llantas");
                        adicionarAlerta("danger", "Aún no ha seleccionado un tipo de llantas");
                    }
                }
                if ($scope.pasoConfigurador == 4) {
                    if ($scope.bicicleta.sillin) {
                        $scope.pasoConfigurador += 1;
                    } else {
                        //alert("Aún no ha seleccionado un tipo de sillin");
                        adicionarAlerta("danger", "Aún no ha seleccionado un tipo de sillin");
                    }
                }
            }
        }

        $scope.finalizarConfiguracion = function() {

            var bicicleta = $scope.bicicleta;

            console.log("Bicicleta: " + JSON.stringify($scope.bicicleta));

            var post = {
                method: 'POST',
                url: '/bicicleta',
                headers: { 'Content-Type': 'application/json'},
                data: JSON.stringify(bicicleta)
            };

            $http(post).success(function (data) {
                console.log("Registró");
                console.log("data: "+ data);
                window.location.replace('#/inicio');

            }).error(function (data) {
                console.log("Error registro.");
                console.log("data: "+ data);
            });

        }
    }]);