/**
 * Created by josec on 9/30/2015.
 */


angular.module('anApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('ubicaciones', {
                url: '/ubicaciones',
                templateUrl: 'client/app/ubicaciones/ubicaciones.html',
                controller: 'UbicacionesCtrl'
            });
    });