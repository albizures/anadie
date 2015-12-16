/**
 * Created by josec on 8/9/2015.
 */

angular.module('anApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('resolucion', {
                url: '/resoluciones',
                templateUrl: '/client/app/resoluciones/resolucion.html',
                controller: 'ResolucionCtrl'
            });
    });