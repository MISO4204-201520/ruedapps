/*
 * Created by lina on 9/30/15.
 */

ruedapp.controller('inicioController', ['$scope', '$rootScope', '$location', '$http',
    function ($scope, $rootScope, $location, $http) {
        /**
         * Obtención de amigos y usuarios de la plataforma.
         */
        $(function() {
            var get = {
                method: 'GET',
                url: '/ciclista/' + $rootScope.globals.currentUser.userId
            };

            $http(get).success(function (data) {
                console.log("Obtuvo usuario");
                console.log("data: "+ data);
                $scope.userGlobalId = data;

                var get1 = {
                    method: 'GET',
                    url: '/ciclista/' + $scope.userGlobalId + '/amigos'
                };
                $http(get1).success(function (data) {
                    $scope.amigos = data;

                }).error(function (data) {
                    console.log("Error amigos.");
                    console.log("data: "+ data);
                });

            }).error(function (data) {
                console.log("Error obtención id.");
                console.log("data: "+ data);
            });
        });

        var planearRecorrido = function(){
            window.location.replace('#/recorridos');
        };

        var enviarMensaje = function() {
            window.location.replace('#/mensaje');
        };

        var agregarAmigo = function() {
            window.location.replace('#/amigos');
        };

    }]);

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

        /**
         * Definición selectable mis amigos
         */
        $(function() {
            $scope.amigosSeleccionados = [];
            $scope.noAmigosSeleccionados = [];

            var amigos = $("#ruedapps-selectable-amigos");
            amigos.selectable({
                selected: function(event, ui){
                    $scope.amigosSeleccionados.push(ui.selected.value);
                }
            });
            amigos.on("selectableselected", function (event, ui) {
            });

            var ciclistas = $("#ruedapps-selectable-ciclistas");
            ciclistas.selectable({
                selected: function(event, ui){
                    $scope.noAmigosSeleccionados.push(ui.selected.value);
                }
            });
            ciclistas.on("selectableselected", function (event, ui) {
            });
        });

        /**
         * Obtención de amigos y usuarios de la plataforma.
         */
        $(function() {
            var get = {
                method: 'GET',
                url: '/ciclista/' + $rootScope.globals.currentUser.userId
            };

            $http(get).success(function (data) {
                console.log("Obtuvo usuario");
                console.log("data: "+ data);
                $scope.userGlobalId = data;

                var get1 = {
                    method: 'GET',
                    url: '/ciclista/' + $scope.userGlobalId + '/amigos'
                };
                $http(get1).success(function (data) {
                    $scope.amigos = data;

                }).error(function (data) {
                    console.log("Error amigos.");
                    console.log("data: "+ data);
                });

                var get2 = {
                    method: 'GET',
                    url: '/ciclista/' + $scope.userGlobalId + '/no-amigos'
                };
                $http(get2).success(function (data) {
                    $scope.noAmigos = data;

                }).error(function (data) {
                    console.log("Error no amigos.");
                    console.log("data: "+ data);
                });

            }).error(function (data) {
                console.log("Error obtención id.");
                console.log("data: "+ data);
            });
        });

        $scope.registrar = function() {
            if($scope.form.$valid) {
                var userInfo = $scope.userInfo;
                var post = {
                    method: 'PUT',
                    url: '/usuario',
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
                    window.location.replace('#/inicio');
                }, function () {
                    $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                });
            }
        };

        $scope.logout = function() {
            AuthFactory.logout().then(function () {
                $rootScope.loggedIn = false;
                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
                window.location.replace('/');
            }, function () {
                console.error("Error logout.");
            });
        };

        $scope.editarPerfil = function() {
            if($scope.form.$valid) {
                var userInfo = $scope.userInfo;
                var post = {
                    method: 'POST',
                    url: '/usuario',
                    headers: { 'Content-Type': 'application/json' },
                    data: JSON.stringify(userInfo)
                };

                $http(post).success(function () {
                    console.log("Modificó");
                    window.location.replace('/');

                }).error(function (data) {
                    console.log("Error registro.");
                    console.log("data: "+ data);
                });
            }
        };

        $scope.agregarAmigo = function() {
            $scope.noAmigosSeleccionados.forEach(function(element){
                var put = {
                    method: 'PUT',
                    url: '/ciclista/' + $scope.userGlobalId + '/amigos/' + element,
                    headers: {'Content-Type': 'application/json'}
                };

                $http(put).success(function () {
                    console.log("Creó amigo");
                    window.location.replace('#/amigos');

                }).error(function (data) {
                    console.log("Error creación amigo.");
                    console.log("data: "+ data);
                });
            });
        };

        $scope.eliminarAmigo = function() {
            $scope.amigosSeleccionados.forEach(function(element){
                var del = {
                    method: 'DELETE',
                    url: '/ciclista/' + $scope.userGlobalId + '/amigos/' + element,
                    headers: {'Content-Type': 'application/json'}
                };

                $http(del).success(function () {
                    console.log("Eliminó amigo");
                    window.location.replace('#/amigos');

                }).error(function (data) {
                    console.log("Error eliminar amigo.");
                    console.log("data: "+ data);
                });
            });
        }
    }]);

