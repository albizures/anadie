/**
 * Created by josec on 7/13/2015.
 */

/**
 * Created by josec on 7/8/2015.
 */
angular.module('anApp')
    .controller('ModalRolesCtrl',["$scope", '$modalInstance','rol','Data','utils',function ($scope,$modalIntance,rol,Data,utils) {
        if(rol.id === undefined){
            $scope.rolNuevo = true;
        }else{
            $scope.rolNuevo = false;
        }
        $scope.rol = angular.copy(rol);
        console.log($scope.rol.id);

        $scope.opciones = [];
        $scope.opcionesRol = [];
        $scope.newOpcionesRol = [];
        Data.get('opDatos')
            .then(function (results) {
                for(index in results){

                    results[index] = utils.convertNumber(results[index]);
                }
                $scope.opciones = results;
            });
        if(!$scope.rolNuevo){

            console.log($scope.rol.id);
            Data.get('perDatos/'+$scope.rol.id)
                .then(function (result) {
                    for(index in result){
                        result[index] = utils.convertNumber(result[index]);
                    }
                    $scope.opcionesRol = result;
                    console.log($scope.opcionesRol);
                });
        }

        $scope.ok = function () {
            if($scope.rolNuevo){
                for(index in $scope.opcionesRol){
                    $scope.opcionesRol[index].id = $scope.opcionesRol[index].idopcion;
                }
            }
            $scope.rol.opciones = $scope.opcionesRol;
            $modalIntance.close($scope.rol);
        };
        $scope.cancel = function () {
            $modalIntance.dismiss('cancel');
        };
        $scope.$watchCollection('opciones', function (newValue, oldValue) {
            if(newValue && newValue != oldValue){
                ocultarOpciones();
            }
        });
        $scope.$watchCollection('opcionesRol', function (newValue, oldValue) {
            if(newValue && newValue != oldValue){
                ocultarOpciones();
            }
        });
        $scope.agregarOpcion = function (opcion) {
            if($scope.rolNuevo){
                $scope.opcionesRol.push({
                    opcion : opcion.nombre,
                    idopcion : opcion.id
                });
                //agregar a newOpcionesRol
            }else{
                Data.post('perIn',{opciones :[opcion],idrol : $scope.rol.id})
                    .then(function (result) {
                        if(result.status == 'success'){
                            $scope.opcionesRol.push({
                                opcion : opcion.nombre,
                                idopcion : opcion.id
                            });
                        }
                    });
            }
        };
        $scope.eliminarOpcion  = function (id) {
            if($scope.rolNuevo){
                eliminarOpcion(id);
            }else{
                Data.get('perD/'+ id + '/' + $scope.rol.id)
                    .then(function (result) {
                        if(result.status == 'success'){
                            eliminarOpcion(id);
                        }
                    });
            }

        };
        function eliminarOpcion(id) {
            for(index in $scope.opcionesRol){
                if($scope.opcionesRol[index].idopcion == id){
                    $scope.opcionesRol.splice(index,1);
                }
            }
        }
        function ocultarOpciones() {
            for(i1 in $scope.opciones){
                $scope.opciones[i1].visible = true;
                for(i2 in $scope.opcionesRol){
                    if($scope.opciones[i1].id ==  $scope.opcionesRol[i2].idopcion){
                        $scope.opciones[i1].visible = false;
                    }
                }
                /*for(i3 in $scope.newOpcionesRol){
                    if($scope.opciones[i1].id ==  $scope.newOpcionesRol[i3].idopcion){
                        $scope.opciones[i1].visible = false;
                    }
                }*/
            }
            for(index in $scope.opciones){
                if($scope.opciones[index].visible){
                    $scope.permiso = $scope.opciones[index];
                    break;
                }
            }
        }
    }]);