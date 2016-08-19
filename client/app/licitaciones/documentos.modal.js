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
                url: 'server/api/uploadFileEvento' //http://localhost:3000/server/api/uploadFileEvento',
                // headers : {
                //   'Access-Control-Allow-Origin' : 'http://localhost:3000',
                //   'Access-Control-Allow-Credentials' : true
                // }
            });
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
            $scope.addHandlerProcess = function (fn) {
                $scope.procesarHtml = fn;
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

angular.module('anApp')
    .directive('ngProcessHtml',['Data','FileUploader',function (Data,FileUploader) {
        return {
            template : '<div ng-include="documento.ubicacion" onload="termino()">',
            scope : {
                'addHandlerProcess' : '=ngProcessHtml'
            },
            link : function (scope, element) {
                function updateParrafo (id, parrafo){
                  if(id){
                    Data.post('preguntaParrafoUpd', {id : id, parrafo : parrafo}); 
                  }
                }
                scope.termino = function () {
                    var elementos = element.get(0).querySelectorAll('p > span,img');
                    for (var i = 0; i < elementos.length; i++) {
                        var obj = elementos[i];
                        if(obj.parentElement.tagName == 'SPAN'){
                            if(obj.tagName == 'SPAN'){
                                updateParrafo(obj.parentElement.id, obj.parentElement.textContent);
                                obj.parentElement.id = obj.parentElement.id || 'P-' + Date.now().toString() + i.toString();
                            }else  if(obj.tagName == 'IMG'){
                                updateParrafo(obj.parentElement.id, obj.parentElement.textContent);
                                obj.parentElement.id = obj.parentElement.id || 'IMG-' + Date.now().toString() + i.toString();
                            }
                        }else{
                            if(obj.tagName == 'SPAN'){
                                updateParrafo(obj.parentElement.id, obj.parentElement.textContent);
                                obj.parentElement.id = obj.parentElement.id || 'P-' + Date.now().toString() + i.toString();
                            }else  if(obj.tagName == 'IMG'){
                                updateParrafo(obj.parentElement.id, obj.parentElement.textContent);
                                obj.parentElement.id = obj.parentElement.id || 'iMG-' + Date.now().toString() + i.toString();
                            }
                        }
                    }
                    var a = new File([element.get(0).children[0].innerHTML],'name.html', { type: "text/html"});
                    var file = new FileUploader.FileItem(scope.uploader,a);
                    file.progress = 100;
                    file.isUploaded = true;
                    file.isSuccess = true;

                    file.formData.push({
                        'nombre_doc' : scope.documento.ubicacion,
                        'idEvento' : scope.documento.id_evento,
                        'id' : scope.documento.id
                    });
                    scope.uploader.queue.push(file);
                    scope.uploader.queue[0].upload();
                }
            },
            controller : function ($scope) {
                $scope.uploader = new FileUploader({
                    url: 'server/api/uploadFileUPD',
                    headers : 'Content-Type: text/html; charset=UTF-8'
                });
                $scope.procesar = function (documento) {
                    console.log(documento);
                    $scope.documento = documento;
                    $scope.$applyAsync();
                };
                $scope.addHandlerProcess($scope.procesar);
            }
        }
    }]);
