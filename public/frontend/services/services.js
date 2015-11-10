/**
 * Created by jasmo2 on 10/9/15.
 */
//Factories
angular.module('ruedapp.services', [])
    .factory('oauthServices', function($q,$cookies,$http,SessionFactory,OAUTH_PROVIDER_URL,OAUTH_USER_INFO) {
        var provider = typeof provider !== 'undefined' ? provider : '';

        function getUserInfo(provider){
            authorizationResult.get(OAUTH_PROVIDER_URL[provider]).done(function(result){
                var credentials = {nombre: result[OAUTH_USER_INFO[provider]['nombre']], proveedor_id: result[OAUTH_USER_INFO[provider]['proveedor_id']] || "not_null"};
                var post = {
                    method: 'POST',
                    url: '/login/' + provider ,
                    headers: {'Content-Type': 'application/json'},
                    data: JSON.stringify(credentials)
                };

                $http(post).success(function (id) {
                    SessionFactory.create(credentials,id);
                    console.log("login/auth"+provider);
                    window.location.replace('#/inicio');
                })

            });
        };
    var     authorizationResult = false;
    return {
        initialize: function(provide) {
            provider = provide
            //initialize OAuth.io with public key of the application
            OAuth.initialize('aRz8k9AQSMZrgo1xnjeEU9_FDac', {cache:true});
            //try to create an authorization result when the page loads, this means a returning user won't have to click the twitter button again
            authorizationResult = OAuth.create(provider);
        },
        isReady: function() {
            return (authorizationResult);
        },
        connect: function() {
            var deferred = $q.defer();
            OAuth.popup(provider, {cache:true}, function(error, result) { //cache means to execute the callback if the tokens are already present
                if (!error) {
                    authorizationResult = result;
                    $cookies.put('provider', provider);
                    getUserInfo(provider);
                    deferred.resolve(null);
                } else {
                    console.log("API error");
                }
            });
            return deferred.promise;
        },
        clearCache: function() {
            OAuth.clearCache(provider);
            authorizationResult = false;
        },

        share: function (data) {
            //create a deferred object using Angular's $q service
            var deferred = $q.defer();
            var promise = authorizationResult.post('1.1/statuses/update.json').done(function(data) { //https://dev.twitter.com/docs/api/1.1/get/statuses/home_timeline
                //when the data is retrieved resolved the deferred object
                deferred.resolve(data)
            });
            //return the promise of the deferred object
            return deferred.promise;
        }
    }

})
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