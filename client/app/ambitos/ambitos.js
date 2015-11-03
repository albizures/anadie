/**
 * Created by josec on 10/4/2015.
 */

angular.module('anApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('ambitos', {
                url: '/ambitos',
                templateUrl: '/client/app/ambitos/ambitos.html',
                controller: 'AmbitosCtrl'
            });
    });