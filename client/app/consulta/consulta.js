/**
 * Created by josec on 10/12/2015.
 */

angular.module('anApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('consulta', {
                url: '/consulta',
                templateUrl: '/client/app/consulta/consulta.html',
                controller: 'ConsultaCtrl'
            });
    });