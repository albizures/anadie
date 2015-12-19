/**
 * Created by josec on 8/30/2015.
 */

angular.module('anApp')
    .controller('ModalBaseCtrl',["$scope", '$modalInstance','Data','utils','base',
        function ($scope,$modalIntance, Data, utils,base) {
            if(base){
                $scope.disable = true;
                Data.get('baseSelID/' + base.id)
                    .then(function (result) {
                        console.log(result);
                    });
                var date = moment(base.fecha_aprob_ice);
                base.diaICE = date.date();
                base.mesICE = date.month();
                base.anioICE = date.year();

                date = moment(base.fecha_aprob_anadie);
                base.diaAN = date.date();
                base.mesAN = date.month();
                base.anioAN = date.year();


                date = moment(base.fecha_aprob_ice);
                base.diaCON = date.date();
                base.mesCON = date.month();
                base.anioCON = date.year();

                base.idDoc = base.id_doc_aprobacion;
                base.idProyecto = base.id_proyecto;
                $scope.base = base;
            }
            Data.get('sectorSel')
                .then(function (result) {
                    if(result.message){
                       return Data.toast(result);
                    }
                    $scope.sectores = result;
                });
            Data.get('proyectoSel')
                .then(function (result) {
                    if(result.message){
                        return Data.toast(result);
                    }
                    $scope.proyectos = result;
                    $scope.base.idProyecto = result[0].id;
                });
            Data.get('iceSel')
                .then(function (result) {
                    if(result.message){
                        return Data.toast(result);
                    }
                    $scope.ices = result;
                    $scope.base.ice = result[0].id;
                    $scope.base.icesTemp = [];
                });
            Data.get('docSel')
                .then(function (results) {
                    if(results.message){
                        Data.toast(results);
                        return;
                    }
                    $scope.documentos = results;
                    $scope.base.idDoc = results[0].id;

                });

            $scope.cancel = function () {
                $modalIntance.dismiss('cancel');
            };
            $scope.ok = function () {
                $scope.evento = {};
                var dateICE = moment([
                    $scope.base.anioICE,
                    $scope.base.mesICE,
                    $scope.base.diaICE
                ]);
                var dateAN = moment([
                    $scope.base.anioAN,
                    $scope.base.mesAN,
                    $scope.base.diaAN
                ]);
                var dateCON = moment([
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
                $scope.base.ices = [];

                for(var index in $scope.base.icesTemp){
                    $scope.base.ices.push($scope.base.icesTemp[index].id);
                }
                Data.post('baseIn',{ base : $scope.base , evento : $scope.evento})
                    .then(function (result) {
                        Data.toast(result);
                        $modalIntance.close($scope.base);
                    });

            };
            $scope.agregarICE = function (index) {
                $scope.base.icesTemp.push($scope.ices.splice(index,1)[0]);
            };
            $scope.eliminarOpcion = function (index) {
                $scope.ices.push($scope.base.icesTemp.splice(index, 1)[0]);
            };
        }]);