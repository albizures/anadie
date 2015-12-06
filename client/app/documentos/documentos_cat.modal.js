/**
 * Created by josec on 10/4/2015.
 */
angular.module('anApp')
    .controller('ModalcatDocumentosCtrl',['$scope','Data','utils', '$modalInstance','documento',
        function ($scope, Data, utils,$modalInstance,documento) {
            $scope.documento = documento;
		
            $scope.ok = function () {
                $modalInstance.close($scope.documento);
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }]);