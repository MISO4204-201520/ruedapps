/**
 * Created by jasmo2 on 9/19/15.
 */
var ruedapp = angular.module('ruedapp',['ngRoute', 'leaflet-directive']);

ruedapp.config(function($routeProvider){
    $routeProvider
        .when(
        '/',{
            controller: 'userController',
            templateUrl: 'assets/frontend/views/index.html'
            }
        )
        .when(
        '/',{
            controller: 'recorridoController',
            templateUrl: 'assets/frontend/views/map.html'
            }
        )
        .otherwise({ redirectTo: '/'})
});