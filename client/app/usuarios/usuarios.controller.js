/**
 * Created by josec on 7/12/2015.
 */
angular.module('anApp')
    .controller('UsuariosCtrl',['$scope','Data','$rootScope','ngTableParams','$filter','$modal','utils',
    function ($scope,Data, $rootScope, ngTableParams, $filter , $modal, utils) {
        $scope.filtro = false;
        $scope.$watch('filtro', function (newValue, oldValue) {
            if(newValue !== undefined && newValue !== oldValue){
                if($scope.tableUsuarios){
                    $scope.tableUsuarios.reload();
                }

            }
        });
        Data.get('userDatos')
            .then(function (results) {
                for(index in results){
                    results[index] = utils.convertNumber(results[index]);
                    results[index].fecha = Date.parse(new Date(results[index].fecha));
                }
                // console.log(results);
                $scope.usuarios = results;
                $scope.tableUsuarios = new ngTableParams({
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
                            if($scope.filtro){
                                orderedData = params.filter() ? $filter('filter')(orderedData, params.filter()) : orderedData;
                            }
                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        }
                    }
                );
            });
        $scope.limpiar = function () {
			$scope.tableUsuarios.sorting({});
            $scope.tableUsuarios.filter({});
            $scope.filtro = false;
        };
        $scope.editar = function (id) {
            var modalUsuarios = $modal.open({
                templateUrl: 'usuarios.modal',
                controller: 'ModalUsuariosCtrl',
                resolve: {
                    usuario : function () {
                        return $scope.usuarios.filter(function (usuario) {
                            return usuario.id == id;
                        })[0];
                    }
                }
            });
            modalUsuarios.result.then(function (usuario) {
                Data.post('userU',{'user':usuario})
                    .then(function (results) {
                        if(results.status === "info") {
                            for (index in $scope.usuarios) {
                                if ($scope.usuarios[index].id == usuario.id) {
                                    $scope.usuarios[index] = usuario;
                                    $scope.tableUsuarios.reload();
                                }
                            }
                        }
                        Data.toast(results);
                    });
            }, function () {
            });
        };
        $scope.agregar = function () {
            var modalOpciones = $modal.open({
                templateUrl : 'usuarios.modal',
                controller : 'ModalUsuariosCtrl',
                resolve : {
                    usuario : function () {
                        return {}
                    }
                }
            });
            modalOpciones.result.then(function (usuario) {
                console.log(usuario);
                Data.post('userIn',{'user':usuario})
                    .then(function (results) {
                        if(results.status === "success"){
                            console.log(Number(results.data.id),results.data.id,results.data);
                            usuario.id = Number(results.data.id);
                            $scope.usuarios.push(usuario);
                            $scope.tableUsuarios.reload();
                        }
                        Data.toast(results);
                    });
            });
        };
        $scope.eliminar = function (id) {
            Data.get('userD/'+id)
                .then(function (results) {
                    for(index in $scope.usuarios){
                        if($scope.usuarios[index].id == id){
                            $scope.usuarios.splice(index,1);
                            $scope.tableUsuarios.reload();
                            Data.toast(results);
                            break;
                        }
                    }

                })
        };
    }]);