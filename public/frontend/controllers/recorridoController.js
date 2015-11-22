/*
 * Created by lina on 9/30/15.
 */

(function() {
    var ruedapp = angular.module('ruedapp');
    ruedapp.controller('recorridoController', ['$scope', '$rootScope', '$http', '$routeParams', 'leafletData', 'ngTableParams', 'oauthFactory', 'APP_CONFIG',
        function ($scope, $rootScope, $http, $routeParams, leafletData, ngTableParams, oauthFactory, APP_CONFIG) {

            $scope.param = $routeParams.param;
            $scope.grupal = APP_CONFIG.grupal;

            var recorridoInterval = 10000,
                control,
                recorridoId = 0,
                rutaRecorridoId = 0,
                inicioRecorrido = null,
                datosCompartir = {},
                today = new Date(),

                radioCercaniaServicios = 1000,
                marcadoresServicios = [];

            $scope.amigosruta = [];
            $scope.hideHistorico = true;
            $scope.minDate = today;
            $scope.maxDate = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
            $scope.programacion = {
                hora: today,
                fecha: today
            };

            $scope.serviciosCercanos = [];

            $scope.open = function () {
                $scope.status.opened = true;
            };

            $scope.status = {
                opened: false
            };

            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };

            $scope.loadmap = function () {

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
                            startBtn = createMapButton('Punto de origen', container),
                            destBtn = createMapButton('Punto de destino', container);

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

                if (typeof($scope.param) != 'undefined') {
                    var get = {
                        method: 'GET',
                        url: '/recorrido/programacion/' + $scope.param,
                        headers: {'Content-Type': 'application/json'},
                    };

                    $http(get).success(function (data) {
                        console.log("consulta programacion ok");
                        rutaRecorridoId = data.ruta.id;
                        control.spliceWaypoints(0, 1, L.latLng(data.ruta.origen.latitud, data.ruta.origen.longitud));
                        control.spliceWaypoints(control.getWaypoints().length - 1, 1, L.latLng(data.ruta.destino.latitud, data.ruta.destino.longitud));
                    }).error(function (data) {
                        console.log("Error consulta programacion : " + data);
                    });
                }
            };

            $scope.guardahistorico = function () {

                var finRecorrido = new Date();

                var historico = {
                    ciclista: {
                        id: 1
                    },
                    recorrido: {
                        id: recorridoId
                    },
                    duracion: Math.ceil((finRecorrido - inicioRecorrido) / 60000),
                    fecha: finRecorrido
                };

                var post = {
                    method: 'POST',
                    url: '/historico',
                    headers: {'Content-Type': 'application/json'},
                    data: JSON.stringify(historico)
                };

                $http(post).success(function () {
                    $scope.$broadcast('timer-stop');
                    console.log("historico creado");
                    recorridoId = 0;
                    $scope.hideRecorrido = false;
                    $scope.hideHistorico = true;
                    datosCompartir.historico = historico;
                    datosCompartir.ok = "ok";


                }).error(function (data) {
                    console.log("Error ubicacion/crear data: " + data);
                });
            };

            $scope.consultahistorico = function () {

                var get = {
                    method: 'get',
                    url: '/historico/usuario/0',
                    headers: {'Content-Type': 'application/json'}
                };

                $http(get).success(function (data) {
                    console.log("consulta ok");
                    $scope.historicoUsuario = data;
                }).error(function (data) {
                    console.log("Error consulta historico : " + data);
                });
            };

            $scope.consultarutas = function () {

                var get = {
                    method: 'get',
                    url: '/recorrido/programacion/participante/0',
                    headers: {'Content-Type': 'application/json'}
                };

                $http(get).success(function (data) {
                    console.log("consulta rutas participante ok");
                    $scope.rutasUsuario = data;
                }).error(function (data) {
                    console.log("Error consulta rutas participante : " + data);
                });
            };

            $scope.consultaamigos = function () {
                var get = {
                    method: 'GET',
                    url: '/ciclista/' + $rootScope.globals.currentUser.userId + '/amigos'
                };

                $http(get).success(function (data) {
                    console.log("consulta ok");
                    $scope.amigos = data;
                }).error(function (data) {
                    console.log("Error consulta amigos : " + data);
                });
            };
            $scope.compartir = function () {
                if (datosCompartir.ok != null) {
                    var d = "origen: " + datosCompartir.ruta.origen.nombre +
                        "\n destino " + datosCompartir.ruta.destino.nombre;
                    oauthFactory.share(d).then(function (response) {
                        alert(response + " al compatir los datos");
                    });
                } else {
                    alert("primero terminar la ruta");
                }
            };
            $scope.iniciarecorrido = function () {

                if (rutaRecorridoId > 0) {
                    var post = {
                        method: 'POST',
                        url: '/recorrido/' + rutaRecorridoId,
                        headers: {'Content-Type': 'application/json'},
                    };

                    $http(post).success(function (data) {
                        $scope.$broadcast('timer-start');
                        recorridoId = data;
                        inicioRecorrido = new Date();
                        $scope.hideRecorrido = true;
                        $scope.hideHistorico = false;
                        datosCompartir.ok = null;
                        timeoutLocation();
                        console.log("inicio recorrido grupal id: " + data);
                    }).error(function (data) {
                        console.log("Error inicio recorrido: " + data);
                    });

                    return;
                }

                leafletData.getMap('ruedappmap').then(function () {

                    var wayPoints = control.getWaypoints();
                    if (wayPoints.length < 2 || wayPoints[0].latLng == null || wayPoints[1].latLng == null) {
                        alert('Debe seleccionar el punto de origen y destino antes de iniciar el recorrido.');
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
                    datosCompartir.ruta = ruta;
                    var post = {
                        method: 'POST',
                        url: '/recorrido',
                        headers: {'Content-Type': 'application/json'},
                        data: JSON.stringify(ruta)
                    };

                    $http(post).success(function (data) {
                        $scope.$broadcast('timer-start');
                        recorridoId = data;
                        inicioRecorrido = new Date();
                        $scope.hideRecorrido = true;
                        $scope.hideHistorico = false;
                        timeoutLocation();
                        console.log("inicio recorrido id: " + data);
                    }).error(function (data) {
                        console.log("Error inicio recorrido: " + data);
                    });
                });
            };

            function timeoutLocation() {
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
                        url: '/ubicacion/' + recorridoId,
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

                // Obtiene todos los servicios y ubica en el mapa los que estan cerca a la ubicación actual del usuario
                // teniendo en cuenta una constante de distancia
                leafletData.getMap('ruedappmap').then(function (map) {

                    if (marcadoresServicios && marcadoresServicios.length > 0) {
                        angular.forEach(marcadoresServicios, function (marcador) {
                            map.removeLayer(marcador);
                        })
                        marcadoresServicios = [];
                    }

                    var get = {
                        method: 'GET',
                        url: '/servicio'
                    };

                    $http(get).success(function (data) {
                        console.log("Obtuvo todos los servicios");
                        console.log("data: " + data);
                        $scope.servicios = data;

                        var ubicacionActual = L.latLng(e.latitude, e.longitude);
                        console.log("Ubicación actual: " + ubicacionActual);

                        angular.forEach($scope.servicios, function (servicio) {
                            if (servicio.ubicacion) {
                                var ubicacionServicio = L.latLng(servicio.ubicacion.latitud, servicio.ubicacion.longitud);
                                var distancia = ubicacionActual.distanceTo(ubicacionServicio).toFixed(0);
                                console.log("Distancia: " + distancia);
                                if (distancia <= radioCercaniaServicios) {
                                    $scope.serviciosCercanos.push(servicio);
                                    marcadoresServicios.push(L.marker(ubicacionServicio).bindPopup(L.popup().setContent(servicio.nombre)).openPopup());
                                }
                            }
                        })

                        angular.forEach(marcadoresServicios, function (marcador) {
                            map.addLayer(marcador);
                        });

                    }).error(function (data) {
                        console.log("Error consultando servicios.");
                        console.log("data: " + data);
                    });

                });

            }

            function createMapButton(label, container) {
                var btn = L.DomUtil.create('button', '', container);
                btn.setAttribute('type', 'button');
                btn.innerHTML = label;
                return btn;
            }

            $scope.creaprogramacion = function () {

                var wayPoints = control.getWaypoints();
                if (wayPoints.length < 2 || wayPoints[0].latLng == null || wayPoints[1].latLng == null) {
                    alert('Debe seleccionar el punto de origen y destino antes de crear el recorrido.');
                    return;
                }

                var programacion = $scope.programacion;

                programacion.ruta = {
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
                datosCompartir.ruta = programacion.ruta;

                programacion.fechaInicio = programacion.fecha;
                programacion.fechaInicio.setMinutes(programacion.hora.getMinutes());
                programacion.fechaInicio.setHours(programacion.hora.getHours());
                programacion.participantes = $scope.amigosruta;

                var post = {
                    method: 'POST',
                    url: '/recorrido/programacion',
                    headers: {'Content-Type': 'application/json'},
                    data: JSON.stringify(programacion)
                };

                $http(post).success(function () {
                    console.log("crea programacion ok");
                    $scope.programacionCreada = true;
                }).error(function (data) {
                    console.log("Error crea programacion : " + data);
                });
            };

            $scope.addAmigo = function () {

                if (typeof($scope.programacion.amigo) != 'undefined') {
                    var result = $.grep($scope.amigosruta, function (e) {
                        return e.id == $scope.programacion.amigo.id;
                    });
                    if (result.length == 0) {
                        $scope.amigosruta.push({
                            nombre: $scope.programacion.amigo.nombres,
                            id: $scope.programacion.amigo.id
                        });
                    }
                }
            };

        }]);

})();