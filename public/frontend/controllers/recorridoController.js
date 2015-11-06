/*
 * Created by lina on 9/30/15.
 */

ruedapp.controller('recorridoController', ['$scope', '$rootScope', '$http', 'leafletData', 'ngTableParams',
    function ($scope, $rootScope, $http, leafletData, ngTableParams) {

        var recorridoInterval = 10000;
        var control;
        var recorridoId = 0;
        var inicioRecorrido;

        var today = new Date();

        $scope.amigosruta = [];
        $scope.hideHistorico = true;
        $scope.minDate = today;
        $scope.maxDate = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
        $scope.programacion = {
            hora: today,
            fecha: today
        };

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
                console.log("historico creado");
                recorridoId = 0;
                $scope.hideRecorrido = false;
                $scope.hideHistorico = true;
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
                url: '/ciclista/' + $rootScope.globals.currentUser.userId
            };

            $http(get).success(function (data) {
                $scope.userGlobalId = data;

                var get1 = {
                    method: 'GET',
                    url: '/ciclista/' + $scope.userGlobalId + '/amigos'
                };

                $http(get1).success(function (data) {
                    console.log("consulta ok");
                    $scope.amigos = data;
                }).error(function (data) {
                    console.log("Error consulta amigos : " + data);
                });
            }).error(function (data) {
                console.log("Error obtención id.");
                console.log("data: " + data);
            });


        };

        $scope.iniciarecorrido = function () {

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

                var post = {
                    method: 'POST',
                    url: '/recorrido',
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
                alert('Programación Creada');
                window.location.replace('#/inicio');
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