ruedapp.controller('recorridoController',[ '$scope', '$rootScope', '$http', 'leafletData', 'ngTableParams',
    function($scope, $rootScope, $http, leafletData, ngTableParams) {

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
                method: 'PUT',
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
                console.log("Error ubicacion/crear data: "+ data);
            });
        };

        $scope.consultahistorico = function() {

            var post = {
                method: 'get',
                url: '/historico/usuario/0',
                headers: {'Content-Type': 'application/json'}
            };

            $http(post).success(function (data) {
                console.log("consulta ok");
                $scope.historicoUsuario = data;
            }).error(function (data) {
                console.log("Error consulta historico : " + data);
            });
        };

        $scope.consultarutas = function() {

            var post = {
                method: 'get',
                url: '/recorrido/programacion/participante/0',
                headers: {'Content-Type': 'application/json'}
            };

            $http(post).success(function (data) {
                console.log("consulta rutas participante ok");
                $scope.rutasUsuario = data;
            }).error(function (data) {
                console.log("Error consulta rutas participante : " + data);
            });
        };

        $scope.consultaamigos = function() {

            var get = {
                method: 'GET',
                url: '/ciclista/' + $rootScope.globals.currentUser.userId
            };

            $http(get).success(function (data) {
                $scope.userGlobalId = data;

                var post = {
                    method: 'GET',
                    url: '/amigo/' + $scope.userGlobalId
                };

                $http(post).success(function (data) {
                    console.log("consulta ok");
                    $scope.amigos = data;
                }).error(function (data) {
                    console.log("Error consulta amigos : " + data);
                });
            }).error(function (data) {
                console.log("Error obtención id.");
                console.log("data: "+ data);
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
                    method: 'PUT',
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
                    method: 'PUT',
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

        $scope.creaprogramacion = function() {

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
                method: 'put',
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

        $scope.addAmigo = function() {

            if ( typeof($scope.programacion.amigo) != 'undefined') {
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

ruedapp.controller('directorioServiciosController', ['$scope', '$rootScope', '$http', '$cookies','leafletData',
    function ($scope, $rootScope, $http, $cookies,leafletData) {

        $scope.categorias = null;
        $scope.serviciosPorCategoria = null;
        $scope.categoriaSeleccionada = null;

        $scope.loadmap = function () {
            // ToDo drag del marker y Onclick get LatLog en el Disable input
            leafletData.getMap('ubicacion-map').then(function (map) {
                map.locate({setView: true, maxZoom: 16});
                L.Control.geocoder().addTo(map);
            });
        };
        $scope.registrarCategoria = function () {

            if($scope.form.$valid) {
                var categoria = $scope.categoria;
                var put = {
                    method: 'PUT',
                    url: '/categoria',
                    headers: { 'Content-Type': 'application/json' },
                    data: JSON.stringify(categoria)
                };

                $http(put).success(function (data) {
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
                url: '/categoria'
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
        };

        $scope.retornarServiciosPorCategoria = function () {

            var idCategoria = $cookies.get('idCategoriaSeleccionada');
            console.log("Id de la categoría en sesión:  " + idCategoria);

            var get = {
                method: 'GET',
                url: '/categoria/' + idCategoria + '/servicio'
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
                var put = {
                    method: 'PUT',
                    url: '/categoria/' + idCategoria + '/servicio',
                    headers: { 'Content-Type': 'application/json' },
                    data: JSON.stringify(servicio)
                };

                $http(put).success(function (data) {
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