/**
 * Created by josec on 10/13/2015.
 */

angular.module('anApp')
    .controller('VisorCtrl',['$scope','$stateParams','Data','$rootScope','$location',function ($scope,$stateParams,Data,$rootScope,$location ) {
        $scope.estado = {};
        $scope.estado.preguntaSel = $location.hash();
        $rootScope.mostrarImg = true;
        if($stateParams.documento === null){
            Data.get('eventoFileSelID/'+ $stateParams.id)
                .then(function (result) {
                    if(result.message){
                        return Data.toast(result);
                    }
                    result[0].ubicacion = result[0].ubicacion + '?' + Date.now();
                    $scope.documento = result[0];
                });
        }else{
            result[0].ubicacionTemp = result[0].ubicacion + '?' + Date.now();
            $scope.documento = $stateParams.documento;
        }
    }]);