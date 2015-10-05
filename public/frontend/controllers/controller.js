/**
 * Created by lina on 9/30/15.
 */

ruedapp.controller('perfilController',[ '$scope','$location', function($scope, $location) {
    console.log("entra");
    $scope.route = function ( path ) {
        console.log("que mas");
        $location.path( path );
    };
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