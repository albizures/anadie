/**
 * Created by josec on 8/9/2015.
 */


angular.module('anApp')
    .controller('ResolucionCtrl',['$scope','Data','$rootScope','ngTableParams','$filter','$modal','utils',
        function ($scope,Data, $rootScope, ngTableParams, $filter , $modal, utils) {
            $scope.filtro = false;
            $scope.$watch('filtro', function (newValue, oldValue) {
                if (newValue !== undefined && newValue !== oldValue) {
                    if ($scope.tabResolucion) {
                        $scope.tabResolucion.reload();
                    }

                }
            });
            function traer(){
                Data.get('resSel')
                    .then(function (results) {
                        console.log(results);
                        $scope.resoluciones = results;
                        if($scope.tabResolucion){
                            $scope.tabResolucion.reload();
                        }else{
                            $scope.tabResolucion = new ngTableParams({
                                    page: 1,
                                    count: 10,
                                    sorting: {
                                        organo: 'asc'
                                    }
                                }, {
                                    total: $scope.resoluciones.length,
                                    filterDelay: 350,
                                    getData: function ($defer, params) {
                                        var orderedData = params.sorting() ? $filter('orderBy')($scope.resoluciones, params.orderBy()) : $scope.resoluciones;
                                        if ($scope.filtro) {
                                            orderedData = params.filter() ? $filter('filter')(orderedData, params.filter()) : orderedData;
                                        }
                                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                                    }
                                }
                            );
                        }
                    });
            }
            traer();
			$scope.agregar = function () {
				var modalResolucion = $modal.open({
					templateUrl : 'modalResolucion',
					controller : 'ModalResolucionCtrl',
					size : 'lg',
					backdrop : 'static',
					resolve :{
						res: function () {
							return undefined;
						}
					}	
				});
                modalResolucion.result.then(function () {
                    traer();
                });
			};
            $scope.ver = function (res) {
                var modalBase = $modal.open({
                    templateUrl : 'modalResolucion',
                    controller : 'ModalResolucionCtrl',
                    size : 'lg',
                    backdrop : 'static',
                    resolve :{
                        res: function () {
                            return res;
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