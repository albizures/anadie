/**
 * Created by josec on 10/4/2015.
 */
angular.module('anApp')
    .controller('ModalTPCtrl',['$scope','Data','utils', '$modalInstance','tp',
        function ($scope, Data, utils,$modalInstance,tp) {
            $scope.tp = tp;
		
            $scope.ok = function () {
                $modalInstance.close($scope.tp);
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }]);