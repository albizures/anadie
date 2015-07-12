/**
 * Created by josec on 7/12/2015.
 */

angular.module('anApp')
    .controller('ModalUsuariosCtrl',["$scope", '$modalInstance','usuario','Data','utils', function ($scope,$modalIntance,usuario, Data, utils) {
        $scope.roles = undefined;

        console.log(usuario);
        $scope.usuario = angular.copy(usuario);
        $scope.ok = function () {
            $modalIntance.close($scope.usuario);
        };
        $scope.cancel = function () {
            $modalIntance.dismiss('cancel');
        };
    }]);
