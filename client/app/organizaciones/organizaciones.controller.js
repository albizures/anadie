/**
 * Created by josec on 7/13/2015.
 */


angular.module('anApp')
    .controller('organizacionCtrl',['$scope','Data','$rootScope','ngTableParams','$filter','$modal','utils',
        function ($scope,Data, $rootScope, ngTableParams, $filter , $modal, utils) {
            $scope.filtro = false;
            $scope.$watch('filtro', function (newValue, oldValue) {
                if(newValue !== undefined && newValue !== oldValue){
                    if($scope.tableOrganizacion){
                        $scope.tableOrganizacion.reload();
                    }

                }
            });
            Data.get('orgDatos')
                .then(function (results) {
                    for(index in results){

                        results[index] = utils.convertNumber(results[index]);
                    }
                    // console.log(results);
                    $scope.organizacion = results;
                    $scope.tableOrganizacion = new ngTableParams({
                            page : 1,
                            count : 10,
                            sorting : {
                                nombre : 'asc'
                            }
                        },{
                            total : $scope.organizacion.length,
                            filterDelay: 350,
                            getData : function ($defer, params) {
                                var orderedData = params.sorting() ? $filter('orderBy')($scope.organizacion, params.orderBy()) : $scope.organizacion;
                                if($scope.filtro){
                                    orderedData = params.filter() ? $filter('filter')(orderedData, params.filter()) : orderedData;
                                }
                                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                            }
                        }
                    );
                });
            $scope.limpiar = function () {
                $scope.tableOrganizacion.sorting({});
                $scope.tableOrganizacion.filter({});
                $scope.filtro = false;
            };
            $scope.editar = function (id) {
                var modalorganizacion = $modal.open({
                    templateUrl : 'modelOrganizacion',
                    controller : 'ModalOrganizacionCtrl',
                    resolve : {
                        rol : function () {
                            return $scope.roles.filter(function(organizacion){return organizacion.id == id})[0];
                        }
                    }
                });
                modalorganizacion.result.then(function (rol) {
                    Data.post('orgU',{organizacion:organizacion})
                        .then(function (results) {
                            if(results.status === "info") {
                                for (index in $scope.organizacion) {
                                    if ($scope.organizacion[index].id == organizacion.id) {
                                        $scope.organizacion[index] = organizacion;
                                        $scope.tableOrganizacion.reload();
                                    }
                                }
                            }
                            Data.toast(results);
                        });
                }, function () {
                });
            };
            $scope.agregar = function () {
                var modalorganizacion = $modal.open({
                    templateUrl : 'modelOrganizacion',
                    controller : 'ModalOrganizacionCtrl',
                    resolve : {
                        rol : function () {
                            return {}
                        }
                    }
                });
                modalorganizacion.result.then(function (organizacion) {
                    Data.post('orgIn',{organizacion:organizacion})
                        .then(function (results) {
                            if(results.status === "success"){
                                //debugger;
                                console.log(Number(results.data.id),results.data.id,results.data);
                                organizacion.id = Number(results.data.id);
                                $scope.organizacion.push(organizacion);
                                $scope.tableOrganizacion.reload();
                            }
                            Data.toast(results);
                        });
                });
            };
            $scope.eliminar = function (id) {
                Data.get('orgD/'+id)
                    .then(function (results) {
                        for(index in $scope.organizacion){
                            if($scope.organizacion[index].id == id){
                                $scope.organizacion.splice(index,1);
                                $scope.tableOrganizacion.reload();
                                Data.toast(results);
                                break;
                            }
                        }

                    })
            };
        }]);