/**
 * Created by josec on 8/30/2015.
 */

angular.module('anApp')
    .controller('ModalResolucionCtrl',["$scope", '$modalInstance','Data','utils','res',
        function ($scope,$modalIntance, Data, utils, res) {
			$scope.res = {};
            if(res){
                $scope.disable = true;

                var date = moment(res.fecha);
                res.dia = date.date();
                res.mes = date.month();
                res.anio = date.year();

                $scope.res = res;
            }
            Data.get('organoSel')
                .then(function (result) {
                    if(result.message){
                        return Data.toast(result);
                    }
                    $scope.organos = result;
                    $scope.res.idOrgano = result[0].id;
                });
            Data.get('temaSel')
                .then(function (result) {
                    if(result.message){
                        return Data.toast(result);
                    }
                    $scope.temas = result;
                    $scope.res.idTema = result[0].id;
                });
            Data.get('proyectoSel')
                .then(function (result) {
                    if(result.message){
                        return Data.toast(result);
                    }
                    $scope.proyectos = result;
                    $scope.res.idProyecto = result[0].id;
                });
            Data.get('docSel')
                .then(function (results) {
                    if(results.message){
                        Data.toast(results);
                        return;
                    }
                    $scope.documentos = results;
                    $scope.res.idDoc = results[0].id;
                });
            $scope.cancel = function () {
                $modalIntance.dismiss('cancel');
            };
            $scope.ok = function () {
                var date =  moment([$scope.res.anio,$scope.res.mes,$scope.res.dia]);
                if(!date.isValid()){
                    return Data.toast({status : 'error', message : 'Fecha invalida'});
                }else{
                    $scope.res.fecha = date.format();
                }

                Data.post('resIn',{ res : $scope.res})
                    .then(function (result) {
                        Data.toast(result);
                        $modalIntance.close($scope.res);
                    });

            };
            $scope.cancel = function () {
                $modalIntance.dismiss('cancel');
            };
        }]);