/**
 * Created by josec on 8/9/2015.
 */

angular.module('anApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('precalificado', {
                url: '/precalificado',
                templateUrl: '/client/app/precalificado/precalificado.html',
                controller: 'PrecCtrl'
            });
    });