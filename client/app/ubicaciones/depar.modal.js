/**
 * Created by josec on 10/1/2015.
 */
angular.module('anApp')
    .controller('ModalDeparCtrl',["$scope", '$modalInstance','Data','utils','pais',
        function ($scope,$modalIntance, Data, utils,pais) {
            $scope.pais = pais;
            $scope.newDepar = [];
            $scope.agregar = function () {
                $scope.depar.idPais = pais.id;
                Data.post('deptogeoIn',$scope.depar)
                    .then(function (result) {
                        Data.toast(result);
                        if(result.status === 'success'){
                            $scope.depar.id = result.data;
                            $scope.newDepar.push($scope.depar);
                            $scope.depar = {};
                        }
                    });
            };
            $scope.ok = function () {
                $modalIntance.close($scope.newDepar);
            };
        }]);