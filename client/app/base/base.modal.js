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
            Data.get('sectorSel')
                .then(function (result) {
                    if(result.message){
                       return Data.toast(result);
                    }
                    $scope.sectores = result;
                });
            Data.get('iceSel')
                .then(function (result) {
                    if(result.message){
                        return Data.toast(result);
                    }
                    console.info(result);
                    $scope.ices = result;
                    $scope.base.ice = result[0].id;
                    $scope.base.ices = [];
                });

            Data.get('eventoSel')
                .then(function (results) {
                    if(results.message){
                        Data.toast(results);
                        return;
                    }
                    console.log(results);
                    $scope.proyectos = results;
                    $scope.base.idProyecto = results[0].id;

                });

            $scope.cancel = function () {
                $modalIntance.dismiss('cancel');
            };
            $scope.ok = function () {
                $scope.evento = {};

                console.log($scope.base);
                var dateICE =  moment([
                    $scope.base.anioICE,
                    $scope.base.mesICE,
                    $scope.base.diaICE
                ]);
                var dateAN =  moment([
                    $scope.base.anioAN,
                    $scope.base.mesAN,
                    $scope.base.diaAN
                ]);
                var dateCON =  moment([
                    $scope.base.anioCON,
                    $scope.base.mesCON,
                    $scope.base.diaCON
                ]);
                if(!dateICE.isValid()){
                    return Data.toast({status : 'error', message : 'Fecha invalida'});
                }else{
                    $scope.evento.fecha_aprob_ice = dateICE.format();
                }
                if(!dateAN.isValid()){
                    return Data.toast({status : 'error', message : 'Fecha invalida'});
                }else{
                    $scope.evento.fecha_aprob_anadie = dateAN.format();
                }
                if(!dateCON.isValid()){
                    return Data.toast({status : 'error', message : 'Fecha invalida'});
                }else{
                    $scope.evento.fecha_aprob_conadie = dateCON.format();
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

                Data.post('baseIn',{ base : $scope.base , evento : $scope.evento})
                    .then(function (result) {
                        Data.toast(result);
                        $modalIntance.close($scope.base);
                    });

            };
            $scope.agregarICE = function (index) {
                console.log(index);
                $scope.base.ices.push($scope.ices.splice(index - 1,1)[0]);
            };
            $scope.eliminarOpcion = function (index) {
                $scope.ices.push($scope.base.ices.splice(index, 1)[0]);
            };
        }]);