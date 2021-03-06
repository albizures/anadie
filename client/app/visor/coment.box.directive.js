/**
 * Created by josec on 10/14/2015.
 */

angular.module('anApp')
    .directive('ngComentBox',['Data','utils',function (Data,utils) {
        return {
            template : '<div class="row">' +
                            '<div class="col-sm-12 z-depth-1 box">' +
                                '<textarea placeholder="Escriba aqui su pregunta/comentario..." ng-model="pregunta"></textarea>' +
                                //'<div ng-class="pregunta? \'active\' : \'\'" ng-model="pregunta" contenteditable  class="textarea form-control" name="" id=""  rows="5"></div>' +
                                '<br>'+
                                '<div ng-repeat="a in ambitos" class="col-lg-6">' +
                                    '<label>{{a.nombre}} ' +
                                        '<input ng-true-value="{{a.id}}"  ng-model="ambitosSel[$index]"  name="ambitos" type="checkbox"/>' +
                                    '</label>'+
                                '</div>' +
                                '<button ng-disabled="!pregunta || !validAmbitos(ambitosSel)" ng-click="enviar()" class="btn btn-success btn2 col-sm-12">Enviar</button>' +
                            '</div>'+
                            '<div class="col-sm-12 z-depth-1 coment">Preguntas/comentarios anteriores:</div>'+
                            '<div class="col-sm-12 z-depth-1 coment" ng-repeat="p in preguntas">' +
                                '<span ng-bind-html="p.pregunta"></span>    '+
                                '<br/><span class="pull-right fecha">{{p.fecha_crea}}</span> '+
                            '</div>' +
                        '</div>',
            restrict : 'AE',
            scope : {
                'id' : '=ngComentBox',
                'offset' : '=',
                'pregunta' : '=',
                'enviar' : '=',
                'documento' : '=',
                'actualizar' : '=',
                'ambitosSel' : '=ambitos'
            },
            link : function (scope,element) {
                scope.$watch('offset', function (newValue, oldValue) {
                    if(hasVal(newValue)){
                        element.css('top',newValue + 'px');
                    }
                });
            },
            controller : function ($scope) {
                $scope.validAmbitos = function (ambitosSel) {
                    for(var i in ambitosSel){
                        if(ambitosSel[i]) return true;
                    }
                    return false;
                };

                Data.get('ambitoSel')
                    .then(function (result) {
                        if(result.message){
                            return Data.toast(result);
                        }
                        for(index in result){
                            result[index].id = utils.convertNumber(result[index].id);
                        }
                        $scope.ambitos = result;
                    });
                $scope.$on('actualizarComentario', function() {
                    traerComentarios($scope.id);
                });
                $scope.$watch('id', function (newValue, oldValue) {
                    if(hasVal(newValue) && newValue !== ''){
                        traerComentarios(newValue);
                    }else{
                        $scope.preguntas = [{pregunta : 'No hay preguntas/comentarios...'}];
                    }
                });
                function traerComentarios (id) {
                    $scope.pregunta = undefined;
                    $scope.ambitosSel = [];
                    Data.get('preguntaSelOBJ/'+ $scope.documento  + '/' +id )
                        .then(function (result) {
                            if(result.status) return $scope.preguntas = [{pregunta : 'No hay preguntas/comentarios...'}];
                            for(var i in result){
                                result[i].fecha_crea = moment(result[i].fecha_crea).format('DD/MM/YYYY');
                            }
                            $scope.preguntas = result;

                        });
                }
                //$scope.enviar = function () {
                //    var ruta =  $scope.documento.idO !== ''? 'preguntaAdicionalIn' : 'preguntaPrimeraIn';
                //    var data = {
                //        clave : 'P-' + Date.now(),
                //        tipo : $scope.documento.tipo,
                //        idEvento : $scope.documento.id_evento,
                //        idDoc : $scope.documento.id,
                //        pregunta : $scope.comentario
                //
                //    };
                //    console.log(ruta,data);
                //    //Data.post('preguntaPrimeraIn')
                //    //    .then(function (result) {
                //    //
                //    //    });
                //};
            }
        }
    }]).directive("contenteditable", function() {
        return {
            restrict: "A",
            require: "ngModel",
            link: function(scope, element, attrs, ngModel) {

                function read() {
                    ngModel.$setViewValue(element.html());
                }

                ngModel.$render = function() {
                    element.html(ngModel.$viewValue || "");
                };

                element.bind("blur keyup change", function() {
                    scope.$apply(read);
                });
            }
        };
    });