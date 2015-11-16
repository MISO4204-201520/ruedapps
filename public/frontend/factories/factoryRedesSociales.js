/**
 * Created by jasmo2 on 11/16/15.
 */

(function() {
    var ruedapp = angular.module('ruedapp');

    ruedapp.factory('ShareProvider', ['$q', '$cookies', '$http', 'SessionFactory', 'OAUTH_PROVIDER_URL', 'OAUTH_USER_INFO',
        function ($q, $cookies, $http, SessionFactory, OAUTH_PROVIDER_URL, OAUTH_USER_INFO) {
            return {
                params: function (authorizationResult, provider, poster) {
                    var deferred = $q.defer();
                    switch (provider) {
                        case 'facebook':
                            authorizationResult.post('/me/feed', {
                                data: {message: poster}
                            }).done(function () {
                                deferred.resolve(null)
                            });
                            break;
                        case 'twitter':
                            poster = poster.substring(0, 140);
                            authorizationResult.post({
                                url: '/1.1/statuses/update.json',
                                data: {status: poster}
                            }).done(function () {
                                deferred.resolve(null)
                            });
                            break;
                    }
                    return deferred.promise;
                }
            }
        }]);
    ruedapp.factory('oauthFactory', ['$q', '$cookies', '$http', 'SessionFactory', 'OAUTH_PROVIDER_URL', 'OAUTH_USER_INFO', 'ShareProvider',
        function ($q, $cookies, $http, SessionFactory, OAUTH_PROVIDER_URL, OAUTH_USER_INFO, ShareProvider) {
            var provider = typeof provider !== 'undefined' ? provider : '';
            var authorizationResult = false;
            //FixMe When the page is reload the authentication should be done again.
            function getUserInfo(provider) {
                authorizationResult.get(OAUTH_PROVIDER_URL[provider]).done(function (result) {
                    var credentials = {
                        nombre: result[OAUTH_USER_INFO[provider]['nombre']],
                        proveedor_id: result[OAUTH_USER_INFO[provider]['proveedor_id']] || "not_null"
                    };
                    var post = {
                        method: 'POST',
                        url: '/login/' + provider,
                        headers: {'Content-Type': 'application/json'},
                        data: JSON.stringify(credentials)
                    };

                    $http(post).success(function (id) {
                        SessionFactory.create(credentials, id);
                        console.log("login/auth" + provider);
                        window.location.replace('#/inicio');
                    })

                });
            };
            function initialize(provide) {
                provider = provide
                //initialize OAuth.io with public key of the application
                OAuth.initialize('aRz8k9AQSMZrgo1xnjeEU9_FDac', {cache: true});
                //try to create an authorization result when the page loads, this means a returning user won't have to click the twitter button again
                authorizationResult = OAuth.create(provider);
            }

            return {
                initialize: function (p) {
                    initialize(p)
                },
                isReady: function () {
                    return (authorizationResult);
                },
                connect: function () {
                    var deferred = $q.defer();
                    OAuth.popup(provider, {cache: true}, function (error, result) { //cache means to execute the callback if the tokens are already present
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
                clearCache: function () {
                    OAuth.clearCache(provider);
                    authorizationResult = false;
                },

                share: function (poster) {
                    //create a deferred object using Angular's $q service
                    var deferred = $q.defer();
                    deferred.resolve(ShareProvider.params(authorizationResult, provider, poster));
                    return deferred.promise;
                }
            }

        }]);
})();