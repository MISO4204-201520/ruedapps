/**
 * Created by Lina8a on 06/11/2015.
 */

ruedapp.controller('configuradorBicicletasController', ['$scope', '$rootScope', '$http', '$cookies',
    function ($scope, $rootScope, $http, $cookies) {
        $scope.pasoConfigurador = 1;

        $scope.bicicleta = {};
        $scope.bicicleta.accesorios = [];

        $scope.bicicleta.accesorioCanasta = '';
        $scope.bicicleta.accesorioPito = '';

        $scope.alertas = []

        $scope.cerrarAlerta = function (index) {
            $scope.alertas.splice(index, 1);
        }

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
                    });
                }
            });

            var tamanio = $("#ruedapps-selectable-tamanio");
            tamanio.selectable({
                selected: function (event, ui) {
                    $(".ui-selected", this).each(function () {
                        console.log($(this).attr('value'));
                        $scope.bicicleta.tamanio = $(this).attr('value');
                    });
                }
            });

            var llantas = $("#ruedapps-selectable-llantas");
            llantas.selectable({
                selected: function (event, ui) {
                    $(".ui-selected", this).each(function () {
                        console.log($(this).attr('value'));
                        $scope.bicicleta.llantas = $(this).attr('value');
                    });
                }
            });

            var sillin = $("#ruedapps-selectable-sillin");
            sillin.selectable({
                selected: function (event, ui) {
                    $(".ui-selected", this).each(function () {
                        console.log($(this).attr('value'));
                        $scope.bicicleta.sillin = $(this).attr('value');
                    });
                }
            });

            var accesorios = $("#ruedapps-selectable-accesorios");
            accesorios.selectable({
                selected: function (event, ui) {
                    $(".ui-selected", this).each(function () {
                        var accesorio = $(this).attr('value');

                        if(accesorio == "Canasta") {
                            $scope.bicicleta.accesorioCanasta = 'ruedapps-selected-configurador-option';
                            console.log("Registra Canasta" + $scope.bicicleta.accesorioCanasta);
                        }
                        else {
                            $scope.bicicleta.accesorioPito = 'ruedapps-selected-configurador-option';
                            console.log("Registra Pito" + $scope.bicicleta.accesorioPito);
                        }

                        console.log(accesorio);
                        console.log($.inArray(accesorio, $scope.bicicleta.accesorios))
                        if ($.inArray(accesorio, $scope.bicicleta.accesorios) == -1) {
                            $scope.bicicleta.accesorios.push(accesorio);
                        } else {
                            console.log("Ya fue seleccionado el accesorio: " + accesorio);
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
                alert("Felicidades! Su bicicleta ha sido configurada.");
                window.location.replace('#/historicoBicicletas');

            }).error(function (data) {
                console.log("Error registro.");
                console.log("data: "+ data);
            });

        }

        $scope.consultarBicicletasUsuario = function () {
            get = {
                method: 'GET',
                url: '/ciclista/' + $rootScope.globals.currentUser.userId + '/bicicletas'
            };

            $http(get).success(function (data) {
                console.log("Obtuvo bicicletas");
                console.log("data: " + data);
                $scope.bicicletas = data;

                for(var i = 0; i < $scope.bicicletas.length; i++) {
                    $scope.obtenerAccesoriosBicicleta($scope.bicicletas[i].id, i);
                }

            }).error(function (data) {
                console.log("Error consulta bicicletas");
                console.log("data: " + data);
            });

        }

        $scope.obtenerAccesoriosBicicleta = function (value, posicion) {

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
                $scope.bicicletas[posicion].accesorios = data;

            }).error(function (data) {
                console.log("Error recuperando los accesorios de la bicicleta: " + idBicicleta);
                console.log("data: "+ data);
            });

        }
    }]);