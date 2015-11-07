/*
 * Created by lina on 9/30/15.
 */

ruedapp.controller('inicioController', ['$scope', '$rootScope', '$location', '$http',
    function ($scope, $rootScope, $location, $http) {
        /*
         Mostrar notificaciones
         */
        $(function () {
            // mostrarNotificacion("PRUEBA", "mensaje");
        });

        function mostrarNotificacion(tipo, texto) {
            $scope.notificationType = tipo;
            $scope.notificationText = texto;
            $scope.showNotification = true;
        }
    }]);
