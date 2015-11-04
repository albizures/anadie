/**
 * Created by josec on 10/4/2015.
 */

angular.module('anApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('tp', {
                url: '/tp',
                templateUrl: '/client/app/tipoPrecalificados/tipoPrecalificados.html',
                controller: 'TPCtrl'
            });
    });