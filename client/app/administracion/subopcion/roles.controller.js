/**
 * Created by josec on 7/13/2015.
 */


angular.module('anApp')
    .controller('rolesCtrl',['$scope','Data','$rootScope','ngTableParams','$filter','$modal','utils',
        function ($scope,Data, $rootScope, ngTableParams, $filter , $modal, utils) {
            $scope.filtro = false;
            $scope.$watch('filtro', function (newValue, oldValue) {
                if(newValue !== undefined && newValue !== oldValue){
                    if($scope.tableRoles){
                        $scope.tableRoles.reload();
                    }

                }
            });
            Data.get('rolDatos')
                .then(function (results) {
                    for(index in results){

                        results[index] = utils.convertNumber(results[index]);
                    }
                    // console.log(results);
                    $scope.roles = results;
                    $scope.tableRoles = new ngTableParams({
                            page : 1,
                            count : 10,
                            sorting : {
                                nombre : 'asc'
                            }
                        },{
                            total : $scope.roles.length,
                            filterDelay: 350,
                            getData : function ($defer, params) {
                                var orderedData = params.sorting() ? $filter('orderBy')($scope.roles, params.orderBy()) : $scope.roles;
                                if($scope.filtro){
                                    orderedData = params.filter() ? $filter('filter')(orderedData, params.filter()) : orderedData;
                                }
                                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                            }
                        }
                    );
                });
            $scope.limpiar = function () {
                $scope.tableRoles.sorting({});
                $scope.tableRoles.filter({});
                $scope.filtro = false;
            };
            $scope.editar = function (id) {
                var modalroles = $modal.open({
                    templateUrl : 'modelRoles',
                    controller : 'ModalRolesCtrl',
                    resolve : {
                        rol : function () {
                            return $scope.roles.filter(function(rol){return rol.id == id})[0];
                        }
                    }
                });
                modalroles.result.then(function (rol) {
                    Data.post('rolU',{rol:rol})
                        .then(function (results) {
                            if(results.status === "info") {
                                for (index in $scope.roles) {
                                    if ($scope.roles[index].id == rol.id) {
                                        $scope.roles[index] = rol;
                                        $scope.tableRoles.reload();
                                    }
                                }
                            }
                            Data.toast(results);
                        });
                }, function () {
                });
            };
            $scope.agregar = function () {
                var modalroles = $modal.open({
                    templateUrl : 'modelRoles',
                    controller : 'ModalRolesCtrl',
                    resolve : {
                        rol : function () {
                            return {}
                        }
                    }
                });
                modalroles.result.then(function (rol) {
                    Data.post('rolIn',{rol:rol})
                        .then(function (results) {
                            if(results.status === "success"){
                                //debugger;
                                console.log(Number(results.data.id),results.data.id,results.data);
                                rol.id = Number(results.data.id);
                                $scope.roles.push(rol);
                                $scope.tableRoles.reload();
                                if(rol.opciones && rol.opciones.length >  0){
                                    Data.post('perIn',{opciones :rol.opciones,idrol : rol.id})
                                        .then(function (result) {
                                            if(result.status == 'success'){

                                            }
                                        });
                                }
                            }
                            Data.toast(results);
                        });
                });
            };
            $scope.eliminar = function (id) {
                Data.get('rolD/'+id)
                    .then(function (results) {
                        for(index in $scope.roles){
                            if($scope.roles[index].id == id){
                                $scope.roles.splice(index,1);
                                $scope.tableRoles.reload();
                                Data.toast(results);
                                break;
                            }
                        }

                    })
            };
        }]);