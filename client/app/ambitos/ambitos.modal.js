/**
 * Created by josec on 10/4/2015.
 */
angular.module('anApp')
    .controller('ModalAmbitosCtrl',['$scope','Data','utils', '$modalInstance','ambito',
        function ($scope, Data, utils,$modalInstance,ambito) {
            $scope.ambito = ambito;
		

            $scope.ok = function () {
                $modalInstance.close($scope.ambito);
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }]);