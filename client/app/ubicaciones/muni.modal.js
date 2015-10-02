/**
 * Created by josec on 10/1/2015.
 */
angular.module('anApp')
    .controller('ModalMuniCtrl',["$scope", '$modalInstance','Data','utils','depar',
        function ($scope,$modalInstance, Data, utils,depar) {
            $scope.depar = depar;
            $scope.newMuni = [];
            $scope.agregar = function () {
                $scope.muni.idDeptogeo = depar.id;
                Data.post('municipioIn',$scope.muni)
                    .then(function (result) {
                        Data.toast(result);
                        if(result.status === 'success'){
                            $scope.muni.id = result.data;
                            $scope.newMuni.push($scope.muni);
                            $scope.muni = {};
                        }
                    });
            };
            $scope.ok = function () {
                $modalInstance.close($scope.newMuni);
            };
        }]);