/**
 * Created by josec on 10/29/2015.
 */



angular.module('anApp')
    .controller('PreguntasConsultorCtrl',['$scope','Data','utils','$modal','ngTableParams','$filter','$stateParams',
        function ($scope,Data,utils,$modal,ngTableParams,$filter,$stateParams) {
            Data.get('preguntaSelEventoAmbito/'+ $stateParams.evento + '/' + $stateParams.ambito)
                .then(function (result) {
                    if(result.message){
                        Data.toast(result);
                        return;
                    }
                    for(var i in result){
                        utils.convertNumber(result[i]);
                    }
                    $scope.preguntas = result;
                    table();
                });

            function table () {
                if($scope.tablePreguntas) return $scope.tablePreguntas.reload();

                $scope.tablePreguntas = new ngTableParams({
                        page : 1,
                        count : 10,
                        sorting : {
                            nombre : 'asc'
                        }
                    },{
                        total : $scope.preguntas.length,
                        filterDelay: 350,
                        getData : function ($defer, params) {
                            var orderedData = params.sorting() ? $filter('orderBy')($scope.preguntas, params.orderBy()) : $scope.preguntas;
                            if($scope.filtro){
                                orderedData = params.filter() ? $filter('filter')(orderedData, params.filter()) : orderedData;
                            }
                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        }
                    }
                );
            }
            $scope.limpiar = function () {
                $scope.tablePreguntas.sorting({});
                $scope.tablePreguntas.filter({});
                $scope.filtro = false;
            };
            $scope.agregar = function () {
                var modalIces = $modal.open({
                    templateUrl : 'preguntas.modal',
                    controller : 'ModalIcesCtrl',
                    backdrop : 'static',
                    resolve : {
                        ice : function () {
                            return undefined
                        }
                    }
                });
                modalIces.result.then(function (ice) {
                    Data.post('iceIn',{'nombre':ice.nombre})
                        .then(function (results) {
                            if(results.status === "success"){
                                ice.id = Number(results.data.id);
                                $scope.preguntas.push(ice);
                                table();
                            }
                            Data.toast(results);
                        });
                });
            };
            $scope.eliminar = function (id) {
                $scope.confirm('Desea eliminar el ICE?',confirm);
                function confirm (result) {
                    if(!result) return;
                    Data.get('iceD/'+ id)
                        .then(function (result) {
                            Data.toast(result);
                            if(result.status == 'success'){
                                for(var index in $scope.preguntas){
                                    if($scope.preguntas[index].id == id){
                                        $scope.preguntas.splice(index,1);
                                        table();
                                        return;
                                    }
                                }
                            }

                        });
                }
            };
            $scope.reponder = function (pregunta) {
                var modalResponder = $modal.open({
                    templateUrl : 'responder.modal',
                    controller : 'ModalResponderCtrl',
                    backdrop : 'static',
                    resolve : {
                        pregunta : function () {
                            return pregunta
                        }
                    }
                });
                modalResponder.result.then(function (ice) {

                });
            }
        }]);