/**
 * Created by josec on 8/9/2015.
 */


angular.module('anApp')
    .controller('PrecCtrl',['$scope','Data','$rootScope','ngTableParams','$filter','$modal','utils',
        function ($scope,Data, $rootScope, ngTableParams, $filter , $modal, utils) {
            $scope.filtro = false;
            $scope.$watch('filtro', function (newValue, oldValue) {
                if(newValue !== undefined && newValue !== oldValue){
                    if($scope.tabPrecalificado){
                        $scope.tabPrecalificado.reload();
                    }

                }
            });
            Data.get('precalificadosSel')
                .then(function (results) {
                    for(index in results){

                        results[index] = utils.convertNumber(results[index]);
                    }
                    // console.log(results);
                    $scope.opciones = results;
                    for(index in $scope.opciones){

                        $scope.opciones[index].tipo = {
                            codTipo : $scope.opciones[index].codTipo,
                            id  : $scope.opciones[index].idTipo,
                            nombreTipo : $scope.opciones[index].nombreTipo
                        }
                    }
                    $scope.tabPrecalificado = new ngTableParams({
                            page : 1,
                            count : 10,
                            sorting : {
                                nombre : 'asc'
                            }
                        },{
                            total : $scope.opciones.length,
                            filterDelay: 350,
                            getData : function ($defer, params) {
                                var orderedData = params.sorting() ? $filter('orderBy')($scope.opciones, params.orderBy()) : $scope.opciones;
                                if($scope.filtro){
                                    orderedData = params.filter() ? $filter('filter')(orderedData, params.filter()) : orderedData;
                                }
                                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                            }
                        }
                    );
                });
            $scope.limpiar = function () {
                $scope.tabPrecalificado.sorting({});
                $scope.tabPrecalificado.filter({});
                $scope.filtro = false;
            };
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
            };
        }]);