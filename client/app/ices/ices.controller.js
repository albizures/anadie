/**
 * Created by josec on 10/4/2015.
 */

angular.module('anApp')
    .controller('IcesCtrl',['$scope','Data','utils','$modal','ngTableParams','$filter',
    function ($scope,Data,utils,$modal,ngTableParams,$filter) {
        Data.get('iceSel')
            .then(function (result) {
                if(result.message){
                    Data.toast(result);
                    return;
                }
                for(var i in result){
                    utils.convertNumber(result[i]);
                }
                $scope.ices = result;
                table();
            });
        function table () {
            if($scope.tableIces) return $scope.tableIces.reload();

            $scope.tableIces = new ngTableParams({
                    page : 1,
                    count : 10,
                    sorting : {
                        nombre : 'asc'
                    }
                },{
                    total : $scope.ices.length,
                    filterDelay: 350,
                    getData : function ($defer, params) {
                        var orderedData = params.sorting() ? $filter('orderBy')($scope.ices, params.orderBy()) : $scope.ices;
                        if($scope.filtro){
                            orderedData = params.filter() ? $filter('filter')(orderedData, params.filter()) : orderedData;
                        }
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }
                }
            );
        }
        $scope.limpiar = function () {
            $scope.tableIces.sorting({});
            $scope.tableIces.filter({});
            $scope.filtro = false;
        };
        $scope.agregar = function () {
            var modalIces = $modal.open({
                templateUrl : 'ices.modal',
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
                            $scope.ices.push(ice);
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
                            for(var index in $scope.ices){
                                if($scope.ices[index].id == id){
                                    $scope.ices.splice(index,1);
                                    table();
                                    return;
                                }
                            }
                        }

                    });
            }
        };
    }]);