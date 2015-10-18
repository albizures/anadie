/**
 * Created by josec on 7/4/2015.
 */


angular.module('anApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('administracion', {
                url: '/administracion',
                templateUrl: 'client/app/administracion/administracion.html',
                controller: 'AdministracionCtrl'
            });
    });