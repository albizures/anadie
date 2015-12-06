/**
 * Created by josec on 10/13/2015.
 */

angular.module('anApp')
    .directive('ngVisor',['Data','FileUploader',function (Data,FileUploader) {
        return {
            template :  '<div class="col-sm-12">' +
                            '<div id="archivo" ng-class="estado.comentando? \'\' : \'col-sm-offset-2\'" class="col-sm-8 visor" ng-include="documento.ubicacion" onload="termino()">' +
                            '</div>' +
                            '<div ng-if="estado.comentando" ng-coment-box="estado.id" actualizar="actualizar" documento="documento.id" offset="estado.offset" enviar="enviar" pregunta="estado.pregunta" ambitos="estado.ambitos" class="coment-box col-sm-4"></div>' +
                            '<div ng-if="estado.cargando" class="load-doc col-sm-12">' +
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
                    var pregunta = $('#' + scope.estado.preguntaSel);
                    if(pregunta.length == 1 ){
                        window.scrollTo(0,pregunta.offset().top + 20);
                    }
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
                        if($(this).find('span').length == 0 && $(this).find('img').length == 0) return;
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
                $scope.estado.ambitos = [];
                $scope.uploader = new FileUploader({
                    url: 'server/api/uploadFileUPD',
                    headers : 'Content-Type: text/html; charset=UTF-8',
                });
                $scope.enviar = function () {
                    var nuevo = $scope.estado.id == '',
                        ruta =  nuevo ?'preguntaPrimeraIn'  : 'preguntaAdicionalIn',
                        ambitos = angular.copy($scope.estado.ambitos);
                    for(var a = 0; a < ambitos.length; a++){
                        if(!hasVal(ambitos[a]) || ambitos[a] === false){
                            console.log('quitar',a,ambitos[a]);
                            ambitos.splice(a,1);
                            a--;
                        }
                    }
                    var data = {
                            clave : nuevo?  $scope.estado.tipo + '-' + Date.now() : $scope.estado.id,
                            tipo : $scope.estado.tipo,
                            idEvento : Number($scope.documento.id_evento),
                            idDoc : Number($scope.documento.id),
                            pregunta : $scope.estado.pregunta,
                            ambitos : ambitos
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