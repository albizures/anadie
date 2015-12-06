/**
 * Created by josec on 10/4/2015.
 */

angular.module('anApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('documentos', {
                url: '/documentos',
                templateUrl: '/client/app/documentos/documentos.html',
                controller: 'DocumentosCtrl'
            });
    });