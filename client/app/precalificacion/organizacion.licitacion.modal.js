/**
 * Created by josec on 10/11/2015.
 */

angular.module('anApp')
    .controller('ModalOrganizacionLicitacionCtrl',["$scope", '$modalInstance','Data','utils','licitacion',
        function ($scope,$modalInstance, Data, utils,licitacion) {
            $scope.licitacion = licitacion;
            $scope.newOrganizaciones = [];
            $scope.agregar = function () {
                var index = $scope.organizacion;
                $scope.organizacion = $scope.organizaciones[$scope.organizacion];
                $scope.organizacion.idEvento = licitacion.id;// o idLicitacion
                Data.post('eventoUserIn',$scope.organizacion)
                    .then(function (result) {
                        Data.toast(result);
                        if(result.status === 'success'){
                            $scope.organizacion.id = result.data;
                            $scope.organizaciones.splice(index,1);
                            $scope.newOrganizaciones.push($scope.organizacion);
                            $scope.organizacion = 0;
                        }
                    });
            };
            Data.get('orgDatos')
                .then(function (results) {
                    if(results.message){
                        Data.toast(results);
                        return;
                    }
                    console.log(results);
                    for(index in results){
                        //results[index].nombreCompleto = results[index].nombres + ' ' + results[index].apellidos;
                        results[index] = utils.convertNumber(results[index]);
                    }
                    $scope.organizaciones = results;
                    $scope.organizacion = 0;
                });
            $scope.ok = function () {
                $modalInstance.close($scope.newOrganizaciones);
            };
        }]);