/**
 * Created by josec on 10/13/2015.
 */

angular.module('anApp')
    .controller('VisorCtrl',['$scope','$stateParams','Data',function ($scope,$stateParams,Data) {
        $scope.estado = {};
        if($stateParams.documento === null){
            Data.get('eventoFileSelID/'+ $stateParams.id)
                .then(function (result) {
                    if(result.message){
                        return Data.toast(result);
                    }
                    $scope.documento = result[0];
                });
        }else{
            $scope.documento = $stateParams.documento;
        }
    }]);