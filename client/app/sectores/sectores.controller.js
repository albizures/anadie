/**
 * Created by josec on 10/4/2015.
 */

angular.module('anApp')
    .controller('SectoresCtrl',['$scope','Data','utils','$modal','ngTableParams','$filter',
        function ($scope,Data,utils,$modal,ngTableParams,$filter) {
            Data.get('sectorSel')
                .then(function (result) {
                    if(result.message){
                        Data.toast(result);
                        return;
                    }
                    for(var i in result){
                        utils.convertNumber(result[i]);
                    }
                    $scope.sectores = result;
                    table();
                });
            function table () {
                if($scope.tableSectores) return $scope.tableSectores.reload();

                $scope.tableSectores = new ngTableParams({
                        page : 1,
                        count : 10,
                        sorting : {
                            nombre : 'asc'
                        }
                    },{
                        total : $scope.sectores.length,
                        filterDelay: 350,
                        getData : function ($defer, params) {
                            var orderedData = params.sorting() ? $filter('orderBy')($scope.sectores, params.orderBy()) : $scope.sectores;
                            if($scope.filtro){
                                orderedData = params.filter() ? $filter('filter')(orderedData, params.filter()) : orderedData;
                            }
                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        }
                    }
                );
            }
            $scope.limpiar = function () {
                $scope.tableSectores.sorting({});
                $scope.tableSectores.filter({});
                $scope.filtro = false;
            };
            $scope.agregar = function () {
                var modalSectores = $modal.open({
                    templateUrl : 'sectores.modal',
                    controller : 'ModalSectoresCtrl',
                    backdrop : 'static',
                    resolve : {
                        sector : function () {
                            return undefined
                        }
                    }
                });
                modalSectores.result.then(function (sector) {
                    Data.post('sectorIn',{'nombre':sector.nombre})
                        .then(function (results) {
                            if(results.status === "success"){
                                sector.id = Number(results.data.id);
                                $scope.sectores.push(sector);
                                table();
                            }
                            Data.toast(results);
                        });
                });
            };
            $scope.eliminar = function (id) {
                $scope.confirm('Desea eliminar el sector?',confirm);
                function confirm (result) {
                    if(!result) return;
                    Data.get('sectorD/'+ id)
                        .then(function (result) {
                            Data.toast(result);
                            if(result.status == 'success'){
                                for(var index in $scope.sectores){
                                    if($scope.sectores[index].id == id){
                                        $scope.sectores.splice(index,1);
                                        table();
                                        return;
                                    }
                                }
                            }

                        });
                }
            };
        }])