/**
 * Created by josec on 11/1/2015.
 */

angular.module('anApp')
    .controller('ModalResponderCtrl',['$scope','Data','utils', '$modalInstance','pregunta',
        function ($scope, Data, utils,$modalInstance,pregunta) {
            $scope.uploading = false;

            $scope.pregunta = pregunta;
            $scope.responder = function () {
                Data.post('respuesta',{id : pregunta.id , respuesta : pregunta.respuesta})
                    .then(function (result) {
                        console.log(result);
                    });
            };
            $scope.ok = function () {
                $modalInstance.close($scope.pregunta);
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }]);