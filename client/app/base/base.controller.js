/**
 * Created by josec on 8/9/2015.
 */


angular.module('anApp')
    .controller('BaseCtrl',['$scope','Data','$rootScope','ngTableParams','$filter','$modal','utils',
        function ($scope,Data, $rootScope, ngTableParams, $filter , $modal, utils) {
            $scope.filtro = false;
            $scope.$watch('filtro', function (newValue, oldValue) {
                if(newValue !== undefined && newValue !== oldValue){
                    if($scope.tabBase){
                        $scope.tabBase.reload();
                    }

                }
            });
            function traer() {
                Data.get('baseSel')
                    .then(function (results) {
                        console.log(results);
                        $scope.bases = results;
                        if($scope.tabBase){
                            $scope.tabBase.reload();
                        }else{
                            $scope.tabBase = new ngTableParams({
                                    page : 1,
                                    count : 10,
                                    sorting : {
                                        nombre : 'asc'
                                    }
                                },{
                                    total : $scope.bases.length,
                                    filterDelay: 350,
                                    getData : function ($defer, params) {
                                        var orderedData = params.sorting() ? $filter('orderBy')($scope.bases, params.orderBy()) : $scope.bases;
                                        if($scope.filtro){
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
                var modalBase = $modal.open({
                    templateUrl : 'modalBase',
                    controller : 'ModalBaseCtrl',
                    size : 'lg',
                    backdrop : 'static',
                    resolve :{
                        base: function () {
                            return undefined;
                        }
                    }
                });
                modalBase.result.then(function () {
                    traer();
                });
            };
            $scope.ver = function (base) {
                var modalBase = $modal.open({
                    templateUrl : 'modalBase',
                    controller : 'ModalBaseCtrl',
                    size : 'lg',
                    backdrop : 'static',
                    resolve :{
                        base: function () {
                            return base;
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