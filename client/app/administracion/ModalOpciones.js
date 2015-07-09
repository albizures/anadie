/**
 * Created by josec on 7/8/2015.
 */
angular.module('anApp')
    .controller('ModalOpcionesCtrl',["$scope", '$modalInstance','opcion', function ($scope,$modalIntance,opcion) {
        $scope.opcion = angular.copy(opcion);
        $scope.tipos = [
            {id : 1,nombreTipo : 'Menu'}
        ];
        $scope.ok = function () {
            $modalIntance.close($scope.opcion);
        };
        $scope.cancel = function () {
            $modalIntance.dismiss('cancel');
        }
    }]);