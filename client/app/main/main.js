/**
 * Created by josec on 6/27/2015.
 */

angular.module('anApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('main', {
                url: '/',
                templateUrl: '/client/app/main/main.html',
                controller: 'MainCtrl'
            });
    });