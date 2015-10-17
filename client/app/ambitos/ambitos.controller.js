/**
 * Created by josec on 10/4/2015.
 */

angular.module('anApp')
    .controller('AmbitosCtrl',['$scope','Data','utils','$modal','$rootScope','ngTableParams','$filter',
        function ($scope,Data,utils,$modal,$rootScope,ngTableParams,$filter) {
            Data.get('ambitoSel')
                .then(function (result) {
                    if(result.message){
                        Data.toast(result);
                        return;
                    }
                    for(var i in result){
                        utils.convertNumber(result[i]);
                    }
                    $scope.ambitos = result;
                    table();
                });
            function table () {
                if($scope.tableAmbitos) return $scope.tableAmbitos.reload();

                $scope.tableAmbitos = new ngTableParams({
                        page : 1,
                        count : 10,
                        sorting : {
                            nombre : 'asc'
                        }
                    },{
                        total : $scope.ambitos.length,
                        filterDelay: 350,
                        getData : function ($defer, params) {
                            var orderedData = params.sorting() ? $filter('orderBy')($scope.ambitos, params.orderBy()) : $scope.ambitos;
                            if($scope.filtro){
                                orderedData = params.filter() ? $filter('filter')(orderedData, params.filter()) : orderedData;
                            }
                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        }
                    }
                );
            }
            $scope.limpiar = function () {
                $scope.tableAmbitos.sorting({});
                $scope.tableAmbitos.filter({});
                $scope.filtro = false;
            };
            $scope.agregar = function () {
                var modalAmbitos = $modal.open({
                    templateUrl : 'ambitos.modal',
                    controller : 'ModalAmbitosCtrl',
                    backdrop : 'static',
                    resolve : {
                        ambito : function () {
                            return undefined
                        }
                    }
                });
                modalAmbitos.result.then(function (ambito) {
                    Data.post('ambitoIn',{'nombre':ambito.nombre,'codigo':ambito.codigo})
                        .then(function (results) {
						//		console.log( results.data);
                            if(results.status === "success"){
                               ambito.id = Number(results.data.id);
								$scope.ambito.push(ambito);
                                table();
                            }
                            Data.toast(results);
                        });
                });
            };
			
            $scope.eliminar = function (id) {
                $scope.confirm('Desea eliminar el ámbito?',confirm);
                function confirm (result) {
                    if(!result) return;
                    Data.get('ambitoD/'+ id)
                        .then(function (result) {
                            Data.toast(result);
                            if(result.status == 'success'){
                                for(var index in $scope.ambitos){
                                    if($scope.ambitos[index].id == id){
                                        $scope.ambitos.splice(index,1);
                                        table();
                                        return;
                                    }
                                }
                            }

                        });
                }
            };
        }]);