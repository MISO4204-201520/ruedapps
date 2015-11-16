/*
 * Created by jasmo2 on 9/19/15.
 */

var ruedapp = angular.module('ruedapp',['ruedapp.services','ngRoute', 'leaflet-directive', 'ui.bootstrap', 'ngCookies','ngTable', 'chart.js', 'timer'])
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
    .constant('OAUTH_PROVIDER_URL',{
        twitter:'/1.1/account/verify_credentials.json',
        facebook:'/me'
    })
    .constant('OAUTH_USER_INFO',{
        twitter: {nombre: 'name', proveedor_id: 'id_str'},
        facebook: {nombre: 'name', proveedor_id: 'id'}
    })
/**

 */
    /**/
//Run
    .run(['$rootScope', '$location', '$cookies', '$http','ALLOW_ROUTES',
        function($rootScope, $location, $cookies, $http,ALLOW_ROUTES) {
            // keep user logged in after page refresh
            var globals =  $cookies.get('globals'),
                provider = $cookies.get('provider');
            $rootScope.globals = (globals ? JSON.parse(globals) : null) || {};

            if ($rootScope.globals.currentUser) {
                $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
                $rootScope.loggedIn = true;
                $rootScope.provider = (provider ? provider : null) || null;
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
                controller: 'directorioController',
                templateUrl: 'assets/frontend/views/directorioServicios/registrarCategoria.html'
            }
        )
            .when(
            '/categorias',{
                controller: 'directorioController',
                templateUrl: 'assets/frontend/views/directorioServicios/categorias.html'
            }
        )
            .when(
            '/categoria/servicios',{
                controller: 'directorioController',
                templateUrl: 'assets/frontend/views/directorioServicios/serviciosPorCategoria.html'
            }
        )
            .when(
            '/categoria/servicios/registrarServicio', {
                controller: 'directorioController',
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
            .when(
            '/configuradorBicicletas',{
                controller: 'configuradorBicicletasController',
                templateUrl: 'assets/frontend/views/configurador_bicicletas/configuradorBicicletas.html'
            }
        )
            .when(
            '/reporte/metricas',{
                controller: 'reporteController',
                templateUrl: 'assets/frontend/views/reportes/metricas.html'
            }
        )
            .when(
            '/reporte/historico',{
                controller: 'reporteController',
                templateUrl: 'assets/frontend/views/reportes/historico.html'
            }
        )
            .when(
            '/reporte/rutas',{
                controller: 'reporteController',
                templateUrl: 'assets/frontend/views/reportes/rutas.html'
            }
        )
            .when(
            '/rutagrupal/:param',{
                controller: 'recorridoController',
                templateUrl: 'assets/frontend/views/ruta/mapa.html'
            }
        )
            .when(
                '/historicoBicicletas',{
                controller: 'perfilController',
                templateUrl: 'assets/frontend/views/configurador_bicicletas/historicoBicicletas.html'
            }
        )
            .otherwise({ redirectTo: '/'})
    }]);