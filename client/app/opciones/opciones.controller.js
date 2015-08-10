/**
 * Created by josec on 8/9/2015.
 */


angular.module('anApp')
    .controller('OpcionesCtrl',['$scope','Data','$rootScope','ngTableParams','$filter','$modal','utils',
        function ($scope,Data, $rootScope, ngTableParams, $filter , $modal, utils) {
            $scope.filtro = false;
            $scope.$watch('filtro', function (newValue, oldValue) {
                if(newValue !== undefined && newValue !== oldValue){
                    if($scope.tableOpciones){
                        $scope.tableOpciones.reload();
                    }

                }
            });
            Data.get('opDatos')
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
                    $scope.tableOpciones = new ngTableParams({
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
                $scope.tableOpciones.sorting({});
                $scope.tableOpciones.filter({});
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
                modalOpciones.result.then(function (opcion) {
                    Data.post('opDatosU',{'opcion':opcion})
                        .then(function (results) {
                            if(results.status === "info") {
                                for (index in $scope.opciones) {
                                    if ($scope.opciones[index].id == opcion.id) {
                                        $scope.opciones[index] = opcion;
                                        $scope.tableOpciones.reload();
                                    }
                                }
                            }
                            Data.toast(results);
                        });
                }, function () {
                });
            };
            $scope.agregar = function () {
                var modalOpciones = $modal.open({
                    templateUrl : 'modelOpciones',
                    controller : 'ModalOpcionesCtrl',
                    resolve : {
                        opcion : function () {
                            return {}
                        }
                    }
                });
                modalOpciones.result.then(function (opcion) {
                    Data.post('opDatos',{'opcion':opcion})
                        .then(function (results) {
                            if(results.status === "success"){
                                //debugger;
                                console.log(Number(results.data.id),results.data.id,results.data);
                                opcion.id = Number(results.data.id);
                                $scope.opciones.push(opcion);
                                $scope.tableOpciones.reload();
                            }
                            Data.toast(results);
                        });
                });
            };
            $scope.eliminar = function (id) {
                Data.get('opDatosD/'+id)
                    .then(function (results) {
                        for(index in $scope.opciones){
                            if($scope.opciones[index].id == id){
                                $scope.opciones.splice(index,1);
                                $scope.tableOpciones.reload();
                                Data.toast(results);
                                break;
                            }
                        }

                    })
            };
        }]);