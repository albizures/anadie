/**
 * Created by josec on 6/26/2015.
 */
angular.module('anApp')
    .controller('LoginCtrl',['$location','$scope','Data','$rootScope',function ($location,$scope,Data,$rootScope) {
        $scope.login = function(customer){
            Data.post('login',{customer : customer})
                .then(function (results) {
                    console.log('resultado ',results);
                    Data.toast(results);
                    if(results.status === "success"){
                        $location.path("main");
                        $rootScope.usuario = {
                            nombre : results.name,
                            nombres : results.nombres,
                            apellidos : results.apellidos,
                            idRol : Number(results.idrol),
                            rol : results.rol,
                            idOrganizacion : results.idorganizacion,
                            organizacion : results.organizacion,
                            email : results.email
                        };
                        $rootScope.opciones = results.opciones;
                    }
                });
        }
    }]);