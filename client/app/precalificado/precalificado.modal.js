/**
 * Created by josec on 8/30/2015.
 */

angular.module('anApp')
    .controller('ModalPrecalificadoCtrl',["$scope", '$modalInstance','Data','utils','precalificado',
        function ($scope,$modalIntance, Data, utils,precalificado) {
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
                var date =  moment([$scope.pre.anio,$scope.pre.mes,$scope.pre.dia])
                if(!date.isValid()){
                    return Data.toast({status : 'error', message : 'Fecha invalida'});
                }

                console.log(date.isValid());
               /* Data.post('precalificadosIn',{ prec : $scope.pre})
                    .then(function (result) {

                    });
                $modalIntance.close($scope.precalificado);*/
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