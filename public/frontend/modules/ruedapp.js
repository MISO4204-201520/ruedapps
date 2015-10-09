/**
 * Created by jasmo2 on 9/19/15.
 */
var ruedapp = angular.module('ruedapp',['ngRoute', 'leaflet-directive', 'ui.bootstrap', 'ngCookies']);


ruedapp.config(function($routeProvider){
    $routeProvider
        .when(
        '/',{
            controller: 'perfilController',
            templateUrl: 'assets/frontend/views/index.html'
            }
        )
        .when(
        '/login',{
            controller: 'perfilController',
            templateUrl: 'assets/frontend/views/perfil/login.html'
            }
        )
        .when(
        '/register',{
            controller: 'perfilController',
            templateUrl: 'assets/frontend/views/perfil/register.html'
            }
        )
        .when(
        '/ruta',{
            controller: 'recorridoController',
            templateUrl: 'assets/frontend/views/ruta/mapa.html'
            }
        )
        .when(
        '/mensaje',{
            controller: 'perfilController',
            templateUrl: 'assets/frontend/views/comunicacion/mensaje.html'
            }
        )
        .when(
        '/perfil',{
            controller: 'perfilController',
            templateUrl: 'assets/frontend/views/perfil/profile.html'
        }
    )
        .otherwise({ redirectTo: '/'})
});