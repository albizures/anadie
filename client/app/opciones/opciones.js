/**
 * Created by josec on 8/9/2015.
 */

angular.module('anApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('opciones', {
                url: '/opciones',
                templateUrl: 'client/app/opciones/opciones.html',
                controller: 'OpcionesCtrl'
            });
    });