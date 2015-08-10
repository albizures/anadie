/**
 * Created by josec on 8/9/2015.
 */
angular.module('anApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('roles', {
                url: '/roles',
                templateUrl: 'client/app/roles/roles.html',
                controller: 'RolesCtrl'
            });
    });