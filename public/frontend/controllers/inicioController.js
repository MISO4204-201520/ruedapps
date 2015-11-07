/*
 * Created by lina on 9/30/15.
 */

ruedapp.controller('inicioController', ['$scope', '$rootScope', '$location', '$http',
    function ($scope, $rootScope, $location, $http) {
        /*
         Mostrar notificaciones
         */
        $(function () {
            $scope.notificationType = "INFO";
            $scope.notificationText = "Some content";
            $scope.showNotification = false;
        });
    }]);
