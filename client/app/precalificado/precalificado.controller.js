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
            function traer() {
                Data.get('precalificadosSel')
                    .then(function (results) {
                        $scope.precalificados = results;
                        if($scope.tabPrecalificado){
                            $scope.tabPrecalificado.reload();
                        }else{
                            $scope.tabPrecalificado = new ngTableParams({
                                    page : 1,
                                    count : 10,
                                    sorting : {
                                        nombre : 'asc'
                                    }
                                },{
                                    total : $scope.precalificados.length,
                                    filterDelay: 350,
                                    getData : function ($defer, params) {
                                        var orderedData = params.sorting() ? $filter('orderBy')($scope.precalificados, params.orderBy()) : $scope.precalificados;
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
            $scope.documentos = function (precalificado) {
                var modalDocumentos = $modal.open({
                    templateUrl : 'documentos.precalificado.modal',
                    controller : 'ModalDocumentosPreCtrl',
                    backdrop : 'static',
                    resolve : {
                        precalificado : function () {
                            return precalificado;
                        }
                    }
                });
            };
            $scope.agregar = function () {
                var modalPrecalificado = $modal.open({
                    templateUrl : 'modalPrecalificado',
                    controller : 'ModalPrecalificadoCtrl',
                    size : 'lg',
                    backdrop : 'static',
                    resolve :{
                        precalificado: function () {
                            return undefined;
                        }
                    }
                });
                modalPrecalificado.result.then(function (precalificado) {
                    //$scope.precalificados.push(precalificado);
                    traer();

                });
            };
			$scope.limpiar = function () {
                $scope.tabPrecalificado.sorting({});
                $scope.tabPrecalificado.filter({});
                $scope.filtro = false;
            };
            $scope.formatearTipo = function (val) {
                if (val == 0) return 'Persona';
                if (val == 1) return 'Empresa';
                return val;
            };
            traer();
            $scope.ver = function (precalificado) {
                var modalPrecalificado = $modal.open({
                    templateUrl : 'modalPrecalificado',
                    controller : 'ModalPrecalificadoCtrl',
                    size : 'lg',
                    backdrop : 'static',
                    resolve :{
                        precalificado: function () {
                            return precalificado;
                        }
                    }
                });
            };
        }]);