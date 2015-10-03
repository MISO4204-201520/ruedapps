/**
 * Created by lina on 9/30/15.
 */

ruedapp.controller('perfilController',[ '$scope','$location', function($scope, $location) {
    console.log("entra");
    $scope.route = function ( path ) {
        console.log("que mas");
        $location.path( path );
    };
}]);


ruedapp.controller('recorridoController',[ '$scope', function($scope) {
    angular.extend($scope, {
        center: {
            autoDiscover: true
        }
    });
}]);