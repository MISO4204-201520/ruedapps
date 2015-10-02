/**
 * Created by jasmo2 on 9/19/15.
 */
var ruedapp = angular.module('ruedapp',['ngRoute']);

ruedapp.config(function($routeProvider){
    $routeProvider
        .when(
        '/',{
            controller: 'ruedappController',
            templateUrl: 'views/index.html'
        }
    )
});