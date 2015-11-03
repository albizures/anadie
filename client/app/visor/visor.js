/**
 * Created by josec on 10/13/2015.
 */

angular.module('anApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('visor', {
                url: '/visor/:id',
                templateUrl: '/client/app/visor/visor.html',
                controller: 'VisorCtrl',
                params: {documento : null}
            });
    });