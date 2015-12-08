/**
 * Created by josec on 11/29/2015.
 */


angular.module('anApp')
    .controller('PassCtrl',['$scope','Data','utils', '$modalInstance','administrador','usuario',
        function ($scope, Data, utils,$modalInstance,administrador , usuario) {
            $scope.administrador = administrador;

            var ruta = administrador? 'userSetclave' : 'userUpdclave';
            $scope.cambiar = function () {
                if($scope.newPass != $scope.tempPass){
                    return Data.toast({status : 'error', message : 'Las contraseñas no considen'});
                }
                console.log($scope.currentPass,$scope.newPass);
                Data.post(ruta,{user : {clave1 : utils.str_rot13($scope.currentPass) , clave2 : utils.str_rot13($scope.newPass) , nombreUsuario : usuario} })
                    .then(function (result) {
                        Data.toast(result);
                        if(result.status !== 'error'){
                            $modalInstance.close();
                        }
                    });
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }]);