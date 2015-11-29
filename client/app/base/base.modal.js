/**
 * Created by josec on 8/30/2015.
 */

angular.module('anApp')
    .controller('ModalBaseCtrl',["$scope", '$modalInstance','Data','utils','base',
        function ($scope,$modalIntance, Data, utils,base) {
            if(base){
                $scope.disable = true;

                //var date = moment(proyecto.fecha_present_p);
                //proyecto.dia = date.date();
                //proyecto.mes = date.month();
                //proyecto.anio = date.year();

                console.log(base);
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
                console.log($scope.base);
                var date =  moment([$scope.pre.anio,$scope.pre.mes,$scope.pre.dia]);
                if(!date.isValid()){
                    return Data.toast({status : 'error', message : 'Fecha invalida'});
                }else{
                    $scope.pre.fecha = date.format();
                }


                // if($scope.rdtipo == EMPRESA){
                    // $scope.pre.DPI = $scope.pre.paisnac = '';
                // }
                // if($scope.rdtipo != EMPRESA && $scope.pre.id_tipo_pre != 5) {
                    // $scope.pre.rep_legal = '';
                // }
                // if($scope.rdtipo != EMPRESA || $scope.pre.id_tipo_pre != 4){
                    // $scope.pre.bienes = '';
                // }
                // if($scope.rdtipo == PERSONA){
                    // $scope.pre.DPI = $scope.pre.perj_DPI = $scope.pre.id_pais_nac = '';
                // }
                // if($scope.rdtipo != EMPRESA && $scope.pre.id_tipo_pre != 5){
                    // $scope.razon_social =  $scope.ofis_principal = '';
                // }
                // if($scope.pre.id_tipo_pre != 2 && $scope.pre.id_tipo_pre != 3){
                    // $scope.pre.titulo =  $scope.pre.grado = $scope.pre.universidad = $scope.pre.anio_egreso = '';
                // }
                // if($scope.pre.id_tipo_pre == 5){
                    // $scope.pre.especialidades = '';
                // }
                // $scope.pre.tipo_persona = $scope.rdtipo;
				
                console.log(date.isValid());
                Data.post('baseIn',{ base : $scope.base})
                    .then(function (result) {
                        Data.toast(result);
                        $modalIntance.close($scope.base);
                    });

            };
            $scope.cancel = function () {
                $modalIntance.dismiss('cancel');
            };
        }]);