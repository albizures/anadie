/**
 * Created by josec on 10/4/2015.
 */
angular.module('anApp')
    .controller('ModalOrganosCtrl',['$scope','Data','utils', '$modalInstance','organo',
        function ($scope, Data, utils,$modalInstance,organo) {
            $scope.organo = organo;
		
            $scope.ok = function () {
                $modalInstance.close($scope.organo);
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }]);