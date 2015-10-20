/*
 * Created by lina on 9/30/15.
 */

ruedapp.controller('perfilController', ['$scope', '$rootScope', '$location', '$http', '$cookies', 'AUTH_EVENTS', 'AuthFactory',
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
                    $rootScope.loggedIn = true;
                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                    window.location.replace('#/ruta');
                }, function () {
                    $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                });
            }
        };

        $scope.logout = function() {
            AuthFactory.logout.then(function () {
                $rootScope.$apply(function(){
                    $rootScope.loggedIn = false;
                })
                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
                window.location.replace('/');
            }, function () {
                console.error("Error logout.");
            });
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
        };

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
        };

        $scope.consultahistorico = function() {

            var post = {
                method: 'get',
                url: '/historico/usuario/0',
                headers: {'Content-Type': 'application/json'},
            };

            $http(post).success(function (data) {
                console.log("consulta ok");
                $scope.historicoUsuario = data;
            }).error(function (data) {
                console.log("Error consultahistorico : " + data);
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

ruedapp.controller('mensajeController', ['$scope', '$rootScope',
    function ($scope, $rootScope) {
        $scope.conectar = function () {
            // Abrir socket
            var websocket = new WebSocket("ws://localhost:9000/mensajeSocket");
            websocket.onopen = function (evt) {
                onOpen(evt)
            };
            websocket.onclose = function (evt) {
                onClose(evt)
            };
            websocket.onmessage = function (evt) {
                onMessage(evt)
            };
            websocket.onerror = function (evt) {
                onError(evt)
            };

            // Todos los eventos que el socket atiende

            function onOpen() {
                console.log("CONNECTED");
            }

            function onClose() {
                console.log("DISCONNECTED");
            }

            function onMessage(evt) {
                console.log("MENSAJE: " + evt.data);

                var dto = JSON.parse(evt.data);
                var recibidos = $('#mensajesRecibidos');
                recibidos.prop('value', recibidos.prop('value') + (dto.remitente + ": " + dto.mensaje + "\n"));
            }

            function onError(evt) {
                console.log("ERROR: " + evt.data);
            }

            $rootScope.mensajeSocket = websocket;

            $('#btnConectar').prop('disabled', true);
            $('#btnDesconectar').prop('disabled', false);
            $('#btnEnviar').prop('disabled', false);
        };

        $scope.desconectar = function () {
            // Cerrar socket
            $rootScope.mensajeSocket.close();

            $('#btnConectar').prop('disabled', false);
            $('#btnDesconectar').prop('disabled', true);
            $('#btnEnviar').prop('disabled', true);
        };

        $scope.enviarMensaje = function() {
            if ($scope.frmEnviar.$valid) {
                // Correo de usuario actual
                $scope.mensajeInfo.remitente = $rootScope.globals.currentUser.userId;

                // Mandar mensaje a socket
                var dto = JSON.stringify($scope.mensajeInfo);
                $rootScope.mensajeSocket.send(dto);
            }
        }
    }]);


function createButton(label, container) {
    var btn = L.DomUtil.create('button', '', container);
    btn.setAttribute('type', 'button');
    btn.innerHTML = label;
    return btn;
}

ruedapp.controller('directorioServiciosController', ['$scope', '$rootScope', '$http', '$cookies',
    function ($scope, $rootScope, $http, $cookies) {

        $scope.categorias = null;
        $scope.serviciosPorCategoria = null;
        $scope.categoriaSeleccionada = null;

        $scope.registrarCategoria = function () {

            if($scope.form.$valid) {
                var categoria = $scope.categoria;
                var post = {
                    method: 'POST',
                    url: '/categoria/registrar',
                    headers: { 'Content-Type': 'application/json' },
                    data: JSON.stringify(categoria)
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

        $scope.retornarCategorias = function () {

            var get = {
                method: 'GET',
                url: '/categoria/categorias'
            };

            $http(get).success(function (data) {
                console.log("Recuperó todas las categorías");
                console.log("data: " + data);
                $scope.categorias = data;

            }).error(function (data) {
                console.log("Error recuperando las categorías.");
                console.log("data: "+ data);
            });

        };

        $scope.seleccionarCategoria = function (value) {
            console.log("Se va a adicionar la categoria " + value.id + " a la sesión");
            $cookies.put('idCategoriaSeleccionada', value.id);
        }

        $scope.retornarServiciosPorCategoria = function () {

            var idCategoria = $cookies.get('idCategoriaSeleccionada');
            console.log("Id de la categoría en sesión:  " + idCategoria);

            var get = {
                method: 'GET',
                url: '/categoria/servicios/' + idCategoria
            };

            $http(get).success(function (data) {
                console.log("Recuperó todos los servicios de la categoria: " + idCategoria);
                console.log("data: " + data);
                $scope.serviciosPorCategoria = data;

            }).error(function (data) {
                console.log("Error recuperando los servicios de la categoria: " + idCategoria);
                console.log("data: "+ data);
            });

        };

        $scope.registrarServicio = function () {

            var idCategoria = $cookies.get('idCategoriaSeleccionada');
            console.log("Categoría a la cual se le va a adicionar un servicio: " + idCategoria);

            if($scope.form.$valid) {
                var servicio = $scope.servicio;
                var post = {
                    method: 'POST',
                    url: '/categoria/servicio/registrar/' + idCategoria,
                    headers: { 'Content-Type': 'application/json' },
                    data: JSON.stringify(servicio)
                };

                $http(post).success(function (data) {
                    console.log("Registró");
                    console.log("data: "+ data);
                    window.location.replace('#/categoria/servicios');

                }).error(function (data) {
                    console.log("Error registro.");
                    console.log("data: "+ data);
                });
            }

        }

    }]);