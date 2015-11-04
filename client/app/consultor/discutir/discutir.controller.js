/**
 * Created by josec on 11/2/2015.
 */

angular.module('anApp')
    .controller('DiscutirCtrl',['$modal','$scope','Data','utils','$stateParams',
        function ($modal,$scope,Data,utils,$stateParams) {

            console.log($stateParams);

            Data.get('selPreguntaAmbito/'+ $stateParams.pregunta + '/' + $stateParams.ambito)
                .then(function (result) {
                    if(result.message){
                        Data.toast(result);
                        return;
                    }
                    $scope.pregunta = result[0];
                    traerComentario();
                });
            function traerComentario () {
                Data.get('comentariosAmbito/'+ $stateParams.pregunta + '/' + $stateParams.ambito)
                    .then(function (result) {
                        if(result.message){
                            Data.toast(result);
                            return;
                        }
                        $scope.pregunta.comentarios = result;
                    });
            }

            $scope.comentar = function () {
                Data.post('coments',{idPregunta : $scope.pregunta.id,idAmbito : $scope.pregunta.id_ambito,comentario : $scope.pregunta.newComentario})
                    .then(function (result) {
                        if(result.message){
                            Data.toast(result);
                            traerComentario();
                            return;
                        }
                    });
            };
            $scope.responder = function () {
                var modalResponder = $modal.open({
                    templateUrl : 'responder.modal',
                    controller : 'ModalResponderCtrl',
                    backdrop : 'static',
                    resolve : {
                        pregunta : function () {
                            return $scope.pregunta
                        }
                    }
                });
                modalResponder.result.then(function (ice) {

                });
            }
        }]);