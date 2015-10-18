/**
 * Created by josec on 7/13/2015.
 */
angular.module('anApp')
    .controller('permisosCtrl',['$scope','Data','$rootScope','ngTableParams','$filter','$modal','utils',
        function ($scope,Data, $rootScope, ngTableParams, $filter , $modal, utils) {
            $scope.filtro = false;
            $scope.$watch('filtro', function (newValue, oldValue) {
                if(newValue !== undefined && newValue !== oldValue){
                    if($scope.tablePermisos){
                        $scope.tablePermisos.reload();
                    }

                }
            });
            Data.get('opDatos')
                .then(function (results) {
					 console.log('pre',results);
                    for(index in results){

                        results[index] = utils.convertNumber(results[index]);
                    }
                    // console.log(results);
                    $scope.permisos = results;
                    for(index in $scope.permisos){

                        $scope.permisos[index].tipo = {
                            codTipo : $scope.permisos[index].codTipo,
                            id  : $scope.permisos[index].idTipo,
                            nombreTipo : $scope.permisos[index].nombreTipo
                        }
                    }
                    $scope.tablePermisos = new ngTableParams({
                            page : 1,
                            count : 10,
                            sorting : {
                                nombre : 'asc'
                            }
                        },{
                            total : $scope.permisos.length,
                            filterDelay: 350,
                            getData : function ($defer, params) {
                                var orderedData = params.sorting() ? $filter('orderBy')($scope.permisos, params.orderBy()) : $scope.permisos;
                                if($scope.filtro){
                                    orderedData = params.filter() ? $filter('filter')(orderedData, params.filter()) : orderedData;
                                }
                                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                            }
                        }
                    );
                });
            $scope.limpiar = function () {
                $scope.tablePermisos.sorting({});
                $scope.tablePermisos.filter({});
                $scope.filtro = false;
            };
            $scope.editar = function (id) {
                var modalpermisos = $modal.open({
                    templateUrl : 'modelPermisos',
                    controller : 'ModalPermisosCtrl',
                    resolve : {
                        permiso : function () {
                            return $scope.permisos.filter(function(permiso){return permiso.id == id})[0];
                        }
                    }
                });
                modalpermisos.result.then(function (permiso) {
                    Data.post('opDatosU',{'permiso':permiso})
                        .then(function (results) {
                            if(results.status === "info") {
                                for (index in $scope.permisos) {
                                    if ($scope.permisos[index].id == permiso.id) {
                                        $scope.permisos[index] = permiso;
                                        $scope.tablePermisos.reload();
                                    }
                                }
                            }
                            Data.toast(results);
                        });
                }, function () {
                });
            };
            $scope.agregar = function () {
                var modalpermisos = $modal.open({
                    templateUrl : 'modelPermisos',
                    controller : 'ModalPermisosCtrl',
                    resolve : {
                        permiso : function () {
                            return {}
                        }
                    }
                });
                modalpermisos.result.then(function (permiso) {
                    Data.post('perIn',{'permiso':permiso})
                        .then(function (results) {
                            if(results.status === "success"){
                                //debugger;
                                console.log(Number(results.data.id),results.data.id,results.data);
                                permiso.id = Number(results.data.id);
                                $scope.permisos.push(permiso);
                                $scope.tablePermisos.reload();
                            }
                            Data.toast(results);
                        });
                });
            };
            $scope.eliminar = function (id) {
                Data.get('opDatosD/'+id)
                    .then(function (results) {
                        for(index in $scope.permisos){
                            if($scope.permisos[index].id == id){
                                $scope.permisos.splice(index,1);
                                $scope.tablePermisos.reload();
                                Data.toast(results);
                                break;
                            }
                        }

                    })
            };
        }]);