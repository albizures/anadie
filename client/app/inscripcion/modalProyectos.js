/**
 * Created by josec on 8/30/2015.
 */

angular.module('anApp')
    .controller('ModalProyectosCtrl',["$scope", '$modalInstance','Data','utils',
        function ($scope,$modalIntance, Data, utils) {

            $scope.dias = utils.dias;
            $scope.meses = utils.meses;
            $scope.anios = utils.anios;
            Data.get('sectorSel')
                .then(function (result) {
                    if(result.message){
                        Data.toast(result);
                        return;
                    }
                    $scope.sectores = result;
                });
            Data.get('iceSel')
                .then(function (result) {
                    if(result.message){
                        Data.toast(result);
                        return;
                    }
                    $scope.ices = result;
                });
            Data.get('paisSel')
                .then(function (result) {
                    if(result.message){
                        Data.toast(result);
                        return;
                    }
                    $scope.paises = result;
                });


            $scope.cancel = function () {
                $modalIntance.dismiss('cancel');
            };
            $scope.$watch('proyecto.id_pais', function (newValue, oldValue) {
                if(newValue && newValue != oldValue){
                    Data.get('deptogeoSel/'+newValue)
                        .then(function (result) {
                            if(result.message){
                                Data.toast(result);
                                return;
                            }
                            $scope.departamentos = result;
                        });
                }
            });
            $scope.$watch('proyecto.id_munic', function (newValue, oldValue) {
                console.log('cambio munic',$scope.proyecto);
            });
            $scope.$watch('proyecto.id_depto', function (newValue, oldValue) {
                if(newValue && newValue != oldValue){
                    Data.get('municipioSel/'+ newValue)
                        .then(function (result) {
                            if(result.message){
                                Data.toast(result);
                                return;
                            }
                            $scope.municipios = result;
                        });
                }
            });
            $scope.ok = function () {
                console.log($scope.proyecto);

                /*if($scope.opcion.nombreTipo == undefined){
                    $scope.opcion.nombreTipo = $scope.tipos.filter(function(tipo){ return tipo.id == $scope.opcion.idTipo})[0].nombreTipo;
                }
                if($scope.opcion.idPadre == undefined || $scope.opcion.idPadre == null || $scope.opcion.idPadre == ""){
                    $scope.opcion.idPadre = 0;
                }
                $modalIntance.close($scope.opcion);*/
                $modalIntance.close($scope.proyecto);
            };
            $scope.cancel = function () {
                $modalIntance.dismiss('cancel');
            };
            $scope.$watch('proyecto.dia', formatFecha);
            $scope.$watch('proyecto.mes', formatFecha);
            $scope.$watch('proyecto.anio', formatFecha);

            $scope.$watch('proyecto.diaDicTec', formatFechaDicTec);
            $scope.$watch('proyecto.mesDicTec', formatFechaDicTec);
            $scope.$watch('proyecto.anioDicTec', formatFechaDicTec);

            $scope.$watch('proyecto.diaDicLeg', formatFechaDicLeg);
            $scope.$watch('proyecto.mesDicLeg', formatFechaDicLeg);
            $scope.$watch('proyecto.anioDicLeg', formatFechaDicLeg);

            $scope.$watch('proyecto.diaResDir', formatFechaResDir);
            $scope.$watch('proyecto.mesResDir', formatFechaResDir);
            $scope.$watch('proyecto.anioResDir', formatFechaResDir);

            $scope.$watch('proyecto.diaResCon', formatFechaResCon);
            $scope.$watch('proyecto.mesResCon', formatFechaResCon);
            $scope.$watch('proyecto.anioResCon', formatFechaResCon);

            function formatFecha (newValue, oldValue) {
                if($scope.proyecto && $scope.proyecto.dia !== undefined && $scope.proyecto.mes !== undefined && $scope.proyecto.anio !== undefined){
                    $scope.proyecto.fecha_present_p =  moment([$scope.proyecto.anio,$scope.proyecto.mes,$scope.proyecto.dia]).format();
                }
            }
            function formatFechaDicTec (newValue, oldValue) {
                if($scope.proyecto && $scope.proyecto.diaDicTec !== undefined && $scope.proyecto.mesDicTec !== undefined && $scope.proyecto.anioDicTec !== undefined){
                    $scope.proyecto.dictamen_tec_fec =  moment([$scope.proyecto.anioDicTec,$scope.proyecto.mesDicTec,$scope.proyecto.diaDicTec]).format();
                }
            }
            function formatFechaDicLeg (newValue, oldValue) {
                if($scope.proyecto && $scope.proyecto.diaDicLeg !== undefined && $scope.proyecto.mesDicLeg !== undefined && $scope.proyecto.anioDicLeg !== undefined){
                    $scope.proyecto.dictamen_leg_fec =  moment([$scope.proyecto.anioDicLeg,$scope.proyecto.mesDicLeg,$scope.proyecto.diaDicLeg]).format();
                }
            }
            function formatFechaResDir (newValue, oldValue) {
                if($scope.proyecto && $scope.proyecto.diaResDir !== undefined && $scope.proyecto.mesResDir !== undefined && $scope.proyecto.anioResDir !== undefined){
                    $scope.proyecto.res_dir_eje_fec =  moment([$scope.proyecto.anioResDir,$scope.proyecto.mesResDir,$scope.proyecto.diaResDir]).format();
                }
            }
            function formatFechaResCon (newValue, oldValue) {
                if($scope.proyecto && $scope.proyecto.diaResCon !== undefined && $scope.proyecto.mesResCon !== undefined && $scope.proyecto.anioResCon !== undefined){
                    $scope.proyecto.res_conadie_fec =  moment([$scope.proyecto.anioResCon,$scope.proyecto.mesResCon,$scope.proyecto.diaResCon]).format();
                }
            }

            function validarFechas() {
                var validas = true;
                validas = validas && moment($scope.proyecto.fecha_present_p).isValid();
                validas = validas && moment($scope.proyecto.dictamen_tec_fec).isValid();
                validas = validas && moment($scope.proyecto.dictamen_leg_fec).isValid();
                validas = validas && moment($scope.proyecto.res_dir_eje_fec).isValid();
                validas = validas && moment($scope.proyecto.res_conadie_fec).isValid();
                return validas;
            }
            
        }]);