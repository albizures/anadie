/**
 * Created by josec on 8/9/2015.
 */

angular.module('anApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('base', {
                url: '/base',
                templateUrl: '/client/app/base/base.html',
                controller: 'BaseCtrl'
            });
    });