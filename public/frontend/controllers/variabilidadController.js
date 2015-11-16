/**
 * Created by jasmo2 on 11/16/15.
 */
(function() {

    var ruedapp = angular.module('ruedapp');
    ruedapp.controller('variabilidadController', ['$scope', '$rootScope', '$cookies','$log',
        function ($scope, $rootScope, $cookies,$log) {
            angular.element(document).ready(function () {
                $cookies.put('twitter',document.getElementById('redesSociales.twitter').innerHTML);
                $cookies.put('facebook',document.getElementById('redesSociales.facebook').innerHTML);
            })
        }]);
})();