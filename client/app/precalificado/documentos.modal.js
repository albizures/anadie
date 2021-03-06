/**
 * Created by josec on 10/8/2015.
 */

angular.module('anApp')
    .controller('ModalDocumentosPreCtrl',["$scope", '$modalInstance','Data','utils','FileUploader','$modal','precalificado',
        function ($scope,$modalIntance, Data, utils,FileUploader,$modal,precalificado) {

            $scope.uploading = false;
            $scope.create = true;
            var tipos = ['image/jpeg', 'image/png','application/pdf'];
			var tnombre = "";

            function traerDocumentos() {
               Data.get('precSelDocID/'+ precalificado.id)
                    .then(function (result) {
                        if(result.status){
                            return $scope.documentos = [];
                        }
                        $scope.documentos = result;

                    });
            }
            Data.get('docSel')
                .then(function (result) {
                    if(result.message){
                        Data.toast(result);
                        return;
                    }
                    $scope.tiposDocumentos = result;
                    $scope.idTipoDoc = result[0].id;
                });
            traerDocumentos();
            var uploader = $scope.uploader = new FileUploader({
                url: '/server/api/upFilePrec'
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
            //$scope.getName = function () {
            //    if($scope.uploader.queue.length == 1){
            //        console.log($scope.uploader.queue[0]);
            //        return $scope.uploader.queue[0].file.name;
            //    }else{
            //        return '';
            //    }
            //};
            //$scope.getImg = function () {
            //    var result = $scope.uploader.queue.filter(function (item) {
            //        return item.file.name.indexOf('zip') !== -1
            //    });
            //    if(result.length != 0) return result[0];
            //    return undefined;
            //};
            $scope.uploader.onCompleteAll = function() {
                //$scope.uploader.queue[0].remove();

                $scope.uploading = false;
                $scope.create = true;
                $scope.nombre = '';
                traerDocumentos();

            };
            $scope.uploader.onAfterAddingFile = function(fileItem) {
                if($scope.uploader.queue.length > 1){
                    $scope.uploader.queue[0].remove();
                }
                $scope.nombreFile = fileItem.file.name;
            };
            $scope.uploader.onBeforeUploadItem = function(item) {
                item.formData.push({
                    'idTipoDoc' : $scope.idTipoDoc,
                    'idPrecalificado' : precalificado.id,
                    'nombre_file' : $scope.nombre
                });

                $scope.uploading = true;
                $scope.create = false;
            };
            $scope.ok = function () {
                $modalIntance.close();
            };
        }]);