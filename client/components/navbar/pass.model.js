/**
 * Created by josec on 11/29/2015.
 */


angular.module('anApp')
    .controller('PassCtrl',['$scope','Data','utils', '$modalInstance',
        function ($scope, Data, utils,$modalInstance) {

            $scope.cambiar = function () {
                if($scope.newPass != $scope.tempPass){
                    return Data.toast({status : 'error', message : 'Las contraseñas no considen'});
                }
                console.log($scope.currentPass);
                console.log($scope.newPass);
                Data.post('userUpdclave',{user : {clave1 : utils.str_rot13($scope.currentPass) , clave2 : utils.str_rot13($scope.newPass)}})
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