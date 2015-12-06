/**
 * Created by josec on 8/30/2015.
 */

angular.module('anApp')
    .controller('ModalPrecalificadoCtrl',["$scope", '$modalInstance','Data','utils','precalificado',
        function ($scope,$modalIntance, Data, utils,precalificado) {
            var PERSONA = '0',
                EMPRESA = '1',
                anioTemp = $scope.today.year -  5;
            $scope.anios = [];
            Data.get('paisSel')
                .then(function (result) {
                    if(result.message){
                        Data.toast(result);
                        return;
                    }
                    $scope.paises = result;
                    $scope.pre.paisnac = '1';
                    
                });
            for (var i = 0; i < 7; i++) {
                $scope.anios[i] = anioTemp + i;
            }
            $scope.pre = precalificado || {};
            Data.get('tpSel')
                .then(function (result) {
                    if(result.message){
                        Data.toast(result);
                        return;
                    }
                    $scope.tipos = result;
                    $scope.pre.id_tipo_pre = $scope.tipos[0].id;
                });
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
                var date =  moment([$scope.pre.anio,$scope.pre.mes,$scope.pre.dia]);
                if(!date.isValid()){
                    return Data.toast({status : 'error', message : 'Fecha invalida'});
                }else{
                    $scope.pre.fecha = date.format();
                }


                if($scope.rdtipo == EMPRESA){
                    $scope.pre.DPI = $scope.pre.paisnac = '';
                }
                if($scope.rdtipo != EMPRESA && $scope.pre.id_tipo_pre != 5) {
                    $scope.pre.rep_legal = '';
                }
                if($scope.rdtipo != EMPRESA || $scope.pre.id_tipo_pre != 4){
                    $scope.pre.bienes = '';
                }
                if($scope.rdtipo == PERSONA){
                    $scope.pre.DPI = $scope.pre.perj_DPI = $scope.pre.id_pais_nac = '';
                }
                if($scope.rdtipo != EMPRESA && $scope.pre.id_tipo_pre != 5){
                    $scope.razon_social =  $scope.ofis_principal = '';
                }
                if($scope.pre.id_tipo_pre != 2 && $scope.pre.id_tipo_pre != 3){
                    $scope.pre.titulo =  $scope.pre.grado = $scope.pre.universidad = $scope.pre.anio_egreso = '';
                }
                if($scope.pre.id_tipo_pre == 5){
                    $scope.pre.especialidades = '';
                }
                $scope.pre.tipo_persona = $scope.rdtipo;
                console.log(date.isValid());
                Data.post('precalificadosIn',{ prec : $scope.pre})
                    .then(function (result) {
                        Data.toast(result);
                        $modalIntance.close($scope.pre);
                    });

            };
            $scope.cancel = function () {
                $modalIntance.dismiss('cancel');
            };
            $scope.$watch('pre.id_tipo_pre', function (newValue, oldValue) {
                if(newValue == 2 || newValue == 3 || newValue == 5){
                    $scope.rdtipo = 'persona';

                }
            });
            $scope.$watchGroup(['pre.dia','pre.mes','pre.anio'], function () {
                var date =  moment({y : $scope.pre.anio, M : $scope.pre.mes, d :$scope.pre.dia});
                $scope.fecha = date.format();
                $scope.valid = date.isValid();

            });
            
        }]);