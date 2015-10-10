/**
 * Created by josec on 10/8/2015.
 */

angular.module('anApp')
    .controller('ModalDocumentosLicitacionCtrl',["$scope", '$modalInstance','Data','utils','FileUploader','$modal','licitacion',
        function ($scope,$modalIntance, Data, utils,FileUploader,$modal,licitacion) {
            $scope.uploading = false;
            $scope.create = true;


            Data.get('eventoFileSel/'+ licitacion.id)
                .then(function (result) {
                    $scope.documentos = result;

                });
            $scope.uploader = new FileUploader({
                url: 'server/api/uploadFileEvento'
            });
            $scope.validPdf = function () {
                var result = $scope.uploader.queue.filter(function (item) {
                    return item.file.type == "application/pdf";
                });
                return result.length == 0;
            };
            $scope.validHtml = function () {
                var result = $scope.uploader.queue.filter(function (item) {
                    return item.file.type == "text/html";
                });
                return result.length == 0;
            };
            $scope.getPdf = function () {
                var result = $scope.uploader.queue.filter(function (item) {
                    return item.file.type == "application/pdf";
                });
                console.log(result);
                if(result.length != 0) return result[0];
                return undefined;
            };
            $scope.getHtml = function () {
                var result = $scope.uploader.queue.filter(function (item) {
                    return item.file.type == "text/html";
                });
                if(result.length != 0) return result[0];
                return undefined;
            };
            $scope.uploader.onCompleteAll = function() {
                console.info('onCompleteAll');
                $scope.uploader.queue[0].remove();
                $scope.uploader.queue[0].remove();

                $scope.uploading = false;
                $scope.create = true;

            };
            $scope.uploader.onBeforeUploadItem = function(item) {
                $scope.uploading = true;
                $scope.create = false;
            };
            $scope.uploader.onBeforeUploadItem = function(item) {
                console.info('onBeforeUploadItem', item);
                console.log($scope);
                item.formData.push({
                    tipo : item.file.type == "application/pdf"? 'pdf' : 'html',
                    idEvento : licitacion.id,
                    nombre_doc : item.file.name
                });
            };
            $scope.ok = function () {
                $modalIntance.close();
            };
        }]);