/**
 * Created by josec on 11/10/2015.
 */
angular.module('anApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('finalizar', {
                url: '/finalizar/:id',
                templateUrl: '/client/app/finalizar/finalizar.html',
                controller: 'FinalizarCtrl'
            });
    });