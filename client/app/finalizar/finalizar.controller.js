/**
 * Created by josec on 11/10/2015.
 */

angular.module('anApp')
    .controller('FinalizarCtrl',['$scope','Data','utils','$modal','ngTableParams','$filter','$stateParams',
        function ($scope,Data,utils,$modal,ngTableParams,$filter,$stateParams) {
            $scope.seleccionados = {};

            Data.get('preguntaSelEventoAmbitoE3/'+ $stateParams.id)
                .then(function (result) {
                    if(result.message){
                        Data.toast(result);
                        return;
                    }
                    /*for(var i in result){
                        if(result[i].estado == 1){
                            result[i].est = 'Ingresada';
                        }else if(result[i].estado == 2){
                            result[i].est = 'En revision';
                        }else if(result[i].estado == 3){
                            result[i].est = 'Respondida';
                        }else if(result[i].estado == 4){
                            result[i].est = 'Para postear';
                        }else if(result[i].estado == 5){
                            result[i].est = 'Finalizada';
                        }
                    }*/
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

            $scope.impresionValida = function () {
                for(var index in $scope.seleccionados){
                    if($scope.seleccionados[index]){
                        return true
                    }
                }
            };
    }]);