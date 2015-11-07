/**
 * Created by Juan on 11/6/2015.
 */
ruedapp.controller('reporteController', ['$scope', '$rootScope', '$http', '$filter', 'leafletData', 'ngTableParams',
    function ($scope, $rootScope, $http, $filter, leafletData, ngTableParams) {

        var today = new Date();

        $scope.ocultarTabla = true;
        $scope.maxDate = today;
        $scope.minDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

        $scope.reporte = {
            fechaInicial: today,
            fechaFinal: today,
            metrica: 1
        };

        $scope.open = function (cal) {
            if (cal == 'fi') {
                $scope.status.openedfi = true;
            }
            else {
                $scope.status.openedff = true;
            }
        };

        $scope.status = {
            openedfi: false,
            openedff: false
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        var initialParams = {
            count: 10
        };

        var data = [];
        $scope.tableParams = new ngTableParams(initialParams, {data:data});

        $scope.consultahistorico = function () {

            if (typeof($scope.reporte.fechaInicial) == 'undefined' || typeof($scope.reporte.fechaFinal) == 'undefined') {
                return;
            }

            var fechaInicial = $scope.reporte.fechaInicial.getFullYear() + '-' +  ($scope.reporte.fechaInicial.getMonth() + 1) + '-' + $scope.reporte.fechaInicial.getDate();
            var fechaFinal = $scope.reporte.fechaFinal.getFullYear() + '-' +  ($scope.reporte.fechaFinal.getMonth() + 1) + '-' + $scope.reporte.fechaFinal.getDate();

            var get = {
                method: 'get',
                url: '/reporte/metrica/historico/' + fechaInicial + '/' + fechaFinal + '/0',
                headers: {'Content-Type': 'application/json'}
            };

            $http(get).success(function (data) {
                console.log("consulta ok");
                $scope.tableParams.settings({
                    data: data
                });

            }).error(function (data) {
                console.log("Error consulta historico : " + data);
            });
        }


        $scope.consultametricas = function () {

            if (typeof($scope.reporte.fechaInicial) == 'undefined' || typeof($scope.reporte.fechaFinal) == 'undefined') {
                return;
            }

            var fechaInicial = $scope.reporte.fechaInicial.getFullYear() + '-' +  ($scope.reporte.fechaInicial.getMonth() + 1) + '-' + $scope.reporte.fechaInicial.getDate();
            var fechaFinal = $scope.reporte.fechaFinal.getFullYear() + '-' +  ($scope.reporte.fechaFinal.getMonth() + 1) + '-' + $scope.reporte.fechaFinal.getDate();
            var url = '/reporte/metrica/' + ($scope.reporte.metrica == 1 ? 'distancia' : 'tiempo') + '/' + fechaInicial + '/' + fechaFinal + '/0';

            var get = {
                method: 'get',
                url: url,
                headers: {'Content-Type': 'application/json'}
            };

            $http(get).success(function (data) {
                console.log("consulta ok");
                cargarGrafica(data)
                $scope.tableParams.settings({
                    data: data
                });
            }).error(function (data) {
                console.log("Error consulta historico : " + data);
            });
        }

        function cargarGrafica(data) {

            $scope.tituloValor = ($scope.reporte.metrica == 1 ? 'Distancia' : 'Duraci\u00F3n(Min)');
            $scope.labels = [];
            $scope.series = [$scope.tituloValor];
            $scope.data = [[]];

            data.forEach(function(entry) {
                $scope.labels.push($filter('date')(new Date(entry.fecha)));
                $scope.data[0].push(entry.valor);
            });
        }

    }
]);