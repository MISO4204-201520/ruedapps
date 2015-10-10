/**
 * Created by jasmo2 on 9/19/15.
 */
var ruedapp = angular.module('ruedapp',['ngRoute', 'leaflet-directive', 'ui.bootstrap', 'ngCookies'])
    /**/
//Constants
    .constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    })
/**

 */
    /**/
//Services

    /**/
//Factories
    .factory('SessionFactory', ['$rootScope','$http','$cookies',
        function ($rootScope,$http, $cookies) {
            var sessionFactory = {
                create: function (credentials) {
                    this.cookie = $cookies.get('PLAY_SESSION');
                    var userId = this.cookie.split("User=")[1];
                    var authdata = Base64.encode(credentials.correoElectronico + ':' + credentials.contrasenia);
                    $rootScope.globals = {
                        'currentUser': {
                            'userId': userId,
                            'authdata': authdata
                        }
                    };
                    $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
                    $cookies.put('globals', JSON.stringify($rootScope.globals));
                    return null;
                },
                destroy: function () {
                    this.cookie = null;
                    this.userId = null;
                    return null;
                }
            };


            //authFactory.destroy = function () {
            //    $rootScope.globals = {};
            //    $cookies.remove('globals');
            //    $http.defaults.headers.common.Authorization = 'Basic ';
            //};
            //authFactory.isAuthenticated = function () {
            //    return !!Session.userId;
            //};


            return sessionFactory;

        }])
    .factory('AuthFactory', ['$http', 'SessionFactory',
        function ($http, SessionFactory){
            var authFactory = {
                login: function (credentials) {
                    return $http
                        .post('http://localhost:9000/login', JSON.stringify(credentials))
                        .then(function (res) {
                            console.log("Inició sesión");
                            SessionFactory.create(credentials);
                            return credentials;
                        }, console.log("Error registro."));
                }
            };
            return authFactory;
        }])
    .factory('AuthInterceptor', ['$rootScope','$q', 'AUTH_EVENTS',
        function ($rootScope, $q,AUTH_EVENTS) {
            return {
                responseError: function (response) {
                    $rootScope.$broadcast({
                        401: AUTH_EVENTS.notAuthenticated,
                        403: AUTH_EVENTS.notAuthorized,
                        419: AUTH_EVENTS.sessionTimeout,
                        440: AUTH_EVENTS.sessionTimeout
                    }[response.status], response);
                    return $q.reject(response);
                }
            };
        }])
    /**/
//Run
    .run(['$rootScope', '$location', '$cookies', '$http',
        function($rootScope, $location, $cookies, $http) {
            // keep user logged in after page refresh
            var currentUser = $cookies.get('globals') || {};
            if (currentUser != {}) {currentUser = JSON.parse(currentUser)}
            $rootScope.globals= currentUser;
            if ($rootScope.globals.currentUser) {
                $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
            }

            $rootScope.$on('$locationChangeStart', function (event, next, current) {
                // redirect to login page if not logged in and trying to access a restricted page
                var restrictedPage = $.inArray($location.path(), ['','/','/login','/register']) === -1;
                var loggedIn = $rootScope.globals.currentUser;
                if (restrictedPage && !loggedIn) {
                    $location.path('/login');
                }
            });
        }])
// /**/
//Configurations
    .config(['$httpProvider',function ($httpProvider) {
        $httpProvider.interceptors.push([
            '$injector',
            function ($injector) {
                return $injector.get('AuthInterceptor');
            }
        ]);
    }])
    .config(['$routeProvider',function($routeProvider){
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
    }]);