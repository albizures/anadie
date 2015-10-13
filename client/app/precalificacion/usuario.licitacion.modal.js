/**
 * Created by josec on 10/11/2015.
 */

angular.module('anApp')
    .controller('ModalUsuarioLicitacionCtrl',["$scope", '$modalInstance','Data','utils','licitacion',
        function ($scope,$modalInstance, Data, utils,licitacion) {
            $scope.licitacion = licitacion;
            $scope.newUsuarios = [];
            $scope.agregar = function () {
                var index = $scope.usuario;
                $scope.usuario = $scope.usuarios[$scope.usuario];
                $scope.usuario.idEvento = licitacion.id;// o idLicitacion
                Data.post('eventoUserIn',$scope.usuario)
                    .then(function (result) {
                        Data.toast(result);
                        if(result.status === 'success'){
                            $scope.usuario.id = result.data;
                            $scope.usuarios.splice(index,1);
                            $scope.newUsuarios.push($scope.usuario);
                            $scope.usuario = 0;
                        }
                    });
            };
            Data.get('userAllEventoSel/'+ $scope.licitacion.id)
                .then(function (results) {
                    if(results.message){
                        Data.toast(results);
                        return;
                    }
                    console.log(results);
                    for(index in results){
                        results[index].nombreCompleto = results[index].nombres + ' ' + results[index].apellidos;
                        results[index] = utils.convertNumber(results[index]);
                    }
                    $scope.usuarios = results;
                    $scope.usuario = 0;
                });
            $scope.ok = function () {
                $modalInstance.close($scope.newUsuarios);
            };
        }]);