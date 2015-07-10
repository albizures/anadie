/**
 * Created by josec on 7/8/2015.
 */
angular.module('anApp')
    .controller('ModalOpcionesCtrl',["$scope", '$modalInstance','opcion','Data', function ($scope,$modalIntance,opcion, Data) {
        Data.get('opLista')
            .then(function (result) {

                for(index in result){
                    result[index].codTipo = Number(result[index].codTipo);
                    result[index].id = Number(result[index].id);
                }
                $scope.tipos = result;
                console.log(result,$scope.opcion);
            });
        $scope.opcion = angular.copy(opcion);
        /*$scope.tipos = [
            {id : 1,nombreTipo : 'Menu'}
        ];*/
        $scope.ok = function () {
            $modalIntance.close($scope.opcion);
        };
        $scope.cancel = function () {
            $modalIntance.dismiss('cancel');
        }
    }]);