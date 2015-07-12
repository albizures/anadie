/**
 * Created by josec on 7/4/2015.
 */


angular.module('anApp')
    .controller('AdministracionCtrl',['$scope','Data','$rootScope','ngTableParams','$filter','$modal','utils',
    function ($scope,Data,$rootScope, ngTableParams,$filter,$modal,utils) {
        $rootScope.$watch('opciones', function (newValue, oldValue) {
            if(newValue && newValue !== oldValue){
                var id = $rootScope.opciones.filter(function (item) {return item.opcion == "Administracion";})[0].idopcion;
                Data.get('opListaH/'+id)
                    .then(function (result) {
                        console.log(result);
                        $scope.tabs = result;

                    });
            }
        });
    }]);