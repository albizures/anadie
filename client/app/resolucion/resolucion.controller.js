/**
 * Created by josec on 8/9/2015.
 */


angular.module('anApp')
    .controller('ResolucionCtrl',['$scope','Data','$rootScope','ngTableParams','$filter','$modal','utils',
        function ($scope,Data, $rootScope, ngTableParams, $filter , $modal, utils) {
            $scope.filtro = false;
            $scope.$watch('filtro', function (newValue, oldValue) {
                if(newValue !== undefined && newValue !== oldValue){
                    if($scope.tabResolucion){
                        $scope.tabResolucion.reload();
                    }

                }
            });
            Data.get('resolucionSel')
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
                    $scope.tabBase = new ngTableParams({
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
        $scope.agregar = function () {
            var modalResolucion = $modal.open({
                templateUrl : 'modalResolucion',
                controller : 'ModalResolucionCtrl',
                size : 'lg',
                backdrop : 'static',
                resolve :{
                    resolucion: function () {
                        return undefined;
                    }
                }
            });
		};
			$scope.limpiar = function () {
                $scope.tabBase.sorting({});
                $scope.tabBase.filter({});
                $scope.filtro = false;
            };
        }]);