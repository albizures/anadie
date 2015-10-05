/**
 * Created by josec on 10/4/2015.
 */

angular.module('anApp')
    .controller('ModalIcesCtrl',['$scope','Data','utils', '$modalInstance','ice',
    function ($scope, Data, utils,$modalInstance,ice) {
        $scope.ice = ice;

        $scope.ok = function () {
            $modalInstance.close($scope.ice);
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);