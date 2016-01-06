/**
 * Created by josec on 8/30/2015.
 */

angular.module('anApp')
    .controller('ModalResolucionCtrl',["$scope", '$modalInstance','Data','utils','res','FileUploader',
        function ($scope,$modalIntance, Data, utils, res,FileUploader) {
			$scope.res = {};
            var id;
            var tipos = ['image/jpeg', 'image/png','application/pdf'];
            if(res){
                console.log(res);
                res.idOrgano = res.id_organo;
                res.idDoc = res.id_doc;
                res.idProyecto = res.id_proyecto;
                res.idTema = res.id_tema;
                $scope.disable = true;
                $scope.uploaded = !!res.ubicacion;
                var date = moment(res.fecha);
                res.dia = date.date();
                res.mes = date.month();
                res.anio = date.year();
                id = res.id;
                $scope.res = res;
            }
            Data.get('organoSel')
                .then(function (result) {
                    if(result.message){
                        return Data.toast(result);
                    }
                    $scope.organos = result;
                    if(!$scope.disable)
                        $scope.res.idOrgano = result[0].id;
                });
            Data.get('temaSel')
                .then(function (result) {
                    if(result.message){
                        return Data.toast(result);
                    }
                    $scope.temas = result;
                    if(!$scope.disable)
                        $scope.res.idTema = result[0].id;
                });
            Data.get('proyectoSel')
                .then(function (result) {
                    if(result.message){
                        return Data.toast(result);
                    }
                    $scope.proyectos = result;
                    if(!$scope.disable)
                        $scope.res.idProyecto = result[0].id;
                });
            Data.get('docSel')
                .then(function (results) {
                    if(results.message){
                        Data.toast(results);
                        return;
                    }
                    $scope.documentos = results;
                    if(!$scope.disable)
                        $scope.res.idDoc = results[0].id;
                });
            $scope.cancel = function () {
                $modalIntance.dismiss('cancel');
            };
            var uploader = $scope.uploader = new FileUploader({
                url: '/server/api/upFileRes'
            });
            $scope.uploader.filters.push({
                name: 'precalificados',
                fn: function(item, options) {
                    return tipos.indexOf(item.type) !== -1;
                }
            });
            $scope.uploader.onWhenAddingFileFailed = function(item, filter, options) {
                Data.toast({status : 'warning', message : 'Tipo incorrecto'});
            };
            $scope.uploader.onCompleteAll = function() {
                $scope.uploader.queue[0].remove();

                $scope.uploading = false;
                $scope.create = true;
                $scope.nombreFile = '';
                $modalIntance.close($scope.res);

            };
            $scope.uploader.onAfterAddingFile = function(fileItem) {
                if($scope.uploader.queue.length > 1){
                    $scope.uploader.queue[0].remove();
                }
                $scope.nombreFile = fileItem.file.name;
            };
            $scope.uploader.onBeforeUploadItem = function(item) {
                item.formData.push({
                    'idTipoDoc' : $scope.res.idDoc,
                    'idResolucion' : id,
                    'nombre_file' : $scope.nombre || $scope.nombreFile
                });

                $scope.uploading = true;
                $scope.create = false;
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
                        if(result.status == 'success'){
                            id = result.data.id;
                            if(uploader.queue.length == 1){
                                $scope.subir();
                            }else{
                                $modalIntance.close($scope.res);
                            }

                        }
                        Data.toast(result);
                    });

            };
            $scope.subir = function () {
                uploader.uploadAll();
            };
            $scope.remove = function () {
                $scope.uploader.queue[0].remove();
                $scope.nombreFile = '';
            };
            $scope.cancel = function () {
                $modalIntance.dismiss('cancel');
            };
        }]);