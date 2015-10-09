/**
 * Created by lina on 9/30/15.
 */

ruedapp.controller('perfilController',[ '$scope','$location', '$http', '$cookies', 'SessionService', function($scope, $location, $http, $cookies, SessionService) {

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

    /**
     * Lógica controlador
     */
    if(SessionService.getUserId()) {
        var get = {
            method: 'GET',
            url: 'http://localhost:9000/usuario/' + userId,
            headers: { 'Content-Type': 'application/json' }
        }

        $http(get).success(function (data) {
            console.log("Obtuvo usuario");
            $scope.perfilNombres = data.nombres;
            $scope.perfilApellidos = data.apellidos;
            $scope.perfilCiudad = data.ciudad;
            $scope.perfilCelular = data.celular;
            $scope.perfilFechaNacimiento = data.fechaNacimiento;
            $scope.perfilSexo = data.sexo;
            $scope.perfilCorreoElectronico = data.correoElectronico;

        }).error(function (data) {
            console.log("Error registro.");
        });
    }
    else {
        console.log("No hay id de usuario.");
    }

    $scope.registrar = function() {
        if($scope.form.$valid) {
            var post = {
                method: 'POST',
                url: 'http://localhost:9000/usuario/crear ',
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({ nombres: $scope.nombres, apellidos: $scope.apellidos, fechaNacimiento: $scope.fechaNacimiento, sexo: $scope.sexo,
                    ciudad: $scope.ciudad, celular: $scope.celular, correoElectronico: $scope.correoElectronico, contrasenia: $scope.contrasenia})
            }

            $http(post).success(function (data) {
                console.log("Registró");
                window.location.replace('/');

            }).error(function (data) {
                console.log("Error registro.");
            });
        }
    }

    $scope.login = function() {
        if($scope.form.$valid) {
            var post = {
                method: 'POST',
                url: 'http://localhost:9000/login ',
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({correoElectronico: $scope.correoElectronico, contrasenia: $scope.contrasenia})
            }

            $http(post).success(function (data) {
                console.log("Inició sesión");
                $scope.authenticated = true;
                window.location.replace('/');

            }).error(function (data) {
                console.log("Error registro.");
            });
        }
    }

    $scope.editarPerfil = function() {
        if($scope.form.$valid) {
            var post = {
                method: 'POST',
                url: 'http://localhost:9000/usuario/modificar',
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({ nombres: $scope.perfilNombres, apellidos: $scope.perfilApellidos, fechaNacimiento: $scope.perfilFechaNacimiento, sexo: $scope.perfilSexo,
                    ciudad: $scope.perfilCiudad, celular: $scope.perfilCelular, correoElectronico: $scope.perfilCorreoElectronico, contrasenia: $scope.perfilContrasenia})
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