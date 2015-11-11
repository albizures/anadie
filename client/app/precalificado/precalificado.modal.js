/**
 * Created by josec on 8/30/2015.
 */

angular.module('anApp')
    .controller('ModalPrecalificadoCtrl',["$scope", '$modalInstance','Data','utils','precalificado',
        function ($scope,$modalIntance, Data, utils,precalificado) {
            $scope.proyecto = {};
            if(precalificado){
                $scope.disable = true;

                //var date = moment(proyecto.fecha_present_p);
                //proyecto.dia = date.date();
                //proyecto.mes = date.month();
                //proyecto.anio = date.year();

                console.log(precalificado);
                //$scope.proyecto = proyecto;
            }else{
                //$scope.proyecto.dia = $scope.today.day;
                //$scope.proyecto.mes = $scope.today.month;
                //$scope.proyecto.anio = $scope.today.year;
                //$scope.proyecto.id_pais = 1;
            }


            $scope.cancel = function () {
                $modalIntance.dismiss('cancel');
            };
            $scope.ok = function () {
                console.log($scope.precalificado);

                /*if($scope.opcion.nombreTipo == undefined){
                    $scope.opcion.nombreTipo = $scope.tipos.filter(function(tipo){ return tipo.id == $scope.opcion.idTipo})[0].nombreTipo;
                }
                if($scope.opcion.idPadre == undefined || $scope.opcion.idPadre == null || $scope.opcion.idPadre == ""){
                    $scope.opcion.idPadre = 0;
                }
                $modalIntance.close($scope.opcion);*/
                $modalIntance.close($scope.precalificado);
            };
            $scope.cancel = function () {
                $modalIntance.dismiss('cancel');
            };

            
        }]);