/**
 * Created by jasmo2 on 10/9/15.
 */
//Factories
angular.module('ruedapp.services', [])
    .factory('SessionFactory', ['$rootScope','$http','$cookies',
        function ($rootScope, $http, $cookies) {
            var sessionFactory = {
                create: function (credentials,id) {
                    var userId = id;
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
                    $cookies.remove("oauthio_provider_"+$cookies.get("provider"))
                    $cookies.remove('provider');
                    $rootScope.globals = {
                        'currentUser': {
                            'userId': null,
                            'authdata': null
                        }
                    };
                    OAuth.clearCache();
                    return null;
                }
            };

            return sessionFactory;
        }])
    .factory('AuthFactory', ['$http', '$rootScope', 'SessionFactory',
        function ($http, $rootScope, SessionFactory) {
            var authFactory = {
                login: function (credentials) {
                    return $http
                        .post('/login', JSON.stringify(credentials))
                        .success(function (id) {
                            console.log("Inició sesión");
                            SessionFactory.create(credentials,id);
                            $rootScope.loginFailed = false;
                            return credentials;
                        }).error(function (res) {
                            console.log("Error login.");
                            console.log("data: "+ res);
                            $rootScope.loginFailed = true;
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