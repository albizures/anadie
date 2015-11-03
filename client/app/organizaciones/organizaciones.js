/**
 * Created by josec on 8/9/2015.
 */


angular.module('anApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('organizaciones', {
                url: '/organizaciones',
                templateUrl: '/client/app/organizaciones/organizaciones.html',
                controller: 'organizacionCtrl'
            });
    });