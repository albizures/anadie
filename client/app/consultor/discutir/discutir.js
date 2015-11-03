/**
 * Created by josec on 11/2/2015.
 */

angular.module('anApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('discutir', {
                url: '/discutir/:pregunta/:ambito',
                templateUrl: '/client/app/consultor/discutir/discutir.html',
                controller: 'DiscutirCtrl'
            });
    });