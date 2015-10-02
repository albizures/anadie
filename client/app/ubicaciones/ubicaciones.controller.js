/**
 * Created by josec on 9/30/2015.
 */


angular.module('anApp')
    .controller('UbicacionesCtrl',['$scope','Data','ngTableParams','utils','$filter','$modal',
    function ($scope,Data,ngTableParams,utils,$filter,$modal) {
        function createTablePaises() {
            if(hasVal($scope.tablePaises)){
                return $scope.tablePaises.reload();
            }
            $scope.tablePaises = new ngTableParams({
                    page : 1,
                    count : 10,
                    sorting : {
                        nombre : 'asc'
                    }
                },{
                    total : $scope.paises.length,
                    filterDelay: 350,
                    getData : function ($defer, params) {
                        var orderedData = params.sorting() ? $filter('orderBy')($scope.paises, params.orderBy()) : $scope.paises;
                        if($scope.filtro){
                            orderedData = params.filter() ? $filter('filter')(orderedData, params.filter()) : orderedData;
                        }
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }
                }
            );
        }
        function createTableDepar() {
            if(hasVal($scope.tableDepar)){
                return $scope.tableDepar.reload();
            }
            $scope.tableDepar = new ngTableParams({
                    page : 1,
                    count : 10,
                    sorting : {
                        nombre : 'asc'
                    }
                },{
                    total : $scope.depar.length,
                    filterDelay: 350,
                    getData : function ($defer, params) {
                        var orderedData = params.sorting() ? $filter('orderBy')($scope.depar, params.orderBy()) : $scope.depar;
                        if($scope.filtro){
                            orderedData = params.filter() ? $filter('filter')(orderedData, params.filter()) : orderedData;
                        }
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }
                }
            );
        }
        function createTableMuni() {
            if(hasVal($scope.tableMuni)){
                return $scope.tableMuni.reload();
            }
            $scope.tableMuni = new ngTableParams({
                    page : 1,
                    count : 10,
                    sorting : {
                        nombre : 'asc'
                    }
                },{
                    total : $scope.muni.length,
                    filterDelay: 350,
                    getData : function ($defer, params) {
                        var orderedData = params.sorting() ? $filter('orderBy')($scope.muni, params.orderBy()) : $scope.muni;
                        if($scope.filtro){
                            orderedData = params.filter() ? $filter('filter')(orderedData, params.filter()) : orderedData;
                        }
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }
                }
            );
        }

        $scope.createPais = function () {
            var modalPais = $modal.open({
                templateUrl : 'pais.modal',
                controller : 'ModalPaisCtrl',
                backdrop : 'static'
            });
            modalPais.result.then(function (newPaises) {
                $scope.paises = $scope.paises.concat(newPaises);
                $scope.tablePaises.reload();
            })
        };
        $scope.createDepar = function () {
            if(!hasVal($scope.paisSel)){return Data.toast({status : 'info', message : 'Seleccione un pais'})}
            var modal = $modal.open({
                templateUrl : 'depar.modal',
                controller : 'ModalDeparCtrl',
                backdrop : 'static',
                resolve : {
                    pais : function () {
                        return $scope.paisSel;
                    }
                }
            });
            modal.result.then(function (newDepar) {
                if(!hasVal(newDepar)) return;
                $scope.depar = $scope.depar.concat(newDepar);
                $scope.tableDepar.reload();
            });
        };
        $scope.createMuni = function () {
            if(!hasVal($scope.deparSel)){return Data.toast({status : 'info', message : 'Seleccione un departamento'})}
            var modal = $modal.open({
                templateUrl : 'muni.modal',
                controller : 'ModalMuniCtrl',
                backdrop : 'static',
                resolve : {
                    depar : function () {
                        return $scope.deparSel;
                    }
                }
            });
            modal.result.then(function (newMuni) {
                if(!hasVal(newMuni)) return;
                $scope.muni = $scope.muni.concat(newMuni);
                $scope.tableMuni.reload();
            });
        };
        $scope.traerDepar = function (id) {
            $scope.depar = [];
            $scope.muni = [];
            createTableDepar();
            createTableMuni();
            Data.get('deptogeoSel/'+id)
                .then(function (result) {
                    console.log(result);
                    if(result.status == 'info'){
                        Data.toast(result);
                    }
                    for(var i in result){
                        utils.convertNumber(result[i]);
                    }
                    $scope.depar = hasVal(result.data)? result.data : [];
                    createTableDepar();
                });
        };

        $scope.traerMuni = function (id) {
            $scope.muni = [];
            createTableMuni();
            Data.get('municipioSel/'+ id)
                .then(function (result) {
                    if(result.status == 'info'){
                        Data.toast(result);
                    }
                    for(var i in result){
                        utils.convertNumber(result[i]);
                    }
                    $scope.muni = hasVal(result.data)? result.data : [];
                    console.log('ya llego ', result);
                    createTableMuni();
                });
        };

        Data.get('paisSel')
            .then(function (result) {
                if(result.message){
                    Data.toast(result);
                    return;
                }
                for(var i in result){
                    utils.convertNumber(result[i]);
                }
                $scope.paises = result;
                createTablePaises();
            });
        $scope.$watch('paisSel', function (newValue, oldValue) {
            console.log('etro');
            if(hasVal(newValue) && newValue != oldValue){
                $scope.traerDepar(newValue.id);
            }
        });
        $scope.$watch('deparSel', function (newValue, oldValue) {
            if(hasVal(newValue) && newValue != oldValue){
                $scope.traerMuni(newValue.id);
            }
        });
        $scope.selPais = function (pais) {
            $scope.paisSel = pais;
        };
        $scope.selDepar = function (depar) {
            $scope.deparSel = depar;
        };
        $scope.eliminarPais = function (id) {
            $scope.confirm('Desea eliminar el pais?',confirm);
            function confirm (result) {
                if(!result) return;
                Data.get('paisD/'+ id)
                    .then(function (result) {
                        Data.toast(result);
                        if(result.status == 'success'){
                            for(var index in $scope.paises){
                                if($scope.paises[index].id == id){
                                    $scope.paises.splice(index,1);
                                    createTablePaises();
                                    return;
                                }
                            }
                        }

                    });
            }
        };
        $scope.eliminarDepar = function (id) {
            $scope.confirm('Desea eliminar el departamento?',confirm);
            function confirm (result) {
                if(!result) return;
                Data.get('deptogeoD/'+ id)
                    .then(function (result) {
                        Data.toast(result);
                        if(result.status == 'success'){
                            for(var index in $scope.depar){
                                if($scope.depar[index].id == id){
                                    $scope.depar.splice(index,1);
                                    createTableDepar();
                                    return;
                                }
                            }
                        }

                    });
            }
        };
        $scope.eliminarMuni = function (id) {
            $scope.confirm('Desea eliminar el municipio?',confirm);
            function confirm (result) {
                if(!result) return;
                Data.get('municipioD/'+ id)
                    .then(function (result) {
                        Data.toast(result);
                        if(result.status == 'success'){
                            for(var index in $scope.muni){
                                if($scope.muni[index].id == id){
                                    $scope.muni.splice(index,1);
                                    createTableMuni();
                                    return;
                                }
                            }
                        }

                    });
            }
        };
    }]);