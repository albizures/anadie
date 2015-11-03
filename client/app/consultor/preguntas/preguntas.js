/**
 * Created by josec on 10/29/2015.
 */

angular.module('anApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('preguntasConsultor', {
                url: '/preguntas2/:evento/:ambito',
                templateUrl: 'client/app/consultor/preguntas/preguntas.html',
                controller: 'PreguntasConsultorCtrl'
            });
    });
