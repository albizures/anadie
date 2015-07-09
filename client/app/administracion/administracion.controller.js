/**
 * Created by josec on 7/4/2015.
 */


angular.module('anApp')
    .controller('AdministracionCtrl',['$scope','Data','$rootScope','ngTableParams','$filter','$modal',
                             function ($scope,Data,$rootScope, ngTableParams,$filter,$modal) {
        $scope.filtro = false;
        Data.get('opDatos')
            .then(function (results) {
                console.log(results);
                $scope.opciones = results;
                for(index in $scope.opciones){
                    $scope.opciones[index].id = Number($scope.opciones[index].id);
                    $scope.opciones[index].idPadre = Number($scope.opciones[index].idPadre);
                    $scope.opciones[index].codTipo = Number($scope.opciones[index].codTipo);
                    $scope.opciones[index].idTipo = Number($scope.opciones[index].idTipo);
                    $scope.opciones[index].orden = Number($scope.opciones[index].orden);
                }
                $scope.tableOpciones = new ngTableParams({
                        page : 1,
                        count : 10,
                        sorting : {
                            nombre : 'asc'
                        }
                    },{
                        total : $scope.opciones.length,
                        getData : function ($defer, params) {
                            var orderedData = params.sorting() ? $filter('orderBy')($scope.opciones, params.orderBy()) : $scope.opciones;
                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        }
                    }
                );
            });

        $scope.editar = function (id) {
            var modalOpciones = $modal.open({
                templateUrl : 'modelOpciones',
                controller : 'ModalOpcionesCtrl',
                resolve : {
                    opcion : function () {
                        return $scope.opciones.filter(function(opcion){return opcion.id == id})[0];
                    }
                }
            });
            modalOpciones.result.then(function (opcion) {
                Data.post('opDatosU',{'opcion':opcion})
                    .then(function (results) {
                        for(index in $scope.opciones){
                            if($scope.opciones[index].id == opcion.id){
                                $scope.opciones[index] = opcion;
                                $scope.tableOpciones.reload();
                            }
                        }
                    });
            }, function () {
            });
        };
    }]);