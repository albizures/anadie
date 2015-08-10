/**
 * Created by josec on 7/13/2015.
 */

/**
 * Created by josec on 7/8/2015.
 */
angular.module('anApp')
    .controller('ModalOrganizacionCtrl',["$scope", '$modalInstance','organizacion',function ($scope,$modalIntance,organizacion) {
        $scope.organizacion = angular.copy(organizacion);

        $scope.ok = function () {
            $modalIntance.close($scope.organizacion);
        };
        $scope.cancel = function () {
            $modalIntance.dismiss('cancel');
        };
    }]);