/**
 * Created by josec on 10/4/2015.
 */

angular.module('anApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('ices', {
                url: '/ices',
                templateUrl: 'client/app/ices/ices.html',
                controller: 'IcesCtrl'
            });
    });