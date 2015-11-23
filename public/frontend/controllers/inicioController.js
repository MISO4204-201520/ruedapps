/*
 * Created by lina on 9/30/15.
 */
(function() {
    var ruedapp = angular.module('ruedapp');
    ruedapp.controller('inicioController', ['$scope', '$rootScope', '$location', '$http', 'APP_CONFIG',
        function ($scope, $rootScope, $location, $http, APP_CONFIG) {
            // Detecta funcionalidad activa en la derivación
            $scope.notificaciones = APP_CONFIG.notificaciones;
            $scope.mensajes = APP_CONFIG.mensajes;
        }]);
})();