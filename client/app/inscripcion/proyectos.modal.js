/**
 * Created by josec on 8/30/2015.
 */

angular.module('anApp')
    .controller('ModalProyectosCtrl',["$scope", '$modalInstance','Data','utils','proyecto',
        function ($scope,$modalIntance, Data, utils,proyecto) {
            $scope.proyecto = {};
            if(proyecto){
                $scope.disable = true;

                var date = moment(proyecto.fecha_present_p);
                proyecto.dia = date.date();
                proyecto.mes = date.month();
                proyecto.anio = date.year();

                console.log(proyecto);
                $scope.proyecto = proyecto;
            }else{
                $scope.proyecto.dia = $scope.today.day;
                $scope.proyecto.mes = $scope.today.month;
                $scope.proyecto.anio = $scope.today.year;
                $scope.proyecto.id_pais = 1;
            }

            Data.get('sectorSel')
                .then(function (result) {
                    if(result.message){
                        Data.toast(result);
                        return;
                    }
                    for(var i in result){
                        utils.convertNumber(result[i]);
                    }
                    //result =
                    $scope.sectores = result;
                    //console.log(result,$scope.proyecto,'lala');
                });
            Data.get('iceSel')
                .then(function (result) {
                    if(result.message){
                        Data.toast(result);
                        return;
                    }
                    for(var i in result){
                        utils.convertNumber(result[i]);
                    }
                    $scope.ices = result;
                });

            Data.get('paisSel')
                .then(function (result) {
                    if(result.message){
                        Data.toast(result);
                        return;
                    }
                    for(var i in result){
                        utils.convertNumber(result[i]);
                    }
                    $scope.paises = result;
                });


            $scope.cancel = function () {
                $modalIntance.dismiss('cancel');
            };
            $scope.$watch('proyecto.id_pais', function (newValue, oldValue) {
                console.log(newValue,'afuera',oldValue);
                if(newValue && ((newValue == oldValue && !$scope.departamentos) || (newValue != oldValue))){
                    console.log('cambio pais');
                    Data.get('deptogeoSel/'+newValue)
                        .then(function (result) {
                            if(result.message){
                                Data.toast(result);
                                return;
                            }
                            for(var i in result){
                                utils.convertNumber(result[i]);
                            }
                            console.log('ya llego ', result,proyecto);
                            $scope.departamentos = result;
                        });
                }
            });
            $scope.$watch('proyecto.id_munic', function (newValue, oldValue) {
                //console.log('cambio munic',$scope.proyecto);
            });
            $scope.$watch('proyecto.id_depto', function (newValue, oldValue) {
                if(newValue && ((newValue == oldValue && !$scope.municipios) || (newValue != oldValue))){
                    Data.get('municipioSel/'+ newValue)
                        .then(function (result) {
                            if(result.message){
                                Data.toast(result);
                                return;
                            }
                            for(var i in result){
                                utils.convertNumber(result[i]);
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



            function formatFecha (newValue, oldValue) {
                if($scope.proyecto && $scope.proyecto.dia !== undefined && $scope.proyecto.mes !== undefined && $scope.proyecto.anio !== undefined){
                    $scope.proyecto.fecha_present_p =  moment([$scope.proyecto.anio,$scope.proyecto.mes,$scope.proyecto.dia]).format();
                }
            }


            function validarFechas() {
                var validas = true;
                validas = validas && moment($scope.proyecto.fecha_present_p).isValid();
                return validas;
            }
            
        }]);