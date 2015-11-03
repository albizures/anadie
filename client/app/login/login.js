/**
 * Created by josec on 6/26/2015.
 */

angular.module('anApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: '/client/app/login/login.html',
                controller: 'LoginCtrl'
            });
    });
