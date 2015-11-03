/**
 * Created by josec on 8/30/2015.
 */


angular.module('anApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('inscripcion', {
                url: '/inscripcion',
                templateUrl: '/client/app/inscripcion/inscripcion.html',
                controller: 'InscripcionCtrl'
            });
    });