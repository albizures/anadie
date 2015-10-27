/**
 * Created by josec on 10/11/2015.
 */


angular.module('anApp')
    .controller('PrecalificacionCtrl',['$scope','Data','$rootScope','ngTableParams','$filter','$modal','utils',
        function ($scope,Data, $rootScope, ngTableParams, $filter , $modal, utils) {
            Data.get('eventoSel')
                .then(function (results) {
                    if(results.message){
                        Data.toast(results);
                        return;
                    }
                    for(index in results){
                        results[index] = utils.convertNumber(results[index]);
                    }
                    //console.log(results);
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
                console.log(licitacion);
                actualizarUsuarios(true);

            };
            function actualizarUsuarios (cambiar) {
                if(hasVal($scope.tablePrecalificados) && !cambiar){
                    return $scope.tablePrecalificados.reload();
                }
                Data.get('userEventoSel/'+$scope.licitacionSel.id)
                    .then(function (results) {
                        console.log(results);
                        if(results.message){
                            Data.toast(results);
                            $scope.usuarios = [];
                            $scope.tablePrecalificados.reload();
                            return;
                        }
                        for(index in results){
                            results[index] = utils.convertNumber(results[index]);
                        }
                        $scope.usuarios = results;
                        if(hasVal($scope.tablePrecalificados)){
                            return $scope.tablePrecalificados.reload();
                        }
                        $scope.tablePrecalificados = new ngTableParams({
                                page : 1,
                                count : 10,
                                sorting : {
                                    nombre : 'asc'
                                }
                        },{
                            total : $scope.usuarios.length,
                            filterDelay: 350,
                            getData : function ($defer, params) {
                                var orderedData = params.sorting() ? $filter('orderBy')($scope.usuarios, params.orderBy()) : $scope.usuarios;
                                if($scope.filtro){
                                    orderedData = params.filter() ? $filter('filter')(orderedData, params.filter()) : orderedData;
                                }
                                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                            }
                        });
                    });
            }

            $scope.agregarOrganizacion = function () {
                if(!hasVal($scope.licitacionSel)){return Data.toast({status : 'info', message : 'Seleccione un evento de licitacion'})}
                var modal = $modal.open({
                    templateUrl : 'organizacion.licitacion.modal',
                    controller : 'ModalOrganizacionLicitacionCtrl',
                    backdrop : 'static',
                    resolve : {
                        licitacion : function () {
                            return $scope.licitacionSel;
                        }
                    }
                });
                modal.result.then(function (newUsuarios) {
                    if(!hasVal(newUsuarios)) return;
                    if(!hasVal($scope.usuarios)){
                        $scope.usuarios = [];
                    }
                    //$scope.usuarios = $scope.usuarios.concat(newUsuarios);
                    actualizarUsuarios(true);
                });
            };
        }]);