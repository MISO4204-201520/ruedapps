/**
 * Created by jasmo2 on 11/16/15.
 */
(function() {
    var ruedapp = angular.module('ruedapp');
    ruedapp.controller('perfilOptionalController', ['$scope', '$rootScope', '$cookies', 'AUTH_EVENTS', 'oauthFactory',
        function ($scope, $rootScope, $cookies, AUTH_EVENTS, oauthFactory) {

            $scope.facebook = ($cookies.get('facebook') === 'true')|| false;
            $scope.twitter = ($cookies.get('twitter') === 'true')|| false;

            $scope.authenticate = function (provider) {
                oauthFactory.initialize(provider);
                oauthFactory.connect().then(function () {
                    $rootScope.loggedIn = true;
                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                    $rootScope.provider = provider;

                });

            };
        }
    ])
})();