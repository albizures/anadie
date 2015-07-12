/**
 * Created by josec on 7/8/2015.
 */
angular.module('anApp')
    .controller('ModalOpcionesCtrl',["$scope", '$modalInstance','opcion','Data','tipoMenu','utils', function ($scope,$modalIntance,opcion, Data, tipoMenu, utils) {
        $scope.padres = undefined;
        Data.get('opLista')
            .then(function (result) {

                for(index in result){
                    result[index] = utils.convertNumber(result[index]);
                }
                $scope.tipos = result;
                //console.log(result,$scope.opcion);
            });

        $scope.opcion = angular.copy(opcion);
        if(!$scope.opcion.idTipo){
            $scope.opcion.idTipo = 1;
        }
        console.log(opcion);
        /*$scope.tipos = [
            {id : 1,nombreTipo : 'Menu'}
        ];*/
        $scope.ok = function () {
            if($scope.opcion.idPadre == undefined || $scope.opcion.idPadre == null || $scope.opcion.idPadre == ""){
                $scope.opcion.idPadre = 0;
            }
            $modalIntance.close($scope.opcion);
        };
        $scope.cancel = function () {
            $modalIntance.dismiss('cancel');
        };
        $scope.$watch('opcion.idTipo', function (newValue, oldValue) {
            if(newValue !== undefined && newValue !== oldValue){
                console.log($scope.opcion.idTipo);
                var id = tipoMenu[$scope.opcion.idTipo];
                if(id !== false){
                    Data.get('opListaH/'+id)
                        .then(function (result) {
                            console.log(result);
                            for(index in result){
                                result[index] = utils.convertNumber(result[index]);
                            }

                            $scope.padres = result;
                        });
                }else{
                    $scope.padres = undefined;
                }
            }

        });
    }]);