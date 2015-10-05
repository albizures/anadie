/**
 * Created by josec on 10/4/2015.
 */
angular.module('anApp')
    .controller('ModalSectoresCtrl',['$scope','Data','utils', '$modalInstance','sector',
        function ($scope, Data, utils,$modalInstance,sector) {
            $scope.sector = sector;

            $scope.ok = function () {
                $modalInstance.close($scope.sector);
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }]);