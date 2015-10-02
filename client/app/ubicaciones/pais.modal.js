/**
 * Created by josec on 10/1/2015.
 */
angular.module('anApp')
    .controller('ModalPaisCtrl',["$scope", '$modalInstance','Data','utils',
        function ($scope,$modalIntance, Data, utils) {
            $scope.newPaises = [];
            $scope.agregar = function () {
                Data.post('paisIn',$scope.pais)
                    .then(function (result) {
                        Data.toast(result);
                        if(result.status === 'success'){
                            $scope.pais.id = result.data;
                            $scope.newPaises.push($scope.pais);
                            $scope.pais = {};
                        }
                    });
            };
            $scope.ok = function () {
                $modalIntance.close($scope.newPaises);
            };
        }]);