/**
 * Created by josec on 8/9/2015.
 */

angular.module('anApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('resolucion', {
                url: '/resolucion',
                templateUrl: '/client/app/resolucion/resolucion.html',
                controller: 'ResolucionCtrl'
            });
    });