/**
 * Created by lina on 9/30/15.
 */

ruedapp.controller('perfilController',[ '$scope','$rootScope','$location', '$http', '$cookies', 'AUTH_EVENTS','AuthFactory',
    function($scope, $rootScope , $location, $http, $cookies, AUTH_EVENTS, AuthFactory) {
        /**
         * Definición datepicker
         * @type {Date}
         */
        var today = new Date();
        $scope.minDate = '1900/01/01';
        $scope.maxDate = today;

        $scope.open = function($event) {
            $scope.status.opened = true;
        };

        $scope.status = {
            opened: false
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.registrar = function() {
            if($scope.form.$valid) {
                var userInfo = $scope.userInfo;
                var post = {
                    method: 'POST',
                    url: 'http://localhost:9000/usuario/crear ',
                    headers: { 'Content-Type': 'application/json' },
                    data: JSON.stringify(userInfo)
                };

                $http(post).success(function (data) {
                    console.log("Registró");
                    console.log("data: "+ data);
                    window.location.replace('/');

                }).error(function (data) {
                    console.log("Error registro.");
                    console.log("data: "+ data);
                });
            }
        };

        $scope.login = function() {
            var credentials = $scope.credentials;
            if($scope.form.$valid) {
                AuthFactory.login(credentials).then(function (res) {
                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);

                    //SessionFactory.create(res);
                }, function () {
                    $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                });
            }
        };

        $scope.editarPerfil = function() {
            if($scope.form.$valid) {
                var post = {
                    method: 'POST',
                    url: 'http://localhost:9000/usuario/modificar',
                    headers: { 'Content-Type': 'application/json' },
                    data: JSON.stringify(user)
                }

                $http(post).success(function (data) {
                    console.log("Modificó");
                    window.location.replace('/');

                }).error(function (data) {
                    console.log("Error registro.");
                });
            }
        }
    }]);


ruedapp.controller('recorridoController',[ '$scope','leafletData', function($scope,leafletData) {
    leafletData.getMap('ruedappmap').then(function(map) {
        L.Routing.control({
            plan: L.Routing.plan([
                L.latLng(4.5999972, -74.075135),
                L.latLng(4.6015857, -74.0652745)
            ], {
                createMarker: function (i, wp) {
                    return L.marker(wp.latLng, {
                        draggable: true,
                    });
                },
                geocoder: L.Control.Geocoder.nominatim(),
                routeWhileDragging: true
            }),
            routeWhileDragging: true,
            routeDragTimeout: 250,
            showAlternatives: true,
            altLineOptions: {
                styles: [
                    {color: 'black', opacity: 0.15, weight: 9},
                    {color: 'white', opacity: 0.8, weight: 6},
                    {color: 'blue', opacity: 0.5, weight: 2}
                ]
            }
        }).addTo(map);
    })

}]);