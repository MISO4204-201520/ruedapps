/*
 * Created by jasmo2 on 9/19/15.
 */
var ruedapp = angular.module('ruedapp',['ngRoute', 'leaflet-directive', 'ui.bootstrap', 'ngCookies', 'ngTable'])
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
    .constant('ALLOW_ROUTES', ['','/','/login','/register'])
/**

 */
    /**/
//Services

    /**/
//Factories
    .factory('SessionFactory', ['$rootScope','$http','$cookies',
        function ($rootScope, $http, $cookies) {
            var sessionFactory = {
                create: function (credentials) {
                    this.cookie = $cookies.get('PLAY_SESSION');
                    var userId = this.cookie ? this.cookie.split("User=")[1] : credentials.correoElectronico;
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
                    $cookies.remove('globals');
                    $rootScope.globals = {
                        'currentUser': {
                            'userId': null,
                            'authdata': null
                        }
                    };
                    return null;
                }
            };

            return sessionFactory;
        }])
    .factory('AuthFactory', ['$http', 'SessionFactory',
        function ($http, SessionFactory){
            var authFactory = {
                login: function (credentials) {
                    return $http
                        .post('/login', JSON.stringify(credentials))
                        .success(function () {
                            console.log("Inició sesión");
                            SessionFactory.create(credentials);
                            return credentials;
                        }).error(function (res) {
                            console.log("Error login.");
                            console.log("data: "+ res);
                            return null;
                        });
                },

                logout: function() {
                    return $http.get('/logout')
                        .success(function() {
                            console.log("Cerrar sesión");
                            SessionFactory.destroy();
                            return null;
                        })
                        .error(function(res) {
                            console.log("Error logout.");
                            console.log("data: "+ res);
                            return null;
                        })
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
    .run(['$rootScope', '$location', '$cookies', '$http','ALLOW_ROUTES',
        function($rootScope, $location, $cookies, $http,ALLOW_ROUTES) {
            // keep user logged in after page refresh
            var globals = $cookies.get('globals');
            $rootScope.globals = (globals ? JSON.parse(globals) : null) || {};

            if ($rootScope.globals.currentUser) {
                $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
            }

            $rootScope.$on('$locationChangeStart', function () {
                // redirect to login page if not logged in and trying to access a restricted page
                var restrictedPage = $.inArray($location.path(),ALLOW_ROUTES) === -1;
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
                controller: 'inicioController',
                templateUrl: 'assets/frontend/views/index.html'
            }
        )
            .when(
            '/inicio', {
                controller: 'inicioController',
                templateUrl: 'assets/frontend/views/inicio.html'
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
            '/perfil',{
                controller: 'perfilController',
                templateUrl: 'assets/frontend/views/perfil/profile.html'
            }
        )
            .when(
            '/amigos',{
                controller: 'perfilController',
                templateUrl: 'assets/frontend/views/perfil/amigos.html'
            }
        )
            .when(
            '/ruta',{
                controller: 'recorridoController',
                templateUrl: 'assets/frontend/views/ruta/mapa.html'
            }
        )
            .when(
            '/ruta/hist',{
                controller: 'recorridoController',
                templateUrl: 'assets/frontend/views/ruta/historico.html'
            }
        )
            .when(
            '/mensaje',{
                controller: 'mensajeController',
                templateUrl: 'assets/frontend/views/comunicacion/mensaje.html'
            }
        )
            .when(
            '/registrarCategoria',{
                controller: 'directorioServiciosController',
                templateUrl: 'assets/frontend/views/directorioServicios/registrarCategoria.html'
            }
        )
            .when(
            '/categorias',{
                controller: 'directorioServiciosController',
                templateUrl: 'assets/frontend/views/directorioServicios/categorias.html'
            }
        )
            .when(
            '/categoria/servicios',{
                controller: 'directorioServiciosController',
                templateUrl: 'assets/frontend/views/directorioServicios/serviciosPorCategoria.html'
            }
        )
            .when(
            '/categoria/servicios/registrarServicio', {
                controller: 'directorioServiciosController',
                templateUrl: 'assets/frontend/views/directorioServicios/registrarServicio.html'
            }
        )
            .when(
            '/recorridos',{
                controller: 'recorridoController',
                templateUrl: 'assets/frontend/views/ruta/programacion.html'
            }
        )
            .when(
            '/recorridos/prog',{
                controller: 'recorridoController',
                templateUrl: 'assets/frontend/views/ruta/rutasprogramadas.html'
            }
        )
            .otherwise({ redirectTo: '/'})
    }]);