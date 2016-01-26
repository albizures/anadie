/**
 * Created by josec on 10/8/2015.
 */

angular.module('anApp')
    .controller('ModalDocumentosLicitacionCtrl',["$scope", '$modalInstance','Data','utils','FileUploader','$modal','licitacion','cargar',
        function ($scope,$modalIntance, Data, utils,FileUploader,$modal,licitacion,cargar) {
            $scope.cargar = cargar;

            $scope.uploading = false;
            $scope.create = true;

            var zip = ['application/zip', 'application/x-zip', 'application/x-zip-compressed', 'application/octet-stream', 'multipart/x-zip'];
            var tnombre = "";

            function traerDocumentos() {
                Data.get('eventoFileSel/'+ licitacion.id)
                    .then(function (result) {
                        if(result.status){
                            return $scope.documentos = [];
                        }
                        $scope.documentos = result;

                    });
            }
            traerDocumentos();
            $scope.uploader = new FileUploader({
                url: 'http://localhost:3000/server/api/uploadFileEvento',
                headers : {
                  'Access-Control-Allow-Origin' : 'http://localhost:3000',
                  'Access-Control-Allow-Credentials' : true
                }
            });
            console.log('ee');
            $scope.validPdf = function () {
                var result = $scope.uploader.queue.filter(function (item) {
                    return item.file.type == "application/pdf";
                });
                return result.length == 0;
            };
            $scope.validZip = function () {
                var result = $scope.uploader.queue.filter(function (item) {
                    return item.file.name.indexOf('zip') !== -1;
                });
                return result.length == 0;
            };
            $scope.getPdf = function () {
                var result = $scope.uploader.queue.filter(function (item) {
                    return item.file.type == "application/pdf";
                });
                if(result.length != 0) return result[0];
                return undefined;
            };
            $scope.getZip = function () {
                var result = $scope.uploader.queue.filter(function (item) {
                    return item.file.name.indexOf('zip') !== -1
                });
                if(result.length != 0) return result[0];
                return undefined;
            };
            $scope.uploader.onCompleteAll = function() {
                $scope.uploader.queue[0].remove();
                $scope.uploader.queue[0].remove();

                $scope.uploading = false;
                $scope.create = true;
                traerDocumentos();

            };
            $scope.validarPdf = function (documento) {
                if(cargar) return true;
                return documento.ubicacion.indexOf('pdf') != -1;
            };

            $scope.uploader.onBeforeUploadItem = function(item) {
              tnombre = $scope.nombre + ' - ' + (item.file.type == "application/pdf"? 'PDF' : 'HTML');
                item.formData.push({
                    tipo : item.file.type == "application/pdf"? 'PDF' : 'ZIP',
                    idEvento : licitacion.id,
                    nombre_doc : tnombre,// + ' - ' + item.file.type == "application/pdf"? 'PDF' : 'ZIP',
                    token : 'lele'
                });
                item.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000';
                item.headers['Access-Control-Allow-Credentials'] = true;
                $scope.uploading = true;
                $scope.create = false;
            };
            $scope.ok = function () {
                $modalIntance.close();
            };
        }]);
