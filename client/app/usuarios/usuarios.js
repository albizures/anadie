/**
 * Created by josec on 8/9/2015.
 */

angular.module('anApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('usuarios', {
                url: '/usuarios',
                templateUrl: 'client/app/usuarios/usuarios.html',
                controller: 'UsuariosCtrl'
            });
    });