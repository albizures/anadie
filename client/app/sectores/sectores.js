/**
 * Created by josec on 10/4/2015.
 */

angular.module('anApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('sectores', {
                url: '/sectores',
                templateUrl: '/client/app/sectores/sectores.html',
                controller: 'SectoresCtrl'
            });
    });