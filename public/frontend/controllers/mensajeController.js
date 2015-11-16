/*
 * Created by lina on 9/30/15.
 */
(function() {
    var ruedapp = angular.module('ruedapp');
    ruedapp.controller('mensajeController', ['$scope', '$rootScope', '$http', '$location',
        function ($scope, $rootScope, $http, $location) {
            $scope.conectar = function () {
                // ruta del socket armada a partir de la url de la página actual
                var socketUrl =
                    ($location.protocol() == "https" ? "wss" : "ws") + "://" +
                    $location.host() +
                    ($location.port() != "80" ? ":" + $location.port() : "") +
                    "/mensajeSocket";

                // Abrir socket
                var websocket = new WebSocket(socketUrl);
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
                    console.log("Message socket connected");
                }

                function onClose() {
                    console.log("Message socket disconected");
                }

                function onMessage(evt) {
                    console.log("Message received: " + evt.data);

                    var dto = JSON.parse(evt.data);
                    var recibidos = $('#mensajesRecibidos');
                    recibidos.prop('value', recibidos.prop('value') + (dto.remitente + ": " + dto.mensaje + "\n"));
                }

                function onError(evt) {
                    console.log("Message error: " + evt.data);
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

            $scope.enviarMensaje = function () {
                if ($scope.frmEnviar.$valid) {
                    // Correo de usuario actual
                    $scope.mensajeInfo.remitente = $rootScope.globals.currentUser.userId;

                    //Tomar correo elctrónico del amigo
                    $scope.mensajeInfo.destinatario = $scope.mensajeInfo.destinatarioCompleto.correoElectronico;

                    // Mandar mensaje a socket
                    var dto = JSON.stringify($scope.mensajeInfo);
                    $rootScope.mensajeSocket.send(dto);
                }
            };

            $scope.consultaAmigos = function () {
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
        }]);
})();