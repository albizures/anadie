/**
 * Created by josec on 7/4/2015.
 */


angular.module('anApp')
    .controller('AdministracionCtrl',['$scope','Data','$rootScope','ngTableParams','$filter','$modal','utils',
    function ($scope,Data,$rootScope, ngTableParams,$filter,$modal,utils) {
        Data.get('opListaH/'+0)
            .then(function (result) {
                console.log(result);

            });
        $scope.filtro = false;
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
                            orderedData = params.filter() ? $filter('filter')($scope.opciones, params.filter()) : $scope.opciones;
                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        }
                    }
                );
            });
        $scope.limpiar = function () {
            tableOpciones.sorting({});
            tableOpciones.filter({});
            filtro = false;
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
                            $scope.opciones.push(opcion);
                            $scope.tableOpciones.reload();
                        }
                        Data.toast(results);
                    });
            });
        };
        $scope.eliminar = function (id,index) {
            Data.get('opDatosD/'+id)
                .then(function (results) {
                    $scope.opciones.splice(index,1);
                    $scope.tableOpciones.reload();
                    Data.toast(results);
                })
        };
    }]);