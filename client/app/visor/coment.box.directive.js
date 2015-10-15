/**
 * Created by josec on 10/14/2015.
 */

angular.module('anApp')
    .directive('ngComentBox',['Data',function (Data) {
        return {
            template : '<div class="row">' +
                            '<div class="col-lg-12 z-depth-1 box">' +
                                '<div ng-class="pregunta? \'active\' : \'\'" ng-model="pregunta" contenteditable placeholder="" class="textarea form-control" name="" id=""  rows="5"></div>' +
                                '<br><button ng-disabled="!pregunta" ng-click="enviar()" class="btn btn-success btn2 col-lg-12">Enviar</button>' +
                            '</div>'+
                            '<div class="col-lg-12 z-depth-1 coment">Preguntas anteriores:</div>'+
                            '<div class="col-lg-12 z-depth-1 coment" ng-repeat="p in preguntas">' +
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
                'actualizar' : '='
            },
            link : function (scope,element) {
                scope.$watch('offset', function (newValue, oldValue) {
                    if(hasVal(newValue)){
                        element.css('top',newValue + 'px');
                    }
                });
            },
            controller : function ($scope) {
                $scope.$on('actualizarComentario', function() {
                    traerComentarios($scope.id);
                });
                $scope.$watch('id', function (newValue, oldValue) {
                    if(hasVal(newValue) && newValue !== ''){
                        traerComentarios(newValue);
                    }else{
                        $scope.preguntas = [{pregunta : 'No hay preguntas...'}];
                    }
                });
                function traerComentarios (id) {
                    $scope.pregunta = undefined;
                    Data.get('preguntaSelOBJ/'+ $scope.documento  + '/' +id )
                        .then(function (result) {
                            if(result.status) return $scope.preguntas = [{pregunta : 'No hay preguntas...'}];
                            for(var i in result){
                                result[i].fecha_crea = moment(result[i].fecha_cre).format('DD/MM/YYYY');
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