/**
 * Created by lina on 9/30/15.
 */

ruedapp.controller('userController',[ '$scope', function($scope) {
    console.log("entró")
}]);


ruedapp.controller('recorridoController',[ '$scope', function($scope) {
    angular.extend($scope, {
        center: {
            autoDiscover: true
        }
    });
}]);