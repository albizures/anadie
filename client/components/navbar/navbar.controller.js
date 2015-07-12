/**
 * Created by josec on 6/26/2015.
 */
angular.module('anApp')
    .controller('NavbarCtrl', ['$scope', '$location','$rootScope','Auth',function ($scope, $location,$rootScope,Auth) {
       /* $scope.opciones = [
            {'op':'Inicio'},
            {'op':'Preguntas y Respuestas'},
            {'op':'Registro'},
            {'op':'Administracion'},
            {'op':'Contacto'},
            {'op':'Acerca de'}];*/
        $rootScope.$watch('usuario', function () {
           // alert('cambio');
        });
        $scope.usuario = $rootScope.usuario;
       $scope.logout = function () {
            Auth.logout(function () {
                $location.path('/login');
            });
       };
    }]);