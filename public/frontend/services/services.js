/**
 * Created by jasmo2 on 10/9/15.
 */
//Factories
angular.module('ruedapp.services', [])
    .factory('oauthServices', function($q) {

    var authorizationResult = false;
    var provider = typeof provider !== 'undefined' ? provider : '';
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
                    deferred.resolve();
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
        getUserInfo: function(){
            debugger
            var deferred = $q.defer(),
                promise = authorizationResult.get('/1.1/account/verify_credentials.json').done(function(data){
                    debugger
                    //deferred.resolve(data)
                })
        },
        getLatestTweets: function () {
            //create a deferred object using Angular's $q service
            var deferred = $q.defer();
            var promise = authorizationResult.get('/1.1/statuses/home_timeline.json').done(function(data) { //https://dev.twitter.com/docs/api/1.1/get/statuses/home_timeline
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
    .factory('AuthFactory', ['$http', '$rootScope', 'SessionFactory',
        function ($http, $rootScope, SessionFactory) {
            var authFactory = {
                login: function (credentials) {
                    return $http
                        .post('/login', JSON.stringify(credentials))
                        .success(function () {
                            console.log("Inició sesión");
                            SessionFactory.create(credentials);
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