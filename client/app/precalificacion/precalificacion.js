/**
 * Created by josec on 10/11/2015.
 */



angular.module('anApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('precalificacion', {
                url: '/precalificacion',
                templateUrl: '/client/app/precalificacion/precalificacion.html',
                controller: 'PrecalificacionCtrl'
            });
    });