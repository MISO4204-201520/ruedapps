/*
 * Created by lina on 9/30/15.
 */
(function() {
    var ruedapp = angular.module('ruedapp');
    ruedapp.controller('notificacionesController', ['$scope', '$rootScope', '$location', '$http', 'APP_CONFIG',
        function ($scope, $rootScope, $location, $http, APP_CONFIG) {

            // Detecta si las rutas grupales están activas en la derivación
            $scope.grupal = APP_CONFIG.grupal;

            //Detecta si las notificaciones están activas en la derivación
            $scope.notificaciones = APP_CONFIG.notificaciones;

            // No hay alertas iniciales
            $scope.alerts = [];

            /*
             Mostrar notificaciones
             */
            $scope.consultaNotificaciones = function () {
                if ($scope.notificaciones) {
                    consultaRutasHoy();
                }

                // Esto solo va si hay rutas grupales
                if ($scope.grupal && $scope.notificaciones) {
                    consultaRutasInvitado();
                }
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
                    url: '/recorrido/programacion/notifinvitado/0',
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
                    url: '/recorrido/programacion/notifhoy/0',
                    headers: {'Content-Type': 'application/json'}
                };

                $http(get).success(function (data) {
                    console.log("consulta rutas hoy ok");
                    data.forEach(function (ruta) {
                        addAlert("warning", "Ruta: Hoy usted tiene programada la ruta '" + ruta.nombre + "'.");
                    });
                }).error(function (data) {
                    console.log("info", "Error consulta rutas hoy: " + data);
                });
            }
        }]);
})();
