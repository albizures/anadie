/**
 * Created by josec on 10/13/2015.
 */

angular.module('anApp')
    .directive('ngVisor',['Data','FileUploader',function (Data,FileUploader) {
        return {
            template :  '<div class="col-lg-12">' +
                            '<div id="archivo" ng-class="estado.comentando? \'\' : \'col-lg-offset-2\'" class="col-lg-8 visor" ng-include="documento.ubicacion" onload="termino()">' +
                            '</div>' +
                            '<div ng-if="estado.comentando" ng-coment-box="estado.id" actualizar="actualizar" documento="documento.id" offset="estado.offset" enviar="enviar" pregunta="estado.pregunta" class="coment-box col-lg-4"></div>' +
                            '<div ng-if="estado.cargando" class="load-doc col-lg-12">' +
                                '<span class="glyphicon glyphicon-refresh load active"></span>'+
                            '</div>'+
                        '</div>',
            restrict : 'AE',
            scope : {
                documento : '=',
                estado : '='
            },
            link : function (scope,element,attrs) {
                var child = element.children();
                //console.log('console',$(element).children('p'));
                scope.estado.cargando = true;
                scope.estado.comentando = false;
                scope.termino = function () {
                    scope.estado.cargando = false;
                    init();
                };
                function reset() {
                    scope.estado.comentando = false;
                    scope.estado.id = scope.estado.offset = scope.estado.objeto = scope.estado.tipo = undefined;
                    scope.$applyAsync();
                }
                function init() {
                    var ps = $(element).find('p');
                    ps.off('click');
                    ps.on('click',function (evt) {
                        if($(this).find('font').length == 0 && $(this).find('img').length == 0) return;
                        scope.estado.comentando = true;
                        $(element).find('p.active').removeClass('active');
                        if(this == scope.estado.objeto){
                            console.log('cerrar');
                            return reset();
                        }
                        $(this).addClass('active');

                        scope.estado.id = this.id;
                        scope.estado.tipo = $(this).find('img').length == 0 ? 'P' : 'IMG';
                        scope.estado.objeto = this;

                        scope.estado.offset = $(this).offset().top - element.offset().top;
                        scope.$applyAsync();
                    });
                }

                scope.$watch('estado.comentando', function (newValue, oldValue) {
                    if(hasVal(newValue) && oldValue !== newValue){
                        if(newValue){

                        }else{
                            $(element).find('p.active').removeClass('active');
                        }
                    }
                });
                scope.changeId = function (id) {
                    scope.estado.id = scope.estado.objeto.id = id;
                };
                scope.getHtml = function () {
                    $(element).find('p.active').removeClass('active');
                    var html = $('#archivo').html();
                    $(scope.estado.objeto).addClass('active');
                    return html;
                }
            },
            controller : function ($scope) {
                $scope.uploader = new FileUploader({
                    url: 'server/api/uploadFileUPD'
                });
                $scope.enviar = function () {
                    var nuevo = $scope.estado.id == '',
                        ruta =  nuevo ?'preguntaPrimeraIn'  : 'preguntaAdicionalIn',
                        data = {
                            clave : nuevo?  $scope.estado.tipo + '-' + Date.now() : $scope.estado.id,
                            tipo : $scope.estado.tipo,
                            idEvento : Number($scope.documento.id_evento),
                            idDoc : Number($scope.documento.id),
                            pregunta : $scope.estado.pregunta
                        };
                    Data.post(ruta,{pregunta : data})
                        .then(function (result) {
                            Data.toast(result);
                            if(result.status == 'success'){
                                $scope.changeId(data.clave);
                                if(nuevo){
                                    console.log('unevo');
                                    $scope.updFile();

                                }else{
                                    $scope.$broadcast('actualizarComentario');
                                }

                            }
                        });
                };
                $scope.updFile = function () {
                    var a = new File([$scope.getHtml()],'name.html', { type: "text/html"});
                    var file = new FileUploader.FileItem($scope.uploader,a);
                    file.progress = 100;
                    file.isUploaded = true;
                    file.isSuccess = true;

                    file.formData.push({'nombre_doc' : $scope.documento.ubicacion});
                    $scope.uploader.queue.push(file);
                    $scope.uploader.queue[0].upload();
                }
            }

        }
    }]);