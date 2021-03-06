/**
 * Created by josec on 10/12/2015.
 */

angular.module('anApp')
    .controller('ConsultaCtrl',['$scope','Data','$rootScope','ngTableParams','$filter','$modal','utils','$state',
        function ($scope,Data, $rootScope, ngTableParams, $filter , $modal, utils, $state) {
            $rootScope.mostrarImg = true;
            Data.get('eventoUserSel')
                .then(function (results) {
                    if(results.message){
                        Data.toast(results);
                        return;
                    }
                    $scope.licitaciones = results;
                    $scope.tableLicitaciones = new ngTableParams({
                            page : 1,
                            count : 10,
                            sorting : {
                                nombre : 'asc'
                            }
                        },{
                            total : $scope.licitaciones.length,
                            filterDelay: 350,
                            getData : function ($defer, params) {
                                var orderedData = params.sorting() ? $filter('orderBy')($scope.licitaciones, params.orderBy()) : $scope.licitaciones;
                                if($scope.filtro){
                                    orderedData = params.filter() ? $filter('filter')(orderedData, params.filter()) : orderedData;
                                }
                                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                            }
                        }
                    );
                });
            $scope.selLicitacion = function (licitacion) {
                $scope.licitacionSel = licitacion;
                $rootScope.ImgEvento = $scope.licitacionSel.pos_imagen;
                $rootScope.$applyAsync();
                actualizarDocumentos(true);

            };
            function actualizarDocumentos  () {
                Data.get('eventoFileSelHTML/' + $scope.licitacionSel.id_proyecto_licitacion)
                    .then(function (results) {
                        if(results.message){
                            Data.toast(results);
                            $scope.documentos = [];
                            $scope.tableDocumentos.reload();
                            return;
                        }
                        for(index in results){
                            results[index] = utils.convertNumber(results[index]);
                        }
                        //console.log(results);
                        $scope.documentos = results;
                        if(hasVal($scope.tableDocumentos)){
                           return  $scope.tableDocumentos.reload();
                        }
                        $scope.tableDocumentos = new ngTableParams({
                                page : 1,
                                count : 10,
                                sorting : {
                                    nombre : 'asc'
                                }
                            },{
                                total : $scope.documentos.length,
                                filterDelay: 350,
                                getData : function ($defer, params) {
                                    var orderedData = params.sorting() ? $filter('orderBy')($scope.documentos, params.orderBy()) : $scope.documentos;
                                    if($scope.filtro){
                                        orderedData = params.filter() ? $filter('filter')(orderedData, params.filter()) : orderedData;
                                    }
                                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                                }
                            }
                        );
                    });
            }
            $scope.ver = function (documento) {
                $state.go('visor', {id: documento.id ,documento : documento});
            };
            $scope.descargar = function (url) {
                console.log(url.replace('mth','pdf').replace('html','pdf'));
                $scope.openVisor(url.replace('mht','pdf').replace('html','pdf'));
            };
        }]);