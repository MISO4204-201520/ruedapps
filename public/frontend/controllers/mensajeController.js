/*
 * Created by lina on 9/30/15.
 */

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

        $scope.enviarMensaje = function () {
            if ($scope.frmEnviar.$valid) {
                // Correo de usuario actual
                $scope.mensajeInfo.remitente = $rootScope.globals.currentUser.userId;

                // Mandar mensaje a socket
                var dto = JSON.stringify($scope.mensajeInfo);
                $rootScope.mensajeSocket.send(dto);
            }
        }
    }]);
