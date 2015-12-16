/**
 * Created by josec on 10/4/2015.
 */

angular.module('anApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('organos', {
                url: '/organos',
                templateUrl: '/client/app/organos/organos.html',
                controller: 'OrganosCtrl'
            });
    });