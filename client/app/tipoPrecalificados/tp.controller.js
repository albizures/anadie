/**
 * Created by josec on 10/4/2015.
 */

angular.module('anApp')
    .controller('TPCtrl',['$scope','Data','utils','$modal','$rootScope','ngTableParams','$filter',
        function ($scope,Data,utils,$modal,$rootScope,ngTableParams,$filter) {
            Data.get('tpSel')
                .then(function (result) {
                    if(result.message){
                        Data.toast(result);
                        return;
                    }
                    for(var i in result){
                        utils.convertNumber(result[i]);
                    }
                    $scope.tp = result;
                    table();
                });
            function table () {
                if($scope.tableTP) return $scope.tableTP.reload();

                $scope.tableTP = new ngTableParams({
                        page : 1,
                        count : 10,
                        sorting : {
                            nombre : 'asc'
                        }
                    },{
                        total : $scope.tp.length,
                        filterDelay: 350,
                        getData : function ($defer, params) {
                            var orderedData = params.sorting() ? $filter('orderBy')($scope.tp, params.orderBy()) : $scope.tp;
                            if($scope.filtro){
                                orderedData = params.filter() ? $filter('filter')(orderedData, params.filter()) : orderedData;
                            }
                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        }
                    }
                );
            }
            $scope.limpiar = function () {
                $scope.tableTP.sorting({});
                $scope.tableTP.filter({});
                $scope.filtro = false;
            };
            $scope.agregar = function () {
                var modalTP = $modal.open({
                    templateUrl : 'tipoPrecalificado.modal',
                    controller : 'ModalTPCtrl',
                    backdrop : 'static',
                    resolve : {
                        tp : function () {
                            return undefined
                        }
                    }
                });
                modalTP.result.then(function (tp) {
                    Data.post('tpIn',{'nombre':tp.nombre})
                        .then(function (results) {
						//		console.log( results.data);
                            if(results.status === "success"){
                               tp.id = Number(results.data.id);
								$scope.tp.push(tp);
                                table();
                            }
                            Data.toast(results);
                        });
                });
            };
			
            $scope.eliminar = function (id) {
                $scope.confirm('Desea eliminar el tipo de precalificado?',confirm);
                function confirm (result) {
                    if(!result) return;
                    Data.get('tpD/'+ id)
                        .then(function (result) {
                            Data.toast(result);
                            if(result.status == 'success'){
                                for(var index in $scope.tp){
                                    if($scope.tp[index].id == id){
                                        $scope.tp.splice(index,1);
                                        table();
                                        return;
                                    }
                                }
                            }

                        });
                }
            };
        }]);