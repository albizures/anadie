/**
 * Created by josec on 6/26/2015.
 */
angular.module('anApp')
    .controller('NavbarCtrl', ['$scope', '$location','$rootScope','Data',function ($scope, $location,$rootScope,Data) {
       /* $scope.opciones = [
            {'op':'Inicio'},
            {'op':'Preguntas y Respuestas'},
            {'op':'Registro'},
            {'op':'Administracion'},
            {'op':'Contacto'},
            {'op':'Acerca de'}];*/
       $scope.logout = function () {
            Data.get('logout')
                .then(function (results) {
                    console.log('resultado ',results);




                });
       };
    }]);