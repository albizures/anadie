/**
 * Created by josec on 10/4/2015.
 */

angular.module('anApp')
    .controller('OrganosCtrl',['$scope','Data','utils','$modal','$rootScope','ngTableParams','$filter',
        function ($scope,Data,utils,$modal,$rootScope,ngTableParams,$filter) {
            Data.get('organoSel')
                .then(function (result) {
                    if(result.message){
                        Data.toast(result);
                        return;
                    }
                    for(var i in result){
                        utils.convertNumber(result[i]);
                    }
                    $scope.organos = result;
                    table();
                });
            function table () {
                if($scope.tableOrganos) return $scope.tableOrganos.reload();

                $scope.tableOrganos = new ngTableParams({
                        page : 1,
                        count : 10,
                        sorting : {
                            nombre : 'asc'
                        }
                    },{
                        total : $scope.organos.length,
                        filterDelay: 350,
                        getData : function ($defer, params) {
                            var orderedData = params.sorting() ? $filter('orderBy')($scope.organos, params.orderBy()) : $scope.organos;
                            if($scope.filtro){
                                orderedData = params.filter() ? $filter('filter')(orderedData, params.filter()) : orderedData;
                            }
                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        }
                    }
                );
            }
            $scope.limpiar = function () {
                $scope.tableOrganos.sorting({});
            };
            $scope.agregar = function () {
                var modalOrganos = $modal.open({
                    templateUrl : 'organos.modal',
                    controller : 'ModalOrganosCtrl',
                    backdrop : 'static',
                    resolve : {
                        organo : function () {
                            return {}
                        }
                    }
                });
                modalOrganos.result.then(function (organo) {
                    Data.post('organoIn',{'nombre':organo.organo})
                        .then(function (results) {
							//console.log( results.data);
                            if(results.status === "success"){
                               organo.id = Number(results.data.id);
								$scope.organos.push(organo);
                                table();
                            }
                            Data.toast(results);
                        });
                });
            };
			
            $scope.eliminar = function (id) {
                $scope.confirm('Desea eliminar el Organo?',confirm);
                function confirm (result) {
                    if(!result) return;
                    Data.get('organoD/'+ id)
                        .then(function (result) {
                            Data.toast(result);
                            if(result.status == 'success'){
                                for(var index in $scope.organos){
                                    if($scope.organos[index].id == id){
                                        $scope.organos.splice(index,1);
                                        table();
                                        return;
                                    }
                                }
                            }

                        });
                }
            };
        }]);