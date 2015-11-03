/**
 * Created by josec on 7/5/2015.
 */
angular.module('anApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('contacto', {
                url: '/contacto',
                templateUrl: '/client/app/contacto/contacto.html',
                controller: 'ContactoCtrl'
            });
    });