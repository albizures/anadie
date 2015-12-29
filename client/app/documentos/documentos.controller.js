/**
 * Created by josec on 10/4/2015.
 */

angular.module('anApp')
    .controller('DocumentosCtrl',['$scope','Data','utils','$modal','$rootScope','ngTableParams','$filter',
        function ($scope,Data,utils,$modal,$rootScope,ngTableParams,$filter) {
            Data.get('docSel')
                .then(function (result) {
                    if(result.message){
                        Data.toast(result);
                        return;
                    }
                    $scope.documentos = result;
                    table();
                });
            function table () {
                if($scope.tableDocumentos) return $scope.tableDocumentos.reload();

                $scope.tableDocumentos = new ngTableParams({
                        page : 1,
                        count : 10,
                        sorting : {
                            nombre : 'asc'
                        }
                    },{
                        total : $scope.documentos.length,
                        filterDelay: 350,
                        getData : function ($defer, params) {
                            var orderedData = params.sorting() ? $filter('orderBy')($scope.documentos, params.orderBy()) : $scope.documentos;
                            if($scope.filtro){
                                orderedData = params.filter() ? $filter('filter')(orderedData, params.filter()) : orderedData;
                            }
                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        }
                    }
                );
            }
            $scope.limpiar = function () {
                $scope.tableDocumentos.sorting({});
                $scope.tableDocumentos.filter({});
                $scope.filtro = false;
            };
            $scope.agregar = function () {
                var modalDocumentos = $modal.open({
                    templateUrl : 'documentos.modal',
                    controller : 'ModalcatDocumentosCtrl',
                    backdrop : 'static',
                    resolve : {
                        documento : function () {
                            return undefined
                        }
                    }
                });
                modalDocumentos.result.then(function (documento) {
                    Data.post('docIn',{'nombre':documento.nombre})
                        .then(function (results) {
							//console.log( results.data);
                            if(results.status === "success"){
                               documento.id = Number(results.data.id);
								$scope.documentos.push(documento);
                                table();
                            }
                            Data.toast(results);
                        });
                });
            };
			
            $scope.eliminar = function (id) {
                $scope.confirm('Desea eliminar el documento?',confirm);
                function confirm (result) {
                    if(!result) return;
                    Data.get('docD/'+ id)
                        .then(function (result) {
                            Data.toast(result);
                            if(result.status == 'success'){
                                for(var index in $scope.documentos){
                                    if($scope.documentos[index].id == id){
                                        $scope.documentos.splice(index,1);
                                        table();
                                        return;
                                    }
                                }
                            }

                        });
                }
            };
        }]);