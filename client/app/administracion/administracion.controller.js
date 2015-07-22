/**
 * Created by josec on 7/4/2015.
 */


angular.module('anApp')
    .controller('AdministracionCtrl',['$scope','Data','$rootScope','$location',
    function ($scope,Data,$rootScope, $location) {
        var id = undefined;
        $rootScope.$watch('opciones', function (newValue, oldValue) {
            if(newValue && newValue !== oldValue){
                if(id == undefined){
                    id = $rootScope.opciones.filter(function (item) {return item.opcion == "Administracion";})[0].idopcion;
                    Data.get('opListaH/'+id)
                        .then(function (result) {
                            console.log(result);
                            for(index in result){
                                if(result[index].nombre == $location.hash()){
                                    result[index].active = true;
                                    break;
                                }
                            }
                            $scope.tabs = result;

                        });
                }
            }
        });
        $scope.tabSeleccionado = function (tab,index) {
            $location.hash(tab);
            $scope.tabActive = tab;
            $scope.tabs[index].active = true;

        };
    }]);