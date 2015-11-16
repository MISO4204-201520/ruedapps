/**
 * Created by Lina8a on 16/11/2015.
 */

ruedapp.controller('manejoPerfilController', ['$scope','$rootScope', '$location', '$http',
    function ($scope, $rootScope, $location, $http) {

        /**
         * Obtención del perfil del usuario.
         */
        $scope.consultarPerfil = function () {
            var get = {
                method: 'GET',
                url: '/usuario/' + $rootScope.globals.currentUser.userId
            };
            $http(get).success(function (data) {
                $scope.userInfo = data;

            }).error(function (data) {
                console.log("Error consulta usuario");
                console.log("data: " + data);
            });
        };

        /**
         * Edición de los datos del usuario.
         */
        $scope.editarPerfil = function () {
            var userInfo = $scope.userInfo;

            var put = {
                method: 'PUT',
                url: '/usuario',
                headers: {'Content-Type': 'application/json'},
                data: JSON.stringify(userInfo)
            };

            $http(put).success(function () {
                console.log("Modificó");
                window.location.replace('/');

            }).error(function (data) {
                console.log("Error registro.");
                console.log("data: " + data);
            });
        };

    }]);