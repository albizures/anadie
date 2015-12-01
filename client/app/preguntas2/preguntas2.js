/**
 * Created by josec on 10/21/2015.
 */

angular.module('anApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('preguntas2', {
                url: '/preguntas2/:id',
                templateUrl: '/client/app/preguntas2/preguntas2.html',
                controller: 'Preguntas2Ctrl'
            });
    });
