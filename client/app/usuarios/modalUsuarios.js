/**
 * Created by josec on 7/12/2015.
 */

angular.module('anApp')
    .controller('ModalUsuariosCtrl',["$scope", '$modalInstance','usuario','Data','utils', function ($scope,$modalIntance,usuario, Data, utils) {
        $scope.roles = undefined;
        $scope.contrasena = usuario.nombre == undefined;
        console.log(usuario);
        $scope.usuario = angular.copy(usuario);
        Data.get('organizacionesDatos')
            .then(function (result) {
                for(index in result){
                    result[index] = utils.convertNumber(result[index]);
                }
                $scope.organizaciones = result;
                if(!$scope.usuario.idorganizacion){
                    $scope.usuario.idorganizacion = $scope.organizaciones[0].id
                }
            });
        Data.get('rolDatos')
            .then(function (result) {
                for(index in result){
                    result[index] = utils.convertNumber(result[index]);
                }
                $scope.roles = result;
                if(!$scope.usuario.idrol){
                    $scope.usuario.idrol = $scope.roles[0].id
                }
            });
        Data.get('estadoListaUser')
            .then(function (result) {
                for(index in result){
                    result[index] = utils.convertNumber(result[index]);
                }
                $scope.estados = result;
                if(!$scope.usuario.estado){
                    $scope.usuario.estado = $scope.estados[0].id
                }
            });
        $scope.ok = function () {
            if($scope.usuario.nombreEstado == undefined){
                $scope.usuario.nombreEstado = $scope.estados.filter(function(estado){ return estado.id == $scope.usuario.estado})[0].nombre;
            }
            if($scope.usuario.rol == undefined){
                $scope.usuario.rol = $scope.roles.filter(function(rol){ return rol.id == $scope.usuario.idrol})[0].nombre;
            }
            if($scope.usuario.organizacion == undefined){
                $scope.usuario.organizacion = $scope.organizaciones.filter(function(organizacion){ return organizacion.id == $scope.usuario.idorganizacion})[0].nombre;
            }
            if($scope.usuario.fecha == undefined){
                $scope.usuario.fecha = Date.now();
            }
            console.log($scope.usuario);
            $modalIntance.close($scope.usuario);
        };
        $scope.cancel = function () {
            $modalIntance.dismiss('cancel');
        };
    }]);
