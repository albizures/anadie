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
               /* Data.get('eventoFileSel/'+ licitacion.id)
                    .then(function (result) {
                        if(result.status){
                            return $scope.documentos = [];
                        }
                        $scope.documentos = result;

                    });*/
            }
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
            uploader.onProgressItem = function(fileItem, progress) {
                console.info('onProgressItem', fileItem, progress);
            };
            uploader.onProgressAll = function(progress) {
                console.info('onProgressAll', progress);
            };
            uploader.onSuccessItem = function(fileItem, response, status, headers) {
                console.info('onSuccessItem', fileItem, response, status, headers);
            };
            uploader.onErrorItem = function(fileItem, response, status, headers) {
                console.info('onErrorItem', fileItem, response, status, headers);
            };
            uploader.onCancelItem = function(fileItem, response, status, headers) {
                console.info('onCancelItem', fileItem, response, status, headers);
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
                console.log('complete');
                //$scope.uploader.queue[0].remove();

                $scope.uploading = false;
                $scope.create = true;
                $scope.nombreFile = '';
                traerDocumentos();

            };
            $scope.uploader.onAfterAddingFile = function(fileItem) {
                if($scope.uploader.queue.length > 1){
                    $scope.uploader.queue[0].remove();
                }
                $scope.nombreFile = fileItem.file.name;
            };
            $scope.uploader.onBeforeUploadItem = function(item) {
                console.log({
                    'idTipoDoc' : 'tipoprueba',
                    'idPrecalificado' : precalificado.id,
                    'nombre_file' : $scope.nombre
                });
                console.log($scope.uploader.queue[0]);
                console.log('lele');

                item.formData.push({
                    'idTipoDoc' : 'tipoprueba',
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