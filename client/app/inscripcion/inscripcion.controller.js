/**
 * Created by josec on 8/30/2015.
 */

angular.module('anApp').controller('InscripcionCtrl',
    ['$scope','Data','$rootScope','ngTableParams','$filter','$modal','utils','FileUploader',
    function ($scope,Data, $rootScope, ngTableParams, $filter , $modal, utils,FileUploader) {
        $scope.filtro = false;
        $scope.$watch('filtro', function (newValue, oldValue) {
            if(newValue !== undefined && newValue !== oldValue){
                if($scope.tableProyectos){
                    $scope.tableProyectos.reload();
                }
            }
        });
        Data.get('proyectoSel')
            .then(function (results) {
                if(results.message){
                    Data.toast(results);
                    return;
                }
                for(index in results){
                    results[index] = utils.convertNumber(results[index]);
                }
                console.log(results);
                $scope.proyectos = results;
                for(index in $scope.proyectos){

                    $scope.proyectos[index].tipo = {
                        codTipo : $scope.proyectos[index].codTipo,
                        id  : $scope.proyectos[index].idTipo,
                        nombreTipo : $scope.proyectos[index].nombreTipo
                    }
                }
                $scope.tableProyectos = new ngTableParams({
                        page : 1,
                        count : 10,
                        sorting : {
                            nombre : 'asc'
                        }
                    },{
                        total : $scope.proyectos.length,
                        filterDelay: 350,
                        getData : function ($defer, params) {
                            var orderedData = params.sorting() ? $filter('orderBy')($scope.proyectos, params.orderBy()) : $scope.proyectos;
                            if($scope.filtro){
                                orderedData = params.filter() ? $filter('filter')(orderedData, params.filter()) : orderedData;
                            }
                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        }
                    }
                );
            });

        $scope.agregar = function () {
            var modalOpciones = $modal.open({
                templateUrl : 'modalProyectos',
                controller : 'ModalProyectosCtrl',
                size : 'lg'
            });
            modalOpciones.result.then(function (proyecto) {
                Data.post('proyectoIn',{'proyecto':proyecto})
                    .then(function (results) {
                        if(results.status === "success"){
                            //debugger;
                            console.log(Number(results.data.id),results.data.id,results.data);
                            proyecto.id = Number(results.data.id);
                            $scope.proyectos.push(proyecto);
                            $scope.tableProyectos.reload();
                        }
                        Data.toast(results);
                    });
            });
        };
        $scope.limpiar = function () {
            $scope.tableProyectos.sorting({});
            $scope.tableProyectos.filter({});
            $scope.filtro = false;
        };
        var currentName = '';
        var currentId;
        var currentDoc;
        $scope.agregarPDF = function (id,doc) {
            currentId = id;
            currentDoc = doc;
            currentName = id+doc;
        };
        $scope.uploader = new FileUploader({
            url: 'server/api/uploadFile'
        });
        $scope.uploader.filters.push({
            name: 'pdf',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                return item.type.indexOf('pdf') != -1;
            }
        });
        $scope.uploader.onAfterAddingFile = function(fileItem) {
            fileItem.alias =  currentName;
            console.info('onAfterAddingFile', fileItem);
            var data = {
                id : currentId,
                nombre : currentDoc
            };
            fileItem.formData.push(data);
            console.log($scope.seledPDf(currentName));
        };
        $scope.subir = function (name) {
            var result = $scope.uploader.queue.filter(function (item) {
                return item.alias == name;
            })[0];
            result.upload();
            console.log(result);
        };
        $scope.seledPDf = function (name) {
            var result = $scope.uploader.queue.filter(function (item) {
                return item.alias == name;
            });
            return result.length != 0;
        };
}]);