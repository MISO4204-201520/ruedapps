/**
 * Created by Juan on 11/6/2015.
 */
ruedapp.controller('reporteController', ['$scope', '$rootScope', '$http', 'leafletData', 'ngTableParams',
    function ($scope, $rootScope, $http, leafletData, ngTableParams) {

        var today = new Date();

        $scope.ocultarTabla = true;
        $scope.maxDate = today;
        $scope.minDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

        $scope.reporte = {
            fechaInicial: today,
            fechaFinal: today
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

            var fechaInicial = $scope.reporte.fechaInicial.getFullYear() + '-' +  $scope.reporte.fechaInicial.getMonth() + '-' + $scope.reporte.fechaInicial.getDay();
            var fechaFinal = $scope.reporte.fechaFinal.getFullYear() + '-' +  $scope.reporte.fechaFinal.getMonth() + '-' + $scope.reporte.fechaFinal.getDay();

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


    }
]);