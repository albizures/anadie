/**
 * Created by josec on 7/8/2015.
 */
angular.module('anApp')
    .controller('ModalOpcionesCtrl',["$scope", '$modalInstance','opcion','Data','tipoMenu','utils', function ($scope,$modalIntance,opcion, Data, tipoMenu, utils) {
        $scope.padres = undefined;
        if(opcion.idTipo !== undefined){
            var id = tipoMenu[opcion.idTipo];
            if(id !== false) {
                id = 1 ; //se cambio al tipo de opcion para traer todos los menus
                Data.get('opListaH/' + id)
                    .then(function (result) {

                        for (index in result) {
                            result[index] = utils.convertNumber(result[index]);
                        }

                        $scope.padres = result;
                    });
            }
        }

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
            if($scope.opcion.nombreTipo == undefined){
                $scope.opcion.nombreTipo = $scope.tipos.filter(function(tipo){ return tipo.id == $scope.opcion.idTipo})[0].nombreTipo;
            }
            if($scope.opcion.idPadre == undefined || $scope.opcion.idPadre == null || $scope.opcion.idPadre == ""){
                $scope.opcion.idPadre = 0;
            }
            $modalIntance.close($scope.opcion);
        };
        $scope.cancel = function () {
            $modalIntance.dismiss('cancel');
        };
        $scope.$watch('opcion.idTipo', function (newValue, oldValue) {
            if(newValue !== undefined && newValue !== oldValue && (!$scope.padres || $scope.opcion.idTipo != $scope.padres[0].id)){
                var id = tipoMenu[$scope.opcion.idTipo];
                if(id !== false){
                    Data.get('opListaH/'+id)
                        .then(function (result) {
                            console.log(result,id,$scope.opcion.idTipo);
                            for(index in result){
                                result[index] = utils.convertNumber(result[index]);
                                if(result[index].id == $scope.opcion.id){
                                    result.splice(index,1);
                                }
                            }
                            $scope.padres = result;
                            $scope.opcion.idPadre = $scope.padres[0].id;
                        });
                }else{
                    $scope.padres = undefined;
                }
            }/*else{
                $scope.padres = undefined;
            }*/

        });
    }]);