/*
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

        $scope.open = function() {
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
                AuthFactory.login(credentials).then(function () {
                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                    window.location.replace('/');
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
                };

                $http(post).success(function () {
                    console.log("Modificó");
                    window.location.replace('/');

                }).error(function (data) {
                    console.log("Error registro.");
                    console.log("data: "+ data);
                });
            }
        }
    }]);


ruedapp.controller('recorridoController',[ '$scope', '$http', 'leafletData',

    function($scope, $http, leafletData) {

        var recorridoInterval = 10000;
        var control;
        var recorridoId = 0;
        var inicioRecorrido;
        $scope.hideHistorico = true;

        leafletData.getMap('ruedappmap').then(function (map) {

            map.locate({setView: true, maxZoom: 16});
            map.on('locationfound', onLocationFound);

            control = L.Routing.control({
                plan: L.Routing.plan([], {
                    createMarker: function (i, wp) {
                        return L.marker(wp.latLng, {
                            draggable: true
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

            map.on('click', function (e) {
                var container = L.DomUtil.create('div'),
                    startBtn = createButton('Punto de origen', container),
                    destBtn = createButton('Punto de destino', container);

                L.popup()
                    .setContent(container)
                    .setLatLng(e.latlng)
                    .openOn(map);

                L.DomEvent.on(startBtn, 'click', function () {
                    control.spliceWaypoints(0, 1, e.latlng);
                    map.closePopup();
                });

                L.DomEvent.on(destBtn, 'click', function () {
                    control.spliceWaypoints(control.getWaypoints().length - 1, 1, e.latlng);
                    map.closePopup();
                });
            });
        });

        $scope.guardahistorico = function () {

            var finRecorrido = new Date();

            var historico =  {
                ciclista : {
                    id : 1
                },
                recorrido : {
                    id : recorridoId
                },
                duracion : Math.ceil((finRecorrido - inicioRecorrido) / 60000),
                fecha : finRecorrido
            };

            var post = {
                method: 'POST',
                url: '/historico/crear',
                headers: {'Content-Type': 'application/json'},
                data: JSON.stringify(historico)
            };

            $http(post).success(function () {
                console.log("historico creado");
                recorridoId = 0;
                $scope.hideRecorrido = false;
                $scope.hideHistorico = true;
            }).error(function (data) {
                console.log("Error ubicacion/crear data: "+ data);
            });
        }

        $scope.iniciarecorrido = function () {

            leafletData.getMap('ruedappmap').then(function (map) {

                var wayPoints = control.getWaypoints();
                if (wayPoints.length < 2 || wayPoints[0].latLng == null || wayPoints[1].latLng == null) {
                    alert('Debe seleccionar el punto de origen y destino antes de iniciar el recorrido.')
                    return;
                }

                var ruta = {
                    origen: {
                        latitud: wayPoints[0].latLng.lat,
                        longitud: wayPoints[0].latLng.lng,
                        nombre: wayPoints[0].name
                    },
                    destino: {
                        latitud: wayPoints[wayPoints.length - 1].latLng.lat,
                        longitud: wayPoints[wayPoints.length - 1].latLng.lng,
                        nombre: wayPoints[wayPoints.length - 1].name
                    }
                };

                var post = {
                    method: 'POST',
                    url: '/recorrido/crear',
                    headers: {'Content-Type': 'application/json'},
                    data: JSON.stringify(ruta)
                };

                $http(post).success(function (data) {
                    recorridoId = data;
                    inicioRecorrido = new Date();
                    $scope.hideRecorrido = true;
                    $scope.hideHistorico = false;
                    setTimeout(timeoutLocation, recorridoInterval);
                    console.log("inicio recorrido id: " + data);
                }).error(function (data) {
                    console.log("Error data: " + data);
                });
            });
        };

        function timeoutLocation ()
        {
            leafletData.getMap('ruedappmap').then(function (map) {
                map.locate({setView: true, maxZoom: 16});
            });
        }

        function onLocationFound(e) {

            if (recorridoId > 0) {

                leafletData.getMap('ruedappmap').then(function (map) {
                    L.circle(e.latlng, 10).addTo(map);
                });

                var ubicacion = {
                    latitud: e.latlng.lat,
                    longitud: e.latlng.lng,
                    nombre: 'default'
                };

                var post = {
                    method: 'POST',
                    url: '/ubicacion/crear/' + recorridoId,
                    headers: {'Content-Type': 'application/json'},
                    data: JSON.stringify(ubicacion)
                };

                $http(post).success(function () {
                    console.log("ubicacion creada");
                }).error(function (data) {
                    console.log("Error ubicacion/crear data: " + data);
                });

                setTimeout(timeoutLocation, recorridoInterval);
            }
        }
    }]);

ruedapp.controller('mensajeController',[ '$scope', '$http', '$cookies',
    function($scope, $http) {
        $scope.enviarMensaje = function() {
            if ($scope.form.$valid) {
                var post = {
                    method: 'POST',
                    url: 'http://localhost:9000/mensaje',
                    headers: { 'Content-Type': 'application/json' },
                    data: JSON.stringify($scope.mensajeInfo)
                };

                $http(post).success(function () {
                    console.log("Mensaje enviado");
                    window.location.replace('/');

                }).error(function (data) {
                    console.log("Error al enviar mensaje.");
                    console.log("data: "+ data);
                });
            }
        }
    }]);


function createButton(label, container) {
    var btn = L.DomUtil.create('button', '', container);
    btn.setAttribute('type', 'button');
    btn.innerHTML = label;
    return btn;
}
