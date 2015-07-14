/**
 * Created by josec on 7/13/2015.
 */

/**
 * Created by josec on 7/8/2015.
 */
angular.module('anApp')
    .controller('ModalRolesCtrl',["$scope", '$modalInstance','rol',function ($scope,$modalIntance,rol) {
        $scope.rol = angular.copy(rol);

        $scope.ok = function () {
            $modalIntance.close($scope.rol);
        };
        $scope.cancel = function () {
            $modalIntance.dismiss('cancel');
        };
    }]);