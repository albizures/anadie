/**
 * Created by josec on 10/21/2015.
 */

angular.module('anApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('preguntas', {
                url: '/preguntas/:id',
                templateUrl: '/client/app/preguntas/preguntas.html',
                controller: 'PreguntasCtrl'
            });
    });
