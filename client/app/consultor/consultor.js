/**
 * Created by josec on 10/29/2015.
 */

angular.module('anApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('consultor', {
                url: '/consultor',
                templateUrl: 'client/app/consultor/consultor.html',
                controller: 'ConsultorCtrl'
            });
    });