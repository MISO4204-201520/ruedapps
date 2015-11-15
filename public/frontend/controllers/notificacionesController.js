/*
 * Created by lina on 9/30/15.
 */

ruedapp.controller('notificacionesController', ['$scope', '$rootScope', '$location', '$http',
    function ($scope, $rootScope, $location, $http) {
        // No hay alertas iniciales
        $scope.alerts = [];

        /*
         Mostrar notificaciones
         */
        $scope.consultaNotificaciones = function () {
            consultaRutasHoy();
            consultaRutasInvitado();
        };

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };

        function addAlert(alertType, alertText) {
            $scope.alerts.push({type: alertType, msg: alertText});
        }

        function consultaRutasInvitado() {
            var get = {
                method: 'get',
                url: '/recorrido/programacion/invitado/0',
                headers: {'Content-Type': 'application/json'}
            };

            $http(get).success(function (data) {
                console.log("consulta rutas invitado ok");
                data.forEach(function (ruta) {
                    addAlert("info", "Ruta: usted fue invitado a la ruta '" + ruta.nombre + "' por su amigo " + ruta.organizador.nombres);
                });
            }).error(function (data) {
                console.log("info", "Error consulta rutas invitado : " + data);
            });
        }

        function consultaRutasHoy() {
            var get = {
                method: 'get',
                url: '/recorrido/programacion/participante/0',
                headers: {'Content-Type': 'application/json'}
            };

            $http(get).success(function (data) {
                console.log("consulta rutas hoy ok");
                data.forEach(function (ruta) {
                    if (myDayDiff(ruta.fechaInicio, Date.now()) <= 1) {
                        addAlert("warning", "Ruta: Hoy usted tiene programada la ruta '" + ruta.nombre + "'.");
                    }
                });
            }).error(function (data) {
                console.log("info", "Error consulta rutas hoy: " + data);
            });
        }

        function myDayDiff(first, second) {
            return Math.abs(Math.round((second - first) / (1000 * 60 * 60 * 24)));
        }
    }]);
