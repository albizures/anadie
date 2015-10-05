/**
 * Created by josec on 9/30/2015.
 */
angular.module('anApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('licitaciones', {
                url: '/licitaciones',
                templateUrl: 'client/app/licitaciones/licitaciones.html',
                controller: 'LicitacionesCtrl'
            });
    });