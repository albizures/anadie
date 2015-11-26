/**
 * Created by josec on 10/11/2015.
 */


angular.module('anApp')
    .controller('PrecalificacionCtrl',['$scope','Data','$rootScope','ngTableParams','$filter','$modal','utils',
        function ($scope,Data, $rootScope, ngTableParams, $filter , $modal, utils) {
            $scope.tipoPrecalificado = '1';
            Data.get('eventoSel')
                .then(function (results) {
                    if(results.message){
                        Data.toast(results);
                        return;
                    }
                    for(index in results){
                        results[index] = utils.convertNumber(results[index]);
                    }
                    //console.log(results);
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

            $scope.$watch('tipoPrecalificado', function (newValue, oldValue) {
                if(!$scope.licitacionSel) return;
                if(newValue == 1){
                    actualizarUsuarios(true);
                }else{
                    actualizarConsultores(true);
                }
            });
            $scope.selLicitacion = function (licitacion) {
                $scope.licitacionSel = licitacion;
                if($scope.tipoPrecalificado == 1){
                    actualizarUsuarios(true);
                }else{
                    actualizarConsultores(true);
                }
            };
            function actualizarUsuarios (cambiar) {
                if(hasVal($scope.tablePrecalificados) && !cambiar){
                    return $scope.tablePrecalificados.reload();
                }
                Data.get('userEventoSel/'+$scope.licitacionSel.id)
                    .then(function (results) {
                        //console.log(results);
                        if(results.message){
                            Data.toast(results);
                            $scope.usuarios = [];
                            $scope.tablePrecalificados.reload();
                            return;
                        }
                        for(index in results){
                            results[index] = utils.convertNumber(results[index]);
                        }
                        $scope.usuarios = results;
                        if(hasVal($scope.tablePrecalificados)){
                            return $scope.tablePrecalificados.reload();
                        }
                        $scope.tablePrecalificados = new ngTableParams({
                                page : 1,
                                count : 10,
                                sorting : {
                                    nombre : 'asc'
                                }
                        },{
                            total : $scope.usuarios.length,
                            filterDelay: 350,
                            getData : function ($defer, params) {
                                var orderedData = params.sorting() ? $filter('orderBy')($scope.usuarios, params.orderBy()) : $scope.usuarios;
                                if($scope.filtro2){
                                    orderedData = params.filter() ? $filter('filter')(orderedData, params.filter()) : orderedData;
                                }
                                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                            }
                        });
                    });
            }
            function actualizarConsultores (cambiar) {
                if(hasVal($scope.tableConsultores) && !cambiar){
                    return $scope.tableConsultores.reload();
                }
                Data.get('eventoConsultorS/'+$scope.licitacionSel.id)
                    .then(function (results) {
                        //console.log(results);
                        if(results.message){
                            Data.toast(results);
                            $scope.consultores = [];
                            $scope.tableConsultores.reload();
                            return;
                        }
                        for(index in results){
                            results[index] = utils.convertNumber(results[index]);
                        }
                        $scope.consultores = results;
                        if(hasVal($scope.tableConsultores)){
                            return $scope.tableConsultores.reload();
                        }
                        $scope.tableConsultores = new ngTableParams({
                            page : 1,
                            count : 10,
                            sorting : {
                                nombre : 'asc'
                            }
                        },{
                            total : $scope.consultores.length,
                            filterDelay: 350,
                            getData : function ($defer, params) {
                                var orderedData = params.sorting() ? $filter('orderBy')($scope.consultores, params.orderBy()) : $scope.consultores;
                                if($scope.filtro3){
                                    orderedData = params.filter() ? $filter('filter')(orderedData, params.filter()) : orderedData;
                                }
                                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                            }
                        });
                    });
            }
            $scope.agregarOrganizacion = function () {
                if(!hasVal($scope.licitacionSel)){return Data.toast({status : 'info', message : 'Seleccione un evento de licitacion'})}
                var modal = $modal.open({
                    templateUrl : 'organizacion.licitacion.modal',
                    controller : 'ModalOrganizacionLicitacionCtrl',
                    backdrop : 'static',
                    resolve : {
                        licitacion : function () {
                            return $scope.licitacionSel;
                        }
                    }
                });
                modal.result.then(function (newUsuarios) {
                    if(!hasVal(newUsuarios)) return;
                    if(!hasVal($scope.usuarios)){
                        $scope.usuarios = [];
                    }
                    //$scope.usuarios = $scope.usuarios.concat(newUsuarios);
                    actualizarUsuarios(true);
                });
            };
            $scope.agregarConsultores = function () {
                if(!hasVal($scope.licitacionSel)){return Data.toast({status : 'info', message : 'Seleccione un evento de licitacion'})}
                var modal = $modal.open({
                    templateUrl : 'consultores.licitacion.modal',
                    controller : 'ModalConsultoresCtrl',
                    backdrop : 'static',
                    resolve : {
                        licitacion : function () {
                            return $scope.licitacionSel;
                        }
                    }
                });
                modal.result.then(function (newUsuarios) {
                    if(!hasVal(newUsuarios)) return;
                    if(!hasVal($scope.consultores)){
                        $scope.consultores = [];
                    }
                    //$scope.usuarios = $scope.usuarios.concat(newUsuarios);
                    actualizarConsultores(true);
                });
            };
            $scope.eliminar = function (elemento,tipo) {
				
				console.log(tipo, elemento.id);
				
                $scope.confirm('Desea eliminar al ' + tipo,confirm);

                function confirm (result) {
                    if(!result) return;
                    var ruta =  tipo == 'precalificado'?
                        'eventoUserDel/' + elemento.id:
                        'eventoConsultorD/' + elemento.id;

                    Data.get(ruta)
                        .then(function (result) {
                            Data.toast(result);
                            if(result.status == 'success'){
                                var arreglo = tipo == 'precalificado'? 'usuarios' : 'consultores';
                                for (var i = 0; i < $scope[arreglo].length; i++) {
                                    if($scope[arreglo][i].id == elemento.id){
                                        $scope[arreglo].splice(index,1);
                                        tipo == 'precalificado'? actualizarUsuarios() : actualizarConsultores();
                                        return;
                                    }

                                }
                            }

                        });
                }
            };
        }]);