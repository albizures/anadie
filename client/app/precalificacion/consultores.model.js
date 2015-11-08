/**
 * Created by josec on 10/27/2015.
 */


angular.module('anApp')
    .controller('ModalConsultoresCtrl',["$scope", '$modalInstance','Data','utils','licitacion',
        function ($scope,$modalInstance, Data, utils,licitacion) {
            $scope.consultor = {};
            $scope.licitacion = licitacion;
            $scope.newConsultores = [];
            $scope.secretario = false;
            $scope.agregar = function () {
                $scope.consultor.idEvento = licitacion.id;// o idLicitacion
                Data.post('eventoConsultorI',$scope.consultor)
                    .then(function (result) {
                        Data.toast(result);
                        if(result.status === 'success'){
                            $scope.consultor.id = result.data;
                            //$scope.usuarios.splice(index,1);
                            $scope.newConsultores.push($scope.consultor);
                        }
                    });
            };
            function countSecretario(id) {
                Data.get('canSecretarios/' + $scope.licitacion.id + '/' + id)
                    .then(function (result) {
                        console.log(Number(result[0].id));
                        $scope.secretario = Number(result[0].id) > 0;
                    });
            }
            Data.get('userDatos')
                .then(function (results) {
                    if(results.message){
                        Data.toast(results);
                        return;
                    }
                    console.log(results);
                    /*for(index in results){
                        //results[index].nombreCompleto = results[index].nombres + ' ' + results[index].apellidos;
                        results[index] = utils.convertNumber(results[index]);
                    }*/
                    $scope.consultores = results;
                    $scope.consultor.idConsultor =  $scope.consultores[0].id;
                });
            Data.get('ambitoSel')
                .then(function (results) {
                    if(results.message){
                        Data.toast(results);
                        return;
                    }
                    console.log(results);
                    /*for(index in results){
                        //results[index].nombreCompleto = results[index].nombres + ' ' + results[index].apellidos;
                        results[index] = utils.convertNumber(results[index]);
                    }*/
                    $scope.ambitos = results;
                    $scope.consultor.idAmbito = $scope.ambitos[0].id;
                });
            $scope.ok = function () {
                $modalInstance.close($scope.newConsultores);
            };
            $scope.$watch('consultor.idAmbito', function (newValue, oldValue) {
                if(hasVal(newValue) && newValue != oldValue){
                    countSecretario(newValue);
                }
            });
        }]);