/**
 * Created by josec on 6/26/2015.
 */
angular.module('anApp')
    .controller('NavbarCtrl', function ($scope, $location,$rootScope) {
        $scope.opciones = [
            {'op':'Inicio'},
            {'op':'Preguntas y Respuestas'},
            {'op':'Registro'},
            {'op':'Administracion'},
            {'op':'Contacto'},
            {'op':'Acerca de'}];
    });