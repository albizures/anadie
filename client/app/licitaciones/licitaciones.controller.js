/**
 * Created by josec on 9/30/2015.
 */
angular.module('anApp')
    .controller('LicitacionesCtrl',['$modal','$scope','Data','ngTableParams','utils','$filter',
        function ($modal,$scope,Data,ngTableParams,utils,$filter) {
        Data.get('eventoSel')
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
        $scope.limpiar = function () {
            $scope.tableProyectos.sorting({});
            $scope.tableProyectos.filter({});
            $scope.filtro = false;
        };
        $scope.documentos = function (licitacion) {
            var modalDocumentos = $modal.open({
                templateUrl : 'documentos.licitaciones.modal',
                controller : 'ModalDocumentosLicitacionCtrl',
                backdrop : 'static',
                resolve : {
                    licitacion : function () {
                        return licitacion;
                    },
                    cargar : function () {
                        return true;
                    }
                }
            });
        };
        $scope.agregar = function () {
            var modalEventos = $modal.open({
                templateUrl : 'licitaciones.modal',
                controller : 'ModalLicitacionesCtrl',
                //size : 'lg',
                backdrop : 'static',
                resolve :{
                    evento: function () {
                        return undefined;
                    }
                }
            });
            modalEventos.result.then(function (evento) {
                Data.post('eventoIn',{'evento':evento})
                    .then(function (results) {
                        if(results.status === "success"){
                            //debugger;
                            console.log(Number(results.data.id),results.data.id,results.data);
                            evento.id = Number(results.data.id);
                            $scope.licitaciones.push(evento);
                            $scope.tableLicitaciones.reload();
                        }
                        Data.toast(results);
                    });
            });
        };
    }]);