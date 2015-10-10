/**
 * Created by jasmo2 on 9/19/15.
 */
var ruedapp = angular.module('ruedapp',['ngRoute', 'leaflet-directive', 'ui.bootstrap', 'ngCookies'])
.constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
})
/**
 * Obtener el id del usuario que inició sesión
 */

//Services
.service('SessionService', function () {
    this.create = function (cookie) {
        this.cookie = cookie.get('PLAY_SESSION');
        this.userId = this.cookie.split("User=")[1];
    };
    this.destroy = function () {
        this.cookie = null;
        this.userId = null;
    };
})
//Factories
.factory('AuthFactory', ['$http', '$cookies','SessionService',
        function ($http, $cookies,SessionService){
    var authFactory = {};
    authFactory.login = function (credentials) {
        return $http
            .post('http://localhost:9000/login', JSON.stringify(credentials))
            .then(function (res) {
                console.log("Inició sesión");
                SessionService.create($cookies);
                window.location.replace('/');
                return res;
            }, console.log("Error registro."));
    };

    authFactory.isAuthenticated = function () {
        return !!Session.userId;
    };

    authFactory.isAuthorized = function (authorizedRoles) {
        if (!angular.isArray(authorizedRoles)) {
            authorizedRoles = [authorizedRoles];
        }
        return (authFactory.isAuthenticated() &&
        authorizedRoles.indexOf(Session.userRole) !== -1);
    };

    return authFactory;
}]);
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